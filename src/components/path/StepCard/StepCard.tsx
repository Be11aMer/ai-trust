import React from 'react';

import { EDGES, C } from '@/constants';
import { ALL_STEPS } from '@/constants/phases';
import { Tag } from '@/components/common/Tag/Tag';
import { NoteArea } from '@/components/common/NoteArea/NoteArea';
import { LinkInput } from '@/components/common/LinkInput/LinkInput';
import { sanitiseUrl, displayUrl } from '@/utils/sanitiseUrl';
import type { EnrichedStep } from '@/types/learning';

/** Props for StepCard. */
export interface StepCardProps {
  step: EnrichedStep;
  done: boolean;
  note: string;
  links: string[];
  expanded: boolean;
  onToggle: (id: number) => void;
  onSaveNote: (id: number, text: string) => void;
  onAddLink: (id: number, url: string) => void;
  onRemoveLink: (id: number, url: string) => void;
  onExpand: (id: number) => void;
  onGraphFocus: (id: number) => void;
}

const MAX_DESC_PREVIEW = 90;
const MAX_LINK_DISPLAY = 45;

/**
 * Card representing a single learning step in the path view.
 * Expands to show description, origin badge, dependencies, notes, and artifact links.
 */
export function StepCard({
  step,
  done,
  note,
  links,
  expanded,
  onToggle,
  onSaveNote,
  onAddLink,
  onRemoveLink,
  onExpand,
  onGraphFocus,
}: StepCardProps): React.JSX.Element {
  const col = step.phaseColor;
  const isTrust = step.tag?.includes('★');
  const hasArtifacts = !!(note || links?.length);

  return (
    <div
      id={`step-card-${step.id}`}
      style={{
        background: done ? `${col}08` : C.surface,
        border: `1px solid ${done ? `${col}40` : C.border}`,
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'border-color 0.15s',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          padding: '10px 12px',
          cursor: 'pointer',
        }}
        onClick={() => onExpand(step.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onExpand(step.id);
        }}
        aria-expanded={expanded}
      >
        {/* Checkbox */}
        <div
          id={`checkbox-${step.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(step.id);
          }}
          role="checkbox"
          aria-checked={done}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.stopPropagation(); onToggle(step.id); }
          }}
          style={{
            width: '18px',
            height: '18px',
            flexShrink: 0,
            marginTop: '1px',
            borderRadius: '4px',
            border: `2px solid ${done ? col : C.dim}`,
            background: done ? col : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.12s',
          }}
        >
          {done && (
            <span style={{ color: '#000', fontSize: '11px', fontWeight: '800' }}>✓</span>
          )}
        </div>

        {/* Step number */}
        <span
          style={{
            color: done ? col : C.dim,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '11px',
            fontWeight: '700',
            minWidth: '22px',
            marginTop: '1px',
          }}
        >
          {String(step.id).padStart(2, '0')}
        </span>

        {/* Title + tag + badges */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              flexWrap: 'wrap',
              marginBottom: '2px',
            }}
          >
            <span
              style={{
                color: done ? col : '#cbd5e1',
                fontFamily: "'Crimson Pro',Georgia,serif",
                fontSize: '14px',
                fontWeight: '700',
                textDecoration: done ? 'line-through' : 'none',
                textDecorationColor: `${col}60`,
              }}
            >
              {step.title}
            </span>
            <Tag tag={step.tag} />
            {isTrust && <span style={{ fontSize: '10px' }}>⭐</span>}
            {hasArtifacts && (
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: C.yellow,
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
            )}
          </div>
          {!expanded && (
            <p
              style={{
                color: C.muted,
                fontSize: '11px',
                fontFamily: "'IBM Plex Mono',monospace",
                margin: 0,
                lineHeight: '1.5',
              }}
            >
              {step.desc.length > MAX_DESC_PREVIEW
                ? `${step.desc.slice(0, MAX_DESC_PREVIEW)}…`
                : step.desc}
            </p>
          )}
        </div>

        {/* Graph focus + expand chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <button
            id={`graph-focus-btn-${step.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onGraphFocus(step.id);
            }}
            title="Show in graph"
            style={{
              background: 'transparent',
              border: `1px solid ${C.border}`,
              color: C.muted,
              cursor: 'pointer',
              borderRadius: '3px',
              padding: '2px 6px',
              fontSize: '9px',
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            ◈
          </button>
          <span
            style={{
              color: C.dim,
              fontSize: '12px',
              transition: 'transform 0.15s',
              transform: expanded ? 'rotate(180deg)' : 'none',
            }}
          >
            ▾
          </span>
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div
          style={{
            padding: '0 12px 14px 44px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <p
            style={{
              color: '#94a3b8',
              fontSize: '12px',
              fontFamily: "'IBM Plex Mono',monospace",
              margin: 0,
              lineHeight: '1.6',
            }}
          >
            {step.desc}
          </p>

          {/* Canonical note from step data */}
          {step.note && (
            <div
              style={{
                background: `${col}10`,
                border: `1px solid ${col}25`,
                borderRadius: '5px',
                padding: '6px 10px',
              }}
            >
              <span
                style={{
                  color: col,
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '9px',
                  fontWeight: '700',
                }}
              >
                NOTE ·{' '}
              </span>
              <span
                style={{
                  color: '#64748b',
                  fontFamily: "'IBM Plex Mono',monospace",
                  fontSize: '10px',
                }}
              >
                {step.note}
              </span>
            </div>
          )}

          {/* Origin badges */}
          {step.origin === 'added' && (
            <span
              style={{
                color: C.orange,
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '9px',
                background: `${C.orange}12`,
                border: `1px solid ${C.orange}25`,
                padding: '2px 8px',
                borderRadius: '3px',
                width: 'fit-content',
              }}
            >
              ✦ ADDED FOR AI TRUST PATH
            </span>
          )}
          {step.origin === 'moved-earlier' && (
            <span
              style={{
                color: C.yellow,
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '9px',
                background: `${C.yellow}12`,
                border: `1px solid ${C.yellow}25`,
                padding: '2px 8px',
                borderRadius: '3px',
                width: 'fit-content',
              }}
            >
              ↑ MOVED EARLIER (AI Trust priority)
            </span>
          )}

          {/* Dependencies */}
          {EDGES.filter(([, b]) => b === step.id).length > 0 && (
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
                REQUIRES
              </div>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {EDGES.filter(([, b]) => b === step.id).map(([aId]) => {
                  const dep = ALL_STEPS.find((s) => s.id === aId);
                  if (!dep) return null;
                  return (
                    <span
                      key={aId}
                      style={{
                        background: `${dep.phaseColor}12`,
                        border: `1px solid ${dep.phaseColor}30`,
                        color: dep.phaseColor,
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: '8px',
                        padding: '2px 6px',
                        borderRadius: '3px',
                      }}
                    >
                      {String(aId).padStart(2, '0')}·{dep.short}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Your notes */}
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
              YOUR NOTES
            </div>
            <NoteArea id={step.id} value={note} onSave={onSaveNote} />
          </div>

          {/* Artifact links */}
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
            {links.map((lnk, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: '4px',
                  padding: '4px 8px',
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
                    fontSize: '10px',
                    flex: 1,
                    wordBreak: 'break-all',
                    textDecoration: 'none',
                  }}
                >
                  {displayUrl(lnk, MAX_LINK_DISPLAY)}
                </a>
                <button
                  id={`remove-link-btn-${step.id}-${i}`}
                  onClick={() => onRemoveLink(step.id, lnk)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: C.muted,
                    cursor: 'pointer',
                    fontSize: '13px',
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            <LinkInput id={step.id} onAdd={onAddLink} />
          </div>
        </div>
      )}
    </div>
  );
}
