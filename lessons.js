window.LESSONS = [
  {
    id: 1,
    stage: 'Python 起步',
    title: '输出你的第一行 Python',
    intro: '先不背概念。让程序真的输出一句话，你就已经开始写 Python 了。',
    task: '让程序输出：Hello Python',
    concept: '<code>print()</code> 可以先理解为“把内容显示出来”。字符串需要放在引号里。',
    starter: "print('Hello Python')",
    stdin: '', expected: 'Hello Python',
    simpleExplain: '先只记住一件事：print() 就是“让 Python 把东西显示出来”。\n\n引号里的 Hello Python 是你想显示的文字。',
    codeExplain: '这一行由两部分组成：\n1. print(...)：执行“显示内容”的动作。\n2. \'Hello Python\'：一段字符串，也就是文字。\n\n整句可以读成：让 Python 显示 Hello Python。',
    hints: ['你需要使用 print()。', '把要输出的文字放进引号，再放进 print 的括号里。', "可以写成：print('Hello Python')"]
  },
  {
    id: 2,
    stage: 'Python 起步',
    title: '修改程序输出',
    intro: '程序不会猜你的意思，它只执行你写下来的内容。',
    task: '修改代码，让程序只输出：Hello 李永琪',
    concept: '这一关只改字符串内容，不增加新的语法。',
    starter: "print('Hello Python')",
    stdin: '', expected: 'Hello 李永琪',
    simpleExplain: '你不需要学新的语法。只需要把引号里的文字改成任务要求的内容。',
    codeExplain: 'print() 没变，变化的是括号里的字符串。代码编辑最基本的能力，就是知道“哪一部分控制了什么”。',
    hints: ['不需要增加新的函数。', '只修改 print() 里面的文字。', "目标可以写成：print('Hello 李永琪')"]
  },
  {
    id: 3,
    stage: '变量',
    title: '把名字存进变量',
    intro: '变量可以理解成一个带名字的小盒子，用来保存数据。',
    task: '创建变量 name = "李永琪"，然后用变量输出：Hello 李永琪',
    concept: '<code>name = "李永琪"</code> 表示把字符串保存到变量 name 中。',
    starter: "name = '李永琪'\n\n# 使用 name 变量完成输出\n",
    stdin: '', expected: 'Hello 李永琪', codeMustInclude: ['name'],
    simpleExplain: '把变量想成一个贴了标签的小盒子。name 是标签，“李永琪”是盒子里的内容。以后写 name，就相当于拿出里面的内容。',
    codeExplain: '第一行把字符串保存到 name。接下来应该把固定文字 Hello 和变量 name 一起交给 print()。',
    hints: ['第二部分需要用 print()。', 'print 可以同时接收多个值，例如 print("Hello", name)。', '试试：print("Hello", name)']
  },
  {
    id: 4,
    stage: '变量',
    title: '让 Python 帮你计算',
    intro: '变量不仅能保存文字，也能保存数字。',
    task: '已知 a = 12，b = 8，请输出它们的和 20。',
    concept: '数字不需要引号；<code>+</code> 可以做加法。',
    starter: 'a = 12\nb = 8\n\n# 在下面输出 a + b\n',
    stdin: '', expected: '20',
    simpleExplain: 'a 和 b 现在分别装着数字 12 和 8。写 a + b，Python 就会先把它们取出来再相加。',
    codeExplain: 'a = 12 和 b = 8 是赋值。a + b 是表达式。把表达式放进 print()，就能看到计算结果。',
    hints: ['先算 a + b。', '把计算表达式直接放进 print() 也可以。', '试试：print(a + b)']
  },
  {
    id: 5,
    stage: '输入',
    title: '让程序接收输入',
    intro: 'input() 能让程序读取用户输入。这里我们先从文字开始。',
    task: '读取一个名字，并输出：你好 张三。测试输入已经填好。',
    concept: '<code>input()</code> 返回字符串。你可以先把它保存到变量里。',
    starter: "name = input()\n\n# 输出：你好 张三\n",
    stdin: '张三', expected: '你好 张三',
    simpleExplain: 'input() 的作用是“等用户给程序一个内容”。这一关输入框已经放了“张三”，所以 name 会得到“张三”。',
    codeExplain: 'name = input() 会把一次输入保存到 name。然后你需要把“你好”和 name 一起输出。',
    hints: ['input() 得到的内容已经保存在 name 中。', '可以让 print 同时输出固定文字和变量。', '试试：print("你好", name)']
  },
  {
    id: 6,
    stage: '条件判断',
    title: '第一次 if 判断',
    intro: '程序开始“做决定”了。条件成立时，才执行缩进后的代码。',
    task: 'score = 85。当 score >= 60 时输出：及格',
    concept: 'Python 的 if 后面要写冒号 <code>:</code>，代码块需要缩进。',
    starter: 'score = 85\n\n# 写一个 if 判断\n',
    stdin: '', expected: '及格',
    simpleExplain: 'if 就是“如果”。可以读成：如果 score 大于等于 60，就执行下面缩进的代码。',
    codeExplain: 'if 后面放条件；冒号表示下面要开始一个代码块；缩进表示这行代码属于这个 if。',
    hints: ['条件可以写成 score >= 60。', 'if 行末尾不要忘记冒号，下一行要缩进。', '示例：\nif score >= 60:\n    print("及格")']
  },
  {
    id: 7,
    stage: '循环',
    title: '让代码重复执行',
    intro: '循环的价值是：同一件事情不用手写很多遍。',
    task: '使用 for 循环依次输出 1、2、3，每个数字单独一行。',
    concept: '<code>range(1, 4)</code> 会产生 1、2、3，不包含 4。',
    starter: '# 使用 for 和 range 完成任务\n',
    stdin: '', expected: '1\n2\n3',
    simpleExplain: 'for 可以理解成“对一组东西，一个一个做同一件事”。range(1, 4) 会给出 1、2、3。',
    codeExplain: 'for i in range(1, 4) 表示让 i 依次取得 1、2、3。缩进的 print(i) 每次都会执行一次。',
    hints: ['你可以遍历 range(1, 4)。', '循环体里的 print 需要缩进。', '示例：\nfor i in range(1, 4):\n    print(i)']
  },
  {
    id: 8,
    stage: '循环',
    title: '理解 range 的边界',
    intro: '这是初学者非常容易犯错的地方：range 的结束值通常不包含在结果里。',
    task: '使用 range，让程序依次输出 2、3、4、5。',
    concept: '想输出到 5，range 的结束参数通常要写成 6。',
    starter: 'for i in range(2, ?):\n    print(i)\n',
    stdin: '', expected: '2\n3\n4\n5',
    prediction: {
      question: '如果代码是 range(2, 6)，最后一次循环时 i 是多少？',
      options: ['4', '5', '6'],
      answer: '5',
      success: '对。range(2, 6) 包含 2、3、4、5，但不包含 6。',
      fail: '先别急着记答案：range 的 stop 参数本身不会被包含。'
    },
    simpleExplain: 'range(开始, 结束) 里的“结束”通常不会出现。所以如果你希望最后输出 5，结束值要再往后写一个数。',
    codeExplain: '现在的 ? 是故意留下的空位。你需要决定 stop 应该写什么，让 range 从 2 走到 5，但不多走一步。',
    hints: ['range(start, stop) 不包含 stop。', '如果最后一个数字要是 5，stop 应该比 5 大 1。', '把 ? 改成 6。']
  },
  {
    id: 9,
    stage: '列表',
    title: '一次保存多个数据',
    intro: '列表 list 可以保存一组有顺序的数据。',
    task: '给定 scores = [96.81, 97.24, 98.41]，输出其中最大值。',
    concept: '<code>max()</code> 可以返回列表中的最大值。',
    starter: 'scores = [96.81, 97.24, 98.41]\n\n# 输出最大值\n',
    stdin: '', expected: '98.41',
    simpleExplain: '列表就是把多个值装在同一个有顺序的容器里。这里 scores 里有三个实验结果。',
    codeExplain: 'scores 是一个列表。Python 内置的 max(scores) 会从里面找出最大值，然后可以用 print() 显示它。',
    hints: ['Python 已经有求最大值的内置函数。', '这个函数叫 max。', '试试：print(max(scores))']
  },
  {
    id: 10,
    stage: '列表 + 循环',
    title: '遍历一组数据',
    intro: '科研代码里你会经常看到“对一批数据逐个处理”。',
    task: '依次输出列表中的三个数据：96.81、97.24、98.41。',
    concept: 'for 可以直接遍历列表，不一定要使用下标。',
    starter: 'scores = [96.81, 97.24, 98.41]\n\n# 遍历 scores\n',
    stdin: '', expected: '96.81\n97.24\n98.41',
    simpleExplain: '这一关把“列表”和“循环”连起来：让一个变量逐个拿到列表里的每个值。',
    codeExplain: 'for score in scores 会让 score 依次变成三个分数。循环体里打印 score，就会每个值输出一次。',
    hints: ['可以写 for score in scores。', '循环体中打印 score。', '示例：\nfor score in scores:\n    print(score)']
  },
  {
    id: 11,
    stage: '函数',
    title: '写你的第一个函数',
    intro: '函数把一段逻辑打包起来，可以反复调用，是读懂大型项目的关键。',
    task: '完成 add(a, b) 函数，让 print(add(3, 5)) 输出 8。',
    concept: '<code>return</code> 用来把函数计算得到的结果返回出去。',
    starter: 'def add(a, b):\n    # 在这里返回 a + b\n    pass\n\nprint(add(3, 5))\n',
    stdin: '', expected: '8',
    simpleExplain: '函数可以理解成一台小机器：把 a、b 放进去，机器做计算，再把结果送出来。return 就是“把结果送出来”。',
    codeExplain: 'def add(a, b) 定义函数；a、b 是参数；return 决定函数最后交回什么结果；add(3, 5) 是实际调用。',
    hints: ['函数里面需要返回一个结果。', '用 return，而不是只写 a + b。', '把 pass 改成：return a + b']
  },
  {
    id: 12,
    stage: 'Bug 修理厂',
    title: '找出隐藏的逻辑 Bug',
    intro: '现实中的代码很多时候不是让你从零写，而是让你找出哪里不对。',
    task: '下面程序本来应该输出 15，但现在输出 5。只修改必要的一行，让它输出 15。',
    concept: '循环中每次是“覆盖” total，还是“累加” total？这两个操作完全不同。',
    starter: 'numbers = [1, 2, 3, 4, 5]\ntotal = 0\n\nfor n in numbers:\n    total = n\n\nprint(total)\n',
    stdin: '', expected: '15',
    simpleExplain: '现在每次循环都把 total 直接改成当前 n，所以最后只剩下 5。真正需要的是“在原来的 total 上继续加”。',
    codeExplain: 'total = n 是覆盖；total += n 是累加。调试时要问：这行代码是在替换旧值，还是在旧值基础上更新？',
    hints: ['问题就在循环体里的 total = n。', '你需要把新的 n 加到已有 total 上。', '把 total = n 改成 total += n。']
  },
{
  "id": 13,
  "stage": "字符串",
  "title": "用 f-string 组合文字和变量",
  "intro": "当文字里要插入变量时，f-string 会比不断拼接更清楚。",
  "task": "已知 name = \"小明\"，使用 f-string 输出：你好，小明！",
  "concept": "<code>f\"你好，{name}！\"</code> 会把变量 name 的值放进花括号位置。",
  "starter": "name = \"小明\"\n\n# 使用 f-string 输出目标文字\n",
  "stdin": "",
  "expected": "你好，小明！",
  "codeMustInclude": [
    "f"
  ],
  "simpleExplain": "f-string 就像一张模板。花括号 {name} 的位置，会被变量 name 里的内容替换。",
  "codeExplain": "字符串前面的 f 告诉 Python 这段文字里有变量；{name} 会被变量值替换。",
  "hints": [
    "字符串前面加 f。",
    "把变量写进花括号，例如 {name}。",
    "试试：print(f\"你好，{name}！\")"
  ]
},
{
  "id": 14,
  "stage": "输入 + 类型",
  "title": "把输入的文字变成数字",
  "intro": "input() 得到的默认是字符串。做数学计算前，经常需要先转换类型。",
  "task": "读取输入的年龄 20，把它转换成整数，再输出 21。",
  "concept": "<code>int()</code> 可以把数字字符串转换成整数。",
  "starter": "age = input()\n\n# 把 age 转成整数并加 1\n",
  "stdin": "20",
  "expected": "21",
  "codeMustInclude": [
    "int"
  ],
  "simpleExplain": "input() 得到的是文字 \"20\"，不是数字 20。int(age) 才会把它变成可以做加法的整数。",
  "codeExplain": "先读取字符串，再用 int() 转成整数，然后才能做 + 1。",
  "hints": [
    "先考虑 input() 返回的类型。",
    "使用 int(age) 做类型转换。",
    "可以写：age = int(age)\nprint(age + 1)"
  ]
},
{
  "id": 15,
  "stage": "条件判断",
  "title": "给 if 加上 else",
  "intro": "很多程序需要同时处理“条件成立”和“不成立”两种情况。",
  "task": "age = 16。小于 18 时输出：未成年，否则输出：成年人。",
  "concept": "<code>else</code> 表示前面的 if 条件不成立时执行另一段代码。",
  "starter": "age = 16\n\n# 写 if / else 判断\n",
  "stdin": "",
  "expected": "未成年",
  "simpleExplain": "if 负责“满足条件怎么办”，else 负责“不满足条件怎么办”。",
  "codeExplain": "当 age < 18 为真时执行 if，否则进入 else。",
  "hints": [
    "条件可以写 age < 18。",
    "else 后面也要有冒号。",
    "示例：\nif age < 18:\n    print(\"未成年\")\nelse:\n    print(\"成年人\")"
  ]
},
{
  "id": 16,
  "stage": "条件判断",
  "title": "使用 elif 处理多个区间",
  "intro": "当结果不只有两种时，可以用 elif 继续判断。",
  "task": "score = 82。90 及以上输出 A，80 及以上输出 B，否则输出 C。",
  "concept": "<code>elif</code> 表示“前面的条件没满足，再判断这个条件”。",
  "starter": "score = 82\n\n# 使用 if / elif / else\n",
  "stdin": "",
  "expected": "B",
  "simpleExplain": "Python 从上往下判断。82 不满足 >=90，但满足 >=80，所以输出 B。",
  "codeExplain": "多个区间通常要从更高或更严格的条件开始判断。",
  "hints": [
    "先判断 score >= 90。",
    "第二个条件写 score >= 80。",
    "最后用 else 处理其余情况。"
  ]
},
{
  "id": 17,
  "stage": "条件判断",
  "title": "同时满足两个条件",
  "intro": "真实任务里经常要求两个条件同时成立。",
  "task": "age = 20，has_ticket = True。只有年龄至少 18 且有票时输出：允许进入",
  "concept": "<code>and</code> 要求左右两个条件都为 True。",
  "starter": "age = 20\nhas_ticket = True\n\n# 同时检查两个条件\n",
  "stdin": "",
  "expected": "允许进入",
  "codeMustInclude": [
    "and"
  ],
  "simpleExplain": "and 可以理解成“而且”。年龄够，而且有票，两个都成立才执行。",
  "codeExplain": "age >= 18 和 has_ticket 都是布尔条件，用 and 把它们连接起来。",
  "hints": [
    "需要两个条件同时成立。",
    "用 and 连接 age >= 18 和 has_ticket。",
    "示例：if age >= 18 and has_ticket:"
  ]
},
{
  "id": 18,
  "stage": "循环",
  "title": "第一次 while 循环",
  "intro": "for 适合遍历已知序列；while 更适合“只要条件成立就继续”。",
  "task": "使用 while 依次输出 1、2、3。",
  "concept": "<code>while 条件:</code> 会在条件保持为 True 时重复执行。",
  "starter": "n = 1\n\n# 使用 while 输出 1、2、3\n",
  "stdin": "",
  "expected": "1\n2\n3",
  "codeMustInclude": [
    "while"
  ],
  "simpleExplain": "while 就是“只要……就继续”。循环体里一定要让条件发生变化。",
  "codeExplain": "n 从 1 开始，每次输出后加 1；n 变成 4 时循环结束。",
  "hints": [
    "循环条件可以是 n <= 3。",
    "每次循环后记得让 n 增加。",
    "循环体里写 print(n) 和 n += 1。"
  ]
},
{
  "id": 19,
  "stage": "循环",
  "title": "用 break 提前结束循环",
  "intro": "有时找到目标后就没必要继续循环。",
  "task": "遍历 1 到 5，当数字等于 4 时停止；只输出 1、2、3。",
  "concept": "<code>break</code> 会立即结束当前循环。",
  "starter": "for n in range(1, 6):\n    # n 等于 4 时结束循环\n    pass\n",
  "stdin": "",
  "expected": "1\n2\n3",
  "codeMustInclude": [
    "break"
  ],
  "simpleExplain": "break 就像循环里的“出口”，一执行，后面的循环次数都不再继续。",
  "codeExplain": "先判断 n 是否等于 4，再决定 break；否则打印 n。",
  "hints": [
    "在 print 之前判断 n == 4。",
    "条件成立时使用 break。",
    "结构：if n == 4:\n    break\nprint(n)"
  ]
},
{
  "id": 20,
  "stage": "列表",
  "title": "通过下标取出列表元素",
  "intro": "列表中的位置有编号，而且 Python 从 0 开始编号。",
  "task": "给定 colors = [\"red\", \"green\", \"blue\"]，输出第二个元素 green。",
  "concept": "列表下标从 0 开始，所以第二个元素的下标是 <code>1</code>。",
  "starter": "colors = [\"red\", \"green\", \"blue\"]\n\n# 输出第二个元素\n",
  "stdin": "",
  "expected": "green",
  "prediction": {
    "question": "colors[0] 会得到什么？",
    "options": [
      "red",
      "green",
      "blue"
    ],
    "answer": "red",
    "success": "对。Python 的列表下标从 0 开始。",
    "fail": "记住：列表的第一个位置编号是 0。"
  },
  "simpleExplain": "人习惯从第 1 个开始数，但 Python 列表从 0 开始。",
  "codeExplain": "colors[1] 就是在列表中取编号为 1 的元素，也就是第二个元素。",
  "hints": [
    "第二个元素不是下标 2。",
    "列表从 0 开始编号。",
    "试试：print(colors[1])"
  ]
},
{
  "id": 21,
  "stage": "列表",
  "title": "向列表追加数据",
  "intro": "列表可以在运行过程中加入新元素。",
  "task": "给 numbers = [1, 2] 追加 3，然后输出整个列表。",
  "concept": "<code>append()</code> 会把一个元素添加到列表末尾。",
  "starter": "numbers = [1, 2]\n\n# 追加 3，再输出 numbers\n",
  "stdin": "",
  "expected": "[1, 2, 3]",
  "codeMustInclude": [
    "append"
  ],
  "simpleExplain": "append 就是“追加到最后”，它会直接修改原来的列表。",
  "codeExplain": "numbers.append(3) 执行后，numbers 变成 [1, 2, 3]。",
  "hints": [
    "列表有 append 方法。",
    "调用方式是 numbers.append(...)。",
    "先 numbers.append(3)，再 print(numbers)。"
  ]
},
{
  "id": 22,
  "stage": "列表",
  "title": "用切片取出一部分列表",
  "intro": "切片能一次取出连续的一段数据。",
  "task": "给定 nums = [10, 20, 30, 40, 50]，输出 [20, 30, 40]。",
  "concept": "<code>列表[start:stop]</code> 包含 start，但不包含 stop。",
  "starter": "nums = [10, 20, 30, 40, 50]\n\n# 使用切片输出中间三个元素\n",
  "stdin": "",
  "expected": "[20, 30, 40]",
  "simpleExplain": "切片和 range 很像：左边包含，右边不包含。",
  "codeExplain": "nums[1:4] 会取下标 1、2、3，对应 20、30、40。",
  "hints": [
    "20 的下标是 1。",
    "40 的下标是 3，但 stop 不包含，所以要写 4。",
    "试试：print(nums[1:4])"
  ]
},
{
  "id": 23,
  "stage": "字典",
  "title": "第一次使用字典",
  "intro": "字典用“键 → 值”保存数据，适合描述有名字的属性。",
  "task": "给定 student = {\"name\": \"小明\", \"score\": 95}，输出 95。",
  "concept": "通过 <code>student[\"score\"]</code> 可以按键取出对应的值。",
  "starter": "student = {\"name\": \"小明\", \"score\": 95}\n\n# 输出 score 对应的值\n",
  "stdin": "",
  "expected": "95",
  "simpleExplain": "列表按位置找数据，字典按名字找数据。",
  "codeExplain": "student[\"score\"] 表示查找键 score 对应的值。",
  "hints": [
    "不是用下标 0 或 1。",
    "用字符串键 \"score\"。",
    "试试：print(student[\"score\"])"
  ]
},
{
  "id": 24,
  "stage": "字典 + 循环",
  "title": "遍历字典的键和值",
  "intro": "字典经常要成批读取，items() 可以同时拿到键和值。",
  "task": "遍历 {\"OA\": 98.41, \"AA\": 97.32}，依次输出：OA 98.41 和 AA 97.32。",
  "concept": "<code>dict.items()</code> 每次会给出一对 key 和 value。",
  "starter": "metrics = {\"OA\": 98.41, \"AA\": 97.32}\n\n# 遍历键和值\n",
  "stdin": "",
  "expected": "OA 98.41\nAA 97.32",
  "codeMustInclude": [
    "items"
  ],
  "simpleExplain": "items() 可以把字典里的每一组“名字和值”一起拿出来。",
  "codeExplain": "for key, value in metrics.items() 会依次得到 OA/98.41 和 AA/97.32。",
  "hints": [
    "使用 metrics.items()。",
    "循环变量可以写 key, value。",
    "循环里 print(key, value)。"
  ]
},
{
  "id": 25,
  "stage": "函数",
  "title": "让函数处理不同输入",
  "intro": "函数真正的价值是，同一段逻辑可以处理不同数据。",
  "task": "完成 square(x)，返回 x 的平方，让 print(square(6)) 输出 36。",
  "concept": "参数 x 是函数接收到的输入，<code>return</code> 返回处理后的结果。",
  "starter": "def square(x):\n    # 返回 x 的平方\n    pass\n\nprint(square(6))\n",
  "stdin": "",
  "expected": "36",
  "simpleExplain": "square 像一个“平方机器”。传入 6，它应该把 6×6 的结果送回来。",
  "codeExplain": "调用 square(6) 时，参数 x 临时等于 6。",
  "hints": [
    "平方可以写 x * x。",
    "函数需要 return。",
    "把 pass 改成：return x * x"
  ]
},
{
  "id": 26,
  "stage": "函数",
  "title": "理解默认参数",
  "intro": "有些参数可以提供默认值，这样调用函数时可以少写一个参数。",
  "task": "定义 greet(name, prefix=\"你好\")，让 print(greet(\"小明\")) 输出：你好 小明",
  "concept": "参数写成 <code>prefix=\"你好\"</code> 后，不传 prefix 就会使用默认值。",
  "starter": "def greet(name, prefix=\"你好\"):\n    # 返回两部分文字，中间一个空格\n    pass\n\nprint(greet(\"小明\"))\n",
  "stdin": "",
  "expected": "你好 小明",
  "simpleExplain": "默认参数就是“没特别说明时先用这个值”。",
  "codeExplain": "name 得到“小明”，prefix 没传，所以保持默认值“你好”。",
  "hints": [
    "函数应该返回字符串。",
    "可以使用 f-string。",
    "例如：return f\"{prefix} {name}\""
  ]
},
{
  "id": 27,
  "stage": "Python 表达式",
  "title": "用列表推导式生成新列表",
  "intro": "读科研代码时经常会遇到一行生成列表的写法。",
  "task": "使用列表推导式，把 [1, 2, 3, 4] 变成 [1, 4, 9, 16]。",
  "concept": "<code>[x * x for x in numbers]</code> 可以把循环和列表创建写在一起。",
  "starter": "numbers = [1, 2, 3, 4]\n\n# 使用列表推导式生成平方列表\n",
  "stdin": "",
  "expected": "[1, 4, 9, 16]",
  "codeMustInclude": [
    "for"
  ],
  "simpleExplain": "对 numbers 里的每个 x，计算 x*x，把结果装进新列表。",
  "codeExplain": "阅读时先看 for：逐个取 x；再看左边：每个 x 要变成什么。",
  "hints": [
    "形式是 [表达式 for 变量 in 列表]。",
    "表达式写 x * x。",
    "试试：squares = [x * x for x in numbers]\nprint(squares)"
  ]
},
{
  "id": 28,
  "stage": "异常处理",
  "title": "第一次 try / except",
  "intro": "程序出错并不一定要直接崩溃，可以对预期错误做处理。",
  "task": "代码尝试 int(\"abc\")。使用 try/except 捕获 ValueError，并输出：输入无效",
  "concept": "<code>try</code> 放可能出错的代码，<code>except</code> 处理指定错误。",
  "starter": "# 使用 try / except 处理下面的转换\n# int(\"abc\") 会触发 ValueError\n",
  "stdin": "",
  "expected": "输入无效",
  "codeMustInclude": [
    "try",
    "except"
  ],
  "simpleExplain": "try 可以理解成“先试试看”，出错后由 except 接住。",
  "codeExplain": "int(\"abc\") 会产生 ValueError；except ValueError 可以专门处理它。",
  "hints": [
    "把 int(\"abc\") 放到 try 里。",
    "捕获 ValueError。",
    "except ValueError:\n    print(\"输入无效\")"
  ]
},
{
  "id": 29,
  "stage": "Bug 修理厂",
  "title": "修复下标越界 Bug",
  "intro": "很常见的一类错误：循环次数比列表实际位置多了一次。",
  "task": "修复下面代码，让它依次输出 a、b、c，不再出现 IndexError。",
  "concept": "长度为 3 的列表，有效下标是 0、1、2。",
  "starter": "items = [\"a\", \"b\", \"c\"]\n\nfor i in range(4):\n    print(items[i])\n",
  "stdin": "",
  "expected": "a\nb\nc",
  "simpleExplain": "列表只有 3 个元素，但 range(4) 会产生 0、1、2、3，items[3] 并不存在。",
  "codeExplain": "这是典型的 off-by-one（差一位）错误。",
  "hints": [
    "问题不是 print，而是循环范围。",
    "可以使用 len(items)。",
    "把 range(4) 改成 range(len(items))。"
  ]
},
{
  "id": 30,
  "stage": "综合挑战",
  "title": "计算一组实验结果的平均值",
  "intro": "把变量、列表和运算组合起来，开始接近真实数据处理代码。",
  "task": "给定 scores = [90, 80, 100]，计算并输出平均值 90.0。",
  "concept": "平均值 = 总和 / 数量。可以用 <code>sum()</code> 和 <code>len()</code>。",
  "starter": "scores = [90, 80, 100]\n\n# 计算并输出平均值\n",
  "stdin": "",
  "expected": "90.0",
  "codeMustInclude": [
    "scores"
  ],
  "simpleExplain": "先得到总和，再除以元素数量。",
  "codeExplain": "sum(scores) 得到 270，len(scores) 得到 3；270 / 3 得到 90.0。",
  "hints": [
    "先想平均值公式。",
    "Python 有 sum() 和 len()。",
    "试试：print(sum(scores) / len(scores))"
  ]
}
];


window.LESSON_DETAILS_V221 = {
  1: {
    walkthrough: 'Python 先计算 print() 括号里的字符串，然后把这段字符串写到标准输出。字符串本身不会被修改。',
    takeaway: 'print() 是“把结果显示出来”；引号包住的是字符串，不是变量名。',
    pitfalls: ['漏写括号或引号。', '把中文全角引号当成 Python 引号。', '只看输出结果，不知道 print() 和字符串分别负责什么。']
  },
  2: {
    walkthrough: '程序仍然只执行一次 print()。真正变化的是传给 print() 的字符串内容，因此输出也随之改变。',
    takeaway: '读代码时要能定位“哪一小部分控制最终行为”。',
    pitfalls: ['改了 print 这个函数名，而不是修改字符串内容。', '多输出了额外文字，导致自动判题不一致。']
  },
  3: {
    walkthrough: '第一行先创建 name 并保存字符串；执行 print 时 Python 再读取 name 当前保存的值，与固定文字一起输出。',
    takeaway: '变量是给数据起名字；后面使用变量名，就是读取它当前保存的值。',
    pitfalls: ['把 name 写成 "name"，这样输出的是文字 name。', '变量定义和使用时拼写不一致。']
  },
  4: {
    walkthrough: 'Python 先把 12 保存到 a，把 8 保存到 b；计算 a + b 得到 20；最后 print 显示 20。',
    takeaway: '数字变量可以直接参与运算；没有引号的 12 是整数，有引号的 "12" 是字符串。',
    pitfalls: ['给数字加上引号后再相加，得到字符串拼接。', '只写 a + b 却没有 print，交互式脚本不会自动显示结果。']
  },
  5: {
    walkthrough: 'input() 读取一行输入并返回字符串；赋值给 name；print 再使用 name 输出问候语。',
    takeaway: 'input() 默认得到字符串，通常先保存到变量，再根据需要处理。',
    pitfalls: ['忘记 input() 的返回值要保存或使用。', '把输入框里的值误以为代码中的固定常量。']
  },
  6: {
    walkthrough: '先得到 score=85；计算 score >= 60 得到 True；因此进入 if 的缩进代码块并输出“及格”。',
    takeaway: 'if 只在条件为 True 时执行缩进代码；冒号和缩进都是语法的一部分。',
    pitfalls: ['if 行末漏冒号。', '下一行没有缩进。', '把 >= 写成 >，导致边界 60 判断错误。']
  },
  7: {
    walkthrough: 'range(1, 4) 产生 1、2、3；for 让 i 依次取得这三个值；print(i) 因此执行三次。',
    takeaway: 'for 的核心不是“重复三次”，而是让循环变量依次取得序列里的每个值。',
    pitfalls: ['把 range(1, 4) 误认为会包含 4。', '循环体没有缩进。']
  },
  8: {
    walkthrough: 'range(2, 6) 的 stop=6 不包含在序列中，所以 i 依次得到 2、3、4、5。',
    takeaway: 'range(start, stop) 通常是左闭右开：包含 start，不包含 stop。',
    pitfalls: ['为了输出 5 把 stop 写成 5。', '把 range 的第二个参数理解成“最后一个数字”。']
  },
  9: {
    walkthrough: 'scores 保存三个浮点数；max(scores) 遍历并比较这些值，返回最大的 98.41；print 再输出它。',
    takeaway: '遇到常见操作先想到 Python 内置函数，不必每次都手写循环。',
    pitfalls: ['把 max 写成字符串。', '写 max 但忘记加括号调用函数。']
  },
  10: {
    walkthrough: 'for score in scores 直接从列表中逐个取值，不需要自己维护下标；循环体每次输出当前 score。',
    takeaway: '如果只需要元素本身，优先直接遍历列表，而不是先 range(len(...))。',
    pitfalls: ['把 score 当成下标使用。', '为了遍历元素写了不必要的复杂下标循环。']
  },
  11: {
    walkthrough: '调用 add(3, 5) 时 a=3、b=5；函数内部计算 a+b；return 把 8 返回给调用位置；print 输出 8。',
    takeaway: '函数的三个关键点：参数接收输入、函数体处理、return 返回结果。',
    pitfalls: ['函数里只写 a + b，没有 return。', '把 print 当成 return；打印了结果但函数本身仍返回 None。']
  },
  12: {
    walkthrough: 'total 初始为 0。循环每次应该把当前 n 加到旧 total 上：0→1→3→6→10→15。原代码 total=n 会不断覆盖旧值，所以最后只剩 5。',
    takeaway: '调试时要分清“赋值覆盖”和“基于旧值更新”。total = n 与 total += n 的语义完全不同。',
    pitfalls: ['看到输出 5 就去修改 print，而真正的问题在循环状态更新。', '一次改很多行，导致无法确认真正的 Bug。'],
    bossReview: '你已经把变量、列表、循环和调试串起来了。真正的能力不是记住 total += n，而是能跟踪变量在每一次循环之后变成什么。'
  }
};
window.LESSONS.forEach(lesson => Object.assign(lesson, window.LESSON_DETAILS_V221[lesson.id] || {}));
