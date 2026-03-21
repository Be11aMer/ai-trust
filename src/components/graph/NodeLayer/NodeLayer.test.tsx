import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ALL_STEPS } from '@/constants/phases';

import { NodeGlyph } from './NodeLayer';

const trustNode = ALL_STEPS.find((s) => s.id === 26)!; // BitNet — LLM ★ (trust)
const defaultPos = { x: 100, y: 100 };
const defaultNode = ALL_STEPS.find((s) => s.id === 1)!;

function renderGlyph(overrides: Partial<React.ComponentProps<typeof NodeGlyph>> = {}) {
  const props = {
    node: defaultNode,
    position: defaultPos,
    done: false,
    isSelected: false,
    isHovered: false,
    isConnected: false,
    isDimmed: false,
    hasArtifacts: false,
    onSelect: vi.fn(),
    onHover: vi.fn(),
    ...overrides,
  };
  return {
    ...render(
      <svg>
        <NodeGlyph {...props} />
      </svg>,
    ),
    props,
  };
}

describe('NodeGlyph', () => {
  it('renders step number', () => {
    renderGlyph();
    expect(screen.getByText('01')).toBeInTheDocument();
  });

  it('completed node shows checkmark text', () => {
    renderGlyph({ done: true });
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('trust node shows ⭐ badge', () => {
    renderGlyph({ node: trustNode });
    expect(screen.getByText('⭐')).toBeInTheDocument();
  });

  it('node with artifacts shows yellow dot', () => {
    const { container } = renderGlyph({ hasArtifacts: true });
    const circles = container.querySelectorAll('circle');
    const yellowDot = Array.from(circles).find((c) => c.getAttribute('fill') === '#fbbf24');
    expect(yellowDot).toBeDefined();
  });

  it('click calls onSelect with node id', async () => {
    const user = userEvent.setup();
    const { props } = renderGlyph();
    await user.click(screen.getByRole('button'));
    expect(props.onSelect).toHaveBeenCalledWith(1);
  });
});
