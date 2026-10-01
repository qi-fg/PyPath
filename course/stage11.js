addEngineeringStage(11, [
  {
    "title": "定义第一个类",
    "task": "定义空类 Service，创建对象 s，并输出 Service。",
    "concept": "class 定义类型与实例",
    "starter": "# 定义 Service 类\n",
    "solution": "class Service:\n    pass\n\ns = Service()\nprint(type(s).__name__)",
    "expected": "Service",
    "must": [
      "class"
    ],
    "why": "类定义一种新的对象类型，实例是这个类型的具体对象。"
  },
  {
    "title": "使用 __init__ 初始化",
    "task": "定义 User(name)，创建 User('Ada') 并输出 Ada。",
    "concept": "__init__ 初始化实例状态",
    "starter": "class User:\n    # 初始化 name\n    pass\n\nuser = User('Ada')\nprint(user.name)\n",
    "solution": "class User:\n    def __init__(self, name):\n        self.name = name\n\nuser = User('Ada')\nprint(user.name)",
    "expected": "Ada",
    "must": [
      "__init__",
      "self"
    ],
    "why": "__init__ 在对象创建时接收参数并把状态保存到实例属性。"
  },
  {
    "title": "理解 self",
    "task": "给 Counter 类增加 inc() 方法，让 value 从 0 变成 1 并输出。",
    "concept": "self 指向当前实例",
    "starter": "class Counter:\n    def __init__(self):\n        self.value = 0\n\n    def inc(self):\n        pass\n\nc = Counter()\nc.inc()\nprint(c.value)\n",
    "solution": "class Counter:\n    def __init__(self):\n        self.value = 0\n\n    def inc(self):\n        self.value += 1\n\nc = Counter()\nc.inc()\nprint(c.value)",
    "expected": "1",
    "must": [
      "self"
    ],
    "why": "实例方法通过 self 读取和修改当前对象自己的状态。"
  },
  {
    "title": "多个对象互不影响",
    "task": "创建两个 Counter，对第一个 inc 两次、第二个一次，输出 2 1。",
    "concept": "实例拥有独立状态",
    "starter": "class Counter:\n    def __init__(self):\n        self.value = 0\n    def inc(self):\n        self.value += 1\n\n# 创建两个对象\n",
    "solution": "a = Counter()\nb = Counter()\na.inc()\na.inc()\nb.inc()\nprint(a.value, b.value)",
    "expected": "2 1",
    "why": "实例属性存放在各自对象上，所以不同实例可以拥有不同状态。"
  },
  {
    "title": "方法可以返回结果",
    "task": "定义 Rectangle(width,height).area()，让 3x4 的面积输出 12。",
    "concept": "对象方法封装与对象状态相关的行为",
    "starter": "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        pass\n\nprint(Rectangle(3, 4).area())\n",
    "solution": "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        return self.width * self.height\n\nprint(Rectangle(3, 4).area())",
    "expected": "12",
    "must": [
      "return"
    ],
    "why": "当行为天然依赖对象内部状态时，把它放在实例方法里通常更清晰。"
  },
  {
    "title": "类属性",
    "task": "给 User 类定义 kind='human'，创建对象后输出 human。",
    "concept": "类属性由所有实例共享读取",
    "starter": "class User:\n    # 定义类属性 kind\n    pass\n\nu = User()\nprint(u.kind)\n",
    "solution": "class User:\n    kind = 'human'\n\nu = User()\nprint(u.kind)",
    "expected": "human",
    "why": "类属性适合所有实例共同使用的常量或元数据。"
  },
  {
    "title": "自定义 __str__",
    "task": "让 print(User('Ada')) 输出 User(Ada)。",
    "concept": "__str__ 定义面向用户的字符串表示",
    "starter": "class User:\n    def __init__(self, name):\n        self.name = name\n\n    def __str__(self):\n        pass\n\nprint(User('Ada'))\n",
    "solution": "class User:\n    def __init__(self, name):\n        self.name = name\n\n    def __str__(self):\n        return f'User({self.name})'\n\nprint(User('Ada'))",
    "expected": "User(Ada)",
    "must": [
      "__str__"
    ],
    "why": "__str__ 让对象在日志、终端和调试输出中更可读。"
  },
  {
    "title": "方法修改对象状态",
    "task": "Task.done 初始 False，调用 complete() 后输出 True。",
    "concept": "对象把状态与修改状态的行为放在一起",
    "starter": "class Task:\n    def __init__(self):\n        self.done = False\n\n    def complete(self):\n        pass\n\nt = Task()\nt.complete()\nprint(t.done)\n",
    "solution": "class Task:\n    def __init__(self):\n        self.done = False\n\n    def complete(self):\n        self.done = True\n\nt = Task()\nt.complete()\nprint(t.done)",
    "expected": "True",
    "why": "对象方法可以维护对象状态变化，并把修改规则集中在类内部。"
  },
  {
    "title": "使用 isinstance",
    "task": "创建 User 对象，输出 isinstance(user, User) 的结果。",
    "concept": "isinstance() 类型检查",
    "starter": "class User:\n    pass\n\nuser = User()\n# 检查类型\n",
    "solution": "print(isinstance(user, User))",
    "expected": "True",
    "must": [
      "isinstance"
    ],
    "why": "isinstance 可以判断对象是否属于某类型或其子类，通常比直接比较 type 更灵活。"
  },
  {
    "title": "对象列表",
    "task": "创建两个 User('A')、User('B') 放入列表并逐行输出名字。",
    "concept": "对象可以像普通值一样存入容器",
    "starter": "class User:\n    def __init__(self, name):\n        self.name = name\n\n# 创建对象列表\n",
    "solution": "users = [User('A'), User('B')]\nfor user in users:\n    print(user.name)",
    "expected": "A\nB",
    "must": [
      "for"
    ],
    "why": "工程程序常用列表管理一组同类型业务对象。"
  },
  {
    "title": "修复共享类属性 Bug",
    "task": "下面两个 Cart 共享同一个 items。修复后 a 加入 x，输出 a=1、b=0。",
    "concept": "可变实例状态应在 __init__ 中创建",
    "starter": "class Cart:\n    items = []\n    def add(self, item):\n        self.items.append(item)\n\na = Cart()\nb = Cart()\na.add('x')\nprint(len(a.items))\nprint(len(b.items))\n",
    "solution": "class Cart:\n    def __init__(self):\n        self.items = []\n    def add(self, item):\n        self.items.append(item)\n\na = Cart()\nb = Cart()\na.add('x')\nprint(len(a.items))\nprint(len(b.items))",
    "expected": "1\n0",
    "why": "可变类属性会被所有实例共享；每个对象独立的数据应在 __init__ 中创建。"
  },
  {
    "title": "银行账户",
    "boss": true,
    "task": "实现 Account(owner,balance=0)，deposit(amount) 增加余额，withdraw(amount) 余额足够时扣款并返回 True，否则 False。Ada 初始100，存50，取70，输出 Ada 80 True。",
    "concept": "类、初始化、实例状态、方法与业务规则综合",
    "starter": "class Account:\n    def __init__(self, owner, balance=0):\n        pass\n\n    def deposit(self, amount):\n        pass\n\n    def withdraw(self, amount):\n        pass\n\nacc = Account('Ada', 100)\nacc.deposit(50)\nok = acc.withdraw(70)\nprint(acc.owner, acc.balance, ok)\n",
    "solution": "class Account:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        self.balance += amount\n\n    def withdraw(self, amount):\n        if amount > self.balance:\n            return False\n        self.balance -= amount\n        return True\n\nacc = Account('Ada', 100)\nacc.deposit(50)\nok = acc.withdraw(70)\nprint(acc.owner, acc.balance, ok)",
    "expected": "Ada 80 True",
    "must": [
      "class",
      "self",
      "return"
    ],
    "why": "业务对象把数据和围绕数据的合法操作组织在一起，可以减少散落的状态修改。",
    "bossReview": "你已经理解类、实例、self、初始化、方法和实例状态，能够用对象表达一个小型业务实体。"
  }
]);
