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
  Legend,
  ReferenceLine,
} from 'recharts';
import { LineChart as ChartIcon, Download, RefreshCw } from 'lucide-react';

export default function RiskTimeSeriesChart() {
  const { telemetryHistory, config, exportCSV } = useSimulator();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format chart data points
  const chartData = telemetryHistory.map((point) => ({
    time: point.timeString,
    totalRisk: point.totalRisk,
    soilContribution: Math.round(config.soilWeight * point.soilRisk * 10) / 10,
    movementContribution: Math.round(config.movementWeight * point.movementRisk * 10) / 10,
    soilRisk: point.soilRisk,
    movementRisk: point.movementRisk,
    status: point.status,
  }));

  return (
    <div className="rounded-md border border-hairline bg-card p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <ChartIcon className="h-4 w-4 text-text-primary" />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              Real-Time Instability Telemetry Stream
            </h3>
            <p className="font-mono text-[11px] text-text-muted">
              Live time-series data populated directly from the calculation engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-text-muted">
            {telemetryHistory.length} Samples Cached
          </span>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-md border border-hairline bg-card px-2.5 py-1 text-xs font-medium text-text-primary hover:bg-canvas"
            title="Download complete telemetry history in CSV format"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="mt-4 h-72 w-full">
        {!mounted ? (
          <div className="flex h-full items-center justify-center font-mono text-xs text-text-muted">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Loading Telemetry Visualizer...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center font-mono text-xs text-text-muted">
            Awaiting simulation telemetry data points...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#8F8F8F"
                fontSize={10}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                stroke="#8F8F8F"
                fontSize={10}
                tickLine={false}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded border border-hairline bg-card p-2.5 font-mono text-xs shadow-md">
                        <div className="font-semibold text-text-primary mb-1">{label}</div>
                        <div className="space-y-0.5 text-[11px]">
                          <div className="text-text-primary font-bold">
                            Total Risk: {data.totalRisk}% ({data.status})
                          </div>
                          <div className="text-blue-600">
                            Soil Contribution: +{data.soilContribution} pts (Raw: {data.soilRisk}%)
                          </div>
                          <div className="text-amber-600">
                            Movement Contribution: +{data.movementContribution} pts (Raw:{' '}
                            {data.movementRisk}%)
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }}
              />

              {/* Threshold Lines */}
              <ReferenceLine
                y={config.warningThreshold}
                stroke="#D97706"
                strokeDasharray="4 4"
                label={{
                  value: `WARNING (${config.warningThreshold}%)`,
                  fill: '#D97706',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
              <ReferenceLine
                y={config.dangerThreshold}
                stroke="#DC2626"
                strokeDasharray="4 4"
                label={{
                  value: `DANGER (${config.dangerThreshold}%)`,
                  fill: '#DC2626',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />

              {/* Data Series */}
              <Line
                type="monotone"
                dataKey="totalRisk"
                name="Total Risk Score"
                stroke="#171717"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="soilContribution"
                name="Soil Risk Contribution"
                stroke="#2563EB"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="movementContribution"
                name="Movement Risk Contribution"
                stroke="#D97706"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer Notes */}
      <div className="mt-3 flex items-center justify-between border-t border-hairline pt-2 font-mono text-[11px] text-text-muted">
        <span>Sampling interval: 1.0 s</span>
        <span>Linear interpolation during automated scenario playback</span>
      </div>
    </div>
  );
}
