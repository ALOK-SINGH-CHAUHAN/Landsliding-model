/**
 * Pure calculation engine for Landslide Sentinel — Early-Warning System Simulator
 * Independent of React UI components for robust testing and zero-side-effect calculations.
 */

import {
  ComputedMetrics,
  FourBitArray,
  AdderOutput,
  ComparatorOutput,
  RiskStatus,
  SimulatorConfig,
} from '@/types/simulator';

/**
 * Standard default configuration
 */
export const DEFAULT_CONFIG: SimulatorConfig = {
  warningThreshold: 35,
  dangerThreshold: 70,
  soilWeight: 0.70,
  movementWeight: 0.30,
  maxDisplacementRange: 50, // cm
  referenceDistance: 100,   // cm
  ledBlinkInterval: 600,     // ms
};

/**
 * Clamp a number between min and max inclusive.
 */
export function clamp(val: number, min: number, max: number): number {
  if (isNaN(val)) return min;
  return Math.min(Math.max(val, min), max);
}

/**
 * Calculate absolute physical ground displacement:
 * displacement = |currentDistance - referenceDistance|
 */
export function calculateDisplacement(
  currentDistance: number,
  referenceDistance: number
): number {
  const safeCurrent = isNaN(currentDistance) ? 0 : currentDistance;
  const safeRef = isNaN(referenceDistance) ? 0 : referenceDistance;
  const diff = Math.abs(safeCurrent - safeRef);
  return Math.round(diff * 10) / 10; // 1 decimal place precision
}

/**
 * Normalize soil moisture to soil risk score [0 - 100].
 * soilRisk = moisturePercentage (clamped 0 - 100)
 */
export function normalizeSoilRisk(moisturePercentage: number): number {
  return clamp(Math.round(moisturePercentage), 0, 100);
}

/**
 * Normalize displacement to movement-risk score [0 - 100].
 * movementRisk = (displacement / maxDisplacementRange) * 100, clamped 0 - 100
 */
export function normalizeMovementRisk(
  displacement: number,
  maxDisplacementRange: number
): number {
  if (maxDisplacementRange <= 0) return 100;
  const ratio = displacement / maxDisplacementRange;
  return clamp(Math.round(ratio * 100), 0, 100);
}

/**
 * Calculate weighted total risk:
 * totalRisk = round(soilWeight * soilRisk + movementWeight * movementRisk)
 * Clamped 0 - 100.
 */
export function calculateWeightedRisk(
  soilRisk: number,
  movementRisk: number,
  soilWeight: number,
  movementWeight: number
): number {
  const weighted = soilWeight * soilRisk + movementWeight * movementRisk;
  return clamp(Math.round(weighted), 0, 100);
}

/**
 * Classify risk status against thresholds:
 * SAFE: 0 to (warningThreshold - 1)
 * WARNING: warningThreshold to (dangerThreshold - 1)
 * DANGER: dangerThreshold to 100
 */
export function classifyRiskStatus(
  totalRisk: number,
  warningThreshold: number,
  dangerThreshold: number
): RiskStatus {
  if (totalRisk >= dangerThreshold) {
    return 'DANGER';
  }
  if (totalRisk >= warningThreshold) {
    return 'WARNING';
  }
  return 'SAFE';
}

/**
 * Generate concise explanation of which input contributes most to the risk score.
 */
export function getPrimaryContributor(
  soilRisk: number,
  movementRisk: number,
  soilWeight: number,
  movementWeight: number
): string {
  const soilContribution = Math.round(soilWeight * soilRisk * 10) / 10;
  const movementContribution = Math.round(movementWeight * movementRisk * 10) / 10;
  const total = soilContribution + movementContribution;

  if (total === 0) {
    return 'Both soil moisture and ground movement are at zero baseline levels.';
  }

  const soilPct = Math.round((soilContribution / total) * 100);
  const movePct = 100 - soilPct;

  if (soilContribution > movementContribution) {
    return `Soil moisture is the primary risk driver (${soilContribution.toFixed(1)} pts / ${soilPct}% of current risk).`;
  }
  if (movementContribution > soilContribution) {
    return `Ground movement is the primary risk driver (${movementContribution.toFixed(1)} pts / ${movePct}% of current risk).`;
  }
  return `Soil moisture and ground movement contribute equally (${soilContribution.toFixed(1)} pts each).`;
}

/**
 * Generate human-readable explanation for active status matching user requirements.
 */
export function generateStatusExplanation(
  status: RiskStatus
): string {
  switch (status) {
    case 'DANGER':
      return 'The calculated risk has crossed the danger threshold in this simulation.';
    case 'WARNING':
      return 'The calculated risk has crossed the warning threshold. Monitor the changing conditions.';
    case 'SAFE':
    default:
      return 'Current simulated readings remain below the warning threshold.';
  }
}

/**
 * Complete metrics computation from raw sensor inputs and config.
 */
export function computeAllMetrics(
  inputs: { soilMoisture: number; currentDistance: number },
  config: SimulatorConfig
): ComputedMetrics {
  const displacement = calculateDisplacement(inputs.currentDistance, config.referenceDistance);
  const soilRisk = normalizeSoilRisk(inputs.soilMoisture);
  const movementRisk = normalizeMovementRisk(displacement, config.maxDisplacementRange);
  const totalRisk = calculateWeightedRisk(
    soilRisk,
    movementRisk,
    config.soilWeight,
    config.movementWeight
  );
  const status = classifyRiskStatus(totalRisk, config.warningThreshold, config.dangerThreshold);
  const statusExplanation = generateStatusExplanation(status);
  const primaryContributor = getPrimaryContributor(
    soilRisk,
    movementRisk,
    config.soilWeight,
    config.movementWeight
  );

  const soilWarningActive = soilRisk >= config.warningThreshold;
  const movementWarningActive = movementRisk >= config.warningThreshold;

  return {
    displacement,
    soilRisk,
    movementRisk,
    totalRisk,
    status,
    statusExplanation,
    primaryContributor,
    soilWarningActive,
    movementWarningActive,
  };
}

// ---------------------------------------------------------
// DIGITAL LOGIC GATES (AND, OR, NOT)
// ---------------------------------------------------------

export function evaluateAndGate(a: boolean, b: boolean): boolean {
  return a && b;
}

export function evaluateOrGate(a: boolean, b: boolean): boolean {
  return a || b;
}

export function evaluateNotGate(a: boolean): boolean {
  return !a;
}

export function evaluateWarningLogic(
  soilRisk: number,
  movementRisk: number,
  warningThreshold: number
) {
  const soilWarning = soilRisk >= warningThreshold;
  const movementWarning = movementRisk >= warningThreshold;
  const orOutput = soilWarning || movementWarning;
  const andOutput = soilWarning && movementWarning;
  return {
    soilWarning,
    movementWarning,
    orOutput,
    andOutput,
  };
}

// ---------------------------------------------------------
// 4-BIT BINARY ADDER & COMPARATOR ARITHMETIC
// ---------------------------------------------------------

/**
 * Converts a 4-bit array [bit3, bit2, bit1, bit0] (MSB to LSB) to unsigned decimal (0 - 15).
 */
export function bitsToDecimal(bits: FourBitArray): number {
  let val = 0;
  if (bits[0]) val += 8;
  if (bits[1]) val += 4;
  if (bits[2]) val += 2;
  if (bits[3]) val += 1;
  return val;
}

/**
 * Converts an unsigned decimal (0 - 15) to a 4-bit array [bit3, bit2, bit1, bit0].
 */
export function decimalToBits(decimal: number): FourBitArray {
  const d = clamp(Math.floor(decimal), 0, 15);
  return [
    Boolean(d & 8),
    Boolean(d & 4),
    Boolean(d & 2),
    Boolean(d & 1),
  ];
}

/**
 * Full adder logic for a single bit:
 * Sum = A ^ B ^ Cin
 * Cout = (A & B) | (Cin & (A ^ B))
 */
export function fullAdderBit(a: boolean, b: boolean, cin: boolean): { sum: boolean; cout: boolean } {
  const sum = (a !== b) !== cin; // XOR 3 inputs
  const cout = (a && b) || (cin && (a !== b));
  return { sum, cout };
}

/**
 * Simulates a ripple-carry 4-bit binary adder.
 * Bits ordered [bit3, bit2, bit1, bit0] where bit0 is LSB and bit3 is MSB.
 */
export function calculate4BitAdder(
  aBits: FourBitArray,
  bBits: FourBitArray,
  cin: boolean
): AdderOutput {
  const decA = bitsToDecimal(aBits);
  const decB = bitsToDecimal(bBits);

  let currentCarry = cin;
  const sumBitsReversed: boolean[] = [];
  const bitSteps: AdderOutput['bitSteps'] = [];

  // Ripple from LSB (index 3) up to MSB (index 0)
  for (let i = 3; i >= 0; i--) {
    const a = aBits[i];
    const b = bBits[i];
    const step = fullAdderBit(a, b, currentCarry);
    bitSteps.push({
      bitIndex: 3 - i,
      a,
      b,
      cin: currentCarry,
      sum: step.sum,
      cout: step.cout,
    });
    sumBitsReversed.push(step.sum);
    currentCarry = step.cout;
  }

  // Reverse back so index 0 is MSB (bit 3), index 3 is LSB (bit 0)
  const sumBits: FourBitArray = [
    sumBitsReversed[3],
    sumBitsReversed[2],
    sumBitsReversed[1],
    sumBitsReversed[0],
  ];

  const decimalSum = bitsToDecimal(sumBits);
  const fullSum = (currentCarry ? 16 : 0) + decimalSum;

  const explanation = `${decA} (0b${bitsToString(aBits)}) + ${decB} (0b${bitsToString(bBits)})${
    cin ? ' + Cin(1)' : ''
  } = ${fullSum} (Carry: ${currentCarry ? '1' : '0'}, Sum: 0b${bitsToString(sumBits)} = ${decimalSum})`;

  return {
    sumBits,
    carryOut: currentCarry,
    decimalA: decA,
    decimalB: decB,
    carryIn: cin,
    decimalSum,
    fullSum,
    explanation,
    bitSteps: bitSteps.reverse(), // order from MSB to LSB for reading
  };
}

/**
 * Convert 4-bit array to binary string '0101'
 */
export function bitsToString(bits: FourBitArray): string {
  return bits.map(b => (b ? '1' : '0')).join('');
}

/**
 * 4-bit unsigned comparator:
 * Evaluates A (0-15) and B (0-15).
 * Output flags: A > B, A = B, A < B. Exactly one is active.
 */
export function compare4Bit(aBits: FourBitArray, bBits: FourBitArray): ComparatorOutput {
  const decimalA = bitsToDecimal(aBits);
  const decimalB = bitsToDecimal(bBits);

  const aGreaterThanB = decimalA > decimalB;
  const aEqualsB = decimalA === decimalB;
  const aLessThanB = decimalA < decimalB;

  let activeRelation: 'A > B' | 'A = B' | 'A < B' = 'A = B';
  if (aGreaterThanB) activeRelation = 'A > B';
  if (aLessThanB) activeRelation = 'A < B';

  return {
    aGreaterThanB,
    aEqualsB,
    aLessThanB,
    decimalA,
    decimalB,
    activeRelation,
  };
}

// ---------------------------------------------------------
// CONFIGURATION VALIDATION
// ---------------------------------------------------------

export interface ConfigValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateConfiguration(config: Partial<SimulatorConfig>): ConfigValidationResult {
  const errors: Record<string, string> = {};

  if (config.warningThreshold === undefined || isNaN(config.warningThreshold)) {
    errors.warningThreshold = 'Warning threshold is required.';
  } else if (config.warningThreshold < 0 || config.warningThreshold > 100) {
    errors.warningThreshold = 'Warning threshold must be between 0 and 100.';
  }

  if (config.dangerThreshold === undefined || isNaN(config.dangerThreshold)) {
    errors.dangerThreshold = 'Danger threshold is required.';
  } else if (config.dangerThreshold < 0 || config.dangerThreshold > 100) {
    errors.dangerThreshold = 'Danger threshold must be between 0 and 100.';
  }

  if (
    config.warningThreshold !== undefined &&
    config.dangerThreshold !== undefined &&
    config.warningThreshold >= config.dangerThreshold
  ) {
    errors.warningThreshold = 'Warning threshold must be strictly less than danger threshold.';
  }

  if (config.soilWeight === undefined || config.movementWeight === undefined) {
    errors.weights = 'Both weights are required.';
  } else {
    const totalWeight = Math.round((config.soilWeight + config.movementWeight) * 100);
    if (totalWeight !== 100) {
      errors.weights = `Weights must sum to 100% (currently ${totalWeight}%).`;
    }
  }

  if (config.maxDisplacementRange !== undefined && config.maxDisplacementRange <= 0) {
    errors.maxDisplacementRange = 'Displacement range must be greater than 0.';
  }

  if (config.referenceDistance !== undefined && config.referenceDistance <= 0) {
    errors.referenceDistance = 'Reference distance must be greater than 0.';
  }

  if (config.ledBlinkInterval !== undefined && config.ledBlinkInterval < 50) {
    errors.ledBlinkInterval = 'Blink interval must be at least 50 ms.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
