import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ALL_STEPS } from '@/constants/phases';

import { StepCard } from './StepCard';

const step = ALL_STEPS.find((s) => s.id === 1)!;

function renderCard(overrides: Partial<React.ComponentProps<typeof StepCard>> = {}) {
  const props = {
    step,
    done: false,
    note: '',
    links: [],
    expanded: false,
    onToggle: vi.fn(),
    onSaveNote: vi.fn(),
    onAddLink: vi.fn(),
    onRemoveLink: vi.fn(),
    onExpand: vi.fn(),
    onGraphFocus: vi.fn(),
    ...overrides,
  };
  return { ...render(<StepCard {...props} />), props };
}

describe('StepCard', () => {
  it('renders step title, number, and tag', () => {
    renderCard();
    expect(screen.getByText('Python Mastery for AI')).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('checkbox click calls onToggle with correct id', async () => {
    const user = userEvent.setup();
    const { props } = renderCard();
    await user.click(screen.getByRole('checkbox'));
    expect(props.onToggle).toHaveBeenCalledWith(1);
  });

  it('expand/collapse toggles description visibility', async () => {
    const user = userEvent.setup();
    const { props, container } = renderCard();
    const header = container.querySelector('[aria-expanded]') as HTMLElement;
    await user.click(header);
    expect(props.onExpand).toHaveBeenCalledWith(1);
  });

  it('note textarea onBlur calls onSaveNote', async () => {
    const user = userEvent.setup();
    const { props } = renderCard({ expanded: true });
    const textarea = await screen.findByPlaceholderText(/Resources, insights/);
    await user.type(textarea, 'hello');
    await user.tab();
    expect(props.onSaveNote).toHaveBeenCalledWith(1, 'hello');
  });

  it('link add button calls onAddLink', async () => {
    const user = userEvent.setup();
    const { props } = renderCard({ expanded: true });
    const input = await screen.findByPlaceholderText(/github/i);
    await user.type(input, 'https://github.com/test');
    await user.click(screen.getByRole('button', { name: /add/i }));
    expect(props.onAddLink).toHaveBeenCalledWith(1, 'https://github.com/test');
  });

  it('link remove button calls onRemoveLink', async () => {
    const user = userEvent.setup();
    const { props } = renderCard({ expanded: true, links: ['https://example.com'] });
    await user.click(screen.getByText('×'));
    expect(props.onRemoveLink).toHaveBeenCalledWith(1, 'https://example.com');
  });

  it('graph focus button calls onGraphFocus', async () => {
    const user = userEvent.setup();
    const { props } = renderCard();
    await user.click(screen.getByTitle('Show in graph'));
    expect(props.onGraphFocus).toHaveBeenCalledWith(1);
  });

  it('completed step shows strikethrough title', () => {
    renderCard({ done: true });
    const title = screen.getByText('Python Mastery for AI');
    expect(title.style.textDecoration).toBe('line-through');
  });

  it('completed step shows green checkmark in checkbox', () => {
    renderCard({ done: true });
    expect(screen.getByText('✓')).toBeInTheDocument();
  });
});
