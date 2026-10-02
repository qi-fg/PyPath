// Regression checks: hardcoded answers, faulty boundaries, and equivalent solutions.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const os = require('os');
const {spawnSync} = require('child_process');
const root = path.resolve(__dirname, '..');
const c = {}; c.window = c; vm.createContext(c);
for (const match of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/src="(course\/[^?]+)\?/g)) {
  vm.runInContext(fs.readFileSync(path.join(root,match[1]),'utf8'),c,{filename:match[1]});
}
const normalize = s => String(s || '').replace(/\r\n/g,'\n').trim();
function run(code, input) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(),'pypath-judge-'));
  try {
    const file=path.join(dir,'main.py');fs.writeFileSync(file,code);
    const r=spawnSync('python3',['-I','-X','utf8',file],{cwd:dir,input:input||'',encoding:'utf8',timeout:8000});
    return {ok:!r.error && r.status===0,stdout:normalize(r.stdout),stderr:r.stderr};
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
}
function passes(lesson,code) {
  const publicCase=run(c.PyPathJudge.buildCaseCode(code),lesson.stdin);
  if(!publicCase.ok || publicCase.stdout!==normalize(lesson.expected))return false;
  for(const test of lesson.hiddenTests){
    const r=run(c.PyPathJudge.buildCaseCode(code,test),test.stdin??lesson.stdin);
    if(!r.ok || r.stdout!==normalize(test.expected))return false;
  }
  return true;
}
let rejected=0;
for(const lesson of c.LESSONS){
  const fake=`# ${(lesson.codeMustInclude||[]).join(' ')}\nprint(${JSON.stringify(lesson.expected)})`;
  const allowed=['s01-l01','s08-l01'].includes(lesson.key); // Literal-print exercises.
  if(passes(lesson,fake)!==allowed)throw Error('Hardcoded-output regression: '+lesson.key);
  if(!allowed)rejected++;
}
const byKey=Object.fromEntries(c.LESSONS.map(l=>[l.key,l]));
const bad=[
  ['s03-l05',"age=20\nhas_ticket=True\nif age==20 and has_ticket:\n    print('enter')"],
  ['s03-l05',"age=20\nhas_ticket=True\nif age>18 and has_ticket:\n    print('enter')"],
  ['s03-l11',"age=18\nif age==18:\n    print('allow')\nelse:\n    print('deny')"],
  ['s07-l02',"def add(a,b):\n    return 8\nprint(add(3,5))"],
  ['s09-l01',"print('hello')"],
  ['s17-l09',"default='dev'\nenv='prod'\ncli=None\nmode=cli or env or default\nprint(mode)"]
];
for(const [key,code] of bad)if(passes(byKey[key],code))throw Error('Invalid program accepted: '+key);
const alternatives=[
 ['s01-l11',byKey['s01-l11'].solution.replace('total += n','total = total + n')],
 ['s03-l05',"age=20\nhas_ticket=True\nif has_ticket and age>=18:\n    print('enter')"],
 ['s03-l11',"age=18\nif age<18:\n    print('deny')\nelse:\n    print('allow')"],
 ['s07-l02',"def add(a,b):\n    result=b+a\n    return result\nprint(add(3,5))"],
 ['s09-l01',"from pathlib import Path\nPath('demo.txt').write_text('hello',encoding='utf-8')\nprint(Path('demo.txt').read_text(encoding='utf-8'))"],
 ['s10-l08',byKey['s10-l08'].solution.replace('args =','options =').replace('args.port','options.port')],
 ['s14-l05',byKey['s14-l05'].solution.replace('rows =','records =').replace('in rows','in records')],
 ['s13-l01',byKey['s13-l01'].solution.replace('d =','day =').replace('d.isoformat','day.isoformat')],
 ['s18-l11',byKey['s18-l11'].solution.replaceAll('values','saved')]
];
for(const [key,code] of alternatives)if(!passes(byKey[key],code))throw Error('Equivalent program rejected: '+key);
// Same interpreter: no stale lesson globals and no changed argv/environment survive.
const isolation=`${c.PyPathJudge.buildCaseCode("secret_from_previous_lesson=7\nimport os,sys\nos.environ['PYPATH_JUDGE_TEMP']='x'\nsys.argv=['wrong']")}
${c.PyPathJudge.buildCaseCode("import os\nassert 'secret_from_previous_lesson' not in globals()\nassert 'PYPATH_JUDGE_TEMP' not in os.environ\nprint('isolated')")}`;
const isolated=run(isolation,'');
if(!isolated.ok||isolated.stdout!=='isolated')throw Error('Interpreter isolation failed: '+isolated.stderr);
console.log(`Rejected ${rejected} hardcoded answers and ${bad.length} targeted bugs; accepted ${alternatives.length} equivalent solutions; interpreter isolation passed.`);
