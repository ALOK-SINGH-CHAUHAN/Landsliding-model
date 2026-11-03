'use client';

import React from 'react';
import {
  BookOpen,
  AlertTriangle,
  Cpu,
  Layers,
  Activity,
  Droplets,
  ChevronDown,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

export default function AboutModelContent() {
  return (
    <div className="space-y-6">
      {/* 1. What the simulator demonstrates */}
      <div className="rounded-md border border-hairline bg-card p-5">
        <div className="flex items-center gap-2 border-b border-hairline pb-3">
          <Layers className="h-4 w-4 text-text-primary" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            1. What the Simulator Demonstrates
          </h2>
        </div>
        <div className="mt-3 text-xs leading-relaxed text-text-body space-y-2">
          <p>
            <strong>Landslide Sentinel</strong> is an interactive educational simulator showing how environmental conditions lead to landslide risks and how early-warning systems detect them.
          </p>
          <p>
            When hillsides become saturated with water or experience ground creep, the risk of a landslide increases. By tracking virtual soil moisture and ground movement over time, this simulator demonstrates how early detection allows communities to take preventive action before slope failure occurs.
          </p>
        </div>
      </div>

      {/* 2. What soil moisture means */}
      <div className="rounded-md border border-hairline bg-card p-5">
        <div className="flex items-center gap-2 border-b border-hairline pb-3">
          <Droplets className="h-4 w-4 text-blue-600" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            2. What Soil Moisture Means
          </h2>
        </div>
        <div className="mt-3 text-xs leading-relaxed text-text-body space-y-2">
          <p>
            Soil moisture represents the percentage of water contained within the soil pore spaces.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Low Moisture (0%–30%):</strong> Dry, stable soil with high internal friction holding grains together.
            </li>
            <li>
              <strong>Moderate Moisture (30%–60%):</strong> Partially saturated soil from steady rainfall. The soil can still drain normally.
            </li>
            <li>
              <strong>High Moisture (60%–100%):</strong> Water completely fills pore spaces, creating pore-water pressure that pushes soil grains apart and significantly increases the likelihood of mudslides.
            </li>
          </ul>
        </div>
      </div>

      {/* 3. What ultrasonic distance and displacement represent */}
      <div className="rounded-md border border-hairline bg-card p-5">
        <div className="flex items-center gap-2 border-b border-hairline pb-3">
          <Activity className="h-4 w-4 text-amber-600" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            3. What Ultrasonic Distance & Displacement Represent
          </h2>
        </div>
        <div className="mt-3 text-xs leading-relaxed text-text-body space-y-2">
          <p>
            In a physical monitoring setup, an ultrasonic sensor sits at a fixed position above the slope and bounces acoustic sound waves off a ground marker plate.
          </p>
          <p>
            The <strong>reference distance</strong> is the baseline distance when the slope is known to be stable (default: 100 cm). If the slope slips downward (subsidence) or heaves upward, the measured distance changes. The difference between the current distance and the baseline reference is the <strong>ground displacement</strong> (&Delta;d).
          </p>
          <p className="font-mono text-[11px] text-text-secondary">
            Displacement = |Current Distance - Reference Distance|
          </p>
        </div>
      </div>

      {/* 4. How the risk score is calculated */}
      <div className="rounded-md border border-hairline bg-card p-5">
        <div className="flex items-center gap-2 border-b border-hairline pb-3">
          <BookOpen className="h-4 w-4 text-text-primary" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            4. How the Risk Score is Calculated
          </h2>
        </div>
        <div className="mt-3 text-xs leading-relaxed text-text-body space-y-2">
          <p>
            The simulator combines soil moisture and physical displacement into a single risk score between <strong>0 and 100</strong>.
          </p>
          <p>
            By default, <strong>soil moisture carries 70% of the weight</strong> (as it is the leading precursor to instability), while <strong>ground movement carries 30%</strong> (as it reflects physical deformation).
          </p>

          {/* Expandable Mathematical Details for Evaluators */}
          <details className="mt-3 rounded border border-hairline bg-canvas p-3 cursor-pointer">
            <summary className="font-mono text-xs font-semibold text-text-primary flex items-center justify-between">
              <span>View Mathematical Formulation (For Engineering Evaluators)</span>
              <ChevronDown className="h-4 w-4 text-text-muted" />
            </summary>
            <div className="mt-2 space-y-2 pt-2 border-t border-hairline text-xs font-mono text-text-secondary">
              <p>1. Displacement: &Delta;d = |d_curr - d_ref|</p>
              <p>2. Normalized Movement Risk = clamp(round((&Delta;d / maxRange) &times; 100), 0, 100)</p>
              <p>3. Normalized Soil Risk = clamp(round(moisturePercentage), 0, 100)</p>
              <p>4. Total Risk = clamp(round(0.70 &times; SoilRisk + 0.30 &times; MovementRisk), 0, 100)</p>
              <p className="text-[11px] text-text-muted">
                Note: Weights are configurable in Settings and must strictly sum to 100%.
              </p>
            </div>
          </details>
        </div>
      </div>

      {/* 5. What SAFE, WARNING, and DANGER mean */}
      <div className="rounded-md border border-hairline bg-card p-5">
        <div className="flex items-center gap-2 border-b border-hairline pb-3">
          <ShieldCheck className="h-4 w-4 text-safe" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            5. What SAFE, WARNING, and DANGER Mean
          </h2>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-md border border-emerald-200 bg-emerald-50/50 p-3">
            <span className="font-mono font-bold text-emerald-800 block mb-1">SAFE (0–34)</span>
            <p className="text-emerald-900 leading-relaxed">
              Normal baseline slope conditions. Soil moisture is within healthy drainage limits and no significant ground movement is detected.
            </p>
          </div>

          <div className="rounded-md border border-amber-200 bg-amber-50/50 p-3">
            <span className="font-mono font-bold text-amber-800 block mb-1">WARNING (35–69)</span>
            <p className="text-amber-900 leading-relaxed">
              Elevated conditions detected. Rainfall has significantly saturated the slope or initial ground creep has begun. Active monitoring is advised.
            </p>
          </div>

          <div className="rounded-md border border-red-200 bg-red-50/50 p-3">
            <span className="font-mono font-bold text-red-800 block mb-1">DANGER (70–100)</span>
            <p className="text-red-900 leading-relaxed">
              Critical conditions reached. Severe soil saturation coupled with ground movement threatens immediate slope failure. Evacuation threshold.
            </p>
          </div>
        </div>
      </div>

      {/* 6. How the warning LEDs respond */}
      <div className="rounded-md border border-hairline bg-card p-5">
        <div className="flex items-center gap-2 border-b border-hairline pb-3">
          <ShieldAlert className="h-4 w-4 text-text-primary" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            6. How the Warning LEDs Respond
          </h2>
        </div>
        <div className="mt-3 text-xs leading-relaxed text-text-body space-y-2">
          <p>
            The physical-style LED indicators replicate the behavior of a field alarm panel:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Green LED (Steady On):</strong> Illuminates continuously during SAFE conditions to verify the system is active and the slope is secure.
            </li>
            <li>
              <strong>Yellow LED (Blinking):</strong> Pulses periodically when WARNING conditions are reached to catch the operator&apos;s attention without causing false emergency alarms.
            </li>
            <li>
              <strong>Red LED (Rapid Blinking):</strong> Flashes rapidly at an accelerated rate when DANGER conditions occur, indicating an imminent hazard.
            </li>
          </ul>
        </div>
      </div>

      {/* 7. Optional Expandable Technical Section (Logic Gates, Adder, Comparator) */}
      <div className="rounded-md border border-hairline bg-card p-5">
        <div className="flex items-center gap-2 border-b border-hairline pb-3">
          <Cpu className="h-4 w-4 text-text-primary" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            7. Digital Hardware Logic & Computer Architecture (Optional)
          </h2>
        </div>

        <div className="mt-3 text-xs leading-relaxed text-text-body space-y-3">
          <p>
            In addition to software calculations, industrial early-warning systems often implement discrete hardware logic for fail-safe physical alarms without relying on an operating system.
          </p>

          <details className="rounded border border-hairline bg-canvas p-3 cursor-pointer">
            <summary className="font-mono text-xs font-semibold text-text-primary flex items-center justify-between">
              <span>Expand: Digital Logic Gates, Binary Adder & Comparator</span>
              <ChevronDown className="h-4 w-4 text-text-muted" />
            </summary>
            <div className="mt-3 space-y-3 pt-2 border-t border-hairline text-xs text-text-secondary leading-relaxed">
              <div>
                <strong className="text-text-primary">AND, OR, NOT Gates:</strong>
                <p>
                  <strong>OR Gate:</strong> Triggers when <em>either</em> soil moisture OR ground movement exceeds the warning threshold, ensuring rapid single-sensor alerts.
                  <br />
                  <strong>AND Gate:</strong> Triggers only when <em>both</em> soil moisture AND ground movement simultaneously breach thresholds, providing dual-confirmation validation.
                  <br />
                  <strong>NOT Gate:</strong> Inverts an input signal, useful for active-low safety circuits or fail-secure emergency tripwires.
                </p>
              </div>

              <div>
                <strong className="text-text-primary">4-Bit Binary Full Adder (74HC283 Model):</strong>
                <p>
                  Demonstrates how binary arithmetic is computed in hardware using ripple carry. Each bit stage implements Sum = A &oplus; B &oplus; Cin and Cout = (A &and; B) | (Cin &and; (A &oplus; B)).
                </p>
              </div>

              <div>
                <strong className="text-text-primary">4-Bit Magnitude Comparator (74HC85 Model):</strong>
                <p>
                  Directly compares two binary words (A and B from 0 to 15), activating exactly one mutually exclusive signal: A &gt; B, A = B, or A &lt; B.
                </p>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* 8. Educational Disclaimer */}
      <div className="rounded-md border border-amber-300 bg-amber-50/70 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-700" />
          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-900">
              8. Educational Simulation Disclaimer
            </h3>
            <p className="text-xs leading-relaxed text-amber-800">
              <strong>Landslide Sentinel</strong> is an educational software simulation created for academic demonstration, computer-aided geotechnical modeling, and engineering coursework. It is <strong>not</strong> a certified geotechnical safety instrument, nor has it been calibrated against in-situ geotechnical field instruments. It must never be used for real-world slope hazard management, life-safety decisions, or emergency dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
