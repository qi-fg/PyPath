addEngineeringStage(2, [
  {
    "title": "读取一行用户输入",
    "task": "读取一个名字，并输出：Hello Alice。测试输入为 Alice。",
    "concept": "input() 返回字符串",
    "starter": "name = input()\n# 输出问候语\n",
    "stdin": "Alice",
    "solution": "name = input()\nprint('Hello', name)",
    "expected": "Hello Alice",
    "why": "input() 会读取一行文本并返回字符串，通常先保存到变量再使用。",
    "walk": "input 读取 Alice；name 保存该字符串；print 组合固定文字与变量。",
    "hint1": "input() 的结果已经是字符串。",
    "hint2": "先保存到 name，再输出。",
    "takeaway": "外部输入是程序的数据入口。"
  },
  {
    "title": "把输入转换成整数",
    "task": "读取年龄 20，把它转换成整数并输出 21。",
    "concept": "int() 类型转换",
    "starter": "age = input()\n# 转成整数并加 1\n",
    "stdin": "20",
    "solution": "age = int(age)\nprint(age + 1)",
    "expected": "21",
    "must": [
      "int"
    ],
    "why": "input() 返回字符串，做数值运算前要显式转换成 int。",
    "walk": "age 最初是字符串 20；int(age) 得到整数 20；再加 1 得到 21。",
    "hint1": "当前 age 不是数字类型。",
    "hint2": "使用 int(age)。",
    "takeaway": "永远不要假设外部输入已经是正确类型。"
  },
  {
    "title": "处理带小数的输入",
    "task": "读取价格 19.5，乘以 2 后输出 39.0。",
    "concept": "float() 浮点数转换",
    "starter": "price = input()\n# 转成浮点数并计算\n",
    "stdin": "19.5",
    "solution": "price = float(price)\nprint(price * 2)",
    "expected": "39.0",
    "must": [
      "float"
    ],
    "why": "带小数的数据通常使用 float() 转换后再计算。",
    "walk": "字符串 19.5 转成浮点数 19.5，再乘 2 得到 39.0。",
    "hint1": "int 不能直接表示 19.5。",
    "hint2": "使用 float()。",
    "takeaway": "选择转换类型要和数据实际含义匹配。"
  },
  {
    "title": "用 f-string 插入变量",
    "task": "name='Ada'，使用 f-string 输出：User: Ada",
    "concept": "f-string 格式化",
    "starter": "name = 'Ada'\n# 使用 f-string\n",
    "solution": "print(f'User: {name}')",
    "expected": "User: Ada",
    "must": [
      "f"
    ],
    "why": "f-string 让模板文字与变量插值保持在一个清楚的表达式中。",
    "walk": "字符串前缀 f 开启插值；{name} 在运行时被变量值 Ada 替换。",
    "hint1": "字符串前面加 f。",
    "hint2": "变量放在花括号中。",
    "takeaway": "需要拼接多段文字与变量时，优先考虑 f-string。"
  },
  {
    "title": "统计字符串长度",
    "task": "text='python'，输出字符数量 6。",
    "concept": "len() 长度",
    "starter": "text = 'python'\n# 输出长度\n",
    "solution": "print(len(text))",
    "expected": "6",
    "why": "len() 返回字符串或容器包含的元素数量。",
    "walk": "字符串 python 含 6 个字符，因此 len(text) 返回 6。",
    "hint1": "Python 有内置长度函数。",
    "hint2": "函数名是 len。",
    "takeaway": "len() 是处理字符串、列表、字典时的高频工具。"
  },
  {
    "title": "按位置读取字符",
    "task": "word='engineer'，输出第一个字符 e。",
    "concept": "字符串下标从 0 开始",
    "starter": "word = 'engineer'\n# 输出第一个字符\n",
    "solution": "print(word[0])",
    "expected": "e",
    "why": "Python 序列使用从 0 开始的下标。",
    "walk": "word[0] 读取位置 0，对应字符串的第一个字符 e。",
    "hint1": "第一个位置不是 1。",
    "hint2": "使用 [0]。",
    "takeaway": "下标从 0 开始，是后续所有序列操作的基础。"
  },
  {
    "title": "使用字符串切片",
    "task": "text='backend'，输出 back。",
    "concept": "切片 [start:stop] 左闭右开",
    "starter": "text = 'backend'\n# 使用切片输出 back\n",
    "solution": "print(text[0:4])",
    "expected": "back",
    "why": "切片 stop 位置不包含在结果中，因此 0:4 取得下标 0 到 3。",
    "walk": "依次取 b、a、c、k，在下标 4 之前停止。",
    "hint1": "back 一共 4 个字符。",
    "hint2": "stop 写 4。",
    "takeaway": "切片和 range 一样常见地采用左闭右开规则。"
  },
  {
    "title": "清理输入两端空格",
    "task": "读取带空格的 Alice，去掉两端空格并输出 Alice。",
    "concept": "str.strip()",
    "starter": "name = input()\n# 清理两端空格\n",
    "stdin": "  Alice  ",
    "solution": "name = name.strip()\nprint(name)",
    "expected": "Alice",
    "must": [
      "strip"
    ],
    "why": "用户输入经常带有多余空白，strip() 可以做基础清洗。",
    "walk": "input 得到带空格字符串；strip 创建清理后的新字符串；再输出。",
    "hint1": "不要手动数空格。",
    "hint2": "字符串有 strip() 方法。",
    "takeaway": "处理外部文本时，先规范化输入往往能减少后续 Bug。"
  },
  {
    "title": "统一大小写",
    "task": "email='USER@EXAMPLE.COM'，输出 user@example.com。",
    "concept": "str.lower()",
    "starter": "email = 'USER@EXAMPLE.COM'\n# 统一为小写\n",
    "solution": "print(email.lower())",
    "expected": "user@example.com",
    "must": [
      "lower"
    ],
    "why": "做不区分大小写的比较或存储时，先统一大小写更可靠。",
    "walk": "lower() 返回一个全部小写的新字符串，原字符串不被原地修改。",
    "hint1": "字符串有 lower() 方法。",
    "hint2": "可以直接 print(email.lower())。",
    "takeaway": "字符串是不可变对象，很多方法返回的是新字符串。"
  },
  {
    "title": "拆分一行数据",
    "task": "line='alice,20,tokyo'，按逗号拆分并输出第二项 20。",
    "concept": "str.split() 与列表",
    "starter": "line = 'alice,20,tokyo'\n# 拆分并输出年龄字段\n",
    "solution": "parts = line.split(',')\nprint(parts[1])",
    "expected": "20",
    "must": [
      "split"
    ],
    "why": "split() 把结构化文本按分隔符变成列表，便于按字段处理。",
    "walk": "字符串按逗号拆成三个元素；下标 1 对应第二个字段 20。",
    "hint1": "先按逗号拆分。",
    "hint2": "第二个元素下标是 1。",
    "takeaway": "很多文件和协议的第一步处理就是把文本拆成结构。"
  },
  {
    "title": "把多段文字重新连接",
    "task": "parts=['api','v1','users']，用 / 连接并输出 api/v1/users。",
    "concept": "str.join()",
    "starter": "parts = ['api', 'v1', 'users']\n# 用 / 连接\n",
    "solution": "print('/'.join(parts))",
    "expected": "api/v1/users",
    "must": [
      "join"
    ],
    "why": "join() 是把字符串序列连接成一个字符串的标准方式。",
    "walk": "分隔符 / 被插入相邻元素之间，最终形成路径样式字符串。",
    "hint1": "由分隔符调用 join。",
    "hint2": "写成 '/'.join(parts)。",
    "takeaway": "拼接列表中的多段字符串时，join 比循环累加更清楚。"
  },
  {
    "title": "命令行注册卡",
    "boss": true,
    "task": "依次读取 name、age、city 三行输入。清理 name/city 两端空格，把 age 转为整数并计算明年年龄。输出：User=Alice | NextAge=21 | City=Tokyo",
    "concept": "input、strip、int 与 f-string 的综合输入处理",
    "starter": "# 依次读取姓名、年龄、城市\n",
    "stdin": "  Alice  \n20\n Tokyo ",
    "solution": "name = input().strip()\nage = int(input())\ncity = input().strip()\nprint(f'User={name} | NextAge={age + 1} | City={city}')",
    "expected": "User=Alice | NextAge=21 | City=Tokyo",
    "must": [
      "input",
      "strip",
      "int",
      "f"
    ],
    "why": "真实输入流程通常是：读取 → 清洗 → 类型转换 → 业务计算 → 格式化输出。",
    "walk": "第一行和第三行先 strip；第二行通过 int 转成整数；最后 f-string 组合三个处理结果。",
    "hint1": "三个 input() 的处理方式不完全相同。",
    "hint2": "名字和城市要 strip，年龄要 int。",
    "takeaway": "外部输入必须先校验和规范化，再进入业务逻辑。",
    "bossReview": "你已经能把原始文本输入转换成程序内部可用的数据，并输出稳定格式。"
  }
]);
