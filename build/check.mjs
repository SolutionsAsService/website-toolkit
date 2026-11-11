// Measures every part, every template and the site. Writes build/checks.json, which the next build publishes.
// Run: npm run all   (build, check, build again).  Every probe first runs on a fixture built to fail it.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { ROOT, loadAll } from './lib.mjs';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch {
  console.error('The check needs Playwright: run `npm install` (it is a devDependency), then `npx playwright install chromium` if no browser is present.');
  process.exit(3);
}

const SITE = path.join(ROOT, 'site');
const FIX = path.join(ROOT, 'build', 'fixtures');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.txt': 'text/plain' };
const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  const base = u.startsWith('/__fixtures/') ? FIX : SITE;
  if (u.startsWith('/__fixtures/')) u = u.slice('/__fixtures'.length);
  let f = path.join(base, u.endsWith('/') ? u + 'index.html' : u);
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end('404'); }
  res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(0);
const B = `http://127.0.0.1:${server.address().port}/`;

const { themes, parts, templates } = loadAll();
const WIDTHS = [375, 768, 1280];
const THEMES = Object.keys(themes);
const PROBES = ['no sideways scroll', 'every form field has a label', 'every stat has a source line', 'list markers at text contrast', 'no target smaller than 24 px with another target within 24 px (links inside running text exempt)', 'after a real Tab press, every focused element shows an outline of 2 px or more at 3:1 contrast against what lies just outside each of its sides, or a two-tone ring (an unshifted, unblurred band) whose tones differ by 9:1', 'text contrast of 4.5:1, or 3:1 for large text, against the nearest opaque background'];
const results = [];
const rec = (probe, pass, detail) => { results.push({ probe, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${probe}  ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`); };

// ------------------------------------------------------------------ probes (run inside the page)
function pageProbes() {
  const out = [];
  if (document.documentElement.scrollWidth - innerWidth > 0) out.push(`overflow +${document.documentElement.scrollWidth - innerWidth}px`);
  for (const f of document.querySelectorAll('input:not([type=hidden]), textarea, select')) {
    const named = (f.labels && f.labels.length) || f.getAttribute('aria-label') || f.getAttribute('aria-labelledby');
    if (!named) out.push(`unlabelled ${f.tagName.toLowerCase()}[name=${f.name}]`);
  }
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const targets = [...document.querySelectorAll('a[href], button, input, textarea, select, summary')].filter(vis);
  const ctr = e => { const r = e.getBoundingClientRect(); return { e, x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }; };
  const all = targets.map(ctr);
  for (const a of all) {
    if (a.w >= 24 && a.h >= 24) continue;
    const inline = a.e.tagName === 'A' && a.e.closest('p, li, dd, address, td, figcaption') && getComputedStyle(a.e).display === 'inline';
    if (inline) continue;
    if (all.some(b => b !== a && Math.hypot(a.x - b.x, a.y - b.y) < 24)) out.push(`small target ${a.e.tagName.toLowerCase()} ${Math.round(a.w)}x${Math.round(a.h)} "${(a.e.textContent || '').trim().slice(0, 16)}"`);
  }
  for (const st of document.querySelectorAll('[data-slot~="stat"]')) if (!(st.querySelector('small') && st.querySelector('small').textContent.trim())) out.push(`stat without a source line "${st.textContent.trim().slice(0, 20)}"`);
  // list markers are text too (numbered steps); measure their colour against the item's background
  for (const li of document.querySelectorAll('ol > li, ul > li')) {
    if (!vis(li) || getComputedStyle(li).listStyleType === 'none' || getComputedStyle(li).display !== 'list-item') continue;
    li.dataset.__marker = getComputedStyle(li, '::marker').color;
  }
  // contrast
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = x => { x /= 255; return x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
  const mix = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const bgOf = el => {
    const stack = [];
    for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0) { stack.push(c); if (c.a >= 1) break; } }
    let bg = { r: 255, g: 255, b: 255, a: 1 };
    for (const c of stack.reverse()) bg = mix(c, bg);
    return bg;
  };
  const opac = el => { let o = 1; for (let e = el; e; e = e.parentElement) o *= +getComputedStyle(e).opacity; return o; };
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement;
    if (!vis(el) || el.closest('[aria-hidden="true"], :disabled') || seen.has(el)) continue; // WCAG 1.4.3 exempts inactive controls
    seen.add(el);
    const cs = getComputedStyle(el);
    const bg = bgOf(el);
    const fg0 = parse(cs.color); if (!fg0) continue;
    const fg = mix({ ...fg0, a: fg0.a * opac(el) }, bg);
    const [L1, L2] = [lum(fg), lum(bg)].sort((x, y) => y - x);
    const ratio = (L1 + .05) / (L2 + .05);
    const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
    const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
    if (ratio < need) out.push(`contrast ${ratio.toFixed(2)} < ${need} "${n.textContent.trim().slice(0, 24)}"`);
  }
  for (const li of document.querySelectorAll('[data-__marker]')) {
    const mc = parse(li.dataset.__marker); delete li.dataset.__marker; if (!mc) continue;
    const bg = bgOf(li); const fg = mix(mc, bg);
    const [L1, L2] = [lum(fg), lum(bg)].sort((x, y) => y - x);
    const r = (L1 + .05) / (L2 + .05);
    const lf = parseFloat(getComputedStyle(li, '::marker').fontSize), lb = +getComputedStyle(li, '::marker').fontWeight >= 700;
    const ln = lf >= 24 || (lb && lf >= 18.66) ? 3 : 4.5;
    if (r < ln) out.push(`contrast ${r.toFixed(2)} < ${ln} (list marker) "${li.textContent.trim().slice(0, 20)}"`);
  }
  return out;
}

const RING = `(() => {
  const parse = c => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = x => { x /= 255; return x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
  const mix = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const bgOf = el => { const st = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0) { st.push(c); if (c.a >= 1) break; } } let bg = { r: 255, g: 255, b: 255, a: 1 }; for (const c of st.reverse()) bg = mix(c, bg); return bg; };
  // the ring is judged against what is painted just outside each of its four sides; the worst side counts
  window.__ring = e => {
    const cs = getComputedStyle(e); const oc = parse(cs.outlineColor); if (!oc) return 0;
    const r = e.getBoundingClientRect(), d = parseFloat(cs.outlineOffset || 0) + parseFloat(cs.outlineWidth || 0) + 2;
    const pts = [[r.left - d, r.top + r.height / 2], [r.right + d, r.top + r.height / 2], [r.left + r.width / 2, r.top - d], [r.left + r.width / 2, r.bottom + d]];
    // a two-tone ring (outline plus a box-shadow band of a colour 3:1 away from it) is visible on any background
    // a two-tone ring: a box-shadow band with no offset, no blur and not inset, whose colour is 9:1 from the outline (WCAG technique C40)
    const sh = (cs.boxShadow || '').match(/(rgba?\\([^)]+\\))\\s+(-?[\\d.]+)px\\s+(-?[\\d.]+)px\\s+([\\d.]+)px\\s+([\\d.]+)px(\\s+inset)?/);
    if (sh && +sh[2] === 0 && +sh[3] === 0 && +sh[4] === 0 && +sh[5] >= 1 && !sh[6]) {
      const sc = parse(sh[1]);
      if (sc && sc.a >= 1) { const [a, b] = [lum(oc), lum(sc)].sort((x, y) => y - x); if ((a + .05) / (b + .05) >= 9) return 99; }
    }
    let worst = Infinity;
    for (const [x, y] of pts) {
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue; // off-screen: nothing painted there
      const under = (document.elementsFromPoint(x, y) || []).find(u => u !== e && !e.contains(u)) || e.parentElement || e; // ancestors count: they are what lies behind
      const bg = bgOf(under); const [a, b] = [lum(mix(oc, bg)), lum(bg)].sort((x, y) => y - x);
      worst = Math.min(worst, (a + .05) / (b + .05));
    }
    return worst === Infinity ? 0 : worst; // no side could be sampled: fail rather than pass
  };
})()`;
async function focusProbe(p, cap = 30) {
  const out = [];
  const n = await p.evaluate(() => document.querySelectorAll('a[href], button, input, textarea, select, summary, iframe').length);
  await p.evaluate(RING);
  await p.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
  for (let i = 0; i < Math.min(n, cap); i++) {
    await p.keyboard.press('Tab');
    const r = await p.evaluate(() => {
      const e = document.activeElement; if (!e || e === document.body) return null;
      // Chromium draws no ring on a focused iframe (measured). Part preview frames are skipped below because their contents
      // are probed as parts; any other focusable iframe is reported as having no visible focus.
      // the ring may be drawn by a close ancestor through :focus-within (a tile whose link is stretched over it)
      let ringEl = e;
      for (let up = e, i = 0; up && i < 3; up = up.parentElement, i++) if (getComputedStyle(up).outlineStyle !== 'none' && up.matches(':focus-within')) { ringEl = up; break; }
      const cs = getComputedStyle(ringEl);
      return { preview: e.matches('iframe[data-preview], .piece-win iframe, .twin iframe'), tag: e.tagName.toLowerCase(), text: (e.textContent || e.name || '').trim().slice(0, 16), style: cs.outlineStyle, width: parseFloat(cs.outlineWidth), fv: e.matches(':focus-visible'), ring: window.__ring(ringEl) };
    });
    if (!r) break;
    if (r.tag === 'iframe' && r.preview) continue; // focus has moved into a part preview frame; its contents are probed as parts
    if (!r.fv || r.style === 'none' || r.width < 2) out.push(`no visible focus on ${r.tag} "${r.text}" (${r.style} ${r.width}px)`);
    else if (r.ring < 3) out.push(`focus ring ${r.ring.toFixed(2)}:1 < 3 on ${r.tag} "${r.text}"`);
  }
  return out;
}

const browser = await chromium.launch();
async function open(url, w, h = 900, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce', ...opts });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  await p.route(/openstreetmap|fonts\.(googleapis|gstatic)/, r => r.abort());
  await p.goto(url, { waitUntil: 'load' });
  return { p, ctx, errors };
}
const applyTheme = (p, t) => p.evaluate(th => { for (const [k, v] of Object.entries(th)) if (k.startsWith('--')) document.documentElement.style.setProperty(k, v); }, t);

// ------------------------------------------------------------------ instrument check
{
  const { p, ctx } = await open(B + '__fixtures/bad-part.html', 375, 812);
  const fails = await p.evaluate(pageProbes);
  const focus = await focusProbe(p);
  const kinds = ['overflow', 'unlabelled', 'small target', 'contrast', 'stat without'].map(k => fails.some(f => f.startsWith(k)));
  const markerBranch = fails.some(f => f.includes('(list marker)'));
  const dropFails = focus.some(f => f.includes('"Drop"')), tonesFail = focus.some(f => f.includes('"Tones"')), iframeFails = focus.some(f => f.includes('on iframe'));
  const ringBranch = focus.some(f => f.startsWith('focus ring')), noneBranch = focus.some(f => f.startsWith('no visible focus'));
  const ok = kinds.every(Boolean) && ringBranch && noneBranch && markerBranch && dropFails && tonesFail && iframeFails;
  rec('instrument: the failing fixture fails every probe', ok, { overflow: kinds[0], label: kinds[1], target: kinds[2], contrast: kinds[3], statSource: kinds[4], focusNone: noneBranch, focusRing: ringBranch, marker: markerBranch, dropShadowNotTwoTone: dropFails, lowRatioTones: tonesFail, focusableIframe: iframeFails });
  await ctx.close();
  if (!ok) { console.log('A probe passed its failing fixture; aborting.'); process.exit(2); }
}

// ------------------------------------------------------------------ every part x width x theme
const partResults = {};
for (const part of parts) {
  const failures = [];
  for (const w of WIDTHS) for (const t of THEMES) {
    const { p, ctx, errors } = await open(B + `preview/${part.id}.html`, w);
    await applyTheme(p, themes[t]);
    const f = await p.evaluate(pageProbes);
    f.push(...await focusProbe(p));
    f.push(...errors.map(e => `script error ${e}`));
    f.forEach(x => failures.push(`${w}px ${t}: ${x}`));
    await ctx.close();
  }
  partResults[part.id] = { pass: failures.length === 0, failures: [...new Set(failures)] };
}
const passing = Object.values(partResults).filter(r => r.pass).length;
rec(`parts pass every probe at ${WIDTHS.join('/')} in ${THEMES.length} themes`, passing === parts.length, passing === parts.length ? `${passing}/${parts.length}` : Object.entries(partResults).filter(([, r]) => !r.pass).map(([id, r]) => `${id}: ${r.failures.slice(0, 3).join('; ')}`));

// ------------------------------------------------------------------ templates
{
  const bad = [];
  for (const t of templates) for (const w of [375, 1280]) {
    const { p, ctx } = await open(B + `templates/${t.id}.html`, w);
    (await p.evaluate(pageProbes)).forEach(f => bad.push(`${t.id} ${w}: ${f}`));
    const dead = await p.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => h.length > 1 && !document.getElementById(h.slice(1))));
    dead.forEach(h => bad.push(`${t.id} ${w}: link ${h} has no target on the page`));
    const lang = await p.evaluate(() => document.documentElement.lang);
    if (lang !== t.lang) bad.push(`${t.id}: lang ${lang} ≠ ${t.lang}`);
    await ctx.close();
  }
  rec('templates pass the probes at 375 and 1280, every in-page link has a target, and lang is right', bad.length === 0, bad.length ? bad.slice(0, 6) : `${templates.length} templates`);
}

// ------------------------------------------------------------------ the site itself
const sitePages = [];
(function walk(d, rel = '') { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) { if (!['preview', 'raw', 'templates'].includes(f) || f === 'templates') walk(p, rel + f + '/'); } else if (f.endsWith('.html')) sitePages.push(rel + f); } })(SITE);
const ownPages = sitePages.filter(p => !/^templates\/(?!index)/.test(p));
{
  const broken = [];
  for (const pg of sitePages) {
    const html = fs.readFileSync(path.join(SITE, pg), 'utf8');
    for (const m of html.matchAll(/href="([^"]*)"/g)) {
      const href = m[1].split('#')[0].split('?')[0];
      if (!href || /^[a-z]+:/i.test(href) || href.startsWith('/')) continue; // external, or a sample site-root link inside a part
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(pg), href));
      if (!fs.existsSync(path.join(SITE, target))) broken.push(`${pg} -> ${m[1]}`);
    }
  }
  rec('internal links resolve', broken.length === 0, broken.length ? broken.slice(0, 6) : `${sitePages.length} pages`);
}
for (const w of [1280, 375]) {
  const bad = [];
  for (const pg of ownPages) {
    const { p, ctx, errors } = await open(B + pg, w, 812);
    const o = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (o > 0) bad.push(`${pg} +${o}px`);
    (await p.evaluate(pageProbes)).filter(f => f.startsWith('contrast')).forEach(f => bad.push(`${pg}: ${f}`));
    if (w === 1280) (await focusProbe(p, 160)).forEach(f => bad.push(`${pg}: ${f}`));
    errors.forEach(e => bad.push(`${pg}: ${e}`));
    await ctx.close();
  }
  rec(`site pages: no sideways scroll, no script error, text and list-marker contrast${w === 1280 ? ', focus ring 3:1 on every focusable element' : ''} at ${w}px`, bad.length === 0, bad.length ? bad : `${ownPages.length} pages`);
}
{
  const bad = [];
  for (const mode of ['prefers-contrast', 'switch']) for (const pg of ownPages) {
    const { p, ctx } = await open(B + pg, 1280, 812, mode === 'prefers-contrast' ? { contrast: 'more' } : {});
    if (mode === 'switch') { await p.evaluate(() => { document.documentElement.dataset.calm = ''; }); }
    (await p.evaluate(pageProbes)).filter(f => f.startsWith('contrast')).forEach(f => bad.push(`${mode} ${pg}: ${f}`));
    if (pg === 'index.html') (await focusProbe(p, 60)).forEach(f => bad.push(`${mode} ${pg}: ${f}`));
    await ctx.close();
  }
  rec('calm view (prefers-contrast: more, and the Calm switch): text, marker and landing focus contrast hold on every site page', bad.length === 0, bad.length ? bad.slice(0, 8) : `${ownPages.length} pages x 2 modes`);
}
for (const [w, h] of [[1280, 800], [375, 812]]) {
  const { p, ctx } = await open(B + 'index.html', w, h);
  await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const parts = ['.hero h1', '.sprue', '.themes', '.assembly'].map(s => document.querySelector(s).getBoundingClientRect());
    const pieces = [...document.querySelectorAll('.piece')].filter(e => getComputedStyle(e).display !== 'none');
    const groups = new Set(pieces.map(e => e.closest('.runner').dataset.group));
    return { bottom: Math.round(Math.max(...parts.map(b => b.bottom))), right: Math.round(Math.max(...parts.map(b => b.right))), piecesShown: pieces.length, groupsShown: groups.size, assemblyLinks: document.querySelectorAll('.assembly a').length };
  });
  rec(`first screen at ${w}x${h}: sprue, theme and view switches, and the five doors complete above the fold; every group shown`, r.bottom <= h && r.right <= w && r.groupsShown === 7 && r.assemblyLinks === 5, r);
  await ctx.close();
}
{
  const { p, ctx } = await open(B + 'index.html', 1280, 800);
  await p.waitForTimeout(500);
  const before = await p.evaluate(() => getComputedStyle(document.querySelector('.piece-win iframe').contentDocument.documentElement).getPropertyValue('--sr-accent').trim() || 'default');
  await p.click('button[data-theme="cobalt"]');
  await p.waitForTimeout(300);
  const after = await p.evaluate(() => [...document.querySelectorAll('.piece-win iframe')].map(f => f.contentDocument.documentElement.style.getPropertyValue('--sr-paper')));
  const kitBad = [];
  for (const k of Object.keys(themes)) {
    await p.click(`button[data-theme="${k}"]`); await p.waitForTimeout(350);
    (await p.evaluate(pageProbes)).filter(f => f.startsWith('contrast')).forEach(f => kitBad.push(`${k}: ${f}`));
  }
  rec('landing chrome keeps text contrast in every theme colourway', kitBad.length === 0, kitBad.length ? kitBad.slice(0, 6) : `${Object.keys(themes).length} colourways`);
  rec('landing theme switch re-themes every miniature', after.length === parts.length && after.every(v => v === themes.cobalt['--sr-paper']), { before, themed: after.filter(v => v === themes.cobalt['--sr-paper']).length, of: after.length });
  await ctx.close();
}
{
  const { p, ctx } = await open(B + 'index.html', 1280, 800);
  await p.waitForTimeout(600);
  const count = () => p.evaluate(() => [...document.querySelectorAll('.piece-win iframe')].map(f => f.contentDocument && f.contentDocument.querySelectorAll('[data-xr]').length > 0));
  await p.click('button[data-view="bare"]'); await p.waitForTimeout(300);
  const on = await count();
  await p.click('button[data-view="built"]'); await p.waitForTimeout(300);
  const off = await count();
  rec('landing Bare view X-rays every miniature, and Built restores them', on.filter(Boolean).length === parts.length && off.filter(Boolean).length === 0, { bare: on.filter(Boolean).length, builtAgain: off.filter(Boolean).length, of: parts.length });
  await ctx.close();
}
{
  const { p, ctx } = await open(B + 'sandbox.html#t=lagos-event', 1280, 900);
  await p.waitForTimeout(500);
  const a = await p.evaluate(() => ({ same: document.querySelector('[data-preview]').srcdoc === document.querySelector('#sb-code').value, n: document.querySelectorAll('#sb-stack li').length }));
  await p.check('.sb-main [data-xray]');
  await p.waitForTimeout(200);
  const b = await p.evaluate(() => ({ previewChanged: document.querySelector('[data-preview]').srcdoc !== document.querySelector('#sb-code').value, codeHasXray: /data-xr/.test(document.querySelector('#sb-code').value) }));
  await p.uncheck('.sb-main [data-xray]');
  await p.click('[data-preset="riso"]');
  await p.waitForTimeout(200);
  const c = await p.evaluate(() => ({ same: document.querySelector('[data-preview]').srcdoc === document.querySelector('#sb-code').value, riso: document.querySelector('#sb-code').value.includes('--sr-paper: #ffd6e8;') }));
  rec('sandbox: preview equals the copied page; X-ray changes the preview only; tokens rewrite the page', a.same && a.n === 8 && b.previewChanged && !b.codeHasXray && c.same && c.riso, { a, b, c });
  await ctx.close();
}
{
  const reg = JSON.parse(fs.readFileSync(path.join(SITE, 'registry.json'), 'utf8'));
  const bad = reg.parts.filter(p => crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, 'parts', `${p.id}.html`))).digest('hex') !== p.sha256 || !fs.readFileSync(path.join(SITE, p.raw)).equals(fs.readFileSync(path.join(ROOT, 'parts', `${p.id}.html`)))).map(p => p.id);
  rec('registry: every sha256 matches the source in parts/, and every raw file equals its source', bad.length === 0 && reg.parts.length === parts.length, bad.length ? bad : `${reg.parts.length} parts`);
}

await browser.close();
server.close();
const out = { ran: new Date().toISOString(), widths: WIDTHS, themes: THEMES, probes: PROBES, parts: partResults, site: results };
fs.writeFileSync(path.join(ROOT, 'build', 'checks.json'), JSON.stringify(out, null, 2));
const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed; ${passing}/${parts.length} parts pass. Rebuild to publish: npm run build`);
process.exit(failed.length ? 1 : 0);
