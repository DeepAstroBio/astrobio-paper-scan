/* DeepAstroBio guided tour: one spotlight walkthrough across Paper Scan and Field Sheets.
   It starts on a visitor's first visit; any [data-tour-start] button replays it. From Paper Scan it runs
   the whole tour: at the hand-over step an animated pointer moves to "Field Sheets", clicks it, and the
   tour carries on there. Opened on Field Sheets it shows only that page's steps.
   Step: {page, target: CSS selector or null for a centred card, title, text (string or function),
          before: setup run first, go: {via: selector of the link to click, to: URL}}. */
(() => {
  const openTab = prefix => () => {
    const b = [...document.querySelectorAll('#tabs button')].find(b => b.textContent.startsWith(prefix));
    if (b && !b.classList.contains('on')) b.click();
  };
  // sheet sizes and period, read from the Field Sheets page's own data so the text stays current
  const sheetData = () => { try { return DATA; } catch { return null; } };  // eslint-disable-line no-undef
  const rows = prefix => {
    const sh = (sheetData()?.sheets || []).find(s => s.name.startsWith(prefix));
    return sh ? (sh.rows ? sh.rows.length : sh.count || 0).toLocaleString('en-US') : '?';
  };
  const period = () => (sheetData()?.subtitle.match(/online (\S+ to \S+)/) || [, 'the study period'])[1];

  const TOUR = [
    {page: 'scan', target: null, title: 'Welcome to DeepAstroBio',
     text: 'Two parts: Paper Scan, a tool to scan astrobiology papers yourself, and Field Sheets, the results of our field statistics.'},
    {page: 'scan', target: 'aside', title: 'Paper Scan',
     text: 'Set a date range and options here, then Run analysis to scan papers yourself. Next, we open Field Sheets.',
     go: {via: '.masthead .tools a[href="sheets.html"]', to: 'sheets.html'}},
    {page: 'sheets', target: null, title: 'Field Sheets', before: openTab('README'),
     text: () => `Field statistics for the International Journal of Astrobiology and Astrobiology (SAGE), papers published online ${period()}: ` +
       `${rows('1 Astrobio papers')} papers, ${rows('2 Astrobio authors')} authors, ${rows('3 Cited papers')} cited works and ${rows('4 Cited authors')} cited authors.`},
    {page: 'sheets', target: '.workflow', title: '1 · The pipeline', before: openTab('README'),
     text: 'How the tables are made, from data sources to results.'},
    {page: 'sheets', target: '.readme h2', title: '2 · Implementation details', before: openTab('README'),
     text: 'The rules behind the numbers.'},
    {page: 'sheets', target: '.decisions .head', title: '3 · Decisions to confirm', before: openTab('README'),
     text: 'Tick the choices you agree with, then use "Copy as checklist" to share them.'},
    {page: 'sheets', target: '#tabs', title: '4 · The sheets', before: openTab('README'),
     text: 'One tab per sheet of the results.'},
    {page: 'sheets', target: '.dl', title: 'Download', before: openTab('README'),
     text: 'The full Excel file. Click Guide (top right) to see this tour again.'},
  ];
  const PAGE = document.getElementById('tabs') ? 'sheets' : document.getElementById('run') ? 'scan' : null;
  if (!PAGE) return;

  const css = `
.tour-block { position: fixed; inset: 0; z-index: 9998; }
.tour-hole { position: fixed; z-index: 9999; border-radius: 10px; pointer-events: none;
  box-shadow: 0 0 0 3px rgba(255,255,255,.9), 0 0 0 9999px rgba(12,12,20,.62);
  transition: top .35s ease, left .35s ease, width .35s ease, height .35s ease; }
.tour-card { position: fixed; z-index: 10000; width: min(360px, calc(100vw - 32px)); box-sizing: border-box;
  background: #ffffff; color: #1b1b1f; border-radius: 12px; padding: 16px 18px 14px;
  box-shadow: 0 10px 40px rgba(0,0,0,.28); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif;
  transition: top .35s ease, left .35s ease, opacity .25s ease; animation: tour-in .3s ease; }
.tour-card.again { animation: tour-step .3s ease; }
.tour-card.away { opacity: 0; pointer-events: none; }
@keyframes tour-in { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
@keyframes tour-step { from { opacity: .2; transform: translateY(4px); } to { opacity: 1; transform: none; } }
.tour-card .tour-step { font-size: 12px; color: #6b6b75; margin-bottom: 2px; }
.tour-card h3 { margin: 0 0 6px; font-size: 16px; }
.tour-card p { margin: 0 0 12px; color: #34323f; }
.tour-card .tour-dots { display: flex; gap: 5px; margin-bottom: 12px; }
.tour-card .tour-dots i { width: 7px; height: 7px; border-radius: 50%; background: #d9d9de; }
.tour-card .tour-dots i.on { background: #d62839; }
.tour-card .tour-row { display: flex; align-items: center; gap: 8px; }
.tour-card button { font: inherit; font-size: 13px; border-radius: 999px; padding: 5px 14px; cursor: pointer; border: 1px solid #c9c4de; background: #ffffff; color: #1b1b1f; }
.tour-card button.tour-next { background: #d62839; border-color: #d62839; color: #ffffff; font-weight: 600; }
.tour-card button.tour-skip { border: none; background: none; color: #6b6b75; padding-left: 0; margin-right: auto; }
.tour-cursor { position: fixed; z-index: 10001; left: 0; top: 0; pointer-events: none; will-change: transform; }
.tour-cursor svg { display: block; width: 28px; height: 28px; filter: drop-shadow(0 2px 3px rgba(0,0,0,.45)); transform-origin: 4px 2px; transition: transform .12s ease; }
.tour-cursor.press svg { transform: scale(.82); }
.tour-cursor i { position: absolute; left: -18px; top: -18px; width: 36px; height: 36px; border-radius: 50%; border: 3px solid #ffffff; opacity: 0; }
.tour-cursor.press i { animation: tour-ripple .55s ease-out; }
@keyframes tour-ripple { from { transform: scale(.2); opacity: 1; } to { transform: scale(1.6); opacity: 0; } }
@media (prefers-color-scheme: dark) {
  .tour-card { background: #26262b; color: #f1f1f3; }
  .tour-card p { color: #d6d6dc; }
  .tour-card .tour-step, .tour-card button.tour-skip { color: #a0a0aa; }
  .tour-card .tour-dots i { background: #4a4a52; }
  .tour-card button { background: #26262b; color: #f1f1f3; border-color: #4a4a52; }
}
@media (prefers-reduced-motion: reduce) { .tour-hole, .tour-card { transition: none; animation: none; } }`;

  const SEEN = 'tour:v4';           // one record for the whole tour, shared by both pages
  const CONTINUE = 'tour:continue';  // {i, from}: the step to resume at after the hand-over
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const seen = () => { try { return localStorage.getItem(SEEN); } catch { return '1'; } };
  const markSeen = () => { try { localStorage.setItem(SEEN, new Date().toISOString().slice(0, 10)); } catch {} };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  let i = 0, first = 0, nodes = null, token = 0, busy = false;  // first: the step numbering starts at

  async function waitFor(sel) {  // targets on lazily drawn tabs appear a moment later
    for (let k = 0; k < 30; k++) {
      const el = document.querySelector(sel);
      if (el && el.getBoundingClientRect().width) return el;
      await sleep(100);
    }
    return null;
  }

  function place(el) {
    const {hole, card} = nodes, pad = 6, vw = innerWidth, vh = innerHeight;
    if (!el) {
      Object.assign(hole.style, {top: vh / 2 + 'px', left: vw / 2 + 'px', width: '0px', height: '0px'});
      card.style.left = Math.max(16, (vw - card.offsetWidth) / 2) + 'px';
      card.style.top = Math.max(16, (vh - card.offsetHeight) / 2) + 'px';
      return;
    }
    const r = el.getBoundingClientRect();
    const top = Math.max(4, r.top - pad), left = Math.max(4, r.left - pad);
    const width = Math.min(vw - 8, r.width + 2 * pad), height = Math.min(vh - 8, r.height + 2 * pad);
    Object.assign(hole.style, {top: top + 'px', left: left + 'px', width: width + 'px', height: height + 'px'});
    const ch = card.offsetHeight, cw = card.offsetWidth, gap = 14;
    const below = top + height + gap, above = top - gap - ch;
    let cy = below <= vh - ch - 8 ? below : above >= 8 ? above : vh - ch - 16;
    let cx = Math.min(vw - cw - 16, Math.max(16, left + width / 2 - cw / 2));
    if (cy < top + height && cy + ch > top && left < vw / 2) cx = Math.min(vw - cw - 16, left + width + gap);  // tall target: sit beside it
    card.style.top = cy + 'px';
    card.style.left = cx + 'px';
  }

  async function show(n) {
    const my = ++token;
    i = n;
    const s = TOUR[i];
    if (s.before) { s.before(); await sleep(150); }
    const el = s.target ? await waitFor(s.target) : null;
    if (my !== token || !nodes) return;
    // jump (not smooth-scroll) so the spotlight is measured where the target ends up, also inside scrolling panes
    if (el) { el.scrollIntoView({block: 'center', behavior: 'instant'}); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); }
    if (my !== token || !nodes) return;
    const total = TOUR.length - first, k = i - first, last = i === TOUR.length - 1;
    const text = typeof s.text === 'function' ? s.text() : s.text;
    nodes.card.classList.remove('away');
    nodes.card.innerHTML = `<div class="tour-step">Step ${k + 1} of ${total}</div><h3>${esc(s.title)}</h3><p>${esc(text)}</p>
      <div class="tour-dots">${TOUR.slice(first).map((_, d) => `<i class="${d === k ? 'on' : ''}"></i>`).join('')}</div>
      <div class="tour-row">${last ? '<span style="margin-right:auto"></span>' : '<button class="tour-skip">Skip</button>'}` +
      `${i > first && TOUR[i - 1].page === PAGE ? '<button class="tour-back">Back</button>' : ''}<button class="tour-next">${last ? 'Done' : k ? 'Next' : 'Start'}</button></div>`;
    nodes.card.classList.remove('again'); void nodes.card.offsetWidth; nodes.card.classList.add('again');
    nodes.card.querySelector('.tour-next').onclick = advance;
    nodes.card.querySelector('.tour-skip')?.addEventListener('click', end);
    nodes.card.querySelector('.tour-back')?.addEventListener('click', () => show(i - 1));
    nodes.target = el;
    place(el);
    setTimeout(() => { if (my === token && nodes) place(el); }, 400);
    nodes.card.querySelector('.tour-next').focus({preventScroll: true});
  }

  // Move the pointer from (x0, y0) to (x1, y1) along a gentle arc, easing in and out like a hand would.
  function glide(cursor, x0, y0, x1, y1, ms) {
    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1;
    const cx = (x0 + x1) / 2 - dy / len * Math.min(120, len * 0.25), cy = (y0 + y1) / 2 + dx / len * Math.min(120, len * 0.25);
    const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    return new Promise(done => {
      const t0 = performance.now();
      const frame = now => {
        const t = ease(Math.min(1, (now - t0) / ms)), u = 1 - t;
        const x = u * u * x0 + 2 * u * t * cx + t * t * x1, y = u * u * y0 + 2 * u * t * cy + t * t * y1;
        cursor.style.transform = `translate(${x - 4}px, ${y - 2}px)`;  // the arrow's tip is at (4, 2)
        (now - t0 < ms) ? requestAnimationFrame(frame) : done();
      };
      requestAnimationFrame(frame);
    });
  }

  // Hand-over: spotlight the link, glide the pointer onto it, click, then load the next page and resume there.
  async function handOver(go) {
    busy = true;
    const link = document.querySelector(go.via);
    try { sessionStorage.setItem(CONTINUE, JSON.stringify({i: i + 1, from: first})); } catch {}
    if (!link || reduced()) { location.href = go.to; return; }
    const btn = nodes.card.querySelector('.tour-next').getBoundingClientRect();
    nodes.target = link;
    place(link);
    nodes.card.classList.add('away');
    const cursor = document.createElement('div');
    cursor.className = 'tour-cursor';
    cursor.innerHTML = '<i></i><svg viewBox="0 0 24 24"><path d="M4 2l15 11-6.5 1.2 3.7 7.3-2.6 1.3-3.7-7.3L4 20z" fill="#fff" stroke="#1b1b1f" stroke-width="1.5" stroke-linejoin="round"/></svg>';
    document.body.append(cursor);
    nodes.cursor = cursor;
    const r = link.getBoundingClientRect();
    await glide(cursor, btn.left + btn.width / 2, btn.top + btn.height / 2, r.left + r.width / 2, r.top + r.height / 2, 1100);
    await sleep(180);
    cursor.classList.add('press');
    link.style.transition = 'background .15s ease';
    link.style.background = 'rgba(214,40,57,.18)';
    await sleep(420);
    location.href = go.to;
  }

  function advance() {
    if (busy) return;
    const s = TOUR[i];
    if (s.go) handOver(s.go);
    else if (i === TOUR.length - 1) end();
    else show(i + 1);
  }

  function onKey(e) {
    if (!nodes || busy) return;
    if (e.key === 'Escape') end();
    else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); advance(); }
    else if (e.key === 'ArrowLeft' && i > first && TOUR[i - 1].page === PAGE) show(i - 1);
  }
  const reflow = () => nodes && !busy && place(nodes.target);

  function start(at = TOUR.findIndex(s => s.page === PAGE), from = at) {
    if (nodes) return;
    if (!document.getElementById('tour-css')) {
      const st = document.createElement('style'); st.id = 'tour-css'; st.textContent = css; document.head.append(st);
    }
    const block = document.createElement('div'); block.className = 'tour-block';
    const hole = document.createElement('div'); hole.className = 'tour-hole';
    const card = document.createElement('div'); card.className = 'tour-card'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-live', 'polite');
    document.body.append(block, hole, card);
    nodes = {block, hole, card, target: null};
    first = from;
    addEventListener('keydown', onKey); addEventListener('resize', reflow); addEventListener('scroll', reflow, true);
    show(at);
  }

  function end() {
    if (!nodes) return;
    token++;
    markSeen();
    removeEventListener('keydown', onKey); removeEventListener('resize', reflow); removeEventListener('scroll', reflow, true);
    for (const n of [nodes.block, nodes.hole, nodes.card, nodes.cursor]) n?.remove();
    nodes = null;
  }

  document.querySelectorAll('[data-tour-start]').forEach(b => b.addEventListener('click', () => start()));
  let resume = null;
  try { resume = JSON.parse(sessionStorage.getItem(CONTINUE) || 'null'); sessionStorage.removeItem(CONTINUE); } catch {}
  if (resume && TOUR[resume.i]?.page === PAGE) setTimeout(() => start(resume.i, resume.from), 350);
  else if (!seen()) setTimeout(() => start(), 700);
})();
