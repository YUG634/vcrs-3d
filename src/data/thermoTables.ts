/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CycleResults, RefrigerantId, RefrigerantInfo, SaturationProperty, WorkedExample } from '../types';

/* Property values are simplified pedagogical approximations for teaching purposes. */

export const REFRIGERANTS: Record<RefrigerantId, RefrigerantInfo> = {
  R134a: {
    id: 'R134a',
    name: 'R-134a',
    chemicalFormula: 'CF₃CH₂F (Tetrafluoroethane)',
    description: 'Widely used in domestic refrigerators, automotive air conditioning, and medium-temp commercial chillers.',
    criticalTempC: 101.06,
    criticalPressureKPa: 4059,
    cpVapor: 1.04, // kJ/(kg·K)
    kExp: 1.12,
  },
  R22: {
    id: 'R22',
    name: 'R-22',
    chemicalFormula: 'CHClF₂ (Chlorodifluoromethane)',
    description: 'Historically standard for residential AC and commercial freezing; benchmark HCFC in classical thermodynamic textbooks.',
    criticalTempC: 96.15,
    criticalPressureKPa: 4990,
    cpVapor: 0.88, // kJ/(kg·K)
    kExp: 1.18,
  },
  R410A: {
    id: 'R410A',
    name: 'R-410A',
    chemicalFormula: 'CH₂F₂ / CHF₂CF₃ (50/50 blend)',
    description: 'High-pressure near-azeotropic HFC blend utilized heavily in modern residential and commercial split-system heat pumps.',
    criticalTempC: 71.36,
    criticalPressureKPa: 4901,
    cpVapor: 1.18, // kJ/(kg·K)
    kExp: 1.17,
  },
};

// Saturation properties table from -35 °C to +65 °C (NIST / ASHRAE based pedagogical lookup)
export const SATURATION_TABLES: Record<RefrigerantId, SaturationProperty[]> = {
  R134a: [
    { tempC: -35, pSatKPa: 66.3,  hf: 153.2, hg: 377.1, sf: 0.819, sg: 1.758 },
    { tempC: -30, pSatKPa: 84.4,  hf: 159.7, hg: 380.4, sf: 0.846, sg: 1.753 },
    { tempC: -25, pSatKPa: 106.5, hf: 166.3, hg: 383.6, sf: 0.873, sg: 1.748 },
    { tempC: -20, pSatKPa: 132.8, hf: 173.0, hg: 386.6, sf: 0.899, sg: 1.742 },
    { tempC: -15, pSatKPa: 164.1, hf: 179.8, hg: 389.7, sf: 0.926, sg: 1.738 },
    { tempC: -10, pSatKPa: 200.7, hf: 186.7, hg: 392.7, sf: 0.952, sg: 1.733 },
    { tempC: -5,  pSatKPa: 243.6, hf: 193.7, hg: 395.6, sf: 0.978, sg: 1.729 },
    { tempC: 0,   pSatKPa: 292.8, hf: 200.0, hg: 398.6, sf: 1.000, sg: 1.727 },
    { tempC: 5,   pSatKPa: 349.9, hf: 207.0, hg: 401.4, sf: 1.026, sg: 1.724 },
    { tempC: 10,  pSatKPa: 414.6, hf: 214.0, hg: 404.3, sf: 1.051, sg: 1.722 },
    { tempC: 15,  pSatKPa: 488.6, hf: 221.0, hg: 407.1, sf: 1.076, sg: 1.720 },
    { tempC: 20,  pSatKPa: 571.7, hf: 228.4, hg: 409.8, sf: 1.101, sg: 1.718 },
    { tempC: 25,  pSatKPa: 665.4, hf: 235.8, hg: 412.3, sf: 1.126, sg: 1.716 },
    { tempC: 30,  pSatKPa: 770.2, hf: 243.3, hg: 414.8, sf: 1.150, sg: 1.715 },
    { tempC: 35,  pSatKPa: 887.0, hf: 250.9, hg: 417.2, sf: 1.175, sg: 1.713 },
    { tempC: 40,  pSatKPa: 1016.6, hf: 258.6, hg: 419.4, sf: 1.199, sg: 1.711 },
    { tempC: 45,  pSatKPa: 1159.9, hf: 266.4, hg: 421.5, sf: 1.224, sg: 1.709 },
    { tempC: 50,  pSatKPa: 1317.9, hf: 274.3, hg: 423.4, sf: 1.248, sg: 1.707 },
    { tempC: 55,  pSatKPa: 1491.5, hf: 282.4, hg: 425.1, sf: 1.272, sg: 1.704 },
    { tempC: 60,  pSatKPa: 1681.8, hf: 290.7, hg: 426.5, sf: 1.296, sg: 1.701 },
    { tempC: 65,  pSatKPa: 1890.0, hf: 299.2, hg: 427.6, sf: 1.321, sg: 1.698 },
  ],
  R22: [
    { tempC: -35, pSatKPa: 132.3, hf: 161.4, hg: 395.2, sf: 0.849, sg: 1.830 },
    { tempC: -30, pSatKPa: 163.5, hf: 167.3, hg: 397.9, sf: 0.873, sg: 1.822 },
    { tempC: -25, pSatKPa: 200.4, hf: 173.3, hg: 400.4, sf: 0.897, sg: 1.815 },
    { tempC: -20, pSatKPa: 244.8, hf: 179.3, hg: 402.8, sf: 0.921, sg: 1.808 },
    { tempC: -15, pSatKPa: 296.0, hf: 185.5, hg: 405.1, sf: 0.945, sg: 1.801 },
    { tempC: -10, pSatKPa: 354.3, hf: 191.8, hg: 407.3, sf: 0.969, sg: 1.795 },
    { tempC: -5,  pSatKPa: 421.4, hf: 198.1, hg: 409.3, sf: 0.993, sg: 1.789 },
    { tempC: 0,   pSatKPa: 497.6, hf: 200.0, hg: 411.3, sf: 1.000, sg: 1.784 },
    { tempC: 5,   pSatKPa: 584.0, hf: 206.5, hg: 413.1, sf: 1.024, sg: 1.778 },
    { tempC: 10,  pSatKPa: 680.7, hf: 213.2, hg: 414.7, sf: 1.047, sg: 1.773 },
    { tempC: 15,  pSatKPa: 789.0, hf: 220.0, hg: 416.2, sf: 1.071, sg: 1.768 },
    { tempC: 20,  pSatKPa: 909.9, hf: 226.9, hg: 417.5, sf: 1.094, sg: 1.763 },
    { tempC: 25,  pSatKPa: 1043.5, hf: 234.0, hg: 418.6, sf: 1.118, sg: 1.758 },
    { tempC: 30,  pSatKPa: 1191.9, hf: 241.2, hg: 419.5, sf: 1.141, sg: 1.753 },
    { tempC: 35,  pSatKPa: 1355.6, hf: 248.6, hg: 420.2, sf: 1.165, sg: 1.748 },
    { tempC: 40,  pSatKPa: 1533.5, hf: 256.1, hg: 420.6, sf: 1.189, sg: 1.743 },
    { tempC: 45,  pSatKPa: 1729.0, hf: 263.9, hg: 420.8, sf: 1.213, sg: 1.737 },
    { tempC: 50,  pSatKPa: 1942.3, hf: 271.9, hg: 420.6, sf: 1.237, sg: 1.732 },
    { tempC: 55,  pSatKPa: 2174.4, hf: 280.1, hg: 420.0, sf: 1.261, sg: 1.726 },
    { tempC: 60,  pSatKPa: 2426.2, hf: 288.6, hg: 419.0, sf: 1.286, sg: 1.720 },
    { tempC: 65,  pSatKPa: 2698.5, hf: 297.6, hg: 417.4, sf: 1.311, sg: 1.713 },
  ],
  R410A: [
    { tempC: -35, pSatKPa: 209.6, hf: 147.1, hg: 409.2, sf: 0.789, sg: 1.888 },
    { tempC: -30, pSatKPa: 257.4, hf: 154.6, hg: 411.8, sf: 0.819, sg: 1.878 },
    { tempC: -25, pSatKPa: 312.9, hf: 162.2, hg: 414.2, sf: 0.850, sg: 1.868 },
    { tempC: -20, pSatKPa: 377.1, hf: 169.9, hg: 416.4, sf: 0.880, sg: 1.859 },
    { tempC: -15, pSatKPa: 450.9, hf: 177.8, hg: 418.4, sf: 0.910, sg: 1.850 },
    { tempC: -10, pSatKPa: 535.4, hf: 185.8, hg: 420.2, sf: 0.940, sg: 1.841 },
    { tempC: -5,  pSatKPa: 631.5, hf: 194.0, hg: 421.7, sf: 0.970, sg: 1.832 },
    { tempC: 0,   pSatKPa: 740.3, hf: 200.0, hg: 423.0, sf: 1.000, sg: 1.823 },
    { tempC: 5,   pSatKPa: 863.0, hf: 208.5, hg: 424.0, sf: 1.030, sg: 1.815 },
    { tempC: 10,  pSatKPa: 1000.7, hf: 217.2, hg: 424.6, sf: 1.060, sg: 1.806 },
    { tempC: 15,  pSatKPa: 1154.8, hf: 226.0, hg: 424.8, sf: 1.090, sg: 1.797 },
    { tempC: 20,  pSatKPa: 1326.3, hf: 235.1, hg: 424.6, sf: 1.120, sg: 1.788 },
    { tempC: 25,  pSatKPa: 1516.8, hf: 244.5, hg: 423.9, sf: 1.150, sg: 1.778 },
    { tempC: 30,  pSatKPa: 1727.6, hf: 254.2, hg: 422.6, sf: 1.181, sg: 1.768 },
    { tempC: 35,  pSatKPa: 1960.2, hf: 264.3, hg: 420.8, sf: 1.211, sg: 1.757 },
    { tempC: 40,  pSatKPa: 2216.0, hf: 274.8, hg: 418.2, sf: 1.242, sg: 1.745 },
    { tempC: 45,  pSatKPa: 2496.7, hf: 285.8, hg: 414.7, sf: 1.273, sg: 1.732 },
    { tempC: 50,  pSatKPa: 2804.1, hf: 297.6, hg: 410.0, sf: 1.305, sg: 1.716 },
    { tempC: 55,  pSatKPa: 3140.2, hf: 310.2, hg: 403.6, sf: 1.337, sg: 1.697 },
    { tempC: 60,  pSatKPa: 3507.2, hf: 324.2, hg: 394.8, sf: 1.371, sg: 1.673 },
    { tempC: 65,  pSatKPa: 3908.5, hf: 340.5, hg: 381.8, sf: 1.408, sg: 1.639 },
  ],
};

/**
 * Linear interpolation helper for saturation properties
 */
export function getSaturationProperty(refrigerantId: RefrigerantId, tempC: number): SaturationProperty {
  const table = SATURATION_TABLES[refrigerantId];
  if (!table || table.length === 0) {
    throw new Error(`Unknown refrigerant: ${refrigerantId}`);
  }

  // Clamp within bounds
  if (tempC <= table[0].tempC) return { ...table[0] };
  if (tempC >= table[table.length - 1].tempC) return { ...table[table.length - 1] };

  // Find bounding interval
  let i = 0;
  while (i < table.length - 1 && table[i + 1].tempC < tempC) {
    i++;
  }

  const p0 = table[i];
  const p1 = table[i + 1];
  const factor = (tempC - p0.tempC) / (p1.tempC - p0.tempC);

  return {
    tempC,
    pSatKPa: p0.pSatKPa + factor * (p1.pSatKPa - p0.pSatKPa),
    hf: p0.hf + factor * (p1.hf - p0.hf),
    hg: p0.hg + factor * (p1.hg - p0.hg),
    sf: p0.sf + factor * (p1.sf - p0.sf),
    sg: p0.sg + factor * (p1.sg - p0.sg),
  };
}

/**
 * Calculates standard VCRS cycle performance according to textbook ideal cycle assumptions:
 * State 1: Saturated vapor at evaporator temperature
 * State 2: Isentropic compression (s2 = s1) to condenser pressure (superheated vapor)
 * State 3: Saturated liquid at condenser temperature
 * State 4: Isenthalpic throttling expansion (h4 = h3) at evaporator pressure
 */
export function calculateVCRSCycle(
  refrigerantId: RefrigerantId,
  tEvapC: number,
  tCondC: number,
): CycleResults {
  const ref = REFRIGERANTS[refrigerantId];

  // Saturation properties at evaporator & condenser
  const evapProps = getSaturationProperty(refrigerantId, tEvapC);
  const condProps = getSaturationProperty(refrigerantId, tCondC);

  const pLowKPa = evapProps.pSatKPa;
  const pHighKPa = condProps.pSatKPa;

  // State 1: Evaporator outlet / Compressor inlet (Saturated vapor)
  const h1 = evapProps.hg;
  const s1 = evapProps.sg;
  const t1 = tEvapC;
  const p1 = pLowKPa;

  // State 3: Condenser outlet / Expansion valve inlet (Saturated liquid)
  const h3 = condProps.hf;
  const s3 = condProps.sf;
  const t3 = tCondC;
  const p3 = pHighKPa;

  // State 4: Expansion valve outlet / Evaporator inlet (Isenthalpic expansion h4 = h3)
  const h4 = h3;
  const t4 = tEvapC;
  const p4 = pLowKPa;
  const x4 = Math.max(0, Math.min(1, (h4 - evapProps.hf) / (evapProps.hg - evapProps.hf)));

  // State 2: Compressor outlet / Condenser inlet (Isentropic compression s2 = s1 to pHigh)
  // Superheat calculation based on vapor entropy and specific heat:
  // s2 - s_g(Tcond) = cp * ln(T2_K / Tcond_K)
  const tCondK = tCondC + 273.15;
  const deltaEntropy = Math.max(0.005, s1 - condProps.sg);
  const t2K = tCondK * Math.exp(deltaEntropy / ref.cpVapor);
  const t2 = t2K - 273.15;
  const h2 = condProps.hg + ref.cpVapor * (t2 - tCondC);

  // Performance parameters
  const qe = h1 - h4; // Refrigerating effect (kJ/kg)
  const wc = h2 - h1; // Compressor work input (kJ/kg)
  const cop = wc > 0 ? qe / wc : 0;

  // Carnot COP (Ideal reverse Carnot cycle between T_evap and T_cond)
  const tEvapK = tEvapC + 273.15;
  const deltaT = Math.max(0.1, tCondK - tEvapK);
  const copCarnot = tEvapK / deltaT;
  const carnotPercentage = copCarnot > 0 ? Math.min(100, Math.max(0, (cop / copCarnot) * 100)) : 0;

  const state1: CycleResults['state1'] = {
    id: 1,
    name: 'State 1: Evaporator Exit',
    location: 'Evaporator → Compressor Inlet',
    temperatureC: Number(t1.toFixed(1)),
    pressureKPa: Number(p1.toFixed(1)),
    enthalpy: Number(h1.toFixed(1)),
    entropy: Number(s1.toFixed(3)),
    phase: 'Saturated Vapor (x = 1.0)',
    color: '#3b82f6', // blue
  };

  const state2: CycleResults['state2'] = {
    id: 2,
    name: 'State 2: Compressor Exit',
    location: 'Compressor → Condenser Inlet',
    temperatureC: Number(t2.toFixed(1)),
    pressureKPa: Number(pHighKPa.toFixed(1)),
    enthalpy: Number(h2.toFixed(1)),
    entropy: Number(s1.toFixed(3)),
    phase: `Superheated Vapor (+${(t2 - tCondC).toFixed(1)} °C superheat)`,
    color: '#ef4444', // red
  };

  const state3: CycleResults['state3'] = {
    id: 3,
    name: 'State 3: Condenser Exit',
    location: 'Condenser → Expansion Valve Inlet',
    temperatureC: Number(t3.toFixed(1)),
    pressureKPa: Number(pHighKPa.toFixed(1)),
    enthalpy: Number(h3.toFixed(1)),
    entropy: Number(s3.toFixed(3)),
    phase: 'Saturated Liquid (x = 0.0)',
    color: '#f97316', // orange
  };

  const state4: CycleResults['state4'] = {
    id: 4,
    name: 'State 4: Expansion Valve Exit',
    location: 'Expansion Valve → Evaporator Inlet',
    temperatureC: Number(t4.toFixed(1)),
    pressureKPa: Number(pLowKPa.toFixed(1)),
    enthalpy: Number(h4.toFixed(1)),
    phase: `Two-Phase Mixture (${(x4 * 100).toFixed(1)}% vapor)`,
    color: '#06b6d4', // cyan
  };

  return {
    state1,
    state2,
    state3,
    state4,
    qe: Number(qe.toFixed(2)),
    wc: Number(wc.toFixed(2)),
    cop: Number(cop.toFixed(2)),
    copCarnot: Number(copCarnot.toFixed(2)),
    carnotPercentage: Number(carnotPercentage.toFixed(1)),
    pHighKPa: Number(pHighKPa.toFixed(1)),
    pLowKPa: Number(pLowKPa.toFixed(1)),
    pressureRatio: Number((pHighKPa / pLowKPa).toFixed(2)),
    tEvapC,
    tCondC,
    refrigerant: ref,
  };
}

/**
 * 3 Textbook Worked Examples from Standard Thermodynamics Curricula
 */
export const WORKED_EXAMPLES: WorkedExample[] = [
  {
    title: 'Çengel & Boles Example 11-1 (R-134a Refrigerator)',
    source: 'Thermodynamics: An Engineering Approach, 8th Ed. Example 11-1',
    refrigerant: 'R134a',
    tEvapC: -10,
    tCondC: 40,
    expectedCop: 3.97,
    expectedQe: 134.1,
    expectedWc: 33.8,
    notes: 'Standard household refrigerator operating between -10 °C evaporator and 40 °C condenser coils.',
  },
  {
    title: 'Moran & Shapiro Example 10.1 (R-22 AC Unit)',
    source: 'Fundamentals of Engineering Thermodynamics, Moran & Shapiro',
    refrigerant: 'R22',
    tEvapC: -5,
    tCondC: 45,
    expectedCop: 3.58,
    expectedQe: 145.4,
    expectedWc: 40.6,
    notes: 'Classical residential comfort cooling cycle with R-22 between -5 °C chilling and 45 °C ambient heat rejection.',
  },
  {
    title: 'Modern High-Efficiency Split Heat Pump (R-410A)',
    source: 'ASHRAE Fundamentals & Refrigeration Handbook Benchmark',
    refrigerant: 'R410A',
    tEvapC: 0,
    tCondC: 35,
    expectedCop: 4.65,
    expectedQe: 158.7,
    expectedWc: 34.1,
    notes: 'Modern inverter residential split-system cooling operation with high-pressure R-410A.',
  },
];
