const backLink = document.querySelector('.back-link');

backLink.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    || !document.referrer || history.length < 2) return;
  const previous = new URL(document.referrer);
  if (previous.origin !== location.origin
    || !previous.pathname.startsWith(new URL('.', location.href).pathname)) return;
  event.preventDefault();
  history.back();
});
