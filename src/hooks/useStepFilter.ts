import { useMemo } from 'react';

import { PHASES } from '@/constants';
import type { FilterMode, Phase, ProgressMap } from '@/types';

/**
 * Hook computing visible phases and their filtered steps for the path view.
 *
 * Single Responsibility: step-filtering logic only.
 *
 * @param filterMode  - Step filter (all | trust | todo | done).
 * @param activePhase - Active phase id or "all".
 * @param progress    - Current completion state from the store.
 * @returns Filtered, non-empty phases with their applicable steps.
 */
export function useStepFilter(
  filterMode: FilterMode,
  activePhase: string,
  progress: ProgressMap,
): Phase[] {
  return useMemo((): Phase[] => {
    return PHASES.map((ph) => ({
      ...ph,
      steps: ph.steps.filter((s) => {
        if (filterMode === 'trust') return s.tag?.includes('★');
        if (filterMode === 'todo') return !progress[s.id];
        if (filterMode === 'done') return !!progress[s.id];
        return true;
      }),
    })).filter(
      (ph) => (activePhase === 'all' || ph.id === activePhase) && ph.steps.length > 0,
    );
  }, [filterMode, activePhase, progress]);
}
