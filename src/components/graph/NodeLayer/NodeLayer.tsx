import React from 'react';

import { PHASE_COLORS, C } from '@/constants';
import type { EnrichedStep } from '@/types/learning';
import type { PositionMap } from '@/types/graph';
import type { ProgressMap, NotesMap, LinksMap } from '@/types/storage';

/** Props for NodeGlyph. */
export interface NodeGlyphProps {
  node: EnrichedStep;
  position: { x: number; y: number };
  done: boolean;
  isSelected: boolean;
  isHovered: boolean;
  isConnected: boolean;
  isDimmed: boolean;
  hasArtifacts: boolean;
  onSelect: (id: number) => void;
  onHover: (id: number | null) => void;
}

const NODE_RADIUS_SELECTED = 26;
const NODE_RADIUS_HOVERED = 22;
const NODE_RADIUS_DEFAULT = 18;
const LABEL_MAX_LEN = 14;

/**
 * Single node glyph: circle, step number, completion checkmark, trust badge, artifact dot, tooltip.
 */
export function NodeGlyph({
  node,
  position,
  done,
  isSelected,
  isHovered,
  isConnected: _isConnected,
  isDimmed,
  hasArtifacts,
  onSelect,
  onHover,
}: NodeGlyphProps): React.JSX.Element {
  const col = PHASE_COLORS[node.phaseId];
  const r = isSelected ? NODE_RADIUS_SELECTED : isHovered ? NODE_RADIUS_HOVERED : NODE_RADIUS_DEFAULT;
  const isTrust = node.tag?.includes('★');
  const { x, y } = position;

  return (
    <g
      className="ng"
      transform={`translate(${x},${y})`}
      style={{ cursor: 'pointer', opacity: isDimmed ? 0.18 : 1, transition: 'opacity 0.15s' }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      role="button"
      tabIndex={0}
      aria-label={`Step ${node.id}: ${node.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelect(node.id);
      }}
    >
      {done && <circle r={r + 11} fill={`url(#g${node.id})`} />}
      {isSelected && (
        <circle
          r={r + 6}
          fill="none"
          stroke={col}
          strokeWidth="1.5"
          strokeOpacity="0.5"
          strokeDasharray="3 2"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0"
            to="360"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      <circle
        r={r}
        fill={done ? `${col}25` : C.surfaceHi}
        stroke={done ? col : isHovered ? col : `${col}35`}
        strokeWidth={isSelected ? 2.5 : done ? 1.8 : 1}
      />
      <text
        textAnchor="middle"
        dy={done ? '-3' : '5'}
        fill={done ? col : C.muted}
        fontFamily="'JetBrains Mono',monospace"
        fontSize={isSelected || isHovered ? '13' : '10'}
        fontWeight="800"
      >
        {String(node.id).padStart(2, '0')}
      </text>
      {done && (
        <text
          textAnchor="middle"
          dy="10"
          fill={col}
          fontFamily="'JetBrains Mono',monospace"
          fontSize="9"
          fontWeight="700"
        >
          ✓
        </text>
      )}
      {isTrust && (
        <text x={r - 4} y={-r + 5} textAnchor="middle" fontSize="10">
          ⭐
        </text>
      )}
      {hasArtifacts && (
        <circle cx={r - 2} cy={r - 2} r="4" fill={C.yellow} stroke={C.bg} strokeWidth="1.5" />
      )}
      {(isHovered || isSelected) && (
        <g>
          <rect
            x={-46}
            y={r + 5}
            width="92"
            height="17"
            rx="3"
            fill={C.surface}
            stroke={`${col}50`}
            strokeWidth="1"
          />
          <text
            x="0"
            y={r + 16}
            textAnchor="middle"
            fill={col}
            fontFamily="'JetBrains Mono',monospace"
            fontSize="9"
            fontWeight="700"
          >
            {node.short.length > LABEL_MAX_LEN ? `${node.short.slice(0, LABEL_MAX_LEN)}…` : node.short}
          </text>
        </g>
      )}
    </g>
  );
}

/** Props for NodeLayer. */
export interface NodeLayerProps {
  nodes: EnrichedStep[];
  positions: PositionMap;
  visibleIds: Set<number>;
  selectedNode: number | null;
  hoveredNode: number | null;
  connectedIds: Set<number>;
  progress: ProgressMap;
  notes: NotesMap;
  links: LinksMap;
  onSelect: (id: number) => void;
  onHover: (id: number | null) => void;
}

/**
 * Renders all node glyphs.
 * Also injects SVG radial gradient defs needed for completed node halos.
 */
export function NodeLayer({
  nodes,
  positions,
  visibleIds,
  selectedNode,
  hoveredNode,
  connectedIds,
  progress,
  notes,
  links,
  onSelect,
  onHover,
}: NodeLayerProps): React.JSX.Element {
  return (
    <>
      <defs>
        {nodes.map((n) => (
          <radialGradient key={n.id} id={`g${n.id}`} cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              stopColor={PHASE_COLORS[n.phaseId]}
              stopOpacity={progress[n.id] ? 0.35 : 0.04}
            />
            <stop offset="100%" stopColor={PHASE_COLORS[n.phaseId]} stopOpacity={0} />
          </radialGradient>
        ))}
      </defs>
      {nodes.map((n) => {
        if (!positions[n.id]) return null;
        const vis = visibleIds.has(n.id);
        const isSelected = selectedNode === n.id;
        const isHovered = hoveredNode === n.id;
        const isConnected = connectedIds.has(n.id);
        const isDimmed = !vis || (selectedNode !== null && !isSelected && !isConnected);
        const hasArtifacts = !!(notes[n.id] || (links[n.id] ?? []).length);
        return (
          <NodeGlyph
            key={n.id}
            node={n}
            position={positions[n.id]}
            done={!!progress[n.id]}
            isSelected={isSelected}
            isHovered={isHovered}
            isConnected={isConnected}
            isDimmed={isDimmed}
            hasArtifacts={hasArtifacts}
            onSelect={onSelect}
            onHover={onHover}
          />
        );
      })}
    </>
  );
}
