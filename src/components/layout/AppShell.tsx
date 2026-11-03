'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Header from './Header';
import Sidebar from './Sidebar';
import ConfigModal from '@/components/config/ConfigModal';
import { useSimulator } from '@/context/SimulatorContext';

// Overview components
import RiskSummaryCard from '@/components/overview/RiskSummaryCard';
import MoistureSensorCard from '@/components/overview/MoistureSensorCard';
import DisplacementSensorCard from '@/components/overview/DisplacementSensorCard';
import TryScenarioSection from '@/components/overview/TryScenarioSection';

// Simulator component (Consolidated Workspace)
import SensorSimulatorWorkspace from '@/components/simulator/SensorSimulatorWorkspace';

// Analysis components
import EventTimeline from '@/components/analysis/EventTimeline';

// About component
import AboutModelContent from '@/components/about/AboutModelContent';

// Client-only dynamic imports for Recharts charts to avoid SSR hydration and webpack chunk conflicts
const OverviewMiniChart = dynamic(() => import('@/components/overview/OverviewMiniChart'), {
  ssr: false,
  loading: () => (
    <div className="h-44 w-full rounded-md border border-hairline bg-card p-4 flex items-center justify-center font-mono text-xs text-text-muted">
      Loading chart...
    </div>
  ),
});

const RiskTimeSeriesChart = dynamic(() => import('@/components/analysis/RiskTimeSeriesChart'), {
  ssr: false,
  loading: () => (
    <div className="h-72 w-full rounded-md border border-hairline bg-card p-4 flex items-center justify-center font-mono text-xs text-text-muted">
      Loading telemetry stream...
    </div>
  ),
});

const StateDurationBarChart = dynamic(() => import('@/components/analysis/StateDurationBarChart'), {
  ssr: false,
  loading: () => (
    <div className="h-48 w-full rounded-md border border-hairline bg-card p-4 flex items-center justify-center font-mono text-xs text-text-muted">
      Loading duration breakdown...
    </div>
  ),
});

export default function AppShell() {
  const { activeTab } = useSimulator();

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-text-primary antialiased">
      {/* Top Header */}
      <Header />

      {/* Main Body with Sidebar & Content */}
      <div className="flex flex-1">
        <Sidebar />

        {/* Dynamic Main View Area (4 core views) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* View 1: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <RiskSummaryCard />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <MoistureSensorCard />
                  <DisplacementSensorCard />
                </div>

                <OverviewMiniChart />

                <TryScenarioSection />
              </div>
            )}

            {/* View 2: Sensor Simulator */}
            {activeTab === 'simulator' && <SensorSimulatorWorkspace />}

            {/* View 3: Risk Analysis */}
            {activeTab === 'analysis' && (
              <div className="space-y-6">
                <RiskTimeSeriesChart />
                <StateDurationBarChart />
                <EventTimeline />
              </div>
            )}

            {/* View 4: About the Model */}
            {activeTab === 'about' && <AboutModelContent />}
          </div>
        </main>
      </div>

      {/* Global Configuration Modal */}
      <ConfigModal />
    </div>
  );
}
