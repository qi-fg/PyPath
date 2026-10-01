const lessons = window.LESSONS || [];
const $ = (id) => document.getElementById(id);
const STORAGE_KEY = 'pypath-state';
const APP_DATA_FORMAT = 3;

function freshState() {
  return {
    current: 0,
    solved: [],
    attemptsByLesson: {},
    hintLevelByLesson: {},
    predictions: {},
    stats: { syntaxErrors: 0, runtimeErrors: 0, wrongAnswers: 0, hintUses: 0 },
    lastStudyDate: null,
    streak: 1
  };
}

function loadState() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (_) {}
  const base = freshState();
  if (!saved || typeof saved !== 'object') return base;
  return {
    ...base,
    ...saved,
    solved: Array.isArray(saved.solved) ? saved.solved : [],
    attemptsByLesson: saved.attemptsByLesson || {},
    hintLevelByLesson: saved.hintLevelByLesson || {},
    predictions: saved.predictions || {},
    stats: { ...base.stats, ...(saved.stats || {}) }
  };
}

const state = loadState();
let pyodide = null;
let running = false;
let monacoEditor = null;
let suppressEditorSave = false;
let appVersion = '2.1.0';
let localServiceReady = false;
let aiState = { enabled: false, configured: false, provider: '', model: '' };
let lastRunOutput = '';
let lastRunError = '';
let tutorBusy = false;

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  localStorage.setItem(`pypath-code-${lesson.id}`, getCode());
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

function renderLessonList() {
  const list = $('lessonList');
  list.innerHTML = '';
  lessons.forEach((lesson, idx) => {
    const btn = document.createElement('button');
    const solved = state.solved.includes(idx);
    const unlocked = idx === 0 || state.solved.includes(idx - 1) || solved || idx <= state.current;
    btn.className = 'lesson-item' + (idx === state.current ? ' active' : '') + (solved ? ' solved' : '') + (!unlocked ? ' locked' : '');
    btn.innerHTML = `<span class="lesson-label">${lesson.id}. ${lesson.title}</span>`;
    btn.disabled = !unlocked;
    btn.addEventListener('click', () => {
      if (!unlocked || idx === state.current) return;
      state.current = idx;
      saveState();
      renderAll();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    list.appendChild(btn);
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
  $('lessonStage').textContent = lesson.stage;
  $('lessonProgressText').textContent = `第 ${lesson.id} 关 / ${lessons.length} 关`;
  $('lessonTitle').textContent = lesson.title;
  $('lessonIntro').textContent = lesson.intro;
  $('lessonTask').textContent = lesson.task;
  $('conceptBox').innerHTML = lesson.concept;

  const code = localStorage.getItem(`pypath-code-${lesson.id}`) ?? lesson.starter;
  const stdin = localStorage.getItem(`pypath-stdin-${lesson.id}`) ?? lesson.stdin;
  setCode(code);
  $('stdinInput').value = stdin;

  const needsInput = lesson.stdin !== '' || /\binput\s*\(/.test(lesson.starter);
  $('stdinWrap').classList.toggle('hidden', !needsInput);

  $('consoleOutput').textContent = pyodide ? '准备好了。点击“运行代码”。' : 'Python 正在初始化，请稍候…';
  const solved = state.solved.includes(state.current);
  $('feedbackBox').className = solved ? 'feedback good' : 'feedback neutral';
  $('feedbackBox').textContent = solved ? '✅ 这一关已经通过。你可以继续修改代码练习，或者进入下一关。' : '写完代码后点击“运行代码”。';
  $('nextBtn').classList.toggle('hidden', !solved || state.current >= lessons.length - 1);
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
  tutorSay(`这一关我们只专注一个目标：${lesson.task}\n\n先自己改代码。卡住了再点“我看不懂”或“给一点提示”。`);
}

function renderStats() {
  const solved = state.solved.length;
  $('solvedCount').textContent = solved;
  $('totalCount').textContent = lessons.length;
  $('streak').textContent = state.streak || 1;
  $('levelBadge').textContent = `Lv.${Math.max(1, Math.floor(solved / 3) + 1)}`;
  $('syntaxErrors').textContent = state.stats.syntaxErrors || 0;
  $('runtimeErrors').textContent = state.stats.runtimeErrors || 0;
  $('wrongAnswers').textContent = state.stats.wrongAnswers || 0;
  $('hintUses').textContent = state.stats.hintUses || 0;
  const pct = lessons.length ? Math.round((solved / lessons.length) * 100) : 0;
  $('progressFill').style.width = `${pct}%`;
  $('progressPercent').textContent = `${pct}%`;
  $('courseProgressSmall').textContent = `${pct}%`;
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
    if (data.ai) aiState = { ...aiState, ...data.ai };
  } catch (_) {
    localServiceReady = false;
  }
  setTutorMode();
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

async function runCode() {
  if (!pyodide || running) return;
  running = true;
  $('runBtn').disabled = true;
  const lesson = currentLesson();
  const code = getCode();
  const stdinText = $('stdinInput').value;
  const stdinLines = stdinText === '' ? [] : stdinText.split(/\r?\n/);
  const out = [];
  const errOut = [];
  let inputIndex = 0;

  state.attemptsByLesson[lesson.id] = (state.attemptsByLesson[lesson.id] || 0) + 1;
  $('attemptsText').textContent = `尝试 ${state.attemptsByLesson[lesson.id]} 次`;
  localStorage.setItem(`pypath-code-${lesson.id}`, code);
  localStorage.setItem(`pypath-stdin-${lesson.id}`, stdinText);

  try {
    pyodide.setStdout({ batched: (s) => out.push(s) });
    pyodide.setStderr({ batched: (s) => errOut.push(s) });
    pyodide.setStdin({ stdin: () => inputIndex < stdinLines.length ? stdinLines[inputIndex++] : undefined });

    await pyodide.runPythonAsync(code);
    const output = [...out, ...errOut].join('\n');
    lastRunOutput = output;
    lastRunError = '';
    $('consoleOutput').textContent = output || '(程序没有输出任何内容)';

    let passed = normalized(output) === normalized(lesson.expected);
    if (lesson.codeMustInclude) passed = passed && lesson.codeMustInclude.every(token => code.includes(token));

    if (passed) {
      if (!state.solved.includes(state.current)) state.solved.push(state.current);
      state.solved.sort((a, b) => a - b);
      $('feedbackBox').className = 'feedback good';
      $('feedbackBox').textContent = '✅ 挑战成功。你不是只“看懂了”，而是真的把代码跑通了。';
      $('nextBtn').classList.toggle('hidden', state.current >= lessons.length - 1);
      tutorSay('很好，这次程序的实际输出和目标一致。先看一眼你刚刚改的那一行，确认自己知道为什么它现在能工作。', 'good');
    } else {
      state.stats.wrongAnswers = (state.stats.wrongAnswers || 0) + 1;
      $('feedbackBox').className = 'feedback warn';
      $('feedbackBox').textContent = `代码能运行，但结果还不对。\n目标输出：\n${lesson.expected}\n\n先比较你的输出和目标有什么不同。`;
      $('nextBtn').classList.add('hidden');
      tutorSay('代码已经能运行，这是好事。现在不要改语法，先只比较“你的输出”和“目标输出”哪里不一样。');
    }
  } catch (err) {
    const message = String(err);
    lastRunError = message;
    lastRunOutput = '';
    classifyError(message);
    $('consoleOutput').textContent = message;
    $('feedbackBox').className = 'feedback bad';
    $('feedbackBox').textContent = friendlyError(message);
    $('nextBtn').classList.add('hidden');
    tutorSay(tutorForError(message));
  } finally {
    saveState();
    renderStats();
    renderLessonList();
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
    }
  } catch (_) {}
  $('versionText').textContent = `V${appVersion}`;
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
    if (compareVersions(manifest.version, appVersion) > 0) {
      status.textContent = `发现新版本 V${manifest.version}。下次启动 PyPath 时会自动下载安装；也可以重新打开 PyPath 立即更新。学习记录不会被删除。`;
    } else {
      status.textContent = `当前已经是最新版本 V${appVersion}。`;
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
    status.textContent = `V${data.version} 已安装，正在自动重启 PyPath…`;
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
  localStorage.setItem(`pypath-stdin-${lesson.id}`, $('stdinInput').value);
});

$('runBtn').addEventListener('click', runCode);
$('resetBtn').addEventListener('click', () => {
  const lesson = currentLesson();
  setCode(lesson.starter);
  $('stdinInput').value = lesson.stdin;
  localStorage.removeItem(`pypath-code-${lesson.id}`);
  localStorage.removeItem(`pypath-stdin-${lesson.id}`);
  $('consoleOutput').textContent = '已恢复本关初始代码。';
  $('feedbackBox').className = 'feedback neutral';
  $('feedbackBox').textContent = '重新来一次。';
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
  if (state.current < lessons.length - 1 && state.solved.includes(state.current)) {
    state.current += 1;
    saveState();
    renderAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

$('settingsBtn').addEventListener('click', openSettings);
document.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeSettings));
$('checkUpdateBtn').addEventListener('click', checkUpdates);
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
