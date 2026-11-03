# Design System Specification
# Landslide Sentinel — Early-Warning System Simulator

**Authoritative Design Standard & Frontend Architectural Guide**  
*Version 1.0.0 — Standalone Browser-Based Engineering Simulator*

---

## 1. Design Principles

1. **Disciplined Monochrome Foundation**: The visual baseline is clean, pure white (`#FFFFFF`) on off-white (`#FAFAFA`), structured with crisp hairline borders (`#EBEBEB`) and charcoal typography (`#171717`). It evokes the technical precision of modern scientific instrumentation, high-end developer tooling, and laboratory measurement benches.
2. **Restrained, Semantic-Only Status Accents**: Color is never decorative. Green, amber, and red appear solely to convey system stability (SAFE), impending threshold proximity (WARNING), and critical hazard thresholds (DANGER), or active signal paths in logic circuits.
3. **Information Density with Breathing Room**: Built for engineering scrutiny. Controls and readings are compact, high-contrast, and neatly aligned on a strict 4px grid. No wasted hero graphics, no decorative blobs, and no visual fluff.
4. **Deterministic and Explainable**: Every displayed metric traces back directly to pure calculation formulas. Visual feedback (LED blinks, gate propagation, comparator logic, chart series) reacts instantaneously with zero jitter or layout shift.
5. **Universal Accessibility & Tactility**: All controls are fully interactive via keyboard and touch, with high-contrast text ratios (WCAG AAA for primary text), visible focus rings, and explicit status text accompanying all chromatic indicators.

---

## 2. Color System & Design Tokens

### 2.1 Base Palette (Neutral Monochromatic)

| Token Name | Hex Code | Purpose & Usage |
| :--- | :--- | :--- |
| `--surface-canvas` | `#FAFAFA` | Page application background |
| `--surface-card` | `#FFFFFF` | Primary card, panel, modal, and drawer backgrounds |
| `--surface-subtle` | `#F5F5F5` | Secondary row zebra, active navigation highlights, inactive track |
| `--surface-muted` | `#EEEEEE` | Inactive chip fills, disabled switch tracks, table headers |
| `--border-hairline` | `#EBEBEB` | Standard 1px container and divider borders |
| `--border-subtle` | `#DCDCDC` | Hover state borders, input field borders |
| `--border-strong` | `#171717` | Focused inputs, active selected toggle borders |
| `--text-primary` | `#171717` | Primary headings, numeric values, critical data |
| `--text-body` | `#4D4D4D` | Section descriptions, instructional copy, table body |
| `--text-secondary`| `#666666` | Secondary labels, legend names, calculation notes |
| `--text-muted` | `#8F8F8F` | Metadata captions, simulated tags, inactive indicators |
| `--text-disabled` | `#C9C9C9` | Disabled inputs, inert placeholder text |

### 2.2 Semantic Status System

*Strict Rule: Status colors are only applied to indicators, status badges, active circuit signal lines, and chart lines. Gradients and full-bleed colored cards are prohibited.*

| State | Fill / Glow | Border | Text | Badge Background | Meaning |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SAFE** | `#16A34A` (steady) | `#86EFAC` | `#166534` | `#F0FDF4` | Risk: 0–34% (Stable slope, minimal displacement) |
| **WARNING** | `#D97706` (pulsing) | `#FDE68A` | `#92400E` | `#FFFBEB` | Risk: 35–69% (Elevated moisture or moderate movement) |
| **DANGER** | `#DC2626` (pulsing) | `#FECACA` | `#991B1B` | `#FEF2F2` | Risk: 70–100% (Critical failure risk imminent) |
| **ACCENT / LOGIC** | `#2563EB` | `#BFDBFE` | `#1E40AF` | `#EFF6FF` | Logic Lab: Active logic signal / high wire state (`1`) |

---

## 3. Typography Tokens & Hierarchy

The interface utilizes **Geist Sans** (fallback: **Inter**, system-ui) for interface copy and **Geist Mono** (fallback: **JetBrains Mono**, ui-monospace) for all numeric values, telemetry data, logic states, binary words, and calculation traces.

| Element | Font Family | Size | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Page Title** | Geist Sans | 30px (1.875rem) | 500 (Medium) | `-0.025em` | Top header product title & view titles |
| **Section Heading**| Geist Sans | 20px (1.25rem) | 500 (Medium) | `-0.015em` | Card titles, sub-system panels |
| **Subheading** | Geist Sans | 15px (0.9375rem) | 500 (Medium) | `-0.01em` | Subsection blocks, control group titles |
| **Body Primary** | Geist Sans | 14px (0.875rem) | 400 (Regular)| `0` | Form labels, descriptions, documentation |
| **Body Small** | Geist Sans | 13px (0.8125rem) | 400 (Regular)| `0` | Explanations, helper notes, tooltips |
| **Technical Label**| Geist Mono | 11px (0.6875rem) | 500 (Medium) | `+0.05em` | Uppercase telemetry tags, pill categories |
| **Sensor Value** | Geist Mono | 28–32px | 500 (Medium) | `-0.02em` | Sensor readouts (e.g., `42.5 %`, `18.2 cm`) |
| **Risk Score** | Geist Mono | 36px (2.25rem) | 600 (SemiBold)| `-0.03em` | Primary risk value (`0` to `100`) |
| **Circuit State** | Geist Mono | 12px (0.75rem) | 600 (SemiBold)| `0` | Bit values (`0` / `1`), logic outputs, Hex |
| **Timeline Time** | Geist Mono | 11px (0.6875rem) | 400 (Regular)| `0` | ISO/Local event timestamps (`14:23:05.120`) |

---

## 4. Spacing, Grid & Layout Rules

A mathematical 4px spacing rhythm governs all layout dimensions:
- `4px` (`space-1`): Micro gaps, icon-to-label spacing, badge padding
- `8px` (`space-2`): Compact control gaps, table cell vertical padding
- `12px` (`space-3`): Tight component spacing, input field padding
- `16px` (`space-4`): Standard inner card padding, grid row gap
- `20px` (`space-5`): Standard panel card padding on desktop
- `24px` (`space-6`): Major card padding, inter-section grouping gap
- `32px` (`space-8`): Section header separation
- `40px` (`space-10`): Major page section breaks

### Layout Specifications
- **App Shell Width**: Max `1320px` centered container with responsive fluid padding (`px-4` on mobile, `px-6` on tablet, `px-8` on desktop).
- **Navigation Sidebar**: Fixed `220px` desktop width (`200px` collapsed option), responsive drawer overlay on `< 768px`.
- **Top Header Bar**: Height `56px`, sticky top, background `#FFFFFF` with bottom border `1px solid #EBEBEB`, containing product branding, simulation status badge, simulation playback controls (Start/Pause/Resume/Reset), and configuration trigger.

---

## 5. Borders, Corners & Elevation

- **Borders**: Uniform `1px solid #EBEBEB` across cards, headers, tables, dividers, and inputs.
- **Corner Radii**:
  - `rounded-md` (`6px`): Cards, modal sheets, button components, sliders, dropdowns.
  - `rounded` (`4px`): Small badges, binary bit switches, truth-table cells.
  - `rounded-sm` (`2px`): Active navigation highlight markers, timeline bars.
  - `rounded-full`: Circular physical LEDs, slider thumb knobs.
- **Elevation / Shadows**:
  - `shadow-none` by default for all inline cards and panels to maintain flat laboratory paper elegance.
  - `shadow-sm` (`0 1px 2px 0 rgba(0, 0, 0, 0.04)`): Floating modals, dropdown menus, and active tooltips only.

---

## 6. Buttons, Inputs & Interactive Controls

### 6.1 Buttons
- **Primary Action** (`btn-primary`):
  - Background: `#171717` (hover: `#2E2E2E`, active: `#000000`)
  - Text: `#FFFFFF`, 13px, font-medium
  - Height: `32px` (compact), border-radius `6px`, padding `0 12px`
- **Secondary Action** (`btn-secondary`):
  - Background: `#FFFFFF` (hover: `#F5F5F5`, active: `#EBEBEB`)
  - Border: `1px solid #EBEBEB`
  - Text: `#171717`, 13px, font-medium
  - Height: `32px`, border-radius `6px`, padding `0 12px`
- **Icon / Control Button** (`btn-icon`):
  - Square `32px × 32px`, border `1px solid #EBEBEB`, centered Lucide icon (15px), background `#FFFFFF`.

### 6.2 Sliders & Numeric Inputs
- **Range Slider**:
  - Track: `4px` height, background `#EEEEEE`, filled portion `#171717`.
  - Thumb: `16px × 16px` solid circle, background `#FFFFFF`, border `2px solid #171717`, shadow `0 1px 3px rgba(0,0,0,0.15)`. Focus visible ring `2px solid #171717`.
- **Numeric Stepper / Input**:
  - Border: `1px solid #EBEBEB`, background `#FAFAFA`, text font-mono 13px. Focus: border `#171717`.

### 6.3 Toggle Switches & Binary Bit Keys
- **Physical Bit Toggle Switch**:
  - Width `28px`, Height `16px`, corner radius `4px`.
  - OFF state (`0`): Inactive background `#EEEEEE`, thumb left, text `0`.
  - ON state (`1`): Active background `#171717`, thumb right, text `1`.

---

## 7. Navigation Patterns

### Sidebar Menu Structure
- Compact `220px` width, light neutral background (`#FAFAFA` with border-right `1px solid #EBEBEB`).
- Clean list of 5 views:
  1. **Overview** (`LayoutDashboard` icon): Core live telemetry, risk gauge, simulated LEDs, signal flow.
  2. **Sensor Simulator** (`Sliders` icon): Interactive sensor generators, scenarios, calibration.
  3. **Digital Logic Lab** (`Cpu` icon): AND/OR/NOT gates, 4-bit Binary Adder, 4-bit Comparator.
  4. **Risk Analysis** (`LineChart` icon): Live multi-series time chart, system event timeline, CSV export.
  5. **About the Model** (`Info` icon): Mathematical explanations, circuit derivations, educational disclaimer.
- Active item style: Background `#FFFFFF`, border `1px solid #EBEBEB`, font-medium text `#171717`, with subtle left border indicator.

---

## 8. Dashboard Component Specifications

### 8.1 Risk Summary Panel
- Top horizontal card containing:
  - Numerical risk metric (`0` to `100`), monospace 36px font.
  - Prominent status pill (`SAFE`, `WARNING`, `DANGER`) with strict color-coded text and border.
  - Segmented horizontal progress bar indicating configured threshold boundaries (0–34, 35–69, 70–100) with marker line indicating current value.
  - Crisp natural-language explanation string explaining the trigger (e.g., *"Elevated moisture (68%) driving warning threshold; displacement stable at 1.4 cm"*).

### 8.2 Virtual Sensor Cards
- Moisture card: Live percentage, bar indicator, normalized soil risk `[0-100]`, simulated tag.
- Displacement card: Reference distance (cm), current distance (cm), calculated displacement $\Delta d = |d_{curr} - d_{ref}|$, movement risk score `[0-100]`.
- Interactive SVG diagram: Schematic representation showing the ultrasonic transducer transceiver radiating pulse waves toward a moving reflective ground boundary marker with measured distance arrows.

### 8.3 Simulated Physical LEDs
- Three inline bezel circular indicators (`14px` diameter):
  - **GREEN (SAFE)**: Solid steady `#16A34A` when active.
  - **YELLOW (WARNING)**: `#D97706`, pulsating blink interval (customizable, default `600ms`) when active.
  - **RED (DANGER)**: `#DC2626`, rapid pulsating blink interval (customizable, default `400ms`) when active.
- Inactive LEDs: Dark gray dot `#D4D4D4` with `#E5E5E5` rim, no illumination.
- Respects `prefers-reduced-motion` by switching from blinking to solid highlight + icon indicator.

### 8.4 Signal-Flow Diagram
- Horizontal flowchart connecting 6 discrete engineering stages:
  `[Virtual Sensors]` $\rightarrow$ `[Normalization]` $\rightarrow$ `[Risk Calculation]` $\rightarrow$ `[Comparator]` $\rightarrow$ `[Warning Logic]` $\rightarrow$ `[Simulated LEDs]`
- Each node displays its live computed value in monospace font. Active nodes and inter-stage connecting wires illuminate in high-contrast charcoal or status color.

---

## 9. Circuit Visualization Conventions (Digital Logic Lab)

1. **Gate Schematics**: Rendered as crisp SVG vector paths (ANSI/IEEE standard symbols for AND, OR, NOT).
2. **Signal Lines**:
   - Inactive / Low (`0`): `#D4D4D4`, 1.5px stroke width.
   - Active / High (`1`): `#171717` (or `#2563EB` signal blue), 2px stroke width.
3. **Truth Tables**:
   - Clean tabular format with hairline borders.
   - Currently active input combination row highlighted with subtle background `#F5F5F5` and bold font-mono text.
4. **4-Bit Binary Adder**:
   - Operands $A [A_3, A_2, A_1, A_0]$ and $B [B_3, B_2, B_1, B_0]$ with interactive toggle switches.
   - Carry-in ($C_{in}$) toggle switch.
   - Sum outputs $[S_3, S_2, S_1, S_0]$ and Carry-out ($C_{out}$) bit indicators.
   - Clear binary arithmetic breakdown showing column-by-column full-adder ripple carry.
5. **4-Bit Comparator**:
   - Operands $A$ and $B$ evaluated as unsigned 4-bit integers (`0` to `15`).
   - Three mutually exclusive outputs: $A > B$, $A = B$, $A < B$.
   - Exactly one output active at any instant.

---

## 10. Chart & Event Log Conventions

### 10.1 Time-Series Chart (Recharts)
- Background: `#FFFFFF`
- Grid: Light dashed horizontal lines `#F0F0F0`
- Series Lines:
  - **Total Risk**: `#171717` (2px solid line)
  - **Soil Risk Contribution**: `#2563EB` (1.5px dashed line)
  - **Movement Risk Contribution**: `#D97706` (1.5px dotted line)
- Tooltip: Compact white card with `#EBEBEB` border, monospace timestamps and values.
- Reference Lines: Configured Warning threshold (`35%`, amber) and Danger threshold (`70%`, red).

### 10.2 Event Timeline
- Vertical list of timestamped state changes:
  - System startup / Reset
  - Scenario activation
  - Input parameter changes
  - Threshold transition events (`SAFE -> WARNING`, `WARNING -> DANGER`, etc.)
- Export: Working CSV export generation button (`Download CSV`) capturing full telemetry log with headers: `Timestamp, SoilMoisture(%), RefDist(cm), CurrDist(cm), Displacement(cm), SoilRisk, MovementRisk, TotalRisk, Status`.

---

## 11. Responsive Layout Rules

- **Desktop ($\ge 1024px$)**: Full persistent sidebar (`220px`), multi-column cards (2-column or 3-column sensor grids), side-by-side adder and comparator.
- **Tablet ($768px - 1023px$)**: Compact or drawer sidebar, 2-column dashboard grid, responsive SVG circuits.
- **Mobile ($< 768px$)**: Top navigation bar with slide-out mobile drawer, single-column stacked layout, full-width sliders, horizontal scroll containers for wide circuit diagrams and truth tables.

---

## 12. Accessibility Requirements

1. **Color Independence**: Every risk state and circuit condition features an unambiguous textual label (`SAFE`, `WARNING`, `DANGER`, `HIGH (1)`, `LOW (0)`). Color is never the sole carrier of meaning.
2. **Keyboard Navigable**: All sliders, buttons, presets, and bit switches are focusable with visible focus rings (`ring-2 ring-offset-2 ring-neutral-900`).
3. **ARIA Semantic Labels**: Proper `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`, and `role="switch"` attributes for all custom controls.
4. **Motion Safety**: Respects `prefers-reduced-motion` media queries by disabling pulsating LED animations in favor of high-contrast static borders.

---

## 13. Design Anti-Patterns (Strictly Forbidden)

- ❌ **No Gradients**: No gradient buttons, backgrounds, or card headers.
- ❌ **No Glassmorphism**: No `backdrop-blur`, no translucent panels with glow.
- ❌ **No Excessive Corner Radii**: Maximum border radius is 6px (except for circular indicators).
- ❌ **No Heavy Drop Shadows**: Use clean hairline borders instead of deep elevations.
- ❌ **No Marketing Hero Sections**: The tool opens immediately into operational engineering views.
- ❌ **No Emojis**: Replace all informal symbols with standardized Lucide icons.
- ❌ **No Fake Hardware Indicators**: No dummy COM ports, fake WiFi bars, or simulated baud rate dials.
- ❌ **No Dead Buttons**: Every single interactive element performs an actual calculation or state update.

---

## 14. Implementation Checklist

- [x] Authoritative `design.md` established at project root.
- [ ] Next.js app scaffolded with TypeScript, Tailwind CSS, Lucide React, and Recharts.
- [ ] Pure mathematical calculation engine implemented (`src/lib/calculations.ts`).
- [ ] Comprehensive unit test suite with 100% boundary coverage.
- [ ] Central state engine and custom hooks managing simulation clock and history.
- [ ] Overview dashboard with live sensors, SVG ultrasonic diagram, simulated LEDs, and signal flow.
- [ ] Sensor Simulator page with 4 deterministic presets and playback animator.
- [ ] Digital Logic Lab with AND, OR, NOT gates, 4-bit Binary Adder, and 4-bit Comparator.
- [ ] Risk Analysis page with Recharts time series, live timeline, and CSV export.
- [ ] About the Model page with detailed mathematical breakdowns and academic disclaimer.
- [ ] Global Configuration modal for thresholds, weights, and restoration of defaults.
- [ ] Production build verified with zero errors or warnings.
