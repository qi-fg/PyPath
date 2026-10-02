addEngineeringStage(17, [
  {
    "title": "读取环境变量默认值",
    "task": "删除 APP_MODE（若存在），用 os.getenv('APP_MODE','dev') 输出 dev。",
    "concept": "os.getenv 与默认配置",
    "starter": "import os\nos.environ.pop('APP_MODE', None)\n# 读取默认值\n",
    "solution": "import os\nos.environ.pop('APP_MODE', None)\n# 读取默认值\n\nprint(os.getenv('APP_MODE', 'dev'))",
    "expected": "dev",
    "must": [
      "getenv"
    ],
    "why": "环境变量让部署环境覆盖配置，而代码仍可以提供安全默认值。"
  },
  {
    "title": "读取设置后的环境变量",
    "task": "设置 APP_MODE=prod，再通过 getenv 输出 prod。",
    "concept": "os.environ 与运行环境",
    "starter": "import os\n# 设置并读取 APP_MODE\n",
    "solution": "import os\n# 设置并读取 APP_MODE\n\nos.environ['APP_MODE'] = 'prod'\nprint(os.getenv('APP_MODE'))",
    "expected": "prod",
    "why": "环境变量是容器、CI/CD 和服务器部署中常用的配置入口。"
  },
  {
    "title": "合并默认配置与覆盖配置",
    "task": "defaults={'host':'127.0.0.1','port':8000}、override={'port':9000}。合并成新字典 config（override 优先），不能修改 defaults。先输出 config['port'] 的 9000，再输出 defaults['port'] 的 8000，每项一行。",
    "concept": "配置分层与字典解包",
    "starter": "defaults = {'host': '127.0.0.1', 'port': 8000}\noverride = {'port': 9000}\n# 创建新配置\n",
    "solution": "defaults = {'host': '127.0.0.1', 'port': 8000}\noverride = {'port': 9000}\n# 创建新配置\n\nconfig = {**defaults, **override}\nprint(config['port'])\nprint(defaults['port'])",
    "expected": "9000\n8000",
    "why": "分层配置通常遵循“默认值 < 环境覆盖”，并尽量避免意外修改原默认配置。"
  },
  {
    "title": "验证必需配置",
    "task": "config={'host':'localhost'}，缺少 api_key 时输出 missing api_key。",
    "concept": "启动时配置校验",
    "starter": "config = {'host': 'localhost'}\n# 检查 api_key\n",
    "solution": "config = {'host': 'localhost'}\n# 检查 api_key\n\nif not config.get('api_key'):\n    print('missing api_key')",
    "expected": "missing api_key",
    "why": "关键配置应该在程序启动阶段尽早验证，而不是运行到深处才报错。"
  },
  {
    "title": "理解日志级别",
    "task": "使用 logging.getLevelName(logging.WARNING) 输出 WARNING。",
    "concept": "DEBUG / INFO / WARNING / ERROR 日志级别",
    "starter": "import logging\n# 输出 WARNING 的名称\n",
    "solution": "import logging\nprint(logging.getLevelName(logging.WARNING))",
    "expected": "WARNING",
    "must": [
      "logging"
    ],
    "why": "日志级别帮助在不同环境控制信息量，并区分正常信息与异常情况。"
  },
  {
    "title": "构造结构化日志字段",
    "task": "event={'level':'INFO','action':'login','user':'Ada'}，稳定输出 INFO login Ada。",
    "concept": "结构化日志比自由文本更易检索",
    "starter": "event = {'level': 'INFO', 'action': 'login', 'user': 'Ada'}\n# 输出结构化字段\n",
    "solution": "event = {'level': 'INFO', 'action': 'login', 'user': 'Ada'}\n# 输出结构化字段\n\nprint(event['level'], event['action'], event['user'])",
    "expected": "INFO login Ada",
    "why": "日志包含固定字段后，更容易由日志平台过滤、聚合和告警。"
  },
  {
    "title": "日志中隐藏密钥",
    "task": "key='secret-abcdef'，输出 secret-***。",
    "concept": "敏感配置脱敏",
    "starter": "key = 'secret-abcdef'\n# 安全显示\n",
    "solution": "key = 'secret-abcdef'\n# 安全显示\n\nprint(key.split('-')[0] + '-***')",
    "expected": "secret-***",
    "why": "日志和错误信息不应该泄露 API Key、Token、密码等敏感配置。"
  },
  {
    "title": "使用 dataclass 表达配置",
    "task": "定义 Settings(host='localhost',port=8000)，创建后输出 localhost:8000。",
    "concept": "配置对象与类型提示",
    "starter": "from dataclasses import dataclass\n# 定义 Settings\n",
    "solution": "from dataclasses import dataclass\n\n@dataclass\nclass Settings:\n    host: str = 'localhost'\n    port: int = 8000\n\ns = Settings()\nprint(f'{s.host}:{s.port}')",
    "expected": "localhost:8000",
    "why": "把配置转成明确的数据对象，比到处传裸字典更容易维护和检查。"
  },
  {
    "title": "定义配置优先级",
    "task": "给定 default='dev'、env='prod'、cli=None。按 CLI > ENV > default 选择 mode：只把 None 视为未提供，其他值（包括空字符串）都应保留。输出 prod。",
    "concept": "配置来源优先级",
    "starter": "default = 'dev'\nenv = 'prod'\ncli = None\n# 选择最终 mode\n",
    "solution": "default = 'dev'\nenv = 'prod'\ncli = None\nmode = cli if cli is not None else (env if env is not None else default)\nprint(mode)",
    "expected": "prod",
    "why": "优先级判断要区分未提供（None）与已经提供的假值。or 会把空字符串也当成缺失，不适用于本题规则。"
  },
  {
    "title": "实现功能开关",
    "task": "flags={'new_ui':False}，根据开关输出 old。",
    "concept": "feature flag 功能开关",
    "starter": "flags = {'new_ui': False}\n# 根据开关选择输出\n",
    "solution": "flags = {'new_ui': False}\n# 根据开关选择输出\n\nprint('new' if flags.get('new_ui', False) else 'old')",
    "expected": "old",
    "why": "功能开关让代码上线与功能启用解耦，便于灰度和快速回滚。"
  },
  {
    "title": "缺少关键环境变量时失败",
    "task": "确保 DB_URL 不存在；读取时若缺失 raise RuntimeError，并捕获输出 config error。",
    "concept": "fail fast 快速失败",
    "starter": "import os\nos.environ.pop('DB_URL', None)\n# 缺失时抛错并捕获\n",
    "solution": "import os\nos.environ.pop('DB_URL', None)\n# 缺失时抛错并捕获\n\ntry:\n    value = os.getenv('DB_URL')\n    if not value:\n        raise RuntimeError('missing DB_URL')\nexcept RuntimeError:\n    print('config error')",
    "expected": "config error",
    "must": [
      "raise"
    ],
    "why": "关键配置缺失时应尽早明确失败，而不是让程序带着错误状态继续运行。"
  },
  {
    "title": "应用配置加载器",
    "boss": true,
    "task": "实现 load_settings(env,cli)：默认 host=localhost、port=8000、debug=False；env 中 APP_PORT 覆盖 port；cli 中非None值最后覆盖。给 env={'APP_PORT':'9000'}、cli={'debug':True}，输出 localhost 9000 True。",
    "concept": "默认值、环境变量、CLI 覆盖、类型转换与配置对象综合",
    "starter": "from dataclasses import dataclass\n\n@dataclass\nclass Settings:\n    host: str\n    port: int\n    debug: bool\n\ndef load_settings(env, cli):\n    pass\n\ns = load_settings({'APP_PORT': '9000'}, {'debug': True})\nprint(s.host, s.port, s.debug)\n",
    "solution": "from dataclasses import dataclass\n\n@dataclass\nclass Settings:\n    host: str\n    port: int\n    debug: bool\n\ndef load_settings(env, cli):\n    data = {'host': 'localhost', 'port': 8000, 'debug': False}\n    if env.get('APP_PORT'):\n        data['port'] = int(env['APP_PORT'])\n    for key, value in cli.items():\n        if value is not None:\n            data[key] = value\n    return Settings(**data)\n\ns = load_settings({'APP_PORT': '9000'}, {'debug': True})\nprint(s.host, s.port, s.debug)",
    "expected": "localhost 9000 True",
    "must": [
      "dataclass",
      "int"
    ],
    "why": "成熟应用会把多来源配置统一加载、转换和验证后，再提供给业务层使用。",
    "bossReview": "你已经理解环境变量、配置优先级、功能开关、日志级别、敏感信息和 fail-fast 配置设计。"
  }
]);
