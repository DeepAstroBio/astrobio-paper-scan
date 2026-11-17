/* DeepAstroBio guided tour: a spotlight walkthrough of the page's controls.
   Plays once on a visitor's first visit to each page; any [data-tour-start] button replays it.
   Steps: {target: CSS selector or null for a centred card, title, text, before: optional setup run first}. */
(() => {
  const openTab = prefix => () => {
    const b = [...document.querySelectorAll('#tabs button')].find(b => b.textContent.startsWith(prefix));
    if (b && !b.classList.contains('on')) b.click();
  };

  const PAGES = [
    {
      key: 'tour:scan:v1',
      match: () => document.getElementById('run'),
      steps: [
        {target: null, title: 'Welcome to Paper Scan',
         text: 'Paper Scan takes papers from the International Journal of Astrobiology, collects everything they cite, keeps the works published in biology journals, and checks whether their abstracts use the word "astrobiology". This short guide shows what each control does.'},
        {target: '.masthead .tools', title: 'Two tools',
         text: 'Switch between Paper Scan (run your own scan) and Field Sheets (the prepared tables on authors, citations and fields).'},
        {target: '#from', title: 'Date range',
         text: 'Pick which IJA papers to scan by their online publication date. The quick links below (1 mo … 5 yr) fill in common ranges.'},
        {target: '#thr', title: 'What counts as a biology journal',
         text: 'A journal counts as biology when at least this share of its topics fall in the biology fields ticked below. Raise it to be stricter.'},
        {target: '#fields', title: 'Biology fields',
         text: 'Choose which research fields count as biology for the threshold above.'},
        {target: '#terms', title: 'Words to look for',
         text: 'An abstract counts as relevant when it contains one of these terms. * is a wildcard. Editing them re-scores the results instantly, without rerunning the scan.'},
        {target: '#run', title: 'Run the scan',
         text: 'Fetches the papers, their references and the abstracts straight from Crossref, OpenAlex and Europe PMC. A one-year scan takes about 20 seconds the first time and about a second after that.'},
        {target: '#results', title: 'Results',
         text: 'Charts and tables appear here: where the references were published, what their abstracts say, and a searchable list of every paper. The links in the top bar jump between sections.'},
        {target: '#export', title: 'Save the results',
         text: 'After a scan, download everything as one HTML file that opens offline.'},
        {target: '[data-tour-start]', title: 'Replay this guide',
         text: 'Click Guide any time to see this walkthrough again.'},
      ],
    },
    {
      key: 'tour:sheets:v1',
      match: () => document.getElementById('tabs'),
      steps: [
        {target: null, title: 'Welcome to Field Sheets',
         text: 'These tables trace who writes in two astrobiology journals and what they cite, field by field, and compare the two. This short guide shows how to read and use them.', before: openTab('README')},
        {target: '.masthead .tools', title: 'Two tools',
         text: 'Switch between Paper Scan (run your own citation scan) and Field Sheets (these tables).'},
        {target: '.dl', title: 'Download the Excel file',
         text: 'Every table on this page is also in one Excel workbook, with the same sheets.'},
        {target: '#tabs', title: 'One tab per sheet',
         text: 'Each tab is one sheet of the workbook; the number is its row count. Large sheets load when you first open them.'},
        {target: '.workflow', title: 'How the tables are made', before: openTab('README'),
         text: 'The README tab starts with the workflow: data sources on the left, steps A–D, and the tables each step produces. Click the diagram to enlarge it.'},
        {target: '.decisions .head', title: 'Method decisions', before: openTab('README'),
         text: 'Every choice behind the numbers is listed at the bottom of the README. Tick each one once you have checked it, and use "Copy as checklist" to share your ticks.'},
        {target: '#q', title: 'Search a sheet', before: openTab('2 Astrobio authors'),
         text: 'Type to filter the current sheet across all columns, for example an author\'s name or a journal.'},
        {target: '#wrap thead', title: 'Sort and expand', before: openTab('2 Astrobio authors'),
         text: 'Click a column header to sort (click again to reverse). Click a row to show long cells, like publication lists, in full.'},
        {target: '#tabs', title: 'The representation index', before: openTab('5 Representation'),
         text: 'Sheet 5 compares, field by field, the share of authors with the share of cited works: below 1 means a field is under-represented among authors relative to how much its work is cited.'},
        {target: '[data-tour-start]', title: 'Replay this guide', before: openTab('README'),
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
@media (prefers-reduced-motion: reduce) { .tour-hole, .tour-card { transition: none; animation: none; } }`;

  const page = PAGES.find(p => p.match());
  if (!page) return;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const seen = () => { try { return localStorage.getItem(page.key); } catch { return '1'; } };
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
    nodes.card.innerHTML = `<div class="tour-step">Step ${i + 1} of ${page.steps.length}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>
      <div class="tour-dots">${page.steps.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>
      <div class="tour-row">${last ? '<span style="margin-right:auto"></span>' : '<button class="tour-skip">Skip</button>'}${i ? '<button class="tour-back">Back</button>' : ''}<button class="tour-next">${last ? 'Done' : i ? 'Next' : 'Start'}</button></div>`;
    nodes.card.classList.remove('again'); void nodes.card.offsetWidth; nodes.card.classList.add('again');
    nodes.card.querySelector('.tour-next').onclick = () => (last ? end() : show(i + 1));
    const skip = nodes.card.querySelector('.tour-skip');
    if (skip) skip.onclick = end;
    const back = nodes.card.querySelector('.tour-back');
    if (back) back.onclick = () => show(i - 1);
    nodes.target = el;
    place(el);
    setTimeout(() => { if (my === token && nodes) place(el); }, 400);
    nodes.card.querySelector('.tour-next').focus({preventScroll: true});
  }

  function onKey(e) {
    if (!nodes) return;
    if (e.key === 'Escape') end();
    else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); i < page.steps.length - 1 ? show(i + 1) : end(); }
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
    document.body.append(block, hole, card);
    nodes = {block, hole, card, target: null};
    addEventListener('keydown', onKey); addEventListener('resize', reflow); addEventListener('scroll', reflow, true);
    show(0);
  }

  function end() {
    if (!nodes) return;
    token++;
    markSeen();
    removeEventListener('keydown', onKey); removeEventListener('resize', reflow); removeEventListener('scroll', reflow, true);
    nodes.block.remove(); nodes.hole.remove(); nodes.card.remove();
    nodes = null;
  }

  document.querySelectorAll('[data-tour-start]').forEach(b => b.addEventListener('click', start));
  if (!seen()) setTimeout(start, 700);
})();
