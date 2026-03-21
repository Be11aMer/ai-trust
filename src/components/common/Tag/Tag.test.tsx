import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Tag } from './Tag';

describe('Tag', () => {
  it('renders tag text', () => {
    render(<Tag tag="ML" />);
    expect(screen.getByText('ML')).toBeInTheDocument();
  });

  it('applies correct colour for known tag', () => {
    render(<Tag tag="Trust ★" />);
    const el = screen.getByText('Trust ★');
    // colour is applied via inline style; trust tag uses orange (#ff6b35)
    expect(el.style.color).toBe('rgb(255, 107, 53)');
  });

  it('applies muted colour for unknown tag', () => {
    render(<Tag tag="Unknown" />);
    const el = screen.getByText('Unknown');
    // muted = #64748b
    expect(el.style.color).toBe('rgb(100, 116, 139)');
  });
});
