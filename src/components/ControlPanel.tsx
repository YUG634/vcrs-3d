/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RefrigerantId } from '../types';
import { REFRIGERANTS } from '../data/thermoTables';
import { Sliders, Sparkles, ThermometerSnowflake, Flame } from 'lucide-react';

interface ControlPanelProps {
  tEvapC: number;
  tCondC: number;
  refrigerantId: RefrigerantId;
  onTEvapChange: (val: number) => void;
  onTCondChange: (val: number) => void;
  onRefrigerantChange: (val: RefrigerantId) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  tEvapC,
  tCondC,
  refrigerantId,
  onTEvapChange,
  onTCondChange,
  onRefrigerantChange,
}) => {
  const selectedRef = REFRIGERANTS[refrigerantId];

  const presets = [
    { label: 'Household Fridge', evap: -15, cond: 35, ref: 'R134a' as RefrigerantId },
    { label: 'Home AC (Heat Pump)', evap: 5, cond: 45, ref: 'R410A' as RefrigerantId },
    { label: 'Commercial Cooler', evap: -5, cond: 40, ref: 'R22' as RefrigerantId },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-xl space-y-5">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-wide">Cycle Controls</h2>
        </div>
        <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded-full">
          Live Thermodynamics
        </span>
      </div>

      {/* Refrigerant Selector Dropdown */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>Working Refrigerant</span>
          <span className="text-[11px] text-slate-400 font-normal">{selectedRef.chemicalFormula}</span>
        </label>
        <select
          value={refrigerantId}
          onChange={(e) => onRefrigerantChange(e.target.value as RefrigerantId)}
          className="w-full bg-slate-950/90 border border-slate-700/80 hover:border-slate-600 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 cursor-pointer transition-colors shadow-inner font-medium"
        >
          <option value="R134a">R-134a (Tetrafluoroethane) — Standard Domestic Refrig</option>
          <option value="R22">R-22 (Chlorodifluoromethane) — Classical Textbook Baseline</option>
          <option value="R410A">R-410A (HFC Blend) — High-Pressure Residential AC</option>
        </select>
        <p className="text-[11px] text-slate-400 leading-relaxed pt-0.5">
          {selectedRef.description}
        </p>
      </div>

      {/* Sliders Container */}
      <div className="space-y-4 pt-1">
        {/* Evaporator Temperature Slider */}
        <div className="space-y-1.5 bg-slate-950/50 border border-slate-800/60 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <ThermometerSnowflake className="w-4 h-4 text-cyan-400" />
              Evaporator Temp (T_evap)
            </span>
            <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-2 py-0.5 rounded">
              {tEvapC > 0 ? `+${tEvapC}` : tEvapC} °C
            </span>
          </div>
          <input
            type="range"
            min={-30}
            max={10}
            step={1}
            value={tEvapC}
            onChange={(e) => onTEvapChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-30 °C (Deep Freezing)</span>
            <span>0 °C</span>
            <span>+10 °C (Chilled Water)</span>
          </div>
        </div>

        {/* Condenser Temperature Slider */}
        <div className="space-y-1.5 bg-slate-950/50 border border-slate-800/60 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              Condenser Temp (T_cond)
            </span>
            <span className="font-mono text-sm font-bold text-amber-400 bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded">
              +{tCondC} °C
            </span>
          </div>
          <input
            type="range"
            min={25}
            max={60}
            step={1}
            value={tCondC}
            onChange={(e) => onTCondChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>+25 °C (Cool Ambient)</span>
            <span>+40 °C (Typical Summer)</span>
            <span>+60 °C (Severe Ambient)</span>
          </div>
        </div>
      </div>

      {/* Pedagogical Quick Presets */}
      <div className="pt-2 border-t border-slate-800/60">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick Benchmark Scenarios:</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                onRefrigerantChange(p.ref);
                onTEvapChange(p.evap);
                onTCondChange(p.cond);
              }}
              className="text-left px-2.5 py-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 transition-all cursor-pointer shadow-sm hover:text-white"
            >
              <div className="font-medium truncate">{p.label}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {p.evap}°C / {p.cond}°C
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
