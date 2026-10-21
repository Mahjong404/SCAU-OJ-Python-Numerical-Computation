import { readFile } from 'node:fs/promises';
import path from 'node:path';

const [targetId, directory] = process.argv.slice(2);
const proxy = process.env.CDP_PROXY_URL;
if (!targetId || !directory || !proxy) {
  console.error('Set CDP_PROXY_URL, then run: node tools/submit_solution.mjs <mainMenu-targetId> <problem-directory>');
  process.exit(1);
}
const problem = JSON.parse(await readFile(path.join(directory, 'problem.json'), 'utf8'));
const source = await readFile(path.join(directory, 'main.cpp'), 'utf8');
const base = new URL('.', problem.sourceUrl).href;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function evaluate(code) {
  const response = await fetch(`${proxy}/eval?target=${encodeURIComponent(targetId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: code,
  });
  const result = await response.json();
  if (result.error) throw new Error('Browser evaluation failed');
  return result.value;
}

const documentExpression = "document.querySelector('frame[name=right],iframe[name=right]').contentDocument";
async function waitForPage() {
  for (let attempt = 0; attempt < 12; ++attempt) {
    await sleep(5000);
    if (await evaluate(`var d=${documentExpression};String(!!d?.body&&d.readyState==='complete')`) === 'true') return;
  }
  throw new Error('OJ page did not finish loading; inspect the browser before retrying.');
}

async function navigate(url) {
  await evaluate(`${documentExpression}.location.href=${JSON.stringify(url)};'OK'`);
  await waitForPage();
}

await navigate(`${base}common_solution_listAllRecent_PUBLIC.html`);
const baseline = Number(await evaluate(`var d=${documentExpression};if(!Array.from(d.querySelectorAll('th')).some(t=>t.innerText.trim()==='提交编号'))throw new Error('Submission list did not load');String(Math.max(0,...Array.from(d.querySelectorAll('tr')).filter(r=>r.children.length===9).map(r=>Number(r.children[0].innerText.trim())||0)))`));
await navigate(`${base}common_ojTreeNode_listProblemNodes_PUBLIC.html?pid=${problem.experimentPid}`);
await evaluate(`var d=${documentExpression};var link=Array.from(d.querySelectorAll('a')).find(a=>new URL(a.href).searchParams.get('problemId')===${JSON.stringify(problem.problemId)});if(!link)throw new Error('Problem link missing');link.click();'OK'`);
await waitForPage();
await evaluate(`var d=${documentExpression};var button=Array.from(d.querySelectorAll('input')).find(e=>e.value==='提交');if(!button)throw new Error('Submit button missing');button.click();'OK'`);
await waitForPage();
await evaluate(`var d=${documentExpression};var form=d.querySelector('#areaSource')?.form;if(!form||form.querySelector('[name="problem.id"]').value!==${JSON.stringify(problem.problemId)})throw new Error('Unexpected problem form');var language=form.querySelector('select');var option=Array.from(language.options).find(o=>o.text.trim()==='G++');if(!option)throw new Error('G++ unavailable');language.value=option.value;var source=form.querySelector('#areaSource');source.value=${JSON.stringify(source)};source.dispatchEvent(new Event('input',{bubbles:true}));form.querySelector('input[type=submit]').click();'SUBMITTED'`);

let result;
for (let attempt = 0; attempt < 12; ++attempt) {
  await sleep(5000);
  const value = await evaluate(`var d=${documentExpression};JSON.stringify(Array.from(d.querySelectorAll('tr')).filter(r=>r.children.length===9&&Number(r.children[0].innerText.trim())>${baseline}&&r.children[3].innerText.trim()===${JSON.stringify(problem.problemId)}).map(r=>({submissionId:r.children[0].innerText.trim(),verdict:r.children[4].innerText.trim(),codeUrl:r.querySelector('a[href*="common_solution_viewCode"]')?.href})))`);
  const candidates = JSON.parse(value);
  for (const candidate of candidates) {
    if (!candidate.codeUrl || !candidate.verdict || /等待|评判中|队列|Pending|Running|Judging/i.test(candidate.verdict)) continue;
    await navigate(candidate.codeUrl);
    const verified = await evaluate(`var d=${documentExpression};String(Array.from(d.querySelectorAll('pre')).some(p=>p.textContent.replace(/\\r/g,'').trim()===${JSON.stringify(source.replace(/\r/g, '').trim())}))`);
    if (verified === 'true') {
      result = { problemId: problem.problemId, submissionId: candidate.submissionId, verdict: candidate.verdict, sourceVerified: true };
      break;
    }
  }
  if (result) break;
  await navigate(`${base}common_solution_listAllRecent_PUBLIC.html`);
}
if (!result) throw new Error('Submission sent, but its verdict could not be verified. Inspect OJ before submitting again.');
console.log(JSON.stringify(result));
if (!/^(通过|Accepted)$/.test(result.verdict)) process.exitCode = 2;
