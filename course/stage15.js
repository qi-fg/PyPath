addEngineeringStage(15, [
  {
    "title": "理解状态码",
    "task": "response={'status':200}，状态码在200-299时输出 success。",
    "concept": "HTTP 2xx 表示成功响应",
    "starter": "response = {'status': 200}\n# 判断是否成功\n",
    "solution": "if 200 <= response['status'] < 300:\n    print('success')",
    "expected": "success",
    "why": "HTTP 客户端不能只看响应体，还要先判断状态码是否表示成功。"
  },
  {
    "title": "解析 JSON 响应",
    "task": "response_text='{\"name\":\"Ada\"}'，json.loads 后输出 Ada。",
    "concept": "API 响应 JSON 解码",
    "starter": "import json\nresponse_text = '{\"name\":\"Ada\"}'\n# 解析\n",
    "solution": "data = json.loads(response_text)\nprint(data['name'])",
    "expected": "Ada",
    "must": [
      "loads"
    ],
    "why": "API 常用 JSON 传递结构化数据，客户端需要先解析再按字段使用。"
  },
  {
    "title": "构造查询参数",
    "task": "用 urllib.parse.urlencode 把 {'page':2,'q':'python'} 编码，输出 page=2&q=python。",
    "concept": "URL query 参数编码",
    "starter": "from urllib.parse import urlencode\nparams = {'page': 2, 'q': 'python'}\n# 编码\n",
    "solution": "print(urlencode(params))",
    "expected": "page=2&q=python",
    "must": [
      "urlencode"
    ],
    "why": "查询参数需要正确 URL 编码，不能直接手工拼接任意用户文本。"
  },
  {
    "title": "构造请求头",
    "task": "创建 headers，包含 Authorization='Bearer token' 和 Accept='application/json'，输出 application/json。",
    "concept": "HTTP headers",
    "starter": "# 构造请求头字典\n",
    "solution": "headers = {'Authorization': 'Bearer token', 'Accept': 'application/json'}\nprint(headers['Accept'])",
    "expected": "application/json",
    "why": "请求头承载认证、内容协商等协议元数据，应与业务数据分离。"
  },
  {
    "title": "序列化请求体",
    "task": "payload={'title':'task','done':False}，json.dumps(sort_keys=True) 输出稳定 JSON。",
    "concept": "JSON request body",
    "starter": "import json\npayload = {'title': 'task', 'done': False}\n# 序列化\n",
    "solution": "print(json.dumps(payload, sort_keys=True))",
    "expected": "{\"done\": false, \"title\": \"task\"}",
    "must": [
      "dumps"
    ],
    "why": "发送 JSON 前要把 Python 对象序列化成协议文本。"
  },
  {
    "title": "处理列表响应",
    "task": "data={'items':[{'id':1},{'id':2}]}，逐行输出1、2。",
    "concept": "API 常见 items 列表结构",
    "starter": "data = {'items': [{'id': 1}, {'id': 2}]}\n# 遍历 items\n",
    "solution": "for item in data['items']:\n    print(item['id'])",
    "expected": "1\n2",
    "why": "接口响应常把多条资源放在数组字段中，客户端再逐条处理。"
  },
  {
    "title": "处理 404",
    "task": "response={'status':404,'json':{'error':'not found'}}，非200时输出 not found。",
    "concept": "错误响应与错误字段",
    "starter": "response = {'status': 404, 'json': {'error': 'not found'}}\n# 处理错误\n",
    "solution": "if response['status'] != 200:\n    print(response['json'].get('error', 'unknown'))",
    "expected": "not found",
    "why": "错误路径要有稳定的解析和降级逻辑，不能假设所有响应都成功。"
  },
  {
    "title": "处理分页",
    "task": "pages=[[1,2],[3],[4,5]]，模拟逐页请求，把所有数据收集后输出 [1, 2, 3, 4, 5]。",
    "concept": "pagination 分页聚合",
    "starter": "pages = [[1, 2], [3], [4, 5]]\nall_items = []\n# 模拟逐页收集\n",
    "solution": "for page in pages:\n    all_items.extend(page)\nprint(all_items)",
    "expected": "[1, 2, 3, 4, 5]",
    "why": "真实 API 往往分页返回结果，客户端需要循环请求并合并页面数据。"
  },
  {
    "title": "不要打印完整 Token",
    "task": "token='sk-secret-123456'，只输出前3位加 ***，目标 sk-***。",
    "concept": "敏感信息日志脱敏",
    "starter": "token = 'sk-secret-123456'\n# 脱敏输出\n",
    "solution": "print(token[:3] + '***')",
    "expected": "sk-***",
    "why": "认证凭据不应进入日志或错误页面，调试信息也必须脱敏。"
  },
  {
    "title": "实现简单重试",
    "task": "results=[False,False,True]，按顺序尝试，成功时输出 attempts=3 并停止。",
    "concept": "retry 重试与 break",
    "starter": "results = [False, False, True]\nattempts = 0\n# 模拟请求重试\n",
    "solution": "for ok in results:\n    attempts += 1\n    if ok:\n        break\nprint(f'attempts={attempts}')",
    "expected": "attempts=3",
    "why": "临时网络失败可以有限重试，但必须有次数上限并在成功后停止。"
  },
  {
    "title": "修复缺失字段假设",
    "task": "response={'user':{}}，安全读取 nickname，缺失时输出 anonymous。",
    "concept": "不信任外部 API 数据结构",
    "starter": "response = {'user': {}}\nprint(response['user']['nickname'])\n",
    "solution": "response = {'user': {}}\nprint(response.get('user', {}).get('nickname', 'anonymous'))",
    "expected": "anonymous",
    "why": "外部接口字段可能缺失、变化或为空，客户端需要防御性读取。"
  },
  {
    "title": "可测试 API 客户端",
    "boss": true,
    "task": "实现 get_user(fetcher,user_id)：调用 fetcher(user_id)；200 返回 name，404 返回 None，其他状态 raise RuntimeError。用提供的 fake_fetch 测试1和2，输出 Ada、missing。",
    "concept": "依赖注入、状态码分支与可测试 API 客户端综合",
    "starter": "def fake_fetch(user_id):\n    if user_id == 1:\n        return {'status': 200, 'json': {'name': 'Ada'}}\n    return {'status': 404, 'json': {'error': 'not found'}}\n\ndef get_user(fetcher, user_id):\n    pass\n\nprint(get_user(fake_fetch, 1))\nprint(get_user(fake_fetch, 2) or 'missing')\n",
    "solution": "def get_user(fetcher, user_id):\n    response = fetcher(user_id)\n    if response['status'] == 200:\n        return response['json']['name']\n    if response['status'] == 404:\n        return None\n    raise RuntimeError('request failed')\n\nprint(get_user(fake_fetch, 1))\nprint(get_user(fake_fetch, 2) or 'missing')",
    "expected": "Ada\nmissing",
    "must": [
      "def",
      "status"
    ],
    "why": "把网络请求函数作为依赖传入，就能用 fake 实现稳定测试，而不用每次真的联网。",
    "bossReview": "你已经理解 HTTP 状态码、JSON、查询参数、请求头、分页、重试、敏感信息和可测试客户端设计。"
  }
]);
