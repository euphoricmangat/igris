"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { GalleryKeyLight, GalleryRig, type GalleryQuality } from "@/components/museum/GalleryRig";
import { preferReducedMotion, springStep } from "@/lib/museum/spring";

const GRID = 24;
const COUNT = GRID * GRID;
const SPACING = 0.48;

function neighborAlive(alive: Uint8Array, i: number): number {
  const row = Math.floor(i / GRID);
  const col = i % GRID;
  let n = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const r = (row + dy + GRID) % GRID;
      const c = (col + dx + GRID) % GRID;
      n += alive[r * GRID + c];
    }
  }
  return n;
}

function BrixelPins({ quality }: { quality: GalleryQuality }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const reduced = preferReducedMotion();
  const stepEvery = quality === "thumb" ? 0.55 : 0.42;
  const lastStep = useRef(0);

  const state = useMemo(() => {
    const alive = new Uint8Array(COUNT);
    const height = new Float32Array(COUNT);
    const velocity = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      alive[i] = Math.random() > 0.68 ? 1 : 0;
      height[i] = alive[i] ? 1.4 : 0.22;
      velocity[i] = 0;
    }
    return { alive, next: new Uint8Array(COUNT), height, velocity };
  }, []);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    const mouseX = pointer.x * (GRID * SPACING * 0.55);
    const mouseY = pointer.y * (GRID * SPACING * 0.55);

    if (!reduced && t - lastStep.current >= stepEvery) {
      lastStep.current = t;
      for (let i = 0; i < COUNT; i++) {
        const n = neighborAlive(state.alive, i);
        const a = state.alive[i];
        state.next[i] = a ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
      }
      state.alive.set(state.next);
    }

    for (let i = 0; i < COUNT; i++) {
      const row = Math.floor(i / GRID);
      const col = i % GRID;
      const x = (col - GRID / 2) * SPACING;
      const y = (row - GRID / 2) * SPACING;
      const dist = Math.hypot(x - mouseX, y - mouseY);
      const cursorForce = Math.max(0, 1.7 - dist) * 1.15;
      const targetH = (state.alive[i] ? 1.55 : 0.22) + cursorForce;

      if (reduced) {
        state.height[i] = targetH;
        state.velocity[i] = 0;
      } else {
        const stepped = springStep(state.height[i], targetH, state.velocity[i], 0.14, 0.8);
        state.height[i] = stepped.value;
        state.velocity[i] = stepped.velocity;
      }

      const h = Math.max(0.08, state.height[i]);
      dummy.position.set(x, y, h * 0.5);
      dummy.scale.set(0.38, 0.38, h);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial
        color="#1c1c1f"
        metalness={0.88}
        roughness={0.2}
        clearcoat={1}
        iridescence={0.35}
        iridescenceIOR={1.3}
      />
    </instancedMesh>
  );
}

export function BrixelLifeStage({ expanded = false }: { expanded?: boolean }) {
  const quality: GalleryQuality = expanded ? "full" : "thumb";
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        camera={{ position: [0, -9.5, 8.5], fov: 38 }}
        dpr={quality === "thumb" ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: true, alpha: false }}
      >
        <GalleryRig quality={quality}>
          <GalleryKeyLight />
          <group rotation={[-0.55, 0, 0]}>
            <BrixelPins quality={quality} />
          </group>
        </GalleryRig>
      </Canvas>
    </div>
  );
}
