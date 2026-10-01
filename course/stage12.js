addEngineeringStage(12, [
  {
    "title": "第一次继承",
    "task": "定义 Animal.speak() 返回 '?'；Dog 继承 Animal，不重写。输出 ?。",
    "concept": "继承复用父类行为",
    "starter": "class Animal:\n    def speak(self):\n        return '?'\n\n# 定义 Dog 继承 Animal\n",
    "solution": "class Dog(Animal):\n    pass\n\nprint(Dog().speak())",
    "expected": "?",
    "why": "子类会继承父类未被覆盖的方法。"
  },
  {
    "title": "方法重写",
    "task": "Dog 继承 Animal，并重写 speak() 返回 woof。",
    "concept": "override 方法重写",
    "starter": "class Animal:\n    def speak(self):\n        return '?'\n\nclass Dog(Animal):\n    # 重写 speak\n    pass\n\nprint(Dog().speak())\n",
    "solution": "class Animal:\n    def speak(self):\n        return '?'\n\nclass Dog(Animal):\n    def speak(self):\n        return 'woof'\n\nprint(Dog().speak())",
    "expected": "woof",
    "why": "子类可以提供与父类同名方法改变具体行为。"
  },
  {
    "title": "使用 super()",
    "task": "Employee 继承 Person，用 super().__init__(name) 初始化 name，再保存 role。输出 Ada dev。",
    "concept": "super() 调用父类实现",
    "starter": "class Person:\n    def __init__(self, name):\n        self.name = name\n\nclass Employee(Person):\n    def __init__(self, name, role):\n        pass\n\ne = Employee('Ada', 'dev')\nprint(e.name, e.role)\n",
    "solution": "class Person:\n    def __init__(self, name):\n        self.name = name\n\nclass Employee(Person):\n    def __init__(self, name, role):\n        super().__init__(name)\n        self.role = role\n\ne = Employee('Ada', 'dev')\nprint(e.name, e.role)",
    "expected": "Ada dev",
    "must": [
      "super"
    ],
    "why": "super() 能复用父类初始化逻辑，避免复制相同代码。"
  },
  {
    "title": "组合优于硬继承",
    "task": "Engine.start() 返回 on；Car 内部拥有 Engine，并让 car.start() 输出 on。",
    "concept": "composition 组合对象",
    "starter": "class Engine:\n    def start(self):\n        return 'on'\n\nclass Car:\n    def __init__(self):\n        # 保存 Engine 实例\n        pass\n    def start(self):\n        pass\n\nprint(Car().start())\n",
    "solution": "class Engine:\n    def start(self):\n        return 'on'\n\nclass Car:\n    def __init__(self):\n        self.engine = Engine()\n    def start(self):\n        return self.engine.start()\n\nprint(Car().start())",
    "expected": "on",
    "why": "组合表达“拥有一个”关系，通常比为了复用强行继承更灵活。"
  },
  {
    "title": "第一次 dataclass",
    "task": "用 @dataclass 定义 Point(x,y)，创建 Point(2,3) 并输出 2 3。",
    "concept": "dataclasses 自动生成初始化等样板代码",
    "starter": "from dataclasses import dataclass\n# 定义 Point\n",
    "solution": "from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\np = Point(2, 3)\nprint(p.x, p.y)",
    "expected": "2 3",
    "must": [
      "dataclass"
    ],
    "why": "纯数据对象可以用 dataclass 减少重复的 __init__ 等样板代码。"
  },
  {
    "title": "property 计算属性",
    "task": "Rectangle 有 width/height，用 @property area 返回面积，输出 12。",
    "concept": "@property 把方法暴露成只读属性接口",
    "starter": "class Rectangle:\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n\n    # 定义 area property\n\nr = Rectangle(3, 4)\nprint(r.area)\n",
    "solution": "class Rectangle:\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n\n    @property\n    def area(self):\n        return self.w * self.h\n\nr = Rectangle(3, 4)\nprint(r.area)",
    "expected": "12",
    "must": [
      "property"
    ],
    "why": "property 适合对外表现为属性、内部通过逻辑计算的值。"
  },
  {
    "title": "classmethod 工厂方法",
    "task": "User.from_text('Ada:36') 返回 User，并输出 Ada 36。",
    "concept": "@classmethod 接收类本身 cls",
    "starter": "class User:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    # 定义 from_text\n\nu = User.from_text('Ada:36')\nprint(u.name, u.age)\n",
    "solution": "class User:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    @classmethod\n    def from_text(cls, text):\n        name, age = text.split(':')\n        return cls(name, int(age))\n\nu = User.from_text('Ada:36')\nprint(u.name, u.age)",
    "expected": "Ada 36",
    "must": [
      "classmethod"
    ],
    "why": "classmethod 常用于替代构造方式，让类负责把外部格式转换成实例。"
  },
  {
    "title": "staticmethod 工具方法",
    "task": "Validator.is_email(text) 判断是否包含 @，对 a@b.com 输出 True。",
    "concept": "@staticmethod 不依赖实例或类状态",
    "starter": "class Validator:\n    # 定义 is_email\n    pass\n\nprint(Validator.is_email('a@b.com'))\n",
    "solution": "class Validator:\n    @staticmethod\n    def is_email(text):\n        return '@' in text\n\nprint(Validator.is_email('a@b.com'))",
    "expected": "True",
    "must": [
      "staticmethod"
    ],
    "why": "与类概念相关但不需要 self/cls 的纯工具逻辑可以用 staticmethod。"
  },
  {
    "title": "自定义异常",
    "task": "定义 InvalidAgeError(Exception)，age=-1 时 raise；捕获后输出 invalid age。",
    "concept": "自定义异常表达业务错误",
    "starter": "# 定义自定义异常并捕获\n",
    "solution": "class InvalidAgeError(Exception):\n    pass\n\ntry:\n    age = -1\n    if age < 0:\n        raise InvalidAgeError()\nexcept InvalidAgeError:\n    print('invalid age')",
    "expected": "invalid age",
    "must": [
      "Exception",
      "raise"
    ],
    "why": "业务异常有独立类型后，调用方可以精确区分不同失败原因。"
  },
  {
    "title": "dataclass 的默认工厂",
    "task": "用 dataclass field(default_factory=list) 定义 Box.items。两个 Box 独立，a 加 x 后输出 1 0。",
    "concept": "default_factory 避免共享可变默认值",
    "starter": "from dataclasses import dataclass, field\n# 定义 Box\n",
    "solution": "from dataclasses import dataclass, field\n\n@dataclass\nclass Box:\n    items: list = field(default_factory=list)\n\na = Box()\nb = Box()\na.items.append('x')\nprint(len(a.items), len(b.items))",
    "expected": "1 0",
    "must": [
      "default_factory"
    ],
    "why": "可变默认值必须为每个实例单独创建，default_factory 正是为此设计。"
  },
  {
    "title": "修复错误继承设计",
    "task": "Printer 只需要 Logger.log() 能力。使用组合而不是继承，让 Printer.print_doc() 输出 log:print。",
    "concept": "用组合降低不必要的继承耦合",
    "starter": "class Logger:\n    def log(self, msg):\n        print('log:' + msg)\n\nclass Printer:\n    def __init__(self):\n        pass\n    def print_doc(self):\n        pass\n\nPrinter().print_doc()\n",
    "solution": "class Printer:\n    def __init__(self):\n        self.logger = Logger()\n    def print_doc(self):\n        self.logger.log('print')\n\nPrinter().print_doc()",
    "expected": "log:print",
    "why": "Printer 不是一种 Logger，只是使用 Logger；组合更准确表达依赖关系。"
  },
  {
    "title": "购物车领域模型",
    "boss": true,
    "task": "用 dataclass Item(name,price,qty=1)；Cart 内维护 items，add(item)，total property 计算总价。加入 Book 20x2、Pen 5x3，输出 total=55。",
    "concept": "dataclass、组合、实例集合、property 与业务模型综合",
    "starter": "from dataclasses import dataclass\n\n@dataclass\nclass Item:\n    pass\n\nclass Cart:\n    def __init__(self):\n        pass\n    def add(self, item):\n        pass\n    @property\n    def total(self):\n        pass\n\ncart = Cart()\ncart.add(Item('Book', 20, 2))\ncart.add(Item('Pen', 5, 3))\nprint(f'total={cart.total}')\n",
    "solution": "from dataclasses import dataclass\n\n@dataclass\nclass Item:\n    name: str\n    price: int\n    qty: int = 1\n\nclass Cart:\n    def __init__(self):\n        self.items = []\n    def add(self, item):\n        self.items.append(item)\n    @property\n    def total(self):\n        return sum(item.price * item.qty for item in self.items)\n\ncart = Cart()\ncart.add(Item('Book', 20, 2))\ncart.add(Item('Pen', 5, 3))\nprint(f'total={cart.total}')",
    "expected": "total=55",
    "must": [
      "dataclass",
      "property"
    ],
    "why": "工程建模的核心是把数据模型、容器对象和业务计算按职责组织。",
    "bossReview": "你已经掌握继承、super、组合、dataclass、property 与类方法，并能判断什么时候应该优先组合。"
  }
]);
