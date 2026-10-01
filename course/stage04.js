addEngineeringStage(4, [
  {
    "title": "直接遍历列表",
    "task": "依次输出列表中的 api、db、cache，每项一行。",
    "concept": "for 直接遍历元素",
    "starter": "services = ['api', 'db', 'cache']\n# 遍历输出\n",
    "solution": "for service in services:\n    print(service)",
    "expected": "api\ndb\ncache",
    "must": [
      "for"
    ],
    "why": "只需要元素本身时，直接遍历容器最清楚。",
    "walk": "service 依次绑定三个字符串，循环体执行三次。",
    "hint1": "不要先写下标。",
    "hint2": "for service in services。",
    "takeaway": "优先遍历值，而不是无必要地遍历下标。"
  },
  {
    "title": "用 range 生成次数",
    "task": "输出 1、2、3、4，每个数字一行。",
    "concept": "range(start, stop) 左闭右开",
    "starter": "# 使用 range\n",
    "solution": "for n in range(1, 5):\n    print(n)",
    "expected": "1\n2\n3\n4",
    "must": [
      "range"
    ],
    "why": "range 适合生成规则整数序列。",
    "walk": "range(1,5) 产生 1、2、3、4，stop=5 不包含。",
    "hint1": "最后要输出 4。",
    "hint2": "stop 应该写 5。",
    "takeaway": "range 的 stop 通常不包含。"
  },
  {
    "title": "使用循环累加",
    "task": "计算 1 到 5 的总和并输出 15。",
    "concept": "累加器模式",
    "starter": "total = 0\n# 循环累加\n\nprint(total)\n",
    "solution": "total = 0\nfor n in range(1, 6):\n    total += n\nprint(total)",
    "expected": "15",
    "why": "累加器从中性值 0 开始，在每次循环中基于旧值更新。",
    "walk": "total 按 0→1→3→6→10→15 变化。",
    "hint1": "先准备 total=0。",
    "hint2": "每次 total += n。",
    "takeaway": "累计总和是工程数据处理中的基本模式。"
  },
  {
    "title": "使用循环计数",
    "task": "统计 [2,5,8,9,12] 中偶数个数，输出 3。",
    "concept": "计数器 + 条件判断",
    "starter": "nums = [2, 5, 8, 9, 12]\ncount = 0\n# 统计偶数\n\nprint(count)\n",
    "solution": "nums = [2, 5, 8, 9, 12]\ncount = 0\nfor n in nums:\n    if n % 2 == 0:\n        count += 1\nprint(count)",
    "expected": "3",
    "must": [
      "for",
      "if"
    ],
    "why": "计数器只在目标条件成立时增加。",
    "walk": "2、8、12 满足 n%2==0，因此 count 最终为 3。",
    "hint1": "偶数余数为 0。",
    "hint2": "只有条件成立时 count += 1。",
    "takeaway": "计数和累加的区别在于：计数加的是 1，累加加的是数据值。"
  },
  {
    "title": "第一次 while",
    "task": "使用 while 输出 3、2、1。",
    "concept": "while 条件循环",
    "starter": "n = 3\n# 使用 while 倒数\n",
    "solution": "n = 3\nwhile n > 0:\n    print(n)\n    n -= 1",
    "expected": "3\n2\n1",
    "must": [
      "while"
    ],
    "why": "while 适合不知道固定次数、但知道继续条件的循环。",
    "walk": "每轮输出 n 后减 1，n 变成 0 时条件失败并结束。",
    "hint1": "继续条件是 n > 0。",
    "hint2": "每轮必须修改 n。",
    "takeaway": "while 最重要的是确保循环条件最终会变成 False。"
  },
  {
    "title": "break 提前停止",
    "task": "遍历 1 到 9，找到第一个能被 4 整除的数，输出 4 后停止。",
    "concept": "break 提前终止循环",
    "starter": "# 找到第一个符合条件的数\n",
    "solution": "for n in range(1, 10):\n    if n % 4 == 0:\n        print(n)\n        break",
    "expected": "4",
    "must": [
      "break"
    ],
    "why": "找到第一个目标后继续循环只会浪费工作，break 可以立即结束。",
    "walk": "1、2、3 不满足；4 满足后输出并 break，5 以后不再检查。",
    "hint1": "先写能被 4 整除的判断。",
    "hint2": "输出之后立刻 break。",
    "takeaway": "搜索第一个匹配项时，break 是常见控制手段。"
  },
  {
    "title": "continue 跳过当前项",
    "task": "遍历 1 到 5，跳过 3，输出 1、2、4、5。",
    "concept": "continue 跳过本轮剩余代码",
    "starter": "# 跳过数字 3\n",
    "solution": "for n in range(1, 6):\n    if n == 3:\n        continue\n    print(n)",
    "expected": "1\n2\n4\n5",
    "must": [
      "continue"
    ],
    "why": "continue 适合把不需要处理的元素尽早过滤掉。",
    "walk": "当 n=3 时直接进入下一轮，因此 print 不执行；其他值正常输出。",
    "hint1": "判断 n == 3。",
    "hint2": "continue 要放在 print 前面。",
    "takeaway": "用早跳过可以减少循环体里的嵌套层级。"
  },
  {
    "title": "enumerate 同时拿下标和值",
    "task": "遍历 ['a','b','c']，输出 0 a、1 b、2 c。",
    "concept": "enumerate()",
    "starter": "items = ['a', 'b', 'c']\n# 同时得到索引和值\n",
    "solution": "for i, item in enumerate(items):\n    print(i, item)",
    "expected": "0 a\n1 b\n2 c",
    "must": [
      "enumerate"
    ],
    "why": "需要索引和值时，enumerate 比 range(len(...)) 更直接。",
    "walk": "enumerate 每轮提供一对索引和元素。",
    "hint1": "使用 enumerate(items)。",
    "hint2": "循环变量需要两个：i, item。",
    "takeaway": "enumerate 是 Python 工程代码中非常高频的遍历工具。"
  },
  {
    "title": "嵌套循环组合数据",
    "task": "对 users=['A','B'] 和 envs=['dev','prod'] 输出 A-dev、A-prod、B-dev、B-prod。",
    "concept": "嵌套 for",
    "starter": "users = ['A', 'B']\nenvs = ['dev', 'prod']\n# 组合输出\n",
    "solution": "for user in users:\n    for env in envs:\n        print(f'{user}-{env}')",
    "expected": "A-dev\nA-prod\nB-dev\nB-prod",
    "must": [
      "for"
    ],
    "why": "当任务需要两个维度的所有组合时，可以使用嵌套循环。",
    "walk": "外层先固定 A，内层遍历 dev/prod；再固定 B 重复。",
    "hint1": "需要两层 for。",
    "hint2": "内层循环缩进到外层内部。",
    "takeaway": "嵌套循环的总次数通常是各层次数的乘积。"
  },
  {
    "title": "不用 max 手动找最大值",
    "task": "在 [3,9,4,7] 中用循环找到最大值并输出 9，不使用 max()。",
    "concept": "扫描与当前最佳值",
    "starter": "nums = [3, 9, 4, 7]\nbest = nums[0]\n# 更新 best\n\nprint(best)\n",
    "solution": "nums = [3, 9, 4, 7]\nbest = nums[0]\nfor n in nums[1:]:\n    if n > best:\n        best = n\nprint(best)",
    "expected": "9",
    "must": [
      "for",
      "if"
    ],
    "why": "很多算法都使用“当前最佳值”模式逐步扫描数据。",
    "walk": "best 从 3 开始；遇到 9 更新为 9；4 和 7 都不再超过它。",
    "hint1": "best 先用第一个元素。",
    "hint2": "只有 n > best 时才更新。",
    "takeaway": "掌握扫描模式后，你会更容易理解最大值、最小值和搜索算法。"
  },
  {
    "title": "修复无限循环",
    "task": "下面 while 会无限循环。只做必要修改，让它输出 1、2、3 后结束。",
    "concept": "while 状态更新与终止条件",
    "starter": "n = 1\nwhile n <= 3:\n    print(n)\n",
    "solution": "n = 1\nwhile n <= 3:\n    print(n)\n    n += 1",
    "expected": "1\n2\n3",
    "must": [
      "while"
    ],
    "why": "while 依赖条件变化，如果循环体不更新相关状态，条件会永远保持 True。",
    "walk": "每次输出后 n 加 1，最终 n=4，使 n<=3 变为 False。",
    "hint1": "问题不是条件本身。",
    "hint2": "每轮都要让 n 发生变化。",
    "takeaway": "写 while 时第一时间确认：什么代码会让循环结束？"
  },
  {
    "title": "服务延迟统计器",
    "boss": true,
    "task": "给定 latencies=[120,80,250,90,150]。用一个循环计算总和、统计 >100 的慢请求数量、找到最大延迟。输出三行：avg=138.0、slow=3、max=250",
    "concept": "循环中的累加、计数、条件和最佳值综合",
    "starter": "latencies = [120, 80, 250, 90, 150]\ntotal = 0\nslow = 0\nhighest = latencies[0]\n\n# 只遍历一次完成三个统计\n\nprint(f'avg={total / len(latencies):.1f}')\nprint(f'slow={slow}')\nprint(f'max={highest}')\n",
    "solution": "latencies = [120, 80, 250, 90, 150]\ntotal = 0\nslow = 0\nhighest = latencies[0]\nfor ms in latencies:\n    total += ms\n    if ms > 100:\n        slow += 1\n    if ms > highest:\n        highest = ms\nprint(f'avg={total / len(latencies):.1f}')\nprint(f'slow={slow}')\nprint(f'max={highest}')",
    "expected": "avg=138.0\nslow=3\nmax=250",
    "must": [
      "for",
      "if"
    ],
    "why": "一次遍历可以同时维护多个独立状态，避免对同一批数据重复扫描。",
    "walk": "每轮都更新 total；只对慢请求更新 slow；只在更大值出现时更新 highest。",
    "hint1": "三个统计量在同一轮里分别更新。",
    "hint2": "total 每次都加，slow/highest 要带条件。",
    "takeaway": "工程数据处理常见模式就是一次扫描维护多个聚合状态。",
    "bossReview": "你已经掌握 for、while、range、break、continue、enumerate，以及累加、计数和扫描模式。"
  }
]);
