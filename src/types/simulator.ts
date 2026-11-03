/**
 * Type definitions for Landslide Sentinel — Early-Warning System Simulator
 */

export type RiskStatus = 'SAFE' | 'WARNING' | 'DANGER';

export type RiskTrend = 'RISING' | 'FALLING' | 'STABLE';

export type ActiveTab = 'overview' | 'simulator' | 'analysis' | 'about';

export interface SimulatorConfig {
  warningThreshold: number; // default: 35
  dangerThreshold: number;  // default: 70
  soilWeight: number;        // default: 0.70 (70%)
  movementWeight: number;    // default: 0.30 (30%)
  maxDisplacementRange: number; // default: 50 cm
  referenceDistance: number;    // default: 100 cm
  ledBlinkInterval: number;     // default: 600 ms
}

export interface SensorInputs {
  soilMoisture: number;     // 0% - 100%
  currentDistance: number;  // cm (e.g. 50 - 150)
  referenceDistance: number;// cm (e.g. 100)
}

export interface ComputedMetrics {
  displacement: number;     // abs(currentDistance - referenceDistance) in cm
  soilRisk: number;         // 0 - 100
  movementRisk: number;     // 0 - 100
  totalRisk: number;        // 0 - 100 (weighted sum clamped)
  status: RiskStatus;
  statusExplanation: string;
  primaryContributor: string;
  soilWarningActive: boolean;     // soilRisk >= warningThreshold
  movementWarningActive: boolean; // movementRisk >= warningThreshold
}

export type ScenarioPresetId = 'stable' | 'increasing_moisture' | 'ground_movement' | 'combined_danger';

export interface ScenarioWaypoint {
  atPercent: number; // 0 to 100
  moisture: number;  // volumetric %
  distance: number;  // cm
  phaseName: string; // readable phase title
  expectedStatus: RiskStatus;
}

export interface ScenarioPreset {
  id: ScenarioPresetId;
  name: string;
  shortTitle: string;
  description: string;
  durationSeconds: number;
  waypoints: ScenarioWaypoint[];
}

export type EventType =
  | 'SIMULATION_STARTED'
  | 'SIMULATION_PAUSED'
  | 'SIMULATION_RESUMED'
  | 'SIMULATION_RESET'
  | 'SCENARIO_SELECTED'
  | 'INPUT_CHANGED'
  | 'THRESHOLD_WARNING_CROSSED'
  | 'THRESHOLD_DANGER_CROSSED'
  | 'STATE_RETURNED_WARNING'
  | 'STATE_RETURNED_SAFE'
  | 'CONFIG_UPDATED';

export interface TimelineEvent {
  id: string;
  timestamp: number;
  timeString: string;
  type: EventType;
  message: string;
  riskValue: number;
  status: RiskStatus;
}

export interface TelemetryPoint {
  timestamp: number;
  timeString: string;
  soilMoisture: number;
  displacement: number;
  soilRisk: number;
  movementRisk: number;
  totalRisk: number;
  status: RiskStatus;
}

export interface StateDurations {
  SAFE: number;
  WARNING: number;
  DANGER: number;
}

export type FourBitArray = [boolean, boolean, boolean, boolean]; // [bit3, bit2, bit1, bit0] (MSB to LSB)

export interface AdderOutput {
  sumBits: FourBitArray;
  carryOut: boolean;
  decimalA: number;
  decimalB: number;
  carryIn: boolean;
  decimalSum: number;
  fullSum: number; // with carryOut
  explanation: string;
  bitSteps: Array<{
    bitIndex: number;
    a: boolean;
    b: boolean;
    cin: boolean;
    sum: boolean;
    cout: boolean;
  }>;
}

export interface ComparatorOutput {
  aGreaterThanB: boolean;
  aEqualsB: boolean;
  aLessThanB: boolean;
  decimalA: number;
  decimalB: number;
  activeRelation: 'A > B' | 'A = B' | 'A < B';
}
