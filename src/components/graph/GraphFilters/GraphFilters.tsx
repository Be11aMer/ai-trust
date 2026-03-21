import React from 'react';

import { C } from '@/constants';
import type { GraphFilterMode } from '@/types';

/** Props for GraphFilters. */
export interface GraphFiltersProps {
  filterMode: GraphFilterMode;
  onChange: (mode: GraphFilterMode) => void;
}

const GRAPH_FILTER_TABS: Array<[GraphFilterMode, string]> = [
  ['all', 'All'],
  ['trust', '★ Trust'],
  ['done', 'Done'],
  ['active', 'Unlocked'],
];

/**
 * Filter buttons overlay on the graph canvas — bottom-right corner.
 */
export function GraphFilters({ filterMode, onChange }: GraphFiltersProps): React.JSX.Element {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '36px',
        right: '12px',
        zIndex: 10,
        display: 'flex',
        gap: '3px',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
      }}
    >
      {GRAPH_FILTER_TABS.map(([id, label]) => (
        <button
          key={id}
          id={`graph-filter-${id}`}
          onClick={() => onChange(id)}
          style={{
            background: filterMode === id ? `${C.orange}22` : `${C.surface}ee`,
            border: `1px solid ${filterMode === id ? `${C.orange}60` : C.border}`,
            color: filterMode === id ? C.orange : C.muted,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '8px',
            fontWeight: filterMode === id ? '700' : '400',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
