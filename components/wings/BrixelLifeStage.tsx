"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { GalleryKeyLight, GalleryRig, type GalleryQuality } from "@/components/museum/GalleryRig";
import { StageControlStrip, StageSlider, StageToggle } from "@/components/museum/StageControls";
import { useReliefSignals } from "@/hooks/useReliefSignals";
import { useSeededParams } from "@/hooks/useSeededParams";
import { preferReducedMotion, springStep } from "@/lib/museum/spring";

function neighborAlive(alive: Uint8Array, i: number, grid: number): number {
  const row = Math.floor(i / grid);
  const col = i % grid;
  let n = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const r = (row + dy + grid) % grid;
      const c = (col + dx + grid) % grid;
      n += alive[r * grid + c];
    }
  }
  return n;
}

function BrixelPins({
  grid,
  spacing,
  quality,
  scrollBoost,
  audioBoost,
  stepRate,
}: {
  grid: number;
  spacing: number;
  quality: GalleryQuality;
  scrollBoost: MutableRefObject<number>;
  audioBoost: MutableRefObject<number>;
  stepRate: MutableRefObject<number>;
}) {
  const count = grid * grid;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const reduced = preferReducedMotion();
  const lastStep = useRef(0);

  const state = useMemo(() => {
    const alive = new Uint8Array(count);
    const height = new Float32Array(count);
    const velocity = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      alive[i] = Math.random() > 0.68 ? 1 : 0;
      height[i] = alive[i] ? 1.4 : 0.22;
      velocity[i] = 0;
    }
    return { alive, next: new Uint8Array(count), height, velocity };
  }, [count]);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    const mouseX = pointer.x * (grid * spacing * 0.55);
    const mouseY = pointer.y * (grid * spacing * 0.55);
    const heat = scrollBoost.current * 0.35 + audioBoost.current * 0.45;
    const signal = 1 + scrollBoost.current * 0.85 + audioBoost.current * 0.95;
    const stepEvery = Math.max(0.18, stepRate.current);

    if (!reduced && t - lastStep.current >= stepEvery) {
      lastStep.current = t;
      for (let i = 0; i < count; i++) {
        const n = neighborAlive(state.alive, i, grid);
        const a = state.alive[i];
        let next = a ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
        // Heat bias: scroll/mic gently favors births
        if (!a && n === 2 && heat > 0.35 && Math.random() < heat * 0.12) next = 1;
        state.next[i] = next;
      }
      state.alive.set(state.next);
    }

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / grid);
      const col = i % grid;
      const x = (col - grid / 2) * spacing;
      const y = (row - grid / 2) * spacing;
      const dist = Math.hypot(x - mouseX, y - mouseY);
      const cursorForce = Math.max(0, 1.7 - dist) * 1.15;
      const targetH = ((state.alive[i] ? 1.55 : 0.22) + cursorForce) * signal;

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
      const pin = quality === "full" ? 0.36 : 0.38;
      dummy.scale.set(pin, pin, h);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial
        color="#3f3f46"
        metalness={0.78}
        roughness={0.28}
        clearcoat={0.9}
        iridescence={0.3}
        iridescenceIOR={1.3}
        emissive="#2a1010"
        emissiveIntensity={0.18}
      />
    </instancedMesh>
  );
}

export function BrixelLifeStage({
  expanded = false,
  exhibitId,
}: {
  expanded?: boolean;
  exhibitId?: string;
}) {
  const quality: GalleryQuality = expanded ? "full" : "thumb";
  const grid = expanded ? 30 : 24;
  const spacing = expanded ? 0.4 : 0.48;
  const { scrollBoost, audioBoost, listening, toggleListen } = useReliefSignals();
  const [params, setParams] = useSeededParams(exhibitId, { stepRate: expanded ? 0.36 : 0.5 });
  const stepRateRef = useRef(params.stepRate);
  stepRateRef.current = params.stepRate;

  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        key={grid}
        camera={{ position: [0, -9.5, 8.5], fov: 38 }}
        dpr={quality === "thumb" ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: true, alpha: false }}
      >
        <GalleryRig quality={quality}>
          <hemisphereLight args={["#e8e4dc", "#1a1210", 0.4]} />
          <GalleryKeyLight intensity={1.55} />
          <group rotation={[-0.55, 0, 0]}>
            <BrixelPins
              grid={grid}
              spacing={spacing}
              quality={quality}
              scrollBoost={scrollBoost}
              audioBoost={audioBoost}
              stepRate={stepRateRef}
            />
          </group>
        </GalleryRig>
      </Canvas>
      <StageControlStrip>
        <p className="pointer-events-none accession text-[rgba(232,228,220,0.55)]">
          Scroll / mic lift + heat
        </p>
        <StageSlider
          label="Tempo"
          value={params.stepRate}
          min={0.2}
          max={0.7}
          step={0.02}
          onChange={(v) => setParams((p) => ({ ...p, stepRate: v }))}
        />
        <StageToggle label={listening ? "Mic on" : "Mic"} active={listening} onClick={toggleListen} />
      </StageControlStrip>
    </div>
  );
}
