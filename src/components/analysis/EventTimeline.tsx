'use client';

import React from 'react';
import { useSimulator } from '@/context/SimulatorContext';
import { TimelineEvent } from '@/types/simulator';
import {
  Clock,
  Download,
  Trash2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  FileSpreadsheet,
} from 'lucide-react';

export default function EventTimeline() {
  const { events, clearEvents, exportCSV, exportEventLogCSV } = useSimulator();

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'THRESHOLD_DANGER_CROSSED':
        return <ShieldAlert className="h-3.5 w-3.5 text-danger" />;
      case 'THRESHOLD_WARNING_CROSSED':
      case 'STATE_RETURNED_WARNING':
        return <AlertTriangle className="h-3.5 w-3.5 text-warning" />;
      case 'STATE_RETURNED_SAFE':
        return <ShieldCheck className="h-3.5 w-3.5 text-safe" />;
      case 'SIMULATION_STARTED':
      case 'SIMULATION_RESUMED':
        return <Play className="h-3.5 w-3.5 text-text-primary" />;
      case 'SIMULATION_PAUSED':
        return <Pause className="h-3.5 w-3.5 text-text-secondary" />;
      case 'SIMULATION_RESET':
        return <RotateCcw className="h-3.5 w-3.5 text-text-secondary" />;
      default:
        return <Sliders className="h-3.5 w-3.5 text-text-muted" />;
    }
  };

  return (
    <div className="rounded-md border border-hairline bg-card p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-text-primary" />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              State Transition Audit Log
            </h3>
            <p className="font-mono text-[11px] text-text-muted">
              Chronological log of threshold crossings and simulation lifecycle events
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearEvents}
            className="flex items-center gap-1.5 rounded-md border border-hairline bg-card px-2.5 py-1 text-xs font-medium text-text-secondary hover:bg-canvas hover:text-text-primary"
            title="Clear event log"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
          <button
            onClick={exportEventLogCSV}
            className="flex items-center gap-1.5 rounded-md border border-hairline bg-card px-3 py-1 text-xs font-medium text-text-primary hover:bg-canvas"
            title="Export event log to CSV"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Events CSV
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-md bg-text-primary px-3 py-1 text-xs font-medium text-white hover:bg-neutral-800"
            title="Export full telemetry time-series to CSV"
          >
            <Download className="h-3.5 w-3.5" />
            Telemetry CSV
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="mt-4 max-h-96 overflow-y-auto pr-1">
        {events.length === 0 ? (
          <div className="py-8 text-center font-mono text-xs text-text-muted">
            No state transitions logged in current session.
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="flex items-start gap-3 rounded-md border border-hairline bg-canvas p-2.5 transition-colors hover:bg-neutral-100/50"
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-hairline bg-card">
                  {getEventIcon(evt.type)}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="font-mono text-xs font-semibold text-text-primary">
                      {evt.type.replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono text-[11px] text-text-muted">
                      {evt.timeString}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-text-body">{evt.message}</p>
                </div>

                <div className="shrink-0 text-right font-mono text-xs">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      evt.status === 'DANGER'
                        ? 'bg-danger-bg text-danger border border-danger-border'
                        : evt.status === 'WARNING'
                        ? 'bg-warning-bg text-warning border border-warning-border'
                        : 'bg-safe-bg text-safe border border-safe-border'
                    }`}
                  >
                    {evt.status} ({evt.riskValue}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-hairline pt-2 font-mono text-[11px] text-text-muted">
        <span>Total Events: {events.length}</span>
        <span>Includes transitions between Safe, Warning, and Danger</span>
      </div>
    </div>
  );
}
