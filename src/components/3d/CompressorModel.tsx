/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TextSprite } from './TextSprite';

interface CompressorModelProps {
  position: [number, number, number];
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
  isRunning?: boolean;
  tempC?: number;
  pressureKPa?: number;
}

export const CompressorModel: React.FC<CompressorModelProps> = ({
  position,
  isActive,
  isHovered,
  onClick,
  onPointerOver,
  onPointerOut,
  isRunning = true,
  tempC,
  pressureKPa,
}) => {
  const rotorRef = useRef<THREE.Group>(null);
  const pistonRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (isRunning && rotorRef.current) {
      rotorRef.current.rotation.y += delta * 4;
    }
    if (isRunning && pistonRef.current) {
      pistonRef.current.position.y = 0.5 + Math.sin(Date.now() * 0.008) * 0.12;
    }
  });

  const highlight = isActive || isHovered;
  const bodyColor = highlight ? '#ef4444' : '#1e293b';
  const headColor = highlight ? '#f87171' : '#334155';

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
      }}
      onPointerOut={onPointerOut}
    >
      {/* 3D Floating Billboard Label (Native WebGL - Zero DOM root unmount conflicts) */}
      <TextSprite
        position={[0, 2.5, 0]}
        title="COMPRESSOR"
        subtitle={pressureKPa !== undefined ? `${pressureKPa} kPa • ${tempC}°C` : undefined}
        accentColor="#ef4444"
        isActive={highlight}
        scale={[2.2, 0.75, 1]}
      />

      {/* Mounting Footplate */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <boxGeometry args={[1.6, 0.12, 1.6]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.8} />
      </mesh>

      {/* Rubber anti-vibration bushings */}
      {[-0.6, 0.6].map((x) =>
        [-0.6, 0.6].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.16, z]}>
            <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
            <meshStandardMaterial color="#020617" roughness={0.9} />
          </mesh>
        ))
      )}

      {/* Main Hermetic Shell Base Cylinder */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.75, 0.75, 1.4, 32]} />
        <meshStandardMaterial
          color={bodyColor}
          metalness={0.85}
          roughness={0.35}
          emissive={highlight ? '#ef4444' : '#000000'}
          emissiveIntensity={highlight ? 0.25 : 0}
        />
      </mesh>

      {/* Upper Domed Cylinder Head */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial
          color={headColor}
          metalness={0.9}
          roughness={0.3}
          emissive={highlight ? '#ef4444' : '#000000'}
          emissiveIntensity={highlight ? 0.3 : 0}
        />
      </mesh>

      {/* Hermetic casing rim ring */}
      <mesh position={[0, 0.9, 0]}>
        <torusGeometry args={[0.76, 0.04, 16, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Viewport Window (showing internal spinning rotor) */}
      <mesh position={[0, 0.8, 0.72]}>
        <circleGeometry args={[0.3, 24]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          roughness={0.1}
          metalness={0.1}
          transmission={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Viewport Bezel */}
      <mesh position={[0, 0.8, 0.73]}>
        <torusGeometry args={[0.3, 0.03, 16, 32]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Spinning Internal Rotor Mechanism visible through window */}
      <group position={[0, 0.8, 0.3]} ref={rotorRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Rotor vanes */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
            <boxGeometry args={[0.42, 0.06, 0.08]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Reciprocating Piston Mockup */}
      <mesh ref={pistonRef} position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 16]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Suction Port (Inlet from Evaporator - Blue side) */}
      <mesh position={[-0.75, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.3, 16]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Discharge Port (Outlet to Condenser - Red side) */}
      <mesh position={[0.75, 1.4, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
        <meshStandardMaterial color="#ef4444" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Ground Contact Soft Shadow Disk */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  );
};
