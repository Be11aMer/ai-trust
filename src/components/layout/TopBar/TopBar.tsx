import React from 'react';

import { ALL_STEPS, C } from '@/constants';
import type { ViewMode } from '@/types';
import { MiniBar } from '@/components/common/MiniBar/MiniBar';
import type { ProgressMap } from '@/types/storage';

/** Props for TopBar. */
export interface TopBarProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  progress: ProgressMap;
}

const VIEW_TABS: Array<[ViewMode, string]> = [
  ['path', '≡  Path'],
  ['graph', '◈  Graph'],
];

/**
 * Application top bar — branding, view switcher, global progress stats.
 * Single Responsibility: layout and display only; no business logic.
 */
export function TopBar({ view, onViewChange, progress }: TopBarProps): React.JSX.Element {
  const totalDone = ALL_STEPS.filter((s) => progress[s.id]).length;
  const trustSteps = ALL_STEPS.filter((s) => s.tag?.includes('★'));
  const trustDone = trustSteps.filter((s) => progress[s.id]).length;
  const nextStep = ALL_STEPS.find((s) => !progress[s.id]);

  return (
    <div
      style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        flexShrink: 0,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ marginRight: '4px' }}>
        <div
          style={{
            color: C.dim,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '8px',
            letterSpacing: '0.12em',
          }}
        >
          BELLAMER / CDDBS
        </div>
        <div
          style={{
            fontFamily: "'Crimson Pro',Georgia,serif",
            fontSize: '17px',
            fontWeight: '700',
            color: '#f1f5f9',
            lineHeight: 1.2,
          }}
        >
          AI Trust Learning Path
        </div>
      </div>

      {/* View toggle */}
      <div
        style={{
          display: 'flex',
          gap: '2px',
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: '6px',
          padding: '3px',
        }}
      >
        {VIEW_TABS.map(([id, label]) => (
          <button
            key={id}
            id={`view-tab-${id}`}
            onClick={() => onViewChange(id)}
            style={{
              background: view === id ? `${C.orange}18` : 'transparent',
              border: `1px solid ${view === id ? `${C.orange}50` : 'transparent'}`,
              color: view === id ? C.orange : C.muted,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '10px',
              fontWeight: view === id ? '700' : '400',
              padding: '5px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.12s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto', flexWrap: 'wrap' }}>
        <div
          style={{
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: '6px',
            padding: '5px 12px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: C.sky,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '18px',
              fontWeight: '800',
              lineHeight: 1,
            }}
          >
            {totalDone}
          </div>
          <div style={{ color: C.muted, fontSize: '8px', letterSpacing: '0.08em' }}>
            / {ALL_STEPS.length} DONE
          </div>
        </div>
        <div
          style={{
            background: C.bg,
            border: `1px solid ${C.orange}30`,
            borderRadius: '6px',
            padding: '5px 12px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: C.orange,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '18px',
              fontWeight: '800',
              lineHeight: 1,
            }}
          >
            {trustDone}
          </div>
          <div style={{ color: C.muted, fontSize: '8px', letterSpacing: '0.08em' }}>
            / {trustSteps.length} TRUST ★
          </div>
        </div>
        {nextStep && (
          <div
            style={{
              background: C.bg,
              border: `1px solid ${nextStep.phaseColor}25`,
              borderRadius: '6px',
              padding: '5px 12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                color: nextStep.phaseColor,
                fontSize: '8px',
                fontFamily: "'JetBrains Mono',monospace",
                letterSpacing: '0.08em',
                marginBottom: '1px',
              }}
            >
              NEXT UP
            </div>
            <div
              style={{
                color: '#e2e8f0',
                fontFamily: "'Crimson Pro',Georgia,serif",
                fontSize: '13px',
                fontWeight: '700',
              }}
            >
              {String(nextStep.id).padStart(2, '0')} ·{' '}
              {nextStep.title.length > 28 ? `${nextStep.title.slice(0, 28)}…` : nextStep.title}
            </div>
          </div>
        )}
        <div style={{ minWidth: '120px' }}>
          <MiniBar value={totalDone} total={ALL_STEPS.length} color={C.orange} />
        </div>
      </div>
    </div>
  );
}
