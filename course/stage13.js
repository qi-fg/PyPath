addEngineeringStage(13, [
  {
    "title": "处理日期",
    "task": "使用 datetime.date 创建 2026-10-01，并输出 2026-10-01。",
    "concept": "datetime.date",
    "starter": "from datetime import date\n# 创建日期\n",
    "solution": "from datetime import date\nd = date(2026, 10, 1)\nprint(d.isoformat())",
    "expected": "2026-10-01",
    "why": "datetime 提供结构化日期对象，避免手工拼接和解析日期字符串。"
  },
  {
    "title": "计算时间差",
    "task": "2026-10-01 加 7 天，输出 2026-10-08。",
    "concept": "timedelta",
    "starter": "from datetime import date, timedelta\nstart = date(2026, 10, 1)\n# 加 7 天\n",
    "solution": "from datetime import date, timedelta\nstart = date(2026, 10, 1)\nprint((start + timedelta(days=7)).isoformat())",
    "expected": "2026-10-08",
    "must": [
      "timedelta"
    ],
    "why": "timedelta 把时间间隔表示成可计算对象。"
  },
  {
    "title": "Counter 统计频率",
    "task": "用 Counter 统计 ['a','b','a','a']，输出 a 的次数 3。",
    "concept": "collections.Counter",
    "starter": "from collections import Counter\nitems = ['a', 'b', 'a', 'a']\n# 统计\n",
    "solution": "from collections import Counter\nitems = ['a', 'b', 'a', 'a']\n# 统计\n\nfrom collections import Counter\ncounts = Counter(items)\nprint(counts['a'])",
    "expected": "3",
    "must": [
      "Counter"
    ],
    "why": "Counter 是专门的频率统计容器，比手写计数字典更直接。"
  },
  {
    "title": "defaultdict 自动默认值",
    "task": "用 defaultdict(int) 统计 ['x','x','y']，输出 x=2。",
    "concept": "collections.defaultdict",
    "starter": "from collections import defaultdict\ncounts = defaultdict(int)\n# 统计\n",
    "solution": "from collections import defaultdict\ncounts = defaultdict(int)\nfor item in ['x', 'x', 'y']:\n    counts[item] += 1\nprint(counts['x'])",
    "expected": "2",
    "must": [
      "defaultdict"
    ],
    "why": "defaultdict 会为缺失键自动创建默认值，适合聚合。"
  },
  {
    "title": "deque 队列",
    "task": "deque(['a','b'])，append c，再 popleft，输出 a 和 ['b','c']。",
    "concept": "collections.deque 双端队列",
    "starter": "from collections import deque\nq = deque(['a', 'b'])\n# 入队并出队\n",
    "solution": "from collections import deque\nq = deque(['a', 'b'])\nq.append('c')\nfirst = q.popleft()\nprint(first)\nprint(list(q))",
    "expected": "a\n['b', 'c']",
    "must": [
      "deque"
    ],
    "why": "deque 在两端插入和删除都很高效，适合队列与任务调度。"
  },
  {
    "title": "zip 并行遍历",
    "task": "names=['A','B']、scores=[90,80]，输出 A 90、B 80。",
    "concept": "zip()",
    "starter": "names = ['A', 'B']\nscores = [90, 80]\n# 并行遍历\n",
    "solution": "names = ['A', 'B']\nscores = [90, 80]\n# 并行遍历\n\nfor name, score in zip(names, scores):\n    print(name, score)",
    "expected": "A 90\nB 80",
    "must": [
      "zip"
    ],
    "why": "zip 把多个序列按位置配对，避免手动下标同步。"
  },
  {
    "title": "itertools.chain 合并遍历",
    "task": "用 chain 遍历 [1,2] 和 [3,4]，输出 1 2 3 4 每行一个。",
    "concept": "itertools.chain",
    "starter": "from itertools import chain\n# 合并遍历两个列表\n",
    "solution": "from itertools import chain\nfor n in chain([1, 2], [3, 4]):\n    print(n)",
    "expected": "1\n2\n3\n4",
    "must": [
      "chain"
    ],
    "why": "chain 可以连续遍历多个可迭代对象，而不必先构造新大列表。"
  },
  {
    "title": "partial 预绑定参数",
    "task": "定义 power(base,exp)，用 partial 固定 exp=2 得到 square，输出 square(5)=25。",
    "concept": "functools.partial",
    "starter": "from functools import partial\ndef power(base, exp):\n    return base ** exp\n# 创建 square\n",
    "solution": "from functools import partial\ndef power(base, exp):\n    return base ** exp\nsquare = partial(power, exp=2)\nprint(square(5))",
    "expected": "25",
    "must": [
      "partial"
    ],
    "why": "partial 能把通用函数预配置成更具体的函数。"
  },
  {
    "title": "正则搜索",
    "task": "从 'id=123; user=Ada' 中用 re.search 提取 123。",
    "concept": "re.search 与捕获组",
    "starter": "import re\ntext = 'id=123; user=Ada'\n# 提取数字 id\n",
    "solution": "import re\ntext = 'id=123; user=Ada'\n# 提取数字 id\n\nimport re\nm = re.search(r'id=(\\d+)', text)\nprint(m.group(1))",
    "expected": "123",
    "must": [
      "re.search"
    ],
    "why": "正则适合从有模式的文本中查找和提取字段。"
  },
  {
    "title": "正则替换",
    "task": "把 'a   b  c' 中连续空白压缩成单个空格，输出 a b c。",
    "concept": "re.sub()",
    "starter": "import re\ntext = 'a   b  c'\n# 压缩空白\n",
    "solution": "import re\ntext = 'a   b  c'\n# 压缩空白\n\nimport re\nprint(re.sub(r'\\s+', ' ', text))",
    "expected": "a b c",
    "must": [
      "re.sub"
    ],
    "why": "re.sub 能一次处理符合模式的所有文本片段。"
  },
  {
    "title": "Path 拆分文件名",
    "task": "Path('/tmp/report.csv')，输出 report .csv。",
    "concept": "Path.stem 与 Path.suffix",
    "starter": "from pathlib import Path\np = Path('/tmp/report.csv')\n# 输出 stem 和 suffix\n",
    "solution": "from pathlib import Path\np = Path('/tmp/report.csv')\nprint(p.stem, p.suffix)",
    "expected": "report .csv",
    "why": "Path 提供结构化路径属性，避免自己 split 文件名字符串。"
  },
  {
    "title": "日志文本分析器",
    "boss": true,
    "task": "logs=['INFO start','ERROR db','INFO ok','ERROR timeout','ERROR auth']。用 Counter 统计级别，并用正则提取 ERROR 后消息。输出 errors=3 和 timeout=True。",
    "concept": "Counter、正则、字符串与遍历的标准库综合",
    "starter": "from collections import Counter\nimport re\nlogs = ['INFO start', 'ERROR db', 'INFO ok', 'ERROR timeout', 'ERROR auth']\n# 完成统计与提取\n",
    "solution": "from collections import Counter\nimport re\nlogs = ['INFO start', 'ERROR db', 'INFO ok', 'ERROR timeout', 'ERROR auth']\nlevels = Counter(line.split()[0] for line in logs)\nmessages = []\nfor line in logs:\n    m = re.match(r'ERROR\\s+(.+)', line)\n    if m:\n        messages.append(m.group(1))\nprint(f\"errors={levels['ERROR']}\")\nprint(f\"timeout={'timeout' in messages}\")",
    "expected": "errors=3\ntimeout=True",
    "must": [
      "Counter",
      "re."
    ],
    "why": "标准库工具可以把常见文本处理任务写得更短、更可靠。",
    "bossReview": "你已经接触 datetime、collections、itertools、functools、re 和 pathlib，工程脚本能力明显提升。"
  }
]);
