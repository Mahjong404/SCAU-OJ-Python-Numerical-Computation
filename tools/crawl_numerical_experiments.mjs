import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const targetId = process.argv[2];
if (!targetId) {
  console.error('Usage: node tools/crawl_numerical_experiments.mjs <mainMenu-targetId>');
  process.exit(1);
}

const base = 'https://acm.scau.edu.cn/uoj8000';
const proxy = 'http://127.0.0.1:3456';
const outputRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const experiments = [
  { name: '数值计算实验1.1', directory: 'Experiment 1.1', pid: 1452 },
  { name: '数值计算实验1.2', directory: 'Experiment 1.2', pid: 1501 },
  { name: '数值计算实验2.1', directory: 'Experiment 2.1', pid: 1503 },
  { name: '数值计算实验2.2', directory: 'Experiment 2.2', pid: 1505 },
  { name: '数值计算实验3.1', directory: 'Experiment 3.1', pid: 1507 },
  { name: '数值计算实验3.2', directory: 'Experiment 3.2', pid: 1509 },
  { name: '数值计算实验4', directory: 'Experiment 4', pid: 1512 },
  { name: '数值计算实验5', directory: 'Experiment 5', pid: 1514 },
  { name: '数值计算实验6', directory: 'Experiment 6', pid: 1516 },
];
const problemDirectoryTitles = {
  18957: 'Derivative of Natural Logarithm ln(x)',
  18991: 'Harmonic Series Sum',
  18996: 'Sine Function Value',
  18997: 'Cosine Function Value',
  18998: 'Logarithm Function ln(x)',
  18999: 'Exponential Function exp(x)',
  19000: 'Bisection Method for Nonlinear Equation',
  19001: 'Golden Section Search for Function Minimum',
  19020: 'Gauss-Jordan Elimination with Column Pivoting',
};
const sectionNames = ['Description', '输入格式', '输出格式', '输入样例', '输出样例', '提示'];

async function evaluate(js) {
  const response = await fetch(`${proxy}/eval?target=${encodeURIComponent(targetId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: js,
  });
  const result = await response.json();
  if (result.error) throw new Error(`CDP eval failed: ${result.error}`);
  if (typeof result.value !== 'string') throw new Error(`Unexpected CDP response: ${JSON.stringify(result)}`);
  return result.value;
}

async function navigateRight(url) {
  const js = `var f=document.querySelector('frame[name=right],iframe[name=right]');if(!f)throw new Error('OJ right frame missing');f.contentWindow.location.href=${JSON.stringify(url)};'OK'`;
  await evaluate(js);
  await delay(5000);
}

function decodePairs(raw) {
  return raw.split('\n').filter(Boolean).map(line => {
    const [left, right] = line.split('|||');
    return [decodeURIComponent(left || ''), decodeURIComponent(right || '')];
  });
}

async function readProblemLinks() {
  const raw = await evaluate(`var f=document.querySelector('frame[name=right],iframe[name=right]');var d=f.contentDocument;Array.from(d.querySelectorAll('a')).filter(a=>a.href.includes('problemId=')).map(a=>encodeURIComponent(a.innerText.trim().replace(/\\s+/g,' '))+'|||'+encodeURIComponent(a.href)).join('\\n')`);
  return decodePairs(raw).map(([title, url]) => ({ title, url }));
}

async function readStatement() {
  const raw = await evaluate(`var f=document.querySelector('frame[name=right],iframe[name=right]');var d=f.contentDocument;var ps=Array.from(d.querySelectorAll('pre'));var sections=ps.map((p,i)=>'SEC|||'+i+'|||'+encodeURIComponent(p.innerHTML)+'|||'+encodeURIComponent(p.innerText));var imgs=Array.from(d.querySelectorAll('img')).filter(i=>i.src&&!/iconHelp|logo/i.test(i.src)).map(i=>encodeURIComponent(i.src));sections.join('\\n')+'\\nIMAGES|||'+imgs.join('|||')`);
  const sections = [];
  let imageUrls = [];
  for (const line of raw.split('\n')) {
    if (line.startsWith('SEC|||')) {
      const [, index, html, text] = line.split('|||');
      const n = Number(index);
      sections.push({ name: sectionNames[n] || `Section ${n + 1}`, html: decodeURIComponent(html || ''), text: decodeURIComponent(text || '') });
    } else if (line.startsWith('IMAGES|||')) {
      imageUrls = line.slice('IMAGES|||'.length).split('|||').filter(Boolean).map(decodeURIComponent);
    }
  }
  return { sections, imageUrls };
}

function canonicalUrl(url, problemId) {
  const parsed = new URL(url);
  return `${parsed.origin}${parsed.pathname}?problemId=${encodeURIComponent(problemId)}`;
}

for (const experiment of experiments) {
  console.log(`\n=== ${experiment.name} (pid ${experiment.pid}) ===`);
  const listUrl = `${base}/common_ojTreeNode_listProblemNodes_PUBLIC.html?pid=${experiment.pid}`;
  await navigateRight(listUrl);
  const links = await readProblemLinks();
  console.log(`Found ${links.length} problem(s)`);

  for (const link of links) {
    const parsed = new URL(link.url);
    const problemId = parsed.searchParams.get('problemId');
    if (!problemId) continue;

    console.log(`  ${problemId} ${link.title}`);
    await navigateRight(link.url);
    const { sections, imageUrls } = await readStatement();
    const problemUrl = canonicalUrl(link.url, problemId);
    const directoryTitle = problemDirectoryTitles[problemId] || 'Problem';
    const problemDir = path.join(outputRoot, experiment.directory, `${problemId} ${directoryTitle}`);
    await mkdir(problemDir, { recursive: true });

    const record = {
      problemId,
      title: link.title,
      experiment: experiment.name,
      experimentPid: experiment.pid,
      sourceUrl: problemUrl,
      sections,
      imageUrls,
    };
    await writeFile(path.join(problemDir, 'problem.json'), `${JSON.stringify(record, null, 2)}\n`, 'utf8');

    const markdown = [
      `# ${problemId} ${link.title}`,
      '',
      `- 实验：${experiment.name}`,
      `- OJ 来源：[SCAU OJ](${problemUrl})`,
      '',
      ...sections.flatMap(section => [`## ${section.name}`, '', section.text, '']),
      ...(imageUrls.length ? ['## 题目图片', '', ...imageUrls.map(url => `- ${url}`), ''] : []),
    ].join('\n');
    await writeFile(path.join(problemDir, 'problem.md'), markdown, 'utf8');
  }
}

console.log('\nCrawl complete.');
