import { cleanLogoBackground } from './logo.js';

const q = (selector, root = document) => root.querySelector(selector);
const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
const exactText = (selector, text) => qa(selector).find((node) => node.textContent.trim() === text);

function removeAlphaAccess() {
  qa('button').filter((button) => /^(Alpha AccessAlpha|Alpha Access|Alpha)$/.test(button.textContent.trim())).forEach((button) => button.remove());
  q('button[aria-label="Toggle dark mode"]')?.classList.add('cf-theme-toggle');
}

function enhanceBrand() {
  const heading = qa('h1').find((node) => node.textContent.trim() === 'CFinsights');
  if (!heading || q('.cf-brand-logo')) return;
  const oldMark = heading.previousElementSibling;
  oldMark?.classList.add('cf-brand-hidden');
  heading.classList.add('cf-visually-hidden');
  const logo = document.createElement('img');
  logo.src = new URL('./cfinsights-logo.png', import.meta.url).href;
  logo.alt = 'CFInsights';
  logo.className = 'cf-brand-logo';
  heading.before(logo);
  cleanLogoBackground(logo);
}

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

function balancePanels() {
  if (window.innerWidth < 1024) return;
  qa('.grid').forEach((grid) => {
    if (grid.dataset.cfBalanced) return;
    const columns = [...grid.children].filter((child) => child.tagName === 'DIV');
    if (columns.length !== 2) return;
    const panels = columns.map((column) => column.matches('[class*="rounded-xl"], [class*="rounded-2xl"]') ? column : q('[class*="rounded-xl"], [class*="rounded-2xl"]', column));
    if (panels.some((panel) => !panel)) return;
    const [first, second] = panels;
    const firstHeight = first.getBoundingClientRect().height;
    const secondHeight = second.getBoundingClientRect().height;
    const difference = Math.abs(firstHeight - secondHeight);
    if (difference < 110 || Math.max(firstHeight, secondHeight) < 500) return;
    const height = Math.round(Math.max(390, Math.min(Math.min(firstHeight, secondHeight), 580)));
    grid.dataset.cfBalanced = 'true';
    grid.classList.add('cf-balanced-grid');
    panels.forEach((panel) => {
      panel.classList.add('cf-balanced-panel');
      panel.style.setProperty('--cf-panel-height', `${height}px`);
    });
    const scrollPanel = firstHeight > secondHeight ? first : second;
    scrollPanel.classList.add('cf-scroll-panel');
    scrollPanel.tabIndex = 0;
    scrollPanel.setAttribute('aria-label', `${scrollPanel.querySelector('h2, h3, h4')?.textContent.trim() || 'Long panel'}; scroll for more content`);
  });
}

function addCommunityLinks() {
  const footer = q('footer');
  if (!footer || q('.cf-community', footer)) return;
  const section = document.createElement('section');
  section.className = 'cf-community';
  section.setAttribute('aria-label', 'CFInsights community');
  section.innerHTML = '<h2>Help make CFInsights better</h2><p>Finding this useful? Please star the repository. Bug reports, feature ideas, and contributions are welcome.</p><div class="cf-community-links"><a href="https://github.com/Git-of-abhay/cfinsights" target="_blank" rel="noopener noreferrer">☆ Star on GitHub</a><a href="https://github.com/Git-of-abhay/cfinsights/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">Contribute</a><a href="https://github.com/Git-of-abhay/cfinsights/issues" target="_blank" rel="noopener noreferrer">Get help / report a bug</a></div><small>Please keep passwords and private information out of public issues.</small>';
  footer.prepend(section);
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

const compareSteps = [
  { title: 'Comparison workspace', body: 'Compare Mode keeps both profiles in one workspace and aligns each metric so differences are easy to scan.', target: () => findFollowTarget('Profile Comparison') },
  { title: 'Profiles at a glance', body: 'The two profile summaries keep identity, current rating, maximum rating, location, and account history together.', target: () => findFollowTarget('vs') || findFollowTarget('Profile Comparison') },
  { title: 'Overall performance', body: 'Overview compares rating progress, contest volume, solve count, acceptance rate, growth, and rank. Use rates as well as totals when account ages differ.', target: () => exactText('button', 'Overview'), tab: 'Overview', follow: 'Detailed Statistics Comparison' },
  { title: 'Verdict patterns', body: 'Verdict Comparison reveals where each user succeeds or loses submissions across accepted, wrong answer, time, runtime, and compilation outcomes.', target: () => exactText('button', 'Verdict Comparison'), tab: 'Verdict Comparison' },
  { title: 'Problem strengths', body: 'Problems compares solved difficulty and topic coverage. It helps identify complementary strengths instead of relying on rating alone.', target: () => exactText('button', 'Problems'), tab: 'Problems' },
  { title: 'Progress over time', body: 'Progress aligns rating and solving development over time so you can see momentum, plateaus, and recent direction.', target: () => exactText('button', 'Progress'), tab: 'Progress' },
  { title: 'Fair contest checkpoint', body: 'After X Contests compares both users at the same contest count, reducing the distortion caused by different account ages.', target: () => exactText('button', 'After X Contests'), tab: 'After X Contests', follow: 'After X Contests Analysis' },
];

let tourIndex = 0;
let activeSteps = [];
let priorTarget = null;
let tourTimer = null;

function resolveTourSteps() {
  if (exactText('button', 'Verdict Comparison')) return compareSteps;
  return exactText('button', 'Analytics') ? steps : steps.slice(0, 4);
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
    removeAlphaAccess();
    enhanceBrand();
    enhanceCharts();
    enhanceHeatmap();
    enhanceDocumentation();
    mountTutor();
    addCommunityLinks();
    window.setTimeout(balancePanels, 240);
  });
}

new MutationObserver(enhance).observe(q('#root'), { childList: true, subtree: true });
let resizeTimer;
window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(balancePanels, 180);
});
enhance();
