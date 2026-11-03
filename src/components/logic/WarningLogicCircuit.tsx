'use client';

import React, { useState } from 'react';
import { useSimulator } from '@/context/SimulatorContext';
import { Cpu, Info, CheckCircle2, XCircle } from 'lucide-react';

export default function WarningLogicCircuit() {
  const { metrics, config } = useSimulator();
  const [notSource, setNotSource] = useState<'soil' | 'movement'>('soil');

  const soilWarn = metrics.soilWarningActive;
  const moveWarn = metrics.movementWarningActive;

  const orResult = soilWarn || moveWarn;
  const andResult = soilWarn && moveWarn;
  const notSelectedInput = notSource === 'soil' ? soilWarn : moveWarn;
  const notResult = !notSelectedInput;

  return (
    <div className="rounded-md border border-hairline bg-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            Warning Logic Gate Interconnect
          </h3>
        </div>
        <span className="font-mono text-[10px] text-text-muted">
          HARDWARE COMBINATIONAL LOGIC
        </span>
      </div>

      {/* Inputs Overview */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Soil Warning Input */}
        <div className="rounded-md border border-hairline bg-canvas p-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Input A: Soil Warning</span>
            <span
              className={`flex items-center gap-1 font-semibold ${
                soilWarn ? 'text-amber-600' : 'text-neutral-500'
              }`}
            >
              {soilWarn ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
              {soilWarn ? '1 (ACTIVE)' : '0 (INACTIVE)'}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-text-muted">
            Condition: Soil Risk ({metrics.soilRisk}%) &ge; Warning Threshold ({config.warningThreshold}%)
          </div>
        </div>

        {/* Movement Warning Input */}
        <div className="rounded-md border border-hairline bg-canvas p-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Input B: Movement Warning</span>
            <span
              className={`flex items-center gap-1 font-semibold ${
                moveWarn ? 'text-amber-600' : 'text-neutral-500'
              }`}
            >
              {moveWarn ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
              {moveWarn ? '1 (ACTIVE)' : '0 (INACTIVE)'}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-text-muted">
            Condition: Movement Risk ({metrics.movementRisk}%) &ge; Warning Threshold ({config.warningThreshold}%)
          </div>
        </div>
      </div>

      {/* Logic Gates Interconnect Table / Visual Cards */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* OR Output */}
        <div className="rounded-md border border-hairline bg-card p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-text-primary">OR Gate (A || B)</span>
            <span
              className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                orResult
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {orResult ? '1 (HIGH)' : '0 (LOW)'}
            </span>
          </div>
          <p className="mt-2 text-xs text-text-body">
            Active if <strong>any</strong> individual parameter exceeds threshold. Primary trigger for hazard alerts.
          </p>
          <div className="mt-2 font-mono text-[10px] text-text-muted border-t border-hairline pt-1.5">
            Calculation: {soilWarn ? '1' : '0'} OR {moveWarn ? '1' : '0'} = {orResult ? '1' : '0'}
          </div>
        </div>

        {/* AND Output */}
        <div className="rounded-md border border-hairline bg-card p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-text-primary">AND Gate (A && B)</span>
            <span
              className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                andResult
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {andResult ? '1 (HIGH)' : '0 (LOW)'}
            </span>
          </div>
          <p className="mt-2 text-xs text-text-body">
            Active only if <strong>both</strong> soil and movement simultaneously breach warning criteria.
          </p>
          <div className="mt-2 font-mono text-[10px] text-text-muted border-t border-hairline pt-1.5">
            Calculation: {soilWarn ? '1' : '0'} AND {moveWarn ? '1' : '0'} = {andResult ? '1' : '0'}
          </div>
        </div>

        {/* NOT Output */}
        <div className="rounded-md border border-hairline bg-card p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-text-primary">NOT Gate (!Selected)</span>
            <span
              className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                notResult
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {notResult ? '1 (HIGH)' : '0 (LOW)'}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 font-mono text-[10px] text-text-secondary">
            <span>Invert Source:</span>
            <select
              value={notSource}
              onChange={(e) => setNotSource(e.target.value as 'soil' | 'movement')}
              className="rounded border border-hairline bg-canvas px-1 py-0.5 font-mono text-[10px] text-text-primary focus:outline-none"
            >
              <option value="soil">Soil Warning (A)</option>
              <option value="movement">Movement Warning (B)</option>
            </select>
          </div>
          <div className="mt-2 font-mono text-[10px] text-text-muted border-t border-hairline pt-1.5">
            Calculation: NOT({notSelectedInput ? '1' : '0'}) = {notResult ? '1' : '0'}
          </div>
        </div>
      </div>

      {/* Architectural Distinction Explanation Note */}
      <div className="mt-4 rounded-md border border-hairline bg-canvas p-3.5">
        <div className="flex items-start gap-2.5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary" />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-primary">
              Distinction: Logic Gates vs. Weighted-Risk Comparator
            </p>
            <p className="text-xs leading-relaxed text-text-body">
              <strong>Logic gates</strong> perform independent Boolean decisions (e.g., Soil &ge; {config.warningThreshold}% OR Movement &ge; {config.warningThreshold}%), representing discrete hardware safety interlocks. In contrast, the <strong>Weighted-Risk Comparator</strong> performs continuous linear superposition ({Math.round(config.soilWeight * 100)}% Soil + {Math.round(config.movementWeight * 100)}% Movement) to produce a composite hazard score and classify multi-tier stability states (SAFE, WARNING, DANGER).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
