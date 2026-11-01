import * as THREE from "three";
import { ROOM_CAMERA_POSITION } from "../data/constants.js";

export function getProjectedMeshRect(mesh, camera, viewportSize) {
  const geometry = mesh.geometry;
  if (!geometry) return null;

  if (!geometry.boundingBox) {
    geometry.computeBoundingBox();
  }

  const { min, max } = geometry.boundingBox;
  const corners = [
    new THREE.Vector3(min.x, min.y, min.z),
    new THREE.Vector3(min.x, min.y, max.z),
    new THREE.Vector3(min.x, max.y, min.z),
    new THREE.Vector3(min.x, max.y, max.z),
    new THREE.Vector3(max.x, min.y, min.z),
    new THREE.Vector3(max.x, min.y, max.z),
    new THREE.Vector3(max.x, max.y, min.z),
    new THREE.Vector3(max.x, max.y, max.z),
  ];

  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for (const corner of corners) {
    corner.applyMatrix4(mesh.matrixWorld).project(camera);

    const x = (corner.x * 0.5 + 0.5) * viewportSize.width;
    const y = (-corner.y * 0.5 + 0.5) * viewportSize.height;

    left = Math.min(left, x);
    top = Math.min(top, y);
    right = Math.max(right, x);
    bottom = Math.max(bottom, y);
  }

  return {
    left,
    top,
    width: right - left,
    height: bottom - top,
  };
}

export function getScreenFocusCameraState(screenPosition, isMobile) {
  const screenCenter = Array.isArray(screenPosition)
    ? new THREE.Vector3(...screenPosition)
    : screenPosition.clone();
  const roomPosition = new THREE.Vector3(...ROOM_CAMERA_POSITION);
  const directionFromScreenToRoomCamera = roomPosition
    .clone()
    .sub(screenCenter);
  directionFromScreenToRoomCamera.y = 0;

  if (directionFromScreenToRoomCamera.lengthSq() === 0) {
    directionFromScreenToRoomCamera.set(0, 0, 1);
  } else {
    directionFromScreenToRoomCamera.normalize();
  }

  const focusDistance = isMobile ? 0.78 : 1.15;
  const focusPosition = screenCenter
    .clone()
    .add(directionFromScreenToRoomCamera.multiplyScalar(focusDistance));
  focusPosition.y = screenCenter.y;

  return {
    position: focusPosition,
    target: screenCenter,
  };
}
