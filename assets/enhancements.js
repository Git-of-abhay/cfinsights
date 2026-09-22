import { cleanLogoBackground } from './logo.js';

const q = (selector, root = document) => root.querySelector(selector);
const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
const exactText = (selector, text) => qa(selector).find((node) => node.textContent.trim() === text);

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let reduceMotion = motionPreference.matches;
motionPreference.addEventListener?.('change', (event) => { reduceMotion = event.matches; });

function track(eventName, parameters = {}) {
  if (typeof window.gtag === 'function') window.gtag('event', eventName, parameters);
}

function mountAnalyticsEvents() {
  if (document.documentElement.dataset.cfAnalyticsEvents) return;
  document.documentElement.dataset.cfAnalyticsEvents = 'true';
  document.addEventListener('click', (event) => {
    const control = event.target.closest('button, a');
    if (!control) return;
    const label = control.textContent.trim();
    if (label === 'Analyze Profiles') track('analyze_profiles', { profile_count: qa('input[type="text"]').length });
    else if (label === 'Enable Compare Mode' || label === 'Compare Mode Active') track('compare_mode_toggle');
    else if (['Overview', 'Analytics', 'Practice', 'Insights', 'Tools', 'Verdict Comparison', 'Problems', 'Progress', 'After X Contests'].includes(label)) track('dashboard_tab', { tab_name: label });
    else if (control.matches('[data-days]')) track('heatmap_range', { days: Number(control.dataset.days) });
    else if (control.id === 'cf-tutor-launcher') track('tutor_open');
    else if (control.closest('.cf-community-links')) track('community_link', { action: label });
  });
}

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
    code: '<path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14"/>',
    git: '<circle cx="12" cy="12" r="2"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 6h4a4 4 0 0 1 4 4M12 14v7M6 8v3a3 3 0 0 0 3 3h1"/>',
    issue: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/>',
    license: '<path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4.3 7.7 7.7 4.4 7.7-4.4M12 12v9"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
};

function mountHeroVisualization() {
  const logo = q('.cf-brand-logo');
  const titleBlock = logo?.parentElement;
  if (!logo || !titleBlock || q('.cf-hero-scene')) return;
  const card = titleBlock.parentElement;
  const head = document.createElement('section');
  head.className = 'cf-hero-head';
  head.setAttribute('aria-label', 'CFInsights analytics preview');
  titleBlock.classList.add('cf-hero-copy');
  card.classList.add('cf-command-center');
  titleBlock.before(head);
  head.append(titleBlock);

  const scene = document.createElement('div');
  scene.className = 'cf-hero-scene cf-tilt-surface';
  scene.setAttribute('role', 'img');
  scene.setAttribute('aria-label', 'Illustrative three-dimensional rating analytics preview with a rising sample curve and topic bars');
  scene.innerHTML = `
    <div class="cf-scene-grid" aria-hidden="true"></div>
    <div class="cf-orbit cf-orbit-one" aria-hidden="true"></div>
    <div class="cf-orbit cf-orbit-two" aria-hidden="true"></div>
    <div class="cf-data-plane cf-plane-back" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
    <div class="cf-data-plane cf-plane-main">
      <div class="cf-plane-top"><span><i></i> RATING SIGNAL</span><strong>+284</strong></div>
      <svg viewBox="0 0 320 150" aria-hidden="true">
        <path class="cf-chart-area" d="M12 130 C45 118,55 123,82 101 S126 87,148 94 S190 54,216 62 S260 23,308 31 L308 140 L12 140Z"/>
        <path class="cf-chart-line" pathLength="1" d="M12 130 C45 118,55 123,82 101 S126 87,148 94 S190 54,216 62 S260 23,308 31"/>
        <g class="cf-chart-points"><circle cx="82" cy="101" r="4"/><circle cx="148" cy="94" r="4"/><circle cx="216" cy="62" r="4"/><circle cx="308" cy="31" r="5"/></g>
      </svg>
      <div class="cf-plane-axis"><span>800</span><span>1400</span><span>2100</span></div>
    </div>
    <div class="cf-float-card cf-float-top"><small>PEAK</small><strong>2,417</strong><span>sample</span></div>
    <div class="cf-float-card cf-float-bottom"><small>MOMENTUM</small><strong>↑ 18%</strong><span>preview</span></div>
    <p class="cf-scene-label">INTERFACE PREVIEW · SAMPLE CURVE</p>`;
  head.append(scene);
}

function mountDepthInteractions() {
  if (document.documentElement.dataset.cfDepth) return;
  document.documentElement.dataset.cfDepth = 'true';
  let depthFrame = null;
  let lastPointer = null;
  document.addEventListener('pointermove', (event) => {
    lastPointer = event;
    if (depthFrame) return;
    depthFrame = requestAnimationFrame(() => {
      depthFrame = null;
      const pointer = lastPointer;
      const surface = pointer.target.closest('.cf-tilt-surface');
      if (!surface || reduceMotion || pointer.pointerType === 'touch') return;
      const rect = surface.getBoundingClientRect();
      const x = (pointer.clientX - rect.left) / rect.width - .5;
      const y = (pointer.clientY - rect.top) / rect.height - .5;
      surface.style.setProperty('--tilt-x', `${(-y * 5).toFixed(2)}deg`);
      surface.style.setProperty('--tilt-y', `${(x * 7).toFixed(2)}deg`);
    });
  });
  document.addEventListener('pointerout', (event) => {
    const surface = event.target.closest('.cf-tilt-surface');
    if (!surface || surface.contains(event.relatedTarget)) return;
    surface.style.removeProperty('--tilt-x');
    surface.style.removeProperty('--tilt-y');
  });
}

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

function enhanceStructure() {
  const content = q('#root .max-w-7xl.mx-auto');
  if (content && !content.id) {
    content.id = 'cf-main';
    content.tabIndex = -1;
  }
  if (content && !q('.cf-skip-link')) {
    const skip = document.createElement('a');
    skip.className = 'cf-skip-link';
    skip.href = '#cf-main';
    skip.textContent = 'Skip to CFInsights';
    document.body.prepend(skip);
  }
  qa('input[type="text"]').forEach((input, index) => {
    if (input.dataset.cfLabeled) return;
    input.dataset.cfLabeled = 'true';
    input.id ||= `cf-handle-${index + 1}`;
    const field = input.closest('.relative.group') || input;
    const label = document.createElement('label');
    label.className = 'cf-field-label';
    label.htmlFor = input.id;
    label.textContent = index ? `Codeforces handle ${index + 1}` : 'Codeforces handle';
    field.before(label);
  });
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
    card?.classList.add('cf-chart-card', 'cf-tilt-surface');
    card?.style.setProperty('--chart-order', index);
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
  section.innerHTML = `
    <div class="cf-community-visual cf-tilt-surface" aria-hidden="true">
      <div class="cf-contrib-core">${icon('cube')}<span>OPEN<br>SOURCE</span></div>
      <div class="cf-contrib-ring"><i></i><i></i><i></i></div>
      <span class="cf-code-chip cf-chip-a">PR +1</span><span class="cf-code-chip cf-chip-b">ISSUE</span><span class="cf-code-chip cf-chip-c">MIT</span>
    </div>
    <div class="cf-community-copy">
      <p class="cf-kicker">BUILD IN PUBLIC</p>
      <h2>Shape the next version of CFInsights.</h2>
      <p>CFInsights is open source under MIT. Star the project, improve an insight, or report the edge case nobody else noticed.</p>
      <div class="cf-community-links">
        <a class="cf-community-primary" href="https://github.com/Git-of-abhay/cfinsights" target="_blank" rel="noopener noreferrer">${icon('code')}<span><strong>Star on GitHub</strong><small>Support the project</small></span>${icon('arrow')}</a>
        <a href="https://github.com/Git-of-abhay/cfinsights/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">${icon('git')}<span><strong>Contribute</strong><small>Read the guide</small></span></a>
        <a href="https://github.com/Git-of-abhay/cfinsights/issues" target="_blank" rel="noopener noreferrer">${icon('issue')}<span><strong>Issues</strong><small>Ask or report</small></span></a>
        <a href="https://github.com/Git-of-abhay/cfinsights/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">${icon('license')}<span><strong>MIT License</strong><small>Use and remix</small></span></a>
      </div>
      <small class="cf-community-note">Keep passwords and private information out of public issues.</small>
    </div>`;
  footer.prepend(section);
}

const steps = [
  { title: 'Welcome to CFinsights', body: 'This guided tour stays with you as you explore. You can close it at any time and restart from the Tutor button.', target: () => q('.cf-hero-head') },
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
    card.style.setProperty('--tour-turn', `${tourIndex * 52}deg`);
    q('.cf-tour-number', card).textContent = String(tourIndex + 1).padStart(2, '0');
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
  card.innerHTML = `<div class="cf-tutor-progress"><span></span></div><button class="cf-tutor-close" type="button" aria-label="Close guided tour">${icon('close')}</button><div class="cf-tour-stage" aria-hidden="true"><div class="cf-tour-cube"><span class="cf-tour-number">01</span><i></i><b></b></div><div class="cf-tour-orbit"></div></div><div class="cf-tour-content"><p class="cf-tutor-eyebrow"></p><h2 id="cf-tutor-title"></h2><p class="cf-tutor-copy"></p>${activeSteps.length === 4 ? '<p class="cf-tutor-note">Analyze a profile, then reopen Tutor to tour the full dashboard.</p>' : ''}<div class="cf-tutor-actions"><button type="button" data-tour-back>Back</button><button type="button" data-tour-next><span>Next</span>${icon('arrow')}</button></div></div>`;
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
    enhanceStructure();
    removeAlphaAccess();
    enhanceBrand();
    mountHeroVisualization();
    mountDepthInteractions();
    enhanceCharts();
    enhanceHeatmap();
    enhanceDocumentation();
    mountTutor();
    addCommunityLinks();
    mountAnalyticsEvents();
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
