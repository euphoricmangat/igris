"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function CurtainMesh() {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color("#8e959a") },
        uColorB: { value: new THREE.Color("#0e0e10") },
        uAccent: { value: new THREE.Color("#b91c1c") },
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
          float n = noise(uv * 4.0 + vec2(uTime * 0.08, -uTime * 0.05));
          float bands = smoothstep(
            0.35,
            0.75,
            0.5 + 0.5 * sin(uv.x * 3.0 + n * 2.0 + uTime * 0.15)
          );
          float vein = smoothstep(0.48, 0.52, abs(sin(uv.y * 18.0 + n * 6.0 - uTime)));
          vec3 col = mix(uColorB, uColorA, bands);
          col = mix(col, uAccent, vein * 0.55 * (1.0 - uv.y * 0.4));
          float grain = hash(uv * 800.0 + vec2(uTime)) * 0.06;
          col += grain;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }, []);

  useFrame((_, dt) => {
    material.uniforms.uTime.value += dt;
  });

  return (
    <mesh ref={mesh} scale={[2.4, 1.45, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export function LobbyCurtain() {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 1.2], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        <CurtainMesh />
      </Canvas>
    </div>
  );
}
