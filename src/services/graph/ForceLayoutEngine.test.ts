import { describe, it, expect } from 'vitest';

import { ForceLayoutEngine } from '@/services/graph/ForceLayoutEngine';
import { ALL_STEPS, PHASE_ORDER } from '@/constants';

const VIRTUAL_W = 1800;
const VIRTUAL_H = 1200;
const BOUNDARY_PAD = 50;
const SEED = 0x12345678;

describe('ForceLayoutEngine', () => {
  it('produces positions for all 50 nodes', () => {
    const engine = new ForceLayoutEngine();
    const positions = engine.compute(SEED);
    expect(Object.keys(positions)).toHaveLength(ALL_STEPS.length);
    expect(Object.keys(positions)).toHaveLength(50);
  });

  it('all node positions are within virtual canvas bounds', () => {
    const engine = new ForceLayoutEngine();
    const positions = engine.compute(SEED);
    ALL_STEPS.forEach((n) => {
      expect(positions[n.id].x).toBeGreaterThanOrEqual(BOUNDARY_PAD);
      expect(positions[n.id].x).toBeLessThanOrEqual(VIRTUAL_W - BOUNDARY_PAD);
      expect(positions[n.id].y).toBeGreaterThanOrEqual(BOUNDARY_PAD);
      expect(positions[n.id].y).toBeLessThanOrEqual(VIRTUAL_H - BOUNDARY_PAD);
    });
  });

  it('no two nodes occupy the exact same position', () => {
    const engine = new ForceLayoutEngine();
    const positions = engine.compute(SEED);
    const coords = ALL_STEPS.map((n) => `${positions[n.id].x},${positions[n.id].y}`);
    const unique = new Set(coords);
    expect(unique.size).toBe(ALL_STEPS.length);
  });

  it('layout is deterministic for a given seed', () => {
    const engine = new ForceLayoutEngine();
    const pos1 = engine.compute(SEED);
    const pos2 = engine.compute(SEED);
    ALL_STEPS.forEach((n) => {
      expect(pos1[n.id].x).toBeCloseTo(pos2[n.id].x, 5);
      expect(pos1[n.id].y).toBeCloseTo(pos2[n.id].y, 5);
    });
  });

  it('re-running with same seed produces identical positions', () => {
    const e1 = new ForceLayoutEngine();
    const e2 = new ForceLayoutEngine();
    const pos1 = e1.compute(SEED);
    const pos2 = e2.compute(SEED);
    ALL_STEPS.forEach((n) => {
      expect(pos1[n.id].x).toBeCloseTo(pos2[n.id].x, 5);
    });
  });

  it('phase column gravity: nodes cluster near their column x-range', () => {
    const engine = new ForceLayoutEngine();
    const positions = engine.compute(SEED);
    const phaseCount = PHASE_ORDER.length;

    PHASE_ORDER.forEach((phaseId, pi) => {
      const colCenter = (pi + 0.5) * (VIRTUAL_W / phaseCount);
      const colHalfWidth = VIRTUAL_W / phaseCount;
      const phaseNodes = ALL_STEPS.filter((n) => n.phaseId === phaseId);
      const majorityInColumn = phaseNodes.filter(
        (n) => Math.abs(positions[n.id].x - colCenter) < colHalfWidth,
      );
      // At least 60% of nodes should be within the column band
      expect(majorityInColumn.length / phaseNodes.length).toBeGreaterThan(0.6);
    });
  });
});
