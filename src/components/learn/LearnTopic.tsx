import React, { useState } from 'react';
import { C } from '@/constants/colors';
import type { LearnTopic as LearnTopicData } from '@/learn/types';
import { CodeBlock } from './CodeBlock';

export interface LearnTopicProps {
  topic: LearnTopicData;
}

const TAG_LABEL: Record<string, string> = {
  'Essential': 'ESSENTIAL',
  'AI Trust ★': 'AI TRUST ★',
  'Production': 'PRODUCTION',
  'Project': 'PROJECT',
};

/**
 * Expandable topic card — shows tag, summary, and expandable bullet points + optional code block.
 */
export function LearnTopic({ topic }: LearnTopicProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [showCode, setShowCode] = useState(false);

  return (
    <div
      style={{
        background: C.surfaceHi,
        border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${topic.tagColor}`,
        borderRadius: '6px',
        marginBottom: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Topic header */}
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width: '100%',
          padding: '10px 14px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            flexShrink: 0,
            marginTop: '1px',
            color: open ? topic.tagColor : C.muted,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '10px',
            transition: 'color 0.12s',
          }}
        >
          {open ? '▼' : '▶'}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                color: '#e2e8f0',
                fontFamily: "'Crimson Pro',Georgia,serif",
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              {topic.title}
            </span>
            <span
              style={{
                background: `${topic.tagColor}18`,
                border: `1px solid ${topic.tagColor}50`,
                color: topic.tagColor,
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '8px',
                padding: '1px 6px',
                borderRadius: '3px',
                letterSpacing: '0.08em',
                flexShrink: 0,
              }}
            >
              {TAG_LABEL[topic.tag] ?? topic.tag}
            </span>
          </div>
          <div style={{ color: C.muted, fontSize: '11px', marginTop: '2px', lineHeight: 1.4 }}>
            {topic.summary}
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div style={{ padding: '0 14px 14px 36px' }}>
          {/* Points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
            {topic.points.map((pt) => (
              <div
                key={pt.label}
                style={{
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: '4px',
                  padding: '7px 10px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '10px',
                    color: topic.tagColor,
                    display: 'block',
                    marginBottom: '2px',
                  }}
                >
                  {pt.label}
                </span>
                <span style={{ fontSize: '12px', color: '#b0b8c4', lineHeight: 1.5 }}>
                  {pt.detail}
                </span>
              </div>
            ))}
          </div>

          {/* Code toggle */}
          {topic.code && (
            <>
              <button
                onClick={() => setShowCode((p) => !p)}
                style={{
                  background: showCode ? `${topic.tagColor}12` : 'transparent',
                  border: `1px solid ${showCode ? topic.tagColor + '40' : C.border}`,
                  color: showCode ? topic.tagColor : C.muted,
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '9px',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.12s',
                  marginBottom: showCode ? '4px' : '0',
                }}
              >
                {showCode ? '▲ hide code' : '▶ show code'}
              </button>
              {showCode && <CodeBlock code={topic.code} />}
            </>
          )}
        </div>
      )}
    </div>
  );
}
