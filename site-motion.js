const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');

function watchVisibility(element, update) {
  let inView = !('IntersectionObserver' in window);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      refresh();
    }, { threshold: 0.15 });
    observer.observe(element);
  }

  function refresh() {
    update(inView && !document.hidden);
  }
  document.addEventListener('visibilitychange', refresh);
  refresh();
  return refresh;
}

const loopToggle = document.querySelector('.loop-motion');
if (loopToggle) {
  const exhibit = loopToggle.closest('[data-exhibit]');
  const loops = [...exhibit.querySelectorAll('img[data-loop]')];
  let playing = !motionPreference.matches;
  const refresh = watchVisibility(exhibit, visible => {
    loopToggle.textContent = playing ? 'Pause animation' : 'Play animation';
    for (const image of loops) {
      const animate = playing && visible && !image.closest('figure').hidden;
      const source = animate ? image.dataset.loop : image.dataset.poster;
      if (image.getAttribute('src') !== source) image.setAttribute('src', source);
    }
  });
  loopToggle.hidden = false;
  loopToggle.addEventListener('click', () => {
    playing = !playing;
    refresh();
  });
  new MutationObserver(refresh).observe(exhibit, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
  motionPreference.addEventListener('change', () => {
    playing = !motionPreference.matches;
    refresh();
  });
}
