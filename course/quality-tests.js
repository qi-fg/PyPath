(() => {
  const checks = {
  "s01-l01": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['print'] for name, node in __pypath_calls())",
      "expected": "Hello Engineer"
    }
  ],
  "s01-l02": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "project": "'Demo'"
      },
      "expected": "Demo"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "project": "''"
      },
      "expected": ""
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert project == 'PyPath'",
      "expected": "PyPath"
    }
  ],
  "s01-l03": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "n": "0"
      },
      "expected": "int"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "n": "-7"
      },
      "expected": "int"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['type'] for name, node in __pypath_calls())",
      "expected": "int"
    }
  ],
  "s01-l04": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "a": "0",
        "b": "9"
      },
      "expected": "0"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "a": "-3",
        "b": "4"
      },
      "expected": "-12"
    }
  ],
  "s01-l05": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "count": "0"
      },
      "expected": "3"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "count": "-2"
      },
      "expected": "1"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert count == 5",
      "expected": "5"
    }
  ],
  "s01-l06": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('BinOp')\nassert any(type(n.op).__name__ == \"Mult\" for n in __pypath_nodes(\"BinOp\"))",
      "expected": "20"
    }
  ],
  "s01-l07": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert x == 3 and y == 5\nassert any(any(type(t).__name__ == 'Tuple' for t in n.targets) for n in __pypath_nodes('Assign'))",
      "expected": "8"
    }
  ],
  "s01-l08": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert is_ready is True",
      "expected": "True"
    }
  ],
  "s01-l09": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "result": "0"
      },
      "expected": "False"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "result": "''"
      },
      "expected": "False"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert result is None\nassert __pypath_nodes('Compare')",
      "expected": "True"
    }
  ],
  "s01-l10": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "user_score": "0"
      },
      "expected": "0"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "user_score": "-2"
      },
      "expected": "-2"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert user_score == 88",
      "expected": "88"
    }
  ],
  "s01-l11": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "numbers": "[]"
      },
      "expected": "0"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "numbers": "[-3, 0, 4]"
      },
      "expected": "1"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('For')",
      "expected": "15"
    }
  ],
  "s01-l12": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "name": "'Bob'",
        "years": "0",
        "projects": "8"
      },
      "expected": "Name: Bob\nNext year: 1\nProjects: 8"
    }
  ],
  "s02-l01": [
    {
      "label": "不同输入",
      "stdin": "Bob",
      "expected": "Hello Bob"
    },
    {
      "label": "不同输入",
      "stdin": "李雷",
      "expected": "Hello 李雷"
    }
  ],
  "s02-l02": [
    {
      "label": "不同输入",
      "stdin": "0",
      "expected": "1"
    },
    {
      "label": "不同输入",
      "stdin": "19",
      "expected": "20"
    },
    {
      "label": "不同输入",
      "stdin": "99",
      "expected": "100"
    }
  ],
  "s02-l03": [
    {
      "label": "不同输入",
      "stdin": "0",
      "expected": "0.0"
    },
    {
      "label": "不同输入",
      "stdin": "0.5",
      "expected": "1.0"
    },
    {
      "label": "不同输入",
      "stdin": "2.5",
      "expected": "5.0"
    }
  ],
  "s02-l04": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "name": "'Bob'"
      },
      "expected": "User: Bob"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('JoinedStr')",
      "expected": "User: Ada"
    }
  ],
  "s02-l05": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "text": "''"
      },
      "expected": "0"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "text": "'工程Python'"
      },
      "expected": "8"
    }
  ],
  "s02-l06": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "word": "'a'"
      },
      "expected": "a"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "word": "'Python'"
      },
      "expected": "P"
    }
  ],
  "s02-l07": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "text": "'api'"
      },
      "expected": "api"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "text": "'frontend'"
      },
      "expected": "fron"
    }
  ],
  "s02-l08": [
    {
      "label": "不同输入",
      "stdin": "  Bob  ",
      "expected": "Bob"
    },
    {
      "label": "不同输入",
      "stdin": "\t李雷\t",
      "expected": "李雷"
    },
    {
      "label": "不同输入",
      "stdin": "   ",
      "expected": ""
    }
  ],
  "s02-l09": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "email": "'Bob@EXAMPLE.COM'"
      },
      "expected": "bob@example.com"
    }
  ],
  "s02-l10": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "line": "'bob,19,osaka'"
      },
      "expected": "19"
    }
  ],
  "s02-l11": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "parts": "[]"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "parts": "['x','y']"
      },
      "expected": "x/y"
    }
  ],
  "s02-l12": [
    {
      "label": "不同输入",
      "stdin": " Bob \n19\n Osaka ",
      "expected": "User=Bob | NextAge=20 | City=Osaka"
    },
    {
      "label": "不同输入",
      "stdin": "李雷\n0\n 北京 ",
      "expected": "User=李雷 | NextAge=1 | City=北京"
    }
  ],
  "s03-l01": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "a": "8",
        "b": "8"
      },
      "expected": "False"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "a": "7",
        "b": "8"
      },
      "expected": "False"
    }
  ],
  "s03-l02": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "score": "59"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "score": "60"
      },
      "expected": "pass"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "score": "61"
      },
      "expected": "pass"
    }
  ],
  "s03-l03": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "age": "17"
      },
      "expected": "minor"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "age": "18"
      },
      "expected": "adult"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "age": "19"
      },
      "expected": "adult"
    }
  ],
  "s03-l04": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "score": "79"
      },
      "expected": "C"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "score": "80"
      },
      "expected": "B"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "score": "89"
      },
      "expected": "B"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "score": "90"
      },
      "expected": "A"
    }
  ],
  "s03-l05": [
    {
      "label": "年龄/票组合",
      "overrides": {
        "age": "17",
        "has_ticket": "False"
      },
      "expected": ""
    },
    {
      "label": "年龄/票组合",
      "overrides": {
        "age": "17",
        "has_ticket": "True"
      },
      "expected": ""
    },
    {
      "label": "年龄/票组合",
      "overrides": {
        "age": "18",
        "has_ticket": "False"
      },
      "expected": ""
    },
    {
      "label": "年龄/票组合",
      "overrides": {
        "age": "18",
        "has_ticket": "True"
      },
      "expected": "enter"
    },
    {
      "label": "年龄/票组合",
      "overrides": {
        "age": "19",
        "has_ticket": "False"
      },
      "expected": ""
    },
    {
      "label": "年龄/票组合",
      "overrides": {
        "age": "19",
        "has_ticket": "True"
      },
      "expected": "enter"
    },
    {
      "label": "年龄/票组合",
      "overrides": {
        "age": "20",
        "has_ticket": "False"
      },
      "expected": ""
    },
    {
      "label": "年龄/票组合",
      "overrides": {
        "age": "20",
        "has_ticket": "True"
      },
      "expected": "enter"
    },
    {
      "label": "使用题目要求的布尔运算符",
      "checkCode": "assert any(type(n.op).__name__=='And' for n in __pypath_nodes('BoolOp'))",
      "expected": "enter"
    }
  ],
  "s03-l06": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "is_admin": "False",
        "is_owner": "False"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "is_admin": "False",
        "is_owner": "True"
      },
      "expected": "edit"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "is_admin": "True",
        "is_owner": "False"
      },
      "expected": "edit"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "is_admin": "True",
        "is_owner": "True"
      },
      "expected": "edit"
    },
    {
      "label": "使用题目要求的布尔运算符",
      "checkCode": "assert any(type(n.op).__name__=='Or' for n in __pypath_nodes('BoolOp'))",
      "expected": "edit"
    }
  ],
  "s03-l07": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "logged_in": "True"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "logged_in": "False"
      },
      "expected": "login required"
    }
  ],
  "s03-l08": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "role": "'admin'"
      },
      "expected": "allowed"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "role": "'guest'"
      },
      "expected": ""
    }
  ],
  "s03-l09": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "user_ok": "False",
        "quota": "-1"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "user_ok": "False",
        "quota": "0"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "user_ok": "False",
        "quota": "1"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "user_ok": "True",
        "quota": "-1"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "user_ok": "True",
        "quota": "0"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "user_ok": "True",
        "quota": "1"
      },
      "expected": "run"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(any(type(child).__name__ == 'If' for child in n.body) for n in __pypath_nodes('If'))",
      "expected": "run"
    }
  ],
  "s03-l10": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "score": "59"
      },
      "expected": "fail"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "score": "60"
      },
      "expected": "pass"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('IfExp')",
      "expected": "pass"
    }
  ],
  "s03-l11": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "age": "17"
      },
      "expected": "deny"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "age": "18"
      },
      "expected": "allow"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "age": "19"
      },
      "expected": "allow"
    }
  ],
  "s03-l12": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "role": "'admin'",
        "active": "True",
        "banned": "False"
      },
      "expected": "access granted"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "role": "'admin'",
        "active": "False",
        "banned": "False"
      },
      "expected": "access denied"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "role": "'admin'",
        "active": "True",
        "banned": "True"
      },
      "expected": "access denied"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "role": "'editor'",
        "active": "True",
        "banned": "False"
      },
      "expected": "access granted"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "role": "'editor'",
        "active": "False",
        "banned": "False"
      },
      "expected": "access denied"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "role": "'editor'",
        "active": "True",
        "banned": "True"
      },
      "expected": "access denied"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "role": "'guest'",
        "active": "True",
        "banned": "False"
      },
      "expected": "access denied"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "role": "'guest'",
        "active": "False",
        "banned": "False"
      },
      "expected": "access denied"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "role": "'guest'",
        "active": "True",
        "banned": "True"
      },
      "expected": "access denied"
    }
  ],
  "s04-l01": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "services": "[]"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "services": "['x','y']"
      },
      "expected": "x\ny"
    }
  ],
  "s04-l02": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('For')\nassert any(name.split('.')[-1] in ['range'] for name, node in __pypath_calls())",
      "expected": "1\n2\n3\n4"
    }
  ],
  "s04-l03": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('For')\nassert total == 15",
      "expected": "15"
    }
  ],
  "s04-l04": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "nums": "[]"
      },
      "expected": "0"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "nums": "[1,3,5]"
      },
      "expected": "0"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "nums": "[0,-2,4]"
      },
      "expected": "3"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('For')",
      "expected": "3"
    }
  ],
  "s04-l05": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "n": "0"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "n": "1"
      },
      "expected": "1"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "n": "4"
      },
      "expected": "4\n3\n2\n1"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('While')",
      "expected": "3\n2\n1"
    }
  ],
  "s04-l06": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('For')\nassert __pypath_nodes('Break')",
      "expected": "4"
    }
  ],
  "s04-l07": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('For')\nassert __pypath_nodes('Continue')",
      "expected": "1\n2\n4\n5"
    }
  ],
  "s04-l08": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "items": "[]"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "items": "['x','y']"
      },
      "expected": "0 x\n1 y"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['enumerate'] for name, node in __pypath_calls())",
      "expected": "0 a\n1 b\n2 c"
    }
  ],
  "s04-l09": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "users": "['C']",
        "envs": "['test']"
      },
      "expected": "C-test"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "users": "[]",
        "envs": "['dev']"
      },
      "expected": ""
    }
  ],
  "s04-l10": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "nums": "[-9,-3,-7]"
      },
      "expected": "-3"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "nums": "[5]"
      },
      "expected": "5"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('For')\nassert not any(name == \"max\" for name,node in __pypath_calls())",
      "expected": "9"
    }
  ],
  "s04-l11": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('While')",
      "expected": "1\n2\n3"
    }
  ],
  "s04-l12": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "latencies": "[100]"
      },
      "expected": "avg=100.0\nslow=0\nmax=100"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "latencies": "[0,100,101]"
      },
      "expected": "avg=67.0\nslow=1\nmax=101"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "latencies": "[50,50]"
      },
      "expected": "avg=50.0\nslow=0\nmax=50"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert len(__pypath_nodes('For'))+len(__pypath_nodes('While'))==1",
      "expected": "avg=138.0\nslow=3\nmax=250"
    }
  ],
  "s05-l01": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "numbers": "[]"
      },
      "expected": "[3]"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "numbers": "[9]"
      },
      "expected": "[9, 3]"
    }
  ],
  "s05-l02": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "items": "[]"
      },
      "expected": "[2, 3]"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "items": "[9]"
      },
      "expected": "[9, 2, 3]"
    }
  ],
  "s05-l03": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "queue": "['X','Y']"
      },
      "expected": "['X', 'B', 'Y']"
    }
  ],
  "s05-l04": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "roles": "['guest','x','guest']"
      },
      "expected": "['x', 'guest']"
    }
  ],
  "s05-l05": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "stack": "['z']"
      },
      "expected": "z\n[]"
    }
  ],
  "s05-l06": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "nums": "[]"
      },
      "expected": "[]"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "nums": "[3,-2,3]"
      },
      "expected": "[-2, 3, 3]"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['sort'] for name, node in __pypath_calls())",
      "expected": "[1, 2, 3, 4]"
    }
  ],
  "s05-l07": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "original": "[]"
      },
      "expected": "[]\n[4]"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "original": "[9]"
      },
      "expected": "[9]\n[9, 4]"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert copy is not original\nassert __pypath_nodes('Slice')",
      "expected": "[1, 2, 3]\n[1, 2, 3, 4]"
    }
  ],
  "s05-l08": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "point": "(-2, 7)"
      },
      "expected": "5"
    }
  ],
  "s05-l09": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "ids": "[]"
      },
      "expected": "0"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "ids": "[9,9,9]"
      },
      "expected": "1"
    }
  ],
  "s05-l10": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "a": "set()"
      },
      "expected": "0"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "a": "{'db','queue'}"
      },
      "expected": "2"
    }
  ],
  "s05-l11": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "tasks": "[]"
      },
      "expected": "[]\n['c']"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "tasks": "['x']"
      },
      "expected": "['x']\n['x', 'c']"
    }
  ],
  "s05-l12": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "raw": "[]"
      },
      "expected": "tags=[]\ncount=0"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "raw": "['z','a','z']"
      },
      "expected": "tags=['a', 'z']\ncount=2"
    }
  ],
  "s06-l01": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "user": "{'name':'Bob'}"
      },
      "expected": "Bob"
    }
  ],
  "s06-l02": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "config": "{'port':0}"
      },
      "expected": "0"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "config": "{'port':9000}"
      },
      "expected": "9000"
    }
  ],
  "s06-l03": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "user": "{}"
      },
      "expected": "True"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert user['active'] is True",
      "expected": "True"
    }
  ],
  "s06-l04": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "data": "{}"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "data": "{'z':0,'c':1}"
      },
      "expected": "c\nz"
    }
  ],
  "s06-l05": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "metrics": "{}"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "metrics": "{'x':4,'y':0}"
      },
      "expected": "x 4\ny 0"
    }
  ],
  "s06-l06": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "user": "{'profile':{'city':'北京'}}"
      },
      "expected": "北京"
    }
  ],
  "s06-l07": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "users": "[]"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "users": "[{'name':'C'}]"
      },
      "expected": "C"
    }
  ],
  "s06-l08": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "words": "['api']"
      },
      "expected": "1"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "words": "['api','api','x','api','api']"
      },
      "expected": "4"
    }
  ],
  "s06-l09": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "nums": "[]"
      },
      "expected": "{}"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "nums": "[-2,0,4]"
      },
      "expected": "{-2: 4, 0: 0, 4: 16}"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('DictComp')",
      "expected": "{1: 1, 2: 4, 3: 9}"
    }
  ],
  "s06-l10": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "override": "{'port':0}"
      },
      "expected": "0"
    }
  ],
  "s06-l11": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "user": "{'nickname':'Bob'}"
      },
      "expected": "Bob"
    }
  ],
  "s06-l12": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "users": "[]"
      },
      "expected": "active=0\nadmin=0\neditor=0"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "users": "[{'role':'admin','active':False},{'role':'admin','active':True}]"
      },
      "expected": "active=1\nadmin=2\neditor=0"
    }
  ],
  "s07-l01": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "import contextlib, io\nb=io.StringIO()\nwith contextlib.redirect_stdout(b): hello()\nassert b.getvalue().strip() == 'hello'",
      "expected": "hello"
    }
  ],
  "s07-l02": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert add(-2,7)==5 and add(0,0)==0",
      "expected": "8"
    }
  ],
  "s07-l03": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert square(-4)==16 and square(0)==0",
      "expected": "36"
    }
  ],
  "s07-l04": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert greet('Bob')=='Hi Bob' and greet('李雷','Hello')=='Hello 李雷'",
      "expected": "Hi Ada"
    }
  ],
  "s07-l05": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert connect(host='api',port=80)=='api:80'\nassert any({k.arg for k in n.keywords} >= {'host','port'} for name,n in __pypath_calls() if name=='connect')",
      "expected": "localhost:9000"
    }
  ],
  "s07-l06": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert min_max([-5,0,4]) == (-5,4) and min_max([7])==(7,7)",
      "expected": "1 9"
    }
  ],
  "s07-l07": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert name=='outer'\nassert not __pypath_nodes('Global')",
      "expected": "inner\nouter"
    }
  ],
  "s07-l08": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert total()==0 and total(-2,3,0)==1",
      "expected": "10"
    }
  ],
  "s07-l09": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "import contextlib,io\nb=io.StringIO()\nwith contextlib.redirect_stdout(b): show(name='Bob',role='guest')\nassert b.getvalue().strip()=='Bob'",
      "expected": "Ada"
    }
  ],
  "s07-l10": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert double(-3)==-6 and add_one(0)==1",
      "expected": "7"
    }
  ],
  "s07-l11": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert add(0,7)==7 and add(-2,2)==0",
      "expected": "8"
    }
  ],
  "s07-l12": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert normalize_name('  bob smith ')=='Bob Smith'\nassert is_valid_age(0) is True and is_valid_age(120) is True\nassert is_valid_age(-1) is False and is_valid_age(121) is False\nassert build_user(' bob ',0)=={'name':'Bob','age':0}\nassert build_user('Bob',121) is None",
      "expected": "Ada Lovelace 36"
    }
  ],
  "s08-l01": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['print'] for name, node in __pypath_calls())",
      "expected": "hello"
    }
  ],
  "s08-l02": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "username": "'Bob'"
      },
      "expected": "Bob"
    }
  ],
  "s08-l03": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "age": "'0'"
      },
      "expected": "1"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "age": "'19'"
      },
      "expected": "20"
    }
  ],
  "s08-l04": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "items": "[]"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "items": "['z']"
      },
      "expected": "z"
    }
  ],
  "s08-l05": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "user": "{'role':'admin'}"
      },
      "expected": "admin"
    }
  ],
  "s08-l06": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('Try')\nassert any(name.split('.')[-1] in ['int'] for name, node in __pypath_calls())",
      "expected": "invalid"
    }
  ],
  "s08-l07": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(n.orelse for n in __pypath_nodes('Try'))",
      "expected": "ok"
    }
  ],
  "s08-l08": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(n.finalbody for n in __pypath_nodes('Try'))",
      "expected": "work\ncleanup"
    }
  ],
  "s08-l09": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "validate(0)\nvalidate(5)\ntry: validate(-2)\nexcept ValueError: pass\nelse: raise AssertionError('negative value accepted')",
      "expected": "bad"
    }
  ],
  "s08-l10": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('Assert')",
      "expected": "valid"
    }
  ],
  "s08-l11": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "age": "'0'"
      },
      "expected": "1"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "age": "'99'"
      },
      "expected": "100"
    }
  ],
  "s08-l12": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert parse_quantity(' 7 ')==7\nfor text in ['', '  ', 'abc', '0','-2']:\n    assert parse_quantity(text) is None",
      "expected": "3\ninvalid\ninvalid"
    }
  ],
  "s09-l01": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "from pathlib import Path\nassert Path('demo.txt').read_text(encoding='utf-8')=='hello'",
      "expected": "hello"
    }
  ],
  "s09-l02": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "from pathlib import Path\nassert Path('note.txt').read_text(encoding='utf-8')=='safe'\nassert __pypath_nodes('With')",
      "expected": "safe"
    }
  ],
  "s09-l03": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "from pathlib import Path\nassert Path('log.txt').read_text()=='AB'\nassert any(any(getattr(a,'value',None)=='a' for a in node.args) for name,node in __pypath_calls() if name=='open')",
      "expected": "AB"
    }
  ],
  "s09-l04": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "from pathlib import Path\nassert Path('x.txt').read_text(encoding='utf-8')=='python'",
      "expected": "python"
    }
  ],
  "s09-l05": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "from pathlib import Path\nassert Path('ready.txt').is_file()",
      "expected": "True"
    }
  ],
  "s09-l06": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "from pathlib import Path\nassert Path('data').is_dir()",
      "expected": "True"
    }
  ],
  "s09-l07": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['dumps'] for name, node in __pypath_calls())",
      "expected": "{\"age\": 36, \"name\": \"Ada\"}"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "data": "{'name':'李雷','age':0}"
      },
      "expected": "{\"age\": 0, \"name\": \"\\u674e\\u96f7\"}"
    }
  ],
  "s09-l08": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1]=='loads' for name,node in __pypath_calls())",
      "expected": "8000"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "text": "'{\"port\":9000}'"
      },
      "expected": "9000"
    }
  ],
  "s09-l09": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "import json\nassert json.load(open('config.json',encoding='utf-8'))=={'enabled':True}",
      "expected": "True"
    }
  ],
  "s09-l10": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "import csv\nassert list(csv.reader(open('scores.csv',newline='',encoding='utf-8')))==[['name','score'],['Ada','95']]",
      "expected": "Ada 95"
    }
  ],
  "s09-l11": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "from pathlib import Path\nassert Path('cn.txt').read_bytes()=='你好'.encode('utf-8')",
      "expected": "你好"
    }
  ],
  "s09-l12": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "import json\nassert json.load(open('settings.json',encoding='utf-8'))=={'version':2,'debug':True}",
      "expected": "version=2\ndebug=True"
    }
  ],
  "s10-l01": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['sqrt'] for name, node in __pypath_calls())",
      "expected": "9"
    }
  ],
  "s10-l02": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['ceil'] for name, node in __pypath_calls())",
      "expected": "4"
    }
  ],
  "s10-l03": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert js.__name__=='json'\nassert any(name.split('.')[-1] in ['dumps'] for name, node in __pypath_calls())",
      "expected": "[1, 2]"
    }
  ],
  "s10-l04": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['mean'] for name, node in __pypath_calls())",
      "expected": "20"
    }
  ],
  "s10-l05": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('Name')\nassert any(n.id=='__name__' for n in __pypath_nodes('Name'))",
      "expected": "__main__"
    }
  ],
  "s10-l06": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert callable(main)\nassert __pypath_nodes('If')",
      "expected": "start"
    },
    {
      "label": "被导入时不执行入口",
      "moduleName": "exercise_import",
      "expected": ""
    }
  ],
  "s10-l07": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert sys.argv[1:]==['deploy','prod']",
      "expected": "deploy prod"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "sys.argv": "['app.py','test','dev']"
      },
      "expected": "test dev"
    }
  ],
  "s10-l08": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1]=='add_argument' and any(k.arg=='type' and getattr(k.value,'id',None)=='int' for k in node.keywords) for name,node in __pypath_calls())",
      "expected": "9000"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "sys.argv": "['app.py','--port','1']"
      },
      "expected": "1"
    }
  ],
  "s10-l09": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1]=='parse_args' for name,node in __pypath_calls())",
      "expected": "dev"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "sys.argv": "['app.py','--mode','prod']"
      },
      "expected": "prod"
    }
  ],
  "s10-l10": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1]=='startswith' for name,node in __pypath_calls())",
      "expected": "2"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "paths": "[]"
      },
      "expected": "0"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "paths": "['app/x.py','tests/x.py']"
      },
      "expected": "1"
    }
  ],
  "s10-l11": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert math.__name__=='math'",
      "expected": "4"
    }
  ],
  "s10-l12": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['ArgumentParser', 'parse_args'] for name, node in __pypath_calls())",
      "expected": "deploy env=prod replicas=3"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "sys.argv": "['deploy.py','--env','dev','--replicas','2']"
      },
      "expected": "deploy env=dev replicas=2"
    }
  ],
  "s11-l01": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert isinstance(s,Service)",
      "expected": "Service"
    }
  ],
  "s11-l02": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert User('Bob').name=='Bob'",
      "expected": "Ada"
    }
  ],
  "s11-l03": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "z=Counter()\nz.inc(); z.inc()\nassert z.value==2",
      "expected": "1"
    }
  ],
  "s11-l04": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=Counter();y=Counter();x.inc();x.inc();y.inc();assert x.value==2 and y.value==1 and x is not y",
      "expected": "2 1"
    }
  ],
  "s11-l05": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert Rectangle(2,5).area()==10 and Rectangle(0,5).area()==0",
      "expected": "12"
    }
  ],
  "s11-l06": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert User.kind=='human' and User().kind=='human'",
      "expected": "human"
    }
  ],
  "s11-l07": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert str(User('Bob'))=='User(Bob)'",
      "expected": "User(Ada)"
    }
  ],
  "s11-l08": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "z=Task()\nassert z.done is False\nz.complete(); z.complete()\nassert z.done is True",
      "expected": "True"
    }
  ],
  "s11-l09": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert isinstance(user,User)\nassert any(name.split('.')[-1] in ['isinstance'] for name, node in __pypath_calls())",
      "expected": "True"
    }
  ],
  "s11-l10": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert [u.name for u in users]==['A','B'] and users[0] is not users[1]",
      "expected": "A\nB"
    }
  ],
  "s11-l11": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=Cart(); y=Cart(); x.add('a'); x.add('b')\nassert x.items==['a','b'] and y.items==[]",
      "expected": "1\n0"
    }
  ],
  "s11-l12": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=Account('Bob')\nassert x.balance==0\nx.deposit(5)\nassert x.withdraw(5) is True and x.balance==0\nassert x.withdraw(1) is False and x.balance==0",
      "expected": "Ada 80 True"
    }
  ],
  "s12-l01": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert issubclass(Dog,Animal) and Dog().speak()=='?'",
      "expected": "?"
    }
  ],
  "s12-l02": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert issubclass(Dog,Animal) and Dog().speak()=='woof' and Animal().speak()=='?'",
      "expected": "woof"
    }
  ],
  "s12-l03": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=Employee('Bob','ops')\nassert isinstance(x,Person) and (x.name,x.role)==('Bob','ops')\nassert any(name.split('.')[-1] in ['super'] for name, node in __pypath_calls())",
      "expected": "Ada dev"
    }
  ],
  "s12-l04": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=Car()\nassert isinstance(x.engine,Engine) and x.start()=='on'\nx.engine.start=lambda:'test'\nassert x.start()=='test'",
      "expected": "on"
    }
  ],
  "s12-l05": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "import dataclasses\nassert dataclasses.is_dataclass(Point)\nx=Point(-2,0)\nassert (x.x,x.y)==(-2,0)",
      "expected": "2 3"
    }
  ],
  "s12-l06": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert isinstance(Rectangle.area,property) and Rectangle(2,5).area==10",
      "expected": "12"
    }
  ],
  "s12-l07": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=User.from_text('Bob:0')\nassert isinstance(x,User) and (x.name,x.age)==('Bob',0)",
      "expected": "Ada 36"
    }
  ],
  "s12-l08": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert Validator.is_email('abc') is False and Validator.is_email('a@b') is True",
      "expected": "True"
    }
  ],
  "s12-l09": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert issubclass(InvalidAgeError,Exception)\nassert __pypath_nodes('Raise')\nassert __pypath_nodes('Try')",
      "expected": "invalid age"
    }
  ],
  "s12-l10": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=Box(); y=Box(); x.items.append('a')\nassert y.items==[] and x.items==['a']",
      "expected": "1 0"
    }
  ],
  "s12-l11": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert not issubclass(Printer,Logger)\nassert isinstance(Printer().logger,Logger)",
      "expected": "log:print"
    }
  ],
  "s12-l12": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=Cart(); y=Cart()\nassert x.total==0\nx.add(Item('x',7,3));x.add(Item('y',2))\nassert x.total==23 and y.total==0",
      "expected": "total=55"
    }
  ],
  "s13-l01": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "from datetime import date\nassert any(isinstance(v,date) and v.isoformat()=='2026-10-01' for v in list(globals().values()))",
      "expected": "2026-10-01"
    }
  ],
  "s13-l02": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['timedelta'] for name, node in __pypath_calls())",
      "expected": "2026-10-08"
    }
  ],
  "s13-l03": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert counts['a']==3\nassert any(name.split('.')[-1] in ['Counter'] for name, node in __pypath_calls())",
      "expected": "3"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "items": "['a']"
      },
      "expected": "1"
    }
  ],
  "s13-l04": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert counts['x']==2 and counts['missing']==0",
      "expected": "2"
    }
  ],
  "s13-l05": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert list(q)==['b','c']",
      "expected": "a\n['b', 'c']"
    }
  ],
  "s13-l06": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['zip'] for name, node in __pypath_calls())",
      "expected": "A 90\nB 80"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "names": "['C']"
      },
      "expected": "C 90"
    }
  ],
  "s13-l07": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['chain'] for name, node in __pypath_calls())",
      "expected": "1\n2\n3\n4"
    }
  ],
  "s13-l08": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert square(0)==0 and square(-3)==9",
      "expected": "25"
    }
  ],
  "s13-l09": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['search'] for name, node in __pypath_calls())",
      "expected": "123"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "text": "'id=0; user=Bob'"
      },
      "expected": "0"
    }
  ],
  "s13-l10": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['sub'] for name, node in __pypath_calls())",
      "expected": "a b c"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "text": "'x\t\ty    z'"
      },
      "expected": "x y z"
    }
  ],
  "s13-l11": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['Path'] for name, node in __pypath_calls())",
      "expected": "report .csv"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "p": "Path('/tmp/a.txt')"
      },
      "expected": "a .txt"
    }
  ],
  "s13-l12": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['Counter', 'match'] for name, node in __pypath_calls())",
      "expected": "errors=3\ntimeout=True"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "logs": "['INFO x']"
      },
      "expected": "errors=0\ntimeout=False"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "logs": "['ERROR timeout']"
      },
      "expected": "errors=1\ntimeout=True"
    }
  ],
  "s14-l01": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "import sqlite3\nassert any(isinstance(v,sqlite3.Connection) for v in list(globals().values()))\nassert any(name.split('.')[-1]=='execute' for name,node in __pypath_calls())",
      "expected": "1"
    }
  ],
  "s14-l02": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert [x[1:3] for x in conn.execute('PRAGMA table_info(users)')]==[('id','INTEGER'),('name','TEXT')]",
      "expected": "users"
    }
  ],
  "s14-l03": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert conn.execute('SELECT name FROM users').fetchall()==[('Ada',)]",
      "expected": "Ada"
    }
  ],
  "s14-l04": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert conn.execute('SELECT name FROM users ORDER BY name').fetchall()==[('A',),('B',)]\nassert any(name.split('.')[-1]=='fetchone' for name,node in __pypath_calls())",
      "expected": "B"
    }
  ],
  "s14-l05": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1]=='fetchall' for name,node in __pypath_calls())\nassert conn.execute('SELECT n FROM nums ORDER BY n').fetchall()==[(1,),(2,),(3,)]",
      "expected": "[1, 2, 3]"
    }
  ],
  "s14-l06": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert conn.execute('SELECT name,score FROM users').fetchall()==[('Ada',95)]",
      "expected": "95"
    }
  ],
  "s14-l07": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert conn.execute('SELECT name FROM users').fetchall()==[('B',)]",
      "expected": "1"
    }
  ],
  "s14-l08": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert conn.execute('SELECT COUNT(*) FROM users WHERE active=1').fetchone()[0]==2",
      "expected": "2"
    }
  ],
  "s14-l09": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert conn.execute('SELECT MAX(score) FROM scores').fetchone()[0]==95\nassert any(name.split('.')[-1]=='execute' for name,node in __pypath_calls())",
      "expected": "95"
    }
  ],
  "s14-l10": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "import sqlite3\nassert conn.row_factory is sqlite3.Row\nassert conn.execute('SELECT name FROM users').fetchone()['name']=='Ada'",
      "expected": "Ada"
    }
  ],
  "s14-l11": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert conn.execute('SELECT balance FROM account').fetchone()[0]==100\nassert not conn.in_transaction",
      "expected": "100"
    }
  ],
  "s14-l12": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert conn.execute('SELECT id,title,done FROM tasks ORDER BY id').fetchall()==[(1,'code',1),(2,'test',1)]\nassert not conn.in_transaction",
      "expected": "total=2\nopen=0"
    }
  ],
  "s15-l01": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "response": "{'status':199}"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "response": "{'status':299}"
      },
      "expected": "success"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "response": "{'status':300}"
      },
      "expected": ""
    }
  ],
  "s15-l02": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "response_text": "'{\"name\":\"Bob\"}'"
      },
      "expected": "Bob"
    }
  ],
  "s15-l03": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "params": "{'q':'a b&c','page':0}"
      },
      "expected": "q=a+b%26c&page=0"
    }
  ],
  "s15-l04": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert headers=={'Authorization':'Bearer token','Accept':'application/json'}",
      "expected": "application/json"
    }
  ],
  "s15-l05": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "payload": "{'title':'中文','done':True}"
      },
      "expected": "{\"done\": true, \"title\": \"\\u4e2d\\u6587\"}"
    }
  ],
  "s15-l06": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "data": "{'items':[]}"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "data": "{'items':[{'id':9}]}"
      },
      "expected": "9"
    }
  ],
  "s15-l07": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "response": "{'status':200,'json':{}}"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "response": "{'status':500,'json':{}}"
      },
      "expected": "unknown"
    }
  ],
  "s15-l08": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "pages": "[]"
      },
      "expected": "[]"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "pages": "[[9],[],[0]]"
      },
      "expected": "[9, 0]"
    }
  ],
  "s15-l09": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "token": "'abc-secret'"
      },
      "expected": "abc***"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "token": "'x'"
      },
      "expected": "x***"
    }
  ],
  "s15-l10": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "results": "[True,False]"
      },
      "expected": "attempts=1"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "results": "[False,True]"
      },
      "expected": "attempts=2"
    }
  ],
  "s15-l11": [
    {
      "label": "不同数据/边界",
      "overrides": {
        "response": "{}"
      },
      "expected": "anonymous"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "response": "{'user':{'nickname':'Bob'}}"
      },
      "expected": "Bob"
    }
  ],
  "s15-l12": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "seen=[]\ndef f(i):\n    seen.append(i)\n    return {'status':200,'json':{'name':'Bob'}}\nassert get_user(f,7)=='Bob' and seen==[7]\nassert get_user(lambda i:{'status':404,'json':{}},8) is None\ntry: get_user(lambda i:{'status':500,'json':{}},9)\nexcept RuntimeError: pass\nelse: raise AssertionError('server error swallowed')",
      "expected": "Ada\nmissing"
    }
  ],
  "s16-l01": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert len(__pypath_nodes('Assert')) >= 1",
      "expected": "passed"
    }
  ],
  "s16-l02": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert len(__pypath_nodes('Assert')) >= 2",
      "expected": "passed"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert is_even(-2) is True and is_even(0) is True and is_even(-1) is False",
      "expected": "passed"
    }
  ],
  "s16-l03": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert len(__pypath_nodes('Assert')) >= 3",
      "expected": "passed"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert adult(17) is False and adult(18) is True and adult(19) is True",
      "expected": "passed"
    }
  ],
  "s16-l04": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert len(__pypath_nodes('Assert')) >= 1",
      "expected": "3 tests"
    }
  ],
  "s16-l05": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('Try')",
      "expected": "raised"
    }
  ],
  "s16-l06": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert len(__pypath_nodes('Assert')) >= 1",
      "expected": "passed"
    }
  ],
  "s16-l07": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert len(__pypath_nodes('Assert')) >= 1",
      "expected": "200"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert send(lambda:{'status':503})==503",
      "expected": "200"
    }
  ],
  "s16-l08": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1]=='seed' for name,node in __pypath_calls())\nassert any(name.split('.')[-1]=='randint' for name,node in __pypath_calls())",
      "expected": "[3, 10, 2]"
    }
  ],
  "s16-l09": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert len(__pypath_nodes('Assert')) >= 1",
      "expected": "passed"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert normalize(' Bob ')=='Bob' and normalize('   ')==''",
      "expected": "passed"
    }
  ],
  "s16-l10": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert len(__pypath_nodes('Assert')) >= 2",
      "expected": "passed"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert build_user('Bob')=={'name':'Bob','active':True}",
      "expected": "passed"
    }
  ],
  "s16-l11": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert len(__pypath_nodes('Assert')) >= 3",
      "expected": "passed"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert clamp(-5,-2,8)==-2 and clamp(8,-2,8)==8 and clamp(9,-2,8)==8",
      "expected": "passed"
    }
  ],
  "s16-l12": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert len(__pypath_nodes('Assert')) >= 2",
      "expected": "tests=4 passed"
    },
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert parse_port('1')==1 and parse_port('65535')==65535\nfor text in ['0','65536','abc','']:\n    try: parse_port(text)\n    except ValueError: pass\n    else: raise AssertionError('invalid port accepted')",
      "expected": "tests=4 passed"
    }
  ],
  "s17-l01": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['getenv'] for name, node in __pypath_calls())",
      "expected": "dev"
    }
  ],
  "s17-l02": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert os.environ['APP_MODE']=='prod'",
      "expected": "prod"
    }
  ],
  "s17-l03": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert defaults['port']==8000 and config['port']==9000 and defaults is not config",
      "expected": "9000\n8000"
    }
  ],
  "s17-l04": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('If')",
      "expected": "missing api_key"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "config": "{'api_key':'present'}"
      },
      "expected": ""
    }
  ],
  "s17-l05": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['getLevelName'] for name, node in __pypath_calls())",
      "expected": "WARNING"
    }
  ],
  "s17-l06": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['print'] for name, node in __pypath_calls())",
      "expected": "INFO login Ada"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "event": "{'level':'WARN','action':'stop','user':'Bob'}"
      },
      "expected": "WARN stop Bob"
    }
  ],
  "s17-l07": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('BinOp')",
      "expected": "secret-***"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "key": "'other-secret'"
      },
      "expected": "other-***"
    }
  ],
  "s17-l08": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert Settings().port==8000 and Settings('api',80).host=='api'",
      "expected": "localhost:8000"
    }
  ],
  "s17-l09": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert mode=='prod'",
      "expected": "prod"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "cli": "''"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "cli": "'test'"
      },
      "expected": "test"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "cli": "None",
        "env": "''"
      },
      "expected": ""
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "cli": "None",
        "env": "None"
      },
      "expected": "dev"
    }
  ],
  "s17-l10": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('IfExp')",
      "expected": "old"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "flags": "{}"
      },
      "expected": "old"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "flags": "{'new_ui':True}"
      },
      "expected": "new"
    }
  ],
  "s17-l11": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('Raise')\nassert __pypath_nodes('Try')",
      "expected": "config error"
    }
  ],
  "s17-l12": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=load_settings({}, {})\nassert (x.host,x.port,x.debug)==('localhost',8000,False)\nx=load_settings({'APP_PORT':'9000'},{'port':0,'debug':False})\nassert x.port==0 and x.debug is False\nx=load_settings({'APP_PORT':'7000'},{'port':None,'host':''})\nassert x.port==7000 and x.host==''",
      "expected": "localhost 9000 True"
    }
  ],
  "s18-l01": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert list(it)==[]\nassert any(name.split('.')[-1] in ['iter', 'next'] for name, node in __pypath_calls())",
      "expected": "10 20"
    }
  ],
  "s18-l02": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "import types\nx=numbers()\nassert isinstance(x,types.GeneratorType) and list(x)==[1,2]",
      "expected": "1\n2"
    }
  ],
  "s18-l03": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "import types\nassert isinstance(squares(2),types.GeneratorType)\nassert list(squares(0))==[] and list(squares(3))==[0,1,4]",
      "expected": "[0, 1, 4, 9]"
    }
  ],
  "s18-l04": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert __pypath_nodes('GeneratorExp')",
      "expected": "30"
    }
  ],
  "s18-l05": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert upper_result(lambda:'Bob')()=='BOB'",
      "expected": "HELLO"
    }
  ],
  "s18-l06": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert twice(lambda a,b:a-b)(7,b=2)==10",
      "expected": "10"
    }
  ],
  "s18-l07": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "def sample(): return 'ok'\nx=deco(sample)\nassert x.__name__=='sample' and x()=='ok'",
      "expected": "greet"
    }
  ],
  "s18-l08": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=make_counter(); y=make_counter()\nassert (x(),x(),y(),x())==(1,2,1,3)",
      "expected": "1\n2"
    }
  ],
  "s18-l09": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "import contextlib,io\nb=io.StringIO()\nwith contextlib.redirect_stdout(b):\n    try:\n        with managed(): raise ValueError('test')\n    except ValueError: pass\nassert b.getvalue().strip()=='enter\\nexit'",
      "expected": "enter\nwork\nexit"
    }
  ],
  "s18-l10": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert list(Range3())==[1,2,3] and list(Range3())==[1,2,3]",
      "expected": "[1, 2, 3]"
    }
  ],
  "s18-l11": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(isinstance(v,list) and v==[1,2,3] for v in list(globals().values()))",
      "expected": "6\n[1, 2, 3]"
    }
  ],
  "s18-l12": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "def sample(text): return text\nx=upper_result(strip_result(sample))\nassert x(' Bob ')=='BOB' and x.__name__=='sample'\nassert strip_result(lambda:'  X  ')()=='X'",
      "expected": "ADA\nget_name"
    }
  ],
  "s19-l01": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert discount(40,0.5)==20 and discount(0,0.2)==0",
      "expected": "80.0"
    }
  ],
  "s19-l02": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert validate_age(0)=='ok' and validate_age(-2)=='invalid'",
      "expected": "invalid"
    }
  ],
  "s19-l03": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert format_user('C','guest')=='C(guest)'",
      "expected": "Ada(admin)\nBob(editor)"
    }
  ],
  "s19-l04": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=MemoryRepo();x.add('b'); a=x.all();a.append('bad');assert x.all()==['b']",
      "expected": "['a']"
    }
  ],
  "s19-l05": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=Repo();s=TaskService(x);s.create(' bob ');assert x.items==['bob']\ntry:s.create('  ')\nexcept ValueError:pass\nelse:raise AssertionError('empty title')",
      "expected": "['code']"
    }
  ],
  "s19-l06": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=[];Notifier(x.append).notify('test');assert x==['test']",
      "expected": "['hi']"
    }
  ],
  "s19-l07": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=UserDTO('Bob',False);assert (x.name,x.active)==('Bob',False)",
      "expected": "Ada True"
    }
  ],
  "s19-l08": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "d={'full_name':'Bob'};assert adapt_user(d)=={'name':'Bob'} and d=={'full_name':'Bob'}",
      "expected": "Ada"
    }
  ],
  "s19-l09": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "a=['x'];b=add_task(a,'y');assert a==['x'] and b==['x','y'] and a is not b",
      "expected": "[]\n['a']"
    }
  ],
  "s19-l10": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert can_retry(2) is True and can_retry(3) is False\nMAX_RETRIES=1\nassert can_retry(1) is False",
      "expected": "True"
    }
  ],
  "s19-l11": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert normalize(' Bob ')=='Bob' and format_name('Bob')=='BOB'\ntry:normalize(' ')\nexcept ValueError:pass\nelse:raise AssertionError('empty name')",
      "expected": "ADA"
    }
  ],
  "s19-l12": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=MemoryTaskRepo();s=TaskService(x);s.create(' bob ');assert s.list_titles()==['bob']\na=x.all();a.append({'title':'bad'});assert s.list_titles()==['bob']\ntry:s.create(' ')\nexcept ValueError:pass\nelse:raise AssertionError('empty title')",
      "expected": "['code', 'test']"
    }
  ],
  "s20-l01": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=Task(7,'x');assert (x.id,x.title,x.done)==(7,'x',False)\nassert Task(8,'y',True).done is True",
      "expected": "1 code False"
    }
  ],
  "s20-l02": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=TaskRepo();x.add({'title':'a'});a=x.all();a.clear();assert x.all()==[{'title':'a'}]",
      "expected": "code"
    }
  ],
  "s20-l03": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=TaskService();a=x.create('x');b=x.create('y');assert a=={'id':1,'title':'x','done':False} and b['id']==2",
      "expected": "1 2"
    }
  ],
  "s20-l04": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert normalize_title('\\t Bob \\n')=='Bob'\nfor text in ['', ' ', '\\t']:\n    try:normalize_title(text)\n    except ValueError:pass\n    else:raise AssertionError('empty title')",
      "expected": "code\ninvalid"
    }
  ],
  "s20-l05": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=[{'id':8,'done':False},{'id':9,'done':False}]\nassert complete(x,8) is True and x[0]['done'] is True and x[1]['done'] is False\nassert complete(x,99) is False",
      "expected": "True"
    }
  ],
  "s20-l06": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['print'] for name, node in __pypath_calls())",
      "expected": "['a', 'c']"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "tasks": "[]"
      },
      "expected": "[]"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "tasks": "[{'title':'x','done':True},{'title':'y','done':False}]"
      },
      "expected": "['y']"
    }
  ],
  "s20-l07": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['sorted'] for name, node in __pypath_calls())",
      "expected": "[1, 2, 3]"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "tasks": "[]"
      },
      "expected": "[]"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "tasks": "[{'id':9},{'id':-1}]"
      },
      "expected": "[-1, 9]"
    }
  ],
  "s20-l08": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['dumps'] for name, node in __pypath_calls())",
      "expected": "{\"done\": false, \"id\": 1, \"title\": \"code\"}"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "task": "{'id':8,'title':'中文','done':True}"
      },
      "expected": "{\"done\": true, \"id\": 8, \"title\": \"\\u4e2d\\u6587\"}"
    }
  ],
  "s20-l09": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert parse(' list ')==('list','') and parse('')==('','')\nassert parse('  add multi word  ')==('add','multi word')",
      "expected": "add | write tests"
    }
  ],
  "s20-l10": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert any(name.split('.')[-1] in ['print'] for name, node in __pypath_calls())",
      "expected": "total=3 done=2 open=1"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "tasks": "[]"
      },
      "expected": "total=0 done=0 open=0"
    },
    {
      "label": "不同数据/边界",
      "overrides": {
        "tasks": "[{'done':False},{'done':False}]"
      },
      "expected": "total=2 done=0 open=2"
    }
  ],
  "s20-l11": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "assert len(__pypath_nodes('Assert'))>=3\nassert is_valid_title('') is False and is_valid_title(' Bob ') is True",
      "expected": "tests passed"
    }
  ],
  "s20-l12": [
    {
      "label": "行为与学习目标验证",
      "checkCode": "x=Repo();s=Service(x);assert s.stats()=='total=0 done=0 open=0'\na=s.create(' bob ');b=s.create('test');assert a.id==1 and a.title=='bob' and a.done is False and b.id==2\ns.complete(2);assert s.stats()=='total=2 done=1 open=1'\ns.complete(2);assert s.stats()=='total=2 done=1 open=1'\ny=x.all();y.clear();assert len(x.all())==2 and x.find(99) is None\ntry:s.complete(99)\nexcept KeyError:pass\nelse:raise AssertionError('missing id')\ntry:s.create(' ')\nexcept ValueError:pass\nelse:raise AssertionError('empty title')",
      "expected": "1 code True\n2 test False\ntotal=2 done=1 open=1"
    }
  ]
};
  for (const lesson of window.LESSONS) {
    lesson.hiddenTests = [...(lesson.hiddenTests || []), ...(checks[lesson.key] || [])];
    lesson.validationVersion = 2;
  }
})();
