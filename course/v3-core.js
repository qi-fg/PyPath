(() => {
  const stageDefs = [
    ['Python 基础与程序思维','变量、类型、表达式与最基本的程序执行','🚀'],
    ['字符串与输入','把用户输入变成程序真正能处理的数据','⌨️'],
    ['条件判断','让程序根据不同情况做不同决定','🔀'],
    ['循环与迭代','稳定处理重复任务、累加、计数和搜索','🔁'],
    ['列表、元组与集合','掌握工程代码中最常见的序列容器','📚'],
    ['字典与结构化数据','用键值和嵌套结构组织真实业务数据','🗂️'],
    ['函数与代码复用','把逻辑拆成清晰、可测试、可复用的单元','🧩'],
    ['异常、调试与边界','学会读报错、定位问题和设计防御性代码','🛠️'],
    ['文件、JSON 与 CSV','让程序读写真实文件并保存数据','💾'],
    ['模块、包与命令行','从单文件脚本走向真正的 Python 项目','📦'],
    ['面向对象基础','理解 class、对象、状态与方法','🏗️'],
    ['面向对象工程实践','继承、组合、数据模型与可维护设计','🧱'],
    ['标准库与文本工具','掌握工程中高频的标准库能力','🧰'],
    ['SQLite 与持久化','让程序拥有真正可查询的数据存储','🗄️'],
    ['HTTP 与 API 思维','理解请求、响应、状态码与 JSON 接口','🌐'],
    ['测试与代码质量','用自动测试保护代码修改','🧪'],
    ['配置、环境变量与日志','把“能跑”升级成“可配置、可观察”','⚙️'],
    ['迭代器、生成器与装饰器','读懂成熟 Python 项目中的高级结构','⚡'],
    ['工程架构与重构','分层、解耦、依赖与可维护代码','🏛️'],
    ['最终工程挑战','把前面的能力组合成一个完整任务管理应用','👑']
  ];

  window.COURSE_STAGES = stageDefs.map((x, i) => ({
    id: i + 1,
    title: x[0],
    subtitle: x[1],
    icon: x[2],
    total: 12
  }));
  window.LESSONS = [];

  function escHtml(text) {
    return String(text || '')
      .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  }

  window.addEngineeringStage = function(stageId, rows) {
    const stage = window.COURSE_STAGES.find(s => s.id === stageId);
    if (!stage) throw new Error('Unknown stage ' + stageId);
    if (!Array.isArray(rows) || rows.length !== 12) {
      throw new Error('Stage ' + stageId + ' must contain exactly 12 lessons');
    }

    rows.forEach((r, index) => {
      const id = window.LESSONS.length + 1;
      const boss = index === 11 || !!r.boss;
      const conceptText = r.concept || r.why || stage.subtitle;
      const solution = (r.solution || '').trim();
      const hint1 = r.hint1 || ('先定位这一题真正要使用的知识点：' + conceptText);
      const hint2 = r.hint2 || r.why || '把任务拆成输入、处理、输出三个小步骤。';
      const hint3 = r.hint3 || (solution ? ('参考实现：\n' + solution) : '回到任务目标，只改最必要的代码。');

      window.LESSONS.push({
        id,
        key: 's' + String(stageId).padStart(2,'0') + '-l' + String(index + 1).padStart(2,'0'),
        stageId,
        stage: stage.title,
        stageOrder: index + 1,
        boss,
        title: boss ? ('阶段 BOSS · ' + r.title) : r.title,
        intro: r.intro || (boss ? '把这一阶段的知识组合起来完成一个更接近真实程序的挑战。' : stage.subtitle),
        task: r.task,
        concept: '<strong>知识点：</strong> ' + escHtml(conceptText),
        starter: r.starter || '',
        stdin: r.stdin || '',
        expected: String(r.expected ?? ''),
        codeMustInclude: r.must || [],
        prediction: r.prediction || null,
        simpleExplain: r.why || conceptText,
        codeExplain: r.walk || r.why || conceptText,
        hints: [hint1, hint2, hint3],
        solution,
        detailConcept: conceptText,
        detailWhy: r.why || conceptText,
        walkthrough: r.walk || (solution
          ? ('参考实现按下面顺序执行：\n' + solution.split('\n').filter(Boolean).map((line, i) => (i + 1) + '. ' + line).join('\n') + '\n\n逐行对照你的通过代码，确认每一步的数据变化。')
          : ('参考实现围绕“' + conceptText + '”完成任务。通过后再逐行对照你的写法与参考实现。')),
        pitfalls: r.pitfalls || [
          '只记住最终答案，没有说清楚变量和表达式在每一步发生了什么。',
          '一次修改太多地方，出错时难以定位真正原因。'
        ],
        takeaway: r.takeaway || conceptText,
        bossReview: boss ? (r.bossReview || ('通过这一关说明你已经能够把“' + stage.title + '”中的多个知识点组合使用。')) : ''
      });
    });
  };
})();