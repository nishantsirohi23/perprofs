"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { damp, scrollState } from "@/lib/scroll-store";
import { useInView } from "@/hooks/useInView";

const NODE_COUNT = 30;
const RADIUS = 2.6;

/** Fibonacci-sphere nodes plus a de-duplicated nearest-neighbour edge list. */
function useNetwork() {
  return useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < NODE_COUNT; i++) {
      const y = 1 - (i / (NODE_COUNT - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      nodes.push(
        new THREE.Vector3(Math.cos(theta) * r * RADIUS, y * RADIUS, Math.sin(theta) * r * RADIUS),
      );
    }

    const seen = new Set<string>();
    const edges: [number, number][] = [];
    nodes.forEach((node, i) => {
      nodes
        .map((other, j) => ({ j, d: node.distanceTo(other) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3)
        .forEach(({ j }) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (seen.has(key)) return;
          seen.add(key);
          edges.push([i, j]);
        });
    });

    const positions = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], k) => {
      positions.set(
        [nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z],
        k * 6,
      );
    });

    return { nodes, edges, positions };
  }, []);
}
function Network() {
  const { nodes, edges, positions } = useNetwork();
  const group = useRef<THREE.Group>(null);
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const packetRefs = useRef<(THREE.Mesh | null)[]>([]);

  const packets = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        edge: (i * 7) % edges.length,
        t: (i / 12) % 1,
        speed: 0.3 + (i % 5) * 0.09,
      })),
    [edges.length],
  );

  useFrame((state, dt) => {
    const p = scrollState.network;
    const time = state.clock.elapsedTime;

    if (group.current) {
      group.current.rotation.y = time * 0.07 + p * Math.PI * 0.85;
      group.current.rotation.x = damp(
        group.current.rotation.x,
        -0.12 + p * 0.36 + scrollState.pointer.y * 0.1,
        2,
        dt,
      );
    }

    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const appear = THREE.MathUtils.clamp((p * (NODE_COUNT + 10) - i) / 5, 0, 1);
      const pulse = 1 + Math.sin(time * 2.1 + i * 0.7) * 0.14;
      mesh.scale.setScalar(damp(mesh.scale.x, appear * pulse, 6, dt));
    });

    packets.forEach((packet, i) => {
      const mesh = packetRefs.current[i];
      if (!mesh) return;
      packet.t += dt * packet.speed;
      if (packet.t > 1) {
        packet.t = 0;
        packet.edge = Math.floor(Math.random() * edges.length);
      }
      const [a, b] = edges[packet.edge];
      mesh.position.lerpVectors(nodes[a], nodes[b], packet.t);
      mesh.scale.setScalar(damp(mesh.scale.x, p > 0.18 ? 1 : 0, 5, dt));
    });
  });
  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#123D2B" transparent opacity={0.2} />
      </lineSegments>

      {nodes.map((node, i) => {
        const isHub = i % 7 === 0;
        return (
          <mesh
            key={`node-${i}`}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            position={node}
            scale={0}
          >
            <icosahedronGeometry args={[isHub ? 0.13 : 0.062, 1]} />
            <meshStandardMaterial
              color={isHub ? "#D9FF57" : "#123D2B"}
              metalness={0.4}
              roughness={0.32}
            />
          </mesh>
        );
      })}

      {packets.map((_, i) => (
        <mesh
          key={`packet-${i}`}
          ref={(el) => {
            packetRefs.current[i] = el;
          }}
          scale={0}
        >
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial color="#DB5C36" />
        </mesh>
      ))}

      <mesh>
        <icosahedronGeometry args={[RADIUS, 2]} />
        <meshBasicMaterial color="#123D2B" wireframe transparent opacity={0.05} />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.6, 48, 48]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.06}
          metalness={0.05}
          clearcoat={1}
          transmission={0.85}
          thickness={0.7}
          ior={1.35}
          transparent
        />
      </mesh>
    </group>
  );
}
function NetRig() {
  useFrame((state, dt) => {
    const p = scrollState.network;
    const cam = state.camera;
    cam.position.z = damp(cam.position.z, 9.4 - p * 3.6, 2.2, dt);
    cam.position.x = damp(cam.position.x, scrollState.pointer.x * 0.55, 2, dt);
    cam.position.y = damp(cam.position.y, scrollState.pointer.y * 0.3, 2, dt);
    cam.lookAt(0, 0, 0);
  });
  return null;
}

export default function AgentNetwork3D() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="h-full w-full">
      <Canvas
        className="pointer-events-none"
        dpr={[1, 1.7]}
        frameloop={inView ? "always" : "never"}
        camera={{ position: [0, 0, 9.4], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <NetRig />
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 4]} intensity={1.3} />
        <Network />
        <Environment resolution={128} frames={1}>
          <Lightformer intensity={2} position={[0, 4, -5]} scale={[10, 5, 1]} />
          <Lightformer intensity={1} position={[-5, 0, 3]} scale={[5, 6, 1]} color="#eef4ef" />
        </Environment>
      </Canvas>
    </div>
  );
}
