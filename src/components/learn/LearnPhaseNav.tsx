import React from 'react';
import { C } from '@/constants/colors';
import { PHASE_REGISTRY } from '@/learn/index';
import type { LearnPhase, LearnStep } from '@/learn/types';

export interface LearnPhaseNavProps {
  phases: typeof PHASE_REGISTRY;
  activePhaseId: string;
  activeStepId: string | null;
  loadedPhase: LearnPhase | null;
  loading: boolean;
  onPhaseSelect: (phaseId: string) => void;
  onStepSelect: (stepId: string) => void;
}

/**
 * Left sidebar: phase list + step list for the active phase.
 */
export function LearnPhaseNav({
  phases,
  activePhaseId,
  activeStepId,
  loadedPhase,
  loading,
  onPhaseSelect,
  onStepSelect,
}: LearnPhaseNavProps): React.JSX.Element {
  return (
    <div
      style={{
        width: '200px',
        flexShrink: 0,
        borderRight: `1px solid ${C.border}`,
        overflowY: 'auto',
        background: C.surface,
      }}
    >
      {/* Phase list */}
      <div
        style={{
          padding: '10px 12px 6px',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            color: C.muted,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '8px',
            letterSpacing: '0.12em',
            marginBottom: '8px',
          }}
        >
          PHASES
        </div>
        {phases.map((phase) => (
          <button
            key={phase.id}
            onClick={() => onPhaseSelect(phase.id)}
            style={{
              width: '100%',
              textAlign: 'left',
              background:
                activePhaseId === phase.id ? `${phase.color}14` : 'transparent',
              border: `1px solid ${activePhaseId === phase.id ? phase.color + '40' : 'transparent'}`,
              borderRadius: '5px',
              padding: '6px 8px',
              marginBottom: '2px',
              cursor: phase.available ? 'pointer' : 'default',
              opacity: phase.available ? 1 : 0.45,
            }}
          >
            <div
              style={{
                color: activePhaseId === phase.id ? phase.color : C.muted,
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '9px',
                fontWeight: activePhaseId === phase.id ? '700' : '400',
                marginBottom: '1px',
              }}
            >
              {phase.title}
            </div>
            <div style={{ color: C.dim, fontSize: '9px', fontFamily: "'JetBrains Mono',monospace" }}>
              {phase.stepRange}
              {!phase.available && <span style={{ marginLeft: '4px', color: C.border }}>· soon</span>}
            </div>
          </button>
        ))}
      </div>

      {/* Step list for active phase */}
      <div style={{ padding: '10px 12px' }}>
        <div
          style={{
            color: C.muted,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '8px',
            letterSpacing: '0.12em',
            marginBottom: '8px',
          }}
        >
          STEPS
        </div>

        {loading && (
          <div style={{ color: C.dim, fontFamily: "'JetBrains Mono',monospace", fontSize: '9px' }}>
            loading…
          </div>
        )}

        {!loading && !loadedPhase && (
          <div style={{ color: C.dim, fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', lineHeight: 1.5 }}>
            Coming soon.
            <br />
            Attach the phase explainer +{' '}
            <code style={{ fontSize: '8px' }}>LEARN_CONTENT_SCHEMA.md</code>{' '}
            to Claude and use{' '}
            <code style={{ fontSize: '8px' }}>LEARN_CONTENT_PROMPT.md</code>.
          </div>
        )}

        {loadedPhase?.steps.map((step: LearnStep) => (
          <button
            key={step.id}
            onClick={() => onStepSelect(step.id)}
            style={{
              width: '100%',
              textAlign: 'left',
              background:
                activeStepId === step.id ? `${step.color}14` : 'transparent',
              border: `1px solid ${activeStepId === step.id ? step.color + '40' : 'transparent'}`,
              borderRadius: '5px',
              padding: '5px 8px',
              marginBottom: '2px',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  color: activeStepId === step.id ? step.color : C.muted,
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '8px',
                  flexShrink: 0,
                }}
              >
                {step.id}
              </span>
              <span
                style={{
                  color: activeStepId === step.id ? '#e2e8f0' : '#8899aa',
                  fontSize: '11px',
                  fontFamily: "'Crimson Pro',Georgia,serif",
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  minWidth: 0,
                }}
              >
                {step.title}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
