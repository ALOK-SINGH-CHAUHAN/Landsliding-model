'use client';

import React, { useState, useEffect } from 'react';
import { useSimulator } from '@/context/SimulatorContext';
import { SimulatorConfig } from '@/types/simulator';
import { X, RotateCcw, Check, AlertCircle } from 'lucide-react';

export default function ConfigModal() {
  const { isConfigModalOpen, setIsConfigModalOpen, config, updateConfig, restoreDefaultConfig } =
    useSimulator();

  const [formData, setFormData] = useState<SimulatorConfig>(config);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isConfigModalOpen) {
      setFormData(config);
      setFormErrors({});
      setSaveSuccess(false);
    }
  }, [isConfigModalOpen, config]);

  if (!isConfigModalOpen) return null;

  const handleChange = (field: keyof SimulatorConfig, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear field-specific error
    if (formErrors[field] || (formErrors.weights && (field === 'soilWeight' || field === 'movementWeight'))) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        if (field === 'soilWeight' || field === 'movementWeight') delete next.weights;
        return next;
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const result = updateConfig(formData);
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsConfigModalOpen(false);
      }, 700);
    } else if (result.errors) {
      setFormErrors(result.errors);
    }
  };

  const handleRestoreDefaults = () => {
    restoreDefaultConfig();
    setIsConfigModalOpen(false);
  };

  const currentTotalWeight = Math.round((formData.soilWeight + formData.movementWeight) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsConfigModalOpen(false)}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-md border border-hairline bg-card p-6 shadow-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <div>
            <h2 className="text-base font-semibold text-text-primary">
              Simulation Configuration
            </h2>
            <p className="font-mono text-xs text-text-muted">
              Configure mathematical model parameters & thresholds
            </p>
          </div>
          <button
            onClick={() => setIsConfigModalOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-hairline text-text-muted hover:text-text-primary"
            aria-label="Close configuration modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="mt-4 space-y-4">
          {/* Thresholds Section */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs uppercase tracking-wider text-text-secondary">
              Risk Classification Thresholds
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-body">
                  Warning Threshold (0–100)
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={formData.warningThreshold}
                    onChange={(e) => handleChange('warningThreshold', Number(e.target.value))}
                    className="w-full rounded-md border border-hairline bg-canvas px-3 py-1.5 font-mono text-xs text-text-primary focus:border-text-primary focus:outline-none"
                  />
                  <span className="ml-2 font-mono text-xs text-text-muted">%</span>
                </div>
                {formErrors.warningThreshold && (
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-danger">
                    <AlertCircle className="h-3 w-3" /> {formErrors.warningThreshold}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-text-body">
                  Danger Threshold (0–100)
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.dangerThreshold}
                    onChange={(e) => handleChange('dangerThreshold', Number(e.target.value))}
                    className="w-full rounded-md border border-hairline bg-canvas px-3 py-1.5 font-mono text-xs text-text-primary focus:border-text-primary focus:outline-none"
                  />
                  <span className="ml-2 font-mono text-xs text-text-muted">%</span>
                </div>
                {formErrors.dangerThreshold && (
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-danger">
                    <AlertCircle className="h-3 w-3" /> {formErrors.dangerThreshold}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Weights Section */}
          <div className="space-y-3 border-t border-hairline pt-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-wider text-text-secondary">
                Calculation Weight Distribution
              </h3>
              <span
                className={`font-mono text-xs ${
                  currentTotalWeight === 100 ? 'text-safe' : 'text-danger font-semibold'
                }`}
              >
                Sum: {currentTotalWeight}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-body">
                  Soil Moisture Weight
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={formData.soilWeight}
                    onChange={(e) => handleChange('soilWeight', Number(e.target.value))}
                    className="w-full rounded-md border border-hairline bg-canvas px-3 py-1.5 font-mono text-xs text-text-primary focus:border-text-primary focus:outline-none"
                  />
                  <span className="ml-2 font-mono text-xs text-text-muted">
                    ({Math.round(formData.soilWeight * 100)}%)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-body">
                  Movement Weight
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={formData.movementWeight}
                    onChange={(e) => handleChange('movementWeight', Number(e.target.value))}
                    className="w-full rounded-md border border-hairline bg-canvas px-3 py-1.5 font-mono text-xs text-text-primary focus:border-text-primary focus:outline-none"
                  />
                  <span className="ml-2 font-mono text-xs text-text-muted">
                    ({Math.round(formData.movementWeight * 100)}%)
                  </span>
                </div>
              </div>
            </div>
            {formErrors.weights && (
              <p className="flex items-center gap-1 text-[11px] text-danger">
                <AlertCircle className="h-3 w-3" /> {formErrors.weights}
              </p>
            )}
          </div>

          {/* Physical & Indicator Parameters */}
          <div className="space-y-3 border-t border-hairline pt-3">
            <h3 className="font-mono text-xs uppercase tracking-wider text-text-secondary">
              Physical & Hardware Constants
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-body">
                  Max Disp. Range
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="number"
                    min="5"
                    max="200"
                    value={formData.maxDisplacementRange}
                    onChange={(e) => handleChange('maxDisplacementRange', Number(e.target.value))}
                    className="w-full rounded-md border border-hairline bg-canvas px-2.5 py-1.5 font-mono text-xs text-text-primary focus:border-text-primary focus:outline-none"
                  />
                  <span className="ml-1 font-mono text-xs text-text-muted">cm</span>
                </div>
                {formErrors.maxDisplacementRange && (
                  <p className="mt-1 text-[10px] text-danger">{formErrors.maxDisplacementRange}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-text-body">
                  Reference Distance
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={formData.referenceDistance}
                    onChange={(e) => handleChange('referenceDistance', Number(e.target.value))}
                    className="w-full rounded-md border border-hairline bg-canvas px-2.5 py-1.5 font-mono text-xs text-text-primary focus:border-text-primary focus:outline-none"
                  />
                  <span className="ml-1 font-mono text-xs text-text-muted">cm</span>
                </div>
                {formErrors.referenceDistance && (
                  <p className="mt-1 text-[10px] text-danger">{formErrors.referenceDistance}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-text-body">
                  LED Blink Period
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="number"
                    min="100"
                    max="2000"
                    step="50"
                    value={formData.ledBlinkInterval}
                    onChange={(e) => handleChange('ledBlinkInterval', Number(e.target.value))}
                    className="w-full rounded-md border border-hairline bg-canvas px-2.5 py-1.5 font-mono text-xs text-text-primary focus:border-text-primary focus:outline-none"
                  />
                  <span className="ml-1 font-mono text-xs text-text-muted">ms</span>
                </div>
                {formErrors.ledBlinkInterval && (
                  <p className="mt-1 text-[10px] text-danger">{formErrors.ledBlinkInterval}</p>
                )}
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between border-t border-hairline pt-4">
            <button
              type="button"
              onClick={handleRestoreDefaults}
              className="flex items-center gap-1.5 rounded-md border border-hairline bg-card px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-canvas hover:text-text-primary"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Restore Factory Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="rounded-md border border-hairline bg-card px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-canvas"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-md bg-text-primary px-4 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-1"
              >
                {saveSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Saved!
                  </>
                ) : (
                  'Apply Changes'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
