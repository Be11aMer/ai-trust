import type { PositionMap } from '@/types/graph';

/**
 * Abstract layout engine contract.
 * Any class implementing this can be injected into GraphView — no concrete dependency.
 */
export interface ILayoutEngine {
  /**
   * Compute node positions for all provided step ids.
   * @param seed - Optional PRNG seed for reproducible layouts.
   * @returns Map from step id to (x, y) position on the virtual canvas.
   */
  compute(seed?: number): PositionMap;
}
