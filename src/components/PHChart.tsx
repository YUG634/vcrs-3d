/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { CycleResults } from '../types';
import { SATURATION_TABLES } from '../data/thermoTables';

interface PHChartProps {
  cycle: CycleResults;
}

export const PHChart: React.FC<PHChartProps> = ({ cycle }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const table = SATURATION_TABLES[cycle.refrigerant.id];

    // Saturation dome points (liquid branch hf, then vapor branch hg in reverse)
    const domeH: number[] = [];
    const domeP: number[] = [];

    // Liquid curve
    for (let i = 0; i < table.length; i++) {
      domeH.push(table[i].hf);
      domeP.push(table[i].pSatKPa);
    }
    // Vapor curve in reverse order
    for (let i = table.length - 1; i >= 0; i--) {
      domeH.push(table[i].hg);
      domeP.push(table[i].pSatKPa);
    }

    // 1-2-3-4 Cycle loop (closed loop 1 -> 2 -> 3 -> 4 -> 1)
    const cycleH = [
      cycle.state1.enthalpy,
      cycle.state2.enthalpy,
      cycle.state3.enthalpy,
      cycle.state4.enthalpy,
      cycle.state1.enthalpy,
    ];
    const cycleP = [
      cycle.state1.pressureKPa,
      cycle.state2.pressureKPa,
      cycle.state3.pressureKPa,
      cycle.state4.pressureKPa,
      cycle.state1.pressureKPa,
    ];

    const data: Plotly.Data[] = [
      // Saturation Dome Curve
      {
        x: domeH,
        y: domeP,
        mode: 'lines',
        name: 'Saturation Dome',
        line: { color: '#64748b', width: 2, dash: 'solid' },
        hoverinfo: 'skip',
      },
      // Cycle Closed Path
      {
        x: cycleH,
        y: cycleP,
        mode: 'lines',
        name: 'VCRS Cycle',
        line: { color: '#38bdf8', width: 3 },
        hoverinfo: 'skip',
      },
      // Individual Colored Process Segments for clarity
      // Process 1-2: Compression (Red)
      {
        x: [cycle.state1.enthalpy, cycle.state2.enthalpy],
        y: [cycle.state1.pressureKPa, cycle.state2.pressureKPa],
        mode: 'lines',
        name: '1→2 Compression (w_c)',
        line: { color: '#ef4444', width: 3.5 },
        hoverinfo: 'skip',
      },
      // Process 2-3: Condensation (Orange)
      {
        x: [cycle.state2.enthalpy, cycle.state3.enthalpy],
        y: [cycle.state2.pressureKPa, cycle.state3.pressureKPa],
        mode: 'lines',
        name: '2→3 Condensation (q_out)',
        line: { color: '#f97316', width: 3.5 },
        hoverinfo: 'skip',
      },
      // Process 3-4: Expansion (Cyan)
      {
        x: [cycle.state3.enthalpy, cycle.state4.enthalpy],
        y: [cycle.state3.pressureKPa, cycle.state4.pressureKPa],
        mode: 'lines',
        name: '3→4 Expansion (Isenthalpic)',
        line: { color: '#06b6d4', width: 3.5 },
        hoverinfo: 'skip',
      },
      // Process 4-1: Evaporation (Blue)
      {
        x: [cycle.state4.enthalpy, cycle.state1.enthalpy],
        y: [cycle.state4.pressureKPa, cycle.state1.pressureKPa],
        mode: 'lines',
        name: '4→1 Evaporation (q_e)',
        line: { color: '#3b82f6', width: 3.5 },
        hoverinfo: 'skip',
      },
      // State Points Markers
      {
        x: [cycle.state1.enthalpy, cycle.state2.enthalpy, cycle.state3.enthalpy, cycle.state4.enthalpy],
        y: [cycle.state1.pressureKPa, cycle.state2.pressureKPa, cycle.state3.pressureKPa, cycle.state4.pressureKPa],
        mode: 'markers+text',
        name: 'State Points',
        text: ['State 1', 'State 2', 'State 3', 'State 4'],
        textposition: ['bottom right', 'top right', 'top left', 'bottom left'],
        textfont: {
          family: 'ui-sans-serif, system-ui, sans-serif',
          size: 11,
          color: '#f8fafc',
        },
        marker: {
          size: 10,
          color: ['#3b82f6', '#ef4444', '#f97316', '#06b6d4'],
          line: { color: '#ffffff', width: 1.5 },
        },
        hovertemplate: '<b>%{text}</b><br>Enthalpy: %{x:.1f} kJ/kg<br>Pressure: %{y:.1f} kPa<extra></extra>',
      },
    ];

    const layout: Partial<Plotly.Layout> = {
      title: {
        text: `<b>p-h Diagram: ${cycle.refrigerant.name}</b>`,
        font: { color: '#e2e8f0', size: 13 },
        x: 0.05,
        y: 0.95,
      },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(15, 23, 42, 0.65)',
      font: { color: '#94a3b8', size: 10 },
      margin: { l: 55, r: 25, t: 36, b: 42 },
      showlegend: false,
      xaxis: {
        title: { text: 'Enthalpy h (kJ/kg)', font: { size: 10, color: '#94a3b8' } },
        gridcolor: '#1e293b',
        zerolinecolor: '#334155',
        tickcolor: '#64748b',
        color: '#94a3b8',
        autorange: true,
      },
      yaxis: {
        title: { text: 'Pressure P (kPa)', font: { size: 10, color: '#94a3b8' } },
        type: 'log',
        gridcolor: '#1e293b',
        zerolinecolor: '#334155',
        tickcolor: '#64748b',
        color: '#94a3b8',
        autorange: true,
      },
      autosize: true,
    };

    const config: Partial<Plotly.Config> = {
      responsive: true,
      displayModeBar: false,
    };

    Plotly.react(chartRef.current, data, layout, config);

    const handleResize = () => {
      if (chartRef.current) {
        Plotly.Plots.resize(chartRef.current);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [cycle]);

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800 rounded-xl p-2.5 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between mb-1 px-1">
        <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
          <span>Thermodynamic p-h Chart</span>
          <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded">
            Live Mollier Diagram
          </span>
        </div>
        <div className="text-[10px] text-slate-400 font-mono">
          P_high: {cycle.pHighKPa} kPa • P_low: {cycle.pLowKPa} kPa
        </div>
      </div>
      <div ref={chartRef} className="w-full h-[240px] sm:h-[260px]" />
    </div>
  );
};
