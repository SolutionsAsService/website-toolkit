// The sandbox: stack parts, set tokens, edit the HTML. The preview's srcdoc is the textarea's text, which is
// exactly what Copy and Download give you (X-ray, when on, changes the preview only and says so).
(() => {
  const SR = window.SR, D = SR.data;
  const $ = s => document.querySelector(s);
  const byId = Object.fromEntries(D.parts.map(p => [p.id, p]));
  const code = $('#sb-code'), frame = $('.sb-main [data-preview]'), status = $('#sb-status');
  const st = { stack: [], preset: 'signal', overrides: {}, width: 1280, xray: false, edited: false, title: 'My page', lang: 'en' };

  // ---------- state <-> URL hash:  #p=id,id&th=signal&k=--sr-accent:1f4fd8;--sr-radius:12px  or  #t=template
  function readHash() {
    const h = new URLSearchParams(location.hash.slice(1));
    if (h.get('t')) { loadTemplate(h.get('t')); }
    else {
      const ids = (h.get('p') || 'nav-bar,hero-split,cta-band').split(',').filter(id => byId[id]);
      st.stack = ids.map(id => ({ id, body: null }));
    }
    if (h.get('th') && D.themes[h.get('th')]) st.preset = h.get('th');
    if (h.get('k')) for (const kv of h.get('k').split(';')) { const [k, v] = kv.split(':'); if (/^--sr-[a-z-]+$/.test(k) && v) st.overrides[k] = /^[0-9a-f]{6}$/i.test(v) ? '#' + v : decodeURIComponent(v); }
  }
  function writeHash() {
    const h = new URLSearchParams();
    h.set('p', st.stack.map(s => s.id).join(','));
    if (st.preset !== 'signal') h.set('th', st.preset);
    const k = Object.entries(st.overrides).map(([k, v]) => `${k}:${/^#[0-9a-f]{6}$/i.test(v) ? v.slice(1) : encodeURIComponent(v)}`).join(';');
    if (k) h.set('k', k);
    history.replaceState(null, '', '#' + h.toString());
  }
  function loadTemplate(id) {
    const t = D.templates.find(t => t.id === id); if (!t) return;
    st.stack = t.parts.map(r => ({ id: r.id, body: r.body }));
    st.title = t.title; st.lang = t.lang;
  }

  // ---------- assemble
  const tokens = () => SR.tokensFor(st.preset, st.overrides);
  const assemble = () => SR.doc({ title: st.title, lang: st.lang, tokens: tokens(), bodies: st.stack.map(s => s.body || SR.partBody(byId[s.id])) });
  function render() {
    frame.srcdoc = SR.preview(code.value, st.xray);
    SR.fit(frame, st.width, { fitHeight: false });
    status.textContent = st.xray ? 'X-ray is on: the preview shows structure; Copy still gives the real page.' : (st.edited ? 'Showing your edited HTML.' : '');
  }
  function rebuild({ ask = true } = {}) {
    if (st.edited && ask && !confirm('Changing the parts rewrites the HTML and drops your hand edits. Continue?')) return false;
    code.value = assemble(); st.edited = false; writeHash(); render(); drawStack(); return true;
  }
  // token changes keep hand edits: only the /* sr:tokens */ block is replaced
  function retoken() {
    const block = `/* sr:tokens */\n${tokens()}\n/* /sr:tokens */`;
    if (/\/\* sr:tokens \*\/[\s\S]*?\/\* \/sr:tokens \*\//.test(code.value)) code.value = code.value.replace(/\/\* sr:tokens \*\/[\s\S]*?\/\* \/sr:tokens \*\//, block);
    else code.value = assemble();
    writeHash(); render(); syncControls();
  }

  // ---------- the stack list
  const stackEl = $('#sb-stack');
  function drawStack() {
    stackEl.innerHTML = '';
    st.stack.forEach((s, i) => {
      const p = byId[s.id];
      const li = document.createElement('li');
      li.innerHTML = `<span><b class="pcode">${p.code}</b> ${p.title}</span>`;
      for (const [label, act, dis] of [['↑', 'up', i === 0], ['↓', 'down', i === st.stack.length - 1], ['×', 'remove', false]]) {
        const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.disabled = dis;
        b.setAttribute('aria-label', `${act === 'remove' ? 'Remove' : 'Move ' + act} ${p.title}`);
        b.addEventListener('click', () => {
          const snap = st.stack.slice();
          if (act === 'remove') st.stack.splice(i, 1);
          else { const j = act === 'up' ? i - 1 : i + 1; [st.stack[i], st.stack[j]] = [st.stack[j], st.stack[i]]; }
          if (!rebuild()) st.stack = snap;
        });
        li.appendChild(b);
      }
      stackEl.appendChild(li);
    });
  }
  $('#sb-addbtn').addEventListener('click', () => { const id = $('#sb-add').value; st.stack.push({ id, body: null }); if (!rebuild()) st.stack.pop(); });
  $('#sb-tplbtn').addEventListener('click', () => { const id = $('#sb-tpl').value; if (!id) return; const snap = [st.stack, st.title, st.lang]; loadTemplate(id); if (!rebuild()) [st.stack, st.title, st.lang] = snap; });

  // ---------- token controls
  const presetGroup = document.querySelector('[aria-label="Theme preset"]');
  presetGroup.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; SR.press(presetGroup, b); st.preset = b.dataset.preset; st.overrides = {}; retoken(); });
  const current = k => String(st.overrides[k] ?? (D.themes[st.preset] || {})[k] ?? ((D.tokens.match(new RegExp(`${k}:\\s*([^;]+);`)) || [])[1] || '')).trim();
  function syncControls() {
    document.querySelectorAll('[data-token]').forEach(el => {
      const v = current(el.dataset.token);
      if (el.type === 'range') { el.value = parseInt(v, 10) || 0; const o = document.querySelector(`output[data-for="${el.dataset.token}"]`); if (o) o.textContent = v; }
      else if (el.type === 'color') el.value = /^#[0-9a-f]{6}$/i.test(v) ? v : '#000000';
      else el.value = v;
    });
    SR.press(presetGroup, presetGroup.querySelector(`[data-preset="${st.preset}"]`));
    contrast();
  }
  document.querySelectorAll('[data-token]').forEach(el => el.addEventListener('input', () => {
    st.overrides[el.dataset.token] = el.type === 'range' ? el.value + (el.dataset.unit || '') : el.value;
    retoken();
  }));
  // contrast readout for the pairs the parts rely on
  const lum = hex => { const c = hex.replace('#', '').match(/../g).map(h => parseInt(h, 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); };
  function contrast() {
    const g = k => current(k);
    const pairs = [['Ink on paper', '--sr-ink', '--sr-paper'], ['Muted on paper', '--sr-muted', '--sr-paper'], ['Button text on accent', '--sr-accent-ink', '--sr-accent'], ['Accent on paper', '--sr-accent', '--sr-paper']];
    const out = pairs.filter(([, a, b]) => /^#[0-9a-f]{6}$/i.test(g(a)) && /^#[0-9a-f]{6}$/i.test(g(b))).map(([n, a, b]) => { const r = ratio(g(a), g(b)); return `${n} ${r.toFixed(1)}:1${r < 4.5 ? ' ⚠ below 4.5' : ''}`; });
    $('#sb-contrast').textContent = out.join(' · ');
  }

  // ---------- preview controls, edits, output
  const widthGroup = document.querySelector('.sb-main [aria-label="Width"]');
  widthGroup.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; SR.press(widthGroup, b); st.width = +b.dataset.width; render(); });
  document.querySelector('.sb-main [data-xray]').addEventListener('change', e => { st.xray = e.target.checked; render(); });
  let t; code.addEventListener('input', () => { st.edited = true; clearTimeout(t); t = setTimeout(render, 300); });
  $('#sb-copy').addEventListener('click', e => SR.copy(code.value, e.currentTarget));
  $('#sb-link').addEventListener('click', e => SR.copy(location.href, e.currentTarget));
  $('#sb-download').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([code.value], { type: 'text/html' }));
    a.download = (st.title || 'page').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.html';
    document.body.appendChild(a); a.click(); a.remove();
  });
  addEventListener('resize', () => SR.fit(frame, st.width, { fitHeight: false }));

  readHash();
  code.value = assemble();
  drawStack(); syncControls(); render();
  window.__sandbox = { st, assemble };
})();
