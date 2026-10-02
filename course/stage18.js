addEngineeringStage(18, [
  {
    "title": "使用 iter 和 next",
    "task": "对 [10,20] 创建迭代器，连续 next 两次并输出 10 20。",
    "concept": "iterator protocol",
    "starter": "items = [10, 20]\n# 创建迭代器并读取\n",
    "solution": "items = [10, 20]\n# 创建迭代器并读取\n\nit = iter(items)\nprint(next(it), next(it))",
    "expected": "10 20",
    "must": [
      "iter",
      "next"
    ],
    "why": "for 循环底层依赖迭代器协议，理解 iter/next 有助于读懂惰性数据流。"
  },
  {
    "title": "第一次 generator",
    "task": "定义 numbers()，yield 1、yield 2，遍历输出两行。",
    "concept": "yield 生成器",
    "starter": "def numbers():\n    # yield 两个值\n    pass\n\nfor n in numbers():\n    print(n)\n",
    "solution": "def numbers():\n    yield 1\n    yield 2\n\nfor n in numbers():\n    print(n)",
    "expected": "1\n2",
    "must": [
      "yield"
    ],
    "why": "yield 让函数暂停并逐个产出值，而不是一次构造完整结果。"
  },
  {
    "title": "生成器按需计算",
    "task": "定义 squares(n) 逐个 yield i*i；list(squares(4)) 输出 [0,1,4,9]。",
    "concept": "惰性生成序列",
    "starter": "def squares(n):\n    pass\n\nprint(list(squares(4)))\n",
    "solution": "def squares(n):\n    for i in range(n):\n        yield i * i\n\nprint(list(squares(4)))",
    "expected": "[0, 1, 4, 9]",
    "must": [
      "yield"
    ],
    "why": "生成器适合数据量大或只需要逐步消费的流程。"
  },
  {
    "title": "生成器表达式",
    "task": "用生成器表达式计算1..4平方和30并输出。",
    "concept": "generator expression",
    "starter": "# 不创建平方列表，直接求和\n",
    "solution": "total = sum(n * n for n in range(1, 5))\nprint(total)",
    "expected": "30",
    "why": "生成器表达式可以把值逐个交给消费函数，避免不必要的中间列表。"
  },
  {
    "title": "第一次装饰器",
    "task": "写 upper_result 装饰器，让 greet() 原本返回 hello，装饰后 print(greet()) 输出 HELLO。",
    "concept": "decorator 包装函数",
    "starter": "def upper_result(func):\n    pass\n\n@upper_result\ndef greet():\n    return 'hello'\n\nprint(greet())\n",
    "solution": "def upper_result(func):\n    def wrapper():\n        return func().upper()\n    return wrapper\n\n@upper_result\ndef greet():\n    return 'hello'\n\nprint(greet())",
    "expected": "HELLO",
    "must": [
      "@"
    ],
    "why": "装饰器在不修改原函数主体的前提下，为调用增加统一行为。"
  },
  {
    "title": "装饰器传递参数",
    "task": "写 twice 装饰器，让 add(2,3) 的结果乘2，输出10。",
    "concept": "wrapper 的 *args/**kwargs",
    "starter": "def twice(func):\n    pass\n\n@twice\ndef add(a, b):\n    return a + b\n\nprint(add(2, 3))\n",
    "solution": "def twice(func):\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs) * 2\n    return wrapper\n\n@twice\ndef add(a, b):\n    return a + b\n\nprint(add(2, 3))",
    "expected": "10",
    "must": [
      "*args",
      "**kwargs"
    ],
    "why": "通用装饰器通常要透明转发被包装函数的参数。"
  },
  {
    "title": "使用 functools.wraps",
    "task": "装饰 greet 后仍让 greet.__name__ 输出 greet。",
    "concept": "functools.wraps 保留函数元数据",
    "starter": "from functools import wraps\n\ndef deco(func):\n    # 使用 wraps\n    pass\n\n@deco\ndef greet():\n    return 'hi'\n\nprint(greet.__name__)\n",
    "solution": "from functools import wraps\n\ndef deco(func):\n    @wraps(func)\n    def wrapper():\n        return func()\n    return wrapper\n\n@deco\ndef greet():\n    return 'hi'\n\nprint(greet.__name__)",
    "expected": "greet",
    "must": [
      "wraps"
    ],
    "why": "wraps 保留原函数的名称和文档等元数据，对调试和框架反射很重要。"
  },
  {
    "title": "闭包保存状态",
    "task": "make_counter() 返回函数，每次调用加1；连续输出1、2。",
    "concept": "closure 闭包与 nonlocal",
    "starter": "def make_counter():\n    count = 0\n    # 返回内部函数\n    pass\n\nc = make_counter()\nprint(c())\nprint(c())\n",
    "solution": "def make_counter():\n    count = 0\n    def inc():\n        nonlocal count\n        count += 1\n        return count\n    return inc\n\nc = make_counter()\nprint(c())\nprint(c())",
    "expected": "1\n2",
    "must": [
      "nonlocal"
    ],
    "why": "闭包可以让函数保留创建时环境中的状态。"
  },
  {
    "title": "contextmanager 自定义上下文",
    "task": "用 @contextmanager 定义 managed()，进入时输出 enter，with 内输出 work，退出输出 exit。",
    "concept": "contextlib.contextmanager",
    "starter": "from contextlib import contextmanager\n# 定义 managed\n",
    "solution": "from contextlib import contextmanager\n\n@contextmanager\ndef managed():\n    print('enter')\n    try:\n        yield\n    finally:\n        print('exit')\n\nwith managed():\n    print('work')",
    "expected": "enter\nwork\nexit",
    "must": [
      "contextmanager",
      "yield"
    ],
    "why": "上下文管理器把资源进入和退出逻辑绑定在一起，with 保证收尾执行。"
  },
  {
    "title": "自定义可迭代对象",
    "task": "Range3.__iter__ 返回 iter([1,2,3])，list(Range3()) 输出 [1,2,3]。",
    "concept": "__iter__ 可迭代协议",
    "starter": "class Range3:\n    def __iter__(self):\n        pass\n\nprint(list(Range3()))\n",
    "solution": "class Range3:\n    def __iter__(self):\n        return iter([1, 2, 3])\n\nprint(list(Range3()))",
    "expected": "[1, 2, 3]",
    "must": [
      "__iter__"
    ],
    "why": "实现 __iter__ 后，自定义对象就能参与 for、list 等迭代生态。"
  },
  {
    "title": "修复生成器一次性消费",
    "task": "给定 gen=(n for n in [1,2,3])。修复下面的代码，输出元素总和 6 与完整元素列表 [1, 2, 3]，每项一行。",
    "concept": "生成器是一次性惰性迭代器",
    "starter": "gen = (n for n in [1, 2, 3])\nprint(sum(gen))\nprint(list(gen))\n",
    "solution": "values = list(n for n in [1, 2, 3])\nprint(sum(values))\nprint(values)",
    "expected": "6\n[1, 2, 3]",
    "why": "生成器被消费后不会自动重置；需要多次读取时应保存结果或重新创建生成器。"
  },
  {
    "title": "可组合处理管线",
    "boss": true,
    "task": "实现 strip_result 与 upper_result 两个装饰器，并叠加到 get_name()，原返回 '  ada  '，最终输出 ADA，同时 __name__ 仍为 get_name。",
    "concept": "装饰器叠加、wraps、闭包与调用链综合",
    "starter": "from functools import wraps\n\ndef strip_result(func):\n    pass\n\ndef upper_result(func):\n    pass\n\n@upper_result\n@strip_result\ndef get_name():\n    return '  ada  '\n\nprint(get_name())\nprint(get_name.__name__)\n",
    "solution": "from functools import wraps\n\ndef strip_result(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs).strip()\n    return wrapper\n\ndef upper_result(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs).upper()\n    return wrapper\n\n@upper_result\n@strip_result\ndef get_name():\n    return '  ada  '\n\nprint(get_name())\nprint(get_name.__name__)",
    "expected": "ADA\nget_name",
    "must": [
      "wraps",
      "@"
    ],
    "why": "成熟框架大量使用装饰器和惰性协议，关键是理解包装顺序、参数转发和元数据保留。",
    "bossReview": "你已经能读懂迭代器、生成器、闭包、装饰器和上下文管理器，面对框架代码不会只看到一堆陌生语法。"
  }
]);
