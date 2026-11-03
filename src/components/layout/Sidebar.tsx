'use client';

import React from 'react';
import { useSimulator } from '@/context/SimulatorContext';
import { ActiveTab } from '@/types/simulator';
import {
  LayoutDashboard,
  Sliders,
  LineChart,
  Info,
  X,
} from 'lucide-react';

interface NavItem {
  id: ActiveTab;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    sublabel: 'Live monitoring & summary',
    icon: LayoutDashboard,
  },
  {
    id: 'simulator',
    label: 'Sensor Simulator',
    sublabel: 'Scenarios & manual controls',
    icon: Sliders,
  },
  {
    id: 'analysis',
    label: 'Risk Analysis',
    sublabel: 'Time-series & duration log',
    icon: LineChart,
  },
  {
    id: 'about',
    label: 'About the Model',
    sublabel: 'Formulas & architecture',
    icon: Info,
  },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen, metrics } = useSimulator();

  const handleSelect = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between p-3">
      {/* Navigation Links */}
      <div className="space-y-1">
        <div className="mb-2 px-2 pt-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
            SYSTEM NAVIGATION
          </span>
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-all ${
                isActive
                  ? 'border border-hairline bg-card font-medium text-text-primary shadow-xs'
                  : 'text-text-secondary hover:bg-canvas hover:text-text-primary'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isActive ? 'text-text-primary' : 'text-text-muted group-hover:text-text-secondary'
                }`}
              />
              <div className="flex flex-col">
                <span className="text-xs tracking-tight">{item.label}</span>
                <span className="font-mono text-[10px] text-text-muted">{item.sublabel}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info & Compact Status */}
      <div className="space-y-3 border-t border-hairline pt-3">
        <div className="rounded-md border border-hairline bg-card p-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-text-muted">CURRENT STATUS</span>
            <span
              className={`font-mono text-[10px] font-semibold ${
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
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-[11px] text-text-secondary">Risk Score:</span>
            <span className="font-mono text-sm font-semibold text-text-primary">
              {metrics.totalRisk} / 100
            </span>
          </div>
          <div className="mt-1 flex items-baseline justify-between text-[11px] text-text-muted font-mono text-[10px]">
            <span>Soil: {metrics.soilRisk}%</span>
            <span>Disp: {metrics.displacement} cm</span>
          </div>
        </div>

        <div className="px-1 text-[11px] text-text-muted">
          <p className="font-mono text-[10px]">Academic Simulation</p>
          <p className="text-[10px] leading-tight text-text-muted">Standalone local browser engine</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 border-r border-hairline bg-canvas md:block">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-neutral-900/30 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex w-64 max-w-full flex-col border-r border-hairline bg-canvas shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-hairline px-4">
              <span className="font-mono text-xs font-semibold text-text-primary">
                NAVIGATION
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-hairline text-text-muted hover:text-text-primary"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
