(() => {
  const firstStage = (window.LESSONS || []).slice(0, 12);

  window.COURSE_STAGES = [
    { id: 1,  title: 'Python 起步', subtitle: '从第一行代码到函数与基础调试', icon: '🚀' },
    { id: 2,  title: '控制流与循环', subtitle: '让程序真正开始做判断和重复工作', icon: '🔀' },
    { id: 3,  title: '数据容器', subtitle: '列表、元组、集合与字典', icon: '📦' },
    { id: 4,  title: '函数进阶', subtitle: '把逻辑封装成可复用的代码', icon: '🧩' },
    { id: 5,  title: '调试、异常与文件', subtitle: '学会定位错误并读写真实数据', icon: '🛠️' },
    { id: 6,  title: 'Python 高效写法', subtitle: '推导式、zip、enumerate 与常用工具', icon: '⚡' },
    { id: 7,  title: '面向对象', subtitle: '读懂大型项目里的 class', icon: '🏗️' },
    { id: 8,  title: 'NumPy 科学计算', subtitle: '数组、矩阵、维度与向量化', icon: '🔢' },
    { id: 9,  title: 'Pandas 数据处理', subtitle: '表格数据筛选、统计与聚合', icon: '📊' },
    { id: 10, title: '科研数据处理', subtitle: '归一化、批处理、指标与数据划分', icon: '🧪' },
    { id: 11, title: '科研代码工程', subtitle: '配置、实验循环、结果汇总与复现', icon: '🔬' },
    { id: 12, title: '深度学习桥梁', subtitle: '用 Python 理解训练循环，为 PyTorch 做准备', icon: '🧠' }
  ];

  const stage1 = window.COURSE_STAGES[0];
  firstStage.forEach((lesson, index) => {
    lesson.id = index + 1;
    lesson.stageId = 1;
    lesson.stage = stage1.title;
    lesson.stageOrder = index + 1;
    lesson.boss = index === firstStage.length - 1;
    if (lesson.boss) {
      lesson.title = '阶段 BOSS · 找出隐藏的逻辑 Bug';
      lesson.intro = '第一阶段最终挑战：把前面学过的变量、循环和调试思路真正组合起来。';
    }
  });
  window.LESSONS = firstStage;

  window.addStageLessons = function(stageId, items) {
    const stage = window.COURSE_STAGES.find(s => s.id === stageId);
    if (!stage) throw new Error('Unknown PyPath stage: ' + stageId);
    items.forEach((item, index) => {
      const lesson = {
        id: window.LESSONS.length + 1,
        stageId,
        stage: stage.title,
        stageOrder: index + 1,
        boss: !!item.boss,
        intro: item.intro || stage.subtitle,
        concept: item.concept || '',
        stdin: '',
        codeMustInclude: [],
        simpleExplain: item.simpleExplain || item.conceptText || item.task || '',
        codeExplain: item.codeExplain || item.simpleExplain || item.task || '',
        hints: item.hints || ['先把任务拆成更小的一步。', '观察 starter 代码里哪些变量已经准备好了。', '只改最必要的代码，然后运行验证。'],
        ...item
      };
      window.LESSONS.push(lesson);
    });
  };
})();