"use client";

import { ContactShadows, Environment } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export type GalleryQuality = "thumb" | "full";

/** Shared museum lighting + void for R3F kinetic sculptures. */
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
      <ambientLight intensity={0.28} />
      <directionalLight position={[3.2, 4.5, 2.4]} intensity={1.15} color="#fff5f0" castShadow={full} />
      <pointLight position={[-2.4, -1.2, 1.5]} color="#b91c1c" intensity={0.85} />
      {full ? <Environment preset="warehouse" environmentIntensity={0.35} /> : null}
      {full ? (
        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.45}
          scale={12}
          blur={2.4}
          far={4}
          color="#0e0e10"
        />
      ) : null}
      {children}
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
