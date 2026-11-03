/**
 * Unit tests for Landslide Sentinel calculation engine
 * Testing boundaries, digital logic, arithmetic adder, comparator, plain-language explanations, and validation.
 */

import { describe, it, expect } from 'vitest';
import {
  clamp,
  calculateDisplacement,
  normalizeSoilRisk,
  normalizeMovementRisk,
  calculateWeightedRisk,
  classifyRiskStatus,
  computeAllMetrics,
  generateStatusExplanation,
  getPrimaryContributor,
  evaluateAndGate,
  evaluateOrGate,
  evaluateNotGate,
  evaluateWarningLogic,
  calculate4BitAdder,
  compare4Bit,
  bitsToDecimal,
  decimalToBits,
  validateConfiguration,
  DEFAULT_CONFIG,
} from './calculations';
import { FourBitArray } from '@/types/simulator';

describe('Landslide Sentinel — Calculations Engine', () => {
  describe('Boundary and Threshold Tests', () => {
    it('classifies risk boundaries exactly at 34, 35, 69, and 70', () => {
      // SAFE: 0 to 34
      expect(classifyRiskStatus(0, 35, 70)).toBe('SAFE');
      expect(classifyRiskStatus(34, 35, 70)).toBe('SAFE');

      // WARNING: 35 to 69
      expect(classifyRiskStatus(35, 35, 70)).toBe('WARNING');
      expect(classifyRiskStatus(50, 35, 70)).toBe('WARNING');
      expect(classifyRiskStatus(69, 35, 70)).toBe('WARNING');

      // DANGER: 70 to 100
      expect(classifyRiskStatus(70, 35, 70)).toBe('DANGER');
      expect(classifyRiskStatus(100, 35, 70)).toBe('DANGER');
    });

    it('handles min and max moisture values correctly', () => {
      expect(normalizeSoilRisk(0)).toBe(0);
      expect(normalizeSoilRisk(100)).toBe(100);
      expect(normalizeSoilRisk(-10)).toBe(0);
      expect(normalizeSoilRisk(120)).toBe(100);
    });

    it('calculates zero and maximum movement risk', () => {
      // 0 displacement -> 0 risk
      expect(calculateDisplacement(100, 100)).toBe(0);
      expect(normalizeMovementRisk(0, 50)).toBe(0);

      // Max displacement (50 cm) -> 100 risk
      expect(calculateDisplacement(150, 100)).toBe(50);
      expect(normalizeMovementRisk(50, 50)).toBe(100);

      // Beyond max displacement -> clamped to 100
      expect(calculateDisplacement(180, 100)).toBe(80);
      expect(normalizeMovementRisk(80, 50)).toBe(100);
    });

    it('computes weighted risk with standard formula round(0.70*soil + 0.30*movement)', () => {
      // 0 soil, 0 movement -> 0
      expect(calculateWeightedRisk(0, 0, 0.7, 0.3)).toBe(0);

      // 50 soil, 50 movement -> 50
      expect(calculateWeightedRisk(50, 50, 0.7, 0.3)).toBe(50);

      // 100 soil, 0 movement -> 70
      expect(calculateWeightedRisk(100, 0, 0.7, 0.3)).toBe(70);

      // 0 soil, 100 movement -> 30
      expect(calculateWeightedRisk(0, 100, 0.7, 0.3)).toBe(30);

      // 100 soil, 100 movement -> 100
      expect(calculateWeightedRisk(100, 100, 0.7, 0.3)).toBe(100);
    });

    it('generates accurate plain-language explanations matching the status', () => {
      expect(generateStatusExplanation('SAFE')).toBe(
        'Current simulated readings remain below the warning threshold.'
      );
      expect(generateStatusExplanation('WARNING')).toBe(
        'The calculated risk has crossed the warning threshold. Monitor the changing conditions.'
      );
      expect(generateStatusExplanation('DANGER')).toBe(
        'The calculated risk has crossed the danger threshold in this simulation.'
      );
    });

    it('identifies primary risk contributor correctly', () => {
      // Soil dominant
      const resSoil = getPrimaryContributor(80, 10, 0.7, 0.3);
      expect(resSoil).toContain('Soil moisture is the primary risk driver');

      // Movement dominant
      const resMove = getPrimaryContributor(10, 90, 0.7, 0.3);
      expect(resMove).toContain('Ground movement is the primary risk driver');
    });
  });

  describe('Digital Logic Gates (Truth Tables)', () => {
    it('verifies all 4 combinations of AND gate', () => {
      expect(evaluateAndGate(false, false)).toBe(false);
      expect(evaluateAndGate(false, true)).toBe(false);
      expect(evaluateAndGate(true, false)).toBe(false);
      expect(evaluateAndGate(true, true)).toBe(true);
    });

    it('verifies all 4 combinations of OR gate', () => {
      expect(evaluateOrGate(false, false)).toBe(false);
      expect(evaluateOrGate(false, true)).toBe(true);
      expect(evaluateOrGate(true, false)).toBe(true);
      expect(evaluateOrGate(true, true)).toBe(true);
    });

    it('verifies both combinations of NOT gate', () => {
      expect(evaluateNotGate(false)).toBe(true);
      expect(evaluateNotGate(true)).toBe(false);
    });

    it('evaluates warning logic correctly', () => {
      const res1 = evaluateWarningLogic(20, 20, 35);
      expect(res1.soilWarning).toBe(false);
      expect(res1.movementWarning).toBe(false);
      expect(res1.orOutput).toBe(false);
      expect(res1.andOutput).toBe(false);

      const res2 = evaluateWarningLogic(40, 20, 35);
      expect(res2.soilWarning).toBe(true);
      expect(res2.movementWarning).toBe(false);
      expect(res2.orOutput).toBe(true);
      expect(res2.andOutput).toBe(false);

      const res3 = evaluateWarningLogic(40, 50, 35);
      expect(res3.soilWarning).toBe(true);
      expect(res3.movementWarning).toBe(true);
      expect(res3.orOutput).toBe(true);
      expect(res3.andOutput).toBe(true);
    });
  });

  describe('Four-Bit Binary Adder Tests', () => {
    it('accurately adds 0011 (3) + 0010 (2) = 0101 (5), CarryOut = 0', () => {
      const a: FourBitArray = [false, false, true, true]; // 0011 (3)
      const b: FourBitArray = [false, false, true, false]; // 0010 (2)
      const res = calculate4BitAdder(a, b, false);

      expect(res.decimalA).toBe(3);
      expect(res.decimalB).toBe(2);
      expect(res.carryOut).toBe(false);
      expect(res.decimalSum).toBe(5);
      expect(res.sumBits).toEqual([false, true, false, true]); // 0101
    });

    it('accurately adds 0111 (7) + 0001 (1) = 1000 (8), CarryOut = 0', () => {
      const a: FourBitArray = [false, true, true, true]; // 0111 (7)
      const b: FourBitArray = [false, false, false, true]; // 0001 (1)
      const res = calculate4BitAdder(a, b, false);

      expect(res.decimalA).toBe(7);
      expect(res.decimalB).toBe(1);
      expect(res.carryOut).toBe(false);
      expect(res.decimalSum).toBe(8);
      expect(res.sumBits).toEqual([true, false, false, false]); // 1000
    });

    it('accurately adds 1111 (15) + 0001 (1) = carry 1, sum 0000 (0)', () => {
      const a: FourBitArray = [true, true, true, true]; // 1111 (15)
      const b: FourBitArray = [false, false, false, true]; // 0001 (1)
      const res = calculate4BitAdder(a, b, false);

      expect(res.decimalA).toBe(15);
      expect(res.decimalB).toBe(1);
      expect(res.carryOut).toBe(true);
      expect(res.decimalSum).toBe(0);
      expect(res.sumBits).toEqual([false, false, false, false]); // 0000
      expect(res.fullSum).toBe(16);
    });

    it('handles carry-in switch correctly (0000 + 0000 + Cin(1) = 0001)', () => {
      const a: FourBitArray = [false, false, false, false];
      const b: FourBitArray = [false, false, false, false];
      const res = calculate4BitAdder(a, b, true);

      expect(res.carryOut).toBe(false);
      expect(res.decimalSum).toBe(1);
      expect(res.sumBits).toEqual([false, false, false, true]);
    });
  });

  describe('Four-Bit Comparator Tests', () => {
    it('correctly identifies A = B when operands are equal', () => {
      const a = decimalToBits(5);
      const b = decimalToBits(5);
      const res = compare4Bit(a, b);

      expect(res.aEqualsB).toBe(true);
      expect(res.aGreaterThanB).toBe(false);
      expect(res.aLessThanB).toBe(false);
      expect(res.activeRelation).toBe('A = B');
    });

    it('correctly identifies A > B when A is greater', () => {
      const a = decimalToBits(12);
      const b = decimalToBits(4);
      const res = compare4Bit(a, b);

      expect(res.aGreaterThanB).toBe(true);
      expect(res.aEqualsB).toBe(false);
      expect(res.aLessThanB).toBe(false);
      expect(res.activeRelation).toBe('A > B');
    });

    it('correctly identifies A < B when A is smaller', () => {
      const a = decimalToBits(3);
      const b = decimalToBits(9);
      const res = compare4Bit(a, b);

      expect(res.aLessThanB).toBe(true);
      expect(res.aGreaterThanB).toBe(false);
      expect(res.aEqualsB).toBe(false);
      expect(res.activeRelation).toBe('A < B');
    });
  });

  describe('Configuration Validation Tests', () => {
    it('accepts valid default configuration', () => {
      const res = validateConfiguration(DEFAULT_CONFIG);
      expect(res.isValid).toBe(true);
      expect(Object.keys(res.errors)).toHaveLength(0);
    });

    it('rejects when warningThreshold >= dangerThreshold', () => {
      const res = validateConfiguration({
        ...DEFAULT_CONFIG,
        warningThreshold: 75,
        dangerThreshold: 70,
      });
      expect(res.isValid).toBe(false);
      expect(res.errors.warningThreshold).toBeDefined();
    });

    it('rejects weights that do not sum to 100%', () => {
      const res = validateConfiguration({
        ...DEFAULT_CONFIG,
        soilWeight: 0.8,
        movementWeight: 0.3, // 110%
      });
      expect(res.isValid).toBe(false);
      expect(res.errors.weights).toBeDefined();
    });

    it('rejects non-positive displacement ranges', () => {
      const res = validateConfiguration({
        ...DEFAULT_CONFIG,
        maxDisplacementRange: 0,
      });
      expect(res.isValid).toBe(false);
      expect(res.errors.maxDisplacementRange).toBeDefined();
    });
  });

  describe('Deterministic Scenario Presets Evaluation', () => {
    it('computes metrics with plain language explanation and contributor', () => {
      const metricsSafe = computeAllMetrics(
        { soilMoisture: 18, currentDistance: 101 },
        DEFAULT_CONFIG
      );
      expect(metricsSafe.totalRisk).toBeLessThan(35);
      expect(metricsSafe.status).toBe('SAFE');
      expect(metricsSafe.statusExplanation).toBe(
        'Current simulated readings remain below the warning threshold.'
      );
      expect(metricsSafe.primaryContributor).toBeDefined();

      const metricsWarn = computeAllMetrics(
        { soilMoisture: 65, currentDistance: 101 },
        DEFAULT_CONFIG
      );
      expect(metricsWarn.status).toBe('WARNING');
      expect(metricsWarn.statusExplanation).toBe(
        'The calculated risk has crossed the warning threshold. Monitor the changing conditions.'
      );

      const metricsDanger = computeAllMetrics(
        { soilMoisture: 88, currentDistance: 142 },
        DEFAULT_CONFIG
      );
      expect(metricsDanger.status).toBe('DANGER');
      expect(metricsDanger.statusExplanation).toBe(
        'The calculated risk has crossed the danger threshold in this simulation.'
      );
    });
  });
});
