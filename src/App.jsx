import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  DESKTOP_BOOT_DURATION_MS,
  DESKTOP_BOOT_START_DELAY_MS,
  DESKTOP_FOLDERS,
  INTRO_CAMERA_POSITION,
  INTRO_TARGET,
  MOBILE_BREAKPOINT,
  MOBILE_SCREEN_UI_DELAY_MS,
  ROOM_CAMERA_POSITION,
  ROOM_MAX_CAMERA_DISTANCE,
  ROOM_MIN_CAMERA_DISTANCE,
  ROOM_RETURN_DELAY_MS,
  ROOM_TARGET,
  ROOM_TRANSITION_MS,
  SCREEN_MAX_CAMERA_DISTANCE,
  SCREEN_MIN_CAMERA_DISTANCE,
} from "./data/constants.js";
import { getScreenFocusCameraState } from "./utils/geometry.js";
import DesktopScreen from "./components/DesktopScreen.jsx";
import { ErrorBoundary, FlatPortfolioFallback } from "./components/ErrorBoundary.jsx";
import { Model, ModelLoader } from "./components/Model.jsx";
import { LANG_CYCLE, LANG_LABELS } from "./data/i18n.js";

function WelcomePopup({ isVisible, onEnterWorld }) {
  if (!isVisible) return null;

  return (
    <div className="scene-welcome">
      <section className="welcome-popup" aria-live="polite">
        <h1>Welcome to my portfolio</h1>
        <p className="welcome-popup__line">
          Click on the monitor screen to see my portfolio.
        </p>
        <p className="welcome-popup__note">
          <em>
            Recommended: For a seamless experience use this website on a
            desktop.
          </em>
        </p>
        <button
          className="welcome-popup__button"
          onClick={onEnterWorld}
          type="button"
        >
          Explore the world
        </button>
      </section>
    </div>
  );
}

function CameraDebug({ controlsRef }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;

    const controls = controlsRef.current;
    if (!controls) return undefined;

    const logState = () => {
      const position = camera.position
        .toArray()
        .map((value) => Number(value.toFixed(3)));
      const target = controls.target
        .toArray()
        .map((value) => Number(value.toFixed(3)));

      console.log("[R3F camera]", { position, target });
    };

    logState();
    controls.addEventListener("change", logState);

    return () => controls.removeEventListener("change", logState);
  }, [camera, controlsRef]);

  return null;
}

function CameraRig({
  controlsRef,
  hasEnteredWorld,
  isScreenFocused,
  isMobile,
  isRoomTransitioning,
  onScreenFocusSettledChange,
  onScreenRevealChange,
  screenTarget,
}) {
  const { camera } = useThree();
  const introPosition = useMemo(
    () => new THREE.Vector3(...INTRO_CAMERA_POSITION),
    [],
  );
  const introTarget = useMemo(() => new THREE.Vector3(...INTRO_TARGET), []);
  const roomPosition = useMemo(
    () => new THREE.Vector3(...ROOM_CAMERA_POSITION),
    [],
  );

  const roomTarget = useMemo(() => new THREE.Vector3(...ROOM_TARGET), []);

  const desiredPosition = useRef(roomPosition.clone());
  const desiredTarget = useRef(roomTarget.clone());
  const lastScreenFocusSettledRef = useRef(false);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    let nextReveal = 0;
    let nextFocusPosition = null;

    if (!hasEnteredWorld) {
      desiredPosition.current.copy(introPosition);
      desiredTarget.current.copy(introTarget);
    } else if (isScreenFocused && screenTarget) {
      const { position: focusPosition, target: focusTarget } =
        getScreenFocusCameraState(screenTarget.position, isMobile);

      nextFocusPosition = focusPosition;
      const totalDistance = roomPosition.distanceTo(focusPosition);
      desiredPosition.current.copy(focusPosition);
      desiredTarget.current.copy(focusTarget);

      const currentDistance = camera.position.distanceTo(focusPosition);
      const travelProgress = THREE.MathUtils.clamp(
        1 - currentDistance / Math.max(totalDistance, 0.001),
        0,
        1,
      );
      nextReveal = THREE.MathUtils.smoothstep(
        travelProgress,
        isMobile ? 0.82 : 0.9,
        isMobile ? 0.93 : 0.955,
      );
    } else if (isRoomTransitioning) {
      desiredPosition.current.copy(roomPosition);
      desiredTarget.current.copy(roomTarget);
    } else {
      if (lastScreenFocusSettledRef.current) {
        lastScreenFocusSettledRef.current = false;
        onScreenFocusSettledChange(false);
      }
      onScreenRevealChange(nextReveal);
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const damping = prefersReducedMotion ? 1 : 1 - Math.exp(-6 * delta);
    camera.position.lerp(desiredPosition.current, damping);
    controls.target.lerp(desiredTarget.current, damping);
    controls.update();

    const isScreenFocusSettled =
      Boolean(nextFocusPosition) &&
      camera.position.distanceTo(nextFocusPosition) < 0.08 &&
      controls.target.distanceTo(desiredTarget.current) < 0.04;

    if (lastScreenFocusSettledRef.current !== isScreenFocusSettled) {
      lastScreenFocusSettledRef.current = isScreenFocusSettled;
      onScreenFocusSettledChange(isScreenFocusSettled);
    }

    onScreenRevealChange(nextReveal);
  });

  return null;
}

export default function App() {
  const controlsRef = useRef(null);
  const roomReturnDelayTimeoutRef = useRef(null);
  const roomReturnEndTimeoutRef = useRef(null);
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("khodor-lang");
    if (saved && LANG_CYCLE.includes(saved)) return saved;
    return "en";
  });
  const [hasEnteredWorld, setHasEnteredWorld] = useState(false);
  const [isScreenFocused, setIsScreenFocused] = useState(false);
  const [isScreenFocusSettled, setIsScreenFocusSettled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isRoomTransitioning, setIsRoomTransitioning] = useState(false);
  const [desktopScreenPhase, setDesktopScreenPhase] = useState("hidden");
  const [isMobileScreenUiVisible, setIsMobileScreenUiVisible] = useState(false);
  const [screenReveal, setScreenReveal] = useState(0);
  const [screenTarget, setScreenTarget] = useState(null);
  const [screenRect, setScreenRect] = useState(null);
  const [finalScreenRect, setFinalScreenRect] = useState(null);
  const isDesktopScreenVisible = desktopScreenPhase !== "hidden";
  const isDesktopScreenBooting = desktopScreenPhase === "booting";

  const clearRoomReturnTimers = useCallback(() => {
    if (roomReturnDelayTimeoutRef.current !== null) {
      window.clearTimeout(roomReturnDelayTimeoutRef.current);
      roomReturnDelayTimeoutRef.current = null;
    }

    if (roomReturnEndTimeoutRef.current !== null) {
      window.clearTimeout(roomReturnEndTimeoutRef.current);
      roomReturnEndTimeoutRef.current = null;
    }
  }, []);

  const beginRoomReturn = useCallback(
    (delayMs = 0) => {
      clearRoomReturnTimers();

      if (!hasEnteredWorld || isScreenFocused) return;

      const returnToRoomView = () => {
        roomReturnDelayTimeoutRef.current = null;
        setIsRoomTransitioning(true);
        roomReturnEndTimeoutRef.current = window.setTimeout(() => {
          setIsRoomTransitioning(false);
          roomReturnEndTimeoutRef.current = null;
        }, ROOM_TRANSITION_MS);
      };

      if (delayMs > 0) {
        roomReturnDelayTimeoutRef.current = window.setTimeout(
          returnToRoomView,
          delayMs,
        );
        return;
      }

      returnToRoomView();
    },
    [clearRoomReturnTimers, hasEnteredWorld, isScreenFocused],
  );

  const handleRoomControlsStart = useCallback(() => {
    clearRoomReturnTimers();

    if (!hasEnteredWorld || isScreenFocused) return;

    setIsRoomTransitioning(false);
  }, [clearRoomReturnTimers, hasEnteredWorld, isScreenFocused]);

  const handleRoomControlsEnd = useCallback(() => {
    beginRoomReturn(ROOM_RETURN_DELAY_MS);
  }, [beginRoomReturn]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("khodor-lang", lang);
  }, [lang]);

  useEffect(() => {
    return clearRoomReturnTimers;
  }, [clearRoomReturnTimers]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setDesktopScreenPhase("hidden");
      setFinalScreenRect(null);
      return undefined;
    }

    if (!isScreenFocused) {
      setDesktopScreenPhase("hidden");
      setIsScreenFocusSettled(false);
      setFinalScreenRect(null);
      return undefined;
    }

    if (!isScreenFocusSettled) {
      setDesktopScreenPhase("hidden");
      return undefined;
    }

    setDesktopScreenPhase("hidden");

    const bootTimeoutId = window.setTimeout(() => {
      setDesktopScreenPhase("booting");
    }, DESKTOP_BOOT_START_DELAY_MS);

    const readyTimeoutId = window.setTimeout(() => {
      setDesktopScreenPhase("ready");
    }, DESKTOP_BOOT_START_DELAY_MS + DESKTOP_BOOT_DURATION_MS);

    return () => {
      window.clearTimeout(bootTimeoutId);
      window.clearTimeout(readyTimeoutId);
    };
  }, [isMobile, isScreenFocused, isScreenFocusSettled]);

  useEffect(() => {
    if (!isMobile) {
      setIsMobileScreenUiVisible(false);
      return undefined;
    }

    if (!isScreenFocused) {
      setIsMobileScreenUiVisible(false);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsMobileScreenUiVisible(true);
    }, MOBILE_SCREEN_UI_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isMobile, isScreenFocused]);

  useEffect(() => {
    if (!hasEnteredWorld || isScreenFocused) {
      clearRoomReturnTimers();
      return undefined;
    }

    beginRoomReturn();
    return undefined;
  }, [
    beginRoomReturn,
    clearRoomReturnTimers,
    hasEnteredWorld,
    isScreenFocused,
  ]);

  useEffect(() => {
    if (!isScreenFocused) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        const hash = decodeURIComponent(window.location.hash.slice(1));
        if (DESKTOP_FOLDERS.includes(hash)) return;
        setIsScreenFocused(false);
        setIsRoomTransitioning(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isScreenFocused]);

  // silence unused var warning — screenReveal tracks focus progress for future overlay
  void screenReveal;

  return (
    <main className="app-shell">
      <button
        className="lang-toggle"
        onClick={() => setLang((l) => LANG_CYCLE[(LANG_CYCLE.indexOf(l) + 1) % LANG_CYCLE.length])}
        type="button"
        aria-label={`Current language ${lang}, switch language`}
        title="Switch language"
      >
        {LANG_LABELS[lang]}
      </button>

      {!hasEnteredWorld ? (
        <div className="intro-scene-blur" aria-hidden="true" />
      ) : null}

      <WelcomePopup
        isVisible={!hasEnteredWorld}
        onEnterWorld={() => {
          setHasEnteredWorld(true);
          setIsRoomTransitioning(true);
        }}
      />

      {isScreenFocused ? (
        <button
          className="back-button"
          onClick={() => {
            setIsScreenFocused(false);
            setIsRoomTransitioning(true);
          }}
          type="button"
        >
          Back to room
        </button>
      ) : null}

      {hasEnteredWorld && !isScreenFocused ? (
        <div className="recruiter-nudge-wrap" aria-hidden="true">
          <div className="recruiter-arrow">
            <svg viewBox="0 0 24 48" role="presentation">
              <path
                d="M12 44 L12 10 M12 10 L6 16 M12 10 L18 16"
                fill="none"
                stroke="#ffd56a"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <button
            className="screen-keyboard-activator"
            aria-label="Click on monitor"
            onClick={() => setIsScreenFocused(true)}
            type="button"
          >
            Click on monitor
          </button>
        </div>
      ) : null}

      <DesktopScreen
        isBooting={!isMobile && isDesktopScreenBooting}
        isMobile={isMobile}
        isVisible={isMobile ? isMobileScreenUiVisible : isDesktopScreenVisible}
        lang={lang}
        opacity={1}
        screenRect={isMobile ? screenRect : finalScreenRect}
      />

      <ErrorBoundary fallback={<FlatPortfolioFallback />}>
        <Canvas
          camera={{
            position: INTRO_CAMERA_POSITION,
            fov: 60,
            near: 0.1,
            far: 200,
          }}
          dpr={[1, 1.5]}
          shadows
        >
          <color attach="background" args={["#0b1020"]} />
          <ambientLight intensity={0.92} />
          <directionalLight intensity={0.72} position={[8, 12, 10]} />
          <directionalLight intensity={0.42} position={[-6, 5, -8]} />

          <ErrorBoundary fallback={null}>
            <Suspense fallback={<ModelLoader />}>
              <Model
                isMobile={isMobile}
                isScreenFocused={isScreenFocused}
                onFinalScreenRectChange={setFinalScreenRect}
                onScreenClick={() => {
                  if (!hasEnteredWorld) return;
                  setIsScreenFocused(true);
                }}
                onScreenReady={setScreenTarget}
                onScreenRectChange={setScreenRect}
              />
            </Suspense>
          </ErrorBoundary>

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.12}
          target={INTRO_TARGET}
          enablePan={false}
          enableZoom={hasEnteredWorld && !isScreenFocused}
          enableRotate={hasEnteredWorld && !isScreenFocused}
          onStart={handleRoomControlsStart}
          onEnd={handleRoomControlsEnd}
          minAzimuthAngle={-Math.PI / 4}
          minDistance={
            isScreenFocused
              ? SCREEN_MIN_CAMERA_DISTANCE
              : ROOM_MIN_CAMERA_DISTANCE
          }
          maxAzimuthAngle={Math.PI / 4}
          maxDistance={
            isScreenFocused
              ? SCREEN_MAX_CAMERA_DISTANCE
              : ROOM_MAX_CAMERA_DISTANCE
          }
          maxPolarAngle={Math.PI / 2 + Math.PI / 9}
          minPolarAngle={Math.PI / 2 - Math.PI / 9}
        />
        <CameraRig
          controlsRef={controlsRef}
          hasEnteredWorld={hasEnteredWorld}
          isScreenFocused={isScreenFocused}
          isMobile={isMobile}
          isRoomTransitioning={isRoomTransitioning}
          onScreenFocusSettledChange={setIsScreenFocusSettled}
          onScreenRevealChange={setScreenReveal}
          screenTarget={screenTarget}
        />
        <CameraDebug controlsRef={controlsRef} />
        </Canvas>
      </ErrorBoundary>
    </main>
  );
}
