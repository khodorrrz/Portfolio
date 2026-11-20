import * as THREE from './vendor/three.module.min.js';
import { buildGuide, buildScanner } from './planet-gear.js';

export const radius = 8.5;
const crown = new THREE.Vector3(0, 1, 0);
const axis = new THREE.Vector3(-1, 0, 0);
const up = new THREE.Vector3(0, 1, 0);
const craters = [
  new THREE.Vector3(-.39, .48, .78).normalize(),
  new THREE.Vector3(.47, .29, .83).normalize(),
  new THREE.Vector3(-.35, .16, -.92).normalize(),
  new THREE.Vector3(.23, -.56, -.81).normalize(),
];

function directionAt(angle) {
  return crown.clone().applyAxisAngle(axis, angle);
}

function elevation(direction) {
  const { x, y, z } = direction;
  let height = .05 * Math.sin(x * 13 + z * 7) * Math.cos(y * 11 - z * 4)
    + .065 * Math.sin(x * 4 + y * 6) * Math.cos(z * 5 - x * 3)
    + .013 * Math.sin(x * 81 + y * 39) * Math.cos(z * 73);
  for (const crater of craters) {
    const distance = (1 - direction.dot(crater)) / .03;
    if (distance < 1) height += -.19 * (1 - distance) ** 2;
    if (distance < 1.5) height += .055 * Math.exp(-((distance - .87) ** 2) * 24);
  }
  return height;
}

function surface(direction, height = 0) {
  return direction.clone().multiplyScalar(radius + elevation(direction) + height);
}

function makeTerrain() {
  const geometry = new THREE.SphereGeometry(1, 192, 128);
  const positions = geometry.attributes.position;
  const direction = new THREE.Vector3();
  const dark = new THREE.Color('#3a1d19');
  const light = new THREE.Color('#b86d44');
  const color = new THREE.Color();
  const colors = [];
  for (let i = 0; i < positions.count; i++) {
    direction.fromBufferAttribute(positions, i).normalize();
    const { x, y, z } = direction;
    const height = elevation(direction);
    const point = surface(direction);
    positions.setXYZ(i, point.x, point.y, point.z);
    const strata = Math.sin(y * 79 + Math.sin(x * 11 + z * 3) * 3);
    const patch = Math.cos(x * 29 - z * 23 + y * 8) * Math.sin(z * 31);
    color.copy(dark).lerp(light, THREE.MathUtils.clamp(.51 + height * 2.5 + strata * .07 + patch * .1, 0, 1));
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const grainCanvas = document.createElement('canvas');
  grainCanvas.width = 1024;
  grainCanvas.height = 512;
  const context = grainCanvas.getContext('2d');
  const grain = context.createImageData(1024, 512);
  let seed = 413;
  for (let i = 0; i < grain.data.length; i += 4) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const value = 80 + (seed >>> 24) * .55;
    grain.data[i] = grain.data[i + 1] = grain.data[i + 2] = value;
    grain.data[i + 3] = 255;
  }
  context.putImageData(grain, 0, 0);
  const bumpMap = new THREE.CanvasTexture(grainCanvas);
  const terrain = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
    vertexColors: true, roughness: 1, bumpMap, bumpScale: .055,
  }));
  terrain.receiveShadow = true;
  return terrain;
}

function place(world, direction, height = 0) {
  const landmark = new THREE.Group();
  landmark.position.copy(surface(direction, height));
  landmark.quaternion.setFromUnitVectors(up, direction);
  world.add(landmark);
  return landmark;
}

function makeRocket(world, direction) {
  const rocket = place(world, direction, .055);
  const craft = new THREE.Group();
  rocket.add(craft);
  const ceramic = new THREE.MeshStandardMaterial({ color: '#eeeae3', roughness: .48 });
  const orange = new THREE.MeshStandardMaterial({ color: '#f77836', roughness: .48 });
  const steel = new THREE.MeshStandardMaterial({ color: '#29282a', roughness: .7 });
  const window = new THREE.MeshStandardMaterial({ color: '#263645', metalness: .42, roughness: .19 });
  const alloy = new THREE.MeshStandardMaterial({ color: '#9a8c82', metalness: .65, roughness: .36 });
  function part(geometry, material, x, y, z) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    craft.add(mesh);
    return mesh;
  }
  rocket.add(part(new THREE.CylinderGeometry(.4, .43, .065, 12), steel, 0, .02, 0));
  rocket.add(part(new THREE.CylinderGeometry(.375, .375, .008, 12), alloy, 0, .057, 0));
  part(new THREE.CylinderGeometry(.15, .19, .6, 24), ceramic, 0, .48, 0);
  part(new THREE.ConeGeometry(.15, .31, 24), orange, 0, .93, 0);
  part(new THREE.CylinderGeometry(.13, .18, .13, 16), steel, 0, .14, 0);
  part(new THREE.CylinderGeometry(.171, .173, .026, 32), alloy, 0, .48, 0);
  part(new THREE.CylinderGeometry(.189, .19, .031, 32), steel, 0, .2, 0);
  part(new THREE.TorusGeometry(.058, .009, 8, 24), alloy, 0, .627, .159);
  part(new THREE.SphereGeometry(.055, 24, 16), window, 0, .627, .164).scale.z = .42;
  for (let i = 0; i < 3; i++) {
    const angle = i * Math.PI * 2 / 3;
    const fin = part(new THREE.ConeGeometry(.14, .36, 3), orange,
      Math.sin(angle) * .18, .28, Math.cos(angle) * .18);
    fin.rotation.y = angle;
    part(new THREE.CylinderGeometry(.023, .039, .035, 12), steel,
      Math.sin(angle) * .273, .075, Math.cos(angle) * .273);
  }
  const exhaust = part(new THREE.ConeGeometry(.071, .24, 16),
    new THREE.MeshBasicMaterial({ color: '#ffb661' }), 0, -.012, 0);
  exhaust.rotation.z = Math.PI;
  exhaust.castShadow = false;
  exhaust.visible = false;
  return { rocket, craft, exhaust };
}

export function buildWorld(scene, count, spacing) {
  const world = new THREE.Group();
  scene.add(world);
  scene.fog = new THREE.FogExp2('#a37469', .084);
  world.add(makeTerrain());

  const stone = new THREE.IcosahedronGeometry(1, 1);
  const rockMaterials = ['#7c4931', '#452b25', '#b88259'].map(color =>
    new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true }));
  const trailMaterial = new THREE.MeshStandardMaterial({ color: '#735142', roughness: 1 });
  const amber = new THREE.MeshBasicMaterial({ color: '#ffc085' });
  const stakeGeometry = new THREE.BoxGeometry(.035, .18, .035);
  const lampGeometry = new THREE.BoxGeometry(.044, .028, .044);
  const path = [];
  for (let i = -28; i <= (count - 1) * 30 + 20; i++) {
    const center = directionAt(i * spacing / 30);
    for (const side of [-1, 1]) {
      path.push(...surface(center.clone().setX(side * .034).normalize(), .034).toArray());
    }
    if (i % 4 !== 0) continue;
    for (const side of [-1, 1]) {
      const direction = center.clone().setX(side * .051).normalize();
      const stake = place(world, direction);
      const shaft = new THREE.Mesh(stakeGeometry, trailMaterial);
      shaft.position.y = .075;
      shaft.castShadow = true;
      stake.add(shaft);
      const lamp = new THREE.Mesh(lampGeometry, amber);
      lamp.position.y = .174;
      stake.add(lamp);
    }
  }
  const trailGeometry = new THREE.BufferGeometry();
  trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(path, 3));
  const indices = [];
  for (let i = 0; i < path.length / 3 - 2; i += 2) indices.push(i, i + 1, i + 2, i + 1, i + 3, i + 2);
  trailGeometry.setIndex(indices);
  trailGeometry.computeVertexNormals();
  trailMaterial.side = THREE.DoubleSide;
  const trail = new THREE.Mesh(trailGeometry, trailMaterial);
  trail.receiveShadow = true;
  world.add(trail);

  const stations = Array.from({ length: count }, (_, i) =>
    createStation(world, directionAt(i * spacing), i * spacing));

  // Keep the astronaut's lane and the scanner's landing area clear.
  for (let i = 0; i < 260; i++) {
    const angle = (i / 259) * ((count - 1) * spacing + .85) - .36;
    const side = i % 2 === 0 ? 1 : -1;
    const offset = .07 + .35 * ((Math.sin(i * 38.37) + 1) / 2) ** 1.8;
    if (side < 0 && offset < .15) continue;
    if (side > 0 && angle > -.19 && angle < .08 && offset < .135) continue;
    const direction = directionAt(angle).setX(offset * side).normalize();
    const cluster = place(world, direction);
    const rock = new THREE.Mesh(stone, rockMaterials[i % rockMaterials.length]);
    const size = .045 + .52 * ((Math.sin(i * 41.7) + 1) / 2) ** 3 * (offset + .4);
    rock.scale.set(size * 1.6, size * .82, size);
    rock.position.y = size * .22;
    rock.rotation.y = i;
    rock.castShadow = true;
    rock.receiveShadow = true;
    cluster.add(rock);
  }
  const { rocket, craft, exhaust } = makeRocket(world, new THREE.Vector3(.087, 1, -.071).normalize());
  const guide = place(world, crown);
  const scanner = place(world, crown);
  const { pose: poseGuide, mouth: guideMouth } = buildGuide(guide);
  const poseScanner = buildScanner(scanner);
  let narrowLanding = false;
  function positionGear(root, direction) {
    direction.normalize();
    root.position.copy(surface(direction, .012));
    root.quaternion.setFromUnitVectors(up, direction);
  }
  function poseGear({
    route = 0, wave = 0, stride = 0, hop = 0, point = 0, nod = 0, exit = 0, exitDistance = 0,
    lift = 0, engine = false, departed = false, turn = 0, pulse = 0, facing = 1,
  } = {}) {
    // Offset along the trail so the guide stays in the same foreground lane
    // when the planet rotates, including at stops on its far side.
    const lead = directionAt(route * spacing - (narrowLanding ? .128 : .09));
    lead.x = narrowLanding ? -.037 : -.084;
    positionGear(guide, lead);
    guide.visible = exit < 1;
    guide.position.x -= exit * exitDistance;
    guide.rotateY(-Math.PI / 2 * Math.min(exit * 5, 1));
    poseGuide({ wave, stride, hop, point, nod, facing });
    craft.position.y = lift;
    craft.visible = !departed;
    exhaust.visible = engine;
    poseScanner(turn, pulse);
  }

  scene.add(new THREE.HemisphereLight('#cebfce', '#573127', 1.55));
  const sun = new THREE.DirectionalLight('#ffd3aa', 3.1);
  sun.position.set(5.5, radius + 4, -3.7);
  sun.target.position.set(0, radius, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = sun.shadow.camera.bottom = -4;
  sun.shadow.camera.right = sun.shadow.camera.top = 4;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 14;
  sun.shadow.normalBias = .018;
  sun.shadow.bias = -.0003;
  scene.add(sun, sun.target);
  const fill = new THREE.DirectionalLight('#cfbbd9', .8);
  fill.position.set(3, 7, 8);
  scene.add(fill);
  function frameLanding(narrow) {
    narrowLanding = narrow;
    const direction = new THREE.Vector3(narrow ? .068 : .087, 1, -.071).normalize();
    rocket.position.copy(surface(direction, .055));
    rocket.quaternion.setFromUnitVectors(up, direction);
    rocket.scale.y = narrow ? 1.17 : 1;
    guide.scale.setScalar(narrow ? .52 : .9);
    scanner.scale.setScalar(narrow ? .75 : 1);
    positionGear(scanner, new THREE.Vector3(narrow ? .039 : .072, 1, .126));
  }
  return { world, axis, stations, frameLanding, poseGear, guideMouth, pickables: { guide, rocket, scanner } };
}

function createStation(world, direction, angle) {
  const root = place(world, direction, -.04);
  root.quaternion.setFromAxisAngle(axis, angle);
  const frame = new THREE.MeshStandardMaterial({ color: '#453b3b', metalness: .3, roughness: .72 });
  const enamel = new THREE.MeshStandardMaterial({ color: '#423132', roughness: .82 });
  const box = new THREE.BoxGeometry(1, 1, 1);
  const supports = (angle === 0 ? [0] : [-.29, .29]).map(offset => {
    const post = new THREE.Mesh(box, frame);
    post.position.z = -.041;
    post.castShadow = true;
    const foot = new THREE.Mesh(box, frame);
    foot.scale.set(.105, .045, .125);
    foot.position.set(0, .034, -.035);
    foot.castShadow = true;
    root.add(post, foot);
    return { post, foot, offset };
  });
  const display = new THREE.Group();
  display.position.set(0, .31, .015);
  root.add(display);
  const planks = [];

  function resize(width, height, bands) {
    for (const { post, foot, offset } of supports) {
      post.scale.set(.053, .32 + height, .065);
      post.position.x = foot.position.x = width * offset;
      post.position.y = post.scale.y / 2 - .045;
    }
    bands.forEach(({ top, height: thickness }, index) => {
      if (!planks[index]) {
        planks[index] = new THREE.Mesh(box, enamel);
        planks[index].castShadow = true;
        display.add(planks[index]);
      }
      const plank = planks[index];
      plank.scale.set(width + .014, thickness, .035);
      plank.position.set(0, height - top - thickness / 2, -.01);
    });
  }
  return { root, display, resize };
}
