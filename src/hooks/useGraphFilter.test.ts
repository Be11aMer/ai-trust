import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';

import { ALL_STEPS } from '@/constants/phases';

import { useGraphFilter } from './useGraphFilter';

describe('useGraphFilter', () => {
  it('"all" mode: all 50 node ids are visible', () => {
    const { result } = renderHook(() => useGraphFilter('all', {}));
    expect(result.current.size).toBe(50);
  });

  it('"trust" mode: only nodes with tag containing ★ are visible', () => {
    const { result } = renderHook(() => useGraphFilter('trust', {}));
    const trustSteps = ALL_STEPS.filter((n) => n.tag?.includes('★'));
    expect(result.current.size).toBe(trustSteps.length);
    trustSteps.forEach((n) => {
      expect(result.current.has(n.id)).toBe(true);
    });
  });

  it('"done" mode: only nodes where progress[id] is true are visible', () => {
    const progress = { 1: true, 5: true, 10: true } as Record<number, boolean>;
    const { result } = renderHook(() => useGraphFilter('done', progress));
    expect(result.current.size).toBe(3);
    expect(result.current.has(1)).toBe(true);
    expect(result.current.has(5)).toBe(true);
  });

  it('"active" mode: incomplete nodes with at least one prereq done', () => {
    // Step 2 has prereq step 1 → after completing step 1, step 2 should be active
    const progress = { 1: true } as Record<number, boolean>;
    const { result } = renderHook(() => useGraphFilter('active', progress));
    expect(result.current.has(2)).toBe(true);
    // Step 1 itself is done, not incomplete → not in active
    expect(result.current.has(1)).toBe(false);
  });
});
