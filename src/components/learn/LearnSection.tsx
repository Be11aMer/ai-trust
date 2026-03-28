import React, { useState } from 'react';
import { C } from '@/constants/colors';
import type { LearnSection as LearnSectionData } from '@/learn/types';
import { LearnTopic } from './LearnTopic';

export interface LearnSectionProps {
  section: LearnSectionData;
  defaultOpen?: boolean;
}

/**
 * Collapsible section block containing multiple LearnTopic cards.
 */
export function LearnSection({ section, defaultOpen = true }: LearnSectionProps): React.JSX.Element {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '12px',
      }}
    >
      {/* Section header */}
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width: '100%',
          background: open ? `${section.color}08` : C.surface,
          border: 'none',
          borderBottom: open ? `1px solid ${C.border}` : 'none',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          transition: 'background 0.12s',
          textAlign: 'left',
        }}
      >
        <span style={{ color: section.color, fontSize: '14px' }}>{section.icon}</span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: section.color,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '0.1em',
            }}
          >
            {section.title.toUpperCase()}
          </div>
          {!open && (
            <div style={{ color: C.muted, fontSize: '11px', marginTop: '1px' }}>
              {section.intro}
            </div>
          )}
        </div>
        <span
          style={{
            color: C.muted,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '10px',
            flexShrink: 0,
          }}
        >
          {open ? '▲' : '▼'} {section.topics.length} topics
        </span>
      </button>

      {/* Expanded section */}
      {open && (
        <div style={{ padding: '12px 14px' }}>
          <p style={{ color: '#8899aa', fontSize: '12px', margin: '0 0 12px 0', lineHeight: 1.6 }}>
            {section.intro}
          </p>
          {section.topics.map((topic) => (
            <LearnTopic key={topic.title} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
}
