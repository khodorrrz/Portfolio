import * as THREE from './vendor/three.module.min.js';
import { buildWorld, radius } from './planet-world.js';
import { createTour } from './planet-tour.js';
import { bindCheckpointScroll } from './planet-scroll.js';

const track = document.querySelector('.planet-track');
const stage = track.querySelector('.planet-stage');
const masthead = document.querySelector('.masthead');
const panels = [...track.querySelectorAll('.planet-stop')];
const persistentTitle = document.createElement('h1');
persistentTitle.className = 'sr-only';
persistentTitle.textContent = 'Khodor El Hajj Moussa — Full-stack developer';
let titleMounted = false;
function syncPersistentTitle(index) {
  if (index > 0 && !titleMounted) {
    track.append(persistentTitle);
    titleMounted = true;
  } else if (index === 0 && titleMounted) {
    persistentTitle.remove();
    titleMounted = false;
  }
}
const gearControls = track.querySelector('.landing-gear');
const gearStatus = gearControls.querySelector('.gear-status');
const gearButtons = [...gearControls.querySelectorAll('[data-gear]')];
const workTitle = document.querySelector('#work-title');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const spacing = .43;
const last = panels.length - 1;
const departure = .075;
const approach = .48;

function mountPlanet() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch {
    return;
  }

  const canvas = renderer.domElement;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(49, 1, .06, 40);
  const { world, axis, stations, frameLanding, poseGear, guideMouth, pickables } = buildWorld(scene, panels.length, spacing);
  const projection = new THREE.Matrix4();
  const plane = new THREE.Matrix4();
  const viewport = new THREE.Matrix4();
  const mouthPosition = new THREE.Vector3();
  const dimensions = [];
  let active = -1;
  let start = 0;
  let interval = 1;
  let frame = 0;
  let previousProgress;
  let touchdown;
  let cameraDistance = 2.75;
  let action;
  let gearPose = {};
  let gearDirty = true;
  let transition;
  let launched = false;
  let rocketDeparted = false;
  let presentedStop = -1;
  let gestureStart;
  let facing = 1;
  const input = new AbortController();
  const tour = createTour(stage, panels.map(panel => panel.dataset.stop));
  const gearLabels = {
    rocket: 'Testing the rocket thruster.',
    scanner: 'Scanning the landing terrain.',
  };

  function stopGear(reset = true) {
    action = undefined;
    if (reset) gearPose = {};
    gearDirty = true;
    for (const button of gearButtons) button.removeAttribute('data-running');
  }

  function startGear(kind) {
    if (kind === 'guide') {
      tour.toggleVoice();
      return;
    }
    if (active !== 0 || (kind === 'rocket' && launched)) return;
    stopGear();
    gearStatus.textContent = gearLabels[kind];
    if (reducedMotion.matches) {
      gearPose = kind === 'rocket' ? { engine: true, lift: .045 } : { turn: .6, pulse: .42 };
      gearStatus.textContent = kind === 'rocket' ? 'Thruster ready.' : 'Terrain scan complete.';
    } else {
      action = { kind, start: performance.now() };
      gearButtons.find(button => button.dataset.gear === kind).setAttribute('data-running', '');
    }
    scheduleRender();
  }

  function animateGear(now) {
    if (!action) return;
    const progress = THREE.MathUtils.clamp((now - action.start) / 1850, 0, 1);
    if (action.kind === 'rocket') {
      gearPose = { lift: Math.sin(Math.PI * progress) ** 2 * .26, engine: progress < .9 };
    } else {
      gearPose = { turn: progress * Math.PI * 2, pulse: progress < 1 ? (progress * 2) % 1 : .48 };
    }
    if (progress === 1) {
      gearStatus.textContent = action.kind === 'rocket' ? 'Rocket back on the pad.' : 'Terrain scan complete.';
      stopGear(false);
    }
    gearDirty = true;
    if (action) scheduleRender();
  }

  function positionCamera(lift = 0) {
    const eye = stage.clientHeight < 440 ? .77 : .62;
    camera.position.set(0, radius + eye + lift, cameraDistance);
    camera.lookAt(0, radius + eye - .38, 0);
    camera.updateMatrixWorld();
  }
  function checkpointTarget(direction) {
    const position = (window.scrollY - start) / interval;
    return direction > 0 ? Math.floor(position + .01) + 1 : Math.ceil(position - .01) - 1;
  }

  function canStep(direction) {
    if (track.hidden) return false;
    if (transition) return true;
    if (window.scrollY < start - 2 || window.scrollY > start + interval * last + 2) return false;
    const target = checkpointTarget(direction);
    return target >= 0 && target <= last + 1;
  }

  function step(direction) {
    if (transition) return;
    const to = checkpointTarget(direction);
    const from = (window.scrollY - start) / interval;
    const launch = !launched && from < .16 && to === 1;
    if (launch) {
      launched = true;
      stopGear();
      gearButtons.find(button => button.dataset.gear === 'rocket').hidden = true;
    }
    transition = { from, to, launch, focusOnExit: stage.contains(document.activeElement) || document.activeElement === document.body, started: performance.now() };
    scheduleRender();
  }

  function finishStep() {
    if (transition?.launch) rocketDeparted = true;
    transition = undefined;
    gearDirty = true;
  }

  function animateStep(now) {
    if (!transition) return {};
    const { from, to, launch, started } = transition;
    const elapsed = Math.max(0, now - started);
    if (to > last) {
      const jump = reducedMotion.matches ? 1 : Math.min(elapsed / 860, 1);
      const leave = reducedMotion.matches ? 1 : THREE.MathUtils.clamp((elapsed - 690) / 550, 0, 1);
      const trailEnd = start + interval * last;
      window.scrollTo({
        top: trailEnd + stage.clientHeight * (leave * leave * (3 - 2 * leave)),
        behavior: 'instant',
      });
      if (leave === 1) {
        if (transition.focusOnExit) workTitle.focus({ preventScroll: true });
        finishStep();
      } else scheduleRender();
      return { exit: jump ** 1.65, hop: 3.4 * jump * (1 - jump) };
    }
    const leadIn = launch ? 410 : 0;
    const travel = reducedMotion.matches ? 1 : THREE.MathUtils.clamp((elapsed - leadIn) / 1580, 0, 1);
    const eased = travel * travel * (3 - 2 * travel);
    window.scrollTo({ top: start + interval * THREE.MathUtils.lerp(from, to, eased), behavior: 'instant' });
    if (travel === 1) {
      finishStep();
      return {};
    }
    scheduleRender();
    if (!launch) return {};
    return { lift: 2.9 * Math.min(elapsed / 1040, 1) ** 1.8, engine: true };
  }

  function presentStop(index, now, settled) {
    if (!settled || reducedMotion.matches) {
      gestureStart = undefined;
      return {};
    }
    if (presentedStop !== index) {
      presentedStop = index;
      gestureStart = now;
    }
    if (gestureStart === undefined) return {};
    const time = (now - gestureStart) / 1650;
    if (time >= 1) {
      gestureStart = undefined;
      return {};
    }
    scheduleRender();
    const greeting = index === 0 || index === last;
    const envelope = Math.sin(time * Math.PI);
    return {
      hop: (index === 0 || index === 1) && time < .36 ? .145 * Math.sin(time / .36 * Math.PI) : 0,
      wave: greeting ? envelope * (.74 + .24 * Math.sin(time * Math.PI * 9)) : 0,
      point: greeting ? 0 : envelope,
      nod: Math.sin(time * Math.PI * 3) * envelope,
    };
  }

  function setActive(index) {
    if (active === index) return;
    const focused = document.activeElement;
    const moveFocus = panels[active]?.contains(focused)
      || (index !== 0 && gearButtons.some(button => button === focused && button.dataset.gear !== 'guide'));
    active = index;
    syncPersistentTitle(index);
    for (const button of gearButtons) {
      const kind = button.dataset.gear;
      button.hidden = kind !== 'guide' && (index !== 0 || (kind === 'rocket' && launched));
    }
    if (index !== 0) {
      stopGear();
      gearStatus.textContent = '';
    }
    track.dataset.activeStop = panels[index].dataset.stop;
    for (const [i, panel] of panels.entries()) {
      panel.toggleAttribute('data-current', i === index);
      panel.inert = i !== index;
    }
    if (moveFocus) tour.focus();
  }

  function render(now) {
    frame = 0;
    if (reducedMotion.matches && action) stopGear();
    animateGear(now);
    const travelPose = animateStep(now);
    const onTrail = window.scrollY <= start + interval * last + 32;
    const leaving = travelPose.exit !== undefined;
    if (!onTrail || leaving) tour.hide();
    const rawProgress = THREE.MathUtils.clamp((window.scrollY - start) / interval, 0, last);
    const index = Math.round(rawProgress);
    const progress = reducedMotion.matches ? index : rawProgress;
    const landing = !reducedMotion.matches && rawProgress === 0 && touchdown !== null;
    if (landing) {
      touchdown ??= now;
      const arrival = Math.min((now - touchdown) / 820, 1);
      positionCamera(.42 * (1 - arrival) ** 3);
      if (arrival < 1) scheduleRender();
      else touchdown = null;
    } else if (touchdown !== null) {
      touchdown = null;
      positionCamera();
    } else if (previousProgress === progress && !gearDirty && !onTrail) return;
    const walking = Math.abs(progress - index) > .08;
    if (onTrail && !leaving) {
      if (walking) tour.walk(Math.min(Math.ceil(progress), last));
      else tour.show(index);
    }
    const stride = walking ? Math.sin(progress * 15) : 0;
    const travelDir = progress - (previousProgress ?? progress);
    if (Math.abs(travelDir) > 1e-4) facing = Math.sign(travelDir);
    previousProgress = progress;
    setActive(index);
    const gesture = presentStop(index, now, onTrail && !leaving && !walking && !transition && touchdown === null);
    poseGear({
      ...gearPose, ...gesture, ...travelPose, departed: rocketDeparted, route: progress, stride, facing,
      exitDistance: 2 + camera.aspect * 1.15,
    });
    gearDirty = false;
    world.quaternion.setFromAxisAngle(axis, -progress * spacing);
    scene.updateMatrixWorld(true);
    for (const [i, panel] of panels.entries()) {
      const distance = i - progress;
      // Retire the near sign before its perspective expansion covers the guide.
      panel.hidden = distance <= -departure || distance >= approach;
      stations[i].root.visible = !panel.hidden;
      if (panel.hidden) {
        if (panel.contains(document.activeElement)) tour.focus();
        continue;
      }
      const { width, height, unit } = dimensions[i];
      // Project the real display plane into CSS so links sit on its physical frame.
      plane.makeScale(unit, -unit, 1);
      plane.setPosition(-width * unit / 2, height * unit, .012);
      projection.copy(viewport)
        .multiply(camera.projectionMatrix)
        .multiply(camera.matrixWorldInverse)
        .multiply(stations[i].display.matrixWorld)
        .multiply(plane);
      // Keep an invertible depth axis for browser painting and pointer hit testing.
      projection.elements[2] = 0;
      projection.elements[6] = 0;
      projection.elements[10] = 1;
      projection.elements[14] = 0;
      panel.style.transform = `matrix3d(${projection.elements.join(',')})`;
      const opacity = Math.min((distance + departure) / departure, (approach - distance) / .14);
      panel.style.opacity = String(THREE.MathUtils.clamp(opacity, 0, 1));
      panel.style.zIndex = i === index ? '2' : '1';
    }
    guideMouth.getWorldPosition(mouthPosition).project(camera);
    tour.position(mouthPosition, panels[index]);
    renderer.render(scene, camera);
  }

  function scheduleRender() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  function resize() {
    const mastHeight = masthead.offsetHeight;
    document.body.style.setProperty('--mast-height', `${mastHeight}px`);
    const { clientWidth: width, clientHeight: height } = stage;
    if (!width || !height) return;
    interval = Math.max(250, height * .77);
    track.style.setProperty('--route-length', `${interval * last}px`);
    start = track.getBoundingClientRect().top + window.scrollY - mastHeight;
    camera.aspect = width / height;
    cameraDistance = camera.aspect < .7 ? 3.2 : 2.75;
    stations[0].root.position.x = width > 900 ? -.16 : 0;
    frameLanding(camera.aspect < .7);
    positionCamera();
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.65));
    renderer.setSize(width, height, false);
    viewport.set(
      width / 2, 0, 0, width / 2,
      0, -height / 2, 0, height / 2,
      0, 0, 0, 0,
      0, 0, 0, 1
    );
    const focalLength = height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    for (const [i, panel] of panels.entries()) {
      panel.hidden = false;
      const panelWidth = Math.min(i === 0 ? 450 : 370, width - 46);
      panel.style.width = `${panelWidth}px`;
      const panelHeight = panel.offsetHeight;
      const unit = camera.position.z / focalLength * .92;
      const bands = [...panel.querySelectorAll('.sign-plank')].map(board => ({
        top: board.offsetTop,
        height: board.offsetHeight,
      }));
      dimensions[i] = { width: panelWidth, height: panelHeight, unit };
      stations[i].resize(panelWidth * unit, panelHeight * unit, bands.map(board => ({
        top: board.top * unit, height: board.height * unit,
      })));
    }
    previousProgress = undefined;
    tour.resize();
    scheduleRender();
  }

  const observer = new ResizeObserver(resize);
  const ray = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  function gearAt(event) {
    if (active < 0) return;
    const bounds = canvas.getBoundingClientRect();
    pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1,
      1 - (event.clientY - bounds.top) / bounds.height * 2);
    ray.setFromCamera(pointer, camera);
    const targets = pickables.guide.visible ? [pickables.guide] : [];
    if (active === 0) {
      targets.push(pickables.scanner);
      if (!launched) targets.push(pickables.rocket);
    }
    const hit = ray.intersectObjects(targets, true)[0];
    if (!hit) return;
    for (let object = hit.object; object; object = object.parent) {
      const match = Object.entries(pickables).find(([, root]) => root === object);
      if (match) return match[0];
    }
  }
  canvas.addEventListener('click', event => {
    const kind = gearAt(event);
    if (kind) startGear(kind);
  });
  for (const button of gearButtons) button.addEventListener('click', () => startGear(button.dataset.gear));
  stage.querySelector('.tour-voice')?.addEventListener('click', () => startGear('guide'));
  bindCheckpointScroll({ canStep, step, signal: input.signal });
  document.addEventListener('click', event => {
    if (transition && event.target.closest?.('a[href^="#"]')) finishStep();
  }, { signal: input.signal });
  canvas.addEventListener('webglcontextlost', () => {
    input.abort();
    tour.hide();
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('scroll', scheduleRender);
    reducedMotion.removeEventListener('change', scheduleRender);
    const readingTrack = window.scrollY < start + track.offsetHeight;
    track.hidden = true;
    document.body.classList.remove('planet-ready');
    persistentTitle.remove();
    titleMounted = false;
    if (readingTrack) window.scrollTo({ top: 0, behavior: 'instant' });
  }, { once: true });
  window.addEventListener('pagehide', () => {
    if (transition) finishStep();
  });
  window.addEventListener('pageshow', scheduleRender);

  stage.querySelector('.planet-canvas').append(canvas);
  document.body.classList.add('planet-ready');
  track.hidden = false;
  observer.observe(stage);
  observer.observe(masthead);
  window.addEventListener('scroll', scheduleRender, { passive: true });
  reducedMotion.addEventListener('change', scheduleRender);
  resize();
  const hashTarget = location.hash && document.getElementById(location.hash.slice(1));
  function scrollToHash() {
    if (hashTarget) hashTarget.scrollIntoView({ behavior: 'instant' });
  }
  scrollToHash();
  document.fonts.ready.then(() => { resize(); scrollToHash(); });
}

if ('ResizeObserver' in window && 'inert' in HTMLElement.prototype) mountPlanet();
