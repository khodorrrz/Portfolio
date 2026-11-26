import * as THREE from './vendor/three.module.min.js';

const material = (color, metalness = 0.15, roughness = 0.48) =>
  new THREE.MeshStandardMaterial({ color, metalness, roughness });

const graphite = material('#18372b');
const boardGreen = material('#285b40');
const jade = material('#5a8252');
const brass = material('#e2c875', 0.55, 0.32);
const nickel = material('#b8c6ac', 0.5, 0.34);
const enamel = material('#d6ef8a', 0.12, 0.32);
const circuit = new THREE.MeshBasicMaterial({ color: '#a7bb66' });

function roundedPlate(width, depth, height, radius) {
  const x = width / 2;
  const y = depth / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-x + radius, -y);
  shape.lineTo(x - radius, -y);
  shape.quadraticCurveTo(x, -y, x, -y + radius);
  shape.lineTo(x, y - radius);
  shape.quadraticCurveTo(x, y, x - radius, y);
  shape.lineTo(-x + radius, y);
  shape.quadraticCurveTo(-x, y, -x, y - radius);
  shape.lineTo(-x, -y + radius);
  shape.quadraticCurveTo(-x, -y, -x + radius, -y);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height, curveSegments: 6, bevelEnabled: true,
    bevelThickness: 0.027, bevelSize: 0.027, bevelSegments: 2
  });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function place(parent, geometry, finish, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(geometry, finish);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

function printedFace(parent, width, depth, y, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = Math.round(canvas.width * depth / width);
  const context = canvas.getContext('2d');
  draw(context, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const face = place(parent, new THREE.PlaneGeometry(width, depth),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }), 0, y);
  face.rotation.x = -Math.PI / 2;
}

function buildStack() {
  const base = new THREE.Group();
  const board = new THREE.Group();
  const memory = new THREE.Group();
  const processor = new THREE.Group();

  place(base, roundedPlate(4.7, 4.15, 0.35, 0.23), graphite);
  place(base, roundedPlate(4.62, 4.07, 0.04, 0.22), brass, 0, 0.11);
  place(base, roundedPlate(4.49, 3.94, 0.09, 0.19), jade, 0, 0.36);
  const vent = new THREE.BoxGeometry(0.085, 0.065, 0.035);
  for (let index = 0; index < 24; index++) {
    place(base, vent, nickel, -1.85 + index * 0.12, 0.255, 2.078);
  }
  place(base, new THREE.BoxGeometry(0.33, 0.08, 0.025), enamel, 1.65, 0.25, 2.09);

  place(board, roundedPlate(4.29, 3.72, 0.13, 0.17), boardGreen);
  printedFace(board, 4.26, 3.69, 0.16, (context, width, height) => {
    context.strokeStyle = '#88ab79';
    context.lineWidth = 2;
    context.strokeRect(48, 46, width - 96, height - 92);
    context.fillStyle = '#b6cb91';
    context.font = '23px monospace';
    context.fillText('KE / RETRIEVAL BOARD', 53, height - 59);
    context.font = '17px monospace';
    context.fillText('SCOPE / SEARCH / RANK / CITE', 53, 76);
    for (let x = 80; x < width - 55; x += 26) {
      for (let y = 102; y < height - 84; y += 26) {
        context.globalAlpha = (x + y) % 3 === 0 ? 0.48 : 0.2;
        context.fillRect(x, y, 3, 3);
      }
    }
  });

  const bolt = new THREE.CylinderGeometry(0.094, 0.094, 0.12, 16);
  const post = new THREE.CylinderGeometry(0.075, 0.075, 0.44, 12);
  for (const x of [-1.87, 1.87]) {
    for (const z of [-1.59, 1.59]) {
      place(base, post, nickel, x, 0.63, z);
      place(board, bolt, brass, x, 0.2, z);
    }
  }

  const pin = new THREE.CylinderGeometry(0.025, 0.025, 0.013, 9);
  const point = (x, z) => new THREE.Vector3(x, 0.179, z);
  for (const side of [-1, 1]) {
    for (let index = 0; index < 11; index++) {
      const x = (index - 5) * 0.13;
      const endX = x * 2.38;
      const endZ = side * (1.37 - Math.abs(index - 5) * 0.025);
      const points = [point(x, side * 0.43), point(x, side * 0.72),
        point(endX, endZ - side * 0.14), point(endX, endZ)];
      const route = new THREE.CurvePath();
      points.slice(1).forEach((end, index) => route.add(new THREE.LineCurve3(points[index], end)));
      place(board, new THREE.TubeGeometry(route, 16, 0.009, 4, false), circuit);
      place(board, pin, brass, endX, 0.18, endZ);
    }
  }

  const block = roundedPlate(0.74, 0.45, 0.14, 0.055);
  const contact = new THREE.BoxGeometry(0.045, 0.055, 0.61);
  for (const x of [-1.47, 1.47]) {
    for (const z of [-0.93, -0.31, 0.31, 0.93]) {
      place(memory, block, graphite, x, 0, z);
      for (let index = -2; index <= 2; index++) {
        place(memory, contact, brass, x + index * 0.13, 0.02, z);
      }
      place(memory, new THREE.BoxGeometry(0.24, 0.018, 0.025), jade, x, 0.17, z);
    }
  }

  place(processor, roundedPlate(2.18, 1.93, 0.14, 0.13), graphite);
  place(processor, roundedPlate(1.97, 1.72, 0.07, 0.12), brass, 0, 0.15);
  place(processor, roundedPlate(1.83, 1.58, 0.21, 0.12), enamel, 0, 0.21);
  const chipPin = new THREE.BoxGeometry(0.075, 0.08, 0.25);
  for (let index = -5; index <= 5; index++) {
    for (const side of [-1, 1]) {
      place(processor, chipPin, brass, index * 0.165, 0.06, side * 0.98);
      place(processor, chipPin, brass, side * 1.11, 0.06, index * 0.145).rotation.y = Math.PI / 2;
    }
  }
  printedFace(processor, 1.8, 1.55, 0.45, (context, width, height) => {
    context.strokeStyle = '#627c45';
    context.lineWidth = 3;
    context.strokeRect(53, 51, width - 106, height - 102);
    context.fillStyle = '#294933';
    context.font = 'bold 198px system-ui';
    context.fillText('RAG', 95, 315);
    context.font = '30px monospace';
    context.fillText('DOCUMENT ENGINE', 102, 383);
    context.fillText('KE / 01', 102, height - 76);
    context.fillRect(width - 124, height - 100, 28, 28);
  });
  return [base, board, memory, processor];
}

export function mountModel(stage) {
  const canvas = document.createElement('canvas');
  const options = { alpha: true, antialias: true };
  const context = canvas.getContext('webgl2', options) || canvas.getContext('webgl', options);
  if (!context) return;
  const renderer = new THREE.WebGLRenderer({ ...options, canvas, context });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera();
  camera.position.set(6.8, 5.1, 8.6);
  camera.lookAt(0, -0.24, 0);
  const stack = new THREE.Group();
  const layers = buildStack();
  stack.add(...layers);
  scene.add(stack, new THREE.HemisphereLight('#faffdf', '#688869', 2.15));
  for (const [color, intensity, position] of [
    ['#fff4cf', 3.4, [-4, 8, 5]],
    ['#b7ebc1', 2.2, [5, 3, -5]]
  ]) {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...position);
    scene.add(light);
  }

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const assembled = [-1.24, -0.73, -0.53, -0.53];
  const exploded = [-1.36, -0.53, 0.27, 1.06];
  let yaw = -0.12;
  let pitch = 0;
  let spread = 1;
  let expanded = true;
  let frame = 0;
  let lastTime = 0;
  let drag;
  layers.forEach((layer, index) => { layer.position.y = exploded[index]; });
  stack.rotation.y = yaw;

  function draw(time) {
    frame = 0;
    const delta = lastTime ? Math.min(time - lastTime, 50) : 16;
    lastTime = time;
    const blend = motion.matches ? 1 : 1 - Math.exp(-delta / 82);
    stack.rotation.y = THREE.MathUtils.lerp(stack.rotation.y, yaw, blend);
    stack.rotation.x = THREE.MathUtils.lerp(stack.rotation.x, pitch, blend);
    const target = Number(expanded);
    spread = THREE.MathUtils.lerp(spread, target, blend);
    layers.forEach((layer, index) => {
      layer.position.y = THREE.MathUtils.lerp(assembled[index], exploded[index], spread);
    });
    renderer.render(scene, camera);
    if (Math.abs(spread - target) + Math.abs(stack.rotation.y - yaw) + Math.abs(stack.rotation.x - pitch) > 0.002) {
      schedule();
    } else {
      lastTime = 0;
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(draw);
  }

  function resize() {
    const { clientWidth: width, clientHeight: height } = stage;
    if (!width || !height) return;
    const aspect = width / height;
    const half = Math.max(3.0, 3.65 / aspect);
    camera.left = -half * aspect;
    camera.right = half * aspect;
    camera.top = half;
    camera.bottom = -half;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  }

  const controls = stage.querySelector('.model-controls');
  const hint = document.querySelector('#model-hint');
  resize();
  stage.append(renderer.domElement);
  stage.classList.add('model-ready');
  controls.hidden = false;
  hint.textContent = 'Drag or use the controls to explore';
  const observer = new ResizeObserver(resize);
  observer.observe(stage);

  stage.querySelector('#rotate-model').addEventListener('click', () => {
    yaw += Math.PI / 4;
    schedule();
  });
  const explode = stage.querySelector('#explode-model');
  explode.addEventListener('click', () => {
    expanded = !expanded;
    explode.querySelector('span').textContent = expanded ? 'Assemble' : 'Explode';
    schedule();
  });

  canvas.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return;
    yaw += (event.clientX - drag.x) * 0.009;
    pitch = THREE.MathUtils.clamp(pitch + (event.clientY - drag.y) * 0.006, -0.38, 0.38);
    drag.x = event.clientX;
    drag.y = event.clientY;
    schedule();
  });
  canvas.addEventListener('lostpointercapture', () => { drag = undefined; });
  canvas.addEventListener('webglcontextlost', () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    stage.classList.remove('model-ready');
    controls.hidden = true;
    hint.textContent = 'Illustration of the retrieval stack';
    canvas.remove();
    renderer.dispose();
  }, { once: true });
}
