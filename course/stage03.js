addEngineeringStage(3, [
  {
    "title": "比较两个数字",
    "task": "a=12，b=8，输出 a > b 的结果。",
    "concept": "比较运算符 > < == != >= <=",
    "starter": "a = 12\nb = 8\n# 输出比较结果\n",
    "solution": "a = 12\nb = 8\n# 输出比较结果\n\nprint(a > b)",
    "expected": "True",
    "why": "比较表达式的结果是布尔值 True 或 False。",
    "walk": "读取 12 和 8，判断 12 > 8 成立，得到 True。",
    "hint1": "不需要 if。",
    "hint2": "直接 print(a > b)。",
    "takeaway": "条件判断的基础是能产生布尔值的表达式。"
  },
  {
    "title": "第一次 if",
    "task": "score=85，score >= 60 时输出 pass。",
    "concept": "if 条件与缩进代码块",
    "starter": "score = 85\n# 写 if\n",
    "solution": "score = 85\n# 写 if\n\nif score >= 60:\n    print('pass')",
    "expected": "pass",
    "must": [
      "if"
    ],
    "why": "if 只在条件为 True 时执行其缩进代码块。",
    "walk": "score>=60 得到 True，因此执行缩进的 print。",
    "hint1": "条件写 score >= 60。",
    "hint2": "if 行末要有冒号，下一行要缩进。",
    "takeaway": "冒号和缩进共同定义 Python 代码块。"
  },
  {
    "title": "if / else 两条路径",
    "task": "age=16，小于18输出 minor，否则输出 adult。",
    "concept": "else 处理条件不成立情况",
    "starter": "age = 16\n# 写 if / else\n",
    "solution": "age = 16\n# 写 if / else\n\nif age < 18:\n    print('minor')\nelse:\n    print('adult')",
    "expected": "minor",
    "must": [
      "if",
      "else"
    ],
    "why": "互斥的两种结果适合使用 if/else。",
    "walk": "age<18 成立，所以进入 if 分支，else 不执行。",
    "hint1": "先判断 age < 18。",
    "hint2": "else 不需要再写条件。",
    "takeaway": "一组 if/else 只会执行其中一个分支。"
  },
  {
    "title": "elif 多分支",
    "task": "score=82。>=90 输出 A，>=80 输出 B，否则 C。",
    "concept": "elif 与从上到下的分支匹配",
    "starter": "score = 82\n# 写三档判断\n",
    "solution": "score = 82\n# 写三档判断\n\nif score >= 90:\n    print('A')\nelif score >= 80:\n    print('B')\nelse:\n    print('C')",
    "expected": "B",
    "must": [
      "elif"
    ],
    "why": "多个互斥区间应该按顺序判断，并在第一次匹配后停止。",
    "walk": "82 不满足第一档，满足第二档，于是输出 B。",
    "hint1": "先判断更高的分数段。",
    "hint2": "第二档用 elif score >= 80。",
    "takeaway": "区间判断顺序会影响结果。"
  },
  {
    "title": "and：必须同时成立",
    "task": "入场规则：年龄至少 18 岁（含 18 岁）且持有门票。给定 age=20、has_ticket=True，符合规则时输出 enter，否则不输出。",
    "concept": "and 逻辑与",
    "starter": "age = 20\nhas_ticket = True\n# 判断两个条件\n",
    "solution": "age = 20\nhas_ticket = True\n# 判断两个条件\n\nif age >= 18 and has_ticket:\n    print('enter')",
    "expected": "enter",
    "must": [
      "and"
    ],
    "why": "age >= 18 判断是否达到最低年龄，has_ticket 判断是否有票。and 要求两者同时成立。18、19、20 岁都有票时均可进入；17 岁或无票时不输出。",
    "walk": "当前 age=20：20 >= 18 为 True；has_ticket=True；True and True 为 True，输出 enter。若 age=19，19 >= 18 仍为 True；若 age=17 或 has_ticket=False，条件为 False，不输出。",
    "hint1": "先分别写出年龄至少 18 岁、有票两个条件。",
    "hint2": "使用 age >= 18 and has_ticket；不是 age == 20。",
    "takeaway": "复杂规则通常由多个简单布尔条件组合而成。"
  },
  {
    "title": "or：满足一个即可",
    "task": "is_admin=False，is_owner=True。任意一个成立就输出 edit。",
    "concept": "or 逻辑或",
    "starter": "is_admin = False\nis_owner = True\n# 判断权限\n",
    "solution": "is_admin = False\nis_owner = True\n# 判断权限\n\nif is_admin or is_owner:\n    print('edit')",
    "expected": "edit",
    "must": [
      "or"
    ],
    "why": "or 只要求至少一个条件为 True。",
    "walk": "虽然 is_admin 为 False，但 is_owner 为 True，所以整体仍为 True。",
    "hint1": "不是两个都要成立。",
    "hint2": "使用 or。",
    "takeaway": "权限规则里要分清“同时满足”和“任一满足”。"
  },
  {
    "title": "not：反转布尔值",
    "task": "logged_in=False。未登录时输出 login required。",
    "concept": "not 逻辑非",
    "starter": "logged_in = False\n# 判断未登录\n",
    "solution": "logged_in = False\n# 判断未登录\n\nif not logged_in:\n    print('login required')",
    "expected": "login required",
    "must": [
      "not"
    ],
    "why": "not 会反转一个布尔条件。",
    "walk": "logged_in 为 False，not False 变成 True，因此执行输出。",
    "hint1": "你要表达的是“不是已登录”。",
    "hint2": "写 not logged_in。",
    "takeaway": "not 能让否定条件更接近自然语言。"
  },
  {
    "title": "使用 in 做成员判断",
    "task": "role='editor'，allowed=['admin','editor']。如果 role 在 allowed 中输出 allowed。",
    "concept": "in 成员运算",
    "starter": "role = 'editor'\nallowed = ['admin', 'editor']\n# 判断成员\n",
    "solution": "role = 'editor'\nallowed = ['admin', 'editor']\n# 判断成员\n\nif role in allowed:\n    print('allowed')",
    "expected": "allowed",
    "must": [
      "in"
    ],
    "why": "in 可以直接表达“某值是否存在于容器中”。",
    "walk": "列表 allowed 中包含 editor，因此成员判断为 True。",
    "hint1": "不需要写两个 ==。",
    "hint2": "使用 role in allowed。",
    "takeaway": "多个可接受值通常用容器 + in 比长串 or 更清晰。"
  },
  {
    "title": "嵌套条件",
    "task": "user_ok=True，quota=2。只有用户有效且 quota>0 时输出 run。",
    "concept": "嵌套 if 与分层规则",
    "starter": "user_ok = True\nquota = 2\n# 使用嵌套 if\n",
    "solution": "user_ok = True\nquota = 2\n# 使用嵌套 if\n\nif user_ok:\n    if quota > 0:\n        print('run')",
    "expected": "run",
    "must": [
      "if"
    ],
    "why": "嵌套 if 可以表达先满足外层前提，再判断更具体条件。",
    "walk": "先通过 user_ok，再进入第二层判断 quota>0，最终输出 run。",
    "hint1": "先检查 user_ok。",
    "hint2": "第二个 if 要缩进到第一个 if 内部。",
    "takeaway": "嵌套适合有明显前置条件的业务规则，但层级过深时应重构。"
  },
  {
    "title": "条件表达式",
    "task": "给定 score=70。规则：score >= 60 时 status 为 'pass'，否则为 'fail'。用一行条件表达式赋值给 status，再输出 status。",
    "concept": "条件表达式 x if cond else y",
    "starter": "score = 70\n# 一行得到 status\n\nprint(status)\n",
    "solution": "score = 70\nstatus = 'pass' if score >= 60 else 'fail'\nprint(status)",
    "expected": "pass",
    "why": "简单的二选一赋值可以用条件表达式保持简洁。",
    "walk": "条件 score>=60 为 True，所以表达式选择左侧 pass。",
    "hint1": "格式是 值1 if 条件 else 值2。",
    "hint2": "左侧写 pass。",
    "takeaway": "条件表达式适合简单赋值，不适合复杂多步骤逻辑。"
  },
  {
    "title": "修复边界条件 Bug",
    "task": "入场规则：年龄至少 18 岁（含 18 岁）时输出 allow，否则输出 deny。给定 age=18，修复代码，使其符合规则。",
    "concept": "边界值与 >= / >",
    "starter": "age = 18\nif age > 18:\n    print('allow')\nelse:\n    print('deny')\n",
    "solution": "age = 18\nif age >= 18:\n    print('allow')\nelse:\n    print('deny')",
    "expected": "allow",
    "why": "边界值最容易暴露比较运算符选择错误。",
    "walk": "规则包含 18 本身，所以条件必须使用 >=。",
    "hint1": "测试值正好等于边界。",
    "hint2": "规则写的是“及以上”。",
    "takeaway": "写条件时一定要专门测试临界值。"
  },
  {
    "title": "权限决策器",
    "boss": true,
    "task": "给定 role='editor'、active=True、banned=False。active 为真、未被 banned，且 role 属于 admin/editor 时输出 access granted，否则 access denied。",
    "concept": "比较、成员判断与布尔逻辑的综合组合",
    "starter": "role = 'editor'\nactive = True\nbanned = False\n\n# 完成权限判断\n",
    "solution": "role = 'editor'\nactive = True\nbanned = False\nif active and not banned and role in ['admin', 'editor']:\n    print('access granted')\nelse:\n    print('access denied')",
    "expected": "access granted",
    "must": [
      "and",
      "not",
      "in",
      "if"
    ],
    "why": "真实权限系统通常需要同时组合状态、黑名单和角色集合。",
    "walk": "active=True；not banned=True；role 成员判断=True；三个条件通过 and 组合仍为 True。",
    "hint1": "先分别判断三个规则。",
    "hint2": "角色集合适合用 in，封禁状态适合用 not。",
    "takeaway": "复杂条件先拆成可解释的小条件，再组合，避免写出难读的一长串逻辑。",
    "bossReview": "你已经能把多个布尔规则组合成完整决策流程，并且知道如何检查边界值。"
  }
]);
