import React from 'react';

import { PHASES, C } from '@/constants';
import type { ProgressMap } from '@/types/storage';

/** Props for PhaseMiniMap. */
export interface PhaseMiniMapProps {
  progress: ProgressMap;
  activePhase: string;
  onPhaseClick: (phaseId: string) => void;
}

/**
 * Horizontal strip of per-phase progress bars, acting as a mini-map for the path view.
 * Clicking a phase segment toggles the active phase filter.
 */
export function PhaseMiniMap({ progress, activePhase, onPhaseClick }: PhaseMiniMapProps): React.JSX.Element {
  return (
    <div
      style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: '8px 18px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        flexShrink: 0,
      }}
    >
      {PHASES.map((ph) => {
        const done = ph.steps.filter((s) => progress[s.id]).length;
        return (
          <div
            key={ph.id}
            id={`minimap-${ph.id}`}
            onClick={() => onPhaseClick(ph.id === activePhase ? 'all' : ph.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onPhaseClick(ph.id === activePhase ? 'all' : ph.id);
            }}
            style={{ flex: 1, minWidth: '70px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span
                style={{
                  color: ph.color,
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '7px',
                  fontWeight: '700',
                }}
              >
                {ph.label.toUpperCase()}
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
            <div
              style={{
                height: '3px',
                background: C.border,
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.round((done / ph.steps.length) * 100)}%`,
                  height: '100%',
                  background: ph.color,
                  borderRadius: '2px',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
