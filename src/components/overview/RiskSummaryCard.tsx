'use client';

import React, { useState, useEffect } from 'react';
import { useSimulator } from '@/context/SimulatorContext';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
} from 'lucide-react';

export default function RiskSummaryCard() {
  const { metrics, config, riskTrend } = useSimulator();
  const [blinkPhase, setBlinkPhase] = useState(true);

  // Non-blocking timer for blinking LEDs based on configurable blink interval
  useEffect(() => {
    if (metrics.status === 'SAFE') {
      setBlinkPhase(true);
      return;
    }

    const intervalTime =
      metrics.status === 'DANGER'
        ? Math.max(100, Math.round(config.ledBlinkInterval * 0.55)) // rapid flash for danger
        : config.ledBlinkInterval; // standard flash for warning

    const timer = setInterval(() => {
      setBlinkPhase((prev) => !prev);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [metrics.status, config.ledBlinkInterval]);

  const isGreenLit = metrics.status === 'SAFE';
  const isYellowLit = metrics.status === 'WARNING' && blinkPhase;
  const isRedLit = metrics.status === 'DANGER' && blinkPhase;

  const getStatusBadge = () => {
    switch (metrics.status) {
      case 'DANGER':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-danger-border bg-danger-bg px-3 py-1 font-mono text-xs font-semibold text-danger">
            <ShieldAlert className="h-4 w-4" />
            DANGER STATE
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-warning-border bg-warning-bg px-3 py-1 font-mono text-xs font-semibold text-warning">
            <AlertTriangle className="h-4 w-4" />
            WARNING ADVISORY
          </span>
        );
      case 'SAFE':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-safe-border bg-safe-bg px-3 py-1 font-mono text-xs font-semibold text-safe">
            <ShieldCheck className="h-4 w-4" />
            SAFE (STABLE)
          </span>
        );
    }
  };

  const getTrendBadge = () => {
    if (riskTrend === 'RISING') {
      return (
        <span className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2 py-0.5 font-mono text-xs font-medium text-red-700">
          <TrendingUp className="h-3.5 w-3.5" />
          Risk Rising
        </span>
      );
    }
    if (riskTrend === 'FALLING') {
      return (
        <span className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-xs font-medium text-emerald-700">
          <TrendingDown className="h-3.5 w-3.5" />
          Risk Falling
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded border border-hairline bg-canvas px-2 py-0.5 font-mono text-xs font-medium text-text-secondary">
        <Minus className="h-3.5 w-3.5" />
        Risk Stable
      </span>
    );
  };

  return (
    <div className="rounded-md border border-hairline bg-card p-5">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
              LIVE MONITORING STATION
            </span>
            <span className="rounded border border-hairline bg-canvas px-1.5 py-0.2 font-mono text-[10px] text-text-muted">
              EARLY-WARNING SYSTEM
            </span>
          </div>
          <h1 className="mt-0.5 text-base font-semibold text-text-primary">
            Slope Instability & Hazard Risk Score
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          {getTrendBadge()}
          {getStatusBadge()}
        </div>
      </div>

      {/* Main Score & LEDs Bar */}
      <div className="mt-5 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
        {/* Left: Large Score */}
        <div className="lg:col-span-4">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-6xl font-semibold tracking-tight text-text-primary">
              {metrics.totalRisk}
            </span>
            <span className="font-mono text-2xl text-text-muted">/ 100</span>
          </div>
          <p className="mt-1 text-xs text-text-secondary">
            {metrics.primaryContributor}
          </p>
        </div>

        {/* Center: Gauge and Thresholds */}
        <div className="space-y-3 lg:col-span-5">
          <div className="flex items-center justify-between font-mono text-xs text-text-muted">
            <span>0</span>
            <span className="text-emerald-700">SAFE (&lt; {config.warningThreshold})</span>
            <span className="text-amber-700">WARNING ({config.warningThreshold}–{config.dangerThreshold - 1})</span>
            <span className="text-red-700">DANGER ({config.dangerThreshold}+)</span>
            <span>100</span>
          </div>

          {/* Segmented Risk Gauge */}
          <div className="relative h-3.5 w-full overflow-hidden rounded-full border border-hairline bg-canvas">
            <div className="absolute inset-0 flex">
              <div
                style={{ width: `${config.warningThreshold}%` }}
                className="h-full bg-emerald-500/15"
                title="Safe Zone"
              />
              <div
                style={{ width: `${config.dangerThreshold - config.warningThreshold}%` }}
                className="h-full bg-amber-500/15"
                title="Warning Zone"
              />
              <div
                style={{ width: `${100 - config.dangerThreshold}%` }}
                className="h-full bg-red-500/15"
                title="Danger Zone"
              />
            </div>

            {/* Threshold Ticks */}
            <div
              className="absolute top-0 bottom-0 z-10 w-0.5 bg-neutral-400"
              style={{ left: `${config.warningThreshold}%` }}
            />
            <div
              className="absolute top-0 bottom-0 z-10 w-0.5 bg-neutral-400"
              style={{ left: `${config.dangerThreshold}%` }}
            />

            {/* Progress Bar Fill */}
            <div
              className={`h-full transition-all duration-300 ${
                metrics.status === 'DANGER'
                  ? 'bg-danger'
                  : metrics.status === 'WARNING'
                  ? 'bg-warning'
                  : 'bg-safe'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, metrics.totalRisk))}%` }}
            />
          </div>

          <div className="flex justify-between font-mono text-[11px] text-text-secondary">
            <span>Current: <strong className="text-text-primary">{metrics.totalRisk}%</strong></span>
            <span>Thresholds: Warning {config.warningThreshold}% | Danger {config.dangerThreshold}%</span>
          </div>
        </div>

        {/* Right: Simulated Physical LEDs Tray */}
        <div className="rounded-md border border-hairline bg-neutral-900 p-3.5 text-white shadow-inner lg:col-span-3">
          <div className="text-center font-mono text-[10px] uppercase tracking-wider text-neutral-400 mb-2">
            PHYSICAL-STYLE ALARM LEDS
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* GREEN */}
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-neutral-950 p-1.5 shadow-inner">
                <div
                  className={`h-6 w-6 rounded-full border transition-all duration-150 ${
                    isGreenLit
                      ? 'border-emerald-300 bg-emerald-500 shadow-[0_0_12px_3px_rgba(16,185,129,0.9)]'
                      : 'border-neutral-800 bg-neutral-900 opacity-25'
                  }`}
                />
              </div>
              <span className="mt-1 font-mono text-[10px] font-bold text-emerald-400">SAFE</span>
              <span className="font-mono text-[9px] text-neutral-400">
                {metrics.status === 'SAFE' ? 'STEADY' : 'OFF'}
              </span>
            </div>

            {/* YELLOW */}
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-neutral-950 p-1.5 shadow-inner">
                <div
                  className={`h-6 w-6 rounded-full border transition-all duration-150 ${
                    isYellowLit
                      ? 'border-amber-300 bg-amber-500 shadow-[0_0_12px_3px_rgba(245,158,11,0.9)]'
                      : 'border-neutral-800 bg-neutral-900 opacity-25'
                  }`}
                />
              </div>
              <span className="mt-1 font-mono text-[10px] font-bold text-amber-400">WARN</span>
              <span className="font-mono text-[9px] text-neutral-400">
                {metrics.status === 'WARNING' ? 'BLINK' : 'OFF'}
              </span>
            </div>

            {/* RED */}
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-neutral-950 p-1.5 shadow-inner">
                <div
                  className={`h-6 w-6 rounded-full border transition-all duration-150 ${
                    isRedLit
                      ? 'border-red-300 bg-red-600 shadow-[0_0_14px_4px_rgba(239,68,68,0.95)]'
                      : 'border-neutral-800 bg-neutral-900 opacity-25'
                  }`}
                />
              </div>
              <span className="mt-1 font-mono text-[10px] font-bold text-red-400">DANGER</span>
              <span className="font-mono text-[9px] text-neutral-400">
                {metrics.status === 'DANGER' ? 'FLASH' : 'OFF'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Plain Language Status Explanation */}
      <div className="mt-4 rounded-md border border-hairline bg-canvas p-3">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-card font-mono text-[10px] font-semibold text-text-primary border border-hairline">
            i
          </div>
          <div>
            <p className="text-xs font-medium text-text-primary">Current System Condition</p>
            <p className="mt-0.5 text-xs text-text-body leading-relaxed">
              {metrics.statusExplanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
