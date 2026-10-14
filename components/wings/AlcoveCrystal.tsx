"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GalleryKeyLight, GalleryRig, type GalleryQuality } from "@/components/museum/GalleryRig";
import { preferReducedMotion, springStep } from "@/lib/museum/spring";

function Crystal({ quality }: { quality: GalleryQuality }) {
  const ref = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const reduced = preferReducedMotion();
  const offset = useRef({ x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 });

  useFrame((_, dt) => {
    if (!ref.current || !group.current) return;
    if (!reduced) {
      ref.current.rotation.y += dt * 0.35;
      ref.current.rotation.x += dt * 0.12;
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
      offset.current = { x: sx.value, y: sy.value, z: sz.value, vx: sx.velocity, vy: sy.velocity, vz: sz.velocity };
    }
    group.current.position.set(offset.current.x, offset.current.y, offset.current.z);
  });

  const transmission = quality === "full";

  return (
    <group ref={group}>
      <mesh ref={ref} castShadow>
        <octahedronGeometry args={[1.05, 0]} />
        {transmission ? (
          <MeshTransmissionMaterial
            backside
            samples={6}
            thickness={1.2}
            chromaticAberration={0.12}
            anisotropy={0.3}
            distortion={0.2}
            distortionScale={0.4}
            temporalDistortion={0.1}
            color="#c4c4cc"
            attenuationColor="#b91c1c"
            attenuationDistance={1.4}
          />
        ) : (
          <meshPhysicalMaterial
            color="#c4c4cc"
            metalness={0.15}
            roughness={0.12}
            transmission={0.6}
            thickness={1}
            transparent
            opacity={0.92}
          />
        )}
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

export function AlcoveCrystal({ expanded = false }: { expanded?: boolean }) {
  const quality: GalleryQuality = expanded ? "full" : "thumb";
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 3.4], fov: 40 }}
        dpr={quality === "thumb" ? [1, 1.25] : [1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        <GalleryRig quality={quality}>
          <GalleryKeyLight color="#fff8f0" intensity={1.5} />
          <Crystal quality={quality} />
          <Controls />
        </GalleryRig>
      </Canvas>
    </div>
  );
}
