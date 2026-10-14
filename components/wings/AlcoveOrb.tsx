"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GalleryKeyLight, GalleryRig, type GalleryQuality } from "@/components/museum/GalleryRig";
import { preferReducedMotion, springStep } from "@/lib/museum/spring";

function TorusKnot() {
  const ref = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const reduced = preferReducedMotion();
  const offset = useRef({ x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 });

  useFrame((_, dt) => {
    if (!ref.current) return;
    if (!reduced) {
      ref.current.rotation.x += dt * 0.2;
      ref.current.rotation.y += dt * 0.35;
    }
  });

  useFrame(({ pointer }) => {
    if (!group.current) return;
    const force = Math.max(0, 1.7 - Math.hypot(pointer.x * 2, pointer.y * 2)) * 0.45;
    const tx = pointer.x * force;
    const ty = pointer.y * force;
    const tz = force * 0.5;
    if (reduced) {
      offset.current = { x: tx, y: ty, z: tz, vx: 0, vy: 0, vz: 0 };
    } else {
      const sx = springStep(offset.current.x, tx, offset.current.vx, 0.13, 0.83);
      const sy = springStep(offset.current.y, ty, offset.current.vy, 0.13, 0.83);
      const sz = springStep(offset.current.z, tz, offset.current.vz, 0.13, 0.83);
      offset.current = { x: sx.value, y: sy.value, z: sz.value, vx: sx.velocity, vy: sy.velocity, vz: sz.velocity };
    }
    group.current.position.set(offset.current.x, offset.current.y, offset.current.z);
  });

  return (
    <group ref={group}>
      <mesh ref={ref} castShadow>
        <torusKnotGeometry args={[0.75, 0.22, 180, 24]} />
        <meshPhysicalMaterial
          color="#b91c1c"
          metalness={0.78}
          roughness={0.2}
          clearcoat={1}
          iridescence={0.4}
          emissive="#3a0808"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

function WireShell() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y -= dt * 0.15;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.35, 1]} />
      <meshBasicMaterial color="#d4d4d8" wireframe transparent opacity={0.35} />
    </mesh>
  );
}

function Controls() {
  const [dragging, setDragging] = useState(false);
  const { gl } = useThree();
  useEffect(() => {
    const el = gl.domElement;
    const down = () => setDragging(true);
    const up = () => setDragging(false);
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [gl]);
  return (
    <OrbitControls enablePan={false} minDistance={2.2} maxDistance={6} autoRotate={!dragging} autoRotateSpeed={0.5} />
  );
}

export function AlcoveOrb({ expanded = false }: { expanded?: boolean }) {
  const quality: GalleryQuality = expanded ? "full" : "thumb";
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        camera={{ position: [0, 0.3, 3.6], fov: 40 }}
        dpr={quality === "thumb" ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: true, alpha: false }}
      >
        <GalleryRig quality={quality}>
          <GalleryKeyLight color="#f8fafc" intensity={1.4} />
          <TorusKnot />
          <WireShell />
          <Controls />
        </GalleryRig>
      </Canvas>
    </div>
  );
}
