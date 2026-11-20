const trace = document.querySelector('.security-lab');
const scenarios = [...trace.querySelectorAll('[data-scenario]')];
const checkpoints = [...trace.querySelectorAll('[data-checkpoint]')];
const walkthrough = trace.querySelector('.security-walkthrough');
const map = trace.querySelector('.security-flow');
const counter = trace.querySelector('#security-counter');
const route = trace.querySelector('#security-route');
const status = trace.querySelector('#security-status');
const currentIndex = trace.querySelector('[data-current-index]');
const currentTitle = trace.querySelector('[data-current-title]');
const story = trace.querySelector('.security-chapters');
const template = trace.querySelector('#security-chapter');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const titles = [
  'Inventory the route',
  'Look for an ownership gap',
  'Ground the source-to-query path',
  'Review the evidence independently',
  'Reconcile the ledger',
  'Derive the report'
];
const fixtures = {
  invoice: {
    route: 'GET /invoices/:id',
    code: 'Invoice.findById(req.params.id)',
    total: '1 sample finding',
    steps: [
      ['No candidate yet', 'The shared inventory records the authenticated invoice endpoint and maps the handler to its database query.'],
      ['CANDIDATE', 'The query uses the requested record ID without constraining the owner. Authentication establishes who made the request but leaves ownership unchecked.'],
      ['CANDIDATE', 'The mapped path reaches the lookup from an authenticated HTTP request. The requested ID flows into the query without an owner filter.'],
      ['STATICALLY_CONFIRMED', 'An independent reviewer can reproduce the source trace and confirm the missing owner check. This simulation uses static evidence and skips the live-check branch.'],
      ['ACTIVE', 'Reconciliation keeps the corroborated finding and would merge any exact duplicates before aggregation.'],
      ['ACTIVE', 'Aggregation counts the active entry. The report can reference the route, query, and supporting evidence so a reviewer can reproduce the finding.']
    ]
  },
  duplicate: {
    route: 'Exact-duplicate ledger fixture',
    code: 'Same finding · severity proposals: CRITICAL / HIGH',
    total: 'Aggregation blocked',
    finalTitle: 'Hold the report for adjudication',
    steps: [
      ['No candidate yet', 'This ledger fixture focuses on two agents reporting the same issue at the same source location.'],
      ['Two candidates', 'Two independent agents submit the same class and source location. One proposes Critical severity and the other proposes High.'],
      ['Shared source anchor', 'The duplicate submissions point to the same finding. Matching the source anchor can establish identity without resolving severity.'],
      ['Severity conflict', 'The evidence review leaves competing severity proposals. The workflow retains both proposals for reconciliation.'],
      ['NEEDS_ADJUDICATION', 'The duplicate is marked MERGED. The surviving entry needs adjudication before it can count as active.'],
      ['NEEDS_ADJUDICATION', 'The aggregation gate blocks report totals while the survivor is unresolved. The fixture expects one merged entry and zero active entries.']
    ]
  },
  receipt: {
    route: 'GET /receipts/:id',
    code: 'Receipt.findOne({ _id: req.params.id, ownerId: req.user.id })',
    total: '0 sample findings',
    steps: [
      ['No candidate yet', 'The inventory records the authenticated receipt endpoint and maps it to the database lookup.'],
      ['No candidate', 'The query requires both the requested ID and the authenticated owner ID. This fixture expects no ownership finding for the route.'],
      ['No candidate', 'The handler still reaches the database. The authenticated owner is part of the lookup, so this path does not establish an ownership bypass.'],
      ['No candidate', 'A source reviewer can verify the owner constraint directly. This simulation skips the live-check branch.'],
      ['No active entry', 'There is no ownership finding from this route to retain or merge in the ledger.'],
      ['No active entry', 'The report counts zero findings for this sample route. The result covers the ownership fixture.']
    ]
  }
};

const chapters = checkpoints.map((button, index) => {
  const chapter = template.content.firstElementChild.cloneNode(true);
  const phase = button.closest('.security-lane').querySelector('h3').firstChild.textContent.trim();
  chapter.querySelector('[data-phase]').textContent = `0${index + 1} / ${phase}`;
  story.append(chapter);
  return chapter;
});

function renderFixture(fixture) {
  route.textContent = fixture.route;
  chapters.forEach((chapter, index) => {
    const [state, detail] = fixture.steps[index];
    const isFinal = index === chapters.length - 1;
    chapter.querySelector('h3').textContent = (isFinal && fixture.finalTitle) || titles[index];
    chapter.querySelector('[data-state]').textContent = state;
    chapter.querySelector('[data-detail]').textContent = detail;
    if (index === 1) {
      chapter.querySelector('pre').hidden = false;
      chapter.querySelector('code').textContent = fixture.code;
    }
    if (isFinal) {
      chapter.querySelector('.security-result').hidden = false;
      chapter.querySelector('.security-result strong').textContent = fixture.total;
    }
  });
}

let current = -1;
let frame = 0;

function syncToScroll() {
  frame = 0;
  const readingLine = window.innerHeight * .48;
  let index = -1;
  for (let step = chapters.length - 1; step >= 0; step--) {
    if (chapters[step].getBoundingClientRect().top <= readingLine) {
      index = step;
      break;
    }
  }
  index = Math.max(0, index);

  currentIndex.textContent = `0${index + 1}`;
  currentTitle.textContent = chapters[index].querySelector('h3').textContent;
  if (current === index) return;

  current = index;
  counter.textContent = `0${index + 1} / 06`;
  map.style.setProperty('--security-progress', (index + 1) / chapters.length);
  checkpoints.forEach((button, step) => {
    button.setAttribute('aria-current', step === index ? 'step' : 'false');
    button.toggleAttribute('data-passed', step < index);
    chapters[step].toggleAttribute('data-active', step === index);
  });
}

function queueScrollSync() {
  if (!frame) frame = requestAnimationFrame(syncToScroll);
}

checkpoints.forEach((button, index) => {
  button.addEventListener('click', () => {
    const chapter = chapters[index];
    chapter.querySelector('.security-panel').focus({ preventScroll: true });
    window.scrollTo({
      top: window.scrollY + chapter.getBoundingClientRect().top - window.innerHeight * .42,
      behavior: reducedMotion.matches ? 'instant' : 'smooth'
    });
  });
});

scenarios.forEach(button => button.addEventListener('click', () => {
  scenarios.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
  renderFixture(fixtures[button.dataset.scenario]);
  status.textContent = `Showing ${button.textContent.trim()} fixture.`;
  queueScrollSync();
}));

renderFixture(fixtures.invoice);
trace.querySelector('.security-controls').hidden = false;
walkthrough.hidden = false;
trace.querySelector('.security-note').hidden = true;
syncToScroll();
window.addEventListener('scroll', queueScrollSync, { passive: true });
window.addEventListener('resize', queueScrollSync);
