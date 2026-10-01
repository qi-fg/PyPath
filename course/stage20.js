addEngineeringStage(20, [
  {
    "title": "定义 Task 数据模型",
    "task": "用 dataclass Task(id,title,done=False)，创建 Task(1,'code') 并输出 1 code False。",
    "concept": "最终项目的数据模型",
    "starter": "from dataclasses import dataclass\n# 定义 Task\n",
    "solution": "from dataclasses import dataclass\n\n@dataclass\nclass Task:\n    id: int\n    title: str\n    done: bool = False\n\nt = Task(1, 'code')\nprint(t.id, t.title, t.done)",
    "expected": "1 code False",
    "why": "完整项目从明确的数据模型开始，后续存储和业务层都围绕它工作。"
  },
  {
    "title": "实现内存 Repository",
    "task": "TaskRepo.add(task) 保存任务；all() 返回副本。加入 code 后输出 code。",
    "concept": "最终项目的数据访问层",
    "starter": "class TaskRepo:\n    def __init__(self): self.items=[]\n    def add(self, task): pass\n    def all(self): pass\n\nrepo = TaskRepo()\nrepo.add({'title':'code'})\nprint(repo.all()[0]['title'])\n",
    "solution": "class TaskRepo:\n    def __init__(self): self.items=[]\n    def add(self, task): self.items.append(task)\n    def all(self): return self.items.copy()\n\nrepo = TaskRepo()\nrepo.add({'title':'code'})\nprint(repo.all()[0]['title'])",
    "expected": "code",
    "why": "Repository 负责存储细节，业务层不直接操作底层容器。"
  },
  {
    "title": "Service 自动分配 ID",
    "task": "TaskService.create(title) 从1开始自动分配id。创建 a、b 后输出 1 2。",
    "concept": "业务服务维护领域规则",
    "starter": "class TaskService:\n    def __init__(self):\n        self.next_id = 1\n        self.tasks = []\n    def create(self, title):\n        pass\n\ns = TaskService()\na = s.create('a')\nb = s.create('b')\nprint(a['id'], b['id'])\n",
    "solution": "class TaskService:\n    def __init__(self):\n        self.next_id = 1\n        self.tasks = []\n    def create(self, title):\n        task = {'id': self.next_id, 'title': title, 'done': False}\n        self.next_id += 1\n        self.tasks.append(task)\n        return task\n\ns = TaskService()\na = s.create('a')\nb = s.create('b')\nprint(a['id'], b['id'])",
    "expected": "1 2",
    "why": "ID 分配属于业务流程的一部分，应集中管理而不是让调用方随意传入。"
  },
  {
    "title": "标题校验",
    "task": "normalize_title('  code  ') 返回 code；空白字符串 raise ValueError。测试后输出 code invalid。",
    "concept": "输入边界与领域校验",
    "starter": "def normalize_title(text):\n    pass\n\nprint(normalize_title('  code  '))\ntry:\n    normalize_title('   ')\nexcept ValueError:\n    print('invalid')\n",
    "solution": "def normalize_title(text):\n    text = text.strip()\n    if not text:\n        raise ValueError('empty title')\n    return text\n\nprint(normalize_title('  code  '))\ntry:\n    normalize_title('   ')\nexcept ValueError:\n    print('invalid')",
    "expected": "code\ninvalid",
    "why": "在系统边界统一校验输入，能让内部业务逻辑假设更简单。"
  },
  {
    "title": "完成任务",
    "task": "complete(tasks,id) 找到对应任务设置 done=True，id=2 后输出 True。",
    "concept": "按标识更新实体状态",
    "starter": "tasks = [{'id':1,'done':False},{'id':2,'done':False}]\ndef complete(tasks, task_id):\n    pass\n\ncomplete(tasks, 2)\nprint(tasks[1]['done'])\n",
    "solution": "tasks = [{'id': 1, 'done': False}, {'id': 2, 'done': False}]\ndef complete(tasks, task_id):\n    for task in tasks:\n        if task['id'] == task_id:\n            task['done'] = True\n            return True\n    return False\n\ncomplete(tasks, 2)\nprint(tasks[1]['done'])",
    "expected": "True",
    "why": "更新实体时要通过稳定标识查找，并明确处理“找不到”情况。"
  },
  {
    "title": "筛选未完成任务",
    "task": "从三个任务中筛选 done=False，输出 ['a','c']。",
    "concept": "查询与过滤",
    "starter": "tasks = [{'title':'a','done':False},{'title':'b','done':True},{'title':'c','done':False}]\n# 筛选标题\n",
    "solution": "open_titles = [t['title'] for t in tasks if not t['done']]\nprint(open_titles)",
    "expected": "['a', 'c']",
    "why": "业务查询通常是对实体集合做过滤、排序和投影。"
  },
  {
    "title": "按 ID 排序",
    "task": "任务 id 为3,1,2，按id排序输出 [1,2,3]。",
    "concept": "sorted(key=...) 稳定排序",
    "starter": "tasks = [{'id':3},{'id':1},{'id':2}]\n# 排序并输出 id\n",
    "solution": "ordered = sorted(tasks, key=lambda t: t['id'])\nprint([t['id'] for t in ordered])",
    "expected": "[1, 2, 3]",
    "must": [
      "sorted",
      "lambda"
    ],
    "why": "展示层常需要稳定顺序，排序规则应显式写出。"
  },
  {
    "title": "JSON 序列化任务",
    "task": "task={'id':1,'title':'code','done':False}，json.dumps(sort_keys=True) 输出稳定 JSON。",
    "concept": "项目持久化边界",
    "starter": "import json\ntask = {'id':1,'title':'code','done':False}\n# 序列化\n",
    "solution": "import json\ntask = {'id':1,'title':'code','done':False}\nprint(json.dumps(task, sort_keys=True))",
    "expected": "{\"done\": false, \"id\": 1, \"title\": \"code\"}",
    "why": "持久化层需要把内部对象转换成稳定的外部格式。"
  },
  {
    "title": "命令解析",
    "task": "parse('add write tests') 返回 command='add'、arg='write tests'，输出 add | write tests。",
    "concept": "CLI 输入解析",
    "starter": "def parse(text):\n    pass\n\ncommand, arg = parse('add write tests')\nprint(command, '|', arg)\n",
    "solution": "def parse(text):\n    parts = text.strip().split(maxsplit=1)\n    command = parts[0]\n    arg = parts[1] if len(parts) > 1 else ''\n    return command, arg\n\ncommand, arg = parse('add write tests')\nprint(command, '|', arg)",
    "expected": "add | write tests",
    "why": "CLI 层负责把原始文本转换成业务层可以理解的命令与参数。"
  },
  {
    "title": "统计任务状态",
    "task": "三个任务中两个done=True。输出 total=3 done=2 open=1。",
    "concept": "项目状态聚合",
    "starter": "tasks = [{'done':True},{'done':False},{'done':True}]\n# 统计\n",
    "solution": "total = len(tasks)\ndone = sum(1 for t in tasks if t['done'])\nprint(f'total={total} done={done} open={total-done}')",
    "expected": "total=3 done=2 open=1",
    "why": "面向用户的摘要通常来自底层实体集合的聚合统计。"
  },
  {
    "title": "为核心规则写测试",
    "task": "定义 is_valid_title(text)=strip后非空。用三个 assert 测试 'a' True、'  ' False、' x ' True，输出 tests passed。",
    "concept": "最终项目回归测试",
    "starter": "def is_valid_title(text):\n    pass\n\n# 三个测试\n",
    "solution": "def is_valid_title(text):\n    return bool(text.strip())\n\nassert is_valid_title('a') is True\nassert is_valid_title('  ') is False\nassert is_valid_title(' x ') is True\nprint('tests passed')",
    "expected": "tests passed",
    "must": [
      "assert"
    ],
    "why": "最终项目的关键规则必须有自动测试保护，才能安全重构。"
  },
  {
    "title": "PyTask 完整应用",
    "boss": true,
    "task": "完成一个内存任务应用：Task dataclass；Repo add/all/find；Service create/complete/stats；创建 code、test，完成第1项。最终输出两行：1 code True、2 test False，再输出 total=2 done=1 open=1。",
    "concept": "数据模型、Repository、Service、校验、状态更新、查询与统计的完整工程组合",
    "starter": "from dataclasses import dataclass\n\n@dataclass\nclass Task:\n    id: int\n    title: str\n    done: bool = False\n\nclass Repo:\n    def __init__(self):\n        self.items = []\n    def add(self, task):\n        pass\n    def all(self):\n        pass\n    def find(self, task_id):\n        pass\n\nclass Service:\n    def __init__(self, repo):\n        pass\n    def create(self, title):\n        pass\n    def complete(self, task_id):\n        pass\n    def stats(self):\n        pass\n\nrepo = Repo()\nservice = Service(repo)\nservice.create(' code ')\nservice.create('test')\nservice.complete(1)\nfor task in service.repo.all():\n    print(task.id, task.title, task.done)\nprint(service.stats())\n",
    "solution": "from dataclasses import dataclass\n\n@dataclass\nclass Task:\n    id: int\n    title: str\n    done: bool = False\n\nclass Repo:\n    def __init__(self):\n        self.items = []\n    def add(self, task):\n        self.items.append(task)\n    def all(self):\n        return self.items.copy()\n    def find(self, task_id):\n        return next((t for t in self.items if t.id == task_id), None)\n\nclass Service:\n    def __init__(self, repo):\n        self.repo = repo\n    def create(self, title):\n        title = title.strip()\n        if not title:\n            raise ValueError('empty title')\n        task = Task(len(self.repo.all()) + 1, title)\n        self.repo.add(task)\n        return task\n    def complete(self, task_id):\n        task = self.repo.find(task_id)\n        if task is None:\n            raise KeyError(task_id)\n        task.done = True\n    def stats(self):\n        items = self.repo.all()\n        total = len(items)\n        done = sum(1 for t in items if t.done)\n        return f'total={total} done={done} open={total-done}'\n\nrepo = Repo()\nservice = Service(repo)\nservice.create(' code ')\nservice.create('test')\nservice.complete(1)\nfor task in service.repo.all():\n    print(task.id, task.title, task.done)\nprint(service.stats())",
    "expected": "1 code True\n2 test False\ntotal=2 done=1 open=1",
    "must": [
      "dataclass",
      "class",
      "def"
    ],
    "why": "最终 BOSS 把数据模型、数据访问层、业务服务、校验、状态变化和统计全部组合在一个清晰的小型架构中。",
    "bossReview": "主线通关：你已经从 Python 基础一路走到工程建模、持久化、API 思维、测试、配置、高级语法和分层架构。接下来你具备进入真实 Python 项目、阅读代码、定位问题并修改功能的基础。"
  }
]);
