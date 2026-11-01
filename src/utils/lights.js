import * as THREE from "three";
import {
  LAMP_BULB_MATERIAL_NAME,
  LAMP_LIGHT_COLOR,
} from "../data/constants.js";

export function materialMatchesName(material, name) {
  if (!material) return false;

  if (Array.isArray(material)) {
    return material.some((entry) => materialMatchesName(entry, name));
  }

  return material.name === name;
}

export function cloneAndWarmBulbMaterial(material) {
  if (!material) return material;

  if (Array.isArray(material)) {
    return material.map(cloneAndWarmBulbMaterial);
  }

  if (material.name !== LAMP_BULB_MATERIAL_NAME) return material;

  const nextMaterial = material.clone();
  if (nextMaterial.emissive) {
    nextMaterial.emissive.set(LAMP_LIGHT_COLOR);
    nextMaterial.emissiveIntensity = 3.2;
  }
  nextMaterial.toneMapped = false;
  nextMaterial.needsUpdate = true;

  return nextMaterial;
}

export function createDeskLightPoolTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;

  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, "rgba(255, 240, 190, 0.38)");
  gradient.addColorStop(0.28, "rgba(255, 211, 138, 0.24)");
  gradient.addColorStop(0.62, "rgba(255, 180, 82, 0.1)");
  gradient.addColorStop(0.86, "rgba(255, 159, 55, 0.03)");
  gradient.addColorStop(1, "rgba(255, 180, 82, 0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

export function makeInvisibleButClickable(material) {
  if (!material) return;

  material.transparent = true;
  material.opacity = 0;
  material.depthWrite = false;
  material.needsUpdate = true;
}
