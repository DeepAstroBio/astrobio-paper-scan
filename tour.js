/* DeepAstroBio guided tour: a spotlight walkthrough of the page's controls.
   Plays once on a visitor's first visit to each page; any [data-tour-start] button replays it.
   Steps: {target: CSS selector or null for a centred card, title, text, before: optional setup run first}. */
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

  const PAGES = [
    {
      key: 'tour:scan:v2',
      match: () => document.getElementById('run'),
      steps: [
        {target: null, title: 'Welcome to DeepAstroBio',
         text: 'This site has two parts: Paper Scan, a tool to scan the International Journal of Astrobiology yourself, and Field Sheets, where the results of our field statistics live. A quick look at Paper Scan first.'},
        {target: 'aside', title: 'Paper Scan settings',
         text: 'Pick a date range, what counts as a biology journal, and the words to look for in abstracts.'},
        {target: '#run', title: 'Run a scan',
         text: 'Fetches the papers, their references and abstracts live, then shows charts and searchable tables on the right.'},
        {target: '.masthead .tools a[href="sheets.html"]', title: 'Now open Field Sheets', pointer: true, next: 'Go to Field Sheets',
         text: 'The statistics for both journals are in Field Sheets. Click it to continue the guide there.',
         go: 'sheets.html'},
      ],
    },
    {
      key: 'tour:sheets:v2',
      match: () => document.getElementById('tabs'),
      steps: [
        {target: null, title: 'Field Sheets', before: openTab('README'),
         text: () => `Field statistics for the International Journal of Astrobiology and Astrobiology (SAGE), papers published online ${period()}: ` +
           `${rows('1 Astrobio papers')} papers, ${rows('2 Astrobio authors')} authors, ${rows('3 Cited papers')} cited works and ${rows('4 Cited authors')} cited authors. ` +
           'The guide follows the page in four parts.'},
        {target: '.workflow', title: '1 · The pipeline', before: openTab('README'),
         text: 'The README tab opens with the workflow: data sources on the left, steps A–D, and the tables each step produces. Click the diagram to enlarge it.'},
        {target: '.readme h2', title: '2 · Implementation details', before: openTab('README'),
         text: 'Below the diagram, the README explains each choice: how journals and papers get a field, how authors are identified, and how the representation index is computed.'},
        {target: '.decisions .head', title: '3 · Decisions to confirm', before: openTab('README'),
         text: 'At the bottom of the README, every method choice is a tick box. Tick the ones you agree with; ticks stay in your browser only.'},
        {target: '#dcopy', title: '3 · Share your ticks', before: openTab('README'),
         text: 'Copy as checklist copies your ticks as a list you can paste into an email or a GitHub issue.'},
        {target: '#tabs', title: '4 · The sheets', before: openTab('1 Astrobio papers'),
         text: 'Each tab is one sheet of the workbook, and the number is its row count: papers, citations, authors and their publications, cited papers, cited authors, the representation index, and journals.'},
        {target: '#q', title: '4 · Search', before: openTab('2 Astrobio authors'),
         text: 'Type to filter the current sheet across all columns, for example an author or a journal.'},
        {target: '#wrap thead', title: '4 · Sort and expand', before: openTab('2 Astrobio authors'),
         text: 'Click a column header to sort, again to reverse. Click a row to show long cells in full.'},
        {target: '#tabs', title: '4 · Representation index', before: openTab('5 Representation'),
         text: 'Sheet 5 compares, field by field, the share of authors with the share of cited works; below 1 means a field is under-represented among authors.'},
        {target: '.dl', title: '4 · Download everything', before: openTab('README'),
         text: 'The red button downloads the full Excel workbook with every sheet.'},
        {target: '[data-tour-start]', title: 'Replay this guide',
         text: 'Click Guide any time to see this walkthrough again.'},
      ],
    },
  ];

  const css = `
.tour-block { position: fixed; inset: 0; z-index: 9998; }
.tour-hole { position: fixed; z-index: 9999; border-radius: 10px; pointer-events: none;
  box-shadow: 0 0 0 3px rgba(255,255,255,.9), 0 0 0 9999px rgba(12,12,20,.62);
  transition: top .35s ease, left .35s ease, width .35s ease, height .35s ease, opacity .25s ease; }
.tour-card { position: fixed; z-index: 10000; width: min(360px, calc(100vw - 32px)); box-sizing: border-box;
  background: #ffffff; color: #1b1b1f; border-radius: 12px; padding: 16px 18px 14px;
  box-shadow: 0 10px 40px rgba(0,0,0,.28); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif;
  transition: top .35s ease, left .35s ease; animation: tour-in .3s ease; }
.tour-card.again { animation: tour-step .3s ease; }
@keyframes tour-in { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
@keyframes tour-step { from { opacity: .2; transform: translateY(4px); } to { opacity: 1; transform: none; } }
.tour-pointer { position: fixed; z-index: 10001; pointer-events: none; transition: top .35s ease, left .35s ease; }
.tour-pointer svg { position: absolute; left: 0; top: 0; width: 26px; height: 26px; filter: drop-shadow(0 2px 3px rgba(0,0,0,.4)); animation: tour-tap 1.6s ease-in-out infinite; }
.tour-pointer i { position: absolute; left: -16px; top: -16px; width: 32px; height: 32px; border-radius: 50%; border: 3px solid #ffffff; animation: tour-ripple 1.6s ease-out infinite; }
@keyframes tour-tap { 0%, 100% { transform: translate(14px, 14px); } 40% { transform: translate(2px, 2px); } 50% { transform: translate(2px, 2px) scale(.88); } 60% { transform: translate(2px, 2px); } }
@keyframes tour-ripple { 0%, 45% { transform: scale(.2); opacity: 0; } 50% { opacity: .95; } 100% { transform: scale(1.5); opacity: 0; } }
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
@media (prefers-color-scheme: dark) {
  .tour-card { background: #26262b; color: #f1f1f3; }
  .tour-card p { color: #d6d6dc; }
  .tour-card .tour-step, .tour-card button.tour-skip { color: #a0a0aa; }
  .tour-card .tour-dots i { background: #4a4a52; }
  .tour-card button { background: #26262b; color: #f1f1f3; border-color: #4a4a52; }
}
@media (prefers-reduced-motion: reduce) { .tour-hole, .tour-card, .tour-pointer, .tour-pointer svg, .tour-pointer i { transition: none; animation: none; } }`;

  const page = PAGES.find(p => p.match());
  if (!page) return;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const seen = () => { try { return localStorage.getItem(page.key); } catch { return '1'; } };
  const CONTINUE = 'tour:continue';  // set when a guide hands over to the next page
  const markSeen = () => { try { localStorage.setItem(page.key, new Date().toISOString().slice(0, 10)); } catch {} };
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  let i = 0, nodes = null, token = 0;

  async function waitFor(sel) {  // targets on lazily loaded tabs appear a moment later
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
    let cy = top + height + gap <= vh - ch - 8 ? top + height + gap : (top - gap - ch >= 8 ? top - gap - ch : vh - ch - 16);
    let cx = Math.min(vw - cw - 16, Math.max(16, left + width / 2 - cw / 2));
    card.style.top = cy + 'px';
    card.style.left = cx + 'px';
    nodes.pointer.style.top = r.top + r.height / 2 + 'px';
    nodes.pointer.style.left = r.left + r.width / 2 + 'px';
  }

  // Next / Enter: a step with `go` hands the guide over to another page; the last step closes it.
  function advance() {
    const s = page.steps[i];
    if (s.go) {
      try { sessionStorage.setItem(CONTINUE, '1'); } catch {}
      markSeen();
      location.href = s.go;
    } else if (i === page.steps.length - 1) end();
    else show(i + 1);
  }

  async function show(n) {
    const my = ++token;
    i = n;
    const s = page.steps[i];
    if (s.before) { s.before(); await sleep(150); }
    const el = s.target ? await waitFor(s.target) : null;
    if (my !== token || !nodes) return;
    // jump (not smooth-scroll) so the spotlight is measured where the target ends up, also inside scrolling panes
    if (el) { el.scrollIntoView({block: 'center', behavior: 'instant'}); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); }
    if (my !== token || !nodes) return;
    const last = i === page.steps.length - 1;
    const text = typeof s.text === 'function' ? s.text() : s.text;
    const label = s.next || (last ? 'Done' : i ? 'Next' : 'Start');
    nodes.card.innerHTML = `<div class="tour-step">Step ${i + 1} of ${page.steps.length}</div><h3>${esc(s.title)}</h3><p>${esc(text)}</p>
      <div class="tour-dots">${page.steps.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>
      <div class="tour-row">${last && !s.go ? '<span style="margin-right:auto"></span>' : '<button class="tour-skip">Skip</button>'}${i ? '<button class="tour-back">Back</button>' : ''}<button class="tour-next">${esc(label)}</button></div>`;
    nodes.card.classList.remove('again'); void nodes.card.offsetWidth; nodes.card.classList.add('again');
    nodes.card.querySelector('.tour-next').onclick = () => advance();
    const skip = nodes.card.querySelector('.tour-skip');
    if (skip) skip.onclick = end;
    const back = nodes.card.querySelector('.tour-back');
    if (back) back.onclick = () => show(i - 1);
    nodes.target = el;
    nodes.pointer.style.display = s.pointer && el ? 'block' : 'none';
    place(el);
    setTimeout(() => { if (my === token && nodes) place(el); }, 400);
    nodes.card.querySelector('.tour-next').focus({preventScroll: true});
  }

  function onKey(e) {
    if (!nodes) return;
    if (e.key === 'Escape') end();
    else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); advance(); }
    else if (e.key === 'ArrowLeft' && i > 0) show(i - 1);
  }
  const reflow = () => nodes && place(nodes.target);

  function start() {
    if (nodes) return;
    if (!document.getElementById('tour-css')) {
      const st = document.createElement('style'); st.id = 'tour-css'; st.textContent = css; document.head.append(st);
    }
    const block = document.createElement('div'); block.className = 'tour-block';
    const hole = document.createElement('div'); hole.className = 'tour-hole';
    const card = document.createElement('div'); card.className = 'tour-card'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-live', 'polite');
    const pointer = document.createElement('div'); pointer.className = 'tour-pointer'; pointer.style.display = 'none';
    pointer.innerHTML = '<i></i><svg viewBox="0 0 24 24"><path d="M4 2l15 11-6.5 1.2 3.7 7.3-2.6 1.3-3.7-7.3L4 20z" fill="#fff" stroke="#1b1b1f" stroke-width="1.5" stroke-linejoin="round"/></svg>';
    document.body.append(block, hole, card, pointer);
    nodes = {block, hole, card, pointer, target: null};
    // on a pointer step, a click on the spotlighted control does what Next does
    block.addEventListener('click', e => {
      const s = page.steps[i], el = nodes && nodes.target;
      if (!s.pointer || !el) return;
      const r = el.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) advance();
    });
    addEventListener('keydown', onKey); addEventListener('resize', reflow); addEventListener('scroll', reflow, true);
    show(0);
  }

  function end() {
    if (!nodes) return;
    token++;
    markSeen();
    removeEventListener('keydown', onKey); removeEventListener('resize', reflow); removeEventListener('scroll', reflow, true);
    nodes.block.remove(); nodes.hole.remove(); nodes.card.remove(); nodes.pointer.remove();
    nodes = null;
  }

  document.querySelectorAll('[data-tour-start]').forEach(b => b.addEventListener('click', start));
  let handedOver = false;
  try { handedOver = sessionStorage.getItem(CONTINUE) === '1'; sessionStorage.removeItem(CONTINUE); } catch {}
  if (handedOver || !seen()) setTimeout(start, handedOver ? 400 : 700);
})();
