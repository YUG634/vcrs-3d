/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ActiveComponent } from '../types';
import { Cpu, Wind, Disc, Snowflake, ArrowRight } from 'lucide-react';

interface ComponentInfoCardsProps {
  activeComponent: ActiveComponent;
  onSelectComponent: (comp: ActiveComponent) => void;
}

interface ComponentCardData {
  id: 'compressor' | 'condenser' | 'expansion_valve' | 'evaporator';
  name: string;
  thermoProcess: string;
  stateChange: string;
  explanation: string;
  colorBorder: string;
  colorBg: string;
  colorText: string;
  badgeBg: string;
  icon: React.ReactNode;
}

const CARDS: ComponentCardData[] = [
  {
    id: 'compressor',
    name: 'Compressor',
    thermoProcess: 'Isentropic Compression (s = const)',
    stateChange: 'State 1 → State 2',
    explanation: 'Squeezes the refrigerant vapor, raising its pressure and temperature.',
    colorBorder: 'border-red-500/60 hover:border-red-400',
    colorBg: 'bg-red-950/20 hover:bg-red-950/40',
    colorText: 'text-red-400',
    badgeBg: 'bg-red-950/80 border-red-500/50 text-red-300',
    icon: <Cpu className="w-4 h-4 text-red-400" />,
  },
  {
    id: 'condenser',
    name: 'Condenser',
    thermoProcess: 'Isobaric Heat Rejection (P = const)',
    stateChange: 'State 2 → State 3',
    explanation: 'Rejects heat to the surroundings — vapor turns into liquid.',
    colorBorder: 'border-amber-500/60 hover:border-amber-400',
    colorBg: 'bg-amber-950/20 hover:bg-amber-950/40',
    colorText: 'text-amber-400',
    badgeBg: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
    icon: <Wind className="w-4 h-4 text-amber-400" />,
  },
  {
    id: 'expansion_valve',
    name: 'Expansion Valve',
    thermoProcess: 'Isenthalpic Throttling (h = const)',
    stateChange: 'State 3 → State 4',
    explanation: 'Sudden pressure drop — liquid partially flashes into vapor, temperature drops.',
    colorBorder: 'border-cyan-500/60 hover:border-cyan-400',
    colorBg: 'bg-cyan-950/20 hover:bg-cyan-950/40',
    colorText: 'text-cyan-400',
    badgeBg: 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300',
    icon: <Disc className="w-4 h-4 text-cyan-400" />,
  },
  {
    id: 'evaporator',
    name: 'Evaporator',
    thermoProcess: 'Isobaric Heat Absorption (P = const)',
    stateChange: 'State 4 → State 1',
    explanation: 'Absorbs heat from the space being cooled — this is where cooling happens.',
    colorBorder: 'border-blue-500/60 hover:border-blue-400',
    colorBg: 'bg-blue-950/20 hover:bg-blue-950/40',
    colorText: 'text-blue-400',
    badgeBg: 'bg-blue-950/80 border-blue-500/50 text-blue-300',
    icon: <Snowflake className="w-4 h-4 text-blue-400" />,
  },
];

export const ComponentInfoCards: React.FC<ComponentInfoCardsProps> = ({
  activeComponent,
  onSelectComponent,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
          <span>What's happening? (4-Stage Cycle Breakdown)</span>
        </span>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Click any card to inspect in 3D
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CARDS.map((card) => {
          const isSelected = activeComponent === card.id;
          return (
            <div
              key={card.id}
              onClick={() => onSelectComponent(isSelected ? null : card.id)}
              className={`p-3.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer shadow-lg ${
                isSelected
                  ? `${card.colorBorder} ${card.colorBg} ring-2 ring-offset-2 ring-offset-slate-950 ring-cyan-500 scale-[1.02]`
                  : `border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90`
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                  {card.icon}
                  <span>{card.name}</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${card.badgeBg}`}>
                  {card.stateChange}
                </span>
              </div>

              <div className="text-[10px] text-slate-400 font-mono mb-2">
                {card.thermoProcess}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                "{card.explanation}"
              </p>

              {isSelected && (
                <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-cyan-300 font-medium">
                  <span>Selected in 3D Viewport</span>
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
