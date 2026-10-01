addEngineeringStage(9, [
  {
    "title": "写入并读取文本文件",
    "task": "把 hello 写入 demo.txt，再读取并输出 hello。",
    "concept": "open() 的写入与读取模式",
    "starter": "# 写入 demo.txt，再读取\n",
    "solution": "with open('demo.txt', 'w', encoding='utf-8') as f:\n    f.write('hello')\nwith open('demo.txt', 'r', encoding='utf-8') as f:\n    print(f.read())",
    "expected": "hello",
    "must": [
      "open"
    ],
    "why": "文件把程序数据保存到运行内存之外；读写时要明确模式和编码。"
  },
  {
    "title": "with 自动关闭文件",
    "task": "使用 with 打开 note.txt 写入 safe，然后读取输出 safe。",
    "concept": "上下文管理器 with",
    "starter": "# 使用 with 管理文件\n",
    "solution": "with open('note.txt', 'w', encoding='utf-8') as f:\n    f.write('safe')\nwith open('note.txt', encoding='utf-8') as f:\n    print(f.read())",
    "expected": "safe",
    "must": [
      "with"
    ],
    "why": "with 会在代码块结束时自动关闭文件，即使中间发生异常也更安全。"
  },
  {
    "title": "追加文件内容",
    "task": "先写入 A，再使用追加模式写入 B，最后输出 AB。",
    "concept": "文件追加模式 a",
    "starter": "# 先写 A，再追加 B\n",
    "solution": "with open('log.txt', 'w') as f:\n    f.write('A')\nwith open('log.txt', 'a') as f:\n    f.write('B')\nwith open('log.txt') as f:\n    print(f.read())",
    "expected": "AB",
    "why": "a 模式从文件末尾继续写，不会像 w 那样清空旧内容。"
  },
  {
    "title": "使用 pathlib 读写",
    "task": "用 Path('x.txt').write_text 写入 python，再 read_text 输出。",
    "concept": "pathlib.Path 高级路径 API",
    "starter": "from pathlib import Path\npath = Path('x.txt')\n# 写入并读取\n",
    "solution": "from pathlib import Path\npath = Path('x.txt')\npath.write_text('python', encoding='utf-8')\nprint(path.read_text(encoding='utf-8'))",
    "expected": "python",
    "must": [
      "Path"
    ],
    "why": "pathlib 用对象表达路径，通常比手工拼接字符串更清晰。"
  },
  {
    "title": "检查文件是否存在",
    "task": "创建 ready.txt，然后用 Path.exists() 输出 True。",
    "concept": "Path.exists()",
    "starter": "from pathlib import Path\npath = Path('ready.txt')\n# 创建并检查\n",
    "solution": "from pathlib import Path\npath = Path('ready.txt')\npath.write_text('ok')\nprint(path.exists())",
    "expected": "True",
    "must": [
      "exists"
    ],
    "why": "执行读取、删除等操作前，常需要检查路径是否存在。"
  },
  {
    "title": "创建目录",
    "task": "创建目录 data，exist_ok=True，然后输出 True。",
    "concept": "Path.mkdir()",
    "starter": "from pathlib import Path\nfolder = Path('data')\n# 创建目录并检查\n",
    "solution": "from pathlib import Path\nfolder = Path('data')\nfolder.mkdir(exist_ok=True)\nprint(folder.is_dir())",
    "expected": "True",
    "must": [
      "mkdir"
    ],
    "why": "mkdir(exist_ok=True) 让重复运行脚本时目录已存在也不会报错。"
  },
  {
    "title": "把字典变成 JSON 字符串",
    "task": "data={'name':'Ada','age':36}，用 json.dumps(sort_keys=True) 输出稳定 JSON。",
    "concept": "json.dumps()",
    "starter": "import json\ndata = {'name': 'Ada', 'age': 36}\n# 序列化\n",
    "solution": "import json\ndata = {'name': 'Ada', 'age': 36}\nprint(json.dumps(data, sort_keys=True))",
    "expected": "{\"age\": 36, \"name\": \"Ada\"}",
    "must": [
      "dumps"
    ],
    "why": "JSON 是接口和配置文件常见的跨语言数据格式；dumps 把 Python 对象序列化成文本。"
  },
  {
    "title": "把 JSON 字符串解析成字典",
    "task": "解析 JSON 字符串并输出其中的 port=8000。",
    "concept": "json.loads()",
    "starter": "import json\ntext = '{\"host\":\"localhost\",\"port\":8000}'\n# 解析并输出 port\n",
    "solution": "import json\ntext = '{\"host\":\"localhost\",\"port\":8000}'\nconfig = json.loads(text)\nprint(config['port'])",
    "expected": "8000",
    "must": [
      "loads"
    ],
    "why": "loads 把 JSON 文本恢复成 Python 字典、列表等对象。"
  },
  {
    "title": "保存并加载 JSON 文件",
    "task": "把 {'enabled':True} 保存到 config.json，再加载并输出 True。",
    "concept": "json.dump() / json.load()",
    "starter": "import json\n# 保存再读取\n",
    "solution": "import json\nwith open('config.json', 'w', encoding='utf-8') as f:\n    json.dump({'enabled': True}, f)\nwith open('config.json', encoding='utf-8') as f:\n    data = json.load(f)\nprint(data['enabled'])",
    "expected": "True",
    "must": [
      "json"
    ],
    "why": "dump/load 直接针对文件对象，适合持久化结构化配置。"
  },
  {
    "title": "写入 CSV",
    "task": "用 csv.writer 写两行 name,score 和 Ada,95，再读取第二行并输出 Ada 95。",
    "concept": "csv.writer / csv.reader",
    "starter": "import csv\n# 写入并读取 CSV\n",
    "solution": "import csv\nwith open('scores.csv', 'w', newline='', encoding='utf-8') as f:\n    w = csv.writer(f)\n    w.writerow(['name', 'score'])\n    w.writerow(['Ada', 95])\nwith open('scores.csv', newline='', encoding='utf-8') as f:\n    rows = list(csv.reader(f))\nprint(rows[1][0], rows[1][1])",
    "expected": "Ada 95",
    "must": [
      "csv"
    ],
    "why": "csv 模块会正确处理分隔符和引用规则，比手工 split 更可靠。"
  },
  {
    "title": "处理 UTF-8 中文文本",
    "task": "写入 你好 到 cn.txt，并以 utf-8 读取后输出。",
    "concept": "文本编码 encoding='utf-8'",
    "starter": "# 明确使用 UTF-8\n",
    "solution": "with open('cn.txt', 'w', encoding='utf-8') as f:\n    f.write('你好')\nwith open('cn.txt', encoding='utf-8') as f:\n    print(f.read())",
    "expected": "你好",
    "must": [
      "utf-8"
    ],
    "why": "显式编码能减少跨系统运行时的乱码和默认编码差异。"
  },
  {
    "title": "配置文件升级器",
    "boss": true,
    "task": "创建 settings.json，初始 {'version':1,'debug':False}；读取后把 version 加1、debug设为True；重新写入；再次读取并输出 version=2 与 debug=True。",
    "concept": "Path、JSON、文件生命周期与结构化更新综合",
    "starter": "import json\nfrom pathlib import Path\npath = Path('settings.json')\n# 创建、读取、修改、保存、验证\n",
    "solution": "import json\nfrom pathlib import Path\npath = Path('settings.json')\npath.write_text(json.dumps({'version': 1, 'debug': False}), encoding='utf-8')\ndata = json.loads(path.read_text(encoding='utf-8'))\ndata['version'] += 1\ndata['debug'] = True\npath.write_text(json.dumps(data), encoding='utf-8')\ncheck = json.loads(path.read_text(encoding='utf-8'))\nprint(f\"version={check['version']}\")\nprint(f\"debug={check['debug']}\")",
    "expected": "version=2\ndebug=True",
    "must": [
      "json",
      "Path"
    ],
    "why": "真实应用经常经历读取旧配置、迁移字段、保存新配置和再次验证的完整生命周期。",
    "bossReview": "你已经能用文件、Path、JSON、CSV 和编码规则把程序数据可靠地保存下来。"
  }
]);
