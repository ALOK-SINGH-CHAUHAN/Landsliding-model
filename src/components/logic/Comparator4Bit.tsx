'use client';

import React from 'react';
import { useSimulator } from '@/context/SimulatorContext';
import { FourBitArray } from '@/types/simulator';
import { Scale, Check } from 'lucide-react';

export default function Comparator4Bit() {
  const { compA, setCompA, toggleCompABit, compB, setCompB, toggleCompBBit, comparatorOutput } =
    useSimulator();

  const loadPreset = (a: FourBitArray, b: FourBitArray) => {
    setCompA(a);
    setCompB(b);
  };

  return (
    <div className="rounded-md border border-hairline bg-card p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            Four-Bit Magnitude Comparator (74HC85 Circuit Model)
          </h3>
        </div>
        <span className="font-mono text-[10px] text-text-muted">
          UNSIGNED MAGNITUDE COMPARISON
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md border border-hairline bg-canvas p-2.5">
        <span className="font-mono text-xs text-text-secondary">Quick Conditions:</span>
        <button
          onClick={() => loadPreset([false, true, false, true], [false, true, false, true])}
          className="rounded border border-hairline bg-card px-2 py-1 font-mono text-[11px] text-text-primary hover:bg-neutral-100"
        >
          A = B (5 vs 5)
        </button>
        <button
          onClick={() => loadPreset([true, true, false, false], [false, false, true, true])}
          className="rounded border border-hairline bg-card px-2 py-1 font-mono text-[11px] text-text-primary hover:bg-neutral-100"
        >
          A &gt; B (12 vs 3)
        </button>
        <button
          onClick={() => loadPreset([false, false, true, false], [true, false, false, true])}
          className="rounded border border-hairline bg-card px-2 py-1 font-mono text-[11px] text-text-primary hover:bg-neutral-100"
        >
          A &lt; B (2 vs 9)
        </button>
      </div>

      {/* Operands Selection Grid */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Operand A Controls */}
        <div className="rounded-md border border-hairline bg-canvas p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-text-primary">Operand A:</span>
            <div className="font-mono text-xs">
              <span className="text-text-muted">Decimal: </span>
              <strong className="text-blue-600 text-sm">{comparatorOutput.decimalA}</strong>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {compA.map((bit, idx) => (
              <button
                key={idx}
                onClick={() => toggleCompABit(idx)}
                className={`flex flex-col items-center justify-center rounded-md border p-2 font-mono transition-all ${
                  bit
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-xs'
                    : 'border-hairline bg-card text-text-muted hover:border-neutral-400'
                }`}
                aria-label={`Toggle Comparator A bit ${3 - idx}`}
              >
                <span className="text-[10px] text-text-muted">A{3 - idx}</span>
                <span className="text-base font-bold">{bit ? '1' : '0'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Operand B Controls */}
        <div className="rounded-md border border-hairline bg-canvas p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-text-primary">Operand B:</span>
            <div className="font-mono text-xs">
              <span className="text-text-muted">Decimal: </span>
              <strong className="text-blue-600 text-sm">{comparatorOutput.decimalB}</strong>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {compB.map((bit, idx) => (
              <button
                key={idx}
                onClick={() => toggleCompBBit(idx)}
                className={`flex flex-col items-center justify-center rounded-md border p-2 font-mono transition-all ${
                  bit
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-xs'
                    : 'border-hairline bg-card text-text-muted hover:border-neutral-400'
                }`}
                aria-label={`Toggle Comparator B bit ${3 - idx}`}
              >
                <span className="text-[10px] text-text-muted">B{3 - idx}</span>
                <span className="text-base font-bold">{bit ? '1' : '0'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mutually Exclusive 3-State Output Display */}
      <div className="mt-5 rounded-md border border-hairline bg-card p-4">
        <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted mb-2">
          COMPARATOR OUTPUT STATUS (EXACTLY ONE ACTIVE)
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* A > B */}
          <div
            className={`flex flex-col items-center justify-center rounded-md border p-3 font-mono transition-all ${
              comparatorOutput.aGreaterThanB
                ? 'border-text-primary bg-text-primary text-white shadow-sm ring-1 ring-text-primary'
                : 'border-hairline bg-canvas text-text-muted opacity-50'
            }`}
          >
            <span className="text-xs uppercase">A &gt; B</span>
            <span className="mt-1 text-lg font-bold">
              {comparatorOutput.aGreaterThanB ? 'ACTIVE (1)' : '0'}
            </span>
            <span className="mt-1 text-[10px]">
              {comparatorOutput.decimalA} &gt; {comparatorOutput.decimalB}
            </span>
          </div>

          {/* A = B */}
          <div
            className={`flex flex-col items-center justify-center rounded-md border p-3 font-mono transition-all ${
              comparatorOutput.aEqualsB
                ? 'border-text-primary bg-text-primary text-white shadow-sm ring-1 ring-text-primary'
                : 'border-hairline bg-canvas text-text-muted opacity-50'
            }`}
          >
            <span className="text-xs uppercase">A = B</span>
            <span className="mt-1 text-lg font-bold">
              {comparatorOutput.aEqualsB ? 'ACTIVE (1)' : '0'}
            </span>
            <span className="mt-1 text-[10px]">
              {comparatorOutput.decimalA} = {comparatorOutput.decimalB}
            </span>
          </div>

          {/* A < B */}
          <div
            className={`flex flex-col items-center justify-center rounded-md border p-3 font-mono transition-all ${
              comparatorOutput.aLessThanB
                ? 'border-text-primary bg-text-primary text-white shadow-sm ring-1 ring-text-primary'
                : 'border-hairline bg-canvas text-text-muted opacity-50'
            }`}
          >
            <span className="text-xs uppercase">A &lt; B</span>
            <span className="mt-1 text-lg font-bold">
              {comparatorOutput.aLessThanB ? 'ACTIVE (1)' : '0'}
            </span>
            <span className="mt-1 text-[10px]">
              {comparatorOutput.decimalA} &lt; {comparatorOutput.decimalB}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-text-secondary border-t border-hairline pt-2">
          <span>
            Active Relation: <strong className="text-text-primary">{comparatorOutput.activeRelation}</strong>
          </span>
          <span>Unsigned 4-Bit Range [0..15]</span>
        </div>
      </div>
    </div>
  );
}
