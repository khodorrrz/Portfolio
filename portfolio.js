const model = document.querySelector('#model-stage');
function loadModel() {
  // The static render stays in place if the browser cannot load or run WebGL.
  import('./model.js').then(({ mountModel }) => mountModel(model)).catch(() => {});
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    loadModel();
  }, { rootMargin: '200px' });
  observer.observe(model);
} else {
  loadModel();
}
