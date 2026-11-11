// website-toolkit runtime: scale miniatures, theme the sprue, and drive part-page previews (width, theme, X-ray, copy).
(() => {
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const dataEl = document.getElementById('sr-data');
  const DATA = dataEl ? JSON.parse(dataEl.textContent) : null;

  // ---------- shared with sandbox.js
  const SR = window.SR = {};
  SR.data = DATA;
  // must match build/lib.mjs documentFor() character for character
  SR.doc = ({ title, lang = 'en', tokens, bodies }) => `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
/* sr:tokens */
${tokens}
/* /sr:tokens */
*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:var(--sr-paper,#fffdf8);color:var(--sr-ink,#15132b);font-family:var(--sr-font-body,system-ui,sans-serif);line-height:var(--sr-leading,1.55)}
img{max-width:100%}
</style>
</head>
<body>
${bodies.join('\n')}
</body>
</html>
`;
  SR.tokensFor = (theme, overrides = {}) => {
    let css = DATA.tokens;
    const t = Object.assign({}, theme && DATA.themes[theme] ? DATA.themes[theme] : {}, overrides);
    for (const [k, v] of Object.entries(t)) if (k.startsWith('--')) css = css.replace(new RegExp(`(${k}:\\s*)[^;]+;`), `$1${v};`);
    return css;
  };
  SR.partBody = (p, replace = {}) => {
    let b = p.body;
    for (const [from, to] of Object.entries(replace || {})) b = b.split(from).join(to);
    return `<!-- part ${p.code} ${p.id} -->\n${b}`;
  };
  // X-ray: preview only. Drops the parts' own <style> blocks (the tokens block stays) and labels elements.
  const XRAY_CSS = `body{background:#fff!important;font:14px/1.4 ui-monospace,Menlo,monospace!important;color:#141518!important;padding:8px!important}
body script,body style{display:none!important}
body *:not(script):not(style){outline:1px dashed #e0531a;outline-offset:-1px;margin:6px!important;padding:4px!important;background:none!important;color:#141518!important;position:static!important;display:block!important;max-width:100%!important;transform:none!important;border-radius:0!important;box-shadow:none!important;width:auto!important;height:auto!important;min-height:0!important;font:inherit!important}
body svg,body img{display:inline-block!important;width:40px!important;height:30px!important;outline:1px solid #e0531a}
[data-xr]::before{content:attr(data-xr);display:inline-block;font:600 10px/1.3 ui-monospace,Menlo,monospace;background:#141518;color:#fff;padding:1px 4px;margin-right:6px}
[data-slot]{outline:2px solid #e0531a!important}
[data-slot][data-xr]::before{background:#e0531a;color:#141518}
details>*{display:block!important}`;
  const XRAY_JS = `document.querySelectorAll('body *').forEach(function(e){var t=e.tagName.toLowerCase();if(['br','path','circle','rect','use','b','em','small','span','i','strong'].indexOf(t)>-1&&!e.dataset.slot)return;e.setAttribute('data-xr',t+(e.dataset.slot?' ['+e.dataset.slot+']':''))});document.querySelectorAll('details').forEach(function(d){d.open=true});`;
  // X-ray a live document in place (used by the sprue's Bare view); returns false if it is not loaded yet
  SR.xrayLive = (doc, on) => {
    if (!doc || !doc.body) return false;
    const styles = [...doc.querySelectorAll('body style')];
    styles.forEach(s => { s.media = on ? 'not all' : ''; });
    let x = doc.getElementById('sr-xray');
    if (on && !x) { x = doc.createElement('style'); x.id = 'sr-xray'; x.textContent = XRAY_CSS; doc.head.appendChild(x); new doc.defaultView.Function(XRAY_JS)(); }
    if (!on && x) { x.remove(); doc.querySelectorAll('[data-xr]').forEach(e => e.removeAttribute('data-xr')); }
    return true;
  };
  SR.preview = (doc, xray) => {
    if (!xray) return doc;
    const [head, rest] = doc.split('</head>');
    const body = rest.replace(/<style>[\s\S]*?<\/style>/g, '');
    return `${head}<style>${XRAY_CSS}</style>\n</head>${body.replace('</body>', `<script>${XRAY_JS}<\/script>\n</body>`)}`;
  };
  // size an iframe to a chosen width inside its wrapper, scaling down to fit
  SR.fit = (frame, width, { fitHeight = true } = {}) => {
    const wrap = frame.parentElement;
    const avail = wrap.clientWidth - 28;
    const s = Math.min(1, avail / width);
    frame.style.width = width + 'px';
    frame.style.transform = s < 1 ? `scale(${s})` : '';
    const setH = () => {
      try {
        const h = fitHeight ? Math.max(120, frame.contentDocument.documentElement.scrollHeight) : Math.max(380, (wrap.clientHeight - 28) / s);
        frame.style.height = h + 'px';
        if (fitHeight) wrap.style.height = (h * s + 28) + 'px';
      } catch (e) { /* cross-origin: leave as is */ }
    };
    setH();
    frame.onload = setH;
  };
  SR.copy = async (text, btn) => {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; } ta.remove();
    }
    if (btn) { const t = btn.textContent; btn.textContent = ok ? 'Copied' : 'Copy failed: select the text'; setTimeout(() => { btn.textContent = t; }, 1600); }
    return ok;
  };
  SR.press = (group, btn) => $$('button', group).forEach(b => b.setAttribute('aria-pressed', String(b === btn)));

  // ---------- miniatures: scale 1200 px pages into their windows
  const scaleMinis = () => $$('.piece-win iframe, .twin iframe').forEach(f => {
    const w = f.parentElement.clientWidth;
    if (w) f.style.setProperty('--s', (w / (+f.dataset.vw || 1200)).toFixed(4));
  });
  scaleMinis();
  addEventListener('resize', scaleMinis);

  // ---------- landing: theme every miniature
  const themesGroup = document.querySelector('.themes');
  if (themesGroup) {
    const tokenSets = {};
    let themeData = null;
    const loadThemes = async () => themeData || (themeData = await fetch('raw/themes.json').then(r => r.json()));
    themesGroup.addEventListener('click', async e => {
      const btn = e.target.closest('button[data-theme]'); if (!btn) return;
      SR.press(themesGroup, btn);
      const th = (await loadThemes())[btn.dataset.theme];
      $$('.piece-win iframe').forEach(f => {
        try {
          const root = f.contentDocument.documentElement;
          for (const [k, v] of Object.entries(th)) if (k.startsWith('--')) root.style.setProperty(k, v);
        } catch (err) { /* not loaded yet */ }
      });
      void tokenSets;
    });
  }

  // ---------- landing: Built / Bare for every miniature
  const bare = document.querySelector('.bare');
  if (bare) {
    let on = false;
    const apply = f => SR.xrayLive(f.contentDocument, on);
    $$('.piece-win iframe').forEach(f => f.addEventListener('load', () => { if (on) apply(f); }));
    bare.addEventListener('click', e => {
      const b = e.target.closest('button[data-view]'); if (!b) return;
      SR.press(bare, b); on = b.dataset.view === 'bare';
      document.documentElement.classList.toggle('is-bare', on);
      $$('.piece-win iframe').forEach(apply);
    });
  }

  // ---------- part page
  const partEl = document.querySelector('[data-part]');
  if (partEl && DATA) {
    const p = DATA.parts.find(x => x.id === partEl.dataset.part);
    const frame = partEl.querySelector('[data-preview]');
    const st = { width: 1280, theme: 'signal', xray: false };
    const render = () => {
      const doc = SR.doc({ title: `${p.code} ${p.title}`, tokens: SR.tokensFor(st.theme), bodies: [SR.partBody(p)] });
      frame.srcdoc = SR.preview(doc, st.xray);
      SR.fit(frame, st.width);
    };
    partEl.querySelectorAll('.stage-bar .seg').forEach(seg => seg.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      SR.press(seg, b);
      if (b.dataset.width) st.width = +b.dataset.width;
      if (b.dataset.theme) st.theme = b.dataset.theme;
      render();
    }));
    partEl.querySelector('[data-xray]').addEventListener('change', e => { st.xray = e.target.checked; render(); });
    addEventListener('resize', () => SR.fit(frame, st.width));
    render();
  }
  $$('[data-copy]').forEach(b => b.addEventListener('click', () => SR.copy(document.querySelector(b.dataset.copy).textContent, b)));
})();
