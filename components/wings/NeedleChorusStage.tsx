"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GalleryKeyLight, GalleryRig, type GalleryQuality } from "@/components/museum/GalleryRig";
import { preferReducedMotion, springStep } from "@/lib/museum/spring";

function Needles({ quality, grid }: { quality: GalleryQuality; grid: number }) {
  const count = grid * grid;
  const spacing = quality === "full" ? 0.36 : 0.42;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const reduced = preferReducedMotion();
  const damp = quality === "full" ? 0.88 : 0.84;
  const drift = useRef(0);

  const state = useMemo(() => {
    const height = new Float32Array(count);
    const velocity = new Float32Array(count);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      phase[i] = (i / count) * Math.PI * 2;
      height[i] = 0.6;
    }
    return { height, velocity, phase };
  }, [count]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3);
  }, [count]);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    if (!reduced) drift.current += 0.012;
    const mouseX = pointer.x * (grid * spacing * 0.5);
    const mouseY = pointer.y * (grid * spacing * 0.5);

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / grid);
      const col = i % grid;
      const x = (col - grid / 2) * spacing;
      const y = (row - grid / 2) * spacing;
      const wave =
        0.55 + 0.55 * Math.sin(t * 1.4 + state.phase[i] + row * 0.18 + drift.current);
      const dist = Math.hypot(x - mouseX, y - mouseY);
      const pull = Math.max(0, 2.2 - dist) * 1.1;
      const target = wave + pull;

      const prevV = state.velocity[i];
      if (reduced) {
        state.height[i] = target;
        state.velocity[i] = 0;
      } else {
        const stepped = springStep(state.height[i], target, state.velocity[i], 0.16, damp);
        state.height[i] = stepped.value;
        state.velocity[i] = stepped.velocity;
      }

      const h = Math.max(0.15, state.height[i]);
      dummy.position.set(x, y, h * 0.5);
      dummy.scale.set(0.08, 0.08, h);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      const glow = Math.min(1, Math.abs(state.velocity[i] || prevV) * 2.2);
      color.setRGB(0.75 + glow * 0.2, 0.75 - glow * 0.35, 0.78 - glow * 0.4);
      meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <cylinderGeometry args={[1, 0.55, 1, quality === "full" ? 8 : 6]} />
      <meshPhysicalMaterial
        color="#d4d4d8"
        metalness={0.92}
        roughness={0.16}
        clearcoat={1}
        iridescence={0.25}
        emissive="#3a1010"
        emissiveIntensity={quality === "full" ? 0.22 : 0.12}
      />
    </instancedMesh>
  );
}

export function NeedleChorusStage({ expanded = false }: { expanded?: boolean }) {
  const quality: GalleryQuality = expanded ? "full" : "thumb";
  const grid = expanded ? 24 : 20;
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        key={grid}
        camera={{ position: [0, -8, 7.2], fov: 40 }}
        dpr={quality === "thumb" ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: true, alpha: false }}
      >
        <GalleryRig quality={quality}>
          {quality === "full" ? (
            <directionalLight position={[-2, 3, 4]} intensity={0.55} color="#e8e4dc" />
          ) : null}
          <GalleryKeyLight />
          <group rotation={[-0.6, 0, 0]}>
            <Needles quality={quality} grid={grid} />
          </group>
        </GalleryRig>
      </Canvas>
    </div>
  );
}
