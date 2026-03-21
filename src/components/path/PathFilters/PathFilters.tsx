import React from 'react';

import { PHASES, C } from '@/constants';
import type { FilterMode } from '@/types';

/** Props for PathFilters. */
export interface PathFiltersProps {
  filterMode: FilterMode;
  activePhase: string;
  onFilterChange: (mode: FilterMode) => void;
  onPhaseChange: (phase: string) => void;
}

const FILTER_TABS: Array<[FilterMode, string]> = [
  ['all', 'All'],
  ['trust', '★ Trust'],
  ['todo', 'To Do'],
  ['done', 'Done'],
];

/**
 * Filter bar for the path view.
 * Two groups: step-level filter (all|trust|todo|done) and phase selector.
 */
export function PathFilters({
  filterMode,
  activePhase,
  onFilterChange,
  onPhaseChange,
}: PathFiltersProps): React.JSX.Element {
  return (
    <div
      style={{
        background: C.surfaceHi,
        borderBottom: `1px solid ${C.border}`,
        padding: '0 18px',
        display: 'flex',
        gap: '0',
        overflowX: 'auto',
        flexShrink: 0,
      }}
    >
      {FILTER_TABS.map(([id, label]) => (
        <button
          key={id}
          id={`filter-${id}`}
          onClick={() => onFilterChange(id)}
          style={{
            background: filterMode === id ? `${C.orange}12` : 'transparent',
            border: 'none',
            borderBottom: filterMode === id ? `2px solid ${C.orange}` : '2px solid transparent',
            color: filterMode === id ? C.orange : C.muted,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '9px',
            fontWeight: filterMode === id ? '700' : '400',
            padding: '8px 13px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {label.toUpperCase()}
        </button>
      ))}
      <div style={{ width: '1px', background: C.border, margin: '6px 4px' }} />
      {[
        { id: 'all', label: 'All Phases', color: C.sky },
        ...PHASES.map((p) => ({ id: p.id, label: p.label, color: p.color })),
      ].map((p) => (
        <button
          key={p.id}
          id={`phase-filter-${p.id}`}
          onClick={() => onPhaseChange(p.id)}
          style={{
            background: activePhase === p.id ? `${p.color}10` : 'transparent',
            border: 'none',
            borderBottom: activePhase === p.id ? `2px solid ${p.color}` : '2px solid transparent',
            color: activePhase === p.id ? p.color : C.muted,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '9px',
            fontWeight: activePhase === p.id ? '700' : '400',
            padding: '8px 11px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {p.label.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
