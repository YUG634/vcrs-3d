/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TextSprite } from './TextSprite';

interface CondenserModelProps {
  position: [number, number, number];
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
  tempC?: number;
  pressureKPa?: number;
}

export const CondenserModel: React.FC<CondenserModelProps> = ({
  position,
  isActive,
  isHovered,
  onClick,
  onPointerOver,
  onPointerOut,
  tempC,
  pressureKPa,
}) => {
  const fanRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (fanRef.current) {
      fanRef.current.rotation.z += delta * 6;
    }
  });

  const highlight = isActive || isHovered;
  const tubeColor = highlight ? '#f97316' : '#ea580c';
  const finColor = highlight ? '#fed7aa' : '#94a3b8';

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
        title="CONDENSER"
        subtitle={pressureKPa !== undefined ? `${pressureKPa} kPa • ${tempC}°C` : undefined}
        accentColor="#f97316"
        isActive={highlight}
        scale={[2.2, 0.75, 1]}
      />

      {/* Frame Stand / Chassis */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[1.8, 1.6, 0.9]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.7}
          metalness={0.6}
          wireframe={false}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Outer Casing Guard Frame */}
      {[-0.9, 0.9].map((x) => (
        <mesh key={`post-${x}`} position={[x, 1.0, 0]}>
          <boxGeometry args={[0.08, 1.6, 0.9]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Horizontal Serpentine Copper Tubes */}
      {tubeRows.map((y, index) => (
        <group key={`tube-row-${index}`}>
          <mesh position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 1.7, 16]} />
            <meshStandardMaterial
              color={tubeColor}
              metalness={0.9}
              roughness={0.25}
              emissive={highlight ? '#ea580c' : '#000000'}
              emissiveIntensity={highlight ? 0.3 : 0}
            />
          </mesh>
          {index < tubeRows.length - 1 && (
            <mesh
              position={[index % 2 === 0 ? 0.85 : -0.85, y + 0.2, 0]}
              rotation={[0, 0, index % 2 === 0 ? 0 : Math.PI]}
            >
              <torusGeometry args={[0.2, 0.07, 16, 16, Math.PI]} />
              <meshStandardMaterial color={tubeColor} metalness={0.9} roughness={0.25} />
            </mesh>
          )}
        </group>
      ))}

      {/* Vertical Aluminum Heat Dissipation Fins */}
      {Array.from({ length: finCount }).map((_, i) => {
        const xPos = -0.7 + i * finSpacing;
        return (
          <mesh key={`fin-${i}`} position={[xPos, 1.0, 0]}>
            <boxGeometry args={[0.015, 1.4, 0.6]} />
            <meshStandardMaterial
              color={finColor}
              metalness={0.85}
              roughness={0.3}
              transparent
              opacity={0.85}
            />
          </mesh>
        );
      })}

      {/* Condenser Cooling Fan Assembly */}
      <group position={[0, 1.0, -0.45]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 0.15, 32, 1, true]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.4} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.22, 24]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.3} />
        </mesh>
        <group ref={fanRef}>
          {[0, 1, 2, 3, 4].map((blade) => {
            const angle = (blade * 2 * Math.PI) / 5;
            return (
              <mesh
                key={blade}
                position={[Math.cos(angle) * 0.35, Math.sin(angle) * 0.35, 0]}
                rotation={[0, 0, angle + 0.3]}
              >
                <boxGeometry args={[0.16, 0.42, 0.02]} />
                <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.4} />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* Inlet Header (Top from Compressor - Red) */}
      <mesh position={[-0.85, 1.6, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ef4444" metalness={0.8} />
      </mesh>

      {/* Outlet Header (Bottom to Expansion Valve - Orange) */}
      <mesh position={[0.85, 0.4, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#f97316" metalness={0.8} />
      </mesh>

      {/* Contact Shadow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 1.4]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};
