import React, { useEffect, useRef, useState } from 'react';

import { ALL_STEPS, EDGES, C } from '@/constants';
import { useGraphLayout } from '@/hooks/useGraphLayout';
import { useGraphInteraction } from '@/hooks/useGraphInteraction';
import { useGraphFilter } from '@/hooks/useGraphFilter';
import { PhaseBands } from '@/components/graph/PhaseBands/PhaseBands';
import { EdgeLayer } from '@/components/graph/EdgeLayer/EdgeLayer';
import { NodeLayer } from '@/components/graph/NodeLayer/NodeLayer';
import { NodeDetailPanel } from '@/components/graph/NodeDetailPanel/NodeDetailPanel';
import { GraphFilters } from '@/components/graph/GraphFilters/GraphFilters';
import type { GraphFilterMode, ViewMode } from '@/types';
import type { ProgressMap, NotesMap, LinksMap } from '@/types/storage';

const VIRTUAL_W = 1800;
const VIRTUAL_H = 1200;
const FOCUS_ZOOM = 1.4;

/** Props for GraphView. */
export interface GraphViewProps {
  progress: ProgressMap;
  notes: NotesMap;
  links: LinksMap;
  focusNodeId: number | null;
  onClearFocus: () => void;
  onToggle: (id: number) => void;
  onSaveNote: (id: number, text: string) => void;
  onAddLink: (id: number, url: string) => void;
  onRemoveLink: (id: number, url: string) => void;
  onSwitchView: (view: ViewMode, phase: string, stepId: number) => void;
}

/**
 * Graph view orchestrator.
 * Pure orchestrator — no business logic; wires hooks and child components.
 * Receives ILayoutEngine via LayoutEngineContext (wired in App.tsx).
 */
export function GraphView({
  progress,
  notes,
  links,
  focusNodeId,
  onClearFocus,
  onToggle,
  onSaveNote,
  onAddLink,
  onRemoveLink,
  onSwitchView,
}: GraphViewProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 500 });
  const [graphReady, setGraphReady] = useState(false);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [graphFilter, setGraphFilter] = useState<GraphFilterMode>('all');

  const { positions, computePositions } = useGraphLayout();
  const { transform, dragging, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel, setTransform } =
    useGraphInteraction();
  const visibleIds = useGraphFilter(graphFilter, progress);

  // Compute layout on first mount
  useEffect(() => {
    if (graphReady) return;
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const vw = Math.max(300, width);
        const vh = Math.max(300, height);
        setDims({ w: vw, h: vh });
        const scaleX = vw / VIRTUAL_W;
        const scaleY = vh / VIRTUAL_H;
        const k = Math.min(scaleX, scaleY) * 0.92;
        setTransform({ x: (vw - VIRTUAL_W * k) / 2, y: (vh - VIRTUAL_H * k) / 2, k });
        computePositions();
        setGraphReady(true);
      }
    }, 50);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle focus from path view
  useEffect(() => {
    if (focusNodeId !== null && positions) {
      setSelectedNode(focusNodeId);
      const pos = positions[focusNodeId];
      if (pos) {
        setTransform({
          x: dims.w / 2 - pos.x * FOCUS_ZOOM,
          y: dims.h / 2 - pos.y * FOCUS_ZOOM,
          k: FOCUS_ZOOM,
        });
      }
      onClearFocus();
    }
  }, [focusNodeId, positions, dims, onClearFocus, setTransform]);

  const connectedIds = selectedNode !== null
    ? new Set(
        EDGES.filter(([a, b]) => a === selectedNode || b === selectedNode).flatMap(([a, b]) => [a, b]),
      )
    : new Set<number>();

  const selNode = ALL_STEPS.find((s) => s.id === selectedNode);

  const handleSelectNode = (id: number): void => {
    setSelectedNode((prev) => (prev === id ? null : id));
  };

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* Canvas */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).closest('.ng')) return;
          handleMouseDown(e);
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <GraphFilters filterMode={graphFilter} onChange={setGraphFilter} />

        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            zIndex: 10,
            color: C.dim,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '8px',
          }}
        >
          scroll to zoom · drag to pan · click node · ◈ in path view focuses here
        </div>

        {!graphReady || !positions ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                color: C.muted,
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '11px',
              }}
            >
              computing layout…
            </span>
          </div>
        ) : (
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
              <PhaseBands />
              <EdgeLayer
                edges={EDGES}
                positions={positions}
                visibleIds={visibleIds}
                progress={progress}
                selectedNode={selectedNode}
              />
              <NodeLayer
                nodes={ALL_STEPS}
                positions={positions}
                visibleIds={visibleIds}
                selectedNode={selectedNode}
                hoveredNode={hoveredNode}
                connectedIds={connectedIds}
                progress={progress}
                notes={notes}
                links={links}
                onSelect={handleSelectNode}
                onHover={setHoveredNode}
              />
            </g>
          </svg>
        )}
        {selectedNode !== null && (
          <div
            style={{ position: 'absolute', inset: 0, zIndex: 0 }}
            onClick={() => setSelectedNode(null)}
          />
        )}
      </div>

      {/* Detail panel */}
      <div
        style={{
          width: selNode ? '290px' : '0',
          minWidth: selNode ? '290px' : '0',
          background: C.surface,
          borderLeft: `1px solid ${C.border}`,
          overflow: 'hidden',
          transition: 'min-width 0.2s, width 0.2s',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {selNode && (
          <NodeDetailPanel
            node={selNode}
            progress={progress}
            notes={notes}
            links={links}
            onClose={() => setSelectedNode(null)}
            onToggle={onToggle}
            onSaveNote={onSaveNote}
            onAddLink={onAddLink}
            onRemoveLink={onRemoveLink}
            onGoToPath={(phaseId, stepId) => {
              onSwitchView('path', phaseId, stepId);
              setSelectedNode(null);
            }}
            onSelectNode={handleSelectNode}
          />
        )}
      </div>
    </div>
  );
}
