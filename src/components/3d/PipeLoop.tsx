/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CycleResults } from '../../types';
import { TextSprite } from './TextSprite';

interface PipeLoopProps {
  cycle: CycleResults;
  isRunning?: boolean;
  speedMultiplier?: number;
}

const DOTS_PER_SEGMENT = 12;

export const PipeLoop: React.FC<PipeLoopProps> = ({
  cycle,
  isRunning = true,
  speedMultiplier = 1,
}) => {
  // Pre-define 4 Catmull-Rom curves connecting components in thermodynamic direction
  const curves = useMemo(() => {
    // 1. Evaporator → Compressor (Blue: cold low-pressure vapor)
    const curve1 = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-3.2, 1.4, 1.7),
        new THREE.Vector3(-4.1, 1.4, 1.2),
        new THREE.Vector3(-4.1, 1.2, -1.2),
        new THREE.Vector3(-3.4, 1.2, -2.0),
      ],
      false,
      'centripetal',
      0.3
    );

    // 2. Compressor → Condenser (Red: hot high-pressure vapor)
    const curve2 = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-2.4, 1.4, -2.5),
        new THREE.Vector3(-1.8, 1.8, -2.5),
        new THREE.Vector3(1.6, 1.8, -2.5),
        new THREE.Vector3(2.35, 1.6, -2.5),
      ],
      false,
      'centripetal',
      0.3
    );

    // 3. Condenser → Expansion Valve (Orange: warm high-pressure liquid)
    const curve3 = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(3.2, 0.4, -1.7),
        new THREE.Vector3(4.1, 0.4, -1.0),
        new THREE.Vector3(4.1, 0.6, 1.4),
        new THREE.Vector3(3.3, 0.6, 2.1),
      ],
      false,
      'centripetal',
      0.3
    );

    // 4. Expansion Valve → Evaporator (Cyan: cold low-pressure mix)
    const curve4 = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(2.8, 0.6, 2.5),
        new THREE.Vector3(1.8, 0.38, 2.5),
        new THREE.Vector3(-1.4, 0.38, 2.5),
        new THREE.Vector3(-2.35, 0.4, 2.5),
      ],
      false,
      'centripetal',
      0.3
    );

    return { curve1, curve2, curve3, curve4 };
  }, []);

  // Pre-generate static tube geometries for pipes
  const tubeGeometries = useMemo(() => {
    return {
      tube1: new THREE.TubeGeometry(curves.curve1, 48, 0.055, 12, false),
      tube2: new THREE.TubeGeometry(curves.curve2, 48, 0.055, 12, false),
      tube3: new THREE.TubeGeometry(curves.curve3, 48, 0.055, 12, false),
      tube4: new THREE.TubeGeometry(curves.curve4, 48, 0.055, 12, false),
    };
  }, [curves]);

  // Dot mesh references for moving along each curve
  const dots1 = useRef<THREE.Group>(null);
  const dots2 = useRef<THREE.Group>(null);
  const dots3 = useRef<THREE.Group>(null);
  const dots4 = useRef<THREE.Group>(null);

  // Animation frame loop for flowing particles
  useFrame((state) => {
    if (!isRunning) return;
    const time = state.clock.getElapsedTime() * 0.35 * speedMultiplier;

    const updateDots = (group: THREE.Group | null, curve: THREE.CatmullRomCurve3) => {
      if (!group) return;
      group.children.forEach((child, i) => {
        const offset = i / DOTS_PER_SEGMENT;
        const t = (time + offset) % 1;
        const pt = curve.getPointAt(t);
        child.position.copy(pt);
      });
    };

    updateDots(dots1.current, curves.curve1);
    updateDots(dots2.current, curves.curve2);
    updateDots(dots3.current, curves.curve3);
    updateDots(dots4.current, curves.curve4);
  });

  return (
    <group>
      {/* 1. Evaporator → Compressor Pipe (Blue - Low P vapor) */}
      <mesh geometry={tubeGeometries.tube1}>
        <meshPhysicalMaterial
          color="#1e3a8a"
          roughness={0.2}
          metalness={0.7}
          transparent
          opacity={0.65}
          transmission={0.4}
        />
      </mesh>
      {/* Flowing Glowing Dots: Blue */}
      <group ref={dots1}>
        {Array.from({ length: DOTS_PER_SEGMENT }).map((_, i) => (
          <mesh key={`dot1-${i}`}>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#60a5fa"
              emissiveIntensity={1.8}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* State 1 Billboard Label (Native WebGL) */}
      <TextSprite
        position={[-4.5, 1.4, 0]}
        title="State 1: Sat Vapor"
        subtitle={`${cycle.state1.temperatureC}°C • ${cycle.state1.pressureKPa} kPa`}
        accentColor="#3b82f6"
        scale={[2.2, 0.75, 1]}
      />

      {/* 2. Compressor → Condenser Pipe (Red - Hot High P vapor) */}
      <mesh geometry={tubeGeometries.tube2}>
        <meshPhysicalMaterial
          color="#991b1b"
          roughness={0.2}
          metalness={0.7}
          transparent
          opacity={0.65}
          transmission={0.4}
        />
      </mesh>
      {/* Flowing Glowing Dots: Red */}
      <group ref={dots2}>
        {Array.from({ length: DOTS_PER_SEGMENT }).map((_, i) => (
          <mesh key={`dot2-${i}`}>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#f87171"
              emissiveIntensity={1.8}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* State 2 Billboard Label (Native WebGL) */}
      <TextSprite
        position={[0, 2.3, -2.5]}
        title="State 2: Superheat"
        subtitle={`${cycle.state2.temperatureC}°C • ${cycle.state2.pressureKPa} kPa`}
        accentColor="#ef4444"
        scale={[2.2, 0.75, 1]}
      />

      {/* 3. Condenser → Expansion Valve Pipe (Orange - High P warm liquid) */}
      <mesh geometry={tubeGeometries.tube3}>
        <meshPhysicalMaterial
          color="#c2410c"
          roughness={0.2}
          metalness={0.7}
          transparent
          opacity={0.65}
          transmission={0.4}
        />
      </mesh>
      {/* Flowing Glowing Dots: Orange */}
      <group ref={dots3}>
        {Array.from({ length: DOTS_PER_SEGMENT }).map((_, i) => (
          <mesh key={`dot3-${i}`}>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#fb923c"
              emissiveIntensity={1.8}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* State 3 Billboard Label (Native WebGL) */}
      <TextSprite
        position={[4.5, 0.6, 0.2]}
        title="State 3: Sat Liquid"
        subtitle={`${cycle.state3.temperatureC}°C • ${cycle.state3.pressureKPa} kPa`}
        accentColor="#f97316"
        scale={[2.2, 0.75, 1]}
      />

      {/* 4. Expansion Valve → Evaporator Pipe (Cyan - Cold mixture) */}
      <mesh geometry={tubeGeometries.tube4}>
        <meshPhysicalMaterial
          color="#0e7490"
          roughness={0.2}
          metalness={0.7}
          transparent
          opacity={0.65}
          transmission={0.4}
        />
      </mesh>
      {/* Flowing Glowing Dots: Cyan */}
      <group ref={dots4}>
        {Array.from({ length: DOTS_PER_SEGMENT }).map((_, i) => (
          <mesh key={`dot4-${i}`}>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#22d3ee"
              emissiveIntensity={1.8}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* State 4 Billboard Label (Native WebGL) */}
      <TextSprite
        position={[0, 0.85, 2.5]}
        title="State 4: Flash Mix"
        subtitle={`${cycle.state4.temperatureC}°C • ${cycle.state4.pressureKPa} kPa`}
        accentColor="#06b6d4"
        scale={[2.2, 0.75, 1]}
      />
    </group>
  );
};
