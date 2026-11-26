for (const exhibit of document.querySelectorAll('[data-exhibit]')) {
  const controls = exhibit.querySelector('.case-controls');
  const buttons = [...controls.querySelectorAll('button')];
  const panels = [...exhibit.querySelectorAll('.case-view')];
  panels.slice(1).forEach(panel => { panel.hidden = true; });
  controls.hidden = false;

  controls.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.getAttribute('aria-pressed') === 'true') return;

    buttons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    for (const panel of panels) {
      panel.hidden = panel.id !== button.getAttribute('aria-controls');
    }
    exhibit.querySelector('[role="status"]').textContent = 'Showing ' + button.textContent.trim() + '.';
  });
}
