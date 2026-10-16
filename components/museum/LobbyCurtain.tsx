"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ClientMount } from "@/components/museum/ClientMount";

function CurtainMesh() {
  const mesh = useRef<THREE.Mesh>(null);
  const { gl } = useThree();
  const pointer = useRef({ u: 0.5, v: 0.5 });

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uColorA: { value: new THREE.Color("#e4ddd2") },
        uColorB: { value: new THREE.Color("#1a1816") },
        uAccent: { value: new THREE.Color("#dc2626") },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec2 uPointer;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uAccent;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        void main() {
          vec2 uv = vUv;
          float dist = length(uv - uPointer);
          float warp = exp(-dist * 4.5) * 0.22;
          vec2 wuv = uv + (uv - uPointer) * warp;

          float n = noise(wuv * 4.2 + vec2(uTime * 0.07, -uTime * 0.045));
          float n2 = noise(wuv * 9.0 - vec2(uTime * 0.04, uTime * 0.06));
          float bands = smoothstep(
            0.28,
            0.72,
            0.5 + 0.5 * sin(wuv.x * 3.6 + n * 2.8 + uTime * 0.18 + n2 * 0.9)
          );
          float vein = smoothstep(0.45, 0.55, abs(sin(wuv.y * 18.0 + n * 7.0 - uTime * 1.15)));
          float tip = exp(-dist * 5.5);

          vec3 col = mix(uColorB, uColorA, bands * 0.95);
          col = mix(col, uAccent, vein * 0.55 * (1.0 - wuv.y * 0.3));
          col = mix(col, uAccent * 1.2, tip * 0.42);
          float grain = hash(wuv * 900.0 + vec2(uTime)) * 0.04;
          col += grain;

          // Soft vignette — vault edge (keep readable mid-field)
          float vig = smoothstep(1.2, 0.28, length(uv - 0.5) * 1.35);
          col *= 0.72 + vig * 0.35;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }, []);

  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.current.u = (e.clientX - r.left) / Math.max(1, r.width);
      pointer.current.v = 1 - (e.clientY - r.top) / Math.max(1, r.height);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [gl]);

  useFrame((_, dt) => {
    material.uniforms.uTime.value += dt;
    const p = material.uniforms.uPointer.value as THREE.Vector2;
    p.lerp(new THREE.Vector2(pointer.current.u, pointer.current.v), 0.08);
  });

  return (
    <mesh ref={mesh} scale={[2.6, 1.55, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export function LobbyCurtain() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 40% 45%, #3a3530 0%, #16161c 45%, #0a0a0c 100%)",
      }}
    >
      <ClientMount>
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0, 1.15], fov: 50 }}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          className="touch-none cursor-crosshair h-full w-full"
          style={{ width: "100%", height: "100%" }}
        >
          <CurtainMesh />
        </Canvas>
      </ClientMount>
    </div>
  );
}
