/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { CycleResults } from '../types';
import { PHChart } from './PHChart';
import { Activity, Gauge, Zap, Award, Snowflake } from 'lucide-react';

interface OutputsPanelProps {
  cycle: CycleResults;
}

export const OutputsPanel: React.FC<OutputsPanelProps> = ({ cycle }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white tracking-wide">Performance Outputs</h2>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Compression Ratio: <span className="text-white font-bold">{cycle.pressureRatio}:1</span>
        </div>
      </div>

      {/* 4 Main Numerical Metric Cards with Smooth Framer Motion transitions */}
      <div className="grid grid-cols-2 gap-3">
        {/* Refrigerating Effect q_e */}
        <motion.div
          key={`qe-${cycle.qe}`}
          initial={{ scale: 0.96, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-950/60 border border-cyan-900/40 hover:border-cyan-700/60 rounded-xl p-3 shadow-md"
        >
          <div className="text-[11px] text-cyan-300 font-semibold flex items-center gap-1.5 mb-1">
            <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
            Refrigerating Effect (q_e)
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">
            {cycle.qe} <span className="text-xs text-slate-400 font-normal">kJ/kg</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            h₁ − h₄ = {cycle.state1.enthalpy} − {cycle.state4.enthalpy}
          </div>
        </motion.div>

        {/* Compressor Work w_c */}
        <motion.div
          key={`wc-${cycle.wc}`}
          initial={{ scale: 0.96, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-950/60 border border-red-900/40 hover:border-red-700/60 rounded-xl p-3 shadow-md"
        >
          <div className="text-[11px] text-red-300 font-semibold flex items-center gap-1.5 mb-1">
            <Zap className="w-3.5 h-3.5 text-red-400" />
            Compressor Work (w_c)
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-red-400">
            {cycle.wc} <span className="text-xs text-slate-400 font-normal">kJ/kg</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            h₂ − h₁ = {cycle.state2.enthalpy} − {cycle.state1.enthalpy}
          </div>
        </motion.div>

        {/* Actual COP */}
        <motion.div
          key={`cop-${cycle.cop}`}
          initial={{ scale: 0.96, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-950/60 border border-emerald-900/40 hover:border-emerald-700/60 rounded-xl p-3 shadow-md"
        >
          <div className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5 mb-1">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            COP (Actual)
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
            {cycle.cop}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            q_e / w_c ({cycle.qe} / {cycle.wc})
          </div>
        </motion.div>

        {/* Carnot COP */}
        <motion.div
          key={`carnot-${cycle.copCarnot}`}
          initial={{ scale: 0.96, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-950/60 border border-purple-900/40 hover:border-purple-700/60 rounded-xl p-3 shadow-md"
        >
          <div className="text-[11px] text-purple-300 font-semibold flex items-center gap-1.5 mb-1">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            COP (Carnot Limit)
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-400">
            {cycle.copCarnot}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            T_evap,K / (T_cond − T_evap)
          </div>
        </motion.div>
      </div>

      {/* Second Law Carnot Comparison Badge as requested in prompt */}
      <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-950/50 via-teal-950/40 to-slate-950/50 border border-emerald-500/30 text-emerald-200 text-xs shadow-inner">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="font-semibold">
            You are at <span className="font-mono text-sm text-emerald-300 font-bold">{cycle.carnotPercentage}%</span> of the ideal Carnot COP
          </span>
        </div>
        <span className="text-[10px] text-emerald-400 font-mono hidden sm:inline">
          (Second-Law Efficiency η_II)
        </span>
      </div>

      {/* Live Thermodynamic p-h Chart */}
      <PHChart cycle={cycle} />

      {/* State Point Summary Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px]">
              <th className="py-1.5 px-2">State</th>
              <th className="py-1.5 px-2">P (kPa)</th>
              <th className="py-1.5 px-2">T (°C)</th>
              <th className="py-1.5 px-2">h (kJ/kg)</th>
              <th className="py-1.5 px-2">Phase</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            <tr>
              <td className="py-1.5 px-2 font-bold text-blue-400">1: Evap Out</td>
              <td className="py-1.5 px-2 text-slate-300">{cycle.state1.pressureKPa}</td>
              <td className="py-1.5 px-2 text-slate-300">{cycle.state1.temperatureC}</td>
              <td className="py-1.5 px-2 text-slate-300">{cycle.state1.enthalpy}</td>
              <td className="py-1.5 px-2 text-slate-400 text-[10px]">Sat. Vapor</td>
            </tr>
            <tr>
              <td className="py-1.5 px-2 font-bold text-red-400">2: Comp Out</td>
              <td className="py-1.5 px-2 text-slate-300">{cycle.state2.pressureKPa}</td>
              <td className="py-1.5 px-2 text-slate-300">{cycle.state2.temperatureC}</td>
              <td className="py-1.5 px-2 text-slate-300">{cycle.state2.enthalpy}</td>
              <td className="py-1.5 px-2 text-slate-400 text-[10px]">Superheated</td>
            </tr>
            <tr>
              <td className="py-1.5 px-2 font-bold text-orange-400">3: Cond Out</td>
              <td className="py-1.5 px-2 text-slate-300">{cycle.state3.pressureKPa}</td>
              <td className="py-1.5 px-2 text-slate-300">{cycle.state3.temperatureC}</td>
              <td className="py-1.5 px-2 text-slate-300">{cycle.state3.enthalpy}</td>
              <td className="py-1.5 px-2 text-slate-400 text-[10px]">Sat. Liquid</td>
            </tr>
            <tr>
              <td className="py-1.5 px-2 font-bold text-cyan-400">4: Valve Out</td>
              <td className="py-1.5 px-2 text-slate-300">{cycle.state4.pressureKPa}</td>
              <td className="py-1.5 px-2 text-slate-300">{cycle.state4.temperatureC}</td>
              <td className="py-1.5 px-2 text-slate-300">{cycle.state4.enthalpy}</td>
              <td className="py-1.5 px-2 text-slate-400 text-[10px]">2-Phase Mix</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
