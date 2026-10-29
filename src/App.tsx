/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { ActiveComponent, RefrigerantId } from './types';
import { calculateVCRSCycle } from './data/thermoTables';
import { HeroLanding } from './components/HeroLanding';
import { VcrsCanvas } from './components/3d/VcrsCanvas';
import { ControlPanel } from './components/ControlPanel';
import { OutputsPanel } from './components/OutputsPanel';
import { ComponentInfoCards } from './components/ComponentInfoCards';
import { ValidationTable } from './components/ValidationTable';
import { Snowflake, HelpCircle, X } from 'lucide-react';

export default function App() {
  // Primary thermodynamics cycle inputs
  const [refrigerantId, setRefrigerantId] = useState<RefrigerantId>('R134a');
  const [tEvapC, setTEvapC] = useState<number>(-10);
  const [tCondC, setTCondC] = useState<number>(40);

  // Cross-component active inspection selection
  const [activeComponent, setActiveComponent] = useState<ActiveComponent>(null);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  // Simulator section ref for smooth scroll
  const simulatorRef = useRef<HTMLDivElement>(null);

  // Compute thermodynamic cycle live
  const cycle = useMemo(() => {
    return calculateVCRSCycle(refrigerantId, tEvapC, tCondC);
  }, [refrigerantId, tEvapC, tCondC]);

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleApplyWorkedExample = (ref: RefrigerantId, evap: number, cond: number) => {
    setRefrigerantId(ref);
    setTEvapC(evap);
    setTCondC(cond);
    simulatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Snowflake className="w-4 h-4 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight">VCRS Visualizer</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] text-cyan-400 font-mono uppercase tracking-wider bg-cyan-950/80 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                Thermodynamics 3D
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowGuideModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Quick Guide</span>
            </button>
          </div>
        </div>
      </header>

      {/* 1. Landing Hero Section */}
      <HeroLanding onStartExploring={scrollToSimulator} />

      {/* Main Content Area */}
      <main ref={simulatorRef} id="simulator" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Core Simulator Grid: 3D Scene + Controls & Outputs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 3D Viewport & Component Info Cards (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-5">
            {/* 2. 3D VCRS Scene */}
            <VcrsCanvas
              cycle={cycle}
              activeComponent={activeComponent}
              onSelectComponent={setActiveComponent}
            />

            {/* 5. "What's happening?" Component Info Cards */}
            <ComponentInfoCards
              activeComponent={activeComponent}
              onSelectComponent={setActiveComponent}
            />
          </div>

          {/* Right Column: Controls, Metrics, and Live p-h Chart (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-5">
            {/* 3. Control Panel */}
            <ControlPanel
              tEvapC={tEvapC}
              tCondC={tCondC}
              refrigerantId={refrigerantId}
              onTEvapChange={setTEvapC}
              onTCondChange={setTCondC}
              onRefrigerantChange={setRefrigerantId}
            />

            {/* 4. Outputs Panel (Metrics, Carnot Badge, Live Plotly p-h Chart, Table) */}
            <OutputsPanel cycle={cycle} />
          </div>
        </div>

        {/* 6. Validation Section: Worked Examples from Standard Literature */}
        <ValidationTable
          currentRefrigerant={refrigerantId}
          currentTEvap={tEvapC}
          currentTCond={tCondC}
          onApplyExample={handleApplyWorkedExample}
        />
      </main>

      {/* Educational Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Snowflake className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white">How to Use VCRS Visualizer</h3>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">1. Manipulate Temperatures:</strong> Move the Evaporator temperature slider (T_evap) to see how deep chilling impacts pressure, work input, and COP. Move the Condenser temperature slider (T_cond) to see the effect of ambient cooling temperatures.
              </p>
              <p>
                <strong className="text-white">2. Observe 3D Flow:</strong> The 3D scene visually routes refrigerant through the four primary components. Notice how the glowing dots change color as the refrigerant changes phase and pressure.
              </p>
              <p>
                <strong className="text-white">3. Examine the p-h Diagram:</strong> The live Mollier chart illustrates the saturation dome and the four key processes:
                <br />• 1→2: Isentropic Compression (slanted up to high pressure)
                <br />• 2→3: Isobaric Heat Rejection (horizontal high-pressure line)
                <br />• 3→4: Isenthalpic Throttling (vertical constant-enthalpy drop)
                <br />• 4→1: Isobaric Heat Absorption (horizontal low-pressure line)
              </p>
              <p>
                <strong className="text-white">4. Verify Calculations:</strong> Scroll to the bottom to verify the app's output against standard textbook benchmark problems from Çengel & Boles and Moran & Shapiro.
              </p>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Got it, let's explore!
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>VCRS Visualizer • Mechanical Engineering Thermodynamics Educational Module</div>
          <div>Property values are simplified pedagogical approximations for teaching purposes.</div>
        </div>
      </footer>
    </div>
  );
}
