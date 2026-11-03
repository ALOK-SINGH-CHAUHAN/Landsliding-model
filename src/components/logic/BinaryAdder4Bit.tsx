'use client';

import React from 'react';
import { useSimulator } from '@/context/SimulatorContext';
import { FourBitArray } from '@/types/simulator';
import { Binary, ArrowDown, HelpCircle, Check } from 'lucide-react';

export default function BinaryAdder4Bit() {
  const {
    adderA,
    setAdderA,
    toggleAdderABit,
    adderB,
    setAdderB,
    toggleAdderBBit,
    adderCin,
    setAdderCin,
    adderOutput,
  } = useSimulator();

  // Test Case Quick Loaders
  const loadTestCase = (a: FourBitArray, b: FourBitArray, cin: boolean) => {
    setAdderA(a);
    setAdderB(b);
    setAdderCin(cin);
  };

  const bitLabels = ['Bit 3 (2³ = 8)', 'Bit 2 (2² = 4)', 'Bit 1 (2¹ = 2)', 'Bit 0 (2⁰ = 1)'];

  return (
    <div className="rounded-md border border-hairline bg-card p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Binary className="h-4 w-4 text-text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            Four-Bit Binary Full Adder (74HC283 Circuit Architecture)
          </h3>
        </div>
        <span className="font-mono text-[10px] text-text-muted">
          RIPPLE-CARRY ARITHMETIC LOGIC UNIT
        </span>
      </div>

      {/* Quick Verified Test Cases */}
      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md border border-hairline bg-canvas p-2.5">
        <span className="font-mono text-xs text-text-secondary">Verified Test Cases:</span>
        <button
          onClick={() => loadTestCase([false, false, true, true], [false, false, true, false], false)}
          className="rounded border border-hairline bg-card px-2 py-1 font-mono text-[11px] text-text-primary hover:bg-neutral-100"
        >
          0011 + 0010 = 0101 (3 + 2 = 5)
        </button>
        <button
          onClick={() => loadTestCase([false, true, true, true], [false, false, false, true], false)}
          className="rounded border border-hairline bg-card px-2 py-1 font-mono text-[11px] text-text-primary hover:bg-neutral-100"
        >
          0111 + 0001 = 1000 (7 + 1 = 8)
        </button>
        <button
          onClick={() => loadTestCase([true, true, true, true], [false, false, false, true], false)}
          className="rounded border border-hairline bg-card px-2 py-1 font-mono text-[11px] text-text-primary hover:bg-neutral-100"
        >
          1111 + 0001 = Cout:1, Sum:0000 (15 + 1 = 16)
        </button>
      </div>

      {/* Interactive Adder Grid */}
      <div className="mt-5 space-y-4">
        {/* Operand A Controls */}
        <div className="rounded-md border border-hairline bg-canvas p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-text-primary">
              Operand A (4-Bit Word):
            </span>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-text-muted">Binary:</span>
              <span className="font-bold text-text-primary">
                {adderA.map((b) => (b ? '1' : '0')).join('')}
              </span>
              <span className="text-text-muted">| Decimal:</span>
              <span className="font-bold text-blue-600">{adderOutput.decimalA}</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {adderA.map((bit, idx) => (
              <button
                key={idx}
                onClick={() => toggleAdderABit(idx)}
                className={`flex flex-col items-center justify-center rounded-md border p-2 font-mono transition-all ${
                  bit
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-xs'
                    : 'border-hairline bg-card text-text-muted hover:border-neutral-400'
                }`}
                aria-label={`Toggle Operand A ${bitLabels[idx]}`}
              >
                <span className="text-[10px] text-text-muted">A{3 - idx}</span>
                <span className="text-base font-bold">{bit ? '1' : '0'}</span>
                <span className="text-[9px] text-text-muted">{bitLabels[idx].split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Operand B Controls + Carry In */}
        <div className="rounded-md border border-hairline bg-canvas p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-text-primary">
              Operand B (4-Bit Word) & Carry-In (Cin):
            </span>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-text-muted">Binary:</span>
              <span className="font-bold text-text-primary">
                {adderB.map((b) => (b ? '1' : '0')).join('')}
              </span>
              <span className="text-text-muted">| Decimal:</span>
              <span className="font-bold text-blue-600">{adderOutput.decimalB}</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-5 gap-2">
            {/* Carry In Switch */}
            <button
              onClick={() => setAdderCin(!adderCin)}
              className={`flex flex-col items-center justify-center rounded-md border p-2 font-mono transition-all ${
                adderCin
                  ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-xs'
                  : 'border-hairline bg-card text-text-muted hover:border-neutral-400'
              }`}
              aria-label="Toggle Carry In (Cin)"
            >
              <span className="text-[10px] text-text-muted">Cin</span>
              <span className="text-base font-bold">{adderCin ? '1' : '0'}</span>
              <span className="text-[9px] text-text-muted">Carry In</span>
            </button>

            {/* B3 to B0 */}
            {adderB.map((bit, idx) => (
              <button
                key={idx}
                onClick={() => toggleAdderBBit(idx)}
                className={`flex flex-col items-center justify-center rounded-md border p-2 font-mono transition-all ${
                  bit
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-xs'
                    : 'border-hairline bg-card text-text-muted hover:border-neutral-400'
                }`}
                aria-label={`Toggle Operand B ${bitLabels[idx]}`}
              >
                <span className="text-[10px] text-text-muted">B{3 - idx}</span>
                <span className="text-base font-bold">{bit ? '1' : '0'}</span>
                <span className="text-[9px] text-text-muted">{bitLabels[idx].split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider / Arithmetic Operation */}
        <div className="flex items-center justify-center gap-2 font-mono text-xs text-text-muted">
          <ArrowDown className="h-4 w-4" /> Ripple Carry Stage Evaluation
        </div>

        {/* Output Row: Carry Out (Cout) and Sum [S3, S2, S1, S0] */}
        <div className="rounded-md border border-text-primary bg-neutral-900 p-4 text-white shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
            <span className="font-mono text-xs font-semibold text-neutral-300">
              ADDER ARITHMETIC OUTPUT
            </span>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-neutral-400">Total Sum:</span>
              <span className="font-bold text-emerald-400 text-sm">
                {adderOutput.fullSum}
              </span>
              <span className="text-neutral-400">
                (Carry: {adderOutput.carryOut ? '16' : '0'} + Base Sum: {adderOutput.decimalSum})
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-5 gap-2">
            {/* Carry Out Flag */}
            <div
              className={`flex flex-col items-center justify-center rounded-md border p-2 font-mono ${
                adderOutput.carryOut
                  ? 'border-amber-400 bg-amber-950/60 text-amber-300'
                  : 'border-neutral-800 bg-neutral-950 text-neutral-600'
              }`}
            >
              <span className="text-[10px] uppercase text-neutral-400">Cout (2⁴)</span>
              <span className="text-xl font-bold">{adderOutput.carryOut ? '1' : '0'}</span>
              <span className="text-[9px] text-neutral-400">Carry Out</span>
            </div>

            {/* Sum Bits S3..S0 */}
            {adderOutput.sumBits.map((bit, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center rounded-md border p-2 font-mono ${
                  bit
                    ? 'border-emerald-400 bg-emerald-950/60 text-emerald-300'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-600'
                }`}
              >
                <span className="text-[10px] uppercase text-neutral-400">S{3 - idx}</span>
                <span className="text-xl font-bold">{bit ? '1' : '0'}</span>
                <span className="text-[9px] text-neutral-400">{bitLabels[idx].split(' ')[0]}</span>
              </div>
            ))}
          </div>

          {/* Mathematical Step Trace */}
          <div className="mt-3 rounded border border-neutral-800 bg-neutral-950 p-2.5 font-mono text-xs text-neutral-300">
            <span className="text-neutral-500">Operation trace: </span>
            {adderOutput.explanation}
          </div>
        </div>

        {/* Detailed Bit-by-Bit Ripple Carry Progression Table */}
        <div className="rounded-md border border-hairline bg-card p-3">
          <div className="mb-2 flex items-center gap-1 font-mono text-[11px] font-semibold text-text-secondary">
            <HelpCircle className="h-3.5 w-3.5" /> Full Adder Bitwise Stage Breakdown (LSB to MSB)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-hairline text-left text-[10px] text-text-muted">
                  <th className="py-1 px-2">Stage</th>
                  <th className="py-1 px-2">A_i</th>
                  <th className="py-1 px-2">B_i</th>
                  <th className="py-1 px-2">Cin_i</th>
                  <th className="py-1 px-2">Formula [Sum = A ⊕ B ⊕ Cin]</th>
                  <th className="py-1 px-2">Sum Bit</th>
                  <th className="py-1 px-2 text-right">Cout_i</th>
                </tr>
              </thead>
              <tbody>
                {adderOutput.bitSteps.map((step) => (
                  <tr key={step.bitIndex} className="border-b border-hairline/50 text-text-body">
                    <td className="py-1 px-2 font-semibold">Bit {step.bitIndex}</td>
                    <td className="py-1 px-2">{step.a ? '1' : '0'}</td>
                    <td className="py-1 px-2">{step.b ? '1' : '0'}</td>
                    <td className="py-1 px-2">{step.cin ? '1' : '0'}</td>
                    <td className="py-1 px-2 text-[11px] text-text-muted">
                      ({step.a ? '1' : '0'} ⊕ {step.b ? '1' : '0'} ⊕ {step.cin ? '1' : '0'})
                    </td>
                    <td className="py-1 px-2 font-bold text-text-primary">{step.sum ? '1' : '0'}</td>
                    <td className="py-1 px-2 text-right font-semibold text-amber-600">
                      {step.cout ? '1' : '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
