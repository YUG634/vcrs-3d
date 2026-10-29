/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TextSprite } from './TextSprite';

interface EvaporatorModelProps {
  position: [number, number, number];
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
  tempC?: number;
  pressureKPa?: number;
  qe?: number;
}

export const EvaporatorModel: React.FC<EvaporatorModelProps> = ({
  position,
  isActive,
  isHovered,
  onClick,
  onPointerOver,
  onPointerOut,
  tempC,
  pressureKPa,
  qe,
}) => {
  const frostRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (frostRef.current) {
      frostRef.current.rotation.y += delta * 0.3;
    }
  });

  const highlight = isActive || isHovered;
  const tubeColor = highlight ? '#38bdf8' : '#0284c7';
  const finColor = highlight ? '#bae6fd' : '#94a3b8';

  const tubeRows = [0.4, 0.8, 1.2, 1.6];
  const finCount = 14;
  const finSpacing = 1.6 / finCount;

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
        position={[0, 2.5, 0]}
        title="EVAPORATOR"
        subtitle={
          pressureKPa !== undefined
            ? `${pressureKPa} kPa • ${tempC}°C${qe ? ` • q: ${qe}` : ''}`
            : undefined
        }
        accentColor="#38bdf8"
        isActive={highlight}
        scale={[2.2, 0.75, 1]}
      />

      {/* Condensate Drain Pan at Bottom */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[1.9, 0.1, 0.95]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Frame Posts */}
      {[-0.9, 0.9].map((x) => (
        <mesh key={`post-${x}`} position={[x, 1.0, 0]}>
          <boxGeometry args={[0.08, 1.6, 0.9]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Chilled Serpentine Tubes */}
      {tubeRows.map((y, index) => (
        <group key={`evap-tube-${index}`}>
          <mesh position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 1.7, 16]} />
            <meshStandardMaterial
              color={tubeColor}
              metalness={0.9}
              roughness={0.2}
              emissive={highlight ? '#0284c7' : '#000000'}
              emissiveIntensity={highlight ? 0.35 : 0}
            />
          </mesh>
          {index < tubeRows.length - 1 && (
            <mesh
              position={[index % 2 === 0 ? 0.85 : -0.85, y + 0.2, 0]}
              rotation={[0, 0, index % 2 === 0 ? 0 : Math.PI]}
            >
              <torusGeometry args={[0.2, 0.07, 16, 16, Math.PI]} />
              <meshStandardMaterial color={tubeColor} metalness={0.9} roughness={0.2} />
            </mesh>
          )}
        </group>
      ))}

      {/* Vertical Aluminum Fins */}
      {Array.from({ length: finCount }).map((_, i) => {
        const xPos = -0.7 + i * finSpacing;
        return (
          <mesh key={`evap-fin-${i}`} position={[xPos, 1.0, 0]}>
            <boxGeometry args={[0.015, 1.4, 0.6]} />
            <meshStandardMaterial
              color={finColor}
              metalness={0.85}
              roughness={0.35}
              transparent
              opacity={0.85}
            />
          </mesh>
        );
      })}

      {/* Evaporator Air Circulation Blower Shroud */}
      <group position={[0, 1.0, 0.45]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.62, 0.62, 0.12, 32, 1, true]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.4} />
        </mesh>
        {[-0.3, -0.1, 0.1, 0.3].map((yOffset) => (
          <mesh key={yOffset} position={[0, yOffset, 0]}>
            <boxGeometry args={[1.0, 0.02, 0.02]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.5} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Frost Shimmer Glow Halo */}
      <mesh ref={frostRef} position={[0, 1.0, 0]}>
        <boxGeometry args={[1.85, 1.65, 0.95]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={highlight ? 0.25 : 0.08} />
      </mesh>

      {/* Inlet Port (from Expansion Valve - Cyan) */}
      <mesh position={[0.85, 0.4, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#06b6d4" metalness={0.8} />
      </mesh>

      {/* Outlet Port (to Compressor - Blue) */}
      <mesh position={[-0.85, 1.6, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.8} />
      </mesh>

      {/* Shadow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 1.4]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};
