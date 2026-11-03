'use client';

import React, { useState, useEffect } from 'react';
import { useSimulator } from '@/context/SimulatorContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { LineChart as ChartIcon, ArrowRight } from 'lucide-react';

export default function OverviewMiniChart() {
  const { telemetryHistory, config, setActiveTab } = useSimulator();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = telemetryHistory.map((point) => ({
    time: point.timeString,
    totalRisk: point.totalRisk,
    soilRisk: point.soilRisk,
    movementRisk: point.movementRisk,
    status: point.status,
  }));

  return (
    <div className="rounded-md border border-hairline bg-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline pb-2.5">
        <div className="flex items-center gap-2">
          <ChartIcon className="h-4 w-4 text-text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            Risk Score Over Time
          </h3>
        </div>

        <button
          onClick={() => setActiveTab('analysis')}
          className="flex items-center gap-1 font-mono text-[11px] text-text-secondary hover:text-text-primary hover:underline"
          title="Open complete multi-series risk analytics"
        >
          Detailed Analysis <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Mini Chart */}
      <div className="mt-3 h-44 w-full">
        {!mounted ? (
          <div className="flex h-full items-center justify-center font-mono text-xs text-text-muted">
            Initializing chart...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center font-mono text-xs text-text-muted">
            Recording simulation data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="time" stroke="#8F8F8F" fontSize={9} tickLine={false} interval="preserveStartEnd" />
              <YAxis domain={[0, 100]} stroke="#8F8F8F" fontSize={9} tickLine={false} ticks={[0, 35, 70, 100]} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded border border-hairline bg-card p-2 font-mono text-[11px] shadow-sm">
                        <div className="font-semibold text-text-primary">{label}</div>
                        <div className="mt-0.5 text-text-primary font-bold">
                          Risk: {data.totalRisk}% ({data.status})
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={config.warningThreshold} stroke="#D97706" strokeDasharray="3 3" />
              <ReferenceLine y={config.dangerThreshold} stroke="#DC2626" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="totalRisk"
                stroke="#171717"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-text-muted border-t border-hairline pt-1.5">
        <span>Orange line: Warning ({config.warningThreshold}%) | Red line: Danger ({config.dangerThreshold}%)</span>
        <span>Live sampling</span>
      </div>
    </div>
  );
}
