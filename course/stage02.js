addStageLessons(2, [
  {
    title: '比较两个数字',
    task: 'a = 12，b = 8。判断 a 是否大于 b，并输出 True。',
    concept: '<code>&gt;</code>、<code>&lt;</code>、<code>==</code> 会得到 True 或 False。',
    starter: 'a = 12\nb = 8\n\n# 输出 a 是否大于 b\n',
    expected: 'True',
    hints: ['先写出比较表达式 a > b。', '比较表达式本身就会得到布尔值。', '试试：print(a > b)']
  },
  {
    title: 'if / else 两条路',
    task: 'age = 16。小于 18 时输出：未成年；否则输出：成年人。',
    concept: '<code>else</code> 处理 if 条件不成立的情况。',
    starter: 'age = 16\n\n# 写 if / else\n',
    expected: '未成年',
    hints: ['条件可以写 age < 18。', 'else 后面也要写冒号。', 'if age < 18:\n    print("未成年")\nelse:\n    print("成年人")']
  },
  {
    title: 'elif 多分支判断',
    task: 'score = 82。90 及以上输出 A；80 及以上输出 B；否则输出 C。',
    concept: '<code>elif</code> 会在前面的条件不成立时继续判断。',
    starter: 'score = 82\n\n# 使用 if / elif / else\n',
    expected: 'B',
    hints: ['先判断最高区间 score >= 90。', '再判断 score >= 80。', '最后用 else。']
  },
  {
    title: 'and：两个条件都要成立',
    task: 'age = 20，has_ticket = True。只有年龄至少 18 且有票时输出：允许进入',
    concept: '<code>and</code> 要求左右两边都为 True。',
    starter: 'age = 20\nhas_ticket = True\n\n# 同时检查两个条件\n',
    expected: '允许进入',
    codeMustInclude: ['and'],
    hints: ['需要同时检查两个条件。', '用 and 连接 age >= 18 与 has_ticket。', 'if age >= 18 and has_ticket:\n    print("允许进入")']
  },
  {
    title: 'or：满足一个就可以',
    task: 'is_admin = False，is_owner = True。只要其中一个为 True 就输出：可以修改',
    concept: '<code>or</code> 只要求至少一个条件为 True。',
    starter: 'is_admin = False\nis_owner = True\n\n# 使用 or 判断\n',
    expected: '可以修改',
    codeMustInclude: ['or'],
    hints: ['两个条件不需要同时成立。', '使用 is_admin or is_owner。', 'if is_admin or is_owner:\n    print("可以修改")']
  },
  {
    title: 'not：把真假反过来',
    task: 'logged_in = False。当用户没有登录时输出：请先登录',
    concept: '<code>not</code> 会把 True 变成 False，把 False 变成 True。',
    starter: 'logged_in = False\n\n# 使用 not 判断\n',
    expected: '请先登录',
    codeMustInclude: ['not'],
    hints: ['你要判断的是“没有登录”。', '可以写 not logged_in。', 'if not logged_in:\n    print("请先登录")']
  },
  {
    title: 'for + range 做累加',
    task: '使用 for 和 range 计算 1+2+3+4+5，并输出 15。',
    concept: '循环可以把重复的加法交给程序完成。',
    starter: 'total = 0\n\n# 使用 for 累加 1 到 5\n\nprint(total)\n',
    expected: '15',
    codeMustInclude: ['for', 'range'],
    hints: ['range 要产生 1 到 5。', '每次循环把当前数字加进 total。', 'for n in range(1, 6):\n    total += n']
  },
  {
    title: 'while：条件成立就继续',
    task: '使用 while 依次输出 1、2、3。',
    concept: '<code>while</code> 会在条件为 True 时持续执行。',
    starter: 'n = 1\n\n# 使用 while 输出 1、2、3\n',
    expected: '1\n2\n3',
    codeMustInclude: ['while'],
    hints: ['条件可以写 n <= 3。', '循环里记得让 n 增加。', 'while n <= 3:\n    print(n)\n    n += 1']
  },
  {
    title: 'continue：跳过这一次',
    task: '遍历 1 到 5，跳过 3，只输出 1、2、4、5。',
    concept: '<code>continue</code> 会直接进入下一次循环。',
    starter: 'for n in range(1, 6):\n    # n 等于 3 时跳过\n    pass\n',
    expected: '1\n2\n4\n5',
    codeMustInclude: ['continue'],
    hints: ['先判断 n == 3。', '条件成立时使用 continue。', 'if n == 3:\n    continue\nprint(n)']
  },
  {
    title: 'break：找到目标就停止',
    task: '遍历 1 到 9，遇到第一个能被 4 整除的数字时输出它并停止。',
    concept: '<code>break</code> 会立即结束当前循环。',
    starter: 'for n in range(1, 10):\n    # 找到第一个能被 4 整除的数\n    pass\n',
    expected: '4',
    codeMustInclude: ['break'],
    hints: ['能被 4 整除可以写 n % 4 == 0。', '输出后立刻 break。', 'if n % 4 == 0:\n    print(n)\n    break']
  },
  {
    title: '阶段 BOSS · 成绩统计器',
    boss: true,
    intro: '把条件判断、循环、累加和格式化输出一次组合起来。',
    task: '给定 scores = [95, 72, 58, 88, 100]。用循环统计及格人数，并计算平均分。输出两行：及格:4 和 平均:82.6',
    concept: 'BOSS 关不再只考一个语法点，而是要求你把多个知识点组合起来。',
    starter: 'scores = [95, 72, 58, 88, 100]\npassed = 0\ntotal = 0\n\n# 用一个循环完成统计与累加\n\nprint(f"及格:{passed}")\nprint(f"平均:{total / len(scores):.1f}")\n',
    expected: '及格:4\n平均:82.6',
    codeMustInclude: ['for', 'if'],
    simpleExplain: '这一关要同时做两件事：每个分数都加进 total；如果分数 >= 60，再把 passed 加 1。',
    codeExplain: '一次循环可以同时更新多个统计量。最后再用总分除以人数得到平均值。',
    hints: ['循环遍历 scores。', '每次先 total += score，再判断是否及格。', 'for score in scores:\n    total += score\n    if score >= 60:\n        passed += 1']
  }
]);