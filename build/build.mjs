// Builds the site into site/ from parts/, templates/, tokens.css and themes.json.  Run: npm run build
// If build/checks.json exists (written by npm run check) its results are published on part pages and in registry.json.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, GROUPS, loadAll, tokensFor, documentFor, partBody, templateBodies, esc } from './lib.mjs';

const OUT = path.join(ROOT, 'site');
const SITE_URL = 'https://website-toolkit.shadw.app';
const { tokensCss, themes, parts, byId, templates } = loadAll();
const checksFile = path.join(ROOT, 'build', 'checks.json');
const checks = fs.existsSync(checksFile) ? JSON.parse(fs.readFileSync(checksFile, 'utf8')) : null;
const N = parts.length;

fs.rmSync(OUT, { recursive: true, force: true });
for (const d of ['assets', 'parts', 'templates', 'raw/parts', 'preview']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
for (const f of ['site.css', 'site.js', 'sandbox.js']) fs.copyFileSync(path.join(ROOT, 'src', f), path.join(OUT, 'assets', f));
fs.copyFileSync(path.join(ROOT, 'src', 'favicon.svg'), path.join(OUT, 'favicon.svg'));

// ------------------------------------------------------------------ raw files and previews (the agent door)
fs.copyFileSync(path.join(ROOT, 'tokens.css'), path.join(OUT, 'raw', 'tokens.css'));
fs.copyFileSync(path.join(ROOT, 'themes.json'), path.join(OUT, 'raw', 'themes.json'));
for (const p of parts) {
  fs.writeFileSync(path.join(OUT, 'raw', 'parts', `${p.id}.html`), p.source);
  // a standalone page per part: what the check renders and what the part page frames
  fs.writeFileSync(path.join(OUT, 'preview', `${p.id}.html`), documentFor({ title: `${p.code} ${p.title}`, tokens: tokensFor(tokensCss, themes, null), bodies: [partBody(p)] }));
}

// ------------------------------------------------------------------ shell
const NAV = [['index.html', 'Kit'], ['start.html', 'Start'], ['parts/index.html', 'Parts'], ['sandbox.html', 'Sandbox'], ['templates/index.html', 'Templates'], ['agents.html', 'For agents']];
function page({ file, title, desc, body, current, depth = 0, scripts = ['site.js'], data = null }) {
  const up = '../'.repeat(depth);
  const nav = NAV.map(([href, label]) => `<a href="${up}${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<link rel="icon" href="${up}favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/json" href="${up}registry.json" title="Part registry (JSON)">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=IBM+Plex+Mono:wght@400;600&display=swap">
<link rel="stylesheet" href="${up}assets/site.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <a class="brand" href="${up}index.html"><svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true"><use href="${up}favicon.svg#k"/></svg><span>website-toolkit</span></a>
  <div class="tools"><nav aria-label="Main">${nav}</nav><button type="button" class="calm" aria-pressed="false" aria-describedby="calm-desc">Calm</button><span id="calm-desc" class="sr">Calm view: a pale frame and ink type on every page of this site; controls stay blue and the parts keep the theme you chose. Remembered in this browser.</span></div>
</header>
<main id="main">
${body}
</main>
<footer class="foot">
  <p>${N} parts, ${templates.length} templates, ${Object.keys(themes).length} themes. Plain HTML and CSS, no framework, MIT licence. <a href="${up}agents.html">Registry for agents</a> · <a href="https://github.com/SolutionsAsService/website-toolkit">Source</a></p>
</footer>
${data ? `<script type="application/json" id="sr-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>` : ''}
${scripts.map(s => `<script src="${up}assets/${s}" defer></script>`).join('\n')}
</body>
</html>
`;
  const p = path.join(OUT, file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, html);
}

// data the browser needs to assemble previews: tokens, themes, and every part body
const DATA = {
  tokens: tokensCss.trim(), themes,
  parts: parts.map(p => ({ id: p.id, code: p.code, title: p.title, group: p.group.name, body: p.body })),
};

function checkLine(p) {
  if (!checks || !checks.parts[p.id]) return '<p class="chk none">Not yet checked. Run <code>npm run check</code>.</p>';
  const c = checks.parts[p.id];
  const ok = c.pass;
  return `<div class="chk ${ok ? 'ok' : 'bad'}"><b>${ok ? 'Passes' : 'Fails'}</b> every check at ${checks.widths.join(', ')} px in ${checks.themes.length} themes.${ok ? '' : ` Failures: ${esc(c.failures.slice(0, 4).join('; '))}`}<details><summary>What was checked</summary>${esc(checks.probes.join('; '))}.</details></div>`;
}

// ------------------------------------------------------------------ landing: the sprue
{
  const runners = GROUPS.map(g => {
    const gp = parts.filter(p => p.category === g.id);
    const VW = { 'nav-bar': 700, 'divider-or': 360, 'divider-mark': 360, breadcrumb: 420 };
    return `<div class="runner" data-group="${g.letter}">
<span class="runner-tag" aria-hidden="true">${g.letter}</span>
<ul class="runner-parts" aria-label="${esc(g.name)}">${gp.map((p, i) => `<li class="piece${i ? ' piece--more' : ''}">
<a href="parts/${p.id}.html" class="piece-link"><b>${p.code}</b> ${esc(p.title)}</a>
<span class="piece-win" aria-hidden="true"><iframe src="preview/${p.id}.html" title="" tabindex="-1" inert data-vw="${VW[p.id] || 1200}" style="width:${VW[p.id] || 1200}px" loading="${i === 0 ? 'eager' : 'lazy'}" scrolling="no"></iframe></span></li>`).join('')}</ul>
</div>`;
  }).join('');
  const themeBtns = Object.entries(themes).map(([k, t], i) => `<button type="button" class="tbtn" data-theme="${k}" aria-pressed="${i === 0}">${esc(t.label)}</button>`).join('');
  const body = `
<section class="hero">
  <div class="hero-text">
    <p class="kicker">A kit of parts for websites</p>
    <h1>${N} parts. Snap off what you need.</h1>
    <p class="lede-short">Copy-paste website parts in plain HTML and CSS.</p>
    <p class="lede">Plain HTML and CSS you can paste into any page. Every part is numbered, themed by ${Object.keys(tokensFor(tokensCss, themes, null).match(/--sr-[a-z-]+/g).reduce((a, k) => (a[k] = 1, a), {})).length} tokens, labelled for screen readers, and checked at three widths. People browse it here; agents fetch it from <a href="registry.json">registry.json</a>.</p>

  </div>
  <div class="sprue" role="group" aria-label="All ${N} parts, by group">
    <div class="sprue-bar">
      <div class="themes" role="group" aria-label="Theme every part">${themeBtns}</div>
      <div class="bare" role="group" aria-label="View every part" aria-describedby="bare-gloss"><button type="button" data-view="built" aria-pressed="true">Built</button><button type="button" data-view="bare" aria-pressed="false">Bare</button></div>

      <p class="gloss" id="bare-gloss"><b>Bare</b>: no styles<span class="gloss-long">; every element and every slot (<code>data-slot</code>, a place you fill in) labelled</span><span class="gloss-short">, parts labelled</span>.</p>
    </div>
    ${runners}
    <a class="sprue-more" href="parts/index.html">All ${N} parts →</a>
  </div>
  <ol class="assembly" aria-label="Where to go">
      <li><a href="start.html"><b>Start here</b> <span>paste your first part, step by step</span></a></li>
      <li><a href="parts/index.html"><b>Pick a part</b> <span>all ${N}, with live previews</span></a></li>
      <li><a href="sandbox.html"><b>Assemble a page</b> <span>in the sandbox and copy it</span></a></li>
      <li><a href="templates/index.html"><b>Copy a template</b> <span>${templates.length} whole pages</span></a></li>
      <li><a href="agents.html"><b>Fetch as an agent</b> <span>registry.json and llms.txt</span></a></li>
    </ol>
</section>
<section class="why">
  <div><h2>Paste it and it works</h2><p>No framework, no build, no account. Each part carries its own scoped styles, and every colour and size has a fallback, so a part works on its own and takes on your theme when <a href="raw/tokens.css">tokens.css</a> is present.</p></div>
  <div><h2>See it bare</h2><p>X-ray strips a part's styles and labels every element and every <code>data-slot</code>, the places you or an agent fill in. The sandbox shows the exact document you copy: what you see is what you paste.</p></div>
  <div><h2>Checked, with the results published</h2><p>Each part is rendered alone at ${(checks ? checks.widths : [375, 768, 1280]).join(', ')} px in every theme and checked for overflow, labels, target size, focus and contrast. ${checks ? `${Object.values(checks.parts).filter(c => c.pass).length} of ${N} pass` : 'Run the check to publish results'}; each part page says what was checked.</p></div>
</section>`;
  page({ file: 'index.html', current: 'index.html', title: 'website-toolkit: a kit of website parts for people and agents', desc: `${N} copy-paste website parts in plain HTML and CSS, with a sandbox, templates and a JSON registry for agents.`, body });
}

// ------------------------------------------------------------------ parts index and part pages
{
  const groups = GROUPS.map(g => `<section class="pgroup" data-group="${g.letter}"><h2><span class="gl">${g.letter}</span> ${esc(g.name)}</h2><ul class="pcards">${parts.filter(p => p.category === g.id).map(p => `<li><a href="${p.id}.html"><span class="pcode">${p.code}</span><b>${esc(p.title)}</b><span>${esc(p.summary)}</span></a></li>`).join('')}</ul></section>`).join('');
  page({ file: 'parts/index.html', depth: 1, current: 'parts/index.html', title: 'Parts · website-toolkit', desc: `All ${N} parts by group.`, body: `<section class="pagehead"><h1>Parts</h1><p class="lede">${N} parts in ${GROUPS.length} groups. Each page has a live preview at three widths, X-ray, the code to copy and what the part needs.</p></section>${groups}` });

  parts.forEach((p, i) => {
    const prev = parts[(i + N - 1) % N], next = parts[(i + 1) % N];
    const slots = Object.entries(p.slots).map(([k, v]) => `<tr><th scope="row"><code>${esc(k)}</code></th><td>${esc(v)}</td></tr>`).join('') || '<tr><td colspan="2">None: use as is.</td></tr>';
    const body = `
<article class="part" data-part="${p.id}">
<header class="pagehead">
  <p class="kicker"><a href="index.html">Parts</a> · ${p.group.letter} ${esc(p.group.name)}</p>
  <h1><span class="pcode big">${p.code}</span> ${esc(p.title)}</h1>
  <p class="lede">${esc(p.summary)}</p>
  ${checkLine(p)}
</header>
<div class="stage">
  <div class="stage-bar" role="toolbar" aria-label="Preview controls">
    <div class="seg" role="group" aria-label="Width">${[375, 768, 1280].map((w, j) => `<button type="button" data-width="${w}" aria-pressed="${j === 2}">${w}</button>`).join('')}</div>
    <div class="seg" role="group" aria-label="Theme">${Object.entries(themes).map(([k, t], j) => `<button type="button" data-theme="${k}" aria-pressed="${j === 0}">${esc(t.label)}</button>`).join('')}</div>
    <label class="xray"><input type="checkbox" data-xray> X-ray <small>(no styles, elements and slots labelled)</small></label>
    <button type="button" class="btn" data-copy="#code-${p.id}">Copy code</button>
    <a class="btn ghost" href="../sandbox.html#p=${p.id}">Open in sandbox</a>
  </div>
  <div class="frame-wrap"><iframe class="frame" title="${esc(p.title)} preview" data-preview></iframe></div>
  <p class="stage-note">Previewed with <a href="../raw/tokens.css">tokens.css</a> and a three-line reset (box-sizing, body margin, image width), the same head the sandbox writes. The code below is the part alone.</p>
</div>
<div class="part-info">
  <section>
    <h2>Code</h2>
    <p class="muted">The part as one block. It works pasted alone; add <a href="../raw/tokens.css">tokens.css</a> to theme it.</p>
    <div class="code"><button type="button" class="btn copy" data-copy="#code-${p.id}">Copy</button><pre><code id="code-${p.id}">${esc(p.body)}</code></pre></div>
    <p class="muted">Raw file with its JSON header: <a href="../raw/parts/${p.id}.html">raw/parts/${p.id}.html</a> · sha256 <code class="hash">${p.sha256.slice(0, 16)}…</code></p>
  </section>
  <section>
    <h2>Slots</h2>
    <p class="muted">Elements marked <code>data-slot</code>: the places to put your own content.</p>
    <table class="data"><tbody>${slots}</tbody></table>
    <h2>Needs</h2>
    ${p.needs.length ? `<ul>${p.needs.map(n => `<li>${esc(n)}</li>`).join('')}</ul>` : '<p>Nothing. No script, no library, no key.</p>'}
    <h2>Access</h2>
    <ul>${p.a11y.map(n => `<li>${esc(n)}</li>`).join('')}</ul>
  </section>
</div>
<nav class="pn" aria-label="Other parts"><a href="${prev.id}.html">← ${prev.code} ${esc(prev.title)}</a><a href="${next.id}.html">${next.code} ${esc(next.title)} →</a></nav>
</article>`;
    page({ file: `parts/${p.id}.html`, depth: 1, current: 'parts/index.html', title: `${p.code} ${p.title} · website-toolkit`, desc: p.summary, body, data: DATA });
  });
}

// ------------------------------------------------------------------ templates
{
  const docs = templates.map(t => {
    const bodies = templateBodies(t, byId);
    const doc = documentFor({ title: t.title, lang: t.lang, tokens: tokensFor(tokensCss, themes, null), bodies });
    fs.writeFileSync(path.join(OUT, 'templates', `${t.id}.html`), doc);
    return { t, doc, bodies };
  });
  const cards = docs.map(({ t }) => `<li class="tcard"><div class="twin"><iframe src="${t.id}.html" title="${esc(t.title)} template (miniature)" tabindex="-1" loading="lazy" scrolling="no"></iframe></div>
<h2>${esc(t.title)}</h2><p>${esc(t.summary)}</p><p class="muted">${t.parts.length} parts · ${esc(t.place)} · language: ${t.lang}</p>
<p class="parts-used">${t.parts.map(r => `<a href="../parts/${r.id}.html" class="pcode">${byId[r.id].code}</a>`).join(' ')}</p>
<p class="acts"><a class="btn" href="${t.id}.html">Open the page</a> <a class="btn ghost" href="../sandbox.html#t=${t.id}">Edit in sandbox</a> <a class="btn ghost" href="${t.id}.html" download>Download</a></p></li>`).join('');
  page({ file: 'templates/index.html', depth: 1, current: 'templates/index.html', title: 'Templates · website-toolkit', desc: `${templates.length} full pages assembled from the parts.`, body: `<section class="pagehead"><h1>Templates</h1><p class="lede">Whole pages assembled from the parts, each with its own words. Open one, download it as a single HTML file, or take it into the sandbox to change it.</p></section><ul class="tgrid">${cards}</ul>` });
  DATA.templates = docs.map(({ t, bodies }) => ({ id: t.id, title: t.title, lang: t.lang, parts: t.parts.map((r, i) => ({ id: r.id, body: bodies[i] })) }));
}

// ------------------------------------------------------------------ sandbox
page({
  file: 'sandbox.html', current: 'sandbox.html', title: 'Sandbox · website-toolkit', desc: 'Assemble parts into a page, change the tokens, edit the HTML, and copy exactly what you see.',
  scripts: ['site.js', 'sandbox.js'], data: DATA,
  body: `
<section class="sandbox" aria-label="Sandbox">
  <aside class="sb-side">
    <h1>Sandbox</h1>
    <p class="muted">Stack parts, set the tokens, edit the code. The preview is the exact document you copy.</p>
    <fieldset><legend>Parts on the page</legend><ol class="sb-stack" id="sb-stack"></ol>
      <label for="sb-add">Add a part</label>
      <div class="sb-addrow"><select id="sb-add">${GROUPS.map(g => `<optgroup label="${g.letter} ${esc(g.name)}">${parts.filter(p => p.category === g.id).map(p => `<option value="${p.id}">${p.code} ${esc(p.title)}</option>`).join('')}</optgroup>`).join('')}</select><button type="button" class="btn" id="sb-addbtn">Add</button></div>
      <label for="sb-tpl">Or start from a template</label>
      <div class="sb-addrow"><select id="sb-tpl"><option value="">Choose…</option>${templates.map(t => `<option value="${t.id}">${esc(t.title)}</option>`).join('')}</select><button type="button" class="btn ghost" id="sb-tplbtn">Load</button></div>
    </fieldset>
    <fieldset><legend>Tokens</legend>
      <div class="seg" role="group" aria-label="Theme preset">${Object.entries(themes).map(([k, t], j) => `<button type="button" data-preset="${k}" aria-pressed="${j === 0}">${esc(t.label)}</button>`).join('')}</div>
      <div class="sb-tokens">
        <label>Accent <input type="color" data-token="--sr-accent"></label>
        <label>Ink <input type="color" data-token="--sr-ink"></label>
        <label>Paper <input type="color" data-token="--sr-paper"></label>
        <label>Surface <input type="color" data-token="--sr-surface"></label>
        <label class="wide">Radius <input type="range" min="0" max="28" step="1" data-token="--sr-radius" data-unit="px"> <output data-for="--sr-radius"></output></label>
        <label class="wide">Display face <select data-token="--sr-font-display"><option value='Georgia, "Times New Roman", serif'>Serif</option><option value='system-ui, -apple-system, "Segoe UI", sans-serif'>Sans</option><option value='"Courier New", ui-monospace, monospace'>Mono</option></select></label>
      </div>
      <p class="sb-contrast" id="sb-contrast" aria-live="polite"></p>
    </fieldset>
  </aside>
  <div class="sb-main">
    <div class="stage-bar" role="toolbar" aria-label="Preview controls">
      <div class="seg" role="group" aria-label="Width">${[375, 768, 1280].map((w, j) => `<button type="button" data-width="${w}" aria-pressed="${j === 2}">${w}</button>`).join('')}</div>
      <label class="xray"><input type="checkbox" data-xray> X-ray <small>(preview only)</small></label>
      <button type="button" class="btn" id="sb-copy">Copy page</button>
      <button type="button" class="btn ghost" id="sb-download">Download .html</button>
      <button type="button" class="btn ghost" id="sb-link">Copy link</button>
      <span class="sb-status" id="sb-status" role="status"></span>
    </div>
    <div class="frame-wrap"><iframe class="frame" title="Sandbox preview" data-preview></iframe></div>
    <label for="sb-code" class="sb-codelabel">The page's HTML <small>(edit freely; changing the parts or tokens above rewrites it)</small></label>
    <textarea id="sb-code" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>
  </div>
</section>`,
});

// ------------------------------------------------------------------ start here (a person's first part)
page({
  file: 'start.html', current: 'start.html', title: 'Start here · website-toolkit', desc: 'Paste your first website part into a page, in plain words.',
  body: `
<section class="pagehead"><p class="kicker">Start here</p><h1>Your first part, step by step</h1><p class="lede">You need a web page you can edit as HTML: a file on your computer, or the HTML view of your site builder. Nothing to install.</p></section>
<div class="prose">
<ol class="steps-h">
<li><h2>Pick a part</h2><p>Open <a href="parts/index.html">Parts</a> and choose one, for example the <a href="parts/contact-form.html">Contact form</a>. Each part page shows it live at phone, tablet and laptop width.</p></li>
<li><h2>Copy it</h2><p>Press <b>Copy code</b>. You get one block: a <code>&lt;style&gt;</code> part that makes it look right, and the HTML that draws it. Keep them together.</p></li>
<li><h2>Paste it into your page</h2><p>Paste the block inside your page's <code>&lt;body&gt;</code>, where you want the part to appear. The <code>&lt;body&gt;</code> is the part of the page people see. It already works: every colour and size has a built-in default.</p></li>
<li><h2>Put in your own words</h2><p>Change the text and links. The places meant for you are marked <code>data-slot</code> in the code, and the part page lists what each one is for. Leave the labels and the words in <code>aria-…</code> and <code>alt</code>: they are what screen readers say.</p></li>
<li><h2>Give it your colours (optional)</h2><p>Copy the block from <a href="raw/tokens.css">tokens.css</a> into your page's <code>&lt;head&gt;</code>, the hidden top part of the page, inside a <code>&lt;style&gt;</code>. These 15 lines are the <em>tokens</em>: one colour, size or font each. Change one and every part follows. The <a href="sandbox.html">sandbox</a> lets you try colours and copy the result.</p></li>
</ol>
<h2>Then</h2>
<p>Stack several parts into a page in the <a href="sandbox.html">sandbox</a>, or start from a whole <a href="templates/index.html">template</a>: a garden studio in Fremantle, an event in Lagos, an illustrator's portfolio in Spanish, a product launch.</p>
<p class="muted">Some parts need one more thing, said on their page under <b>Needs</b>. The forms need an address to send to (a form service or your own server); the map needs to reach openstreetmap.org.</p>
</div>`,
});

// ------------------------------------------------------------------ agents page, registry, llms.txt
const registry = {
  name: 'website-toolkit', description: 'Copy-paste website parts in plain HTML and CSS, themed by CSS custom properties.',
  homepage: SITE_URL, source: 'https://github.com/SolutionsAsService/website-toolkit', licence: 'MIT',
  format: { part: 'An HTML file: a <!--sr:part {json} --> header, then one <style> block scoped to .sr-<name>, then the markup. Elements to fill carry data-slot="<name>".', tokens: '/raw/tokens.css', themes: '/raw/themes.json' },
  checks: checks ? { ran: checks.ran, widths: checks.widths, themes: checks.themes, probes: checks.probes } : null,
  parts: parts.map(p => ({
    id: p.id, no: p.no, code: p.code, title: p.title, group: p.group.name, summary: p.summary, slots: p.slots, needs: p.needs, a11y: p.a11y,
    raw: `/raw/parts/${p.id}.html`, preview: `/preview/${p.id}.html`, page: `/parts/${p.id}.html`, bytes: p.bytes, sha256: p.sha256,
    check: checks && checks.parts[p.id] ? { pass: checks.parts[p.id].pass, failures: checks.parts[p.id].failures } : null,
  })),
  templates: templates.map(t => ({ id: t.id, title: t.title, summary: t.summary, lang: t.lang, page: `/templates/${t.id}.html`, parts: t.parts.map(r => r.id) })),
};
fs.writeFileSync(path.join(OUT, 'registry.json'), JSON.stringify(registry, null, 2));
const llms = `# website-toolkit

> ${registry.description} ${N} parts in ${GROUPS.length} groups, ${templates.length} templates, ${Object.keys(themes).length} themes. No framework, no build step, no API keys.

How to use a part:
1. Fetch ${SITE_URL}/registry.json and choose parts by id, group and summary.
2. Fetch each part's raw file (the "raw" path). Drop the <!--sr:part --> header; paste the <style> and markup into the page body.
3. Put the :root block from ${SITE_URL}/raw/tokens.css in the page head (optional; every value has a fallback). Pick a theme from /raw/themes.json to override it.
4. Fill every element marked data-slot with real content; each part's "slots" says what goes there. Keep the labels and aria attributes.
5. Honour "needs" (for example, a form endpoint).

## Parts
${parts.map(p => `- [${p.code} ${p.title}](${SITE_URL}/raw/parts/${p.id}.html): ${p.summary}`).join('\n')}

## Templates
${templates.map(t => `- [${t.title}](${SITE_URL}/templates/${t.id}.html): ${t.summary}`).join('\n')}
`;
fs.writeFileSync(path.join(OUT, 'llms.txt'), llms);
fs.writeFileSync(path.join(ROOT, 'llms.txt'), llms);

page({
  file: 'agents.html', current: 'agents.html', title: 'For agents · website-toolkit', desc: 'How an AI agent fetches and composes parts: the registry, the raw files, slots and tokens.',
  body: `
<section class="pagehead"><h1>For agents</h1><p class="lede">Everything on this site is also a file an agent can fetch. One JSON registry lists every part with its slots, needs, access notes, hash and check result.</p></section>
<div class="prose">
<h2>Endpoints</h2>
<table class="data"><tbody>
<tr><th scope="row"><a href="registry.json"><code>/registry.json</code></a></th><td>Every part and template: id, code, summary, slots, needs, a11y, raw path, sha256, check result.</td></tr>
<tr><th scope="row"><a href="llms.txt"><code>/llms.txt</code></a></th><td>The same in short Markdown, with the steps below.</td></tr>
<tr><th scope="row"><a href="raw/tokens.css"><code>/raw/tokens.css</code></a></th><td>The token block. Optional: every part has fallbacks.</td></tr>
<tr><th scope="row"><a href="raw/themes.json"><code>/raw/themes.json</code></a></th><td>${Object.keys(themes).length} token presets.</td></tr>
<tr><th scope="row"><code>/raw/parts/&lt;id&gt;.html</code></th><td>A part: JSON header, scoped style, markup.</td></tr>
<tr><th scope="row"><code>/preview/&lt;id&gt;.html</code></th><td>The part alone as a full page: what the check renders.</td></tr>
</tbody></table>
<h2>Compose a page</h2>
<ol>
<li>Read <code>registry.json</code>; pick parts by <code>group</code> and <code>summary</code>.</li>
<li>For each, fetch <code>raw</code>, verify <code>sha256</code>, and drop the <code>&lt;!--sr:part … --&gt;</code> header.</li>
<li>Put the tokens' <code>:root</code> block in the head. To theme, override its variables from <code>themes.json</code>.</li>
<li>Fill each <code>data-slot</code> element with the user's content. The part's <code>slots</code> object says what each one is.</li>
<li>Keep labels, <code>aria-*</code> and <code>alt</code>. If you change a heading level, keep the page's order (one <code>h1</code>).</li>
<li>Meet the part's <code>needs</code>, for example a form endpoint.</li>
</ol>
<h2>Example</h2>
<pre class="code"><code>curl -s ${SITE_URL}/registry.json | jq -r '.parts[] | select(.group=="Forms") | .raw'
curl -s ${SITE_URL}/raw/parts/contact-form.html</code></pre>
<h2>What the check means</h2>
<p>${checks ? `The check last ran on ${esc(checks.ran.slice(0, 10))}. It rendered each part alone at ${checks.widths.join(', ')} px in the ${checks.themes.length} themes and probed: ${esc(checks.probes.join('; '))}. ${Object.values(checks.parts).filter(c => c.pass).length} of ${N} parts passed.` : 'The check has not run for this build.'} A part's <code>check.pass</code> in the registry is that result. It is not a guarantee about your page once you change the part.</p>
</div>`,
});

page({ file: '404.html', current: '', title: 'Not found · website-toolkit', desc: 'Page not found', body: `<section class="pagehead"><h1>No part here</h1><p class="lede">Try the <a href="index.html">kit</a> or the <a href="parts/index.html">parts list</a>.</p></section>` });

fs.writeFileSync(path.join(OUT, 'build-facts.json'), JSON.stringify({ parts: N, groups: GROUPS.length, templates: templates.length, themes: Object.keys(themes).length, checked: !!checks, passing: checks ? Object.values(checks.parts).filter(c => c.pass).length : null }, null, 2));
console.log(`built ${N} parts, ${templates.length} templates${checks ? `, checks from ${checks.ran}` : ', no checks yet'}`);
