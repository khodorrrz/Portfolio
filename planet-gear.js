import * as THREE from './vendor/three.module.min.js';

const material = (color, roughness = .75) => new THREE.MeshStandardMaterial({ color, roughness });
const fabric = material('#e5d9c7');
const rubber = material('#34343c');
const orange = material('#e7814b');
const visor = new THREE.MeshStandardMaterial({
  color: '#314553', metalness: .65, roughness: .22, emissive: '#11232b',
});
const lamp = new THREE.MeshBasicMaterial({ color: '#a6e7e4' });
const sphere = new THREE.SphereGeometry(1, 20, 14);
const box = new THREE.BoxGeometry(1, 1, 1);

function part(parent, geometry, finish, x, y, z, sx, sy, sz) {
  const mesh = new THREE.Mesh(geometry, finish);
  mesh.position.set(x, y, z);
  mesh.scale.set(sx, sy, sz);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

export function buildGuide(root) {
  const suit = new THREE.Group();
  root.add(suit);
  part(suit, sphere, fabric, 0, .42, 0, .134, .163, .094);
  part(suit, box, rubber, 0, .43, -.102, .164, .215, .095);
  part(suit, box, orange, 0, .446, .087, .1, .076, .028);
  part(suit, box, lamp, 0, .45, .104, .05, .012, .008);
  const head = new THREE.Group();
  head.position.y = .59;
  suit.add(head);
  part(head, sphere, fabric, 0, .063, 0, .117, .113, .111);
  part(head, sphere, visor, 0, .064, .074, .1, .068, .057);
  for (const side of [-1, 1]) {
    part(head, sphere, orange, side * .112, .06, 0, .026, .044, .041);
  }

  const arms = [];
  const elbows = [];
  const legs = [];
  for (const side of [-1, 1]) {
    const arm = new THREE.Group();
    arm.position.set(side * .128, .5, 0);
    suit.add(arm);
    arms.push(arm);
    part(arm, sphere, orange, 0, 0, 0, .055, .06, .058);
    part(arm, sphere, fabric, side * .012, -.063, 0, .046, .075, .046);
    const elbow = new THREE.Group();
    elbow.position.set(side * .015, -.115, 0);
    arm.add(elbow);
    elbows.push(elbow);
    part(elbow, sphere, fabric, 0, -.038, 0, .041, .066, .04);
    part(elbow, sphere, rubber, side * .008, -.094, .012, .041, .045, .044);
    const leg = new THREE.Group();
    leg.position.set(side * .059, .301, 0);
    suit.add(leg);
    legs.push(leg);
    part(leg, sphere, fabric, 0, -.12, 0, .054, .131, .056);
    part(leg, box, orange, 0, -.164, .037, .065, .073, .031);
    part(leg, sphere, rubber, 0, -.258, .032, .059, .045, .083);
  }
  const mouth = new THREE.Object3D();
  mouth.position.set(0, .031, .124);
  head.add(mouth);

  function pose({ wave, stride, hop, point, nod, facing = 1 }) {
    suit.rotation.y = stride !== 0 ? (facing < 0 ? 0 : Math.PI) : .17 - point * .21;
    suit.position.y = hop + Math.abs(stride) * .025;
    head.rotation.x = nod * .23;
    head.rotation.y = -point * .38;
    arms[0].rotation.x = stride * .55;
    arms[1].rotation.x = -stride * .55;
    arms[1].rotation.z = wave * 2.08 + point * 1.32;
    elbows[0].rotation.x = -.12 - Math.max(0, stride) * .28;
    elbows[1].rotation.x = -.12 - Math.max(0, -stride) * .28;
    elbows[1].rotation.z = wave * .54;
    legs[0].rotation.x = -stride * .62 - hop * 1.05;
    legs[1].rotation.x = stride * .62 + hop * .42;
  }
  return { pose, mouth };
}

export function buildScanner(root) {
  part(root, new THREE.CylinderGeometry(1, 1.16, 1, 12), rubber, 0, .035, 0, .135, .07, .135);
  part(root, box, fabric, 0, .16, 0, .091, .22, .09);
  part(root, box, orange, 0, .238, 0, .14, .055, .13);
  const sensor = new THREE.Group();
  sensor.position.y = .29;
  root.add(sensor);
  part(sensor, box, rubber, 0, .034, 0, .19, .083, .11);
  part(sensor, box, lamp, 0, .034, .057, .133, .023, .01);
  const halo = new THREE.Mesh(
    new THREE.RingGeometry(.91, 1, 48),
    new THREE.MeshBasicMaterial({ color: '#8de8e4', transparent: true, side: THREE.DoubleSide, depthWrite: false }),
  );
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = .18;
  root.add(halo);
  return (turn, pulse) => {
    sensor.rotation.y = turn;
    halo.visible = pulse > 0;
    halo.scale.setScalar(.18 + pulse * .67);
    halo.material.opacity = .52 * (1 - pulse);
  };
}
