'use client';

import React from 'react';
import { useSimulator } from '@/context/SimulatorContext';
import { Play, Pause, RotateCcw, Settings, Menu, ShieldAlert } from 'lucide-react';

export default function Header() {
  const {
    simulationState,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    setIsConfigModalOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    metrics,
  } = useSimulator();

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-hairline bg-card px-4 md:px-6">
      {/* Left: Branding & Mobile toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-hairline text-text-primary hover:bg-canvas md:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-text-primary text-white">
            <ShieldAlert className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm font-semibold tracking-tight text-text-primary">
                Landslide Sentinel
              </span>
              <span className="hidden rounded border border-hairline bg-canvas px-1.5 py-0.5 font-mono text-[10px] text-text-muted sm:inline-block">
                STANDALONE SIMULATOR
              </span>
            </div>
            <p className="hidden text-[11px] text-text-secondary sm:block">
              Early-Warning System Simulator
            </p>
          </div>
        </div>
      </div>

      {/* Center: System Status Pill */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-hairline bg-canvas px-2.5 py-1">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              simulationState === 'running'
                ? 'animate-pulse bg-emerald-500'
                : simulationState === 'paused'
                ? 'bg-amber-500'
                : 'bg-neutral-400'
            }`}
          />
          <span className="font-mono text-xs font-medium uppercase text-text-primary">
            {simulationState === 'running'
              ? 'SIM ACTIVE'
              : simulationState === 'paused'
              ? 'SIM PAUSED'
              : 'SIM READY'}
          </span>
          <span className="text-hairline">|</span>
          <span
            className={`font-mono text-xs font-semibold ${
              metrics.status === 'DANGER'
                ? 'text-danger'
                : metrics.status === 'WARNING'
                ? 'text-warning'
                : 'text-safe'
            }`}
          >
            {metrics.status}
          </span>
        </div>
      </div>

      {/* Right: Simulation Actions & Config Modal */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {simulationState === 'idle' ? (
          <button
            onClick={startSimulation}
            className="flex h-8 items-center gap-1.5 rounded-md bg-text-primary px-3 text-xs font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-1"
            title="Start automated scenario playback"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span className="hidden sm:inline">Start</span>
          </button>
        ) : simulationState === 'running' ? (
          <button
            onClick={pauseSimulation}
            className="flex h-8 items-center gap-1.5 rounded-md border border-hairline bg-card px-3 text-xs font-medium text-text-primary transition-colors hover:bg-canvas focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-1"
            title="Pause playback"
          >
            <Pause className="h-3.5 w-3.5 fill-current" />
            <span className="hidden sm:inline">Pause</span>
          </button>
        ) : (
          <button
            onClick={resumeSimulation}
            className="flex h-8 items-center gap-1.5 rounded-md bg-text-primary px-3 text-xs font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-1"
            title="Resume playback"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span className="hidden sm:inline">Resume</span>
          </button>
        )}

        <button
          onClick={resetSimulation}
          className="flex h-8 items-center gap-1.5 rounded-md border border-hairline bg-card px-2.5 text-xs font-medium text-text-primary transition-colors hover:bg-canvas focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-1 sm:px-3"
          title="Reset to scenario baseline"
        >
          <RotateCcw className="h-3.5 w-3.5 text-text-secondary" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <button
          onClick={() => setIsConfigModalOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-hairline bg-card text-text-secondary transition-colors hover:bg-canvas hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-1"
          title="Edit simulation parameters & thresholds"
          aria-label="Configuration settings"
        >
          <Settings className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
