'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import {
  SimulatorConfig,
  SensorInputs,
  ComputedMetrics,
  ScenarioPreset,
  ScenarioPresetId,
  TimelineEvent,
  TelemetryPoint,
  StateDurations,
  FourBitArray,
  AdderOutput,
  ComparatorOutput,
  RiskStatus,
  RiskTrend,
  ActiveTab,
} from '@/types/simulator';
import {
  DEFAULT_CONFIG,
  computeAllMetrics,
  calculate4BitAdder,
  compare4Bit,
  validateConfiguration,
} from '@/lib/calculations';

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'stable',
    name: '1. Stable Ground',
    shortTitle: 'Stable Ground Cycle',
    description:
      'Demonstrates a complete environmental stress cycle: starts calm, surges through warning into acute peak danger, then naturally drains and returns to safety.',
    durationSeconds: 24,
    waypoints: [
      { atPercent: 0, moisture: 16, distance: 100.8, phaseName: '1. Baseline Stable Slope', expectedStatus: 'SAFE' },
      { atPercent: 25, moisture: 38, distance: 105.0, phaseName: '2. Environmental Stress Influx', expectedStatus: 'SAFE' },
      { atPercent: 42, moisture: 56, distance: 115.0, phaseName: '3. Warning Threshold Crossed', expectedStatus: 'WARNING' },
      { atPercent: 62, moisture: 86, distance: 142.0, phaseName: '4. Peak Hazard (Danger State)', expectedStatus: 'DANGER' },
      { atPercent: 82, moisture: 50, distance: 116.0, phaseName: '5. Drainage Stabilization Initiated', expectedStatus: 'WARNING' },
      { atPercent: 100, moisture: 18, distance: 101.0, phaseName: '6. Stability Restored (Safe)', expectedStatus: 'SAFE' },
    ],
  },
  {
    id: 'increasing_moisture',
    name: '2. Increasing Moisture',
    shortTitle: 'Rainstorm & Saturation',
    description:
      'Demonstrates a heavy rainfall event: starts dry, pore-water pressure continuously rises past warning threshold into acute liquefaction danger, followed by pump dewatering.',
    durationSeconds: 24,
    waypoints: [
      { atPercent: 0, moisture: 12, distance: 100.5, phaseName: '1. Initial Dry Conditions', expectedStatus: 'SAFE' },
      { atPercent: 25, moisture: 32, distance: 101.0, phaseName: '2. Rainfall Onset', expectedStatus: 'SAFE' },
      { atPercent: 40, moisture: 58, distance: 102.5, phaseName: '3. Soil Saturation Warning', expectedStatus: 'WARNING' },
      { atPercent: 62, moisture: 96, distance: 112.0, phaseName: '4. Critical Liquefaction Danger', expectedStatus: 'DANGER' },
      { atPercent: 82, moisture: 56, distance: 103.0, phaseName: '5. Post-Storm Runoff Phase', expectedStatus: 'WARNING' },
      { atPercent: 100, moisture: 16, distance: 100.8, phaseName: '6. Soil Drained to Safe Capacity', expectedStatus: 'SAFE' },
    ],
  },
  {
    id: 'ground_movement',
    name: '3. Ground Movement',
    shortTitle: 'Slope Shear Creep',
    description:
      'Demonstrates mechanical slope shear displacement: moderate soil moisture with progressive creep accelerating into acute ground slip danger, then retaining-wall shoring stabilization.',
    durationSeconds: 24,
    waypoints: [
      { atPercent: 0, moisture: 22, distance: 100.5, phaseName: '1. Fixed Ground Marker Baseline', expectedStatus: 'SAFE' },
      { atPercent: 25, moisture: 26, distance: 110.0, phaseName: '2. Initial Sub-surface Creep', expectedStatus: 'SAFE' },
      { atPercent: 42, moisture: 38, distance: 128.0, phaseName: '3. Surface Shear Warning', expectedStatus: 'WARNING' },
      { atPercent: 62, moisture: 64, distance: 148.0, phaseName: '4. Severe Ground Slip Danger', expectedStatus: 'DANGER' },
      { atPercent: 82, moisture: 36, distance: 124.0, phaseName: '5. Shoring & Reinforcement Active', expectedStatus: 'WARNING' },
      { atPercent: 100, moisture: 20, distance: 101.0, phaseName: '6. Slope Displacements Arrested', expectedStatus: 'SAFE' },
    ],
  },
  {
    id: 'combined_danger',
    name: '4. Combined High-Risk Conditions',
    shortTitle: 'Flash Flood & Mudslide',
    description:
      'Demonstrates compound hazard: extreme precipitation occurs simultaneously with severe slope shear displacement, pushing risk to near-maximum danger, followed by emergency mitigation.',
    durationSeconds: 24,
    waypoints: [
      { atPercent: 0, moisture: 15, distance: 100.8, phaseName: '1. Nominal Slope Baseline', expectedStatus: 'SAFE' },
      { atPercent: 25, moisture: 35, distance: 108.0, phaseName: '2. Weather Alert & Minor Movement', expectedStatus: 'SAFE' },
      { atPercent: 42, moisture: 56, distance: 118.0, phaseName: '3. Compound Advisory Warning', expectedStatus: 'WARNING' },
      { atPercent: 62, moisture: 90, distance: 145.0, phaseName: '4. Critical Catastrophic Danger', expectedStatus: 'DANGER' },
      { atPercent: 82, moisture: 52, distance: 118.0, phaseName: '5. Emergency Mitigation Runoff', expectedStatus: 'WARNING' },
      { atPercent: 100, moisture: 18, distance: 101.0, phaseName: '6. Hazard Stabilized to Safe State', expectedStatus: 'SAFE' },
    ],
  },
];

export type SimulationState = 'idle' | 'running' | 'paused';
export type SimulatorMode = 'scenario' | 'manual';

interface SimulatorContextType {
  // Navigation & UI
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isConfigModalOpen: boolean;
  setIsConfigModalOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Simulator Mode
  simulatorMode: SimulatorMode;
  setSimulatorMode: (mode: SimulatorMode) => void;

  // Configuration
  config: SimulatorConfig;
  updateConfig: (newConfig: Partial<SimulatorConfig>) => { success: boolean; errors?: Record<string, string> };
  restoreDefaultConfig: () => void;

  // Sensor inputs
  sensors: SensorInputs;
  setSoilMoisture: (val: number) => void;
  setCurrentDistance: (val: number) => void;
  setReferenceDistance: (val: number) => void;

  // Computed metrics & Trend
  metrics: ComputedMetrics;
  riskTrend: RiskTrend;

  // Scenario Playback
  simulationState: SimulationState;
  activeScenarioId: ScenarioPresetId;
  playbackSpeed: number;
  scenarioProgress: number; // 0 - 100
  currentPhaseName: string;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetSimulation: () => void;
  selectScenario: (id: ScenarioPresetId) => void;
  replayScenario: () => void;
  setPlaybackSpeed: (speed: number) => void;

  // Telemetry & Event History
  telemetryHistory: TelemetryPoint[];
  events: TimelineEvent[];
  stateDurations: StateDurations;
  clearEvents: () => void;
  exportCSV: () => void;
  exportEventLogCSV: () => void;

  // Digital Logic Lab (preserved for About Model & evaluations)
  andA: boolean;
  setAndA: (val: boolean) => void;
  andB: boolean;
  setAndB: (val: boolean) => void;
  orA: boolean;
  setOrA: (val: boolean) => void;
  orB: boolean;
  setOrB: (val: boolean) => void;
  notIn: boolean;
  setNotIn: (val: boolean) => void;
  adderA: FourBitArray;
  setAdderA: (bits: FourBitArray) => void;
  toggleAdderABit: (bitIndex: number) => void;
  adderB: FourBitArray;
  setAdderB: (bits: FourBitArray) => void;
  toggleAdderBBit: (bitIndex: number) => void;
  adderCin: boolean;
  setAdderCin: (val: boolean) => void;
  adderOutput: AdderOutput;
  compA: FourBitArray;
  setCompA: (bits: FourBitArray) => void;
  toggleCompABit: (bitIndex: number) => void;
  compB: FourBitArray;
  setCompB: (bits: FourBitArray) => void;
  toggleCompBBit: (bitIndex: number) => void;
  comparatorOutput: ComparatorOutput;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export function SimulatorProvider({ children }: { children: ReactNode }) {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [simulatorMode, setSimulatorMode] = useState<SimulatorMode>('scenario');

  // Configuration
  const [config, setConfig] = useState<SimulatorConfig>(DEFAULT_CONFIG);

  // Sensor inputs (initially at Stable preset start: 16% moisture, 100.8cm distance)
  const [sensors, setSensors] = useState<SensorInputs>({
    soilMoisture: 16,
    currentDistance: 100.8,
    referenceDistance: DEFAULT_CONFIG.referenceDistance,
  });

  // Playback state
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioPresetId>('stable');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [scenarioProgress, setScenarioProgress] = useState<number>(0);

  // Telemetry & Events
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [stateDurations, setStateDurations] = useState<StateDurations>({
    SAFE: 0,
    WARNING: 0,
    DANGER: 0,
  });

  // Trend calculation
  const [riskTrend, setRiskTrend] = useState<RiskTrend>('STABLE');

  // Refs for animation loop and transitions
  const prevStatusRef = useRef<RiskStatus>('SAFE');
  const playbackProgressRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(performance.now());
  const prevRiskRef = useRef<number>(12);

  // Logic states (preserved for technical explanation)
  const [andA, setAndA] = useState(false);
  const [andB, setAndB] = useState(false);
  const [orA, setOrA] = useState(false);
  const [orB, setOrB] = useState(false);
  const [notIn, setNotIn] = useState(false);
  const [adderA, setAdderA] = useState<FourBitArray>([false, false, true, true]);
  const [adderB, setAdderB] = useState<FourBitArray>([false, false, true, false]);
  const [adderCin, setAdderCin] = useState<boolean>(false);
  const [compA, setCompA] = useState<FourBitArray>([false, true, false, true]);
  const [compB, setCompB] = useState<FourBitArray>([false, true, false, true]);

  // Pure computed metrics
  const metrics = useMemo(() => {
    return computeAllMetrics(sensors, config);
  }, [sensors, config]);

  // Current active scenario object
  const currentScenario = useMemo(() => {
    return SCENARIO_PRESETS.find((s) => s.id === activeScenarioId) || SCENARIO_PRESETS[0];
  }, [activeScenarioId]);

  // Current phase name based on progress
  const currentPhaseName = useMemo(() => {
    const w = currentScenario.waypoints;
    for (let i = w.length - 1; i >= 0; i--) {
      if (scenarioProgress >= w[i].atPercent) {
        return w[i].phaseName;
      }
    }
    return w[0].phaseName;
  }, [currentScenario, scenarioProgress]);

  // Pure computed Adder and Comparator
  const adderOutput = useMemo(() => {
    return calculate4BitAdder(adderA, adderB, adderCin);
  }, [adderA, adderB, adderCin]);

  const comparatorOutput = useMemo(() => {
    return compare4Bit(compA, compB);
  }, [compA, compB]);

  // Helper to add events
  const addEvent = useCallback(
    (type: TimelineEvent['type'], message: string, customRisk?: number, customStatus?: RiskStatus) => {
      const now = new Date();
      const timeString =
        now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      const newEvent: TimelineEvent = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        timeString,
        type,
        message,
        riskValue: customRisk !== undefined ? customRisk : metrics.totalRisk,
        status: customStatus !== undefined ? customStatus : metrics.status,
      };
      setEvents((prev) => [newEvent, ...prev.slice(0, 199)]);
    },
    [metrics.totalRisk, metrics.status]
  );

  // Monitor threshold crossings: record exactly when transitions occur
  useEffect(() => {
    const currentStatus = metrics.status;
    const prevStatus = prevStatusRef.current;

    if (currentStatus !== prevStatus) {
      if (prevStatus === 'SAFE' && currentStatus === 'WARNING') {
        addEvent(
          'THRESHOLD_WARNING_CROSSED',
          `Warning threshold crossed (Risk: ${metrics.totalRisk}% >= ${config.warningThreshold}%)`
        );
      } else if (prevStatus === 'WARNING' && currentStatus === 'DANGER') {
        addEvent(
          'THRESHOLD_DANGER_CROSSED',
          `Danger threshold crossed (Risk: ${metrics.totalRisk}% >= ${config.dangerThreshold}%)`
        );
      } else if (prevStatus === 'DANGER' && currentStatus === 'WARNING') {
        addEvent(
          'STATE_RETURNED_WARNING',
          `State returned to WARNING (Risk: ${metrics.totalRisk}%)`
        );
      } else if (prevStatus === 'WARNING' && currentStatus === 'SAFE') {
        addEvent(
          'STATE_RETURNED_SAFE',
          `State returned to SAFE (Risk: ${metrics.totalRisk}% < ${config.warningThreshold}%)`
        );
      }
      prevStatusRef.current = currentStatus;
    }
  }, [metrics.status, metrics.totalRisk, config.dangerThreshold, config.warningThreshold, addEvent]);

  // Risk Trend detection (comparing with previous risk sample)
  useEffect(() => {
    const currentRisk = metrics.totalRisk;
    const prevRisk = prevRiskRef.current;
    const diff = currentRisk - prevRisk;

    if (diff > 1) {
      setRiskTrend('RISING');
    } else if (diff < -1) {
      setRiskTrend('FALLING');
    } else {
      setRiskTrend('STABLE');
    }
    prevRiskRef.current = currentRisk;
  }, [metrics.totalRisk]);

  // Initial event on mount
  useEffect(() => {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    setEvents([
      {
        id: 'init-0',
        timestamp: Date.now(),
        timeString,
        type: 'SIMULATION_STARTED',
        message: 'Landslide Sentinel simulation engine calibrated and ready.',
        riskValue: metrics.totalRisk,
        status: metrics.status,
      },
    ]);
    setTelemetryHistory([
      {
        timestamp: Date.now(),
        timeString,
        soilMoisture: sensors.soilMoisture,
        displacement: metrics.displacement,
        soilRisk: metrics.soilRisk,
        movementRisk: metrics.movementRisk,
        totalRisk: metrics.totalRisk,
        status: metrics.status,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Periodic telemetry recording & state duration tracking (every 1 second)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0];

      // Record point
      setTelemetryHistory((prev) => {
        const nextPoint: TelemetryPoint = {
          timestamp: Date.now(),
          timeString,
          soilMoisture: sensors.soilMoisture,
          displacement: metrics.displacement,
          soilRisk: metrics.soilRisk,
          movementRisk: metrics.movementRisk,
          totalRisk: metrics.totalRisk,
          status: metrics.status,
        };
        const updated = [...prev, nextPoint];
        if (updated.length > 80) {
          return updated.slice(updated.length - 80);
        }
        return updated;
      });

      // Track duration in state
      setStateDurations((prev) => ({
        ...prev,
        [metrics.status]: prev[metrics.status] + 1,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [
    sensors.soilMoisture,
    metrics.displacement,
    metrics.soilRisk,
    metrics.movementRisk,
    metrics.totalRisk,
    metrics.status,
  ]);

  // -------------------------------------------------------------
  // Trajectory Playback Engine (Waypoints Interpolation)
  // Guarantees all presets progress through SAFE -> WARNING -> DANGER -> WARNING -> SAFE
  // -------------------------------------------------------------
  useEffect(() => {
    if (simulationState !== 'running') {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const durationMs = (currentScenario.durationSeconds * 1000) / playbackSpeed;
    lastTickTimeRef.current = performance.now();

    const loop = (currentTime: number) => {
      const deltaMs = currentTime - lastTickTimeRef.current;
      lastTickTimeRef.current = currentTime;

      const progressDelta = (deltaMs / durationMs) * 100;
      let newProgress = playbackProgressRef.current + progressDelta;

      if (newProgress >= 100) {
        newProgress = 100;
        playbackProgressRef.current = 100;
        setScenarioProgress(100);
        setSimulationState('idle');
        addEvent(
          'SIMULATION_PAUSED',
          `Scenario '${currentScenario.name}' completed full cycle (Safe -> Warning -> Danger -> Safe).`
        );
        // Set final waypoint values
        const finalWaypoint = currentScenario.waypoints[currentScenario.waypoints.length - 1];
        setSensors((prev) => ({
          ...prev,
          soilMoisture: finalWaypoint.moisture,
          currentDistance: finalWaypoint.distance,
        }));
        return;
      }

      playbackProgressRef.current = newProgress;
      setScenarioProgress(newProgress);

      // Find waypoint interval
      const waypoints = currentScenario.waypoints;
      let w1 = waypoints[0];
      let w2 = waypoints[waypoints.length - 1];

      for (let i = 0; i < waypoints.length - 1; i++) {
        if (newProgress >= waypoints[i].atPercent && newProgress <= waypoints[i + 1].atPercent) {
          w1 = waypoints[i];
          w2 = waypoints[i + 1];
          break;
        }
      }

      const segmentRange = w2.atPercent - w1.atPercent;
      const t = segmentRange > 0 ? (newProgress - w1.atPercent) / segmentRange : 1;

      // Smooth linear interpolation across current waypoint segment
      const interpolatedMoisture =
        Math.round((w1.moisture + t * (w2.moisture - w1.moisture)) * 10) / 10;
      const interpolatedDistance =
        Math.round((w1.distance + t * (w2.distance - w1.distance)) * 10) / 10;

      setSensors((prev) => ({
        ...prev,
        soilMoisture: interpolatedMoisture,
        currentDistance: interpolatedDistance,
      }));

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [simulationState, currentScenario, playbackSpeed, addEvent]);

  // Sensor mutators
  const setSoilMoisture = useCallback((val: number) => {
    const clamped = Math.min(100, Math.max(0, val));
    setSensors((prev) => ({ ...prev, soilMoisture: clamped }));
  }, []);

  const setCurrentDistance = useCallback((val: number) => {
    const clamped = Math.max(0, val);
    setSensors((prev) => ({ ...prev, currentDistance: clamped }));
  }, []);

  const setReferenceDistance = useCallback((val: number) => {
    const clamped = Math.max(1, val);
    setSensors((prev) => ({ ...prev, referenceDistance: clamped }));
    setConfig((prev) => ({ ...prev, referenceDistance: clamped }));
  }, []);

  // Scenario Presets Controls
  const selectScenario = useCallback(
    (id: ScenarioPresetId) => {
      const preset = SCENARIO_PRESETS.find((p) => p.id === id);
      if (!preset) return;

      setActiveScenarioId(id);
      setSimulationState('idle');
      playbackProgressRef.current = 0;
      setScenarioProgress(0);

      const firstWaypoint = preset.waypoints[0];
      setSensors({
        soilMoisture: firstWaypoint.moisture,
        currentDistance: firstWaypoint.distance,
        referenceDistance: config.referenceDistance,
      });

      addEvent('SCENARIO_SELECTED', `Scenario loaded: ${preset.name}`);
    },
    [config.referenceDistance, addEvent]
  );

  const startSimulation = useCallback(() => {
    setSimulatorMode('scenario');
    // If scenario completed, start fresh from 0
    if (playbackProgressRef.current >= 100) {
      playbackProgressRef.current = 0;
      setScenarioProgress(0);
      const firstWaypoint = currentScenario.waypoints[0];
      setSensors({
        soilMoisture: firstWaypoint.moisture,
        currentDistance: firstWaypoint.distance,
        referenceDistance: config.referenceDistance,
      });
    }
    setSimulationState('running');
    addEvent('SIMULATION_STARTED', `Simulation running: ${currentScenario.name}`);
  }, [currentScenario, config.referenceDistance, addEvent]);

  const pauseSimulation = useCallback(() => {
    setSimulationState('paused');
    addEvent(
      'SIMULATION_PAUSED',
      `Simulation paused at progress ${playbackProgressRef.current.toFixed(0)}%.`
    );
  }, [addEvent]);

  const resumeSimulation = useCallback(() => {
    setSimulationState('running');
    addEvent('SIMULATION_RESUMED', 'Simulation resumed from paused point.');
  }, [addEvent]);

  const resetSimulation = useCallback(() => {
    setSimulationState('idle');
    playbackProgressRef.current = 0;
    setScenarioProgress(0);

    const firstWaypoint = currentScenario.waypoints[0];
    setSensors({
      soilMoisture: firstWaypoint.moisture,
      currentDistance: firstWaypoint.distance,
      referenceDistance: config.referenceDistance,
    });

    setStateDurations({ SAFE: 0, WARNING: 0, DANGER: 0 });
    addEvent('SIMULATION_RESET', 'Simulation reset to baseline starting position.');
  }, [currentScenario, config.referenceDistance, addEvent]);

  const replayScenario = useCallback(() => {
    resetSimulation();
    setTimeout(() => {
      setSimulationState('running');
    }, 150);
  }, [resetSimulation]);

  // Config Update
  const updateConfig = useCallback(
    (newConfig: Partial<SimulatorConfig>) => {
      const merged = { ...config, ...newConfig };
      const validation = validateConfiguration(merged);
      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }
      setConfig(merged);
      if (merged.referenceDistance !== undefined) {
        setSensors((prev) => ({ ...prev, referenceDistance: merged.referenceDistance! }));
      }
      addEvent('CONFIG_UPDATED', 'Simulator operational thresholds and calculation weights updated.');
      return { success: true };
    },
    [config, addEvent]
  );

  const restoreDefaultConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    setSensors((prev) => ({ ...prev, referenceDistance: DEFAULT_CONFIG.referenceDistance }));
    addEvent('CONFIG_UPDATED', 'Configuration restored to factory standard defaults.');
  }, [addEvent]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  // CSV Export for Telemetry History
  const exportCSV = useCallback(() => {
    if (telemetryHistory.length === 0) return;

    const headers = [
      'Timestamp_Epoch',
      'Time_UTC',
      'Soil_Moisture_Pct',
      'Ref_Distance_cm',
      'Current_Distance_cm',
      'Displacement_cm',
      'Soil_Risk_Score',
      'Movement_Risk_Score',
      'Total_Risk_Score',
      'Status_State',
    ];

    const rows = telemetryHistory.map((point) => [
      point.timestamp,
      point.timeString,
      point.soilMoisture.toFixed(1),
      config.referenceDistance.toFixed(1),
      (config.referenceDistance + point.displacement).toFixed(1),
      point.displacement.toFixed(1),
      point.soilRisk,
      point.movementRisk,
      point.totalRisk,
      point.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `landslide_sentinel_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [telemetryHistory, config.referenceDistance]);

  // CSV Export for Event Log
  const exportEventLogCSV = useCallback(() => {
    if (events.length === 0) return;

    const headers = ['Event_ID', 'Timestamp_Epoch', 'Time_UTC', 'Event_Type', 'Risk_Value', 'Status', 'Message'];

    const rows = events.map((e) => [
      e.id,
      e.timestamp,
      e.timeString,
      e.type,
      e.riskValue,
      e.status,
      `"${e.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `landslide_sentinel_events_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [events]);

  // Bit Toggles for Adder & Comparator
  const toggleAdderABit = useCallback((idx: number) => {
    setAdderA((prev) => {
      const next: FourBitArray = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  }, []);

  const toggleAdderBBit = useCallback((idx: number) => {
    setAdderB((prev) => {
      const next: FourBitArray = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  }, []);

  const toggleCompABit = useCallback((idx: number) => {
    setCompA((prev) => {
      const next: FourBitArray = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  }, []);

  const toggleCompBBit = useCallback((idx: number) => {
    setCompB((prev) => {
      const next: FourBitArray = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  }, []);

  const value = {
    activeTab,
    setActiveTab,
    isConfigModalOpen,
    setIsConfigModalOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    simulatorMode,
    setSimulatorMode,
    config,
    updateConfig,
    restoreDefaultConfig,
    sensors,
    setSoilMoisture,
    setCurrentDistance,
    setReferenceDistance,
    metrics,
    riskTrend,
    simulationState,
    activeScenarioId,
    playbackSpeed,
    scenarioProgress,
    currentPhaseName,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    selectScenario,
    replayScenario,
    setPlaybackSpeed,
    telemetryHistory,
    events,
    stateDurations,
    clearEvents,
    exportCSV,
    exportEventLogCSV,
    andA,
    setAndA,
    andB,
    setAndB,
    orA,
    setOrA,
    orB,
    setOrB,
    notIn,
    setNotIn,
    adderA,
    setAdderA,
    toggleAdderABit,
    adderB,
    setAdderB,
    toggleAdderBBit,
    adderCin,
    setAdderCin,
    adderOutput,
    compA,
    setCompA,
    toggleCompABit,
    compB,
    setCompB,
    toggleCompBBit,
    comparatorOutput,
  };

  return <SimulatorContext.Provider value={value}>{children}</SimulatorContext.Provider>;
}

export function useSimulator() {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
}
