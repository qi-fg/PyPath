from __future__ import annotations

import argparse
import json
import os
import hashlib
import shutil
import subprocess
import sys
import tempfile
import threading
import time
import urllib.error
import urllib.request
import zipfile
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "user-data"
AI_CONFIG_PATH = DATA_DIR / "ai-config.json"
VERSION_PATH = ROOT / "version.json"
MAX_BODY = 100 * 1024 * 1024
SERVER = None
PORT = None

PRESERVE_NAMES = {
    "user-data",
    "update-config.json",
    "update-status.json",
    ".pypath-server.pid",
    ".pypath-port",
    ".pypath-server.out.log",
    ".pypath-server.err.log",
    ".update-backup",
}


def read_json(path: Path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8-sig"))
    except Exception:
        return default


def write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(path)


def current_version() -> str:
    return str(read_json(VERSION_PATH, {}).get("version", "0.0.0"))


def display_version() -> str:
    meta = read_json(VERSION_PATH, {})
    return str(meta.get("displayVersion") or meta.get("version") or "0.0.0")


def parse_version(value: str):
    parts = []
    for item in str(value).split("."):
        digits = "".join(ch for ch in item if ch.isdigit())
        parts.append(int(digits or 0))
    return tuple((parts + [0, 0, 0])[:3])


def load_update_config():
    return read_json(ROOT / "update-config.json", {
        "autoCheck": True,
        "channel": "stable",
        "manifestUrl": "https://raw.githubusercontent.com/qi-fg/PyPath/main/update-manifest.json",
    })


def fetch_json_url(url: str, timeout: int = 20):
    req = urllib.request.Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": f"PyPath/{current_version()}",
            "Cache-Control": "no-cache",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8-sig"))


def download_bytes(url: str, timeout: int = 120) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": f"PyPath/{current_version()}"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = resp.read(MAX_BODY + 1)
    if len(data) > MAX_BODY:
        raise ValueError("更新包超过允许大小")
    return data


def online_update_info():
    config = load_update_config()
    manifest_url = str(config.get("manifestUrl") or "").strip()
    if not manifest_url:
        raise ValueError("更新地址未配置")
    manifest = fetch_json_url(manifest_url)
    remote_version = str(manifest.get("version") or "").strip()
    download_url = str(manifest.get("downloadUrl") or "").strip()
    if not remote_version or not download_url:
        raise ValueError("在线更新清单无效")
    return manifest


def apply_online_update() -> dict:
    manifest = online_update_info()
    remote_version = str(manifest["version"])
    if parse_version(remote_version) <= parse_version(current_version()):
        return {"updated": False, "version": current_version(), "displayVersion": display_version(), "restartRequired": False}

    package = download_bytes(str(manifest["downloadUrl"]))
    expected = str(manifest.get("sha256") or "").strip().lower()
    if expected:
        actual = hashlib.sha256(package).hexdigest().lower()
        if actual != expected:
            raise ValueError("在线更新包 SHA256 校验失败")

    result = apply_update(package)
    return {"updated": True, **result}


def load_ai_config():
    base = {
        "enabled": False,
        "provider": "自定义兼容接口",
        "endpoint": "",
        "model": "",
        "apiKey": "",
    }
    saved = read_json(AI_CONFIG_PATH, {})
    if isinstance(saved, dict):
        base.update(saved)
    return base


def safe_endpoint(endpoint: str) -> str:
    endpoint = endpoint.strip()
    if endpoint.endswith("/v1"):
        return endpoint.rstrip("/") + "/chat/completions"
    return endpoint


def call_ai(config: dict, payload: dict) -> str:
    endpoint = safe_endpoint(str(config.get("endpoint", "")))
    model = str(config.get("model", "")).strip()
    key = str(config.get("apiKey", "")).strip()
    if not endpoint or not model or not key:
        raise ValueError("AI 配置不完整")

    lesson = payload.get("lesson") or {}
    code = str(payload.get("code", ""))[:12000]
    output = str(payload.get("output", ""))[:8000]
    question = str(payload.get("question", ""))[:3000]
    hint_level = int(payload.get("hintLevel", 0) or 0)

    system = (
        "你是 PyPath 的 Python 初学者导师。用户几乎没有 Python 基础。"
        "请用简短、具体、可执行的中文回答。教学顺序是：先指出观察点，再给小提示，最后才给完整写法。"
        "除非用户明确要求完整答案，或者已经使用到第 3 级提示，否则不要直接贴出整题答案。"
        "解释报错时优先解释控制台最后一行，并只建议一次改一个地方。"
        "不要假装代码已经运行；只依据提供的代码和运行输出。"
    )
    context = (
        f"当前关卡：{lesson.get('title', '')}\n"
        f"任务：{lesson.get('task', '')}\n"
        f"知识点：{lesson.get('conceptText', '')}\n"
        f"当前提示级别：{hint_level}/3\n"
        f"当前代码：\n{code}\n\n"
        f"最近运行结果：\n{output or '(还没有运行)'}\n"
    )
    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": context + "\n用户问题：" + question},
    ]
    body = json.dumps({
        "model": model,
        "messages": messages,
        "temperature": 0.25,
        "stream": False,
    }, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        endpoint,
        data=body,
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "PyPath/2.1",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=35) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:800]
        raise RuntimeError(f"AI 接口返回 HTTP {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"无法连接 AI 接口：{exc.reason}") from exc

    try:
        content = data["choices"][0]["message"]["content"]
    except Exception as exc:
        raise RuntimeError("AI 接口返回格式不是 OpenAI 兼容格式") from exc
    if isinstance(content, list):
        content = "\n".join(str(x.get("text", "")) if isinstance(x, dict) else str(x) for x in content)
    return str(content).strip()


def safe_extract(zf: zipfile.ZipFile, target: Path) -> None:
    base = target.resolve()
    for member in zf.infolist():
        dest = (target / member.filename).resolve()
        try:
            dest.relative_to(base)
        except ValueError:
            raise ValueError("更新包包含不安全路径")
    zf.extractall(target)


def find_payload_root(extract_dir: Path) -> Path:
    if (extract_dir / "index.html").exists() and (extract_dir / "version.json").exists():
        return extract_dir
    candidates = []
    for version_file in extract_dir.rglob("version.json"):
        parent = version_file.parent
        if (parent / "index.html").exists():
            candidates.append(parent)
    if not candidates:
        raise ValueError("这不是有效的 PyPath 更新包")
    return sorted(candidates, key=lambda p: len(p.parts))[0]


def apply_update(zip_bytes: bytes) -> dict:
    backup = ROOT / ".update-backup"
    with tempfile.TemporaryDirectory(prefix="pypath-update-") as tmp:
        tmp_dir = Path(tmp)
        zip_path = tmp_dir / "update.zip"
        extract_dir = tmp_dir / "payload"
        zip_path.write_bytes(zip_bytes)
        extract_dir.mkdir(parents=True, exist_ok=True)
        try:
            with zipfile.ZipFile(zip_path, "r") as zf:
                safe_extract(zf, extract_dir)
        except zipfile.BadZipFile as exc:
            raise ValueError("更新包不是有效 ZIP 文件") from exc

        payload = find_payload_root(extract_dir)
        meta = read_json(payload / "version.json", {})
        package_version = str(meta.get("version", "0.0.0"))
        package_display_version = str(meta.get("displayVersion") or package_version)
        if meta.get("name") != "PyPath":
            raise ValueError("更新包缺少 PyPath 标识")
        if parse_version(package_version) <= parse_version(current_version()):
            raise ValueError(f"更新包版本 V{package_version} 不高于当前版本 V{current_version()}")

        if backup.exists():
            shutil.rmtree(backup, ignore_errors=True)
        backup.mkdir(parents=True, exist_ok=True)

        payload_items = [p for p in payload.iterdir() if p.name not in PRESERVE_NAMES]
        backed_up = []
        try:
            for src in payload_items:
                dst = ROOT / src.name
                if dst.exists():
                    bdst = backup / src.name
                    if dst.is_dir():
                        shutil.copytree(dst, bdst)
                    else:
                        shutil.copy2(dst, bdst)
                    backed_up.append(src.name)

            for src in payload_items:
                dst = ROOT / src.name
                if dst.exists():
                    if dst.is_dir():
                        shutil.rmtree(dst)
                    else:
                        dst.unlink()
                if src.is_dir():
                    shutil.copytree(src, dst)
                else:
                    shutil.copy2(src, dst)
        except Exception:
            for name in backed_up:
                src = backup / name
                dst = ROOT / name
                if dst.exists():
                    if dst.is_dir():
                        shutil.rmtree(dst, ignore_errors=True)
                    else:
                        dst.unlink(missing_ok=True)
                if src.exists():
                    if src.is_dir():
                        shutil.copytree(src, dst)
                    else:
                        shutil.copy2(src, dst)
            raise

    return {"version": package_version, "displayVersion": package_display_version, "restartRequired": True}


def launch_after_exit(port: int):
    server_path = str(ROOT / "server.py")
    python_path = sys.executable
    helper = (
        "import subprocess,sys,time,os; "
        "time.sleep(1.2); "
        "kwargs={}; "
        "kwargs.update({'creationflags':0x08000000}) if os.name=='nt' else None; "
        "subprocess.Popen([sys.argv[1],sys.argv[2],'--port',sys.argv[3]], cwd=os.path.dirname(sys.argv[2]), **kwargs)"
    )
    flags = 0x08000000 if os.name == "nt" else 0
    subprocess.Popen(
        [python_path, "-c", helper, python_path, server_path, str(port)],
        cwd=str(ROOT),
        creationflags=flags,
    )


def schedule_restart():
    def worker():
        time.sleep(0.4)
        launch_after_exit(int(PORT))
        time.sleep(0.1)
        if SERVER:
            SERVER.shutdown()
    threading.Thread(target=worker, daemon=True).start()


class Handler(SimpleHTTPRequestHandler):
    server_version = "PyPathLocal/2.1"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt, *args):
        sys.stdout.write("%s - - [%s] %s\n" % (self.address_string(), self.log_date_time_string(), fmt % args))

    def end_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        if self.path.endswith((".html", ".js", ".css", ".json")) or self.path == "/":
            self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _is_local(self):
        return self.client_address[0] in {"127.0.0.1", "::1"}

    def _send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_body(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if length <= 0:
            return b""
        if length > MAX_BODY:
            raise ValueError("请求内容过大")
        return self.rfile.read(length)

    def _read_json(self):
        ctype = self.headers.get("Content-Type", "")
        if "application/json" not in ctype:
            raise ValueError("只接受 application/json")
        raw = self._read_body()
        return json.loads(raw.decode("utf-8")) if raw else {}

    def do_GET(self):
        if not self._is_local():
            self.send_error(HTTPStatus.FORBIDDEN)
            return
        parsed = urlparse(self.path)
        path = parsed.path
        if path == "/api/status":
            cfg = load_ai_config()
            startup_update = read_json(ROOT / "update-status.json", {})
            self._send_json({
                "ok": True,
                "version": current_version(),
                "displayVersion": display_version(),
                "ai": {
                    "enabled": bool(cfg.get("enabled")),
                    "configured": bool(cfg.get("endpoint") and cfg.get("model") and cfg.get("apiKey")),
                    "provider": cfg.get("provider", ""),
                    "model": cfg.get("model", ""),
                },
                "startupUpdate": startup_update if isinstance(startup_update, dict) else {},
            })
            return
        if path == "/api/ai/config":
            cfg = load_ai_config()
            self._send_json({
                "enabled": bool(cfg.get("enabled")),
                "provider": cfg.get("provider", ""),
                "endpoint": cfg.get("endpoint", ""),
                "model": cfg.get("model", ""),
                "hasKey": bool(cfg.get("apiKey")),
            })
            return
        parts = [p for p in path.split("/") if p]
        if parts and (parts[0].startswith(".") or parts[0] == "user-data"):
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        super().do_GET()

    def do_POST(self):
        if not self._is_local():
            self.send_error(HTTPStatus.FORBIDDEN)
            return
        path = urlparse(self.path).path
        try:
            if path == "/api/ai/config":
                data = self._read_json()
                existing = load_ai_config()
                next_cfg = {
                    "enabled": bool(data.get("enabled", False)),
                    "provider": str(data.get("provider", existing.get("provider", "自定义兼容接口")))[:80],
                    "endpoint": str(data.get("endpoint", existing.get("endpoint", ""))).strip()[:2000],
                    "model": str(data.get("model", existing.get("model", ""))).strip()[:200],
                    "apiKey": existing.get("apiKey", ""),
                }
                if "apiKey" in data:
                    incoming = str(data.get("apiKey", "")).strip()
                    if incoming:
                        next_cfg["apiKey"] = incoming[:8000]
                    elif data.get("clearKey"):
                        next_cfg["apiKey"] = ""
                write_json(AI_CONFIG_PATH, next_cfg)
                self._send_json({"ok": True, "hasKey": bool(next_cfg["apiKey"])})
                return

            if path == "/api/ai/chat":
                cfg = load_ai_config()
                if not cfg.get("enabled"):
                    self._send_json({"ok": False, "error": "AI 模式尚未启用"}, 400)
                    return
                if not (cfg.get("endpoint") and cfg.get("model") and cfg.get("apiKey")):
                    self._send_json({"ok": False, "error": "AI 配置不完整"}, 400)
                    return
                data = self._read_json()
                answer = call_ai(cfg, data)
                self._send_json({"ok": True, "answer": answer})
                return

            if path == "/api/update/apply":
                ctype = self.headers.get("Content-Type", "")
                if "application/zip" not in ctype and "application/octet-stream" not in ctype:
                    raise ValueError("请选择 ZIP 更新包")
                result = apply_update(self._read_body())
                self._send_json({"ok": True, **result})
                return

            if path == "/api/update/online":
                result = apply_online_update()
                self._send_json({"ok": True, **result})
                return

            if path == "/api/restart":
                self._send_json({"ok": True, "message": "restarting"})
                schedule_restart()
                return

            self.send_error(HTTPStatus.NOT_FOUND)
        except Exception as exc:
            self._send_json({"ok": False, "error": str(exc)}, 500)


def main():
    global SERVER, PORT
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    PORT = args.port
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    try:
        (ROOT / ".pypath-server.pid").write_text(str(os.getpid()), encoding="ascii")
        (ROOT / ".pypath-port").write_text(str(PORT), encoding="ascii")
    except Exception:
        pass
    SERVER = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    SERVER.daemon_threads = True
    try:
        SERVER.serve_forever(poll_interval=0.3)
    finally:
        SERVER.server_close()


if __name__ == "__main__":
    main()
