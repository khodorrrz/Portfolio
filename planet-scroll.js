const gestureGap = 180;
const swipeDistance = 16;

export function bindCheckpointScroll({ canStep, step, signal }) {
  let lastWheel = -Infinity;
  let wheelClaimed = false;
  let swipe;
  let claimedKey;

  function usesOwnScroll(event, direction) {
    const target = event.target;
    if (!(target instanceof Element)) return false;
    if (target.closest('dialog, input, textarea, select, [contenteditable="true"]')) return true;
    const caption = target.closest('.tour-dialogue');
    return caption && caption.scrollHeight > caption.clientHeight
      && (direction > 0
        ? caption.scrollTop + caption.clientHeight < caption.scrollHeight - 1
        : caption.scrollTop > 0);
  }

  window.addEventListener('wheel', event => {
    if (!event.cancelable || event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    const direction = Math.sign(event.deltaY);
    const newGesture = event.timeStamp - lastWheel > gestureGap;
    lastWheel = event.timeStamp;
    if (newGesture) wheelClaimed = false;
    if (usesOwnScroll(event, direction)) return;
    if (newGesture && canStep(direction)) {
      wheelClaimed = true;
      step(direction);
    }
    if (wheelClaimed) event.preventDefault();
  }, { passive: false, signal });

  window.addEventListener('touchstart', event => {
    swipe = event.touches.length === 1
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY, stepped: false }
      : undefined;
  }, { passive: true, signal });

  window.addEventListener('touchmove', event => {
    if (!swipe || !event.cancelable || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const dy = swipe.y - touch.clientY;
    const direction = Math.sign(dy);
    if (swipe.stepped) {
      event.preventDefault();
      return;
    }
    if (Math.abs(dy) <= Math.abs(swipe.x - touch.clientX)
      || usesOwnScroll(event, direction) || !canStep(direction)) return;
    event.preventDefault();
    if (Math.abs(dy) < swipeDistance) return;
    swipe.stepped = true;
    step(direction);
  }, { passive: false, signal });

  window.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
    const direction = ['ArrowDown', 'PageDown'].includes(event.key) ? 1
      : ['ArrowUp', 'PageUp'].includes(event.key) ? -1
      : event.code === 'Space' && !event.target.closest?.('button, a') ? (event.shiftKey ? -1 : 1) : 0;
    if (!direction || usesOwnScroll(event, direction)) return;
    if (event.repeat && claimedKey === event.code) {
      event.preventDefault();
    } else if (!event.repeat && canStep(direction)) {
      claimedKey = event.code;
      event.preventDefault();
      step(direction);
    }
  }, { signal });
  window.addEventListener('keyup', event => {
    if (claimedKey === event.code) claimedKey = undefined;
  }, { signal });
}
