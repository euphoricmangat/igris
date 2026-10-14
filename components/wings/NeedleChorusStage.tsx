"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { GalleryKeyLight, GalleryRig, type GalleryQuality } from "@/components/museum/GalleryRig";
import { preferReducedMotion, springStep } from "@/lib/museum/spring";

const GRID = 20;
const COUNT = GRID * GRID;
const SPACING = 0.42;

function Needles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const reduced = preferReducedMotion();

  const state = useMemo(() => {
    const height = new Float32Array(COUNT);
    const velocity = new Float32Array(COUNT);
    const phase = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      phase[i] = (i / COUNT) * Math.PI * 2;
      height[i] = 0.6;
    }
    return { height, velocity, phase };
  }, []);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    const mouseX = pointer.x * (GRID * SPACING * 0.5);
    const mouseY = pointer.y * (GRID * SPACING * 0.5);

    for (let i = 0; i < COUNT; i++) {
      const row = Math.floor(i / GRID);
      const col = i % GRID;
      const x = (col - GRID / 2) * SPACING;
      const y = (row - GRID / 2) * SPACING;
      const wave = 0.55 + 0.55 * Math.sin(t * 1.4 + state.phase[i] + row * 0.18);
      const dist = Math.hypot(x - mouseX, y - mouseY);
      const pull = Math.max(0, 2.2 - dist) * 1.1;
      const target = wave + pull;

      if (reduced) {
        state.height[i] = target;
        state.velocity[i] = 0;
      } else {
        const stepped = springStep(state.height[i], target, state.velocity[i], 0.16, 0.84);
        state.height[i] = stepped.value;
        state.velocity[i] = stepped.velocity;
      }

      const h = Math.max(0.15, state.height[i]);
      dummy.position.set(x, y, h * 0.5);
      dummy.scale.set(0.08, 0.08, h);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} castShadow>
      <cylinderGeometry args={[1, 0.55, 1, 6]} />
      <meshPhysicalMaterial
        color="#d4d4d8"
        metalness={0.92}
        roughness={0.16}
        clearcoat={1}
        iridescence={0.25}
      />
    </instancedMesh>
  );
}

export function NeedleChorusStage({ expanded = false }: { expanded?: boolean }) {
  const quality: GalleryQuality = expanded ? "full" : "thumb";
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        camera={{ position: [0, -8, 7.2], fov: 40 }}
        dpr={quality === "thumb" ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: true, alpha: false }}
      >
        <GalleryRig quality={quality}>
          <GalleryKeyLight />
          <group rotation={[-0.6, 0, 0]}>
            <Needles />
          </group>
        </GalleryRig>
      </Canvas>
    </div>
  );
}
