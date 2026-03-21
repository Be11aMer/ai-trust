import { useState, useCallback, useContext, createContext } from 'react';

import type { ILayoutEngine } from '@/services/graph';
import type { PositionMap } from '@/types/graph';

/**
 * Context carrying the injected layout engine.
 * Wired in App.tsx (composition root) — GraphView never imports ForceLayoutEngine directly.
 */
export const LayoutEngineContext = createContext<ILayoutEngine | null>(null);

/**
 * Hook that computes graph node positions using the injected layout engine.
 * Positions are computed lazily on first call and memoised — calling the hook
 * twice with the same engine instance does not recompute.
 *
 * @returns `{ positions, computePositions }` — positions is null before computation.
 */
export function useGraphLayout(): {
  positions: PositionMap | null;
  computePositions: () => void;
} {
  const engine = useContext(LayoutEngineContext);
  const [positions, setPositions] = useState<PositionMap | null>(null);

  const computePositions = useCallback((): void => {
    if (!engine) return;
    setPositions(engine.compute());
  }, [engine]);

  return { positions, computePositions };
}
