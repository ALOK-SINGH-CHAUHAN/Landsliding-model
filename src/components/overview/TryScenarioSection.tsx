'use client';

import React from 'react';
import { useSimulator, SCENARIO_PRESETS } from '@/context/SimulatorContext';
import { ScenarioPresetId } from '@/types/simulator';
import { Play, ArrowRight, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function TryScenarioSection() {
  const { selectScenario, startSimulation, setActiveTab } = useSimulator();

  const handleLaunchScenario = (presetId: ScenarioPresetId) => {
    selectScenario(presetId);
    setActiveTab('simulator');
    setTimeout(() => {
      startSimulation();
    }, 100);
  };

  return (
    <div className="rounded-md border border-hairline bg-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline pb-2.5">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            Try a Scenario
          </h3>
          <p className="text-xs text-text-muted">
            Launch automated demonstrations that progress through Safe, Warning, and Danger states
          </p>
        </div>
        <button
          onClick={() => setActiveTab('simulator')}
          className="flex items-center gap-1 font-mono text-[11px] text-text-secondary hover:text-text-primary hover:underline"
        >
          View Workspace <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Grid of 4 presets */}
      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {SCENARIO_PRESETS.map((preset) => (
          <div
            key={preset.id}
            className="flex flex-col justify-between rounded-md border border-hairline bg-canvas p-3 transition-colors hover:border-neutral-400"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-text-primary">
                  {preset.shortTitle}
                </span>
                <span className="font-mono text-[10px] text-text-muted">
                  {preset.durationSeconds}s
                </span>
              </div>
              <p className="mt-1 text-[11px] text-text-secondary leading-snug line-clamp-2">
                {preset.description}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-hairline pt-2">
              <span className="font-mono text-[10px] text-text-muted">
                Safe &rarr; Warn &rarr; Danger
              </span>
              <button
                onClick={() => handleLaunchScenario(preset.id)}
                className="flex items-center gap-1 rounded bg-text-primary px-2 py-1 font-mono text-[11px] font-medium text-white hover:bg-neutral-800"
              >
                <Play className="h-2.5 w-2.5 fill-current" /> Run
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
