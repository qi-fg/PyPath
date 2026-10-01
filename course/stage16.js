addEngineeringStage(16, [
  {
    "title": "第一次 assert 测试",
    "task": "计算 add(2,3)，用 assert 验证结果等于5，最后输出 passed。",
    "concept": "assert 做最小自动验证",
    "starter": "def add(a, b):\n    return a + b\n\n# 写断言\n\nprint('passed')\n",
    "solution": "def add(a, b):\n    return a + b\n\nassert add(2, 3) == 5\nprint('passed')",
    "expected": "passed",
    "must": [
      "assert"
    ],
    "why": "测试的核心是把预期结果写成可自动执行的判断。"
  },
  {
    "title": "测试正常输入",
    "task": "定义 is_even(n)，用两个 assert 验证 4 为 True、5 为 False，输出 passed。",
    "concept": "一个函数需要验证多个代表性输入",
    "starter": "def is_even(n):\n    return n % 2 == 0\n\n# 写两个测试\n",
    "solution": "assert is_even(4) is True\nassert is_even(5) is False\nprint('passed')",
    "expected": "passed",
    "must": [
      "assert"
    ],
    "why": "只测试一个输入容易漏掉相反分支，多样测试能覆盖更多行为。"
  },
  {
    "title": "测试边界值",
    "task": "adult(age) 规则 age>=18。用 assert 验证17 False、18 True、19 True。",
    "concept": "boundary testing 边界测试",
    "starter": "def adult(age):\n    return age >= 18\n\n# 测试边界\n",
    "solution": "assert adult(17) is False\nassert adult(18) is True\nassert adult(19) is True\nprint('passed')",
    "expected": "passed",
    "why": "边界附近最容易出现 > 与 >= 等 off-by-one 错误。"
  },
  {
    "title": "表驱动测试",
    "task": "用 cases=[(1,2,3),(0,0,0),(-1,1,0)] 循环测试 add，全部通过后输出 3 tests。",
    "concept": "table-driven tests",
    "starter": "def add(a, b):\n    return a + b\n\ncases = [(1, 2, 3), (0, 0, 0), (-1, 1, 0)]\n# 循环测试\n",
    "solution": "for a, b, expected in cases:\n    assert add(a, b) == expected\nprint(f'{len(cases)} tests')",
    "expected": "3 tests",
    "must": [
      "for",
      "assert"
    ],
    "why": "把输入和预期放在表里，可以低成本覆盖大量案例。"
  },
  {
    "title": "验证异常路径",
    "task": "parse('abc') 应 raise ValueError。写测试捕获它，并输出 raised。",
    "concept": "测试失败路径与异常类型",
    "starter": "def parse(text):\n    return int(text)\n\n# 验证会抛 ValueError\n",
    "solution": "try:\n    parse('abc')\nexcept ValueError:\n    print('raised')\nelse:\n    raise AssertionError('ValueError not raised')",
    "expected": "raised",
    "why": "可靠测试不仅验证成功路径，也验证程序在错误输入下是否按约定失败。"
  },
  {
    "title": "Arrange / Act / Assert",
    "task": "按准备、执行、断言三步测试 total([2,3])==5，输出 passed。",
    "concept": "AAA 测试结构",
    "starter": "def total(nums):\n    return sum(nums)\n\n# Arrange / Act / Assert\n",
    "solution": "nums = [2, 3]\nresult = total(nums)\nassert result == 5\nprint('passed')",
    "expected": "passed",
    "why": "把测试拆成准备、执行、断言三段，可以让失败原因更容易定位。"
  },
  {
    "title": "使用 fake 依赖",
    "task": "send(fetcher) 调用 fetcher() 并返回 status。提供 fake 返回200，测试输出200。",
    "concept": "fake dependency 隔离外部系统",
    "starter": "def send(fetcher):\n    return fetcher()['status']\n\ndef fake_fetch():\n    pass\n\n# 测试 send\n",
    "solution": "def fake_fetch():\n    return {'status': 200}\n\nassert send(fake_fetch) == 200\nprint(send(fake_fetch))",
    "expected": "200",
    "why": "测试时用 fake 替代网络、数据库等不稳定依赖，可以让测试快速且可重复。"
  },
  {
    "title": "让随机测试可重复",
    "task": "random.seed(1) 后 randint(1,10) 三次，输出固定列表 [3, 10, 2]。",
    "concept": "deterministic test 可重复性",
    "starter": "import random\n# 固定随机种子并生成三个数\n",
    "solution": "import random\nrandom.seed(1)\nvalues = [random.randint(1, 10) for _ in range(3)]\nprint(values)",
    "expected": "[3, 10, 2]",
    "must": [
      "seed"
    ],
    "why": "测试中的随机性必须固定或注入，否则同一个测试可能时过时不过。"
  },
  {
    "title": "回归测试保护 Bug 修复",
    "task": "normalize('  Ada  ') 应返回 Ada。先写 assert，再输出 passed。",
    "concept": "regression test 回归测试",
    "starter": "def normalize(text):\n    return text.strip()\n\n# 为曾经的空格 Bug 写测试\n",
    "solution": "assert normalize('  Ada  ') == 'Ada'\nprint('passed')",
    "expected": "passed",
    "why": "修复 Bug 后留下测试，可以防止未来修改让同一个问题再次出现。"
  },
  {
    "title": "测试返回结构",
    "task": "build_user('Ada') 返回 {'name':'Ada','active':True}。分别断言两个字段并输出 passed。",
    "concept": "对结构化结果验证关键字段",
    "starter": "def build_user(name):\n    return {'name': name, 'active': True}\n\n# 验证两个字段\n",
    "solution": "user = build_user('Ada')\nassert user['name'] == 'Ada'\nassert user['active'] is True\nprint('passed')",
    "expected": "passed",
    "why": "结构化结果不一定要整对象比较，关键字段断言能更明确表达契约。"
  },
  {
    "title": "修复测试无法发现的实现",
    "task": "clamp(x,0,10) 对 -1 应0、5应5、20应10。修复函数并让三个 assert 通过。",
    "concept": "测试驱动定位逻辑缺口",
    "starter": "def clamp(x, low, high):\n    return x\n\nassert clamp(-1, 0, 10) == 0\nassert clamp(5, 0, 10) == 5\nassert clamp(20, 0, 10) == 10\nprint('passed')\n",
    "solution": "def clamp(x, low, high):\n    if x < low:\n        return low\n    if x > high:\n        return high\n    return x\n\nassert clamp(-1, 0, 10) == 0\nassert clamp(5, 0, 10) == 5\nassert clamp(20, 0, 10) == 10\nprint('passed')",
    "expected": "passed",
    "why": "测试失败应该推动你定位缺失的规则，而不是修改测试去迎合错误实现。"
  },
  {
    "title": "小型测试套件",
    "boss": true,
    "task": "实现 parse_port(text)：转 int，范围1..65535，否则 raise ValueError。编写4个测试：80成功、65535成功、0失败、abc失败。最后输出 tests=4 passed。",
    "concept": "正常路径、边界、异常和表驱动测试综合",
    "starter": "def parse_port(text):\n    pass\n\n# 编写 4 个测试\n",
    "solution": "def parse_port(text):\n    value = int(text)\n    if not 1 <= value <= 65535:\n        raise ValueError('port out of range')\n    return value\n\nassert parse_port('80') == 80\nassert parse_port('65535') == 65535\nfor bad in ['0', 'abc']:\n    try:\n        parse_port(bad)\n    except ValueError:\n        pass\n    else:\n        raise AssertionError('expected ValueError')\nprint('tests=4 passed')",
    "expected": "tests=4 passed",
    "must": [
      "assert",
      "try",
      "except"
    ],
    "why": "一个像样的测试套件必须覆盖代表性成功值、边界值和失败路径。",
    "bossReview": "你已经掌握断言、边界测试、异常测试、fake 依赖、表驱动测试和回归测试，可以用测试保护后续工程修改。"
  }
]);
