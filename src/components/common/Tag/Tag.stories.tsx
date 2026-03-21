import type { Meta, StoryObj } from '@storybook/react';

import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Common/Tag',
  component: Tag,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof Tag>;

export const ML: Story = { args: { tag: 'ML' } };
export const TrustStar: Story = { args: { tag: 'Trust ★' } };
export const LLMStar: Story = { args: { tag: 'LLM ★' } };
export const Unknown: Story = { args: { tag: 'UnknownTag' } };
