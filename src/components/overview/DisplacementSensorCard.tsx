'use client';

import React from 'react';
import { useSimulator } from '@/context/SimulatorContext';
import { Activity, ArrowRight } from 'lucide-react';

export default function DisplacementSensorCard() {
  const { sensors, setCurrentDistance, metrics, config, setActiveTab } = useSimulator();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDistance(Number(e.target.value));
  };

  const riskContribution = Math.round(config.movementWeight * metrics.movementRisk * 10) / 10;
  const markerYOffset = Math.min(
    65,
    Math.max(10, 10 + (metrics.displacement / config.maxDisplacementRange) * 55)
  );

  return (
    <div className="rounded-md border border-hairline bg-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline pb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-amber-600" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            Ground Movement (Ultrasonic)
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
              {metrics.displacement.toFixed(1)} cm
            </span>
            <span className="text-xs text-text-muted">Displacement</span>
          </div>
          <p className="mt-0.5 text-xs text-text-secondary">
            Movement Risk: <strong className="font-mono text-text-primary">{metrics.movementRisk} / 100</strong>
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-text-muted">Total Contribution:</span>
          <p className="font-mono text-base font-semibold text-text-primary">
            +{riskContribution} pts
          </p>
          <span className="font-mono text-[10px] text-text-muted">
            ({Math.round(config.movementWeight * 100)}% Weight)
          </span>
        </div>
      </div>

      {/* Compact Visual SVG */}
      <div className="mt-3 rounded border border-hairline bg-canvas p-2">
        <svg
          viewBox="0 0 280 80"
          className="w-full h-20 overflow-visible"
          role="img"
          aria-label="Illustration of ultrasonic sensor measuring ground displacement"
        >
          {/* Ultrasonic Sensor Head */}
          <rect x="120" y="4" width="40" height="14" rx="2" fill="#171717" />
          <circle cx="130" cy="11" r="3" fill="#EBEBEB" />
          <circle cx="150" cy="11" r="3" fill="#EBEBEB" />

          {/* Acoustic waves */}
          <path d="M 128 22 A 12 12 0 0 0 152 22" fill="none" stroke="#2563EB" strokeWidth="1.2" strokeDasharray="2 2" />
          <path d="M 124 30 A 18 18 0 0 0 156 30" fill="none" stroke="#2563EB" strokeWidth="1.2" strokeDasharray="2 2" />

          {/* Reference Baseline */}
          <line x1="30" y1="36" x2="250" y2="36" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 2" />

          {/* Movable Ground Marker */}
          <g transform={`translate(0, ${markerYOffset})`}>
            <rect x="50" y="14" width="180" height="8" rx="2" fill={metrics.displacement > 0 ? '#171717' : '#6B7280'} />
            <path d="M 60 22 L 68 30 M 90 22 L 98 30 M 120 22 L 128 30 M 150 22 L 158 30 M 180 22 L 188 30 M 210 22 L 218 30" stroke="#CBD5E1" strokeWidth="1" />
          </g>

          <text x="140" y="74" textAnchor="middle" fill="#6B7280" fontSize="8" fontFamily="monospace">
            Ref: {config.referenceDistance} cm | Current: {sensors.currentDistance.toFixed(1)} cm
          </text>
        </svg>
      </div>

      {/* Quick Adjustment Slider */}
      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-text-body">
          <span>Quick Distance Slider:</span>
          <span className="font-mono font-semibold text-text-primary">
            {sensors.currentDistance.toFixed(1)} cm (Δd: {metrics.displacement.toFixed(1)} cm)
          </span>
        </div>

        <input
          type="range"
          min="50"
          max="180"
          step="0.5"
          value={sensors.currentDistance}
          onChange={handleSliderChange}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200 accent-text-primary focus:outline-none"
          aria-label="Adjust current ultrasonic distance"
        />
      </div>
    </div>
  );
}
