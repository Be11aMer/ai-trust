import React from 'react';

import { PHASES, C } from '@/constants';
import type { ProgressMap } from '@/types/storage';

/** Props for PhaseLegend. */
export interface PhaseLegendProps {
  progress: ProgressMap;
}

/**
 * Bottom legend bar showing per-phase completion dots, counts, and icon key.
 */
export function PhaseLegend({ progress }: PhaseLegendProps): React.JSX.Element {
  return (
    <div
      style={{
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
        padding: '6px 18px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        alignItems: 'center',
        flexShrink: 0,
      }}
    >
      {PHASES.map((ph) => {
        const done = ph.steps.filter((s) => progress[s.id]).length;
        return (
          <div key={ph.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: ph.color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: ph.color,
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '7px',
                fontWeight: '700',
              }}
            >
              {ph.label}
            </span>
            <span
              style={{
                color: done === ph.steps.length ? ph.color : C.muted,
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '7px',
              }}
            >
              {done}/{ph.steps.length}
            </span>
          </div>
        );
      })}
      <span
        style={{
          color: C.dim,
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: '7px',
          marginLeft: 'auto',
        }}
      >
        ⭐ trust-critical · 🟡 has artifacts · ◈ button jumps to graph
      </span>
    </div>
  );
}
