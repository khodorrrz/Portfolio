const lines = [
  'Touchdown. I\'ll be your guide. Follow me to three stations, and pick any project sign to look closer.',
  'At Coderaas, Khodor worked across React, Express, Prisma, and access control. Try LiveSyncher to see cloud updates reach a legacy checkout system.',
  'HandyLink and LiraTrack cover apps and experiences. For applied AI, try the retrieval lab or see ASL recognize supported signs from a live camera.',
  'QA Orchestrator and Security Agent are engineering tools that gather evidence. This final stop also links to Khodor\'s CV, experience, and contact. Thanks for walking with me.',
];

export function createTour(stage, stops) {
  const panel = stage.querySelector('.tour-dialogue');
  const title = panel.querySelector('[data-tour-title]');
  const caption = panel.querySelector('[data-tour-caption]');
  const measure = panel.querySelector('[data-tour-measure]');
  const stream = panel.querySelector('[data-tour-stream]');
  const audio = panel.querySelector('audio');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let muted = true;
  let playback = 0;
  let station = -1;
  let destination = -1;
  let typing = 0;
  let bubbleWidth = 0;
  let bubbleHeight = 0;

  function measureBubble() {
    if (panel.hidden) return;
    bubbleWidth = panel.offsetWidth;
    bubbleHeight = panel.offsetHeight;
  }

  function write(line) {
    cancelAnimationFrame(typing);
    if (caption.textContent !== line) caption.textContent = line;
    measure.textContent = line;
    measureBubble();
    const started = performance.now();
    let visible = 0;
    stream.textContent = '';

    function reveal(now) {
      const voiced = !audio.paused && Number.isFinite(audio.duration) && audio.duration > 0;
      const count = reducedMotion.matches || audio.ended ? line.length
        : Math.floor(voiced ? audio.currentTime / audio.duration * line.length : (now - started) * .042);
      if (count > visible) {
        visible = count;
        stream.textContent = line.slice(0, visible);
      }
      if (visible < line.length) typing = requestAnimationFrame(reveal);
    }

    if (reducedMotion.matches) reveal(started);
    else typing = requestAnimationFrame(reveal);
  }

  function silence() {
    playback++;
    audio.pause();
    audio.currentTime = 0;
  }

  function speak() {
    silence();
    if (muted || document.hidden || station < 0) return;
    const attempt = playback;
    audio.play().catch(() => {
      if (attempt !== playback) return;
      muted = true;
      updateVoice();
    });
  }

  function updateVoice() {
    const enabled = !muted;
    for (const control of stage.querySelectorAll('[data-gear="guide"]')) {
      control.setAttribute('aria-pressed', String(enabled));
      const label = control.querySelector('[data-voice-label]');
      if (label) label.textContent = enabled ? 'Voice on' : 'Voice off';
    }
  }

  function setVoice(enabled) {
    muted = !enabled;
    updateVoice();
    if (muted) silence();
    else speak();
  }

  document.addEventListener('visibilitychange', () => { if (document.hidden) silence(); });
  window.addEventListener('pagehide', silence);

  updateVoice();

  return {
    show(index) {
      if (station === index) return;
      station = index;
      destination = index + 1;
      panel.hidden = false;
      title.textContent = `${index + 1} / ${stops.length} | ${stops[index]}`;
      const audioStops = [1, 2, 3, 5];
      audio.src = `assets/tour/stop-${audioStops[index]}.mp3`;
      write(lines[index]);
      speak();
    },
    walk(index) {
      if (station < 0 && destination === index) return;
      silence();
      station = -1;
      destination = index;
      panel.hidden = false;
      title.textContent = 'On the trail';
      write(`Follow me to ${stops[index]}.`);
    },
    hide() {
      if (panel.hidden) return;
      silence();
      station = -1;
      destination = -1;
      panel.hidden = true;
      cancelAnimationFrame(typing);
    },
    position(mouth, sign) {
      if (panel.hidden) return;
      const signBounds = sign.hidden ? null : sign.getBoundingClientRect();
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const x = (mouth.x + 1) * width / 2;
      const y = (1 - mouth.y) * height / 2;
      const signLeft = signBounds?.left ?? width;
      const below = width < 600 || height < 460 || signLeft < bubbleWidth + 26;
      const rightLimit = (below ? width : signLeft) - bubbleWidth - 12;
      const left = Math.max(12, Math.min(x - bubbleWidth * (below ? .24 : .7), rightLimit));
      const targetTop = below ? height - bubbleHeight - 16 : y - bubbleHeight - 82;
      const top = Math.max(12, Math.min(targetTop, height - bubbleHeight - 10));
      panel.style.left = `${Math.round(left)}px`;
      panel.style.top = `${Math.round(top)}px`;
    },
    focus() { panel.focus({ preventScroll: true }); },
    resize: measureBubble,
    toggleVoice() {
      if (muted && station >= 0) write(lines[station]);
      setVoice(muted);
    },
  };
}
