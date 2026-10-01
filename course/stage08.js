addEngineeringStage(8, [
  {
    "title": "修复 SyntaxError",
    "task": "修复缺少右括号的代码，让它输出 hello。",
    "concept": "SyntaxError 与语法结构",
    "starter": "print('hello'\n",
    "solution": "print('hello')",
    "expected": "hello",
    "why": "语法错误意味着 Python 连程序结构都无法正确解析，要先看报错位置附近的符号是否配对。"
  },
  {
    "title": "修复 NameError",
    "task": "下面代码变量名拼写不一致。修复后输出 Ada。",
    "concept": "NameError 与变量命名",
    "starter": "username = 'Ada'\nprint(user_name)\n",
    "solution": "username = 'Ada'\nprint(username)",
    "expected": "Ada",
    "why": "NameError 常见原因是变量未定义或拼写、大小写不一致。"
  },
  {
    "title": "修复 TypeError",
    "task": "age='20'，让 age + 1 正常输出 21。",
    "concept": "TypeError 与类型转换",
    "starter": "age = '20'\nprint(age + 1)\n",
    "solution": "age = '20'\nprint(int(age) + 1)",
    "expected": "21",
    "why": "字符串和整数不能直接做数值加法，先把数据转换成正确类型。"
  },
  {
    "title": "修复 IndexError",
    "task": "items=['a','b','c']，修复 range(4) 越界，让它输出 a、b、c。",
    "concept": "IndexError 与序列边界",
    "starter": "items = ['a', 'b', 'c']\nfor i in range(4):\n    print(items[i])\n",
    "solution": "items = ['a', 'b', 'c']\nfor i in range(len(items)):\n    print(items[i])",
    "expected": "a\nb\nc",
    "why": "长度为3的列表有效下标只有0、1、2，循环边界要来自实际数据。"
  },
  {
    "title": "修复 KeyError",
    "task": "user={'name':'Ada'}，安全读取 role，缺失时输出 guest。",
    "concept": "KeyError 与可选字段",
    "starter": "user = {'name': 'Ada'}\nprint(user['role'])\n",
    "solution": "user = {'name': 'Ada'}\nprint(user.get('role', 'guest'))",
    "expected": "guest",
    "why": "外部结构化数据可能缺少可选键，使用 get 能显式定义默认行为。"
  },
  {
    "title": "捕获 ValueError",
    "task": "尝试 int('abc')，捕获 ValueError 并输出 invalid。",
    "concept": "try / except",
    "starter": "# 捕获转换错误\n",
    "solution": "try:\n    int('abc')\nexcept ValueError:\n    print('invalid')",
    "expected": "invalid",
    "must": [
      "try",
      "except"
    ],
    "why": "异常处理让预期的错误路径变成程序流程的一部分，而不是直接崩溃。"
  },
  {
    "title": "try 的 else 分支",
    "task": "int('42') 成功时在 else 中输出 ok。",
    "concept": "try / except / else",
    "starter": "# 转换成功后在 else 输出 ok\n",
    "solution": "try:\n    value = int('42')\nexcept ValueError:\n    print('invalid')\nelse:\n    print('ok')",
    "expected": "ok",
    "must": [
      "else"
    ],
    "why": "else 只在 try 没有异常时执行，适合放成功路径。"
  },
  {
    "title": "finally 总会执行",
    "task": "在 try 中输出 work，在 finally 中输出 cleanup。",
    "concept": "finally 清理逻辑",
    "starter": "# 使用 try / finally\n",
    "solution": "try:\n    print('work')\nfinally:\n    print('cleanup')",
    "expected": "work\ncleanup",
    "must": [
      "finally"
    ],
    "why": "finally 无论是否发生异常都会执行，适合释放资源或收尾。"
  },
  {
    "title": "主动 raise 异常",
    "task": "定义 validate(n)，n<0 时 raise ValueError；调用 validate(-1) 并捕获后输出 bad。",
    "concept": "raise 主动表达非法状态",
    "starter": "def validate(n):\n    pass\n\ntry:\n    validate(-1)\nexcept ValueError:\n    print('bad')\n",
    "solution": "def validate(n):\n    if n < 0:\n        raise ValueError('negative')\n\ntry:\n    validate(-1)\nexcept ValueError:\n    print('bad')",
    "expected": "bad",
    "must": [
      "raise"
    ],
    "why": "当函数无法接受某种输入时，raise 可以把错误明确交给调用方处理。"
  },
  {
    "title": "用 assert 检查不变量",
    "task": "x=5，使用 assert x>0，然后输出 valid。",
    "concept": "assert 开发期不变量检查",
    "starter": "x = 5\n# 断言 x 为正数\n\nprint('valid')\n",
    "solution": "x = 5\nassert x > 0\nprint('valid')",
    "expected": "valid",
    "must": [
      "assert"
    ],
    "why": "assert 适合表达开发者认为必然成立的内部条件，不应代替用户输入校验。"
  },
  {
    "title": "一次只修一个问题",
    "task": "代码有两个问题：拼写错误和类型错误。修复后输出 21。",
    "concept": "按 traceback 从最先阻塞的问题开始调试",
    "starter": "age = '20'\nprint(agge + 1)\n",
    "solution": "age = '20'\nprint(int(age) + 1)",
    "expected": "21",
    "why": "调试应先解决当前 traceback 指向的第一处阻塞错误，再重新运行暴露下一层问题。"
  },
  {
    "title": "修复订单处理器",
    "boss": true,
    "task": "实现 parse_quantity(text)：去空格后转整数；空字符串、非数字、<=0 都返回 None。依次测试 ' 3 '、'abc'、'0'，输出 3、invalid、invalid。",
    "concept": "输入清洗、异常捕获、边界校验与清晰返回值综合",
    "starter": "def parse_quantity(text):\n    pass\n\nfor raw in [' 3 ', 'abc', '0']:\n    result = parse_quantity(raw)\n    print(result if result is not None else 'invalid')\n",
    "solution": "def parse_quantity(text):\n    text = text.strip()\n    try:\n        value = int(text)\n    except ValueError:\n        return None\n    if value <= 0:\n        return None\n    return value\n\nfor raw in [' 3 ', 'abc', '0']:\n    result = parse_quantity(raw)\n    print(result if result is not None else 'invalid')",
    "expected": "3\ninvalid\ninvalid",
    "must": [
      "try",
      "except",
      "return"
    ],
    "why": "健壮函数要分别处理格式错误和业务边界错误，并给调用方稳定结果。",
    "bossReview": "你已经能阅读常见异常、设计 try/except、主动 raise，并使用边界测试定位逻辑 Bug。"
  }
]);
