'use client';

import React from 'react';
import { useSimulator, SCENARIO_PRESETS } from '@/context/SimulatorContext';
import { ScenarioPresetId } from '@/types/simulator';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Sliders,
  PlayCircle,
  Check,
  Droplets,
  Ruler,
  Info,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';

export default function SensorSimulatorWorkspace() {
  const {
    simulatorMode,
    setSimulatorMode,
    simulationState,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    replayScenario,
    playbackSpeed,
    setPlaybackSpeed,
    scenarioProgress,
    currentPhaseName,
    activeScenarioId,
    selectScenario,
    sensors,
    setSoilMoisture,
    setCurrentDistance,
    setReferenceDistance,
    metrics,
    config,
    updateConfig,
  } = useSimulator();

  const handleMaxRangeChange = (val: number) => {
    if (val > 0) {
      updateConfig({ maxDisplacementRange: val });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DANGER':
        return <ShieldAlert className="h-4 w-4 text-danger" />;
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'SAFE':
      default:
        return <ShieldCheck className="h-4 w-4 text-safe" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Workspace Master Panel */}
      <div className="rounded-md border border-hairline bg-card p-5">
        {/* Top Bar with Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
                SIMULATION WORKSPACE
              </span>
              <span className="rounded border border-hairline bg-canvas px-1.5 py-0.2 font-mono text-[10px] text-text-muted">
                {simulatorMode === 'scenario' ? 'SCENARIO PLAYBACK' : 'MANUAL CONTROLS'}
              </span>
            </div>
            <h2 className="mt-0.5 text-base font-semibold text-text-primary">
              Sensor Dynamics & Scenario Execution
            </h2>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex rounded-md border border-hairline bg-canvas p-1">
            <button
              onClick={() => setSimulatorMode('scenario')}
              className={`flex items-center gap-1.5 rounded px-3 py-1 text-xs font-medium transition-all ${
                simulatorMode === 'scenario'
                  ? 'bg-card font-semibold text-text-primary shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <PlayCircle className="h-3.5 w-3.5" />
              Scenario Playback Mode
            </button>
            <button
              onClick={() => {
                if (simulationState === 'running') pauseSimulation();
                setSimulatorMode('manual');
              }}
              className={`flex items-center gap-1.5 rounded px-3 py-1 text-xs font-medium transition-all ${
                simulatorMode === 'manual'
                  ? 'bg-card font-semibold text-text-primary shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              Manual Controls Mode
            </button>
          </div>
        </div>

        {/* ---------------- MODE 1: SCENARIO PLAYBACK ---------------- */}
        {simulatorMode === 'scenario' && (
          <div className="mt-5 space-y-5">
            {/* Playback Controls Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-hairline bg-canvas p-3.5">
              {/* Play/Pause/Replay/Reset */}
              <div className="flex items-center gap-2">
                {simulationState === 'idle' ? (
                  <button
                    onClick={startSimulation}
                    className="flex items-center gap-2 rounded-md bg-text-primary px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Start Scenario
                  </button>
                ) : simulationState === 'running' ? (
                  <button
                    onClick={pauseSimulation}
                    className="flex items-center gap-2 rounded-md border border-hairline bg-card px-4 py-2 text-xs font-medium text-text-primary hover:bg-canvas"
                  >
                    <Pause className="h-4 w-4 fill-current" />
                    Pause Playback
                  </button>
                ) : (
                  <button
                    onClick={resumeSimulation}
                    className="flex items-center gap-2 rounded-md bg-text-primary px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Resume
                  </button>
                )}

                <button
                  onClick={replayScenario}
                  className="flex items-center gap-1.5 rounded-md border border-hairline bg-card px-3 py-2 text-xs font-medium text-text-secondary hover:bg-canvas hover:text-text-primary"
                  title="Restart scenario from 0%"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  Replay
                </button>

                <button
                  onClick={resetSimulation}
                  className="flex items-center gap-1.5 rounded-md border border-hairline bg-card px-3 py-2 text-xs font-medium text-text-secondary hover:bg-canvas hover:text-text-primary"
                  title="Reset to scenario starting position"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>

              {/* Speed Selector */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-text-secondary">Speed:</span>
                <div className="inline-flex rounded-md border border-hairline bg-card p-0.5">
                  {[0.5, 1, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`rounded px-2.5 py-1 font-mono text-xs transition-colors ${
                        playbackSpeed === spd
                          ? 'bg-text-primary font-bold text-white'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline Progress Bar & Current Phase Notice */}
            <div className="space-y-2 rounded-md border border-hairline bg-canvas p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-1 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text-primary">Timeline:</span>
                  <span className="text-blue-700 font-medium">{currentPhaseName}</span>
                </div>
                <div className="text-text-secondary">
                  Progress: <strong className="text-text-primary">{scenarioProgress.toFixed(0)}%</strong>
                </div>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full border border-hairline bg-card">
                <div
                  className="h-full bg-text-primary transition-all duration-75"
                  style={{ width: `${scenarioProgress}%` }}
                />
              </div>

              <div className="flex justify-between font-mono text-[10px] text-text-muted pt-0.5">
                <span>0% (Safe Baseline)</span>
                <span>40% (Warning)</span>
                <span>65% (Danger Peak)</span>
                <span>85% (Recovery)</span>
                <span>100% (Safe)</span>
              </div>
            </div>

            {/* Scenario Selection Grid (4 Deterministic Presets) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-xs text-text-secondary">
                <span>SELECT DETERMINISTIC PRESET:</span>
                <span className="text-[11px] text-text-muted">
                  Guaranteed to demonstrate SAFE &rarr; WARNING &rarr; DANGER &rarr; SAFE
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {SCENARIO_PRESETS.map((preset) => {
                  const isSelected = activeScenarioId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => selectScenario(preset.id as ScenarioPresetId)}
                      className={`flex flex-col justify-between rounded-md border p-3.5 text-left transition-all ${
                        isSelected
                          ? 'border-text-primary bg-canvas shadow-xs ring-1 ring-text-primary'
                          : 'border-hairline bg-card hover:border-neutral-400 hover:bg-canvas'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-semibold text-text-primary">
                            {preset.name}
                          </span>
                          {isSelected && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-text-primary text-white">
                              <Check className="h-2.5 w-2.5" />
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-xs leading-relaxed text-text-body">
                          {preset.description}
                        </p>
                      </div>

                      <div className="mt-3 border-t border-hairline pt-2 font-mono text-[10px] text-text-muted">
                        <span>Duration: {preset.durationSeconds}s</span> &bull;{' '}
                        <span className="text-text-secondary">Cycles all 3 states</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- MODE 2: MANUAL CONTROLS ---------------- */}
        {simulatorMode === 'manual' && (
          <div className="mt-5 space-y-5">
            <div className="rounded-md border border-hairline bg-canvas p-3 font-mono text-xs text-text-secondary">
              <strong>Manual Controls Mode Active:</strong> Drag sliders or enter values to naturally test any condition. All risk calculations, indicators, and charts update immediately.
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Soil Moisture Manual Controls */}
              <div className="space-y-3 rounded-md border border-hairline bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-text-primary">
                    <Droplets className="h-4 w-4 text-blue-600" />
                    SOIL MOISTURE SENSOR
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={sensors.soilMoisture}
                      onChange={(e) => setSoilMoisture(Number(e.target.value))}
                      className="w-16 rounded border border-hairline bg-canvas px-2 py-0.5 text-right font-mono text-xs text-text-primary focus:border-text-primary focus:outline-none"
                    />
                    <span className="font-mono text-xs text-text-muted">%</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={sensors.soilMoisture}
                  onChange={(e) => setSoilMoisture(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded bg-neutral-200 accent-text-primary"
                  aria-label="Soil moisture percentage"
                />

                <div className="flex justify-between font-mono text-[10px] text-text-muted">
                  <span>0% (Dry)</span>
                  <span>50% (Saturated)</span>
                  <span>100% (Liquefied)</span>
                </div>

                <div className="flex items-center justify-between border-t border-hairline pt-2 font-mono text-xs">
                  <span className="text-text-secondary">Normalized Soil Risk:</span>
                  <span className="font-semibold text-text-primary">{metrics.soilRisk} / 100</span>
                </div>
              </div>

              {/* Ultrasonic Distance Manual Controls */}
              <div className="space-y-3 rounded-md border border-hairline bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-text-primary">
                    <Ruler className="h-4 w-4 text-amber-600" />
                    ULTRASONIC GROUND DISPLACEMENT
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="50"
                      max="180"
                      step="0.5"
                      value={sensors.currentDistance}
                      onChange={(e) => setCurrentDistance(Number(e.target.value))}
                      className="w-16 rounded border border-hairline bg-canvas px-2 py-0.5 text-right font-mono text-xs text-text-primary focus:border-text-primary focus:outline-none"
                    />
                    <span className="font-mono text-xs text-text-muted">cm</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="50"
                  max="180"
                  step="0.5"
                  value={sensors.currentDistance}
                  onChange={(e) => setCurrentDistance(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded bg-neutral-200 accent-text-primary"
                  aria-label="Current distance in centimeters"
                />

                <div className="flex justify-between font-mono text-[10px] text-text-muted">
                  <span>50 cm (Lift)</span>
                  <span>100 cm (Reference Baseline)</span>
                  <span>180 cm (Subsidence)</span>
                </div>

                <div className="flex items-center justify-between border-t border-hairline pt-2 font-mono text-xs">
                  <span className="text-text-secondary">Calculated Displacement:</span>
                  <span className="font-semibold text-text-primary">{metrics.displacement.toFixed(1)} cm</span>
                </div>
              </div>
            </div>

            {/* Calibration Constants (Reference Distance & Max Range) */}
            <div className="rounded-md border border-hairline bg-canvas p-4 space-y-3">
              <span className="font-mono text-xs font-semibold text-text-secondary uppercase">
                Hardware Calibration Parameters:
              </span>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex justify-between text-xs text-text-body">
                    <span>Reference Distance (d_ref)</span>
                    <span className="font-mono">{sensors.referenceDistance} cm</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    step="1"
                    value={sensors.referenceDistance}
                    onChange={(e) => setReferenceDistance(Number(e.target.value))}
                    className="mt-1 h-2 w-full cursor-pointer appearance-none rounded bg-neutral-200 accent-text-primary"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-text-body">
                    <span>Movement 100% Normalization Range</span>
                    <span className="font-mono">{config.maxDisplacementRange} cm</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={config.maxDisplacementRange}
                    onChange={(e) => handleMaxRangeChange(Number(e.target.value))}
                    className="mt-1 h-2 w-full cursor-pointer appearance-none rounded bg-neutral-200 accent-text-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Calculation Summary Strip (Visible in both modes) */}
        <div className="mt-5 rounded-md border border-hairline bg-canvas p-4 font-mono text-xs text-text-secondary">
          <div className="flex items-center gap-1.5 font-semibold text-text-primary">
            <Info className="h-3.5 w-3.5" /> Live Model Calculation:
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 text-[11px] sm:grid-cols-4">
            <div>
              <span className="text-text-muted">Soil Risk:</span>{' '}
              <strong className="text-text-primary">{metrics.soilRisk}</strong> &times; {config.soilWeight} ={' '}
              <strong className="text-blue-700">{(config.soilWeight * metrics.soilRisk).toFixed(1)}</strong>
            </div>
            <div>
              <span className="text-text-muted">Move Risk:</span>{' '}
              <strong className="text-text-primary">{metrics.movementRisk}</strong> &times; {config.movementWeight} ={' '}
              <strong className="text-amber-700">{(config.movementWeight * metrics.movementRisk).toFixed(1)}</strong>
            </div>
            <div>
              <span className="text-text-muted">Total Score:</span>{' '}
              <strong className="text-text-primary text-xs">{metrics.totalRisk} / 100</strong>
            </div>
            <div>
              <span className="text-text-muted">Result State:</span>{' '}
              <strong
                className={
                  metrics.status === 'DANGER'
                    ? 'text-danger'
                    : metrics.status === 'WARNING'
                    ? 'text-warning'
                    : 'text-safe'
                }
              >
                {metrics.status}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
