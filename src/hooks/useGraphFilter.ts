import { useMemo } from 'react';

import { ALL_STEPS, EDGES } from '@/constants';
import type { GraphFilterMode, ProgressMap } from '@/types';

/**
 * Hook deriving the set of visible node ids for the graph view
 * based on the current filter mode and progress state.
 *
 * Single Responsibility: filter logic only — no layout, no interaction.
 *
 * @param filterMode - The active graph filter.
 * @param progress   - Current completion state from the store.
 * @returns A Set of step ids that should be rendered at full opacity.
 */
export function useGraphFilter(filterMode: GraphFilterMode, progress: ProgressMap): Set<number> {
  return useMemo((): Set<number> => {
    const visible = ALL_STEPS.filter((n) => {
      switch (filterMode) {
        case 'trust':
          return n.tag?.includes('★');
        case 'done':
          return !!progress[n.id];
        case 'active':
          return !progress[n.id] && EDGES.some(([a]) => !!progress[a]);
        default:
          return true;
      }
    });
    return new Set(visible.map((n) => n.id));
  }, [filterMode, progress]);
}
