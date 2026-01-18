"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type PointerState = {
  x: number;
  y: number;
};

const useRenderMode = () => {
  const [mode, setMode] = useState("interactive");

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setMode(root.dataset.renderMode || "interactive");
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["data-render-mode"] });
    return () => observer.disconnect();
  }, []);

  return mode;
};

const useScrollProgress = (enabled: boolean) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const container =
      document.querySelector("[data-scroll-root]") ||
      document.querySelector("main") ||
      document.scrollingElement;

    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop || 0;
      const max = Math.max(container.scrollHeight - container.clientHeight, 1);
      setProgress(Math.min(scrollTop / max, 1));
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [enabled]);

  return progress;
};

const usePointer = (enabled: boolean) => {
  const [pointer, setPointer] = useState<PointerState>({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    const handleMove = (event: PointerEvent) => {
      const nextX = (event.clientX / window.innerWidth) * 2 - 1;
      const nextY = (event.clientY / window.innerHeight) * 2 - 1;
      setPointer({ x: nextX, y: nextY });
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [enabled]);

  return pointer;
};

const ScrollRig = ({
  progress,
  pointer,
  travel = 40,
}: {
  progress: number;
  pointer: PointerState;
  travel?: number;
}) => {
  const { camera } = useThree();
  const baseZ = 18;
  const baseY = 6.5;

  useFrame(() => {
    const targetZ = baseZ - progress * travel;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.6, 0.04);
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      baseY + pointer.y * 0.25,
      0.04
    );
    camera.lookAt(0, 0, camera.position.z - 4);
  });

  return null;
};

const LedgerGrid = ({
  rows,
  cols,
  cell,
  gap,
  color,
  edgeColor,
}: {
  rows: number;
  cols: number;
  cell: number;
  gap: number;
  color: string;
  edgeColor: string;
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { instances } = useMemo(() => {
    const next: Array<{ position: [number, number, number]; color: THREE.Color }> = [];
    const stride = cell + gap;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const gapRow = row % 13 === 0 && col % 4 === 0;
        const gapColumn = row % 9 === 0 && col % 7 === 2;
        if (gapRow || gapColumn) continue;
        const x = (col - (cols - 1) / 2) * stride;
        const z = (row - rows / 2) * stride;
        const tone = row % 7 === 0 ? edgeColor : color;
        next.push({ position: [x, 0, z], color: new THREE.Color(tone) });
      }
    }
    return { instances: next };
  }, [rows, cols, cell, gap, color, edgeColor]);

  useEffect(() => {
    if (!meshRef.current) return;
    const temp = new THREE.Object3D();
    instances.forEach((instance, i) => {
      temp.position.set(...instance.position);
      temp.scale.set(1, 1, 1);
      temp.updateMatrix();
      meshRef.current!.setMatrixAt(i, temp.matrix);
      meshRef.current!.setColorAt(i, instance.color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [instances]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, instances.length]}>
      <boxGeometry args={[cell, 0.06, cell]} />
      <meshStandardMaterial
        color={color}
        roughness={1}
        metalness={0}
        transparent
        opacity={0.9}
      />
    </instancedMesh>
  );
};

const StreakLines = ({ width }: { width: number }) => {
  const segments = useMemo(() => {
    const lines = [
      { x: -width * 0.25, zStart: -18, zEnd: 28, segment: 6, gap: 2.8 },
      { x: 0, zStart: -10, zEnd: 36, segment: 7, gap: 3.6 },
      { x: width * 0.2, zStart: -26, zEnd: 20, segment: 5, gap: 2.4 },
    ];
    const pieces: Array<{ x: number; z: number; length: number }> = [];
    lines.forEach((line) => {
      let cursor = line.zStart;
      while (cursor < line.zEnd) {
        pieces.push({
          x: line.x,
          z: cursor + line.segment / 2,
          length: line.segment,
        });
        cursor += line.segment + line.gap;
      }
    });
    return pieces;
  }, [width]);

  return (
    <group>
      {segments.map((segment, index) => (
        <mesh
          key={`${segment.x}-${segment.z}-${index}`}
          position={[segment.x, 0.08, segment.z]}
        >
          <boxGeometry args={[0.12, 0.05, segment.length]} />
          <meshStandardMaterial color="#9a8f7d" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

const ReflectionScene = ({
  progress,
  pointer,
  rows,
  cols,
}: {
  progress: number;
  pointer: PointerState;
  rows: number;
  cols: number;
}) => {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ camera }) => {
    if (!lightRef.current) return;
    lightRef.current.position.lerp(
      new THREE.Vector3(camera.position.x, camera.position.y + 2, camera.position.z - 2),
      0.2
    );
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 10, 6]} intensity={0.4} />
      <pointLight ref={lightRef} intensity={0.6} distance={40} />
      <fog attach="fog" args={["#f4f1ec", 6, 40]} />
      <ScrollRig progress={progress} pointer={pointer} />
      <LedgerGrid
        rows={rows}
        cols={cols}
        cell={0.7}
        gap={0.32}
        color="#dfd7cc"
        edgeColor="#cfc5b9"
      />
      <StreakLines width={cols * 1.1} />
    </>
  );
};

export default function SpatialReflectionLayer() {
  const mode = useRenderMode();
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const supportsWebGL = typeof window !== "undefined" && !!window.WebGLRenderingContext;
  const isLowPower =
    typeof navigator !== "undefined" &&
    ((navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4) <= 4;
  const enabled = mode === "spatial-reflection" && !reduceMotion && supportsWebGL;
  const progress = useScrollProgress(enabled);
  const pointer = usePointer(enabled);
  const rows = isLowPower ? 54 : 84;
  const cols = isLowPower ? 10 : 16;

  if (!enabled) return null;

  return (
    <div className="spatial-reflection-layer" aria-hidden="true">
      <Canvas
        orthographic
        camera={{ position: [0, 6.5, 18], zoom: 40, near: 0.1, far: 200 }}
        dpr={isLowPower ? 1 : [1, 1.5]}
        gl={{ antialias: !isLowPower, powerPreference: "low-power" }}
      >
        <ReflectionScene progress={progress} pointer={pointer} rows={rows} cols={cols} />
      </Canvas>
    </div>
  );
}
