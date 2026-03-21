import React, { useState } from 'react';

import { ALL_STEPS } from '@/constants/phases';
import { useStepFilter } from '@/hooks/useStepFilter';
import { PathFilters } from '@/components/path/PathFilters/PathFilters';
import { PhaseMiniMap } from '@/components/path/PhaseMiniMap/PhaseMiniMap';
import { PhaseBlock } from '@/components/path/PhaseBlock/PhaseBlock';
import type { FilterMode } from '@/types/learning';
import type { ProgressMap, NotesMap, LinksMap } from '@/types/storage';

/** Props for PathView. */
export interface PathViewProps {
  progress: ProgressMap;
  notes: NotesMap;
  links: LinksMap;
  onToggle: (id: number) => void;
  onSaveNote: (id: number, text: string) => void;
  onAddLink: (id: number, url: string) => void;
  onRemoveLink: (id: number, url: string) => void;
  onGraphFocus: (id: number) => void;
}

/**
 * Path view orchestrator.
 * Pure orchestrator — no business logic; delegates to child components and hooks.
 */
export function PathView({
  progress,
  notes,
  links,
  onToggle,
  onSaveNote,
  onAddLink,
  onRemoveLink,
  onGraphFocus,
}: PathViewProps): React.JSX.Element {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activePhase, setActivePhase] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  const visiblePhases = useStepFilter(filterMode, activePhase, progress);

  const handleExpand = (id: number): void => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <PathFilters
        filterMode={filterMode}
        activePhase={activePhase}
        onFilterChange={setFilterMode}
        onPhaseChange={setActivePhase}
      />
      <PhaseMiniMap
        progress={progress}
        activePhase={activePhase}
        onPhaseClick={setActivePhase}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px' }}>
        {visiblePhases.map((ph) => {
          const enrichedSteps = ph.steps.map((s) => {
            const full = ALL_STEPS.find((es) => es.id === s.id);
            return full!;
          });
          return (
            <PhaseBlock
              key={ph.id}
              phase={ph}
              enrichedSteps={enrichedSteps}
              progress={progress}
              notes={notes}
              links={links}
              expandedId={expandedId}
              onToggle={onToggle}
              onSaveNote={onSaveNote}
              onAddLink={onAddLink}
              onRemoveLink={onRemoveLink}
              onExpand={handleExpand}
              onGraphFocus={onGraphFocus}
            />
          );
        })}
      </div>
    </div>
  );
}
