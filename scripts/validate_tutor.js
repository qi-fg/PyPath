const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const lesson = {id: 1, simpleExplain: '年龄至少18岁，包含18岁这个边界。', hints: ['hint'], concept: '比较运算'};
let messages = [], requests = [];
let result = {ok: true, answer: ''}, pending;
const c = {
  currentLesson: () => lesson, conceptAsText: () => lesson.concept,
  state: {hintLevelByLesson: {}}, lastRunError: '', lastRunOutput: '', friendlyError: s => s,
  localServiceReady: true, aiState: {enabled: true, configured: true},
  tutorBusy: false, tutorGeneration: 0, tutorHistory: [], getCode: () => 'age=18',
  $: () => ({value: '', disabled: false}),
  tutorSay: (text, type) => {messages.push({text, type}); return {remove() {}};},
  fetch: async (url, options) => {
    requests.push(JSON.parse(options.body));
    if (pending) await pending;
    return {ok: true, json: async () => result};
  }
};
vm.createContext(c);
vm.runInContext(source.slice(source.indexOf('function localTutorAnswer('), source.indexOf('async function loadVersionInfo()')), c);
(async () => {
  await c.askTutor('这道题的知识点讲一下');
  assert(messages.some(m => m.text.includes(lesson.simpleExplain)));
  assert(!messages.some(m => m.text === 'AI 没有返回文字。'));
  assert.equal(c.tutorHistory.length, 0);
  result = {ok: true, answer: '边界值就是规则发生变化的位置。'};
  await c.askTutor('什么是边界值？');
  await c.askTutor('再给一个例子');
  assert.equal(requests.at(-1).history.length, 2);
  assert.equal(requests.at(-1).history[0].content, '什么是边界值？');
  messages = [];
  let resolve;
  pending = new Promise(r => {resolve = r;});
  const work = c.askTutor('旧题提问');
  c.tutorGeneration++;
  c.tutorHistory = [];
  resolve();
  await work;
  assert(!messages.some(m => m.text === result.answer));
  assert.equal(c.tutorHistory.length, 0);
  assert.equal(c.tutorBusy, false);
  console.log('Tutor UI checks passed: knowledge fallback, follow-up history and stale response isolation.');
})().catch(e => {console.error(e); process.exitCode = 1;});
