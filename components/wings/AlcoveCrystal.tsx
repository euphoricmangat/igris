"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { ClientMount } from "@/components/museum/ClientMount";
import { GalleryKeyLight, GalleryRig, type GalleryQuality } from "@/components/museum/GalleryRig";
import { StageControlStrip, StageSlider } from "@/components/museum/StageControls";
import { useSeededParams } from "@/hooks/useSeededParams";
import { preferReducedMotion, springStep } from "@/lib/museum/spring";

function Crystal({
  quality,
  spin,
  cast,
}: {
  quality: GalleryQuality;
  spin: MutableRefObject<number>;
  cast: MutableRefObject<number>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const reduced = preferReducedMotion();
  const offset = useRef({ x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 });
  const full = quality === "full";

  useFrame((_, dt) => {
    if (!ref.current) return;
    if (!reduced) {
      const s = spin.current;
      ref.current.rotation.y += dt * 0.35 * s;
      ref.current.rotation.x += dt * 0.12 * s;
    }
    const m = ref.current.material as THREE.MeshPhysicalMaterial & {
      attenuationDistance?: number;
    };
    if (m && "attenuationDistance" in m) {
      m.attenuationDistance = 2.4 + cast.current * 2.4;
    }
  });

  useFrame(({ pointer }) => {
    if (!group.current) return;
    const force = Math.max(0, 1.5 - Math.hypot(pointer.x * 2.2, pointer.y * 2.2)) * 0.4;
    const tx = pointer.x * force;
    const ty = pointer.y * force;
    const tz = force * 0.35;
    if (reduced) {
      offset.current = { x: tx, y: ty, z: tz, vx: 0, vy: 0, vz: 0 };
    } else {
      const sx = springStep(offset.current.x, tx, offset.current.vx, 0.11, 0.85);
      const sy = springStep(offset.current.y, ty, offset.current.vy, 0.11, 0.85);
      const sz = springStep(offset.current.z, tz, offset.current.vz, 0.11, 0.85);
      offset.current = {
        x: sx.value,
        y: sy.value,
        z: sz.value,
        vx: sx.velocity,
        vy: sy.velocity,
        vz: sz.velocity,
      };
    }
    group.current.position.set(offset.current.x, offset.current.y, offset.current.z);
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0, -2.6]} receiveShadow>
        <planeGeometry args={[12, 9]} />
        <meshStandardMaterial color="#2c2622" roughness={0.92} metalness={0.05} />
      </mesh>
      <mesh position={[-2.2, 0.6, -2.55]}>
        <planeGeometry args={[1.4, 0.08]} />
        <meshBasicMaterial color="#b91c1c" />
      </mesh>
      <mesh position={[1.8, -0.9, -2.55]}>
        <planeGeometry args={[0.9, 0.06]} />
        <meshBasicMaterial color="#e8e4dc" />
      </mesh>
      <mesh ref={ref} castShadow>
        <octahedronGeometry args={[1.05, 0]} />
        <MeshTransmissionMaterial
          ref={mat as never}
          backside
          samples={full ? 8 : 5}
          resolution={full ? 512 : 384}
          thickness={0.9}
          chromaticAberration={0.1}
          anisotropy={0.22}
          distortion={0.14}
          distortionScale={0.32}
          temporalDistortion={0.07}
          roughness={0.06}
          ior={1.4}
          color="#eceae6"
          attenuationColor="#9f1a1a"
          attenuationDistance={3.6}
        />
      </mesh>
    </group>
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
    <OrbitControls
      enablePan={false}
      minDistance={2.4}
      maxDistance={5.5}
      autoRotate={!dragging}
      autoRotateSpeed={0.55}
    />
  );
}

export function AlcoveCrystal({
  expanded = false,
  exhibitId,
}: {
  expanded?: boolean;
  exhibitId?: string;
}) {
  const quality: GalleryQuality = expanded ? "full" : "thumb";
  const [params, setParams] = useSeededParams(exhibitId, { spin: 1, cast: 0.5 });
  const spinRef = useRef(params.spin);
  const castRef = useRef(params.cast);
  spinRef.current = params.spin;
  castRef.current = params.cast;

  return (
    <div className="absolute inset-0 h-full w-full bg-[#0e0e10]">
      <ClientMount>
        <Canvas
          camera={{ position: [0, 0, 3.4], fov: 40 }}
          dpr={quality === "thumb" ? [1, 1.25] : [1, 1.5]}
          gl={{ antialias: true, alpha: false }}
        >
          <GalleryRig quality={quality}>
            <GalleryKeyLight color="#fff8f0" intensity={1.15} />
            <Crystal quality={quality} spin={spinRef} cast={castRef} />
            <Controls />
          </GalleryRig>
        </Canvas>
      </ClientMount>
      <StageControlStrip>
        <StageSlider
          label="Spin"
          value={params.spin}
          min={0.2}
          max={2}
          step={0.05}
          onChange={(v) => setParams((p) => ({ ...p, spin: v }))}
        />
        <StageSlider
          label="Cast"
          value={params.cast}
          min={0}
          max={1}
          step={0.05}
          onChange={(v) => setParams((p) => ({ ...p, cast: v }))}
        />
      </StageControlStrip>
    </div>
  );
}
