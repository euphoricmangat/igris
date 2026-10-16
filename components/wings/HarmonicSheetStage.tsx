"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { ClientMount } from "@/components/museum/ClientMount";
import { GalleryKeyLight, GalleryRig, type GalleryQuality } from "@/components/museum/GalleryRig";
import { StageControlStrip, StageSlider } from "@/components/museum/StageControls";
import { useSeededParams } from "@/hooks/useSeededParams";
import { preferReducedMotion, springStep } from "@/lib/museum/spring";
import { idleLissajous } from "@/hooks/useIdleLissajous";

const SEG = 28;

function SheetMesh({
  stiffness,
  rippleAmp,
}: {
  stiffness: MutableRefObject<number>;
  rippleAmp: MutableRefObject<number>;
}) {
  const mesh = useRef<THREE.Mesh>(null!);
  const reduced = preferReducedMotion();
  const geo = useMemo(() => new THREE.PlaneGeometry(8, 6, SEG, SEG), []);
  const base = useMemo(() => {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    return Float32Array.from(pos.array as Float32Array);
  }, [geo]);
  const z = useMemo(() => new Float32Array((SEG + 1) * (SEG + 1)), []);
  const v = useMemo(() => new Float32Array((SEG + 1) * (SEG + 1)), []);
  const idlePtr = useRef({ x: 0, y: 0 });

  useFrame(({ pointer, clock }) => {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const t = clock.getElapsedTime();
    const outside = Math.hypot(pointer.x, pointer.y) < 0.02;
    if (outside) {
      const idle = idleLissajous(t * 0.45);
      idlePtr.current.x += ((idle.u * 2 - 1) * 4 - idlePtr.current.x) * 0.04;
      idlePtr.current.y += ((idle.v * 2 - 1) * 3 - idlePtr.current.y) * 0.04;
    } else {
      idlePtr.current.x = pointer.x * 4;
      idlePtr.current.y = pointer.y * 3;
    }
    const mx = idlePtr.current.x;
    const my = idlePtr.current.y;
    const k = stiffness.current;
    const amp = rippleAmp.current;

    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      const dist = Math.hypot(x - mx, y - my);
      const lens = -1.4 / (1 + dist * dist * 0.35);
      const ripple = Math.sin(dist * 2.2 - t * 3.2) * 0.08 * amp * Math.exp(-dist * 0.35);
      const target = lens + ripple;

      if (reduced) {
        z[i] = target;
        v[i] = 0;
      } else {
        const stepped = springStep(z[i], target, v[i], k, 0.86);
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

export function HarmonicSheetStage({
  expanded = false,
  exhibitId,
}: {
  expanded?: boolean;
  exhibitId?: string;
}) {
  const quality: GalleryQuality = expanded ? "full" : "thumb";
  const [params, setParams] = useSeededParams(exhibitId, { stiffness: 0.2, rippleAmp: 1 });
  const stiffnessRef = useRef(params.stiffness);
  const rippleRef = useRef(params.rippleAmp);
  stiffnessRef.current = params.stiffness;
  rippleRef.current = params.rippleAmp;

  return (
    <div className="absolute inset-0 h-full w-full bg-[#0e0e10]">
      <ClientMount>
        <Canvas
          camera={{ position: [0, 1.2, 7.2], fov: 40 }}
          dpr={quality === "thumb" ? [1, 1.25] : [1, 1.75]}
          gl={{ antialias: true, alpha: false }}
        >
          <GalleryRig quality={quality}>
            <GalleryKeyLight />
            <SheetMesh stiffness={stiffnessRef} rippleAmp={rippleRef} />
          </GalleryRig>
        </Canvas>
      </ClientMount>
      <StageControlStrip>
        <StageSlider
          label="Spring"
          value={params.stiffness}
          min={0.08}
          max={0.35}
          step={0.01}
          onChange={(v) => setParams((p) => ({ ...p, stiffness: v }))}
        />
        <StageSlider
          label="Ripple"
          value={params.rippleAmp}
          min={0.2}
          max={2}
          step={0.05}
          onChange={(v) => setParams((p) => ({ ...p, rippleAmp: v }))}
        />
      </StageControlStrip>
    </div>
  );
}
