import React, { useEffect, useMemo, useRef } from "react";
import { Center, Html, useGLTF, useProgress } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  MODEL_PATH,
  LAMP_BULB_NODE_NAME,
  LAMP_BULB_MATERIAL_NAME,
  LAMP_LIGHT_COLOR,
  DESK_LIGHT_TARGET_POSITION,
  DESK_LIGHT_POOL_POSITION,
  DESK_LIGHT_POOL_RADIUS,
} from "../data/constants.js";
import {
  getProjectedMeshRect,
  getScreenFocusCameraState,
} from "../utils/geometry.js";
import {
  materialMatchesName,
  cloneAndWarmBulbMaterial,
  createDeskLightPoolTexture,
} from "../utils/lights.js";

export function Model({
  isMobile,
  isScreenFocused,
  onFinalScreenRectChange,
  onScreenClick,
  onScreenReady,
  onScreenRectChange,
}) {
  const { scene } = useGLTF(MODEL_PATH);
  const { camera, size } = useThree();
  const model = useMemo(() => scene.clone(true), [scene]);
  const modelGroupRef = useRef(null);
  const screenMaterialRef = useRef(null);
  const screenHitboxRef = useRef(null);
  const poolMaterialRef = useRef(null);
  const hoverRef = useRef(false);
  const lastScreenRectRef = useRef(null);
  const finalScreenCameraRef = useRef(null);

  useEffect(() => {
    const createdLights = [];
    const createdObjects = [];
    const clonedMaterials = [];
    const createdMaterials = [];
    const createdTextures = [];
    let bulbNode = null;

    model.traverse((child) => {
      if (child.isMesh) {
        const isScreenHitbox = child.name === "Screen_Hitbox";
        const isLampBulb =
          child.name === LAMP_BULB_NODE_NAME ||
          materialMatchesName(child.material, LAMP_BULB_MATERIAL_NAME);

        child.castShadow = !isScreenHitbox && !isLampBulb;
        child.receiveShadow = !isScreenHitbox;

        if (isLampBulb) {
          child.material = cloneAndWarmBulbMaterial(child.material);
          bulbNode = child;

          if (Array.isArray(child.material)) {
            clonedMaterials.push(
              ...child.material.filter(
                (material) => material.name === LAMP_BULB_MATERIAL_NAME,
              ),
            );
          } else if (child.material) {
            clonedMaterials.push(child.material);
          }
        }
      }

      if (child.name !== "Screen_Hitbox") return;

      const overlayMaterial = new THREE.MeshBasicMaterial({
        color: "#8f949c",
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      child.material = overlayMaterial;
      screenMaterialRef.current = overlayMaterial;
      screenHitboxRef.current = child;
    });

    if (bulbNode) {
      model.updateWorldMatrix(true, true);
      bulbNode.updateWorldMatrix(true, false);

      const bulbWorldPosition = new THREE.Vector3();
      bulbNode.getWorldPosition(bulbWorldPosition);
      const bulbModelPosition = model.worldToLocal(bulbWorldPosition.clone());

      const lampTarget = new THREE.Object3D();
      lampTarget.name = "KhodorOS_LampSpotTarget";
      lampTarget.position.set(...DESK_LIGHT_TARGET_POSITION);
      model.add(lampTarget);
      createdObjects.push(lampTarget);

      const lampSpot = new THREE.SpotLight(
        LAMP_LIGHT_COLOR,
        520,
        18,
        Math.PI / 5.2,
        0.34,
        0.9,
      );
      lampSpot.name = "KhodorOS_LampSpotLight";
      lampSpot.castShadow = true;
      lampSpot.target = lampTarget;
      lampSpot.position.copy(bulbModelPosition);
      lampSpot.shadow.mapSize.set(1024, 1024);
      lampSpot.shadow.camera.near = 0.08;
      lampSpot.shadow.camera.far = 13;
      lampSpot.shadow.bias = -0.0007;
      lampSpot.shadow.normalBias = 0.045;
      model.add(lampSpot);
      createdLights.push(lampSpot);

      const bulbGlow = new THREE.PointLight(LAMP_LIGHT_COLOR, 12, 3.8, 2);
      bulbGlow.name = "KhodorOS_BulbGlow";
      bulbNode.add(bulbGlow);
      createdLights.push(bulbGlow);

      const lightPoolTexture = createDeskLightPoolTexture();
      const lightPoolMaterial = new THREE.MeshBasicMaterial({
        map: lightPoolTexture,
        transparent: true,
        opacity: 0.32,
        depthTest: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
        side: THREE.DoubleSide,
      });
      const lightPool = new THREE.Mesh(
        new THREE.CircleGeometry(DESK_LIGHT_POOL_RADIUS, 96),
        lightPoolMaterial,
      );
      lightPool.name = "KhodorOS_DeskLightPool";
      lightPool.position.set(...DESK_LIGHT_POOL_POSITION);
      lightPool.rotation.x = -Math.PI / 2;
      lightPool.renderOrder = 3;
      model.add(lightPool);
      poolMaterialRef.current = lightPoolMaterial;
      createdObjects.push(lightPool);
      createdMaterials.push(lightPoolMaterial);
      createdTextures.push(lightPoolTexture);
    }

    return () => {
      createdLights.forEach((light) => {
        light.parent?.remove(light);
        light.shadow?.dispose?.();
      });
      createdObjects.forEach((object) => object.parent?.remove(object));
      clonedMaterials.forEach((material) => material.dispose());
      createdMaterials.forEach((material) => material.dispose());
      createdTextures.forEach((texture) => texture.dispose());
      screenMaterialRef.current?.dispose();
      poolMaterialRef.current = null;
      hoverRef.current = false;
    };
  }, [model]);

  useEffect(() => {
    const screenMaterial = screenMaterialRef.current;
    if (!screenMaterial) return;

    // ponytail: hover=0.12 hint, focused=1, idle=0 — smallest opacity hint that signals clickable
    if (isScreenFocused) {
      screenMaterial.opacity = 1;
    } else {
      screenMaterial.opacity = hoverRef.current ? 0.12 : 0;
    }
    screenMaterial.color.set("#8f949c");
    screenMaterial.transparent = true;
    screenMaterial.depthWrite = false;
    screenMaterial.side = THREE.DoubleSide;
    screenMaterial.needsUpdate = true;
  }, [isScreenFocused]);

  useEffect(() => {
    const group = modelGroupRef.current;
    if (!group) return;

    let screenHitbox = null;
    group.traverse((child) => {
      if (child.name === "Screen_Hitbox") {
        screenHitbox = child;
      }
    });

    if (!screenHitbox) {
      console.warn("Screen_Hitbox was not found in the GLB.");
      return;
    }

    group.updateWorldMatrix(true, true);

    const screenBounds = new THREE.Box3().setFromObject(screenHitbox);
    const screenCenter = screenBounds.getCenter(new THREE.Vector3());

    onScreenReady({
      position: screenCenter.toArray(),
    });
  }, [model, onScreenReady]);

  useEffect(() => {
    if (!isScreenFocused) return;

    const screenHitbox = screenHitboxRef.current;
    if (!screenHitbox) return;

    screenHitbox.updateWorldMatrix(true, false);

    const screenBounds = new THREE.Box3().setFromObject(screenHitbox);
    const screenCenter = screenBounds.getCenter(new THREE.Vector3());
    const focusCameraState = getScreenFocusCameraState(screenCenter, isMobile);

    if (!finalScreenCameraRef.current) {
      finalScreenCameraRef.current = new THREE.PerspectiveCamera();
    }

    const finalScreenCamera = finalScreenCameraRef.current;
    finalScreenCamera.fov = camera.fov;
    finalScreenCamera.near = camera.near;
    finalScreenCamera.far = camera.far;
    finalScreenCamera.aspect = size.width / size.height;
    finalScreenCamera.position.copy(focusCameraState.position);
    finalScreenCamera.up.copy(camera.up);
    finalScreenCamera.lookAt(focusCameraState.target);
    finalScreenCamera.updateProjectionMatrix();
    finalScreenCamera.updateMatrixWorld(true);

    const finalScreenRect = getProjectedMeshRect(
      screenHitbox,
      finalScreenCamera,
      size,
    );

    if (finalScreenRect) {
      onFinalScreenRectChange(finalScreenRect);
    }
  }, [
    camera,
    isMobile,
    isScreenFocused,
    onFinalScreenRectChange,
    size,
    size.height,
    size.width,
  ]);

  useFrame(() => {
    if (!isScreenFocused) return;

    const screenHitbox = screenHitboxRef.current;
    if (!screenHitbox) return;

    screenHitbox.updateWorldMatrix(true, false);

    const nextRect = getProjectedMeshRect(screenHitbox, camera, size);
    if (!nextRect) return;

    const prevRect = lastScreenRectRef.current;
    const hasMeaningfulChange =
      !prevRect ||
      Math.abs(prevRect.left - nextRect.left) > 0.5 ||
      Math.abs(prevRect.top - nextRect.top) > 0.5 ||
      Math.abs(prevRect.width - nextRect.width) > 0.5 ||
      Math.abs(prevRect.height - nextRect.height) > 0.5;

    if (!hasMeaningfulChange) return;

    lastScreenRectRef.current = nextRect;
    onScreenRectChange(nextRect);
  });

  useFrame(({ clock }) => {
    const mat = poolMaterialRef.current;
    if (!mat) return;
    if (isScreenFocused) {
      if (mat.opacity !== 0.32) mat.opacity = 0.32;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (mat.opacity !== 0.32) mat.opacity = 0.32;
      return;
    }
    mat.opacity = 0.32 + Math.sin(clock.getElapsedTime() * 1.1) * 0.04;
  });

  const handlePointerDown = (event) => {
    if (event.object.name !== "Screen_Hitbox") return;

    event.stopPropagation();
    if (import.meta.env.DEV) {
      console.log("Screen_Hitbox clicked", {
        objectName: event.object.name,
        point: event.point.toArray().map((value) => Number(value.toFixed(3))),
      });
    }
    onScreenClick();
  };

  const handlePointerOver = (event) => {
    if (event.object.name !== "Screen_Hitbox") return;
    if (isScreenFocused) return;
    hoverRef.current = true;
    const m = screenMaterialRef.current;
    if (m) m.opacity = 0.12;
  };

  const handlePointerOut = (event) => {
    if (event.object.name !== "Screen_Hitbox") return;
    hoverRef.current = false;
    if (isScreenFocused) return;
    const m = screenMaterialRef.current;
    if (m) m.opacity = 0;
  };

  return (
    <Center>
      <group ref={modelGroupRef} rotation={[0, -Math.PI / 2, 0]}>
        <primitive
          object={model}
          onPointerDown={handlePointerDown}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      </group>
    </Center>
  );
}

useGLTF.preload(MODEL_PATH);

export function ModelLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div
        style={{
          color: "#fff",
          background: "rgba(0,0,0,0.7)",
          padding: "0.5rem 0.8rem",
          whiteSpace: "nowrap",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "0.9rem",
          borderRadius: "4px",
        }}
      >
        Loading 3D room… {Math.round(progress)}%
      </div>
    </Html>
  );
}
