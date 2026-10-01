addEngineeringStage(10, [
  {
    "title": "导入标准库模块",
    "task": "import math，输出 math.sqrt(81) 的整数形式 9。",
    "concept": "import module",
    "starter": "# 导入 math\n",
    "solution": "import math\nprint(int(math.sqrt(81)))",
    "expected": "9",
    "must": [
      "import"
    ],
    "why": "模块把相关功能组织在独立命名空间中，导入后通过模块名访问。"
  },
  {
    "title": "只导入需要的名字",
    "task": "从 math 导入 ceil，输出 ceil(3.2)=4。",
    "concept": "from module import name",
    "starter": "# 只导入 ceil\n",
    "solution": "from math import ceil\nprint(ceil(3.2))",
    "expected": "4",
    "must": [
      "from"
    ],
    "why": "from import 可以直接绑定特定对象，但也要避免过多名字污染当前命名空间。"
  },
  {
    "title": "给模块起别名",
    "task": "import json as js，用 js.dumps([1,2]) 输出 [1, 2]。",
    "concept": "import ... as ...",
    "starter": "# 给 json 起别名 js\n",
    "solution": "import json as js\nprint(js.dumps([1, 2]))",
    "expected": "[1, 2]",
    "must": [
      " as "
    ],
    "why": "别名可以缩短常用模块名或解决命名冲突。"
  },
  {
    "title": "使用 statistics",
    "task": "使用 statistics.mean 计算 [10,20,30] 平均值并输出 20。",
    "concept": "标准库模块复用成熟实现",
    "starter": "import statistics\n# 计算平均值\n",
    "solution": "import statistics\nprint(int(statistics.mean([10, 20, 30])))",
    "expected": "20",
    "why": "工程代码优先复用标准库经过测试的实现，而不是重复造轮子。"
  },
  {
    "title": "理解 __name__",
    "task": "输出当前脚本的 __name__。",
    "concept": "模块执行上下文与 __name__",
    "starter": "# 输出 __name__\n",
    "solution": "print(__name__)",
    "expected": "__main__",
    "must": [
      "__name__"
    ],
    "why": "直接执行的脚本通常以 __main__ 作为模块名，这是主入口保护的基础。"
  },
  {
    "title": "主入口保护",
    "task": "定义 main() 输出 start，并使用 if __name__ == '__main__' 调用。",
    "concept": "if __name__ == '__main__'",
    "starter": "def main():\n    print('start')\n\n# 加主入口保护\n",
    "solution": "def main():\n    print('start')\n\nif __name__ == '__main__':\n    main()",
    "expected": "start",
    "must": [
      "__name__",
      "main"
    ],
    "why": "主入口保护让文件既能被直接运行，也能被其他模块安全导入。"
  },
  {
    "title": "读取命令行参数数组",
    "task": "手动设置 sys.argv=['app.py','deploy','prod']，输出 deploy prod。",
    "concept": "sys.argv",
    "starter": "import sys\nsys.argv = ['app.py', 'deploy', 'prod']\n# 读取两个参数\n",
    "solution": "import sys\nsys.argv = ['app.py', 'deploy', 'prod']\nprint(sys.argv[1], sys.argv[2])",
    "expected": "deploy prod",
    "must": [
      "argv"
    ],
    "why": "命令行参数让同一个程序在不同启动参数下执行不同操作。"
  },
  {
    "title": "第一次 argparse",
    "task": "设置 sys.argv=['app.py','--port','9000']，用 argparse 解析 int port 并输出 9000。",
    "concept": "argparse 参数解析器",
    "starter": "import sys\nimport argparse\nsys.argv = ['app.py', '--port', '9000']\n# 创建 parser 并解析\n",
    "solution": "import sys\nimport argparse\nsys.argv = ['app.py', '--port', '9000']\nparser = argparse.ArgumentParser()\nparser.add_argument('--port', type=int)\nargs = parser.parse_args()\nprint(args.port)",
    "expected": "9000",
    "must": [
      "argparse",
      "add_argument"
    ],
    "why": "argparse 负责类型转换、参数定义和错误提示，比手工读 argv 更可靠。"
  },
  {
    "title": "带默认值的命令行选项",
    "task": "sys.argv 只有 app.py，定义 --mode 默认 dev，输出 dev。",
    "concept": "argparse default",
    "starter": "import sys\nimport argparse\nsys.argv = ['app.py']\n# --mode 默认 dev\n",
    "solution": "import sys\nimport argparse\nsys.argv = ['app.py']\nparser = argparse.ArgumentParser()\nparser.add_argument('--mode', default='dev')\nargs = parser.parse_args()\nprint(args.mode)",
    "expected": "dev",
    "must": [
      "default"
    ],
    "why": "默认值让常用配置不必每次显式传入。"
  },
  {
    "title": "理解包结构字符串",
    "task": "给 paths=['app/main.py','app/services/user.py','tests/test_user.py']，统计 app/ 下文件数量并输出 2。",
    "concept": "项目目录与包边界",
    "starter": "paths = ['app/main.py', 'app/services/user.py', 'tests/test_user.py']\n# 统计 app/ 文件\n",
    "solution": "count = sum(1 for path in paths if path.startswith('app/'))\nprint(count)",
    "expected": "2",
    "why": "工程项目通过目录把应用代码、服务层和测试代码分离。"
  },
  {
    "title": "修复模块命名冲突",
    "task": "变量名 math 覆盖了 math 模块。修改变量名，让 math.sqrt(16) 输出 4。",
    "concept": "命名遮蔽 shadowing",
    "starter": "import math\nmath = 10\nprint(int(math.sqrt(16)))\n",
    "solution": "import math\nvalue = 10\nprint(int(math.sqrt(16)))",
    "expected": "4",
    "why": "变量名与模块名重复会遮蔽原模块对象，是常见工程命名 Bug。"
  },
  {
    "title": "命令行部署器",
    "boss": true,
    "task": "使用 argparse 解析 --env prod、--replicas 3。replicas 类型为 int。输出 deploy env=prod replicas=3。",
    "concept": "模块导入、main 入口与 argparse 综合",
    "starter": "import sys\nimport argparse\nsys.argv = ['deploy.py', '--env', 'prod', '--replicas', '3']\n\ndef main():\n    # 定义参数并输出\n    pass\n\nif __name__ == '__main__':\n    main()\n",
    "solution": "import sys\nimport argparse\nsys.argv = ['deploy.py', '--env', 'prod', '--replicas', '3']\n\ndef main():\n    parser = argparse.ArgumentParser()\n    parser.add_argument('--env', required=True)\n    parser.add_argument('--replicas', type=int, default=1)\n    args = parser.parse_args()\n    print(f'deploy env={args.env} replicas={args.replicas}')\n\nif __name__ == '__main__':\n    main()",
    "expected": "deploy env=prod replicas=3",
    "must": [
      "argparse",
      "__name__"
    ],
    "why": "一个可用的 CLI 应用通常有清楚的入口函数、参数定义、类型转换和主入口保护。",
    "bossReview": "你已经从单文件语法走到模块、入口与命令行工具，开始具备真实 Python 项目的组织意识。"
  }
]);
