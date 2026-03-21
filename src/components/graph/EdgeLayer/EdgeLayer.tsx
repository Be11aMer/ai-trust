import React from 'react';

import { ALL_STEPS, PHASE_COLORS, C } from '@/constants';
import type { PositionMap } from '@/types/graph';
import type { ProgressMap } from '@/types/storage';

/** Props for EdgeLayer. */
export interface EdgeLayerProps {
  edges: ReadonlyArray<readonly [number, number]>;
  positions: PositionMap;
  visibleIds: Set<number>;
  progress: ProgressMap;
  selectedNode: number | null;
}

/**
 * Renders SVG edges between connected nodes.
 * Highlights edges connected to the selected node; dims others.
 */
export function EdgeLayer({
  edges,
  positions,
  visibleIds,
  progress,
  selectedNode,
}: EdgeLayerProps): React.JSX.Element {
  return (
    <>
      {edges.map(([aId, bId], i) => {
        if (!positions[aId] || !positions[bId]) return null;
        if (!visibleIds.has(aId) || !visibleIds.has(bId)) return null;
        const pa = positions[aId];
        const pb = positions[bId];
        const bothDone = !!progress[aId] && !!progress[bId];
        const isHighlighted =
          selectedNode !== null && (aId === selectedNode || bId === selectedNode);
        const col =
          PHASE_COLORS[ALL_STEPS.find((n) => n.id === aId)?.phaseId ?? 'foundation'] ?? C.border;
        return (
          <line
            key={i}
            x1={pa.x}
            y1={pa.y}
            x2={pb.x}
            y2={pb.y}
            stroke={isHighlighted ? col : bothDone ? col : C.dim}
            strokeWidth={isHighlighted ? 2.5 : bothDone ? 1.8 : 1}
            strokeOpacity={
              isHighlighted ? 0.9 : bothDone ? 0.4 : selectedNode !== null ? 0.06 : 0.2
            }
          />
        );
      })}
    </>
  );
}
