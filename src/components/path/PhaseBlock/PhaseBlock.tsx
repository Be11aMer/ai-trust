import React from 'react';

import { C } from '@/constants';
import { MiniBar } from '@/components/common/MiniBar/MiniBar';
import { StepCard } from '@/components/path/StepCard/StepCard';
import type { Phase, EnrichedStep } from '@/types/learning';
import type { ProgressMap, NotesMap, LinksMap } from '@/types/storage';

/** Props for PhaseBlock. */
export interface PhaseBlockProps {
  phase: Phase;
  enrichedSteps: EnrichedStep[];
  progress: ProgressMap;
  notes: NotesMap;
  links: LinksMap;
  expandedId: number | null;
  onToggle: (id: number) => void;
  onSaveNote: (id: number, text: string) => void;
  onAddLink: (id: number, url: string) => void;
  onRemoveLink: (id: number, url: string) => void;
  onExpand: (id: number) => void;
  onGraphFocus: (id: number) => void;
  onLearnFocus: (stepId: string) => void;
}

/**
 * A block of step cards for a single phase including its header.
 */
export function PhaseBlock({
  phase,
  enrichedSteps,
  progress,
  notes,
  links,
  expandedId,
  onToggle,
  onSaveNote,
  onAddLink,
  onRemoveLink,
  onExpand,
  onGraphFocus,
  onLearnFocus,
}: PhaseBlockProps): React.JSX.Element {
  const done = enrichedSteps.filter((s) => progress[s.id]).length;
  return (
    <div style={{ marginBottom: '28px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: `1px solid ${phase.color}20`,
        }}
      >
        <span style={{ fontSize: '15px' }}>{phase.icon}</span>
        <span
          style={{
            color: phase.color,
            fontFamily: "'Crimson Pro',Georgia,serif",
            fontSize: '16px',
            fontWeight: '700',
          }}
        >
          {phase.label}
        </span>
        <span
          style={{
            color: C.muted,
            fontFamily: "'IBM Plex Mono',monospace",
            fontSize: '10px',
            flex: 1,
          }}
        >
          {phase.desc}
        </span>
        <MiniBar value={done} total={enrichedSteps.length} color={phase.color} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {enrichedSteps.map((step) => (
          <StepCard
            key={step.id}
            step={step}
            done={!!progress[step.id]}
            note={notes[step.id] ?? ''}
            links={links[step.id] ?? []}
            expanded={expandedId === step.id}
            onToggle={onToggle}
            onSaveNote={onSaveNote}
            onAddLink={onAddLink}
            onRemoveLink={onRemoveLink}
            onExpand={onExpand}
            onGraphFocus={onGraphFocus}
            onLearnFocus={onLearnFocus}
          />
        ))}
      </div>
    </div>
  );
}
