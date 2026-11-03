'use client';

import React from 'react';

interface GateCardProps {
  gateType: 'AND' | 'OR' | 'NOT';
  inputA: boolean;
  setInputA: (val: boolean) => void;
  inputB?: boolean;
  setInputB?: (val: boolean) => void;
  output: boolean;
  title: string;
  description: string;
}

export default function GateCard({
  gateType,
  inputA,
  setInputA,
  inputB = false,
  setInputB,
  output,
  title,
  description,
}: GateCardProps) {
  // Truth table definitions
  const rows: Array<{ a: boolean; b?: boolean; out: boolean }> =
    gateType === 'NOT'
      ? [
          { a: false, out: true },
          { a: true, out: false },
        ]
      : gateType === 'AND'
      ? [
          { a: false, b: false, out: false },
          { a: false, b: true, out: false },
          { a: true, b: false, out: false },
          { a: true, b: true, out: true },
        ]
      : [
          { a: false, b: false, out: false },
          { a: false, b: true, out: true },
          { a: true, b: false, out: true },
          { a: true, b: true, out: true },
        ];

  const isRowActive = (r: { a: boolean; b?: boolean; out: boolean }) => {
    if (gateType === 'NOT') {
      return r.a === inputA;
    }
    return r.a === inputA && r.b === inputB;
  };

  return (
    <div className="rounded-md border border-hairline bg-card p-4">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-hairline pb-2.5">
        <div>
          <h4 className="font-mono text-xs font-semibold text-text-primary">{title}</h4>
          <p className="text-[11px] text-text-muted">{description}</p>
        </div>
        <span
          className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
            output
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
          }`}
        >
          OUT = {output ? '1 (HIGH)' : '0 (LOW)'}
        </span>
      </div>

      {/* SVG Logic Diagram */}
      <div className="my-3 flex items-center justify-center rounded-md border border-hairline bg-canvas p-3">
        <svg
          viewBox="0 0 240 100"
          className="h-24 w-60 overflow-visible"
          role="img"
          aria-label={`${gateType} gate circuit diagram`}
        >
          {/* Wire Inputs */}
          {gateType !== 'NOT' ? (
            <>
              {/* Input A wire */}
              <line
                x1="20"
                y1="35"
                x2="80"
                y2="35"
                stroke={inputA ? '#2563EB' : '#A3A3A3'}
                strokeWidth={inputA ? '2.5' : '1.5'}
              />
              <circle cx="20" cy="35" r="4" fill={inputA ? '#2563EB' : '#A3A3A3'} />
              <text x="12" y="38" textAnchor="end" fontSize="10" fontFamily="monospace" fill="#171717">
                A ({inputA ? '1' : '0'})
              </text>

              {/* Input B wire */}
              <line
                x1="20"
                y1="65"
                x2="80"
                y2="65"
                stroke={inputB ? '#2563EB' : '#A3A3A3'}
                strokeWidth={inputB ? '2.5' : '1.5'}
              />
              <circle cx="20" cy="65" r="4" fill={inputB ? '#2563EB' : '#A3A3A3'} />
              <text x="12" y="68" textAnchor="end" fontSize="10" fontFamily="monospace" fill="#171717">
                B ({inputB ? '1' : '0'})
              </text>
            </>
          ) : (
            <>
              {/* NOT Input A wire */}
              <line
                x1="20"
                y1="50"
                x2="80"
                y2="50"
                stroke={inputA ? '#2563EB' : '#A3A3A3'}
                strokeWidth={inputA ? '2.5' : '1.5'}
              />
              <circle cx="20" cy="50" r="4" fill={inputA ? '#2563EB' : '#A3A3A3'} />
              <text x="12" y="53" textAnchor="end" fontSize="10" fontFamily="monospace" fill="#171717">
                IN ({inputA ? '1' : '0'})
              </text>
            </>
          )}

          {/* Gate Symbol (ANSI Standard) */}
          {gateType === 'AND' && (
            <path
              d="M 80 20 L 115 20 A 30 30 0 0 1 115 80 L 80 80 Z"
              fill="#FFFFFF"
              stroke="#171717"
              strokeWidth="2"
            />
          )}

          {gateType === 'OR' && (
            <path
              d="M 80 20 Q 95 50 80 80 Q 120 78 150 50 Q 120 22 80 20 Z"
              fill="#FFFFFF"
              stroke="#171717"
              strokeWidth="2"
            />
          )}

          {gateType === 'NOT' && (
            <>
              <polygon points="80,25 140,50 80,75" fill="#FFFFFF" stroke="#171717" strokeWidth="2" />
              <circle cx="146" cy="50" r="5" fill="#FFFFFF" stroke="#171717" strokeWidth="2" />
            </>
          )}

          {/* Wire Output */}
          <line
            x1={gateType === 'NOT' ? '151' : gateType === 'AND' ? '145' : '150'}
            y1="50"
            x2="210"
            y2="50"
            stroke={output ? '#2563EB' : '#A3A3A3'}
            strokeWidth={output ? '2.5' : '1.5'}
          />
          <circle cx="210" cy="50" r="4.5" fill={output ? '#2563EB' : '#A3A3A3'} />
          <text x="218" y="53" fontSize="10" fontFamily="monospace" fill="#171717" fontWeight="bold">
            Q = {output ? '1' : '0'}
          </text>
        </svg>
      </div>

      {/* Interactive Toggle Controls */}
      <div className="flex items-center justify-around border-t border-hairline py-2.5 font-mono text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inputA}
            onChange={(e) => setInputA(e.target.checked)}
            className="sr-only"
          />
          <span className="text-text-secondary">{gateType === 'NOT' ? 'Input:' : 'Input A:'}</span>
          <span
            className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors ${
              inputA ? 'bg-text-primary' : 'bg-neutral-200'
            }`}
          >
            <span
              className={`h-4 w-4 rounded-full bg-white transition-transform ${
                inputA ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </span>
          <span className="font-semibold text-text-primary">{inputA ? '1' : '0'}</span>
        </label>

        {gateType !== 'NOT' && setInputB && (
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inputB}
              onChange={(e) => setInputB(e.target.checked)}
              className="sr-only"
            />
            <span className="text-text-secondary">Input B:</span>
            <span
              className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors ${
                inputB ? 'bg-text-primary' : 'bg-neutral-200'
              }`}
            >
              <span
                className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  inputB ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </span>
            <span className="font-semibold text-text-primary">{inputB ? '1' : '0'}</span>
          </label>
        )}
      </div>

      {/* Truth Table */}
      <div className="mt-2 border-t border-hairline pt-2">
        <div className="text-[10px] font-mono text-text-muted mb-1 uppercase tracking-wider">
          TRUTH TABLE ({gateType})
        </div>
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-hairline text-left text-text-muted text-[10px]">
              <th className="py-1 px-2">A</th>
              {gateType !== 'NOT' && <th className="py-1 px-2">B</th>}
              <th className="py-1 px-2 text-right">OUTPUT</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const active = isRowActive(r as { a: boolean; b?: boolean; out: boolean });
              return (
                <tr
                  key={i}
                  className={`border-b border-hairline/50 transition-colors ${
                    active ? 'bg-neutral-100 font-bold text-text-primary' : 'text-text-secondary'
                  }`}
                >
                  <td className="py-1 px-2">{r.a ? '1' : '0'}</td>
                  {gateType !== 'NOT' && <td className="py-1 px-2">{r.b ? '1' : '0'}</td>}
                  <td className="py-1 px-2 text-right">
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded text-[11px] ${
                        r.out ? 'text-blue-600' : 'text-neutral-500'
                      }`}
                    >
                      {r.out ? '1' : '0'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
