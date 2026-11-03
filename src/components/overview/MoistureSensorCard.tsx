'use client';

import React from 'react';
import { useSimulator } from '@/context/SimulatorContext';
import { Droplets, ArrowRight } from 'lucide-react';

export default function MoistureSensorCard() {
  const { sensors, setSoilMoisture, metrics, config, setActiveTab } = useSimulator();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSoilMoisture(Number(e.target.value));
  };

  const riskContribution = Math.round(config.soilWeight * metrics.soilRisk * 10) / 10;

  return (
    <div className="rounded-md border border-hairline bg-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline pb-2.5">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-blue-600" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            Soil Moisture Sensor
          </h3>
        </div>
        <button
          onClick={() => setActiveTab('simulator')}
          className="flex items-center gap-1 font-mono text-[11px] text-text-secondary hover:text-text-primary hover:underline"
          title="Open advanced simulator controls"
        >
          Open Simulator <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Main Stats */}
      <div className="mt-3 flex items-baseline justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-semibold tracking-tight text-text-primary">
              {sensors.soilMoisture.toFixed(1)}%
            </span>
            <span className="text-xs text-text-muted">Saturation</span>
          </div>
          <p className="mt-0.5 text-xs text-text-secondary">
            Soil Risk Score: <strong className="font-mono text-text-primary">{metrics.soilRisk} / 100</strong>
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-text-muted">Total Contribution:</span>
          <p className="font-mono text-base font-semibold text-text-primary">
            +{riskContribution} pts
          </p>
          <span className="font-mono text-[10px] text-text-muted">
            ({Math.round(config.soilWeight * 100)}% Weight)
          </span>
        </div>
      </div>

      {/* Quick Adjustment Slider */}
      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-text-body">
          <span>Quick Slider:</span>
          <span className="font-mono font-semibold text-text-primary">
            {sensors.soilMoisture.toFixed(0)}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={sensors.soilMoisture}
          onChange={handleSliderChange}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200 accent-text-primary focus:outline-none"
          aria-label="Adjust soil moisture percentage"
        />

        <div className="flex justify-between font-mono text-[10px] text-text-muted">
          <span>0% (Dry)</span>
          <span>50% (Saturated)</span>
          <span>100% (Liquefied)</span>
        </div>
      </div>
    </div>
  );
}
