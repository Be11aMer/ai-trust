import { useState, useCallback } from 'react';

import type { GraphTransform } from '@/types/graph';

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3.0;
const ZOOM_IN_FACTOR = 1.1;
const ZOOM_OUT_FACTOR = 0.9;

/** State shape returned by useGraphInteraction. */
export interface GraphInteractionState {
  transform: GraphTransform;
  dragging: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleWheel: (e: React.WheelEvent) => void;
  setTransform: React.Dispatch<React.SetStateAction<GraphTransform>>;
}

/**
 * Hook managing SVG pan/zoom/drag interaction state.
 *
 * Single Responsibility: interaction state only — no layout, no filter logic.
 *
 * - Zoom is clamped to [0.25, 3.0].
 * - Wheel delta negative = zoom in; positive = zoom out.
 *
 * @param initialTransform - Optional starting transform (default: identity).
 */
export function useGraphInteraction(
  initialTransform: GraphTransform = { x: 0, y: 0, k: 1 },
): GraphInteractionState {
  const [transform, setTransform] = useState<GraphTransform>(initialTransform);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent): void => {
      setDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    },
    [transform.x, transform.y],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent): void => {
      if (!dragging || !dragStart) return;
      setTransform((t) => ({ ...t, x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }));
    },
    [dragging, dragStart],
  );

  const handleMouseUp = useCallback((): void => {
    setDragging(false);
    setDragStart(null);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent): void => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? ZOOM_IN_FACTOR : ZOOM_OUT_FACTOR;
    setTransform((t) => ({
      ...t,
      k: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, t.k * factor)),
    }));
  }, []);

  return {
    transform,
    dragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    setTransform,
  };
}
