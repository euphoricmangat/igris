"use client";

import { ContactShadows, Environment } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";

export type GalleryQuality = "thumb" | "full";

function GalleryTone() {
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.08;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);
  return null;
}

/**
 * Soft bloom always on — Expand may only nudge intensity (fidelity law).
 * Same look family closed vs full; never bloom on/off flip.
 */
function GalleryBloom({ quality }: { quality: GalleryQuality }) {
  const intensity = quality === "full" ? 0.36 : 0.3;
  return (
    <EffectComposer multisampling={0}>
      <Bloom luminanceThreshold={0.82} intensity={intensity} mipmapBlur levels={4} />
    </EffectComposer>
  );
}

/**
 * Spatial camera ease on full-window enter — motion only, not look.
 */
export function GalleryPresenceCam({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const target = useRef<THREE.Vector3 | null>(null);
  const settled = useRef(false);

  useLayoutEffect(() => {
    if (!enabled) return;
    target.current = camera.position.clone();
    camera.position.add(new THREE.Vector3(1.05, 0.5, 1.45));
    camera.lookAt(0, 0, 0);
    settled.current = false;
  }, [enabled, camera]);

  useFrame(() => {
    if (!enabled || !target.current || settled.current) return;
    camera.position.lerp(target.current, 0.065);
    camera.lookAt(0, 0, 0);
    if (camera.position.distanceTo(target.current) < 0.025) {
      camera.position.copy(target.current);
      settled.current = true;
    }
  });

  return null;
}

/**
 * Shared museum lighting + void — ONE recipe for thumb and full.
 * Expand differs only via presence cam + bloom intensity nudge + caller density.
 */
export function GalleryRig({
  quality = "full",
  children,
}: {
  quality?: GalleryQuality;
  children?: React.ReactNode;
}) {
  const full = quality === "full";

  return (
    <>
      <color attach="background" args={["#0e0e10"]} />
      <GalleryTone />
      <GalleryPresenceCam enabled={full} />
      <ambientLight intensity={0.38} />
      <directionalLight
        position={[3.2, 4.5, 2.4]}
        intensity={1.35}
        color="#fff5f0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-2.4, -1.2, 1.5]} color="#b91c1c" intensity={0.95} />
      <Environment preset="warehouse" environmentIntensity={0.32} />
      <ContactShadows
        position={[0, -1.35, 0]}
        opacity={0.42}
        scale={12}
        blur={full ? 2.2 : 2.5}
        far={4}
        color="#0e0e10"
      />
      {children}
      <GalleryBloom quality={quality} />
    </>
  );
}

/** Crimson key light that lerps toward the pointer (canvas-local). */
export function GalleryKeyLight({
  color = "#b91c1c",
  intensity = 1.35,
}: {
  color?: string;
  intensity?: number;
}) {
  const light = useRef<THREE.PointLight>(null);
  const { gl } = useThree();
  const target = useRef(new THREE.Vector3(2, 2, 2.5));

  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const u = (e.clientX - r.left) / r.width;
      const v = (e.clientY - r.top) / r.height;
      target.current.set((u - 0.5) * 6, (0.5 - v) * 4 + 1, 2.5);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [gl]);

  useFrame(() => {
    light.current?.position.lerp(target.current, 0.12);
  });

  return <pointLight ref={light} intensity={intensity} color={color} />;
}
