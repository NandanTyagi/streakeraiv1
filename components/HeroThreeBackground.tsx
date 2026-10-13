"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";

type PointerState = { x: number; y: number };

const usePointer = () => {
  const [pointer, setPointer] = useState<PointerState>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      const nextX = (event.clientX / window.innerWidth) * 2 - 1;
      const nextY = (event.clientY / window.innerHeight) * 2 - 1;
      setPointer({ x: nextX, y: nextY });
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return pointer;
};

const DriftParticles = ({ pointer, count = 900 }: { pointer: PointerState; count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { basePositions, phases } = useMemo(() => {
    const base = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      const idx = i * 3;
      base[idx] = THREE.MathUtils.randFloatSpread(18);
      base[idx + 1] = THREE.MathUtils.randFloatSpread(8) * 0.5;
      base[idx + 2] = THREE.MathUtils.randFloatSpread(14);
      phase[i] = Math.random() * Math.PI * 2;
    }
    return { basePositions: base, phases: phase };
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < count; i += 1) {
      const idx = i * 3;
      const sway = Math.sin(t * 0.6 + phases[i]) * 0.35;
      const drift = Math.cos(t * 0.4 + phases[i]) * 0.2;
      positions[idx] = basePositions[idx] + pointer.x * 1.2 + drift;
      positions[idx + 1] = basePositions[idx + 1] + sway;
      positions[idx + 2] = basePositions[idx + 2] + pointer.y * 0.8;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={basePositions}
          itemSize={3}
          count={basePositions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#a3998b"
        opacity={0.6}
        transparent
        depthWrite={false}
      />
    </points>
  );
};

const LedgerTiles = ({ pointer, rows = 10, cols = 18 }: { pointer: PointerState; rows?: number; cols?: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tiles = useMemo(() => {
    const next: Array<{
      x: number;
      z: number;
      size: number;
      lift: number;
      phase: number;
    }> = [];
    const spacingX = 1.05;
    const spacingZ = 0.85;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        if ((row + col) % 7 === 0 || (row % 4 === 0 && col % 5 === 0)) continue;
        next.push({
          x: (col - (cols - 1) / 2) * spacingX,
          z: (row - (rows - 1) / 2) * spacingZ,
          size: THREE.MathUtils.randFloat(0.4, 0.7),
          lift: THREE.MathUtils.randFloat(0.04, 0.12),
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
    return next;
  }, [rows, cols]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const temp = new THREE.Object3D();
    tiles.forEach((tile, index) => {
      const bob = Math.sin(t * 0.8 + tile.phase) * tile.lift;
      const x = tile.x + pointer.x * 1.4;
      const z = tile.z + pointer.y * 1.2;
      temp.position.set(x, bob - 0.6, z);
      temp.rotation.set(-Math.PI / 2, 0, 0);
      temp.scale.set(tile.size, tile.size, 0.4);
      temp.updateMatrix();
      meshRef.current!.setMatrixAt(index, temp.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, tiles.length]}>
      <boxGeometry args={[1, 1, 0.08]} />
      <meshStandardMaterial color="#cfc5b9" roughness={0.9} metalness={0.05} />
    </instancedMesh>
  );
};

const Scene = ({ pointer }: { pointer: PointerState }) => {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[6, 8, 4]} intensity={0.35} />
      <fog attach="fog" args={["#f6f2ea", 8, 24]} />
      <DriftParticles pointer={pointer} />
      <LedgerTiles pointer={pointer} />
    </>
  );
};

export default function HeroThreeBackground() {
  const pointer = usePointer();
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const supportsWebGL = typeof window !== "undefined" && !!window.WebGLRenderingContext;

  if (reduceMotion || !supportsWebGL) return null;

  return (
    <div className="hero-three-bg" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 48, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <Scene pointer={pointer} />
      </Canvas>
    </div>
  );
}
