import React from 'react';

import { EDGES, PHASE_COLORS, PHASE_LABELS, ALL_STEPS, C } from '@/constants';
import { Tag } from '@/components/common/Tag/Tag';
import { NoteArea } from '@/components/common/NoteArea/NoteArea';
import { LinkInput } from '@/components/common/LinkInput/LinkInput';
import { sanitiseUrl, displayUrl } from '@/utils/sanitiseUrl';
import type { EnrichedStep } from '@/types/learning';
import type { ProgressMap, NotesMap, LinksMap } from '@/types/storage';

/** Props for NodeDetailPanel. */
export interface NodeDetailPanelProps {
  node: EnrichedStep;
  progress: ProgressMap;
  notes: NotesMap;
  links: LinksMap;
  onClose: () => void;
  onToggle: (id: number) => void;
  onSaveNote: (id: number, text: string) => void;
  onAddLink: (id: number, url: string) => void;
  onRemoveLink: (id: number, url: string) => void;
  onGoToPath: (phaseId: string, stepId: number) => void;
  onSelectNode: (id: number) => void;
}

const MAX_LINK_LEN = 34;

/**
 * Sliding side-panel showing full details for the selected graph node.
 */
export function NodeDetailPanel({
  node,
  progress,
  notes,
  links,
  onClose,
  onToggle,
  onSaveNote,
  onAddLink,
  onRemoveLink,
  onGoToPath,
  onSelectNode,
}: NodeDetailPanelProps): React.JSX.Element {
  const col = PHASE_COLORS[node.phaseId];
  const done = !!progress[node.id];
  const nodeLinks = links[node.id] ?? [];

  return (
    <>
      {/* Header */}
      <div
        style={{
          background: `${col}08`,
          borderBottom: `1px solid ${C.border}`,
          padding: '14px 16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}
            >
              <span
                style={{
                  color: col,
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '11px',
                  fontWeight: '800',
                }}
              >
                {String(node.id).padStart(2, '0')}
              </span>
              <Tag tag={node.tag} />
            </div>
            <div
              style={{
                fontFamily: "'Crimson Pro',Georgia,serif",
                fontSize: '15px',
                fontWeight: '700',
                color: '#f1f5f9',
                lineHeight: 1.3,
              }}
            >
              {node.title}
            </div>
            <div
              style={{
                color: `${col}90`,
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '9px',
                marginTop: '2px',
              }}
            >
              {PHASE_LABELS[node.phaseId]}
            </div>
          </div>
          <button
            id="detail-panel-close"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: C.muted,
              cursor: 'pointer',
              fontSize: '16px',
              lineHeight: 1,
              flexShrink: 0,
              marginLeft: '8px',
            }}
          >
            ×
          </button>
        </div>
        <p
          style={{
            color: '#94a3b8',
            fontSize: '11px',
            fontFamily: "'IBM Plex Mono',monospace",
            lineHeight: '1.6',
            margin: '10px 0',
          }}
        >
          {node.desc}
        </p>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            id={`toggle-btn-${node.id}`}
            onClick={() => onToggle(node.id)}
            style={{
              flex: 1,
              background: done ? `${col}20` : 'transparent',
              border: `1px solid ${col}50`,
              color: col,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '9px',
              fontWeight: '700',
              padding: '6px 0',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {done ? '✓ COMPLETED — undo' : '○ MARK COMPLETE'}
          </button>
          <button
            id={`go-to-path-btn-${node.id}`}
            onClick={() => onGoToPath(node.phaseId, node.id)}
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              color: C.muted,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '9px',
              padding: '6px 10px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            ≡ Path
          </button>
        </div>
      </div>

      {/* Connections */}
      <div style={{ padding: '10px 14px', borderBottom: `1px solid ${C.border}` }}>
        <div
          style={{
            color: C.muted,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '8px',
            letterSpacing: '0.1em',
            marginBottom: '5px',
          }}
        >
          CONNECTIONS
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {EDGES.filter(([a, b]) => a === node.id || b === node.id).map(([a, b]) => {
            const otherId = a === node.id ? b : a;
            const other = ALL_STEPS.find((s) => s.id === otherId);
            if (!other) return null;
            const isPrereq = b === node.id;
            return (
              <span
                key={otherId}
                onClick={() => onSelectNode(otherId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSelectNode(otherId);
                }}
                style={{
                  background: `${PHASE_COLORS[other.phaseId]}10`,
                  border: `1px solid ${PHASE_COLORS[other.phaseId]}25`,
                  color: progress[otherId] ? PHASE_COLORS[other.phaseId] : C.muted,
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '8px',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <span style={{ fontSize: '7px' }}>{isPrereq ? '↑' : '→'}</span>
                {String(otherId).padStart(2, '0')}
              </span>
            );
          })}
        </div>
      </div>

      {/* Artifacts */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div>
          <div
            style={{
              color: C.muted,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '8px',
              letterSpacing: '0.1em',
              marginBottom: '4px',
            }}
          >
            NOTES
          </div>
          <NoteArea id={node.id} value={notes[node.id] ?? ''} onSave={onSaveNote} />
        </div>
        <div>
          <div
            style={{
              color: C.muted,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '8px',
              letterSpacing: '0.1em',
              marginBottom: '4px',
            }}
          >
            ARTIFACTS & LINKS
          </div>
          {nodeLinks.map((lnk, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: '4px',
                padding: '4px 7px',
                marginBottom: '4px',
              }}
            >
              <span style={{ color: C.sky, fontSize: '9px', flexShrink: 0 }}>⬡</span>
              <a
                href={sanitiseUrl(lnk) || '#'}
                target={sanitiseUrl(lnk) ? '_blank' : undefined}
                rel="noopener noreferrer"
                style={{
                  color: C.sky,
                  fontFamily: "'IBM Plex Mono',monospace",
                  fontSize: '9px',
                  flex: 1,
                  wordBreak: 'break-all',
                  textDecoration: 'none',
                }}
              >
                {displayUrl(lnk, MAX_LINK_LEN)}
              </a>
              <button
                onClick={() => onRemoveLink(node.id, lnk)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: C.muted,
                  cursor: 'pointer',
                  fontSize: '12px',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          ))}
          <LinkInput id={node.id} onAdd={onAddLink} />
        </div>
      </div>
    </>
  );
}
