"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { GalleryKeyLight, GalleryRig, type GalleryQuality } from "@/components/museum/GalleryRig";
import { preferReducedMotion, springStep } from "@/lib/museum/spring";

const SEG = 28;

function SheetMesh() {
  const mesh = useRef<THREE.Mesh>(null!);
  const reduced = preferReducedMotion();
  const geo = useMemo(() => new THREE.PlaneGeometry(8, 6, SEG, SEG), []);
  const base = useMemo(() => {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    return Float32Array.from(pos.array as Float32Array);
  }, [geo]);
  const z = useMemo(() => new Float32Array((SEG + 1) * (SEG + 1)), []);
  const v = useMemo(() => new Float32Array((SEG + 1) * (SEG + 1)), []);

  useFrame(({ pointer, clock }) => {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const t = clock.getElapsedTime();
    const mx = pointer.x * 4;
    const my = pointer.y * 3;

    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      const dist = Math.hypot(x - mx, y - my);
      const lens = -1.4 / (1 + dist * dist * 0.35);
      const ripple = Math.sin(dist * 2.2 - t * 3.2) * 0.08 * Math.exp(-dist * 0.35);
      const target = lens + ripple;

      if (reduced) {
        z[i] = target;
        v[i] = 0;
      } else {
        const stepped = springStep(z[i], target, v[i], 0.2, 0.86);
        z[i] = stepped.value;
        v[i] = stepped.velocity;
      }
      pos.setZ(i, z[i]);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh ref={mesh} geometry={geo} rotation={[-0.55, 0, 0]} castShadow receiveShadow>
      <meshPhysicalMaterial
        color="#2a2420"
        metalness={0.7}
        roughness={0.28}
        clearcoat={0.9}
        iridescence={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function HarmonicSheetStage({ expanded = false }: { expanded?: boolean }) {
  const quality: GalleryQuality = expanded ? "full" : "thumb";
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        camera={{ position: [0, 1.2, 7.2], fov: 40 }}
        dpr={quality === "thumb" ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: true, alpha: false }}
      >
        <GalleryRig quality={quality}>
          <GalleryKeyLight />
          <SheetMesh />
        </GalleryRig>
      </Canvas>
    </div>
  );
}
