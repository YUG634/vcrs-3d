/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RefrigerantId = 'R134a' | 'R22' | 'R410A';

export interface RefrigerantInfo {
  id: RefrigerantId;
  name: string;
  chemicalFormula: string;
  description: string;
  criticalTempC: number;
  criticalPressureKPa: number;
  cpVapor: number; // kJ/(kg·K) average specific heat of vapor
  kExp: number; // isentropic expansion index k ≈ cp/cv
}

export interface SaturationProperty {
  tempC: number;
  pSatKPa: number; // Saturation pressure in kPa
  hf: number; // Saturated liquid enthalpy (kJ/kg)
  hg: number; // Saturated vapor enthalpy (kJ/kg)
  sf: number; // Saturated liquid entropy (kJ/kg·K)
  sg: number; // Saturated vapor entropy (kJ/kg·K)
}

export interface StatePoint {
  id: 1 | 2 | 3 | 4;
  name: string;
  location: string;
  temperatureC: number;
  pressureKPa: number;
  enthalpy: number; // kJ/kg
  entropy?: number; // kJ/kg·K
  phase: string;
  color: string;
}

export interface CycleResults {
  state1: StatePoint; // Evaporator exit / Compressor inlet (Saturated Vapor)
  state2: StatePoint; // Compressor exit / Condenser inlet (Superheated Vapor)
  state3: StatePoint; // Condenser exit / Expansion Valve inlet (Saturated Liquid)
  state4: StatePoint; // Expansion Valve exit / Evaporator inlet (Liquid-Vapor Mixture)
  qe: number; // Refrigerating effect (kJ/kg)
  wc: number; // Compressor work (kJ/kg)
  cop: number; // Coefficient of Performance (actual)
  copCarnot: number; // Carnot COP
  carnotPercentage: number; // (cop / copCarnot) * 100
  pHighKPa: number;
  pLowKPa: number;
  pressureRatio: number;
  tEvapC: number;
  tCondC: number;
  refrigerant: RefrigerantInfo;
}

export type ActiveComponent = 'compressor' | 'condenser' | 'expansion_valve' | 'evaporator' | null;

export interface WorkedExample {
  title: string;
  source: string;
  refrigerant: RefrigerantId;
  tEvapC: number;
  tCondC: number;
  expectedCop: number;
  expectedQe: number;
  expectedWc: number;
  notes: string;
}
