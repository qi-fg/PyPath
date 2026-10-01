addEngineeringStage(19, [
  {
    "title": "把计算写成纯函数",
    "task": "定义 discount(price,rate) 只返回计算结果，不修改外部变量；100,0.2 输出80.0。",
    "concept": "pure function 纯函数",
    "starter": "def discount(price, rate):\n    pass\n\nprint(discount(100, 0.2))\n",
    "solution": "def discount(price, rate):\n    return price * (1 - rate)\n\nprint(discount(100, 0.2))",
    "expected": "80.0",
    "why": "纯函数只依赖输入并返回输出，更容易测试、复用和推理。"
  },
  {
    "title": "使用 guard clause",
    "task": "validate_age(age) 对 age<0 立即返回 invalid，否则 ok；-1 输出 invalid。",
    "concept": "guard clause 早返回减少嵌套",
    "starter": "def validate_age(age):\n    # 用早返回\n    pass\n\nprint(validate_age(-1))\n",
    "solution": "def validate_age(age):\n    if age < 0:\n        return 'invalid'\n    return 'ok'\n\nprint(validate_age(-1))",
    "expected": "invalid",
    "why": "先处理异常情况并返回，可以让主要路径保持平直易读。"
  },
  {
    "title": "消除重复逻辑",
    "task": "定义 format_user(name,role)，让两个用户统一格式输出 Ada(admin)、Bob(editor)。",
    "concept": "DRY 抽取重复行为",
    "starter": "# 抽取公共格式函数\n",
    "solution": "def format_user(name, role):\n    return f'{name}({role})'\n\nprint(format_user('Ada', 'admin'))\nprint(format_user('Bob', 'editor'))",
    "expected": "Ada(admin)\nBob(editor)",
    "why": "真正重复的规则应集中在一个位置，避免未来修改时漏改某一份。"
  },
  {
    "title": "Repository 隔离数据访问",
    "task": "MemoryRepo.all() 返回内部列表副本；加入 a 后输出 ['a']。",
    "concept": "repository 把存储细节与业务逻辑隔离",
    "starter": "class MemoryRepo:\n    def __init__(self):\n        self.items = []\n    def add(self, item):\n        pass\n    def all(self):\n        pass\n\nrepo = MemoryRepo()\nrepo.add('a')\nprint(repo.all())\n",
    "solution": "class MemoryRepo:\n    def __init__(self):\n        self.items = []\n    def add(self, item):\n        self.items.append(item)\n    def all(self):\n        return self.items.copy()\n\nrepo = MemoryRepo()\nrepo.add('a')\nprint(repo.all())",
    "expected": "['a']",
    "why": "Repository 让业务代码不必知道数据来自内存、文件还是数据库。"
  },
  {
    "title": "Service 负责业务规则",
    "task": "TaskService.create(title) 拒绝空标题，否则交给 repo.add。创建 code 后输出 ['code']。",
    "concept": "service layer 业务服务层",
    "starter": "class Repo:\n    def __init__(self): self.items=[]\n    def add(self, x): self.items.append(x)\n\nclass TaskService:\n    def __init__(self, repo):\n        self.repo = repo\n    def create(self, title):\n        pass\n\nrepo = Repo()\nservice = TaskService(repo)\nservice.create('code')\nprint(repo.items)\n",
    "solution": "class TaskService:\n    def __init__(self, repo):\n        self.repo = repo\n    def create(self, title):\n        title = title.strip()\n        if not title:\n            raise ValueError('empty title')\n        self.repo.add(title)\n\nrepo = Repo()\nservice = TaskService(repo)\nservice.create('code')\nprint(repo.items)",
    "expected": "['code']",
    "why": "Service 聚合业务规则，Repository 只负责数据存取，职责边界更清楚。"
  },
  {
    "title": "依赖注入",
    "task": "Notifier(sender) 保存外部 sender；notify('hi') 调用 sender('hi')。用 fake 收集消息并输出 ['hi']。",
    "concept": "dependency injection 依赖注入",
    "starter": "class Notifier:\n    def __init__(self, sender):\n        pass\n    def notify(self, text):\n        pass\n\nsent = []\ndef fake(text):\n    sent.append(text)\n\nNotifier(fake).notify('hi')\nprint(sent)\n",
    "solution": "class Notifier:\n    def __init__(self, sender):\n        self.sender = sender\n    def notify(self, text):\n        self.sender(text)\n\nsent = []\ndef fake(text):\n    sent.append(text)\n\nNotifier(fake).notify('hi')\nprint(sent)",
    "expected": "['hi']",
    "why": "把依赖从外部传入，可以替换实现并显著提升可测试性。"
  },
  {
    "title": "DTO 数据对象",
    "task": "用 dataclass UserDTO(name,active) 创建 Ada True，并输出字段。",
    "concept": "DTO 明确跨层数据结构",
    "starter": "from dataclasses import dataclass\n# 定义 UserDTO\n",
    "solution": "from dataclasses import dataclass\n\n@dataclass\nclass UserDTO:\n    name: str\n    active: bool\n\nu = UserDTO('Ada', True)\nprint(u.name, u.active)",
    "expected": "Ada True",
    "why": "显式数据对象比不受约束的字典更容易理解层间契约。"
  },
  {
    "title": "适配外部数据",
    "task": "外部数据 {'full_name':'Ada'}，写 adapt_user 转成 {'name':'Ada'} 并输出 Ada。",
    "concept": "adapter 适配器隔离外部格式",
    "starter": "external = {'full_name': 'Ada'}\n\ndef adapt_user(data):\n    pass\n\nprint(adapt_user(external)['name'])\n",
    "solution": "def adapt_user(data):\n    return {'name': data['full_name']}\n\nprint(adapt_user(external)['name'])",
    "expected": "Ada",
    "why": "适配层把外部格式变化限制在边界，不让整个业务代码跟着第三方接口变化。"
  },
  {
    "title": "避免全局可变状态",
    "task": "把全局 tasks=[] 改成函数参数，add_task(tasks,'a') 返回新列表 ['a']，原列表仍 []。",
    "concept": "显式数据流优于隐式全局状态",
    "starter": "tasks = []\n\ndef add_task(title):\n    tasks.append(title)\n    return tasks\n\nresult = add_task('a')\nprint(tasks)\nprint(result)\n",
    "solution": "tasks = []\n\ndef add_task(items, title):\n    result = items.copy()\n    result.append(title)\n    return result\n\nresult = add_task(tasks, 'a')\nprint(tasks)\nprint(result)",
    "expected": "[]\n['a']",
    "why": "全局可变状态让函数之间产生隐式耦合，显式参数和返回值更容易追踪。"
  },
  {
    "title": "集中业务常量",
    "task": "定义 MAX_RETRIES=3，函数 can_retry(attempt) 用它判断 attempt<MAX_RETRIES；2 输出 True。",
    "concept": "named constants 避免 magic number",
    "starter": "# 定义常量并使用\n",
    "solution": "MAX_RETRIES = 3\n\ndef can_retry(attempt):\n    return attempt < MAX_RETRIES\n\nprint(can_retry(2))",
    "expected": "True",
    "why": "有业务含义的数字应该有名字，便于理解和统一修改。"
  },
  {
    "title": "修复职责混乱函数",
    "task": "原函数同时清洗、校验、格式化。拆成 normalize 与 format_name 两个函数，输入 ' ada ' 输出 ADA。",
    "concept": "single responsibility 单一职责",
    "starter": "def process_name(text):\n    text = text.strip()\n    if not text:\n        raise ValueError()\n    return text.upper()\n\n# 拆成两个函数并调用\n",
    "solution": "def normalize(text):\n    text = text.strip()\n    if not text:\n        raise ValueError()\n    return text\n\ndef format_name(text):\n    return text.upper()\n\nprint(format_name(normalize(' ada ')))",
    "expected": "ADA",
    "why": "把不同变化原因拆成独立函数，会让测试和复用更简单。"
  },
  {
    "title": "分层任务服务",
    "boss": true,
    "task": "实现 MemoryTaskRepo.add/all；TaskService.create 清洗标题、拒绝空标题并注入 repo；service.list_titles 返回标题列表。创建 code 和 test，输出 ['code', 'test']。",
    "concept": "Repository、Service、依赖注入、校验与 DTO 思维综合",
    "starter": "class MemoryTaskRepo:\n    def __init__(self):\n        self.tasks = []\n    def add(self, task):\n        pass\n    def all(self):\n        pass\n\nclass TaskService:\n    def __init__(self, repo):\n        pass\n    def create(self, title):\n        pass\n    def list_titles(self):\n        pass\n\nrepo = MemoryTaskRepo()\nservice = TaskService(repo)\nservice.create(' code ')\nservice.create('test')\nprint(service.list_titles())\n",
    "solution": "class MemoryTaskRepo:\n    def __init__(self):\n        self.tasks = []\n    def add(self, task):\n        self.tasks.append(task)\n    def all(self):\n        return self.tasks.copy()\n\nclass TaskService:\n    def __init__(self, repo):\n        self.repo = repo\n    def create(self, title):\n        title = title.strip()\n        if not title:\n            raise ValueError('empty title')\n        self.repo.add({'title': title})\n    def list_titles(self):\n        return [task['title'] for task in self.repo.all()]\n\nrepo = MemoryTaskRepo()\nservice = TaskService(repo)\nservice.create(' code ')\nservice.create('test')\nprint(service.list_titles())",
    "expected": "['code', 'test']",
    "must": [
      "class",
      "repo"
    ],
    "why": "分层的价值不是文件变多，而是每层职责和依赖方向清楚，从而更容易替换存储、测试业务规则。",
    "bossReview": "你已经开始用工程架构思考代码：纯函数、早返回、Repository、Service、依赖注入、DTO、Adapter 和单一职责。"
  }
]);
