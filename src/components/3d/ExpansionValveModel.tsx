/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TextSprite } from './TextSprite';

interface ExpansionValveModelProps {
  position: [number, number, number];
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
  pHighKPa?: number;
  pLowKPa?: number;
}

export const ExpansionValveModel: React.FC<ExpansionValveModelProps> = ({
  position,
  isActive,
  isHovered,
  onClick,
  onPointerOver,
  onPointerOut,
  pHighKPa,
  pLowKPa,
}) => {
  const flashRingRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (flashRingRef.current) {
      flashRingRef.current.rotation.z += delta * 2;
    }
  });

  const highlight = isActive || isHovered;
  const brassColor = highlight ? '#fbbf24' : '#d97706';

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
      {/* 3D Floating Billboard Label (Native WebGL) */}
      <TextSprite
        position={[0, 2.3, 0]}
        title="EXPANSION VALVE"
        subtitle={
          pHighKPa !== undefined && pLowKPa !== undefined
            ? `ΔP: ${(pHighKPa - pLowKPa).toFixed(0)} kPa drop`
            : undefined
        }
        accentColor="#06b6d4"
        isActive={highlight}
        scale={[2.4, 0.75, 1]}
      />

      {/* Valve Base Pedestal */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.2, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Central Brass Valve Block Body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.55, 0.8, 0.55]} />
        <meshStandardMaterial
          color={brassColor}
          metalness={0.92}
          roughness={0.25}
          emissive={highlight ? '#f59e0b' : '#000000'}
          emissiveIntensity={highlight ? 0.35 : 0}
        />
      </mesh>

      {/* Hexagonal Adjustment Nut */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.15, 6]} />
        <meshStandardMaterial color="#b45309" metalness={0.95} roughness={0.2} />
      </mesh>

      {/* Top Thermostatic Diaphragm Dome / Power Head */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <sphereGeometry args={[0.4, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Diaphragm Flange Ring */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.08, 24]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Top Capillary Tube Connection to Sensing Bulb */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 12]} />
        <meshStandardMaterial color="#ea580c" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0.25, 1.6, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.06, 0.06, 0.35, 16]} />
        <meshStandardMaterial color="#b45309" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* High-Pressure Liquid Inlet Port (From Condenser - Orange) */}
      <mesh position={[0, 0.6, -0.38]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.25, 16]} />
        <meshStandardMaterial color="#f97316" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Low-Pressure Flashing Outlet Port (To Evaporator - Cyan) */}
      <mesh position={[-0.38, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.25, 16]} />
        <meshStandardMaterial color="#06b6d4" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Orifice Constriction Indicator Ring */}
      <mesh ref={flashRingRef} position={[0, 0.6, 0]}>
        <torusGeometry args={[0.3, 0.02, 12, 24]} />
        <meshBasicMaterial color="#22d3ee" wireframe />
      </mesh>

      {/* Shadow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.8, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  );
};
