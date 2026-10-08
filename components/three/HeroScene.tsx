"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  RoundedBox,
} from "@react-three/drei";
import { damp, scrollState } from "@/lib/scroll-store";
import { useInView } from "@/hooks/useInView";

/** Camera answers to the pointer and to hero scroll progress. */
function Rig() {
  useFrame((state, dt) => {
    const p = scrollState.hero;
    const cam = state.camera;
    cam.position.x = damp(cam.position.x, scrollState.pointer.x * 0.75, 2.6, dt);
    cam.position.y = damp(cam.position.y, scrollState.pointer.y * 0.5 + p * 1.6, 2.6, dt);
    cam.position.z = damp(cam.position.z, 6.4 + p * 3.2, 2.6, dt);
    cam.lookAt(0, -p * 0.9, 0);
  });
  return null;
}

function Card({
  position,
  rotation,
  color,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}) {
  return (
    <Float speed={1.3} rotationIntensity={0.45} floatIntensity={0.9}>
      <RoundedBox args={[1.16, 0.74, 0.05]} radius={0.045} smoothness={4} position={position} rotation={rotation}>
        <meshPhysicalMaterial color={color} roughness={0.32} metalness={0.05} clearcoat={0.9} clearcoatRoughness={0.15} />
      </RoundedBox>
    </Float>
  );
}

export default function HeroScene() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="h-full w-full">
      <Canvas
        className="pointer-events-none"
        dpr={[1, 1.75]}
        frameloop={inView ? "always" : "never"}
        camera={{ position: [0, 0, 6.4], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Rig />
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} />
        <directionalLight position={[-5, -2, -3]} intensity={0.5} color="#cfe3d5" />

        <Card position={[-2.5, 1.15, 1.1]} rotation={[0.16, 0.5, -0.13]} color="#D9FF57" />
        <Card position={[2.6, -0.95, 0.9]} rotation={[-0.2, -0.45, 0.16]} color="#123D2B" />
        <Card position={[1.95, 1.55, -1.4]} rotation={[0.3, -0.2, 0.24]} color="#FFFDF7" />

        {/* New card: bottom-left, with margin from the scene edges */}
        <Card position={[-3.1, -1.85, 0.5]} rotation={[-0.12, 0.4, 0.1]} color="#9CB8A6" />

        <ContactShadows
          position={[0, -2.35, 0]}
          opacity={0.3}
          scale={14}
          blur={2.8}
          far={4.5}
          color="#101311"
        />

        <Environment resolution={256} frames={1}>
          <Lightformer intensity={2.4} position={[0, 5, -6]} scale={[12, 6, 1]} />
          <Lightformer intensity={1.1} position={[-6, 1, 2]} scale={[6, 8, 1]} color="#eaf3ec" />
          <Lightformer intensity={1.4} position={[6, -2, 3]} scale={[6, 6, 1]} color="#fff8e6" />
        </Environment>
      </Canvas>
    </div>
  );
}