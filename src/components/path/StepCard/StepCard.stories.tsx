import type { Meta, StoryObj } from '@storybook/react';

import { ALL_STEPS } from '@/constants/phases';

import { StepCard } from './StepCard';

const meta: Meta<typeof StepCard> = {
  title: 'Path/StepCard',
  component: StepCard,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof StepCard>;

const baseStep = ALL_STEPS.find((s) => s.id === 1)!;
const trustStep = ALL_STEPS.find((s) => s.id === 26)!; // BitNet LLM ★

const baseProps = {
  done: false,
  note: '',
  links: [],
  expanded: false,
  onToggle: () => undefined,
  onSaveNote: () => undefined,
  onAddLink: () => undefined,
  onRemoveLink: () => undefined,
  onExpand: () => undefined,
  onGraphFocus: () => undefined,
};

export const Default: Story = {
  args: { ...baseProps, step: baseStep },
};

export const Completed: Story = {
  args: { ...baseProps, step: baseStep, done: true },
};

export const TrustCritical: Story = {
  args: { ...baseProps, step: trustStep },
};

export const WithArtifacts: Story = {
  args: {
    ...baseProps,
    step: baseStep,
    note: 'Some notes here',
    links: ['https://github.com/example'],
  },
};

export const Expanded: Story = {
  args: { ...baseProps, step: baseStep, expanded: true },
};
