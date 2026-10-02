addEngineeringStage(5, [
  {
    "title": "向列表末尾追加",
    "task": "numbers=[1,2]，追加 3 后输出 [1, 2, 3]。",
    "concept": "list.append()",
    "starter": "numbers = [1, 2]\n# 追加 3\n\nprint(numbers)\n",
    "solution": "numbers = [1, 2]\nnumbers.append(3)\nprint(numbers)",
    "expected": "[1, 2, 3]",
    "must": [
      "append"
    ],
    "why": "append 会原地把单个元素加到列表末尾。",
    "walk": "原列表长度 2；append(3) 后原对象变成三个元素。",
    "hint1": "使用 append 方法。",
    "hint2": "调用 numbers.append(3)。",
    "takeaway": "append 修改原列表，不返回新列表。"
  },
  {
    "title": "一次追加多个元素",
    "task": "items=[1]，把 [2,3] 的元素加入其中，输出 [1, 2, 3]。",
    "concept": "list.extend()",
    "starter": "items = [1]\n# 加入 2 和 3\n\nprint(items)\n",
    "solution": "items = [1]\nitems.extend([2, 3])\nprint(items)",
    "expected": "[1, 2, 3]",
    "must": [
      "extend"
    ],
    "why": "extend 会逐个加入另一个可迭代对象的元素，而 append 会把整个对象当一个元素。",
    "walk": "[2,3] 被展开成两个元素加入 items。",
    "hint1": "不是 append([2,3])。",
    "hint2": "使用 extend。",
    "takeaway": "append 加一个对象，extend 加一组对象中的每个元素。"
  },
  {
    "title": "在指定位置插入",
    "task": "queue=['A','C']，在下标1插入 B，输出 ['A', 'B', 'C']。",
    "concept": "list.insert(index, value)",
    "starter": "queue = ['A', 'C']\n# 插入 B\n\nprint(queue)\n",
    "solution": "queue = ['A', 'C']\nqueue.insert(1, 'B')\nprint(queue)",
    "expected": "['A', 'B', 'C']",
    "must": [
      "insert"
    ],
    "why": "insert 可以在指定下标前加入元素，并把后续元素向后移动。",
    "walk": "下标1原来是 C；插入 B 后 C 后移。",
    "hint1": "B 应该成为下标1。",
    "hint2": "使用 insert(1, 'B')。",
    "takeaway": "频繁在列表中间插入会移动元素，大数据场景要考虑成本。"
  },
  {
    "title": "按值删除元素",
    "task": "roles=['admin','guest','editor']，删除 guest 后输出 ['admin', 'editor']。",
    "concept": "list.remove(value)",
    "starter": "roles = ['admin', 'guest', 'editor']\n# 删除 guest\n\nprint(roles)\n",
    "solution": "roles = ['admin', 'guest', 'editor']\nroles.remove('guest')\nprint(roles)",
    "expected": "['admin', 'editor']",
    "must": [
      "remove"
    ],
    "why": "remove 按值删除第一个匹配元素。",
    "walk": "找到 guest 的位置并移除，其他元素顺序保持。",
    "hint1": "知道的是值，不是下标。",
    "hint2": "使用 remove。",
    "takeaway": "remove 删除值；pop 更适合按位置删除并取得被删值。"
  },
  {
    "title": "pop 删除并取得值",
    "task": "stack=['a','b','c']，pop 最后一个元素并输出 c，然后输出 ['a', 'b']。",
    "concept": "list.pop()",
    "starter": "stack = ['a', 'b', 'c']\n# 弹出最后一个元素\n",
    "solution": "stack = ['a', 'b', 'c']\nitem = stack.pop()\nprint(item)\nprint(stack)",
    "expected": "c\n['a', 'b']",
    "must": [
      "pop"
    ],
    "why": "pop 同时完成删除和返回被删除元素，适合栈式处理。",
    "walk": "默认 pop 最后一个元素 c，item 保存 c，原列表只剩 a、b。",
    "hint1": "pop() 默认处理最后一个元素。",
    "hint2": "把返回值保存到 item。",
    "takeaway": "需要被删除的值时，直接 pop。"
  },
  {
    "title": "排序列表",
    "task": "nums=[4,1,3,2]，原地升序排序并输出 [1, 2, 3, 4]。",
    "concept": "list.sort() 原地排序",
    "starter": "nums = [4, 1, 3, 2]\n# 原地排序\n\nprint(nums)\n",
    "solution": "nums = [4, 1, 3, 2]\nnums.sort()\nprint(nums)",
    "expected": "[1, 2, 3, 4]",
    "must": [
      "sort"
    ],
    "why": "list.sort() 修改原列表，而 sorted() 返回新列表。",
    "walk": "sort 根据元素比较结果重新排列 nums 本身。",
    "hint1": "题目要求原地排序。",
    "hint2": "使用 nums.sort()。",
    "takeaway": "分清原地修改与返回新对象，是 Python 容器 API 的重要习惯。"
  },
  {
    "title": "切片复制列表",
    "task": "original=[1,2,3]，用切片创建 copy，再给 copy 追加4。输出 original 和 copy 两行。",
    "concept": "浅复制与独立列表对象",
    "starter": "original = [1, 2, 3]\n# 用切片复制\n\n# 给 copy 追加 4\n\nprint(original)\nprint(copy)\n",
    "solution": "original = [1, 2, 3]\ncopy = original[:]\ncopy.append(4)\nprint(original)\nprint(copy)",
    "expected": "[1, 2, 3]\n[1, 2, 3, 4]",
    "why": "切片 original[:] 会创建新的列表对象，因此修改外层列表不会影响原列表。",
    "walk": "copy 初始内容相同但身份不同；append 只修改 copy。",
    "hint1": "直接 copy = original 会共享同一个对象。",
    "hint2": "使用 original[:]。",
    "takeaway": "赋值复制的是引用；需要独立容器时要显式复制。"
  },
  {
    "title": "元组解包",
    "task": "point=(3,5)，解包到 x、y，并输出 8。",
    "concept": "tuple 与序列解包",
    "starter": "point = (3, 5)\n# 解包到 x, y\n\nprint(x + y)\n",
    "solution": "point = (3, 5)\nx, y = point\nprint(x + y)",
    "expected": "8",
    "why": "元组常用于表达固定结构的数据，解包能把各位置赋给有意义的变量名。",
    "walk": "point 的第一个值给 x，第二个值给 y，最后求和。",
    "hint1": "左侧写两个变量。",
    "hint2": "x, y = point。",
    "takeaway": "解包可以让位置数据迅速变成有语义的变量。"
  },
  {
    "title": "集合自动去重",
    "task": "ids=[1,1,2,3,3]，转成集合后输出其长度 3。",
    "concept": "set 去重与唯一性",
    "starter": "ids = [1, 1, 2, 3, 3]\n# 转成集合并输出唯一数量\n",
    "solution": "ids = [1, 1, 2, 3, 3]\n# 转成集合并输出唯一数量\n\nunique = set(ids)\nprint(len(unique))",
    "expected": "3",
    "must": [
      "set"
    ],
    "why": "集合只保留唯一元素，适合快速去重和成员测试。",
    "walk": "重复的 1 和 3 被合并，集合只剩三个唯一值。",
    "hint1": "使用 set(ids)。",
    "hint2": "再对集合使用 len。",
    "takeaway": "需要唯一值时优先想到 set。"
  },
  {
    "title": "集合交集",
    "task": "a={'api','db','cache'}，b={'db','queue'}，输出共同元素数量 1。",
    "concept": "集合交集 &",
    "starter": "a = {'api', 'db', 'cache'}\nb = {'db', 'queue'}\n# 输出交集数量\n",
    "solution": "a = {'api', 'db', 'cache'}\nb = {'db', 'queue'}\n# 输出交集数量\n\ncommon = a & b\nprint(len(common))",
    "expected": "1",
    "why": "集合交集直接表达“两组中共同存在的元素”。",
    "walk": "只有 db 同时出现在 a 与 b，因此交集大小为1。",
    "hint1": "交集运算符是 &。",
    "hint2": "先得到 a & b，再 len。",
    "takeaway": "集合运算能把复杂的成员比较写成清楚的数学关系。"
  },
  {
    "title": "修复共享引用 Bug",
    "task": "下面代码希望 backup 不受 tasks.append 影响，但现在两者都会变化。修复并输出两行：['a', 'b'] 与 ['a', 'b', 'c']。",
    "concept": "可变对象引用与 copy()",
    "starter": "tasks = ['a', 'b']\nbackup = tasks\ntasks.append('c')\nprint(backup)\nprint(tasks)\n",
    "solution": "tasks = ['a', 'b']\nbackup = tasks.copy()\ntasks.append('c')\nprint(backup)\nprint(tasks)",
    "expected": "['a', 'b']\n['a', 'b', 'c']",
    "why": "backup = tasks 只复制引用，两个变量指向同一列表；copy() 才创建新的外层列表。",
    "walk": "修复后 backup 与 tasks 是两个对象；追加 c 只影响 tasks。",
    "hint1": "问题出在 backup = tasks。",
    "hint2": "列表有 copy() 方法。",
    "takeaway": "可变对象的引用共享是工程代码中非常常见的隐蔽 Bug。"
  },
  {
    "title": "任务标签整理器",
    "boss": true,
    "task": "给定 raw=['bug','api','bug','urgent','api']。得到唯一标签集合；按字母排序成列表；输出 tags=['api', 'bug', 'urgent']，再输出 count=3。",
    "concept": "列表、集合、排序与容器转换的综合使用",
    "starter": "raw = ['bug', 'api', 'bug', 'urgent', 'api']\n# 去重、排序并输出\n",
    "solution": "raw = ['bug', 'api', 'bug', 'urgent', 'api']\ntags = sorted(set(raw))\nprint(f'tags={tags}')\nprint(f'count={len(tags)}')",
    "expected": "tags=['api', 'bug', 'urgent']\ncount=3",
    "must": [
      "set",
      "sorted"
    ],
    "why": "真实数据清洗常常先去重，再为了稳定输出排序。",
    "walk": "set 去掉重复值；sorted 把集合转换成有序列表；len 统计唯一标签数量。",
    "hint1": "先解决重复问题。",
    "hint2": "集合无固定顺序，最终输出前要 sorted。",
    "takeaway": "选择容器要根据需求：list 保序可重复，set 强调唯一性，tuple 强调固定结构。",
    "bossReview": "你已经掌握列表的增删改查、复制语义、元组解包和集合运算，可以开始组织更复杂的结构化数据。"
  }
]);
