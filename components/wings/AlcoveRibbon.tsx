"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { ClientMount } from "@/components/museum/ClientMount";
import { GalleryKeyLight, GalleryRig, type GalleryQuality } from "@/components/museum/GalleryRig";
import { StageControlStrip, StageSlider } from "@/components/museum/StageControls";
import { useSeededParams } from "@/hooks/useSeededParams";
import { preferReducedMotion, springStep } from "@/lib/museum/spring";

function helixPoints(
  turns: number,
  radius: number,
  lift: number,
  count: number,
  phase = 0
): THREE.Vector3[] {
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const a = t * Math.PI * 2 * turns + phase;
    const r = radius * (0.75 + t * 0.45);
    return new THREE.Vector3(Math.cos(a) * r, (t - 0.5) * lift, Math.sin(a) * r);
  });
}

function LivingRibbon({
  quality,
  coilAmp,
  glow,
}: {
  quality: GalleryQuality;
  coilAmp: MutableRefObject<number>;
  glow: MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const filamentRef = useRef<THREE.Mesh>(null);
  const beadsRef = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const reduced = preferReducedMotion();
  const full = quality === "full";
  // Density only — look family identical closed vs Expand
  const pointCount = full ? 48 : 32;
  const tubular = full ? 220 : 120;
  const radial = full ? 14 : 10;

  const offset = useRef({ x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 });
  const coil = useRef({
    turns: 3.2,
    radius: 0.85,
    lift: 2.2,
    vt: 0,
    vr: 0,
    vl: 0,
  });
  const pointerDown = useRef(false);
  const { gl } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tipTrail = useRef<THREE.Vector3[]>(Array.from({ length: 12 }, () => new THREE.Vector3()));

  useEffect(() => {
    const el = gl.domElement;
    const down = () => {
      pointerDown.current = true;
    };
    const up = () => {
      pointerDown.current = false;
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [gl]);

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current || !group.current) return;
    const t = clock.getElapsedTime();
    const amp = coilAmp.current;
    const hold = pointerDown.current ? 1 : 0;
    const targetTurns = 2.6 + pointer.x * 1.1 * amp + hold * 0.85;
    const targetRadius = 0.55 + (0.55 + pointer.x * 0.35) * amp - hold * 0.28;
    const targetLift = 1.7 + (0.9 + pointer.y * 0.55) * amp;

    if (reduced) {
      coil.current.turns = targetTurns;
      coil.current.radius = Math.max(0.28, targetRadius);
      coil.current.lift = targetLift;
      coil.current.vt = coil.current.vr = coil.current.vl = 0;
    } else {
      const st = springStep(coil.current.turns, targetTurns, coil.current.vt, 0.1, 0.82);
      const sr = springStep(
        coil.current.radius,
        Math.max(0.28, targetRadius),
        coil.current.vr,
        0.12,
        0.84
      );
      const sl = springStep(coil.current.lift, targetLift, coil.current.vl, 0.11, 0.83);
      coil.current.turns = st.value;
      coil.current.radius = sr.value;
      coil.current.lift = sl.value;
      coil.current.vt = st.velocity;
      coil.current.vr = sr.velocity;
      coil.current.vl = sl.velocity;
    }

    const pts = helixPoints(coil.current.turns, coil.current.radius, coil.current.lift, pointCount);
    const curve = new THREE.CatmullRomCurve3(pts);
    const next = new THREE.TubeGeometry(curve, tubular, 0.06, radial, false);
    meshRef.current.geometry.dispose();
    meshRef.current.geometry = next;

    if (filamentRef.current) {
      const thin = helixPoints(
        coil.current.turns * 1.05,
        coil.current.radius * 0.72,
        coil.current.lift * 0.92,
        pointCount,
        0.9
      );
      const fCurve = new THREE.CatmullRomCurve3(thin);
      const fGeo = new THREE.TubeGeometry(fCurve, tubular, 0.018, 6, false);
      filamentRef.current.geometry.dispose();
      filamentRef.current.geometry = fGeo;
    }

    if (beadsRef.current) {
      const tip = pts[pts.length - 1];
      const trail = tipTrail.current;
      for (let i = trail.length - 1; i > 0; i--) trail[i].copy(trail[i - 1]);
      trail[0].copy(tip);
      for (let i = 0; i < trail.length; i++) {
        dummy.position.copy(trail[i]);
        const s = 0.04 + (1 - i / trail.length) * 0.06;
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        beadsRef.current.setMatrixAt(i, dummy.matrix);
      }
      beadsRef.current.instanceMatrix.needsUpdate = true;
    }

    if (matRef.current) {
      const flow = 0.5 + 0.5 * Math.sin(t * 3.2);
      const holdGlow = hold * 0.35;
      matRef.current.emissiveIntensity = 0.48 * glow.current + flow * 0.45 + holdGlow;
    }

    if (!reduced) meshRef.current.rotation.y = t * 0.18;

    const force = Math.max(0, 1.6 - Math.hypot(pointer.x * 2, pointer.y * 2)) * 0.35;
    const tx = pointer.x * force;
    const ty = pointer.y * force;
    const tz = force * 0.4;
    if (reduced) {
      offset.current = { x: tx, y: ty, z: tz, vx: 0, vy: 0, vz: 0 };
    } else {
      const sx = springStep(offset.current.x, tx, offset.current.vx, 0.12, 0.84);
      const sy = springStep(offset.current.y, ty, offset.current.vy, 0.12, 0.84);
      const sz = springStep(offset.current.z, tz, offset.current.vz, 0.12, 0.84);
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

  const initialGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(helixPoints(3.2, 0.85, 2.2, pointCount));
    return new THREE.TubeGeometry(curve, tubular, 0.06, radial, false);
  }, [pointCount, tubular, radial]);

  const filamentGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(helixPoints(3.3, 0.6, 2.0, pointCount, 0.9));
    return new THREE.TubeGeometry(curve, tubular, 0.018, 6, false);
  }, [pointCount, tubular]);

  return (
    <group ref={group}>
      <Float speed={0.9} rotationIntensity={0.12} floatIntensity={0.28}>
        <mesh ref={meshRef} geometry={initialGeo} castShadow>
          <meshPhysicalMaterial
            ref={matRef}
            color="#b91c1c"
            metalness={0.72}
            roughness={0.2}
            clearcoat={1}
            iridescence={0.4}
            emissive="#6b1010"
            emissiveIntensity={0.48}
          />
        </mesh>
        <mesh ref={filamentRef} geometry={filamentGeo} castShadow>
          <meshPhysicalMaterial
            color="#f87171"
            metalness={0.55}
            roughness={0.3}
            emissive="#b91c1c"
            emissiveIntensity={0.55}
          />
        </mesh>
        <instancedMesh ref={beadsRef} args={[undefined, undefined, 12]} castShadow>
          <sphereGeometry args={[1, 8, 8]} />
          <meshPhysicalMaterial
            color="#e8e4dc"
            metalness={0.4}
            roughness={0.35}
            emissive="#b91c1c"
            emissiveIntensity={0.5}
          />
        </instancedMesh>
        <mesh castShadow>
          <icosahedronGeometry args={[0.26, 1]} />
          <meshPhysicalMaterial color="#d4d4d8" metalness={0.92} roughness={0.14} clearcoat={1} />
        </mesh>
      </Float>
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
      minDistance={2.2}
      maxDistance={5}
      autoRotate={!dragging}
      autoRotateSpeed={0.35}
    />
  );
}

export function AlcoveRibbon({
  expanded = false,
  exhibitId,
}: {
  expanded?: boolean;
  exhibitId?: string;
}) {
  const quality: GalleryQuality = expanded ? "full" : "thumb";
  const [params, setParams] = useSeededParams(exhibitId, { coil: 1, glow: 1 });
  const coilRef = useRef(params.coil);
  const glowRef = useRef(params.glow);
  coilRef.current = params.coil;
  glowRef.current = params.glow;

  return (
    <div className="absolute inset-0 h-full w-full bg-[#0e0e10]">
      <ClientMount>
        <Canvas
          camera={{ position: [0, 0.2, 3.2], fov: 42 }}
          dpr={quality === "thumb" ? [1, 1.25] : [1, 1.75]}
          gl={{ antialias: true, alpha: false }}
        >
          <GalleryRig quality={quality}>
            <GalleryKeyLight />
            <LivingRibbon quality={quality} coilAmp={coilRef} glow={glowRef} />
            <Controls />
          </GalleryRig>
        </Canvas>
      </ClientMount>
      <StageControlStrip>
        <StageSlider
          label="Coil"
          value={params.coil}
          min={0.4}
          max={1.4}
          step={0.05}
          onChange={(v) => setParams((p) => ({ ...p, coil: v }))}
        />
        <StageSlider
          label="Glow"
          value={params.glow}
          min={0.3}
          max={1.6}
          step={0.05}
          onChange={(v) => setParams((p) => ({ ...p, glow: v }))}
        />
      </StageControlStrip>
    </div>
  );
}
