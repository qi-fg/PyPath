addEngineeringStage(14, [
  {
    "title": "连接内存数据库",
    "task": "使用 sqlite3.connect(':memory:')，执行 SELECT 1 并输出 1。",
    "concept": "sqlite3 连接与游标执行",
    "starter": "import sqlite3\n# 连接内存数据库并查询 1\n",
    "solution": "import sqlite3\nconn = sqlite3.connect(':memory:')\ncur = conn.execute('SELECT 1')\nprint(cur.fetchone()[0])",
    "expected": "1",
    "must": [
      "sqlite3"
    ],
    "why": "SQLite 是嵌入式关系数据库，适合本地应用和小型服务持久化。"
  },
  {
    "title": "创建数据表",
    "task": "创建 users(id INTEGER, name TEXT)，然后查询 sqlite_master 并输出 users。",
    "concept": "CREATE TABLE",
    "starter": "import sqlite3\nconn = sqlite3.connect(':memory:')\n# 创建 users 表\n",
    "solution": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE users (id INTEGER, name TEXT)')\nrow = conn.execute(\"SELECT name FROM sqlite_master WHERE type='table' AND name='users'\").fetchone()\nprint(row[0])",
    "expected": "users",
    "must": [
      "CREATE TABLE"
    ],
    "why": "关系数据库先定义表结构，再向表中存放行记录。"
  },
  {
    "title": "插入一条记录",
    "task": "创建 users 表，参数化插入 Ada，再查询并输出 Ada。",
    "concept": "INSERT 与参数占位符 ?",
    "starter": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE users (name TEXT)')\n# 参数化插入并查询\n",
    "solution": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE users (name TEXT)')\n# 参数化插入并查询\n\nconn.execute('INSERT INTO users(name) VALUES (?)', ('Ada',))\nprint(conn.execute('SELECT name FROM users').fetchone()[0])",
    "expected": "Ada",
    "must": [
      "?"
    ],
    "why": "参数化查询把 SQL 结构和数据分离，是避免 SQL 注入和转义错误的基础。"
  },
  {
    "title": "fetchone 读取单行",
    "task": "插入 A、B，查询 name='B'，用 fetchone 输出 B。",
    "concept": "fetchone()",
    "starter": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE users (name TEXT)')\nconn.executemany('INSERT INTO users VALUES (?)', [('A',), ('B',)])\n# 查询 B\n",
    "solution": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE users (name TEXT)')\nconn.executemany('INSERT INTO users VALUES (?)', [('A',), ('B',)])\n# 查询 B\n\nrow = conn.execute('SELECT name FROM users WHERE name=?', ('B',)).fetchone()\nprint(row[0])",
    "expected": "B",
    "must": [
      "fetchone"
    ],
    "why": "当查询预期最多一行时，fetchone 能清楚表达读取单条结果。"
  },
  {
    "title": "fetchall 读取多行",
    "task": "插入 1、2、3，按 n 排序查询，输出 [1, 2, 3]。",
    "concept": "fetchall()",
    "starter": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE nums (n INTEGER)')\nconn.executemany('INSERT INTO nums VALUES (?)', [(3,), (1,), (2,)])\n# 查询并输出列表\n",
    "solution": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE nums (n INTEGER)')\nconn.executemany('INSERT INTO nums VALUES (?)', [(3,), (1,), (2,)])\n# 查询并输出列表\n\nrows = conn.execute('SELECT n FROM nums ORDER BY n').fetchall()\nprint([row[0] for row in rows])",
    "expected": "[1, 2, 3]",
    "must": [
      "fetchall"
    ],
    "why": "数据库返回的是行集合，应用层经常需要进一步转换成列表或对象。"
  },
  {
    "title": "UPDATE 更新记录",
    "task": "用户 Ada score=80，更新为95并输出95。",
    "concept": "UPDATE ... WHERE",
    "starter": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE users (name TEXT, score INTEGER)')\nconn.execute(\"INSERT INTO users VALUES ('Ada', 80)\")\n# 更新 score\n",
    "solution": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE users (name TEXT, score INTEGER)')\nconn.execute(\"INSERT INTO users VALUES ('Ada', 80)\")\n# 更新 score\n\nconn.execute('UPDATE users SET score=? WHERE name=?', (95, 'Ada'))\nprint(conn.execute(\"SELECT score FROM users WHERE name='Ada'\").fetchone()[0])",
    "expected": "95",
    "must": [
      "UPDATE"
    ],
    "why": "UPDATE 必须配合明确 WHERE 条件，否则可能修改整张表。"
  },
  {
    "title": "DELETE 删除记录",
    "task": "表中 A、B，删除 A 后输出剩余数量1。",
    "concept": "DELETE ... WHERE",
    "starter": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE users (name TEXT)')\nconn.executemany('INSERT INTO users VALUES (?)', [('A',), ('B',)])\n# 删除 A\n",
    "solution": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE users (name TEXT)')\nconn.executemany('INSERT INTO users VALUES (?)', [('A',), ('B',)])\n# 删除 A\n\nconn.execute('DELETE FROM users WHERE name=?', ('A',))\nprint(conn.execute('SELECT COUNT(*) FROM users').fetchone()[0])",
    "expected": "1",
    "must": [
      "DELETE"
    ],
    "why": "删除操作同样需要精确条件和验证，避免误删。"
  },
  {
    "title": "COUNT 聚合查询",
    "task": "插入 active 值 1,0,1，查询 active=1 数量并输出2。",
    "concept": "SQL COUNT 聚合",
    "starter": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE users (active INTEGER)')\nconn.executemany('INSERT INTO users VALUES (?)', [(1,), (0,), (1,)])\n# 统计 active\n",
    "solution": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE users (active INTEGER)')\nconn.executemany('INSERT INTO users VALUES (?)', [(1,), (0,), (1,)])\n# 统计 active\n\ncount = conn.execute('SELECT COUNT(*) FROM users WHERE active=?', (1,)).fetchone()[0]\nprint(count)",
    "expected": "2",
    "must": [
      "COUNT"
    ],
    "why": "能让数据库完成过滤和聚合时，通常比把所有行取回 Python 再统计更高效。"
  },
  {
    "title": "ORDER BY 与 LIMIT",
    "task": "插入分数70,95,88，查询最高分并输出95。",
    "concept": "ORDER BY ... DESC LIMIT 1",
    "starter": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE scores (score INTEGER)')\nconn.executemany('INSERT INTO scores VALUES (?)', [(70,), (95,), (88,)])\n# 查询最高分\n",
    "solution": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE scores (score INTEGER)')\nconn.executemany('INSERT INTO scores VALUES (?)', [(70,), (95,), (88,)])\n# 查询最高分\n\nrow = conn.execute('SELECT score FROM scores ORDER BY score DESC LIMIT 1').fetchone()\nprint(row[0])",
    "expected": "95",
    "must": [
      "ORDER BY",
      "LIMIT"
    ],
    "why": "排序和限制结果集是数据库查询的核心能力。"
  },
  {
    "title": "使用 Row 按列名读取",
    "task": "设置 conn.row_factory=sqlite3.Row，查询 name='Ada'，用 row['name'] 输出 Ada。",
    "concept": "sqlite3.Row",
    "starter": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.row_factory = sqlite3.Row\nconn.execute('CREATE TABLE users (name TEXT)')\nconn.execute(\"INSERT INTO users VALUES ('Ada')\")\n# 查询并按列名读取\n",
    "solution": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.row_factory = sqlite3.Row\nconn.execute('CREATE TABLE users (name TEXT)')\nconn.execute(\"INSERT INTO users VALUES ('Ada')\")\n# 查询并按列名读取\n\nrow = conn.execute('SELECT name FROM users').fetchone()\nprint(row['name'])",
    "expected": "Ada",
    "must": [
      "row_factory"
    ],
    "why": "按列名读取比依赖位置下标更可读，也更抗列顺序变化。"
  },
  {
    "title": "事务失败回滚思维",
    "task": "创建 balance=100。先更新成50，再调用 rollback()，最终输出100。",
    "concept": "transaction 与 rollback",
    "starter": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE account (balance INTEGER)')\nconn.execute('INSERT INTO account VALUES (100)')\nconn.commit()\n# 修改后回滚\n",
    "solution": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE account (balance INTEGER)')\nconn.execute('INSERT INTO account VALUES (100)')\nconn.commit()\n# 修改后回滚\n\nconn.execute('UPDATE account SET balance=50')\nconn.rollback()\nprint(conn.execute('SELECT balance FROM account').fetchone()[0])",
    "expected": "100",
    "must": [
      "rollback"
    ],
    "why": "事务让一组数据库操作能够整体成功或整体撤销，是数据一致性的基础。"
  },
  {
    "title": "任务数据库",
    "boss": true,
    "task": "创建 tasks(id,title,done)；插入三个任务，其中两个 done=0。把 id=1 更新 done=1；删除 id=3；最后输出 total=2、open=0。",
    "concept": "建表、参数化插入、更新、删除、聚合与事务综合",
    "starter": "import sqlite3\nconn = sqlite3.connect(':memory:')\n# 建表并完成任务数据操作\n",
    "solution": "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE tasks (id INTEGER, title TEXT, done INTEGER)')\nconn.executemany('INSERT INTO tasks VALUES (?, ?, ?)', [(1, 'code', 0), (2, 'test', 1), (3, 'docs', 0)])\nconn.execute('UPDATE tasks SET done=1 WHERE id=?', (1,))\nconn.execute('DELETE FROM tasks WHERE id=?', (3,))\nconn.commit()\ntotal = conn.execute('SELECT COUNT(*) FROM tasks').fetchone()[0]\nopen_count = conn.execute('SELECT COUNT(*) FROM tasks WHERE done=0').fetchone()[0]\nprint(f'total={total}')\nprint(f'open={open_count}')",
    "expected": "total=2\nopen=0",
    "must": [
      "CREATE TABLE",
      "INSERT",
      "UPDATE",
      "DELETE"
    ],
    "why": "一个真正的数据层需要覆盖表结构、CRUD、参数化查询和提交事务。",
    "bossReview": "你已经能用 SQLite 完成基本 CRUD、聚合、排序和事务操作，具备本地应用数据层基础。"
  }
]);
