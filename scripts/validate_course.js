const fs = require('fs');
const path = require('path');
const os = require('os');
const vm = require('vm');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const courseDir = path.join(root, 'course');
const files = [
  'v3-core.js',
  'stage01.js',
  'stage02-v3.js',
  'stage03.js',
  'stage04.js',
  'stage05.js',
  'stage06.js',
  'stage07.js',
  'stage08.js',
  'stage09.js',
  'stage10.js',
  'stage11.js',
  'stage12.js',
  'stage13.js',
  'stage14.js',
  'stage15.js',
  'stage16.js',
  'stage17.js',
  'stage18.js',
  'stage19.js',
  'stage20.js',
  'v1-hidden-tests.js'
];

const context = { console };
context.window = context;
vm.createContext(context);

for (const file of files) {
  const full = path.join(courseDir, file);
  if (!fs.existsSync(full)) throw new Error('Missing course file: ' + file);
  vm.runInContext(fs.readFileSync(full, 'utf8'), context, { filename: file });
}

const stages = context.COURSE_STAGES || [];
const lessons = context.LESSONS || [];
const errors = [];

if (stages.length !== 20) errors.push('Expected 20 stages, got ' + stages.length);
if (lessons.length !== 240) errors.push('Expected 240 lessons, got ' + lessons.length);

const ids = new Set();
const keys = new Set();
for (const lesson of lessons) {
  if (ids.has(lesson.id)) errors.push('Duplicate lesson id: ' + lesson.id);
  if (keys.has(lesson.key)) errors.push('Duplicate lesson key: ' + lesson.key);
  ids.add(lesson.id);
  keys.add(lesson.key);

  for (const field of ['title', 'task', 'starter', 'expected', 'solution']) {
    if (typeof lesson[field] !== 'string') errors.push(lesson.key + ': ' + field + ' must be a string');
  }
  if (!Array.isArray(lesson.hints) || lesson.hints.length !== 3) errors.push(lesson.key + ': expected 3 hints');
  if (!['browser', 'local'].includes(lesson.runtime)) errors.push(lesson.key + ': invalid runtime ' + lesson.runtime);
}

for (const stage of stages) {
  const rows = lessons.filter(x => x.stageId === stage.id);
  if (rows.length !== 12) errors.push('Stage ' + stage.id + ': expected 12 lessons, got ' + rows.length);
  const bosses = rows.filter(x => x.boss);
  if (bosses.length !== 1) errors.push('Stage ' + stage.id + ': expected 1 boss, got ' + bosses.length);
  if (rows.length && !rows[rows.length - 1].boss) errors.push('Stage ' + stage.id + ': boss must be the final lesson');
}

function normalize(text) {
  return String(text || '').replace(/\r\n/g, '\n').trim();
}

function runPython(code, stdin) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pypath-validate-'));
  const script = path.join(dir, 'main.py');
  fs.writeFileSync(script, code, 'utf8');
  const result = spawnSync('python3', ['-I', '-X', 'utf8', script], {
    input: stdin || '',
    encoding: 'utf8',
    cwd: dir,
    timeout: 8000,
    maxBuffer: 1024 * 1024
  });
  fs.rmSync(dir, { recursive: true, force: true });
  return {
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    status: result.status,
    error: result.error
  };
}

function candidateCodes(lesson) {
  const candidates = [];
  if (lesson.solution.trim()) candidates.push(lesson.solution);
  const combined = [lesson.starter, lesson.solution].filter(Boolean).join('\n');
  if (combined.trim() && !candidates.includes(combined)) candidates.push(combined);
  return candidates;
}

let executableCount = 0;
for (const lesson of lessons) {
  let passingCode = null;
  const failures = [];
  for (const candidate of candidateCodes(lesson)) {
    const result = runPython(candidate, lesson.stdin || '');
    if (!result.error && result.status === 0 && normalize(result.stdout) === normalize(lesson.expected)) {
      passingCode = candidate;
      break;
    }
    failures.push({
      status: result.status,
      stdout: normalize(result.stdout).slice(0, 160),
      stderr: normalize(result.stderr).split('\n').slice(-2).join(' | ').slice(0, 220)
    });
  }

  if (!passingCode) {
    errors.push(lesson.key + ': reference implementation does not pass public example: ' + JSON.stringify(failures));
    continue;
  }
  executableCount += 1;

  for (const [index, test] of (lesson.hiddenTests || []).entries()) {
    const code = test.appendCode ? passingCode + '\n\n' + test.appendCode + '\n' : passingCode;
    const result = runPython(code, test.stdin ?? lesson.stdin ?? '');
    if (result.error || result.status !== 0 || normalize(result.stdout) !== normalize(test.expected)) {
      errors.push(
        lesson.key + ': hidden test ' + (index + 1) + ' failed ' +
        '(stdout=' + JSON.stringify(normalize(result.stdout).slice(0, 180)) + ', ' +
        'stderr=' + JSON.stringify(normalize(result.stderr).slice(-180)) + ')'
      );
    }
  }
}

if (errors.length) {
  console.error('\nPyPath course validation failed:\n');
  for (const err of errors) console.error(' - ' + err);
  process.exit(1);
}

const hiddenCount = lessons.reduce((n, lesson) => n + (lesson.hiddenTests || []).length, 0);
console.log('Validated ' + stages.length + ' stages, ' + lessons.length + ' lessons, ' + executableCount + ' reference implementations and ' + hiddenCount + ' hidden tests.');
