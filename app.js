const lessons = window.LESSONS || [];
const $ = (id) => document.getElementById(id);
const STORAGE_KEY = 'pypath-state';
const APP_DATA_FORMAT = 4;

function freshState() {
  return {
    current: 0,
    solved: [],
    attemptsByLesson: {},
    hintLevelByLesson: {},
    predictions: {},
    stats: { syntaxErrors: 0, runtimeErrors: 0, wrongAnswers: 0, hintUses: 0 },
    lastStudyDate: null,
    streak: 1,
    curriculumVersion: 3,
    openStageId: 1,
    legacyMigrated: false,
    masteryByLesson: {},
    reviewQueue: [],
    stageResults: {},
    hiddenFailures: {},
    reviewModeLessonId: 0,
    reviewReturnIndex: null,
    clientUpdatedAt: 0
  };
}

function loadState() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (_) {}
  const base = freshState();
  if (!saved || typeof saved !== 'object') return base;

  const next = {
    ...base,
    ...saved,
    solved: Array.isArray(saved.solved) ? saved.solved.filter(Number.isInteger) : [],
    attemptsByLesson: saved.attemptsByLesson || {},
    hintLevelByLesson: saved.hintLevelByLesson || {},
    predictions: saved.predictions || {},
    masteryByLesson: saved.masteryByLesson || {},
    reviewQueue: Array.isArray(saved.reviewQueue) ? saved.reviewQueue : [],
    stageResults: saved.stageResults || {},
    hiddenFailures: saved.hiddenFailures || {},
    stats: { ...base.stats, ...(saved.stats || {}) }
  };

  if (Number(saved.curriculumVersion || 0) < 3) {
    const legacySolved = new Set(next.solved);
    const stage1Complete = Array.from({ length: 12 }, (_, i) => i).every(i => legacySolved.has(i));
    next.solved = Array.from({ length: 12 }, (_, i) => i).filter(i => legacySolved.has(i));
    next.current = stage1Complete ? 12 : Math.min(Number(next.current) || 0, 11);
    next.openStageId = stage1Complete ? 2 : 1;
    next.curriculumVersion = 3;
    next.legacyMigrated = stage1Complete;

    for (let id = 1; id <= 30; id++) {
      localStorage.removeItem(`pypath-code-${id}`);
      localStorage.removeItem(`pypath-stdin-${id}`);
    }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (_) {}
  }

  next.current = Math.max(0, Math.min(Number(next.current) || 0, Math.max(0, lessons.length - 1)));
  return next;
}

const state = loadState();
let pyodide = null;
let running = false;
let monacoEditor = null;
let suppressEditorSave = false;
let appVersion = '3.0.0';
let displayVersion = '3.0.0';
let localServiceReady = false;
let aiState = { enabled: false, configured: false, provider: '', model: '' };
let lastRunOutput = '';
let lastRunError = '';
let tutorBusy = false;
let learningDataSynced = false;
let learningSaveTimer = null;
const learningCache = { codeByLesson: {}, stdinByLesson: {} };

function collectLocalLearningCache() {
  const codeByLesson = {};
  const stdinByLesson = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (key.startsWith('pypath-code-')) codeByLesson[key.slice('pypath-code-'.length)] = localStorage.getItem(key) || '';
    if (key.startsWith('pypath-stdin-')) stdinByLesson[key.slice('pypath-stdin-'.length)] = localStorage.getItem(key) || '';
  }
  return { codeByLesson, stdinByLesson };
}

function learningPayload() {
  return {
    schema: 1,
    clientUpdatedAt: Number(state.clientUpdatedAt || Date.now()),
    state: JSON.parse(JSON.stringify(state)),
    codeByLesson: { ...learningCache.codeByLesson },
    stdinByLesson: { ...learningCache.stdinByLesson }
  };
}

function scheduleLearningSave() {
  if (!localServiceReady || !learningDataSynced) return;
  clearTimeout(learningSaveTimer);
  learningSaveTimer = setTimeout(async () => {
    try {
      await fetch('/api/learning-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: learningPayload() })
      });
      const status = $('learningStorageStatus');
      if (status) status.textContent = '已保存到 PyPath 本地数据文件，并保留浏览器副本。';
    } catch (_) {
      const status = $('learningStorageStatus');
      if (status) status.textContent = '本地数据文件暂时无法写入，浏览器副本仍然保留。';
    }
  }, 700);
}

function saveState(options = {}) {
  const touch = options.touch !== false;
  if (touch) state.clientUpdatedAt = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (options.sync !== false) scheduleLearningSave();
}

function normalized(text) {
  return String(text).replace(/\r\n/g, '\n').trim();
}

function getCode() {
  return monacoEditor ? monacoEditor.getValue() : $('codeEditor').value;
}

function setCode(value) {
  suppressEditorSave = true;
  if (monacoEditor) monacoEditor.setValue(value);
  $('codeEditor').value = value;
  suppressEditorSave = false;
}

function currentLesson() {
  return lessons[state.current];
}

function saveCurrentCode() {
  const lesson = currentLesson();
  if (!lesson || suppressEditorSave) return;
  const value = getCode();
  localStorage.setItem(`pypath-code-${lesson.id}`, value);
  learningCache.codeByLesson[String(lesson.id)] = value;
  saveState();
}

function updateStreak() {
  const today = new Date().toISOString().slice(0, 10);
  if (!state.lastStudyDate) {
    state.lastStudyDate = today;
    state.streak = 1;
  } else if (state.lastStudyDate !== today) {
    const prev = new Date(state.lastStudyDate + 'T00:00:00');
    const now = new Date(today + 'T00:00:00');
    const diff = Math.round((now - prev) / 86400000);
    state.streak = diff === 1 ? (state.streak || 1) + 1 : 1;
    state.lastStudyDate = today;
  }
  saveState();
}

function stageEntries(stageId) {
  return lessons.map((lesson, idx) => ({ lesson, idx })).filter(x => x.lesson.stageId === stageId);
}

function stageBossIndex(stageId) {
  const entries = stageEntries(stageId);
  const boss = entries.find(x => x.lesson.boss) || entries[entries.length - 1];
  return boss ? boss.idx : -1;
}

function isStageComplete(stageId) {
  const bossIdx = stageBossIndex(stageId);
  return bossIdx >= 0 && state.solved.includes(bossIdx);
}

function isStageUnlocked(stageId) {
  return stageId === 1 || isStageComplete(stageId - 1);
}

function renderLessonList() {
  const list = $('lessonList');
  const stages = window.COURSE_STAGES || [];
  list.innerHTML = '';
  list.classList.add('stage-route-list');

  stages.forEach(stage => {
    const entries = stageEntries(stage.id);
    if (!entries.length) return;

    const unlocked = isStageUnlocked(stage.id);
    const complete = isStageComplete(stage.id);
    const solvedCount = entries.filter(x => state.solved.includes(x.idx)).length;
    const currentInStage = currentLesson() && currentLesson().stageId === stage.id;
    const expanded = unlocked && (state.openStageId === stage.id || (!state.openStageId && currentInStage));

    const group = document.createElement('section');
    group.className = 'stage-route-group' + (complete ? ' complete' : '') + (!unlocked ? ' locked' : '') + (currentInStage ? ' current' : '');

    const head = document.createElement('button');
    head.type = 'button';
    head.className = 'stage-route-head';
    head.disabled = !unlocked;
    const statusIcon = complete ? '✓' : (!unlocked ? '🔒' : (currentInStage ? '▶' : stage.icon));
    head.innerHTML = `
      <span class="stage-route-icon">${statusIcon}</span>
      <span class="stage-route-copy">
        <strong>阶段 ${stage.id} · ${stage.title}</strong>
        <small>${stage.subtitle}</small>
      </span>
      <span class="stage-route-meta">
        <b>${solvedCount}/${entries.length}</b>
        <span>${complete ? 'BOSS 已通关' : (!unlocked ? '未解锁' : (expanded ? '收起' : '展开'))}</span>
      </span>
    `;
    head.addEventListener('click', () => {
      if (!unlocked) return;
      state.openStageId = state.openStageId === stage.id ? 0 : stage.id;
      saveState();
      renderLessonList();
    });
    group.appendChild(head);

    if (expanded) {
      const lessonsBox = document.createElement('div');
      lessonsBox.className = 'stage-lessons';
      entries.forEach((entry, order) => {
        const { lesson, idx } = entry;
        const solved = state.solved.includes(idx);
        const previousSolved = order === 0 ? true : state.solved.includes(entries[order - 1].idx);
        const lessonUnlocked = solved || previousSolved;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'lesson-item' + (idx === state.current ? ' active' : '') + (solved ? ' solved' : '') + (!lessonUnlocked ? ' locked' : '') + (lesson.boss ? ' boss-item' : '');
        btn.disabled = !lessonUnlocked;
        const marker = lesson.boss ? '👑' : (solved ? '✓' : (lessonUnlocked ? String(order + 1) : '🔒'));
        btn.innerHTML = `<span class="lesson-marker">${marker}</span><span class="lesson-label">${lesson.title}</span>`;
        btn.addEventListener('click', () => {
          if (!lessonUnlocked || idx === state.current) return;
          state.current = idx;
          state.openStageId = stage.id;
          saveState();
          renderAll();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        lessonsBox.appendChild(btn);
      });
      group.appendChild(lessonsBox);
    }

    list.appendChild(group);
  });
}

function renderPrediction(lesson) {
  const card = $('predictionCard');
  const box = $('predictionOptions');
  box.innerHTML = '';
  $('predictionFeedback').textContent = '';
  if (!lesson.prediction) {
    card.classList.add('hidden');
    return;
  }
  card.classList.remove('hidden');
  $('predictionQuestion').textContent = lesson.prediction.question;
  const selected = state.predictions[lesson.id];
  lesson.prediction.options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'prediction-option' + (selected === option ? ' selected' : '');
    btn.textContent = option;
    btn.addEventListener('click', () => {
      state.predictions[lesson.id] = option;
      saveState();
      renderPrediction(lesson);
      const correct = option === lesson.prediction.answer;
      $('predictionFeedback').textContent = correct ? lesson.prediction.success : lesson.prediction.fail;
      tutorSay(correct ? '这个预测是对的。现在再去运行代码验证，你会记得更牢。' : '预测错没关系。先保留这个判断，再通过运行结果纠正它。', correct ? 'good' : 'tutor');
    });
  });
  if (selected) {
    $('predictionFeedback').textContent = selected === lesson.prediction.answer ? lesson.prediction.success : lesson.prediction.fail;
  }
}

function renderCurrentLesson() {
  const lesson = currentLesson();
  if (!lesson) return;
  const stage = (window.COURSE_STAGES || []).find(s => s.id === lesson.stageId);

  $('lessonPanel')?.classList?.toggle('boss-lesson', !!lesson.boss);
  document.querySelector('.lesson-panel')?.classList.toggle('boss-lesson', !!lesson.boss);
  $('lessonStage').textContent = lesson.boss
    ? `👑 阶段 ${lesson.stageId} BOSS`
    : `${stage?.icon || '📘'} 阶段 ${lesson.stageId} · ${lesson.stage}`;
  $('lessonProgressText').textContent = `本阶段 ${lesson.stageOrder}/12 · 总第 ${lesson.id}/${lessons.length} 关`;
  $('lessonTitle').textContent = lesson.title;
  $('lessonIntro').textContent = lesson.intro;
  $('lessonTask').textContent = lesson.task;
  $('conceptBox').innerHTML = lesson.concept;

  const codeKey = String(lesson.id);
  const code = Object.prototype.hasOwnProperty.call(learningCache.codeByLesson, codeKey)
    ? learningCache.codeByLesson[codeKey]
    : (localStorage.getItem(`pypath-code-${lesson.id}`) ?? lesson.starter);
  const stdin = Object.prototype.hasOwnProperty.call(learningCache.stdinByLesson, codeKey)
    ? learningCache.stdinByLesson[codeKey]
    : (localStorage.getItem(`pypath-stdin-${lesson.id}`) ?? lesson.stdin);
  setCode(code);
  $('stdinInput').value = stdin;

  const needsInput = lesson.stdin !== '' || /\binput\s*\(/.test(lesson.starter);
  $('stdinWrap').classList.toggle('hidden', !needsInput);

  $('consoleOutput').textContent = pyodide ? '准备好了。点击“运行代码”。' : 'Python 正在初始化，请稍候…';
  const reviewing = Number(state.reviewModeLessonId || 0) === lesson.id;
  const solved = state.solved.includes(state.current) && !reviewing;
  $('feedbackBox').className = solved ? 'feedback good' : (reviewing ? 'feedback neutral' : 'feedback neutral');
  $('feedbackBox').textContent = reviewing
    ? '🔁 复习模式：重新独立完成这一题。旧详解暂时隐藏。'
    : (solved
      ? (lesson.boss ? '👑 BOSS CLEAR！这个阶段已经通关，下一阶段已解锁。' : '✅ 这一关已经通过。下面可以查看完整详解。')
      : (lesson.boss ? '👑 BOSS 关：尽量先自己组合本阶段知识，再使用提示。' : '写完代码后点击“运行代码”。'));

  $('nextBtn').classList.toggle('hidden', reviewing || !solved || state.current >= lessons.length - 1);
  $('nextBtn').textContent = lesson.boss ? '进入下一阶段 →' : '下一关 →';
  if (solved) renderSolutionExplanation(lesson, code);
  else hideSolutionExplanation();
  $('attemptsText').textContent = `尝试 ${state.attemptsByLesson[lesson.id] || 0} 次`;

  const hintLevel = state.hintLevelByLesson[lesson.id] || 0;
  if (hintLevel > 0) {
    $('hintBox').classList.remove('hidden');
    $('hintBox').textContent = `提示 ${hintLevel}/3\n${lesson.hints[hintLevel - 1]}`;
  } else {
    $('hintBox').classList.add('hidden');
  }

  renderPrediction(lesson);
  clearTutor(false);
  tutorSay(
    lesson.boss
      ? `这是“${lesson.stage}”的阶段 BOSS：${lesson.task}\n\n先自己设计步骤。卡住后再逐级使用提示。`
      : `这一关我们只专注一个目标：${lesson.task}\n\n先自己改代码。卡住了再点“我看不懂”或“给一点提示”。`
  );

  if (state.legacyMigrated) {
    tutorSay('已根据你旧版 12/12 的完成记录，自动认定第 1 阶段通关，并从第 2 阶段继续。旧题代码没有硬套到新课程，避免任务和代码错位。', 'system');
    state.legacyMigrated = false;
    saveState();
  }
}

function plainConcept(lesson) {
  const temp = document.createElement('div');
  temp.innerHTML = lesson.concept || '';
  return (temp.textContent || temp.innerText || '').trim();
}

function buildPitfalls(lesson) {
  if (Array.isArray(lesson.pitfalls) && lesson.pitfalls.length) return lesson.pitfalls;
  const items = [];
  const title = (lesson.title || '') + ' ' + plainConcept(lesson);
  if (/if|elif|else|判断|条件/.test(title)) items.push('忘记在条件语句末尾写冒号，或者缩进不一致。');
  if (/for|while|range|循环/.test(title)) items.push('循环边界写错，或者循环变量没有正确更新。');
  if (/input|类型|int|float/.test(title)) items.push('忘记 input() 默认返回字符串，直接拿它和数字做运算。');
  if (/列表|list|range/.test(title)) items.push('把“最后一个值”和“停止位置”混淆，出现差一位错误。');
  if (/函数|return|def/.test(title)) items.push('函数里算出了结果，但忘记 return，导致调用结果是 None。');
  if (/Bug|调试/.test(title)) items.push('一次改太多行，反而很难确认到底是哪一处修好了问题。');
  if (lesson.hints && lesson.hints[0]) items.push('只记答案而不理解：' + lesson.hints[0]);
  while (items.length < 2) items.push('代码能运行不等于真正理解；通过后要能说出每一行改变了什么。');
  return items.slice(0, 3);
}

function renderSolutionExplanation(lesson, code = getCode()) {
  if (!lesson) return;
  const panel = $('solutionPanel');
  if (!panel) return;

  $('solutionKicker').textContent = lesson.boss ? '阶段 BOSS 详解' : '本题详解';
  $('solutionTitle').textContent = lesson.boss ? '把这一阶段的知识串起来' : '为什么这道题这样写？';
  $('solutionUserCode').textContent = String(code || '').trim() || '(没有代码)';
  if ($('solutionReferenceCode')) {
    $('solutionReferenceCode').textContent = String(lesson.solution || lesson.hints?.[2] || '').replace(/^参考实现：\s*/, '').trim() || '(这题没有唯一参考实现)';
  }
  $('solutionConcept').textContent = lesson.detailConcept || plainConcept(lesson) || lesson.task;
  $('solutionWhy').textContent = lesson.detailWhy || lesson.simpleExplain || lesson.codeExplain || '先理解代码里每个变量和操作分别负责什么。';
  $('solutionWalkthrough').textContent = lesson.walkthrough || lesson.codeExplain || lesson.simpleExplain || '从第一行开始，按 Python 实际执行顺序逐行理解。';

  const list = $('solutionPitfalls');
  list.innerHTML = '';
  buildPitfalls(lesson).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });

  $('solutionTakeaway').textContent = lesson.takeaway || lesson.simpleExplain || plainConcept(lesson) || '能独立重新写出这题，比记住答案更重要。';

  const boss = $('bossReview');
  if (lesson.boss) {
    boss.classList.remove('hidden');
    $('bossReviewText').textContent = lesson.bossReview || 'BOSS 关的重点不是某一条语法，而是你能否自己判断该用哪些工具、把多个步骤组合起来并通过运行结果完成调试。';
  } else {
    boss.classList.add('hidden');
  }

  panel.classList.remove('hidden');
}

function hideSolutionExplanation() {
  if ($('solutionPanel')) $('solutionPanel').classList.add('hidden');
}

function closeStageSummary() {
  const modal = $('stageSummaryModal');
  if (modal) modal.classList.add('hidden');
}

function stageMastery(stageId) {
  const entries = stageEntries(stageId);
  if (!entries.length) return 0;
  const scores = entries.map(({ lesson, idx }) => {
    if (state.masteryByLesson[lesson.id] != null) return Number(state.masteryByLesson[lesson.id]);
    return state.solved.includes(idx) ? 85 : 0;
  });
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function showStageSummary(stageId) {
  const stage = (window.COURSE_STAGES || []).find(item => item.id === stageId);
  const entries = stageEntries(stageId);
  if (!stage || !entries.length || !$('stageSummaryModal')) return;

  const mastery = stageMastery(stageId);
  const firstTry = entries.filter(({ lesson, idx }) => state.solved.includes(idx) && Number(state.attemptsByLesson[lesson.id] || 0) === 1).length;
  const hints = entries.reduce((sum, { lesson }) => sum + Number(state.hintLevelByLesson[lesson.id] || 0), 0);
  const weak = entries
    .map(({ lesson, idx }) => ({ lesson, idx, score: Number(state.masteryByLesson[lesson.id] ?? (state.solved.includes(idx) ? 85 : 0)) }))
    .filter(item => item.score < 80)
    .sort((a, b) => a.score - b.score);

  $('stageSummaryTitle').textContent = `阶段 ${stageId} · ${stage.title} 通关`;
  $('stageSummarySubtitle').textContent = stage.subtitle;
  $('stageSummaryMastery').textContent = `${mastery}%`;
  $('stageSummaryFirstTry').textContent = String(firstTry);
  $('stageSummaryHints').textContent = String(hints);
  $('stageSummaryReview').textContent = String(weak.length);

  const skills = $('stageSummarySkills');
  skills.innerHTML = '';
  entries.slice(0, -1).forEach(({ lesson }) => {
    const span = document.createElement('span');
    span.textContent = lesson.title;
    skills.appendChild(span);
  });

  const weakBox = $('stageSummaryWeak');
  weakBox.innerHTML = '';
  if (!weak.length) {
    const p = document.createElement('p');
    p.textContent = '这一阶段暂时没有明显薄弱项。系统仍会在几天后安排一次间隔复习。';
    weakBox.appendChild(p);
  } else {
    weak.slice(0, 4).forEach(item => {
      const row = document.createElement('div');
      row.innerHTML = `<strong>${item.lesson.title}</strong><span>掌握度 ${item.score}%</span>`;
      weakBox.appendChild(row);
      upsertReview(item.lesson, 'stage-review', 24);
    });
  }

  state.stageResults[stageId] = {
    mastery,
    firstTry,
    hints,
    weakCount: weak.length,
    completedAt: Date.now()
  };
  saveState();

  const nextBtn = $('stageSummaryNextBtn');
  if (stageId >= (window.COURSE_STAGES || []).length) {
    nextBtn.textContent = '完成主线';
  } else {
    nextBtn.textContent = `进入阶段 ${stageId + 1} →`;
  }
  nextBtn.dataset.stageId = String(stageId);
  $('stageSummaryModal').classList.remove('hidden');
}

function startNextReview() {
  const due = dueReviewItems();
  if (!due.length) {
    alert('今天没有到期复习。继续主线即可，系统会按你的错误和提示使用情况安排后续复习。');
    return;
  }
  const item = due[0];
  const idx = lessons.findIndex(lesson => lesson.id === item.lessonId);
  if (idx < 0) return;
  state.reviewReturnIndex = state.current;
  state.reviewModeLessonId = item.lessonId;
  state.current = idx;
  state.openStageId = lessons[idx].stageId;
  saveState();
  renderAll();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  tutorSay('现在是复习模式：先不要看旧答案，重新独立完成。通过后会提高这一知识点的掌握度。', 'system');
}

function completeReview(lesson) {
  state.reviewQueue = (state.reviewQueue || []).filter(item => item.lessonId !== lesson.id);
  const old = Number(state.masteryByLesson[lesson.id] || 70);
  const next = Math.min(100, Math.max(old, lessonMasteryScore(lesson)) + 8);
  state.masteryByLesson[lesson.id] = next;
  state.reviewModeLessonId = 0;
  const intervalHours = next >= 90 ? 168 : 72;
  upsertReview(lesson, 'spaced-review', intervalHours);
}

function renderStats() {
  const solved = state.solved.length;
  const stages = window.COURSE_STAGES || [];
  const completedStages = stages.filter(stage => isStageComplete(stage.id)).length;
  const currentStage = currentLesson()?.stageId || 1;

  $('solvedCount').textContent = solved;
  $('totalCount').textContent = lessons.length;
  $('streak').textContent = state.streak || 1;
  $('levelBadge').textContent = `Lv.${Math.max(1, currentStage)}`;
  $('syntaxErrors').textContent = state.stats.syntaxErrors || 0;
  $('runtimeErrors').textContent = state.stats.runtimeErrors || 0;
  $('wrongAnswers').textContent = state.stats.wrongAnswers || 0;
  $('hintUses').textContent = state.stats.hintUses || 0;

  const pct = lessons.length ? Math.round((solved / lessons.length) * 100) : 0;
  $('progressFill').style.width = `${pct}%`;
  $('progressPercent').textContent = `${pct}%`;
  $('courseProgressSmall').textContent = `${completedStages}/${stages.length} 阶段`;
  updateReviewBadge();
}

function renderAll() {
  renderLessonList();
  renderCurrentLesson();
  renderStats();
}

function tutorSay(text, type = 'tutor') {
  const el = document.createElement('div');
  el.className = `tutor-message ${type}`;
  el.textContent = text;
  $('tutorMessages').appendChild(el);
  $('tutorMessages').scrollTop = $('tutorMessages').scrollHeight;
  return el;
}

function mergeNumberMapMax(a = {}, b = {}) {
  const out = { ...a };
  Object.entries(b || {}).forEach(([key, value]) => {
    const next = Number(value || 0);
    out[key] = Math.max(Number(out[key] || 0), next);
  });
  return out;
}

function mergeStateFromServer(serverState) {
  if (!serverState || typeof serverState !== 'object') return;
  const localSolved = new Set(Array.isArray(state.solved) ? state.solved : []);
  (Array.isArray(serverState.solved) ? serverState.solved : []).forEach(x => {
    if (Number.isInteger(x)) localSolved.add(x);
  });

  const serverTs = Number(serverState.clientUpdatedAt || 0);
  const localTs = Number(state.clientUpdatedAt || 0);
  const preferServer = serverTs >= localTs;

  const merged = {
    ...state,
    ...serverState,
    solved: Array.from(localSolved).sort((a, b) => a - b),
    attemptsByLesson: mergeNumberMapMax(state.attemptsByLesson, serverState.attemptsByLesson),
    hintLevelByLesson: mergeNumberMapMax(state.hintLevelByLesson, serverState.hintLevelByLesson),
    masteryByLesson: mergeNumberMapMax(state.masteryByLesson, serverState.masteryByLesson),
    hiddenFailures: mergeNumberMapMax(state.hiddenFailures, serverState.hiddenFailures),
    stats: {
      syntaxErrors: Math.max(Number(state.stats?.syntaxErrors || 0), Number(serverState.stats?.syntaxErrors || 0)),
      runtimeErrors: Math.max(Number(state.stats?.runtimeErrors || 0), Number(serverState.stats?.runtimeErrors || 0)),
      wrongAnswers: Math.max(Number(state.stats?.wrongAnswers || 0), Number(serverState.stats?.wrongAnswers || 0)),
      hintUses: Math.max(Number(state.stats?.hintUses || 0), Number(serverState.stats?.hintUses || 0))
    }
  };

  if (!preferServer) {
    merged.current = state.current;
    merged.openStageId = state.openStageId;
    merged.reviewQueue = state.reviewQueue;
    merged.stageResults = state.stageResults;
    merged.clientUpdatedAt = localTs;
  }

  Object.keys(state).forEach(key => delete state[key]);
  Object.assign(state, merged);
  state.current = Math.max(0, Math.min(Number(state.current) || 0, Math.max(0, lessons.length - 1)));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function syncLearningDataFromServer() {
  if (!localServiceReady || learningDataSynced) return;
  const localCache = collectLocalLearningCache();
  Object.assign(learningCache.codeByLesson, localCache.codeByLesson);
  Object.assign(learningCache.stdinByLesson, localCache.stdinByLesson);

  try {
    const resp = await fetch('/api/learning-data?t=' + Date.now(), { cache: 'no-store' });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data.ok) throw new Error(data.error || 'learning data unavailable');

    if (data.exists && data.data && typeof data.data === 'object') {
      const remote = data.data;
      const remoteTs = Number(remote.clientUpdatedAt || remote.state?.clientUpdatedAt || 0);
      const localTs = Number(state.clientUpdatedAt || 0);
      if (remoteTs >= localTs) {
        mergeStateFromServer(remote.state || {});
        Object.assign(learningCache.codeByLesson, remote.codeByLesson || {});
        Object.assign(learningCache.stdinByLesson, remote.stdinByLesson || {});
      } else {
        Object.entries(remote.codeByLesson || {}).forEach(([key, value]) => {
          if (!Object.prototype.hasOwnProperty.call(learningCache.codeByLesson, key)) learningCache.codeByLesson[key] = value;
        });
        Object.entries(remote.stdinByLesson || {}).forEach(([key, value]) => {
          if (!Object.prototype.hasOwnProperty.call(learningCache.stdinByLesson, key)) learningCache.stdinByLesson[key] = value;
        });
      }
    }

    learningDataSynced = true;
    const status = $('learningStorageStatus');
    if (status) status.textContent = '已启用 PyPath 本地学习数据文件；端口或浏览器变化不会丢失进度。';
    renderAll();
    scheduleLearningSave();
  } catch (_) {
    learningDataSynced = false;
    const status = $('learningStorageStatus');
    if (status) status.textContent = '当前使用浏览器副本；本地学习数据文件暂时未连接。';
  }
}

function setTutorMode() {
  const badge = $('tutorModeBadge');
  const text = $('tutorModeText');
  if (localServiceReady && aiState.enabled && aiState.configured) {
    badge.textContent = 'AI';
    badge.className = 'tutor-mode-badge ai';
    text.textContent = aiState.model ? `AI 模式 · ${aiState.model}` : 'AI 模式';
    $('tutorNote').textContent = 'AI 导师已连接。它会看到当前关卡、你的代码和最近运行结果，但仍会优先用提示引导你自己完成。';
  } else {
    badge.textContent = 'LOCAL';
    badge.className = 'tutor-mode-badge local';
    text.textContent = '本地智能模式';
    $('tutorNote').textContent = localServiceReady
      ? '当前使用免费的本地智能导师；在设置中配置兼容接口后，可以切换为真正的 AI 导师。'
      : '当前使用本地智能导师。新版本地服务尚未连接时，AI 配置与内部更新功能不可用。';
  }
}

async function initLocalService() {
  try {
    const resp = await fetch(`/api/status?t=${Date.now()}`, { cache: 'no-store' });
    if (!resp.ok) throw new Error('service unavailable');
    const data = await resp.json();
    localServiceReady = !!data.ok;
    if (data.version) appVersion = data.version;
    if (data.displayVersion) displayVersion = data.displayVersion;
    else displayVersion = appVersion;
    if (data.ai) aiState = { ...aiState, ...data.ai };
    if (data.startupUpdate && data.startupUpdate.state === 'error') {
      const status = $('updateStatus');
      if (status) status.textContent = '上次自动更新失败：' + (data.startupUpdate.message || '未知错误') + '。你可以点击“检查更新”后直接“立即更新”。';
    }
  } catch (_) {
    localServiceReady = false;
  }
  setTutorMode();
  if (localServiceReady) await syncLearningDataFromServer();
}

function clearTutor(showMessage = true) {
  $('tutorMessages').innerHTML = '';
  if (showMessage) tutorSay('对话已清空。你可以继续写代码，有问题再叫我。', 'system');
}

function revealHint() {
  const lesson = currentLesson();
  const current = state.hintLevelByLesson[lesson.id] || 0;
  if (current >= 3) {
    tutorSay('这一关的 3 级提示都已经给完了。现在建议你自己把代码敲出来，再运行验证。');
    return;
  }
  const next = current + 1;
  state.hintLevelByLesson[lesson.id] = next;
  state.stats.hintUses = (state.stats.hintUses || 0) + 1;
  upsertReview(lesson, 'hint', 24);
  $('hintBox').classList.remove('hidden');
  $('hintBox').textContent = `提示 ${next}/3\n${lesson.hints[next - 1]}`;
  tutorSay(`第 ${next} 级提示：\n${lesson.hints[next - 1]}`);
  saveState();
  renderStats();
}

async function initPython() {
  try {
    pyodide = await loadPyodide();
    $('runtimeStatus').textContent = 'Python 已就绪';
    $('runtimeStatus').classList.add('ready');
    $('runBtn').disabled = false;
    $('consoleOutput').textContent = 'Python 已就绪。点击“运行代码”。';
  } catch (err) {
    $('runtimeStatus').textContent = 'Python 加载失败';
    $('runtimeStatus').classList.add('failed');
    $('consoleOutput').textContent = '无法加载浏览器 Python 运行环境。\n请检查网络后刷新页面。\n\n' + err;
    tutorSay('Python 运行环境没有加载成功。先检查网络，然后刷新页面。');
  }
}

function initMonaco() {
  if (!window.require || typeof window.require.config !== 'function') return;
  try {
    window.require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.57.0/min/vs' } });
    window.require(['vs/editor/editor.main'], () => {
      const initial = $('codeEditor').value;
      monacoEditor = monaco.editor.create($('monacoEditor'), {
        value: initial,
        language: 'python',
        theme: 'vs-dark',
        fontSize: 14,
        lineHeight: 23,
        minimap: { enabled: false },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        padding: { top: 14, bottom: 14 },
        tabSize: 4,
        insertSpaces: true,
        wordWrap: 'on',
        renderLineHighlight: 'line',
        roundedSelection: true,
        quickSuggestions: false,
        suggestOnTriggerCharacters: false
      });
      $('monacoEditor').classList.remove('hidden');
      $('codeEditor').classList.add('hidden');
      monacoEditor.onDidChangeModelContent(() => saveCurrentCode());
      monacoEditor.addAction({
        id: 'pypath-run-code',
        label: 'Run Python',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
        run: () => runCode()
      });
    });
  } catch (_) {
    // 保留 textarea 作为离线/加载失败时的编辑器。
  }
}

function classifyError(message) {
  if (/SyntaxError|IndentationError|TabError/.test(message)) {
    state.stats.syntaxErrors = (state.stats.syntaxErrors || 0) + 1;
    return 'syntax';
  }
  state.stats.runtimeErrors = (state.stats.runtimeErrors || 0) + 1;
  return 'runtime';
}

function friendlyError(message) {
  if (/SyntaxError/.test(message)) return '这是语法错误。重点检查括号、引号、冒号，以及有没有写 Python 不认识的符号。';
  if (/IndentationError/.test(message)) return '这是缩进错误。Python 用缩进表示代码属于哪个代码块，检查 if / for / def 下面是否缩进一致。';
  if (/NameError/.test(message)) return '程序使用了一个还没有定义的名字。检查变量名是否拼错，或者变量是否先赋值再使用。';
  if (/TypeError/.test(message)) return '这里的数据类型不匹配。想一下：当前变量是文字、整数、小数，还是列表？';
  if (/ValueError/.test(message)) return '程序拿到了不符合要求的值。常见情况是把不能转换成数字的文字交给 int() / float()。';
  return '程序运行时出现错误。先看控制台最后一行，它通常最接近真正原因。';
}

function tutorForError(message) {
  if (/SyntaxError/.test(message)) return '先不要大改。语法错误通常是“写法不符合 Python 规则”。看看报错箭头附近，尤其检查括号、引号、冒号。';
  if (/IndentationError/.test(message)) return '你现在遇到的是缩进问题。把同一个代码块里的缩进统一成 4 个空格，再试一次。';
  if (/NameError/.test(message)) return 'Python 找不到某个名字。比较一下变量定义时和使用时的拼写，大小写也要一致。';
  if (/TypeError/.test(message)) return '这次先想“左右两边是什么类型”。很多 TypeError 不是逻辑错，而是数字和字符串等类型不能直接按当前方式操作。';
  return '先读控制台最后一行，再对照你刚改过的那一小段。不要一次改很多地方，这样更容易定位问题。';
}

function upsertReview(lesson, reason, delayHours) {
  if (!lesson) return;
  const now = Date.now();
  const hours = Number(delayHours || (reason === 'solved' ? 72 : 24));
  const dueAt = now + hours * 3600 * 1000;
  const existing = (state.reviewQueue || []).find(item => item.lessonId === lesson.id);
  if (existing) {
    existing.reason = reason;
    existing.dueAt = Math.min(Number(existing.dueAt || dueAt), dueAt);
    existing.updatedAt = now;
  } else {
    state.reviewQueue.push({ lessonId: lesson.id, reason, dueAt, createdAt: now, updatedAt: now });
  }
}

function dueReviewItems() {
  const now = Date.now();
  return (state.reviewQueue || [])
    .filter(item => Number(item.dueAt || 0) <= now)
    .filter(item => lessons.some(lesson => lesson.id === item.lessonId))
    .sort((a, b) => Number(a.dueAt || 0) - Number(b.dueAt || 0));
}

function updateReviewBadge() {
  const due = dueReviewItems().length;
  const count = $('reviewCount');
  const btn = $('reviewBtn');
  if (count) count.textContent = String(due);
  if (btn) btn.classList.toggle('has-review', due > 0);
}

function lessonMasteryScore(lesson) {
  const attempts = Number(state.attemptsByLesson[lesson.id] || 0);
  const hints = Number(state.hintLevelByLesson[lesson.id] || 0);
  const hiddenFails = Number(state.hiddenFailures[lesson.id] || 0);
  let score = 100;
  score -= Math.max(0, attempts - 1) * 7;
  score -= hints * 10;
  score -= hiddenFails * 8;
  return Math.max(35, Math.min(100, score));
}

function markLessonSolved(lesson) {
  if (!state.solved.includes(state.current)) state.solved.push(state.current);
  state.solved.sort((a, b) => a - b);
  const mastery = lessonMasteryScore(lesson);
  state.masteryByLesson[lesson.id] = mastery;
  upsertReview(lesson, mastery < 75 ? 'weak' : 'solved', mastery < 75 ? 24 : 72);
}

async function executeBrowserCase(code, stdinText) {
  if (!pyodide) return { stdout: '', stderr: '', error: '浏览器 Python 尚未就绪', timedOut: false };
  const stdinLines = String(stdinText || '') === '' ? [] : String(stdinText).split(/\r?\n/);
  const out = [];
  const errOut = [];
  let inputIndex = 0;
  try {
    pyodide.setStdout({ batched: (s) => out.push(s) });
    pyodide.setStderr({ batched: (s) => errOut.push(s) });
    pyodide.setStdin({ stdin: () => inputIndex < stdinLines.length ? stdinLines[inputIndex++] : undefined });
    await pyodide.runPythonAsync(code);
    return { stdout: out.join('\n'), stderr: errOut.join('\n'), error: '', timedOut: false };
  } catch (err) {
    return { stdout: out.join('\n'), stderr: errOut.join('\n'), error: String(err), timedOut: false };
  }
}

async function executeLocalCase(code, stdinText, timeout = 6) {
  if (!localServiceReady) return { stdout: '', stderr: '', error: '本地 Python 服务未连接', timedOut: false };
  try {
    const resp = await fetch('/api/python/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, stdin: stdinText || '', timeout })
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data.ok) throw new Error(data.error || `HTTP ${resp.status}`);
    if (data.timedOut) {
      return { stdout: data.stdout || '', stderr: data.stderr || '', error: 'TimeoutError: 程序运行超过时间限制', timedOut: true };
    }
    const failed = Number(data.returncode || 0) !== 0;
    return {
      stdout: data.stdout || '',
      stderr: data.stderr || '',
      error: failed ? (data.stderr || `Python 进程退出码 ${data.returncode}`) : '',
      timedOut: false
    };
  } catch (err) {
    return { stdout: '', stderr: '', error: String(err), timedOut: false };
  }
}

async function executeCase(code, stdinText, lesson, preferLocal = false) {
  const useLocal = localServiceReady && (preferLocal || lesson.runtime === 'local');
  return useLocal ? executeLocalCase(code, stdinText, lesson.boss ? 10 : 6) : executeBrowserCase(code, stdinText);
}

async function runHiddenTests(lesson, code) {
  const tests = Array.isArray(lesson.hiddenTests) ? lesson.hiddenTests : [];
  if (!tests.length) return { passed: true, total: 0 };
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    const combined = test.appendCode ? `${code}\n\n# PyPath hidden test\n${test.appendCode}\n` : code;
    const result = await executeCase(combined, test.stdin ?? lesson.stdin ?? '', lesson, true);
    if (result.error || normalized(result.stdout) !== normalized(test.expected)) {
      return { passed: false, total: tests.length, failedIndex: i, error: result.error || '' };
    }
  }
  return { passed: true, total: tests.length };
}

async function runCode() {
  if ((!pyodide && !localServiceReady) || running) return;
  running = true;
  $('runBtn').disabled = true;
  const lesson = currentLesson();
  const code = getCode();
  const stdinText = $('stdinInput').value;

  state.attemptsByLesson[lesson.id] = (state.attemptsByLesson[lesson.id] || 0) + 1;
  $('attemptsText').textContent = `尝试 ${state.attemptsByLesson[lesson.id]} 次`;
  localStorage.setItem(`pypath-code-${lesson.id}`, code);
  localStorage.setItem(`pypath-stdin-${lesson.id}`, stdinText);
  learningCache.codeByLesson[String(lesson.id)] = code;
  learningCache.stdinByLesson[String(lesson.id)] = stdinText;

  try {
    const result = await executeCase(code, stdinText, lesson, false);
    const displayOutput = [result.stdout, result.stderr].filter(Boolean).join('\n');
    lastRunOutput = result.stdout || '';
    lastRunError = result.error || '';
    $('consoleOutput').textContent = displayOutput || result.error || '(程序没有输出任何内容)';

    if (result.error) {
      classifyError(result.error);
      upsertReview(lesson, 'error', 24);
      $('feedbackBox').className = 'feedback bad';
      $('feedbackBox').textContent = friendlyError(result.error);
      $('nextBtn').classList.add('hidden');
      tutorSay(tutorForError(result.error));
      return;
    }

    let passed = normalized(result.stdout) === normalized(lesson.expected);
    if (lesson.codeMustInclude) passed = passed && lesson.codeMustInclude.every(token => code.includes(token));

    if (passed && Array.isArray(lesson.hiddenTests) && lesson.hiddenTests.length) {
      $('feedbackBox').className = 'feedback neutral';
      $('feedbackBox').textContent = `基础用例通过，正在运行 ${lesson.hiddenTests.length} 个隐藏测试…`;
      const hidden = await runHiddenTests(lesson, code);
      if (!hidden.passed) {
        state.hiddenFailures[lesson.id] = (state.hiddenFailures[lesson.id] || 0) + 1;
        state.stats.wrongAnswers = (state.stats.wrongAnswers || 0) + 1;
        upsertReview(lesson, 'hidden-test', 24);
        $('feedbackBox').className = 'feedback warn';
        $('feedbackBox').textContent = '基础用例通过了，但有一个隐藏测试没有通过。\n\n这通常说明代码只适用于当前示例。检查边界值、不同输入，或者有没有把答案写死。';
        $('nextBtn').classList.add('hidden');
        tutorSay('你的代码已经通过当前示例，但换一组输入就出现问题。先不要问隐藏输入是什么，检查代码是否真正根据输入和变量计算。');
        return;
      }
    }

    if (passed) {
      const wasSolved = state.solved.includes(state.current);
      const wasReviewing = Number(state.reviewModeLessonId || 0) === lesson.id;
      if (wasReviewing) completeReview(lesson);
      else markLessonSolved(lesson);
      $('feedbackBox').className = 'feedback good';
      $('feedbackBox').textContent = wasReviewing
        ? '🔁 复习通过！这一知识点的掌握度已更新。'
        : (lesson.boss
          ? '👑 BOSS CLEAR！本阶段已经通关，下一阶段已解锁。'
          : ((lesson.hiddenTests || []).length
            ? `✅ 挑战成功，并通过 ${lesson.hiddenTests.length} 个隐藏测试。下面是完整详解。`
            : '✅ 挑战成功。下面已经生成本题完整详解。'));
      $('nextBtn').classList.toggle('hidden', state.current >= lessons.length - 1);
      $('nextBtn').textContent = wasReviewing ? '返回主线 →' : (lesson.boss ? '进入下一阶段 →' : '下一关 →');
      tutorSay(
        lesson.boss
          ? 'BOSS 已击败。先看完整复盘，确认自己知道每个部分为什么这样写，再进入下一阶段。'
          : '很好，程序已经跑通。现在看下面的详解，对照你的代码和参考实现，确认自己是真的理解了。',
        'good'
      );
      renderSolutionExplanation(lesson, code);
      if (lesson.boss && !wasSolved && !wasReviewing) setTimeout(() => showStageSummary(lesson.stageId), 550);
      else setTimeout(() => {
        const panel = $('solutionPanel');
        if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    } else {
      state.stats.wrongAnswers = (state.stats.wrongAnswers || 0) + 1;
      upsertReview(lesson, 'wrong-answer', 24);
      $('feedbackBox').className = 'feedback warn';
      $('feedbackBox').textContent = `代码能运行，但结果还不对。\n目标输出：\n${lesson.expected}\n\n先比较你的输出和目标有什么不同。`;
      $('nextBtn').classList.add('hidden');
      tutorSay('代码已经能运行，这是好事。现在不要改语法，先只比较“你的输出”和“目标输出”哪里不一样。');
    }
  } finally {
    saveState();
    renderStats();
    renderLessonList();
    updateReviewBadge();
    running = false;
    $('runBtn').disabled = false;
  }
}

function explainCurrentCode() {
  const lesson = currentLesson();
  const code = getCode().trim();
  if (!code) {
    tutorSay('你现在的编辑器还是空的。先根据任务写一点代码，我再帮你解释你写下来的内容。');
    return;
  }
  if (aiState.enabled && aiState.configured && localServiceReady) {
    askTutor('请逐行解释我当前写的代码。不要直接替我完成本关，只解释每一行在做什么。');
    return;
  }
  tutorSay(`${lesson.codeExplain}\n\n你当前写的是：\n${code}\n\n解释时先关注“每一行改变了什么”，不要急着背术语。`);
}

function conceptAsText(lesson) {
  const temp = document.createElement('div');
  temp.innerHTML = lesson.concept || '';
  return temp.textContent || '';
}

function localTutorAnswer(question) {
  const lesson = currentLesson();
  const q = String(question || '').trim();
  const lower = q.toLowerCase();
  const hintLevel = state.hintLevelByLesson[lesson.id] || 0;

  if (!q) return '先把你卡住的地方写出来。例如：“这行是什么意思？”“为什么报错？”“下一步应该看哪里？”';

  if (/报错|错误|error|为什么运行不了|跑不通/.test(lower)) {
    if (lastRunError) return `${friendlyError(lastRunError)}\n\n你可以先只改一个地方，再重新运行。`;
    if (lastRunOutput) return '最近一次代码没有抛出运行错误。如果结果不对，先把你的输出和题目目标逐字比较。';
    return '你还没有运行过当前代码。先点一次“运行代码”，把真实报错拿到，再判断会更准确。';
  }

  if (/这行|解释|什么意思|看不懂|作用/.test(lower)) {
    return `${lesson.simpleExplain}\n\n当前关卡最重要的是：${conceptAsText(lesson)}`;
  }

  if (/下一步|怎么改|提示|卡住|不会/.test(lower)) {
    const idx = Math.min(hintLevel, lesson.hints.length - 1);
    return `先只做下一小步：${lesson.hints[idx]}\n\n改完后马上运行验证，不要一次改很多地方。`;
  }

  if (/答案|直接告诉|完整代码/.test(lower)) {
    if (hintLevel < 2) {
      return `我先不直接把完整答案贴出来。你现在只用了 ${hintLevel}/3 级提示。建议先点“再给一点提示”，至少自己尝试一次。`;
    }
    return `你已经看过较多提示了。最后一级提示是：${lesson.hints[lesson.hints.length - 1]}\n\n请你自己把它敲进编辑器并运行。`;
  }

  if (/print/.test(lower)) return 'print(...) 可以先理解成“把括号里的内容显示出来”。如果是文字，要放在引号里；如果是变量，通常直接写变量名。';
  if (/input/.test(lower)) return 'input() 会读取一次输入，并返回字符串。即使你输入的是 18，默认拿到的也是文字 "18"，需要做数字计算时常常要再用 int() 转换。';
  if (/range/.test(lower)) return 'range(start, stop) 从 start 开始，但通常不包含 stop。比如 range(2, 6) 会得到 2、3、4、5。';
  if (/变量|variable/.test(lower)) return '变量可以先理解成“贴了名字的盒子”。例如 name = "张三"，之后写 name 就是在使用这个盒子里的值。';
  if (/循环|for/.test(lower)) return 'for 循环就是让同一段代码重复执行。关键先看“每一次循环时，循环变量会变成什么”。';
  if (/函数|def|return/.test(lower)) return '函数可以理解成一台小机器：参数是输入，函数体负责处理，return 把结果交回调用它的地方。';

  return `我先结合当前关卡回答：${lesson.simpleExplain}\n\n如果你问的是某一行，最好把那一行或报错关键词写出来，我能给你更具体的提示。`;
}

async function askTutor(question) {
  const q = String(question || '').trim();
  if (!q || tutorBusy) return;
  tutorSay(q, 'user');
  $('tutorInput').value = '';

  if (!(localServiceReady && aiState.enabled && aiState.configured)) {
    tutorSay(localTutorAnswer(q));
    return;
  }

  tutorBusy = true;
  $('sendTutorBtn').disabled = true;
  const loading = tutorSay('AI 导师正在看你的代码…', 'loading');
  try {
    const lesson = currentLesson();
    const resp = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: q,
        code: getCode(),
        output: lastRunError || lastRunOutput,
        hintLevel: state.hintLevelByLesson[lesson.id] || 0,
        lesson: { title: lesson.title, task: lesson.task, conceptText: conceptAsText(lesson) }
      })
    });
    const data = await resp.json().catch(() => ({}));
    loading.remove();
    if (!resp.ok || !data.ok) throw new Error(data.error || `HTTP ${resp.status}`);
    tutorSay(data.answer || 'AI 没有返回文字。');
  } catch (err) {
    loading.remove();
    tutorSay(`AI 暂时没有连通：${err.message || err}\n\n我先切回本地提示继续帮你。`, 'system');
    tutorSay(localTutorAnswer(q));
  } finally {
    tutorBusy = false;
    $('sendTutorBtn').disabled = false;
  }
}

async function loadVersionInfo() {
  try {
    const resp = await fetch(`version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (resp.ok) {
      const info = await resp.json();
      appVersion = info.version || appVersion;
      displayVersion = info.displayVersion || info.version || displayVersion;
    }
  } catch (_) {}
  $('versionText').textContent = `V${displayVersion}`;
}

function compareVersions(a, b) {
  const pa = String(a).split('.').map(n => parseInt(n, 10) || 0);
  const pb = String(b).split('.').map(n => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] || 0, y = pb[i] || 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}

async function checkUpdates() {
  const status = $('updateStatus');
  status.textContent = '正在检查更新…';
  try {
    const cfgResp = await fetch(`update-config.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!cfgResp.ok) throw new Error('无法读取更新配置');
    const cfg = await cfgResp.json();
    const manifestUrl = cfg.manifestUrl || 'https://raw.githubusercontent.com/qi-fg/PyPath/main/update-manifest.json';
    const manifestResp = await fetch(`${manifestUrl}${manifestUrl.includes('?') ? '&' : '?'}t=${Date.now()}`, { cache: 'no-store' });
    if (!manifestResp.ok) throw new Error('更新服务器无响应');
    const manifest = await manifestResp.json();
    const remoteDisplayVersion = manifest.displayVersion || manifest.version;
    if (compareVersions(manifest.version, appVersion) > 0) {
      status.textContent = `发现新版本 V${remoteDisplayVersion}。可以直接点击“立即更新”，无需关闭网页。`;
      $('onlineUpdateBtn').classList.remove('hidden');
      $('onlineUpdateBtn').dataset.version = remoteDisplayVersion;
    } else {
      status.textContent = `当前已经是最新版本 V${displayVersion}。`;
      $('onlineUpdateBtn').classList.add('hidden');
    }
  } catch (err) {
    status.textContent = `检查失败：${err.message || err}`;
  }
}

async function loadAiSettings() {
  const status = $('aiSettingStatus');
  if (!localServiceReady) {
    status.textContent = '本地服务未连接';
    status.className = 'mini-status bad';
    return;
  }
  try {
    const resp = await fetch(`/api/ai/config?t=${Date.now()}`, { cache: 'no-store' });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const cfg = await resp.json();
    $('aiEnabled').checked = !!cfg.enabled;
    $('aiEndpoint').value = cfg.endpoint || '';
    $('aiModel').value = cfg.model || '';
    $('aiApiKey').value = '';
    $('aiApiKey').placeholder = cfg.hasKey ? '已保存 Key；留空表示继续使用' : '填写你的 API Key';
    aiState = {
      enabled: !!cfg.enabled,
      configured: !!(cfg.endpoint && cfg.model && cfg.hasKey),
      provider: cfg.provider || '',
      model: cfg.model || ''
    };
    setTutorMode();
    status.textContent = cfg.hasKey ? '已读取本机配置' : '尚未保存 API Key';
    status.className = 'mini-status';
  } catch (err) {
    status.textContent = `读取失败：${err.message || err}`;
    status.className = 'mini-status bad';
  }
}

async function saveAiSettings() {
  const status = $('aiSettingStatus');
  if (!localServiceReady) {
    status.textContent = '当前启动方式不支持 AI 配置，请使用 V2.1 启动器重新打开 PyPath。';
    status.className = 'mini-status bad';
    return;
  }
  const payload = {
    enabled: $('aiEnabled').checked,
    endpoint: $('aiEndpoint').value.trim(),
    model: $('aiModel').value.trim()
  };
  const key = $('aiApiKey').value.trim();
  if (key) payload.apiKey = key;
  status.textContent = '正在保存…';
  status.className = 'mini-status';
  try {
    const resp = await fetch('/api/ai/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data.ok) throw new Error(data.error || `HTTP ${resp.status}`);
    $('aiApiKey').value = '';
    await initLocalService();
    await loadAiSettings();
    status.textContent = aiState.enabled && aiState.configured ? '已保存，AI 导师已启用' : '已保存';
    status.className = 'mini-status good';
  } catch (err) {
    status.textContent = `保存失败：${err.message || err}`;
    status.className = 'mini-status bad';
  }
}

async function installOnlineUpdate() {
  const status = $('updateStatus');
  const btn = $('onlineUpdateBtn');
  if (!localServiceReady) {
    status.textContent = '本地更新服务未连接，请先重新打开 PyPath。';
    return;
  }
  btn.disabled = true;
  $('checkUpdateBtn').disabled = true;
  status.textContent = '正在从 GitHub 下载并校验更新，请不要关闭 PyPath…';
  try {
    const resp = await fetch('/api/update/online', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}'
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data.ok) throw new Error(data.error || `HTTP ${resp.status}`);
    if (!data.updated) {
      status.textContent = `当前已经是最新版本 V${data.displayVersion || displayVersion}。`;
      btn.classList.add('hidden');
      return;
    }
    status.textContent = `V${data.displayVersion || data.version} 已安装，正在重启 PyPath…`;
    await fetch('/api/restart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    const back = await waitForRestart();
    if (!back) throw new Error('更新已安装，但自动重启超时。请重新双击桌面 PyPath。');
    location.href = '/?updated=' + Date.now();
  } catch (err) {
    status.textContent = `在线更新失败：${err.message || err}`;
    btn.disabled = false;
    $('checkUpdateBtn').disabled = false;
  }
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function waitForRestart() {
  for (let i = 0; i < 40; i++) {
    await sleep(500);
    try {
      const resp = await fetch(`/api/status?restart=${Date.now()}`, { cache: 'no-store' });
      if (resp.ok) return true;
    } catch (_) {}
  }
  return false;
}

async function installUpdatePackage(file) {
  const status = $('updateStatus');
  if (!file) return;
  if (!localServiceReady) {
    status.textContent = '当前本地服务不是 V2.1 更新服务。请先完成这一次 V2.1 升级，之后的新版本就能在这里内部安装。';
    return;
  }
  if (!confirm(`安装更新包“${file.name}”？\n\n学习进度和 AI 配置会保留。`)) return;

  $('installUpdateBtn').disabled = true;
  status.textContent = '正在验证并安装更新包，请不要关闭 PyPath…';
  try {
    const resp = await fetch('/api/update/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/zip' },
      body: file
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data.ok) throw new Error(data.error || `HTTP ${resp.status}`);
    status.textContent = `V${data.displayVersion || data.version} 已安装，正在自动重启 PyPath…`;
    await fetch('/api/restart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    const back = await waitForRestart();
    if (!back) throw new Error('更新已写入，但自动重启超时。请关闭后重新双击桌面 PyPath。');
    location.reload();
  } catch (err) {
    status.textContent = `安装失败：${err.message || err}`;
    $('installUpdateBtn').disabled = false;
  }
}

function exportLearningData() {
  const data = { format: APP_DATA_FORMAT, exportedAt: new Date().toISOString(), items: {} };
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('pypath-')) data.items[key] = localStorage.getItem(key);
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PyPath-learning-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importLearningData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || !data.items || typeof data.items !== 'object') throw new Error('不是有效的 PyPath 备份');
      Object.entries(data.items).forEach(([key, value]) => {
        if (key.startsWith('pypath-')) localStorage.setItem(key, value);
      });
      alert('学习数据已导入。页面将重新加载。');
      location.reload();
    } catch (err) {
      alert(`导入失败：${err.message || err}`);
    }
  };
  reader.readAsText(file, 'utf-8');
}

function resetLearningData() {
  if (!confirm('确定要清除 PyPath 的全部本地学习记录吗？这个操作不能撤销。')) return;
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('pypath-')) keys.push(key);
  }
  keys.forEach(k => localStorage.removeItem(k));
  location.reload();
}

function openSettings() {
  $('settingsModal').classList.remove('hidden');
  loadVersionInfo();
  loadAiSettings();
}
function closeSettings() { $('settingsModal').classList.add('hidden'); }

$('codeEditor').addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const el = e.target;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    el.value = el.value.substring(0, start) + '    ' + el.value.substring(end);
    el.selectionStart = el.selectionEnd = start + 4;
    saveCurrentCode();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    runCode();
  }
});
$('codeEditor').addEventListener('input', saveCurrentCode);
$('stdinInput').addEventListener('input', () => {
  const lesson = currentLesson();
  const value = $('stdinInput').value;
  localStorage.setItem(`pypath-stdin-${lesson.id}`, value);
  learningCache.stdinByLesson[String(lesson.id)] = value;
  saveState();
});

$('runBtn').addEventListener('click', runCode);
$('resetBtn').addEventListener('click', () => {
  const lesson = currentLesson();
  setCode(lesson.starter);
  $('stdinInput').value = lesson.stdin;
  localStorage.removeItem(`pypath-code-${lesson.id}`);
  localStorage.removeItem(`pypath-stdin-${lesson.id}`);
  delete learningCache.codeByLesson[String(lesson.id)];
  delete learningCache.stdinByLesson[String(lesson.id)];
  saveState();
  $('consoleOutput').textContent = '已恢复本关初始代码。';
  $('feedbackBox').className = 'feedback neutral';
  $('feedbackBox').textContent = '重新来一次。';
  hideSolutionExplanation();
  tutorSay('已经恢复初始代码。建议这次一次只改一小步，每改一步就想一下“这一行会改变什么”。', 'system');
});
$('hintBtn').addEventListener('click', revealHint);
$('tutorHintBtn').addEventListener('click', revealHint);
$('dontUnderstandBtn').addEventListener('click', () => tutorSay(currentLesson().simpleExplain));
$('explainCodeBtn').addEventListener('click', explainCurrentCode);
$('clearTutorBtn').addEventListener('click', () => clearTutor(true));
$('sendTutorBtn').addEventListener('click', () => askTutor($('tutorInput').value));
$('tutorInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    askTutor($('tutorInput').value);
  }
});
$('nextBtn').addEventListener('click', () => {
  if (state.reviewReturnIndex !== null && state.reviewReturnIndex !== undefined) {
    const back = Math.max(0, Math.min(Number(state.reviewReturnIndex) || 0, lessons.length - 1));
    state.reviewReturnIndex = null;
    state.reviewModeLessonId = 0;
    state.current = back;
    state.openStageId = lessons[back]?.stageId || state.openStageId;
    saveState();
    renderAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (state.current < lessons.length - 1 && state.solved.includes(state.current)) {
    state.current += 1;
    state.openStageId = currentLesson()?.stageId || state.openStageId;
    saveState();
    renderAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

$('settingsBtn').addEventListener('click', openSettings);
document.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeSettings));
$('checkUpdateBtn').addEventListener('click', checkUpdates);
$('onlineUpdateBtn').addEventListener('click', installOnlineUpdate);
$('installUpdateBtn').addEventListener('click', () => $('updateFile').click());
$('updateFile').addEventListener('change', async (e) => {
  const file = e.target.files && e.target.files[0];
  if (file) await installUpdatePackage(file);
  e.target.value = '';
});
$('saveAiBtn').addEventListener('click', saveAiSettings);
$('exportDataBtn').addEventListener('click', exportLearningData);
$('importDataBtn').addEventListener('click', () => $('importFile').click());
$('importFile').addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (file) importLearningData(file);
  e.target.value = '';
});
$('resetProgressBtn').addEventListener('click', resetLearningData);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('settingsModal').classList.contains('hidden')) closeSettings();
});

updateStreak();
renderAll();
loadVersionInfo();
initLocalService();
initMonaco();
initPython();
