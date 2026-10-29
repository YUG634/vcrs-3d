/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ActiveComponent, CycleResults } from '../../types';
import { CompressorModel } from './CompressorModel';
import { CondenserModel } from './CondenserModel';
import { ExpansionValveModel } from './ExpansionValveModel';
import { EvaporatorModel } from './EvaporatorModel';
import { PipeLoop } from './PipeLoop';
import { RotateCcw, Eye, Play, Pause } from 'lucide-react';

interface VcrsCanvasProps {
  cycle: CycleResults;
  activeComponent: ActiveComponent;
  onSelectComponent: (comp: ActiveComponent) => void;
}

export const VcrsCanvas: React.FC<VcrsCanvasProps> = ({
  cycle,
  activeComponent,
  onSelectComponent,
}) => {
  const [hoveredComponent, setHoveredComponent] = useState<ActiveComponent>(null);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const controlsRef = useRef<any>(null);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const setViewPreset = (view: 'isometric' | 'top' | 'front') => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    if (view === 'isometric') {
      controls.object.position.set(9, 7, 9);
      controls.target.set(0, 1, 0);
    } else if (view === 'top') {
      controls.object.position.set(0, 14, 0.01);
      controls.target.set(0, 0, 0);
    } else if (view === 'front') {
      controls.object.position.set(0, 3, 11);
      controls.target.set(0, 1, 0);
    }
    controls.update();
  };

  return (
    <div className="relative w-full h-[520px] lg:h-[600px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [8, 6.5, 8.5], fov: 42 }}
        shadows
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#030712']} />
          <fog attach="fog" args={['#030712', 15, 30]} />

          {/* Lighting Rig */}
          <ambientLight intensity={0.45} />
          <hemisphereLight args={['#38bdf8', '#0f172a', 0.5]} />
          <directionalLight
            position={[8, 12, 6]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-8}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-bottom={-8}
            shadow-bias={-0.0002}
          />
          <directionalLight position={[-6, 4, -6]} intensity={0.4} color="#60a5fa" />
          <pointLight position={[0, 4, 0]} intensity={0.6} color="#38bdf8" distance={15} />

          {/* 3D Components */}
          <CompressorModel
            position={[-3.2, 0, -2.5]}
            isActive={activeComponent === 'compressor'}
            isHovered={hoveredComponent === 'compressor'}
            onClick={() => onSelectComponent(activeComponent === 'compressor' ? null : 'compressor')}
            onPointerOver={() => setHoveredComponent('compressor')}
            onPointerOut={() => setHoveredComponent(null)}
            isRunning={isRunning}
            tempC={cycle.state2.temperatureC}
            pressureKPa={cycle.state2.pressureKPa}
          />

          <CondenserModel
            position={[3.2, 0, -2.5]}
            isActive={activeComponent === 'condenser'}
            isHovered={hoveredComponent === 'condenser'}
            onClick={() => onSelectComponent(activeComponent === 'condenser' ? null : 'condenser')}
            onPointerOver={() => setHoveredComponent('condenser')}
            onPointerOut={() => setHoveredComponent(null)}
            tempC={cycle.state3.temperatureC}
            pressureKPa={cycle.state3.pressureKPa}
          />

          <ExpansionValveModel
            position={[3.2, 0, 2.5]}
            isActive={activeComponent === 'expansion_valve'}
            isHovered={hoveredComponent === 'expansion_valve'}
            onClick={() => onSelectComponent(activeComponent === 'expansion_valve' ? null : 'expansion_valve')}
            onPointerOver={() => setHoveredComponent('expansion_valve')}
            onPointerOut={() => setHoveredComponent(null)}
            pHighKPa={cycle.pHighKPa}
            pLowKPa={cycle.pLowKPa}
          />

          <EvaporatorModel
            position={[-3.2, 0, 2.5]}
            isActive={activeComponent === 'evaporator'}
            isHovered={hoveredComponent === 'evaporator'}
            onClick={() => onSelectComponent(activeComponent === 'evaporator' ? null : 'evaporator')}
            onPointerOver={() => setHoveredComponent('evaporator')}
            onPointerOut={() => setHoveredComponent(null)}
            tempC={cycle.state1.temperatureC}
            pressureKPa={cycle.state1.pressureKPa}
            qe={cycle.qe}
          />

          {/* Connecting Pipe Loop with Animated Flowing Dots */}
          <PipeLoop cycle={cycle} isRunning={isRunning} speedMultiplier={1} />

          {/* Soft Ground Contact Shadow */}
          <ContactShadows
            position={[0, 0.005, 0]}
            opacity={0.6}
            scale={16}
            blur={2.5}
            far={4}
            color="#000000"
          />

          {/* Minimal Pedagogical Ground Grid */}
          <gridHelper args={[16, 16, '#1e293b', '#0f172a']} position={[0, 0, 0]} />

          {/* Camera Controls */}
          <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping
            dampingFactor={0.06}
            minDistance={4}
            maxDistance={18}
            maxPolarAngle={Math.PI / 2 - 0.05} // prevent going below ground
          />
        </Suspense>
      </Canvas>

      {/* Overlaid Viewport HUD Controls */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 z-10 pointer-events-auto">
        <div className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-700/60 backdrop-blur-md text-slate-300 text-xs flex items-center gap-1.5 shadow-md">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive 3D Loop</span>
        </div>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-700/60 hover:border-slate-500 backdrop-blur-md text-slate-300 text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          title={isRunning ? 'Pause cycle flow' : 'Resume cycle flow'}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{isRunning ? 'Pause Flow' : 'Play Flow'}</span>
        </button>
      </div>

      {/* Camera View Angle Buttons & Reset */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 pointer-events-auto">
        <button
          onClick={() => setViewPreset('isometric')}
          className="px-2 py-1 text-xs rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/70 transition-colors cursor-pointer"
          title="Isometric View"
        >
          Iso
        </button>
        <button
          onClick={() => setViewPreset('top')}
          className="px-2 py-1 text-xs rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/70 transition-colors cursor-pointer"
          title="Top Plan View"
        >
          Top
        </button>
        <button
          onClick={() => setViewPreset('front')}
          className="px-2 py-1 text-xs rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/70 transition-colors cursor-pointer"
          title="Front Elevation View"
        >
          Front
        </button>
        <button
          onClick={resetCamera}
          className="p-1 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/70 transition-colors cursor-pointer"
          title="Reset Camera"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Legend Ribbon at Bottom of Viewport */}
      <div className="absolute bottom-3 inset-x-3 pointer-events-none flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-[11px] text-slate-400 z-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-medium text-slate-300">Phase Flow:</span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span>Cold Vapor (1)</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span>Hot Superheated Gas (2)</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            <span>Warm Liquid (3)</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span>Liquid-Vapor Mix (4)</span>
          </span>
        </div>
        <div className="hidden sm:block text-slate-500 text-[10px]">
          Left drag: rotate • Scroll: zoom • Right drag: pan • Click parts to inspect
        </div>
      </div>
    </div>
  );
};
