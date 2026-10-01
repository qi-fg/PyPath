(() => {
  const testsByKey = {
    's02-l01': [
      { label: '不同姓名', stdin: 'Bob', expected: 'Hello Bob' },
      { label: '中文姓名', stdin: '李雷', expected: 'Hello 李雷' }
    ],
    's02-l02': [
      { label: '零岁边界', stdin: '0', expected: '1' },
      { label: '两位数', stdin: '99', expected: '100' }
    ],
    's02-l03': [
      { label: '其他小数', stdin: '2.5', expected: '5.0' },
      { label: '小于 1 的小数', stdin: '0.5', expected: '1.0' }
    ],
    's02-l12': [
      {
        label: '不同注册资料',
        stdin: ' Bob \n0\n Osaka ',
        expected: 'User=Bob | NextAge=1 | City=Osaka'
      }
    ],
    's07-l02': [
      { label: '负数与正数', appendCode: "print(add(-2, 7))", expected: '8\n5' },
      { label: '零值', appendCode: "print(add(0, 0))", expected: '8\n0' }
    ],
    's07-l03': [
      { label: '另一个正数', appendCode: "print(square(7))", expected: '36\n49' },
      { label: '负数平方', appendCode: "print(square(-4))", expected: '36\n16' }
    ],
    's07-l04': [
      { label: '覆盖默认参数', appendCode: "print(greet('Bob', 'Hello'))", expected: 'Hi Ada\nHello Bob' }
    ],
    's07-l06': [
      { label: '包含负数', appendCode: "print(*min_max([-5, 4, 0]))", expected: '1 9\n-5 4' }
    ],
    's07-l08': [
      { label: '空参数', appendCode: "print(total())", expected: '10\n0' }
    ],
    's07-l10': [
      { label: '零输入', appendCode: "print(add_one(double(0)))", expected: '7\n1' }
    ],
    's08-l12': [
      {
        label: '更多数量输入',
        appendCode: "print(parse_quantity(' 7 '))\nprint(parse_quantity('-2'))",
        expected: '3\ninvalid\ninvalid\n7\nNone'
      }
    ],
    's11-l12': [
      {
        label: '余额不足不能扣款',
        appendCode: "print(acc.withdraw(1000), acc.balance)",
        expected: 'Ada 80 True\nFalse 80'
      }
    ],
    's12-l07': [
      { label: '另一条文本记录', appendCode: "u2 = User.from_text('Bob:20')\nprint(u2.name, u2.age)", expected: 'Ada 36\nBob 20' }
    ],
    's12-l12': [
      { label: '继续加入商品', appendCode: "cart.add(Item('X', 10, 1))\nprint(f'total={cart.total}')", expected: 'total=55\ntotal=65' }
    ],
    's16-l12': [
      {
        label: '端口边界',
        appendCode: "print(parse_port('1'))\ntry:\n    parse_port('65536')\nexcept ValueError:\n    print('ValueError')",
        expected: 'tests=4 passed\n1\nValueError'
      }
    ],
    's17-l12': [
      {
        label: '配置覆盖优先级',
        appendCode: "x = load_settings({'APP_PORT': '7000'}, {'host': '0.0.0.0', 'debug': None})\nprint(x.host, x.port, x.debug)",
        expected: 'localhost 9000 True\n0.0.0.0 7000 False'
      }
    ],
    's19-l05': [
      {
        label: '拒绝空标题',
        appendCode: "try:\n    service.create('   ')\nexcept ValueError:\n    print('ValueError')",
        expected: "['code']\nValueError"
      }
    ],
    's19-l12': [
      {
        label: '服务层保持校验',
        appendCode: "try:\n    service.create('  ')\nexcept ValueError:\n    print('ValueError')",
        expected: "['code', 'test']\nValueError"
      }
    ],
    's20-l03': [
      { label: '继续分配 ID', appendCode: "c = s.create('c')\nprint(c['id'])", expected: '1 2\n3' }
    ],
    's20-l04': [
      { label: '制表符空白', appendCode: "print(normalize_title('\\t test \\n'))", expected: 'code\ninvalid\ntest' }
    ],
    's20-l12': [
      {
        label: '项目继续扩展',
        appendCode: "service.create(' docs ')\nservice.complete(3)\nprint(service.stats())",
        expected: '1 code True\n2 test False\ntotal=2 done=1 open=1\ntotal=3 done=2 open=1'
      }
    ]
  };

  (window.LESSONS || []).forEach(lesson => {
    if (testsByKey[lesson.key]) lesson.hiddenTests = testsByKey[lesson.key];
  });
})();