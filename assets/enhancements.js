const q = (selector, root = document) => root.querySelector(selector);
const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
const exactText = (selector, text) => qa(selector).find((node) => node.textContent.trim() === text);

const icon = (name) => {
  const paths = {
    guide: '<path d="M12 3 3 7.5 12 12l9-4.5L12 3Z"/><path d="M7 10v5c0 1.7 2.2 3 5 3s5-1.3 5-3v-5"/><path d="M21 8v6"/>',
    arrow: '<path d="m9 18 6-6-6-6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z"/><path d="M8 7h8M8 11h6"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
};

function enhanceSearch() {
  const input = q('input[type="text"]');
  if (!input || q('.cf-examples')) return;
  const wrap = input.closest('.relative.group')?.parentElement;
  if (!wrap) return;
  const examples = document.createElement('div');
  examples.className = 'cf-examples';
  examples.setAttribute('aria-label', 'Example Codeforces handles');
  examples.innerHTML = '<span>Try an example</span>' + ['tourist', 'Benq', 'Petr'].map((handle) => `<button type="button" data-handle="${handle}">${handle}</button>`).join('');
  examples.addEventListener('click', (event) => {
    const button = event.target.closest('[data-handle]');
    if (!button) return;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, button.dataset.handle);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
  });
  wrap.after(examples);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('cf-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

function enhanceCharts() {
  qa('canvas').forEach((canvas, index) => {
    if (canvas.dataset.cfEnhanced) return;
    canvas.dataset.cfEnhanced = 'true';
    const frame = canvas.parentElement;
    frame.classList.add('cf-chart-frame');
    const card = canvas.closest('[class*="rounded-2xl"], [class*="rounded-xl"]');
    const title = card?.querySelector('h2, h3, h4')?.textContent.trim() || `Analytics chart ${index + 1}`;
    canvas.setAttribute('aria-label', title);
    canvas.setAttribute('role', 'img');
    revealObserver.observe(frame);
  });
}

function enhanceHeatmap() {
  const label = qa('span').find((node) => node.textContent.trim() === 'Last 365 days');
  if (!label) return;
  let card = label.parentElement;
  while (card && !card.textContent.includes('Submission Activity')) card = card.parentElement;
  if (!card || card.dataset.cfHeatmap) return;
  card.dataset.cfHeatmap = 'true';
  card.classList.add('cf-heatmap-card');
  const cells = qa('[title*="submission"]', card);
  cells.forEach((cell, index) => {
    cell.classList.add('cf-heat-cell');
    cell.style.setProperty('--cell-delay', `${Math.min(index, 180) * 3}ms`);
    cell.tabIndex = 0;
    cell.setAttribute('role', 'button');
    cell.setAttribute('aria-label', cell.title);
  });
  const controls = document.createElement('div');
  controls.className = 'cf-heatmap-tools';
  controls.innerHTML = '<div class="cf-range" aria-label="Heatmap range"><button type="button" data-days="30">30d</button><button type="button" data-days="90">90d</button><button type="button" data-days="365" class="active">1y</button></div><output aria-live="polite">Select a day to inspect activity</output>';
  label.parentElement.after(controls);
  const output = q('output', controls);
  const focusCell = (cell) => { output.textContent = cell.title; };
  card.addEventListener('click', (event) => {
    const cell = event.target.closest('.cf-heat-cell');
    if (cell) focusCell(cell);
    const button = event.target.closest('[data-days]');
    if (!button) return;
    qa('[data-days]', controls).forEach((item) => item.classList.toggle('active', item === button));
    const days = Number(button.dataset.days);
    cells.forEach((cell, index) => cell.classList.toggle('cf-out-of-range', index < cells.length - days));
    output.textContent = days === 365 ? 'Showing the full activity year' : `Focusing on the last ${days} days`;
  });
  card.addEventListener('keydown', (event) => {
    const cell = event.target.closest('.cf-heat-cell');
    if (cell && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      focusCell(cell);
    }
  });
}

function enhanceDocumentation() {
  const heading = qa('*').find((node) => node.children.length === 0 && node.textContent.trim() === 'Complete Feature Documentation');
  if (!heading) return;
  const card = heading.closest('[class*="rounded-2xl"], [class*="rounded-xl"]') || heading.parentElement;
  if (q('.cf-doc-link', card)) return;
  const link = document.createElement('a');
  link.href = './documentation.html';
  link.target = '_blank';
  link.rel = 'noopener';
  link.className = 'cf-doc-link';
  link.innerHTML = `${icon('book')}<span><strong>Open interactive product guide</strong><small>Browse features, workflows, scoring, and troubleshooting</small></span>${icon('arrow')}`;
  heading.parentElement.after(link);
}

const steps = [
  { title: 'Welcome to CFinsights', body: 'This guided tour stays with you as you explore. You can close it at any time and restart from the Tutor button.', target: () => q('h1') },
  { title: 'Start with a handle', body: 'Enter any public Codeforces handle. The example chips can fill one instantly.', target: () => q('input[type="text"]') },
  { title: 'Compare two profiles', body: 'Enable Compare Mode to analyze two handles side by side without changing the single-profile workflow.', target: () => exactText('button', 'Enable Compare Mode') || exactText('button', 'Compare Mode Active') },
  { title: 'Run the analysis', body: 'Analyze Profiles loads public Codeforces data and builds the dashboard. No account or password is needed.', target: () => exactText('button', 'Analyze Profiles') },
  { title: 'Your dashboard', body: 'Overview summarizes rating history, solved difficulty, submissions, and recent contests.', target: () => exactText('button', 'Overview'), tab: 'Overview' },
  { title: 'Activity and strengths', body: 'Analytics contains badges, strongest topics, streaks, and the interactive 365-day heatmap. Use 30d, 90d, and 1y to focus it.', target: () => exactText('button', 'Analytics'), tab: 'Analytics', follow: 'Last 365 days' },
  { title: 'Turn gaps into practice', body: 'Practice surfaces unsolved and high-attempt problems so you can choose the next useful task.', target: () => exactText('button', 'Practice'), tab: 'Practice' },
  { title: 'Understand failure patterns', body: 'Insights groups wasted time, weak topics, ratings, and verdicts into a focused action plan.', target: () => exactText('button', 'Insights'), tab: 'Insights' },
  { title: 'Learn every feature', body: 'Tools includes the complete documentation. The new browser guide is easier to search and read alongside the dashboard.', target: () => exactText('button', 'Tools'), tab: 'Tools', follow: 'Complete Feature Documentation' },
];

let tourIndex = 0;
let activeSteps = [];
let priorTarget = null;
let tourTimer = null;

function resolveTourSteps() {
  return exactText('button', 'Overview') ? steps : steps.slice(0, 4);
}

function findFollowTarget(text) {
  return qa('*').find((node) => node.children.length === 0 && node.textContent.trim() === text);
}

function renderStep() {
  const card = q('#cf-tutor-card');
  if (!card) return;
  priorTarget?.classList.remove('cf-tour-target');
  window.clearTimeout(tourTimer);
  const step = activeSteps[tourIndex];
  if (step.tab) exactText('button', step.tab)?.click();
  tourTimer = window.setTimeout(() => {
    let target = step.follow ? findFollowTarget(step.follow) : step.target();
    target ||= step.target();
    priorTarget = target;
    target?.classList.add('cf-tour-target');
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    q('.cf-tutor-eyebrow', card).textContent = `Step ${tourIndex + 1} of ${activeSteps.length}`;
    q('h2', card).textContent = step.title;
    q('.cf-tutor-copy', card).textContent = step.body;
    q('[data-tour-back]', card).disabled = tourIndex === 0;
    q('[data-tour-next] span', card).textContent = tourIndex === activeSteps.length - 1 ? 'Finish' : 'Next';
    q('.cf-tutor-progress span', card).style.width = `${((tourIndex + 1) / activeSteps.length) * 100}%`;
  }, step.tab ? 180 : 0);
}

function closeTour() {
  window.clearTimeout(tourTimer);
  priorTarget?.classList.remove('cf-tour-target');
  q('#cf-tutor-card')?.remove();
  q('#cf-tutor-launcher')?.focus();
}

function startTour() {
  q('#cf-tutor-card')?.remove();
  activeSteps = resolveTourSteps();
  tourIndex = 0;
  const card = document.createElement('section');
  card.id = 'cf-tutor-card';
  card.className = 'cf-tutor-card';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-modal', 'false');
  card.setAttribute('aria-labelledby', 'cf-tutor-title');
  card.innerHTML = `<div class="cf-tutor-progress"><span></span></div><button class="cf-tutor-close" type="button" aria-label="Close guided tour">${icon('close')}</button><p class="cf-tutor-eyebrow"></p><h2 id="cf-tutor-title"></h2><p class="cf-tutor-copy"></p>${activeSteps.length === 4 ? '<p class="cf-tutor-note">Analyze a profile, then reopen Tutor to tour the full dashboard.</p>' : ''}<div class="cf-tutor-actions"><button type="button" data-tour-back>Back</button><button type="button" data-tour-next><span>Next</span>${icon('arrow')}</button></div>`;
  document.body.append(card);
  q('.cf-tutor-close', card).addEventListener('click', closeTour);
  q('[data-tour-back]', card).addEventListener('click', () => { tourIndex = Math.max(0, tourIndex - 1); renderStep(); });
  q('[data-tour-next]', card).addEventListener('click', () => {
    if (tourIndex === activeSteps.length - 1) { localStorage.setItem('cfTutorSeen', 'true'); closeTour(); return; }
    tourIndex += 1;
    renderStep();
  });
  renderStep();
}

function mountTutor() {
  if (q('#cf-tutor-launcher')) return;
  const button = document.createElement('button');
  button.id = 'cf-tutor-launcher';
  button.className = 'cf-tutor-launcher';
  button.type = 'button';
  button.innerHTML = `${icon('guide')}<span>Tutor</span>`;
  button.setAttribute('aria-label', 'Open guided product tour');
  button.addEventListener('click', startTour);
  document.body.append(button);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && q('#cf-tutor-card')) closeTour();
    if (event.key === '?' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) startTour();
  });
}

let queued = false;
function enhance() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    enhanceSearch();
    enhanceCharts();
    enhanceHeatmap();
    enhanceDocumentation();
    mountTutor();
  });
}

new MutationObserver(enhance).observe(q('#root'), { childList: true, subtree: true });
enhance();
