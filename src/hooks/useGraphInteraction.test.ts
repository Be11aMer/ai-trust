import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useGraphInteraction } from './useGraphInteraction';

describe('useGraphInteraction', () => {
  it('starts with default transform', () => {
    const { result } = renderHook(() => useGraphInteraction());
    expect(result.current.transform).toEqual({ x: 0, y: 0, k: 1 });
  });

  it('zoom clamps to minimum 0.25', () => {
    const { result } = renderHook(() => useGraphInteraction({ x: 0, y: 0, k: 0.26 }));
    // Simulate multiple zoom-out wheel events
    for (let i = 0; i < 20; i++) {
      act(() => {
        result.current.handleWheel({ deltaY: 100, preventDefault: () => undefined } as unknown as React.WheelEvent);
      });
    }
    expect(result.current.transform.k).toBeGreaterThanOrEqual(0.25);
  });

  it('zoom clamps to maximum 3.0', () => {
    const { result } = renderHook(() => useGraphInteraction({ x: 0, y: 0, k: 2.9 }));
    for (let i = 0; i < 20; i++) {
      act(() => {
        result.current.handleWheel({ deltaY: -100, preventDefault: () => undefined } as unknown as React.WheelEvent);
      });
    }
    expect(result.current.transform.k).toBeLessThanOrEqual(3.0);
  });

  it('wheel delta negative = zoom in (k increases)', () => {
    const { result } = renderHook(() => useGraphInteraction({ x: 0, y: 0, k: 1 }));
    act(() => {
      result.current.handleWheel({ deltaY: -100, preventDefault: () => undefined } as unknown as React.WheelEvent);
    });
    expect(result.current.transform.k).toBeGreaterThan(1);
  });

  it('wheel delta positive = zoom out (k decreases)', () => {
    const { result } = renderHook(() => useGraphInteraction({ x: 0, y: 0, k: 1 }));
    act(() => {
      result.current.handleWheel({ deltaY: 100, preventDefault: () => undefined } as unknown as React.WheelEvent);
    });
    expect(result.current.transform.k).toBeLessThan(1);
  });

  it('pan updates transform.x and transform.y', () => {
    const { result } = renderHook(() => useGraphInteraction());
    act(() => {
      result.current.handleMouseDown({ clientX: 100, clientY: 100 } as React.MouseEvent);
    });
    act(() => {
      result.current.handleMouseMove({ clientX: 150, clientY: 120 } as React.MouseEvent);
    });
    expect(result.current.transform.x).toBe(50);
    expect(result.current.transform.y).toBe(20);
  });

  it('drag start sets dragging to true', () => {
    const { result } = renderHook(() => useGraphInteraction());
    act(() => {
      result.current.handleMouseDown({ clientX: 0, clientY: 0 } as React.MouseEvent);
    });
    expect(result.current.dragging).toBe(true);
  });

  it('drag end sets dragging to false', () => {
    const { result } = renderHook(() => useGraphInteraction());
    act(() => {
      result.current.handleMouseDown({ clientX: 0, clientY: 0 } as React.MouseEvent);
    });
    act(() => {
      result.current.handleMouseUp();
    });
    expect(result.current.dragging).toBe(false);
  });
});
