import { ALL_STEPS, PHASE_ORDER, EDGES } from '@/constants';
import type { PositionMap } from '@/types/graph';

import type { ILayoutEngine } from './ILayoutEngine';

/** Virtual canvas dimensions — pan/zoom handles viewport mapping. */
const VIRTUAL_W = 1800;
const VIRTUAL_H = 1200;

/** Number of simulation iterations. */
const ITERATIONS = 300;

/** Repulsion force constant. */
const REPULSION = 3200;

/** Ideal edge length in pixels. */
const EDGE_LENGTH = 160;

/** Spring stiffness coefficient. */
const SPRING_K = 0.022;

/** Gravity towards vertical centre. */
const CENTRE_GRAVITY = 0.005;

/** Velocity damping per tick. */
const DAMPING = 0.7;

/** Boundary padding in pixels. */
const BOUNDARY_PAD = 50;

/** Initial jitter radius horizontally. */
const JITTER_X = 40;

/** Initial jitter radius vertically. */
const JITTER_Y = 30;

/** Default PRNG seed — fixed constant for reproducible layouts ("BELLAMER" encoded). */
const DEFAULT_SEED = 0xbe11a5e7;

/**
 * Mulberry32 seeded PRNG — produces deterministic float in [0, 1).
 * @param seed - 32-bit unsigned integer seed.
 * @returns A function returning the next pseudo-random number.
 */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return (): number => {
    s += 0x6d2b79f5;
    let z = s;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 0x100000000;
  };
}

/**
 * Force-directed layout engine.
 * Computes stable 2-D positions for all 50 nodes via iterative simulation.
 *
 * Single Responsibility: this class computes positions only.
 * It knows nothing about React, DOM, or application state.
 *
 * @example
 * const engine = new ForceLayoutEngine();
 * const positions = engine.compute(0xbellamer);
 */
export class ForceLayoutEngine implements ILayoutEngine {
  /**
   * Run the force simulation and return final positions.
   * @param seed - PRNG seed for reproducible layouts. Defaults to `DEFAULT_SEED`.
   */
  public compute(seed: number = DEFAULT_SEED): PositionMap {
    const rand = mulberry32(seed);
    const w = VIRTUAL_W;
    const h = VIRTUAL_H;
    const phaseCount = PHASE_ORDER.length;

    const pos: PositionMap = {};

    // Initialise positions with phase-column gravity + small random jitter
    PHASE_ORDER.forEach((phaseId, pi) => {
      const cx = (pi + 0.5) * (w / phaseCount);
      const phaseSteps = ALL_STEPS.filter((s) => s.phaseId === phaseId);
      const rows = phaseSteps.length;
      phaseSteps.forEach((s, i) => {
        pos[s.id] = {
          x: cx + (rand() - 0.5) * JITTER_X,
          y: (i + 1) * (h / (rows + 1)) + (rand() - 0.5) * JITTER_Y,
          vx: 0,
          vy: 0,
        };
      });
    });

    // Simulation loop
    for (let iter = 0; iter < ITERATIONS; iter++) {
      const alpha = 1 - iter / ITERATIONS;

      // Repulsion — all pairs
      for (let a = 0; a < ALL_STEPS.length; a++) {
        for (let b = a + 1; b < ALL_STEPS.length; b++) {
          const na = ALL_STEPS[a];
          const nb = ALL_STEPS[b];
          const dx = pos[na.id].x - pos[nb.id].x;
          const dy = pos[na.id].y - pos[nb.id].y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const f = (REPULSION / (d * d)) * alpha;
          pos[na.id].vx += (dx / d) * f;
          pos[na.id].vy += (dy / d) * f;
          pos[nb.id].vx -= (dx / d) * f;
          pos[nb.id].vy -= (dy / d) * f;
        }
      }

      // Spring attraction along edges
      EDGES.forEach(([aId, bId]) => {
        if (!pos[aId] || !pos[bId]) return;
        const dx = pos[bId].x - pos[aId].x;
        const dy = pos[bId].y - pos[aId].y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = ((d - EDGE_LENGTH) * SPRING_K * alpha);
        pos[aId].vx += (dx / d) * f;
        pos[aId].vy += (dy / d) * f;
        pos[bId].vx -= (dx / d) * f;
        pos[bId].vy -= (dy / d) * f;
      });

      // Phase-column gravity + vertical centering
      ALL_STEPS.forEach((n) => {
        const pi = PHASE_ORDER.indexOf(n.phaseId as typeof PHASE_ORDER[number]);
        const tx = (pi + 0.5) * (w / phaseCount);
        pos[n.id].vx += (tx - pos[n.id].x) * SPRING_K * alpha;
        pos[n.id].vy += (h / 2 - pos[n.id].y) * CENTRE_GRAVITY * alpha;
      });

      // Integrate + damp + clamp
      ALL_STEPS.forEach((n) => {
        pos[n.id].vx *= DAMPING;
        pos[n.id].vy *= DAMPING;
        pos[n.id].x = Math.max(BOUNDARY_PAD, Math.min(w - BOUNDARY_PAD, pos[n.id].x + pos[n.id].vx));
        pos[n.id].y = Math.max(BOUNDARY_PAD, Math.min(h - BOUNDARY_PAD, pos[n.id].y + pos[n.id].vy));
      });
    }

    return pos;
  }
}
