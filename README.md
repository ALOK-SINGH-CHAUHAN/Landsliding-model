# Landslide Sentinel — Early-Warning System Simulator

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tests-22%20Passed-brightgreen?style=flat&logo=vitest)](https://vitest.dev/)

An engineering-grade digital instrumentation and early-warning simulator for landslide monitoring, slope stability modeling, and digital logic circuit verification.

---

## 🌟 Overview

**Landslide Sentinel** combines geotechnical hazard modeling with digital logic hardware simulation:
- **Telemetry & Risk Modeling**: Real-time evaluation of volumetric soil moisture and slope displacement with deterministic thresholding.
- **Digital Logic Verification Lab**: Built-in interactive models for discrete logic gates (AND, OR, NOT), a 4-Bit Binary Adder with Carry In/Out, and a 4-Bit Comparator.
- **Analytics & History**: Time-series hazard tracking, state duration metrics, and automated event logging.
- **Configurable Engine**: Dynamic weighting, threshold customization, and preset geological scenarios.

---

## 🚀 Key Features

### 1. Multi-Sensor Simulation & Risk Engine
- **Soil Moisture Sensor**: 0%–100% volumetric water content tracking with saturation curves.
- **Slope Displacement Sensor**: High-resolution creep and movement detection (0–50 mm).
- **Hazard Classification**:
  - 🟢 **SAFE** (0% – 34%): Stable slope, minimal displacement.
  - 🟡 **WARNING** (35% – 69%): Elevated moisture or moderate movement.
  - 🔴 **DANGER** (70% – 100%): Critical failure risk imminent.

### 2. Digital Logic Lab
- **Discrete Gates**: Interactive truth tables and visual state representation for AND, OR, and NOT gates.
- **4-Bit Binary Adder**: Bit-level simulation with Carry-In and Carry-Out support.
- **4-Bit Digital Comparator**: Exact bitwise comparison ($A > B$, $A = B$, $A < B$).
- **Hardware Circuit Emulation**: Direct digital hazard trigger circuit verification.

### 3. Scenario Presets
- **Dry & Stable**: Ambient baseline conditions.
- **Heavy Rainfall**: Rapid soil saturation without immediate movement.
- **Active Creep**: Slow progressive slope displacement under moderate moisture.
- **Critical Slope Hazard**: Simultaneous saturation and active fault slip triggering hazard alerts.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, CSS Variables
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Testing**: Vitest (Unit & Boundary test suite with 22 test cases)

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18.17.0 or newer recommended)
- npm or pnpm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ALOK-SINGH-CHAUHAN/Landsliding-model.git
   cd Landsliding-model
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. Run test suite:
   ```bash
   npm test
   ```

---

## 🧪 Testing

The project includes unit tests verifying the calculation engine, truth tables, adder logic, comparator outputs, and configuration constraints:

```bash
npm test
```

---

## 📂 Project Structure

```
├── src/
│   ├── app/                # Next.js App Router (layout, page, global styles)
│   ├── components/
│   │   ├── about/          # Geological model theory & documentation
│   │   ├── analysis/       # Charts, telemetry timelines, and state durations
│   │   ├── config/         # Thresholds and sensor weight configuration modal
│   │   ├── layout/         # Header, AppShell, and Navigation
│   │   ├── logic/          # Logic Lab (Adder, Comparator, Gate cards)
│   │   ├── overview/       # Sensor cards, risk summary, and scenario presets
│   │   └── simulator/      # Interactive telemetry control workspace
│   ├── context/            # Global simulator state management
│   ├── lib/                # Pure calculation engine & vitest test specs
│   └── types/              # TypeScript interfaces for simulation models
├── design.md               # Design tokens and architectural specification
└── package.json
```

---

## 📄 License

MIT License. Feel free to use, modify, and distribute.
