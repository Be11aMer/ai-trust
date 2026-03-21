import React, { useState, useRef } from 'react';

import { ForceLayoutEngine } from '@/services/graph/ForceLayoutEngine';
import { LayoutEngineContext } from '@/hooks/useGraphLayout';
import { TopBar } from '@/components/layout/TopBar/TopBar';
import { PhaseLegend } from '@/components/layout/PhaseLegend/PhaseLegend';
import { PathView } from '@/components/path/PathView/PathView';
import { GraphView } from '@/components/graph/GraphView/GraphView';
import type { ViewMode } from '@/types/learning';
import { C } from '@/constants/colors';
import type { LearningStore } from '@/store/useLearningStore';

/** Props for App — receives the store as a prop for testability. */
export interface AppProps {
  store: LearningStore;
}

/**
 * Root application component — view router and composition root.
 *
 * Responsibilities (only):
 * - Manage which view is active (path | graph)
 * - Coordinate focus handoff from PathView → GraphView
 * - Wire concrete dependencies (ForceLayoutEngine) into context
 * - Render TopBar, the active view, and PhaseLegend
 *
 * Zero business logic lives here — all delegated to store, hooks, and components.
 */
export function App({ store }: AppProps): React.JSX.Element {
  const [view, setView] = useState<ViewMode>('path');
  const [focusNodeId, setFocusNodeId] = useState<number | null>(null);
  const layoutEngineRef = useRef(new ForceLayoutEngine());

  const handleGraphFocus = (id: number): void => {
    setFocusNodeId(id);
    setView('graph');
  };

  const handleSwitchView = (targetView: ViewMode, _phase: string, _stepId: number): void => {
    setView(targetView);
  };

  if (!store.loaded) {
    return (
      <div
        style={{
          background: C.bg,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: C.muted,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '12px',
          }}
        >
          loading knowledge base…
        </span>
      </div>
    );
  }

  return (
    <LayoutEngineContext.Provider value={layoutEngineRef.current}>
      <div
        style={{
          background: C.bg,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'IBM Plex Mono',monospace",
          color: C.text,
          overflow: 'hidden',
        }}
      >
        <TopBar
          view={view}
          onViewChange={setView}
          progress={store.progress}
        />

        {view === 'path' && (
          <PathView
            progress={store.progress}
            notes={store.notes}
            links={store.links}
            onToggle={store.toggleDone}
            onSaveNote={store.saveNote}
            onAddLink={store.addLink}
            onRemoveLink={store.removeLink}
            onGraphFocus={handleGraphFocus}
          />
        )}

        {view === 'graph' && (
          <GraphView
            progress={store.progress}
            notes={store.notes}
            links={store.links}
            focusNodeId={focusNodeId}
            onClearFocus={() => setFocusNodeId(null)}
            onToggle={store.toggleDone}
            onSaveNote={store.saveNote}
            onAddLink={store.addLink}
            onRemoveLink={store.removeLink}
            onSwitchView={handleSwitchView}
          />
        )}

        <PhaseLegend progress={store.progress} />
      </div>
    </LayoutEngineContext.Provider>
  );
}
