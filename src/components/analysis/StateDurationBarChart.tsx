'use client';

import React, { useState, useEffect } from 'react';
import { useSimulator } from '@/context/SimulatorContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Clock } from 'lucide-react';

export default function StateDurationBarChart() {
  const { stateDurations } = useSimulator();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalSeconds = stateDurations.SAFE + stateDurations.WARNING + stateDurations.DANGER;

  const data = [
    {
      state: 'SAFE',
      seconds: stateDurations.SAFE,
      percentage: totalSeconds > 0 ? Math.round((stateDurations.SAFE / totalSeconds) * 100) : 0,
      color: '#16A34A',
    },
    {
      state: 'WARNING',
      seconds: stateDurations.WARNING,
      percentage: totalSeconds > 0 ? Math.round((stateDurations.WARNING / totalSeconds) * 100) : 0,
      color: '#D97706',
    },
    {
      state: 'DANGER',
      seconds: stateDurations.DANGER,
      percentage: totalSeconds > 0 ? Math.round((stateDurations.DANGER / totalSeconds) * 100) : 0,
      color: '#DC2626',
    },
  ];

  return (
    <div className="rounded-md border border-hairline bg-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-text-primary" />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              State-Duration Breakdown
            </h3>
            <p className="font-mono text-[11px] text-text-muted">
              Cumulative simulation time spent in each operational hazard state
            </p>
          </div>
        </div>
        <span className="font-mono text-xs text-text-secondary">
          Total: {totalSeconds}s Logged
        </span>
      </div>

      {/* Bar Chart Container */}
      <div className="mt-4 h-48 w-full">
        {!mounted ? (
          <div className="flex h-full items-center justify-center font-mono text-xs text-text-muted">
            Loading chart...
          </div>
        ) : totalSeconds === 0 ? (
          <div className="flex h-full items-center justify-center font-mono text-xs text-text-muted">
            Awaiting session duration...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F0F0F0" />
              <XAxis type="number" stroke="#8F8F8F" fontSize={10} tickLine={false} unit="s" />
              <YAxis dataKey="state" type="category" stroke="#171717" fontSize={11} fontStyle="bold" tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="rounded border border-hairline bg-card p-2 font-mono text-xs shadow-md">
                        <div className="font-bold text-text-primary">{d.state} State</div>
                        <div className="text-text-secondary mt-0.5">
                          Duration: {d.seconds} seconds ({d.percentage}% of session)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="seconds" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Duration Metrics Badges */}
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-hairline pt-3 text-center font-mono text-xs">
        <div className="rounded border border-emerald-200 bg-emerald-50/50 p-1.5">
          <span className="text-[10px] text-emerald-800 font-bold block">SAFE</span>
          <span className="text-sm font-semibold text-emerald-700">{stateDurations.SAFE}s</span>
          <span className="text-[10px] text-emerald-600 block">
            {totalSeconds > 0 ? Math.round((stateDurations.SAFE / totalSeconds) * 100) : 0}%
          </span>
        </div>

        <div className="rounded border border-amber-200 bg-amber-50/50 p-1.5">
          <span className="text-[10px] text-amber-800 font-bold block">WARNING</span>
          <span className="text-sm font-semibold text-amber-700">{stateDurations.WARNING}s</span>
          <span className="text-[10px] text-amber-600 block">
            {totalSeconds > 0 ? Math.round((stateDurations.WARNING / totalSeconds) * 100) : 0}%
          </span>
        </div>

        <div className="rounded border border-red-200 bg-red-50/50 p-1.5">
          <span className="text-[10px] text-red-800 font-bold block">DANGER</span>
          <span className="text-sm font-semibold text-red-700">{stateDurations.DANGER}s</span>
          <span className="text-[10px] text-red-600 block">
            {totalSeconds > 0 ? Math.round((stateDurations.DANGER / totalSeconds) * 100) : 0}%
          </span>
        </div>
      </div>
    </div>
  );
}
