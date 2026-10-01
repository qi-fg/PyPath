addEngineeringStage(6, [
  {
    "title": "按键读取字典",
    "task": "user={'name':'Ada','role':'admin'}，输出 Ada。",
    "concept": "dict 使用键读取值",
    "starter": "user = {'name': 'Ada', 'role': 'admin'}\n# 输出 name\n",
    "solution": "print(user['name'])",
    "expected": "Ada",
    "must": [
      "["
    ],
    "why": "字典不是按位置取值，而是用有含义的键访问数据。"
  },
  {
    "title": "用 get 提供默认值",
    "task": "config={'mode':'dev'}，读取不存在的 port，默认 8000，并输出 8000。",
    "concept": "dict.get(key, default)",
    "starter": "config = {'mode': 'dev'}\n# 安全读取 port\n",
    "solution": "print(config.get('port', 8000))",
    "expected": "8000",
    "must": [
      "get"
    ],
    "why": "get 可以在键不存在时返回默认值，避免简单读取触发 KeyError。"
  },
  {
    "title": "新增和修改字段",
    "task": "user={'name':'Ada'}，加入 active=True，再输出 True。",
    "concept": "字典通过赋值新增或更新键",
    "starter": "user = {'name': 'Ada'}\n# 增加 active\n\nprint(user['active'])\n",
    "solution": "user = {'name': 'Ada'}\nuser['active'] = True\nprint(user['active'])",
    "expected": "True",
    "why": "对一个键赋值时，键不存在就新增，存在就覆盖更新。"
  },
  {
    "title": "遍历所有键",
    "task": "data={'b':2,'a':1}，按字母排序后逐行输出 a、b。",
    "concept": "dict.keys() 与 sorted()",
    "starter": "data = {'b': 2, 'a': 1}\n# 按顺序输出键\n",
    "solution": "for key in sorted(data.keys()):\n    print(key)",
    "expected": "a\nb",
    "must": [
      "keys",
      "sorted"
    ],
    "why": "字典键可以作为视图遍历；需要稳定输出时应显式排序。"
  },
  {
    "title": "同时遍历键和值",
    "task": "metrics={'ok':3,'fail':1}，输出 ok 3 和 fail 1。",
    "concept": "dict.items()",
    "starter": "metrics = {'ok': 3, 'fail': 1}\n# 遍历键和值\n",
    "solution": "for key, value in metrics.items():\n    print(key, value)",
    "expected": "ok 3\nfail 1",
    "must": [
      "items"
    ],
    "why": "items() 每轮提供键和值，避免再次通过键查找。"
  },
  {
    "title": "读取嵌套字典",
    "task": "user={'profile':{'city':'Tokyo'}}，输出 Tokyo。",
    "concept": "嵌套字典逐层访问",
    "starter": "user = {'profile': {'city': 'Tokyo'}}\n# 输出城市\n",
    "solution": "print(user['profile']['city'])",
    "expected": "Tokyo",
    "why": "嵌套结构需要从外层键逐层进入内层对象。"
  },
  {
    "title": "处理字典列表",
    "task": "users=[{'name':'A'},{'name':'B'}]，逐行输出 A、B。",
    "concept": "列表中保存结构化字典",
    "starter": "users = [{'name': 'A'}, {'name': 'B'}]\n# 遍历输出 name\n",
    "solution": "for user in users:\n    print(user['name'])",
    "expected": "A\nB",
    "must": [
      "for"
    ],
    "why": "真实接口和数据库查询结果经常表现为“字典列表”。"
  },
  {
    "title": "统计词频",
    "task": "words=['api','db','api','cache','api']，构造 counts 字典并输出 api 的次数 3。",
    "concept": "使用字典做频率统计",
    "starter": "words = ['api', 'db', 'api', 'cache', 'api']\ncounts = {}\n# 统计频率\n\nprint(counts['api'])\n",
    "solution": "words = ['api', 'db', 'api', 'cache', 'api']\ncounts = {}\nfor word in words:\n    counts[word] = counts.get(word, 0) + 1\nprint(counts['api'])",
    "expected": "3",
    "must": [
      "get",
      "for"
    ],
    "why": "频率表的模式是读取旧计数，不存在时从 0 开始，再加 1。"
  },
  {
    "title": "字典推导式",
    "task": "把 nums=[1,2,3] 变成 {1:1,2:4,3:9}，并输出该字典。",
    "concept": "dict comprehension",
    "starter": "nums = [1, 2, 3]\n# 创建平方映射\n",
    "solution": "squares = {n: n * n for n in nums}\nprint(squares)",
    "expected": "{1: 1, 2: 4, 3: 9}",
    "must": [
      "for"
    ],
    "why": "字典推导式适合从一组数据直接构造键值映射。"
  },
  {
    "title": "合并配置",
    "task": "base={'host':'localhost','port':8000}，override={'port':9000}。使用 update 合并后输出 9000。",
    "concept": "dict.update() 覆盖同名键",
    "starter": "base = {'host': 'localhost', 'port': 8000}\noverride = {'port': 9000}\n# 合并配置\n\nprint(base['port'])\n",
    "solution": "base.update(override)\nprint(base['port'])",
    "expected": "9000",
    "must": [
      "update"
    ],
    "why": "配置覆盖的常见规则是后来的同名键替换旧值。"
  },
  {
    "title": "修复 KeyError",
    "task": "下面代码访问缺失字段 nickname 会报错。改成安全读取，并输出 anonymous。",
    "concept": "缺失键与默认值",
    "starter": "user = {'name': 'Ada'}\nprint(user['nickname'])\n",
    "solution": "user = {'name': 'Ada'}\nprint(user.get('nickname', 'anonymous'))",
    "expected": "anonymous",
    "must": [
      "get"
    ],
    "why": "不是所有外部数据都保证字段齐全，读取可选字段要设计默认行为。"
  },
  {
    "title": "用户数据汇总器",
    "boss": true,
    "task": "给定 users 三个字典。统计 active=True 的人数，并按 role 统计数量。输出 active=2、admin=1、editor=2。",
    "concept": "字典列表、条件、频率统计与安全读取综合",
    "starter": "users = [\n    {'name': 'A', 'role': 'admin', 'active': True},\n    {'name': 'B', 'role': 'editor', 'active': False},\n    {'name': 'C', 'role': 'editor', 'active': True}\n]\nactive = 0\nroles = {}\n# 完成统计\n\nprint(f'active={active}')\nprint(f\"admin={roles.get('admin', 0)}\")\nprint(f\"editor={roles.get('editor', 0)}\")\n",
    "solution": "active = 0\nroles = {}\nfor user in users:\n    if user['active']:\n        active += 1\n    role = user['role']\n    roles[role] = roles.get(role, 0) + 1\nprint(f'active={active}')\nprint(f\"admin={roles.get('admin', 0)}\")\nprint(f\"editor={roles.get('editor', 0)}\")",
    "expected": "active=2\nadmin=1\neditor=2",
    "must": [
      "for",
      "get"
    ],
    "why": "工程数据通常是多条结构化记录，需要同时做筛选和分类聚合。",
    "bossReview": "你已经能处理嵌套字典、字典列表、缺失字段与频率统计，这些都是 API 与业务数据的核心形态。"
  }
]);
