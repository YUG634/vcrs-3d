/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowDown, Snowflake, Gauge, Layers } from 'lucide-react';

interface HeroLandingProps {
  onStartExploring: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({ onStartExploring }) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-8 sm:py-14 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
      {/* Subtle radial glow background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Course badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-medium mb-4 shadow-sm backdrop-blur-md">
          <Snowflake className="w-3.5 h-3.5" />
          <span>Mechanical Engineering Thermodynamics • Applied Thermal Systems</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-3">
          VCRS Visualizer
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 mb-4">
          See how a refrigerator works — in 3D.
        </p>

        {/* Short 2-line plain-English explanation for a beginner */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
          The Vapor Compression Refrigeration Cycle (VCRS) moves heat from a cold indoor space to a warmer outdoor environment by continuously compressing, condensing, expanding, and evaporating a circulating chemical fluid.
        </p>

        {/* CTA & Feature Pills */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStartExploring}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Start Exploring Cycle</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400 px-3 py-2 rounded-xl bg-slate-900/50 border border-slate-800">
            <span className="flex items-center gap-1 text-slate-300">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interactive 3D Loop</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              <span>Live p-h Chart</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
