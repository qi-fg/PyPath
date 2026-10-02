addEngineeringStage(7, [
  {
    "title": "定义并调用函数",
    "task": "定义 hello()，调用时输出 hello。",
    "concept": "def 定义函数与函数调用",
    "starter": "# 定义 hello\n\nhello()\n",
    "solution": "def hello():\n    print('hello')\n\nhello()",
    "expected": "hello",
    "must": [
      "def"
    ],
    "why": "函数把一段操作命名后保存，只有调用时函数体才执行。"
  },
  {
    "title": "使用位置参数",
    "task": "定义 add(a,b) 并让 print(add(3,5)) 输出 8。",
    "concept": "函数参数",
    "starter": "def add(a, b):\n    pass\n\nprint(add(3, 5))\n",
    "solution": "def add(a, b):\n    return a + b\n\nprint(add(3, 5))",
    "expected": "8",
    "must": [
      "return"
    ],
    "why": "参数是函数从调用方接收数据的入口。"
  },
  {
    "title": "return 返回结果",
    "task": "完成 square(x)，让 square(6) 返回 36。",
    "concept": "return 与函数结果",
    "starter": "def square(x):\n    # 返回平方\n    pass\n\nprint(square(6))\n",
    "solution": "def square(x):\n    return x * x\n\nprint(square(6))",
    "expected": "36",
    "must": [
      "return"
    ],
    "why": "return 把计算结果交回调用位置；print 只是显示，两者职责不同。"
  },
  {
    "title": "默认参数",
    "task": "定义 greet(name,prefix='Hi')，调用 greet('Ada') 输出 Hi Ada。",
    "concept": "默认参数",
    "starter": "def greet(name, prefix='Hi'):\n    pass\n\nprint(greet('Ada'))\n",
    "solution": "def greet(name, prefix='Hi'):\n    return f'{prefix} {name}'\n\nprint(greet('Ada'))",
    "expected": "Hi Ada",
    "why": "默认参数为常见情况提供默认值，同时允许调用方覆盖。"
  },
  {
    "title": "关键字参数",
    "task": "定义 connect(host,port)，使用关键字参数 port=9000, host='localhost' 调用并输出 localhost:9000。",
    "concept": "keyword arguments",
    "starter": "def connect(host, port):\n    return f'{host}:{port}'\n\n# 使用关键字参数调用\n",
    "solution": "def connect(host, port):\n    return f'{host}:{port}'\n\n# 使用关键字参数调用\n\nprint(connect(port=9000, host='localhost'))",
    "expected": "localhost:9000",
    "why": "关键字参数按名字绑定，调用顺序可以与定义顺序不同，且可读性更强。"
  },
  {
    "title": "一次返回多个值",
    "task": "定义 min_max(nums)，返回最小值和最大值；输出 1 9。",
    "concept": "多返回值本质是元组解包",
    "starter": "def min_max(nums):\n    # 返回两个值\n    pass\n\nlow, high = min_max([3, 1, 9, 4])\nprint(low, high)\n",
    "solution": "def min_max(nums):\n    return min(nums), max(nums)\n\nlow, high = min_max([3, 1, 9, 4])\nprint(low, high)",
    "expected": "1 9",
    "why": "Python 可以返回一个包含多个位置值的元组，并在调用方解包。"
  },
  {
    "title": "理解局部变量",
    "task": "模块顶层变量 name='outer'。函数 show() 内部创建局部变量 name='inner' 并输出 inner，调用后在函数外输出 outer。不要使用 global 语句。",
    "concept": "局部作用域与全局作用域",
    "starter": "name = 'outer'\ndef show():\n    # 创建局部 name\n    pass\n\nshow()\nprint(name)\n",
    "solution": "name = 'outer'\ndef show():\n    name = 'inner'\n    print(name)\n\nshow()\nprint(name)",
    "expected": "inner\nouter",
    "why": "函数内部赋值默认创建局部变量，不会自动覆盖外层同名变量。"
  },
  {
    "title": "使用 *args 接收多个位置参数",
    "task": "定义 total(*nums)，返回所有参数之和；total(1,2,3,4) 输出 10。",
    "concept": "*args 可变位置参数",
    "starter": "def total(*nums):\n    pass\n\nprint(total(1, 2, 3, 4))\n",
    "solution": "def total(*nums):\n    return sum(nums)\n\nprint(total(1, 2, 3, 4))",
    "expected": "10",
    "must": [
      "*"
    ],
    "why": "*args 把任意数量的位置参数收集成元组。"
  },
  {
    "title": "使用 **kwargs 接收命名参数",
    "task": "定义 show(**info)，输出 info['name']；调用 show(name='Ada',role='admin') 输出 Ada。",
    "concept": "**kwargs 可变关键字参数",
    "starter": "def show(**info):\n    pass\n\nshow(name='Ada', role='admin')\n",
    "solution": "def show(**info):\n    print(info['name'])\n\nshow(name='Ada', role='admin')",
    "expected": "Ada",
    "must": [
      "**"
    ],
    "why": "**kwargs 把额外关键字参数收集成字典。"
  },
  {
    "title": "让小函数组合工作",
    "task": "定义 double(x) 与 add_one(x)，把 3 先 double 再 add_one，输出 7。",
    "concept": "函数组合与单一职责",
    "starter": "def double(x):\n    return x * 2\n\ndef add_one(x):\n    return x + 1\n\n# 组合调用\n",
    "solution": "def double(x):\n    return x * 2\n\ndef add_one(x):\n    return x + 1\n\n# 组合调用\n\nprint(add_one(double(3)))",
    "expected": "7",
    "why": "小函数职责单一时，可以通过组合形成更复杂流程。"
  },
  {
    "title": "修复忘记 return 的 Bug",
    "task": "下面函数打印 8，但 print(add(3,5)) 又输出 None。修改函数，让最终只输出 8。",
    "concept": "print 与 return 的职责",
    "starter": "def add(a, b):\n    print(a + b)\n\nresult = add(3, 5)\nprint(result)\n",
    "solution": "def add(a, b):\n    return a + b\n\nresult = add(3, 5)\nprint(result)",
    "expected": "8",
    "must": [
      "return"
    ],
    "why": "需要把结果交给其他代码继续使用时必须 return，而不是在函数内部固定 print。"
  },
  {
    "title": "输入校验工具箱",
    "boss": true,
    "task": "实现 normalize_name(name)：去两端空格并标题化；is_valid_age(age)：判断 0<=age<=120（含两端）；build_user(name,age)：年龄有效时返回 {'name':清洗后的姓名,'age':age}，无效时返回 None。给定 '  ada lovelace ' 和 36，输出 Ada Lovelace 36。",
    "concept": "拆分函数、返回值、参数与函数组合综合",
    "starter": "def normalize_name(name):\n    pass\n\ndef is_valid_age(age):\n    pass\n\ndef build_user(name, age):\n    pass\n\nuser = build_user('  ada lovelace ', 36)\nprint(user['name'], user['age'])\n",
    "solution": "def normalize_name(name):\n    return name.strip().title()\n\ndef is_valid_age(age):\n    return 0 <= age <= 120\n\ndef build_user(name, age):\n    if not is_valid_age(age):\n        return None\n    return {'name': normalize_name(name), 'age': age}\n\nuser = build_user('  ada lovelace ', 36)\nprint(user['name'], user['age'])",
    "expected": "Ada Lovelace 36",
    "must": [
      "def",
      "return"
    ],
    "why": "工程函数应该职责清楚：清洗、验证、构建分别由不同函数负责，再由上层组合。",
    "bossReview": "你已经能够把程序拆成可复用函数，并理解参数、返回值、作用域和可变参数。"
  }
]);
