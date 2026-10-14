"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GalleryKeyLight, GalleryRig, type GalleryQuality } from "@/components/museum/GalleryRig";
import { preferReducedMotion, springStep } from "@/lib/museum/spring";

const GRID = 16;
const COUNT = GRID * GRID;
const SPACING = 0.62;

function FlipDiscs({ quality }: { quality: GalleryQuality }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const reduced = preferReducedMotion();

  const state = useMemo(() => {
    const face = new Float32Array(COUNT); // 0 paper, 1 crimson
    const angle = new Float32Array(COUNT);
    const velocity = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      face[i] = Math.random() > 0.55 ? 1 : 0;
      angle[i] = face[i] * Math.PI;
    }
    return { face, angle, velocity };
  }, []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(COUNT * 3), 3);
  }, []);

  useFrame(({ pointer }) => {
    const mouseX = pointer.x * (GRID * SPACING * 0.5);
    const mouseY = pointer.y * (GRID * SPACING * 0.5);

    for (let i = 0; i < COUNT; i++) {
      const row = Math.floor(i / GRID);
      const col = i % GRID;
      const x = (col - GRID / 2) * SPACING;
      const y = (row - GRID / 2) * SPACING;
      const dist = Math.hypot(x - mouseX, y - mouseY);

      if (!reduced && dist < 1.35 && Math.random() < 0.04) {
        state.face[i] = state.face[i] > 0.5 ? 0 : 1;
      }

      const target = state.face[i] * Math.PI;
      if (reduced) {
        state.angle[i] = target;
        state.velocity[i] = 0;
      } else {
        const stepped = springStep(state.angle[i], target, state.velocity[i], 0.18, 0.78);
        state.angle[i] = stepped.value;
        state.velocity[i] = stepped.velocity;
      }

      dummy.position.set(x, y, 0);
      dummy.rotation.set(state.angle[i], 0, 0);
      dummy.scale.set(0.52, 0.08, 0.52);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      const t = (Math.cos(state.angle[i]) + 1) * 0.5;
      color.setRGB(0.72 - t * 0.55, 0.72 - t * 0.65, 0.68 - t * 0.6);
      meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, COUNT]}
      castShadow
      receiveShadow
    >
      <cylinderGeometry args={[1, 1, 1, quality === "thumb" ? 8 : 16]} />
      <meshPhysicalMaterial
        color="#e8e4dc"
        metalness={0.55}
        roughness={0.28}
        clearcoat={0.8}
        iridescence={0.2}
        toneMapped
      />
    </instancedMesh>
  );
}

export function FlipFieldStage({ expanded = false }: { expanded?: boolean }) {
  const quality: GalleryQuality = expanded ? "full" : "thumb";
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        camera={{ position: [0, -7.2, 7.8], fov: 40 }}
        dpr={quality === "thumb" ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: true, alpha: false }}
      >
        <GalleryRig quality={quality}>
          <GalleryKeyLight color="#f8fafc" intensity={1.1} />
          <group rotation={[-0.7, 0, 0]}>
            <FlipDiscs quality={quality} />
          </group>
        </GalleryRig>
      </Canvas>
    </div>
  );
}
