"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GalleryKeyLight, GalleryRig, type GalleryQuality } from "@/components/museum/GalleryRig";
import { preferReducedMotion, springStep } from "@/lib/museum/spring";

function Ribbon() {
  const ref = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const reduced = preferReducedMotion();
  const offset = useRef({ x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 });

  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      Array.from({ length: 40 }, (_, i) => {
        const t = i / 39;
        const a = t * Math.PI * 6;
        return new THREE.Vector3(Math.cos(a) * (0.6 + t * 0.4), (t - 0.5) * 2.2, Math.sin(a) * (0.6 + t * 0.4));
      })
    );
    return new THREE.TubeGeometry(curve, 220, 0.06, 16, false);
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!ref.current || !group.current) return;
    if (!reduced) ref.current.rotation.y = clock.getElapsedTime() * 0.25;

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
      offset.current = { x: sx.value, y: sy.value, z: sz.value, vx: sx.velocity, vy: sy.velocity, vz: sz.velocity };
    }
    group.current.position.set(offset.current.x, offset.current.y, offset.current.z);
  });

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh ref={ref} geometry={geo} castShadow>
          <meshPhysicalMaterial
            color="#b91c1c"
            metalness={0.75}
            roughness={0.22}
            clearcoat={1}
            iridescence={0.35}
            emissive="#4a0a0a"
            emissiveIntensity={0.35}
          />
        </mesh>
        <mesh castShadow>
          <icosahedronGeometry args={[0.28, 1]} />
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
      autoRotateSpeed={0.4}
    />
  );
}

export function AlcoveRibbon({ expanded = false }: { expanded?: boolean }) {
  const quality: GalleryQuality = expanded ? "full" : "thumb";
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        camera={{ position: [0, 0.2, 3.2], fov: 42 }}
        dpr={quality === "thumb" ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: true, alpha: false }}
      >
        <GalleryRig quality={quality}>
          <GalleryKeyLight />
          <Ribbon />
          <Controls />
        </GalleryRig>
      </Canvas>
    </div>
  );
}
