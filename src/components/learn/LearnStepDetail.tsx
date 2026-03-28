import React from 'react';
import { C } from '@/constants/colors';
import type { LearnStep } from '@/learn/types';
import { LearnSection } from './LearnSection';

export interface LearnStepDetailProps {
  step: LearnStep;
  phaseColor: string;
  stepIndex: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Full step detail panel — hero banner, why text, connections sidebar, and sections.
 */
export function LearnStepDetail({
  step,
  phaseColor,
  stepIndex,
  totalSteps,
  onPrev,
  onNext,
}: LearnStepDetailProps): React.JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Hero header */}
      <div
        style={{
          padding: '16px 22px 14px',
          borderBottom: `1px solid ${C.border}`,
          background: `linear-gradient(135deg, ${step.color}0a 0%, transparent 60%)`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span
            style={{
              background: `${step.color}20`,
              border: `1px solid ${step.color}60`,
              color: step.color,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '10px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >
            STEP {step.id}
          </span>
          <span
            style={{
              color: C.muted,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '9px',
            }}
          >
            {step.duration}
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Crimson Pro',Georgia,serif",
            fontSize: '22px',
            fontWeight: '700',
            color: '#f1f5f9',
            margin: '0 0 4px 0',
            lineHeight: 1.2,
          }}
        >
          {step.title}
        </h2>
        <p
          style={{
            color: step.color,
            fontSize: '12px',
            margin: '0 0 12px 0',
            fontStyle: 'italic',
          }}
        >
          {step.tagline}
        </p>

        {/* Why box */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${step.color}`,
            borderRadius: '6px',
            padding: '10px 14px',
          }}
        >
          <div
            style={{
              color: step.color,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '8px',
              letterSpacing: '0.12em',
              marginBottom: '4px',
            }}
          >
            WHY THIS STEP
          </div>
          <p style={{ color: '#b0bec5', fontSize: '12px', margin: 0, lineHeight: 1.65 }}>
            {step.why}
          </p>
        </div>
      </div>

      {/* Body: connections + sections */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        {/* Connections sidebar */}
        <div
          style={{
            width: '180px',
            flexShrink: 0,
            borderRight: `1px solid ${C.border}`,
            padding: '14px 12px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              color: C.muted,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '8px',
              letterSpacing: '0.12em',
              marginBottom: '10px',
            }}
          >
            CONNECTIONS
          </div>
          {step.connections.map((conn) => (
            <div
              key={conn.label}
              style={{
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: '4px',
                padding: '6px 8px',
                marginBottom: '6px',
              }}
            >
              <div
                style={{
                  color: phaseColor,
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '9px',
                  fontWeight: '700',
                  marginBottom: '2px',
                }}
              >
                {conn.label}
              </div>
              <div style={{ color: C.muted, fontSize: '10px', lineHeight: 1.4 }}>{conn.desc}</div>
            </div>
          ))}
        </div>

        {/* Sections scroll area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px' }}>
          {step.sections.map((section, i) => (
            <LearnSection key={section.id} section={section} defaultOpen={i === 0} />
          ))}
        </div>
      </div>

      {/* Step navigation footer */}
      <div
        style={{
          borderTop: `1px solid ${C.border}`,
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          background: C.surface,
        }}
      >
        <button
          onClick={onPrev}
          disabled={stepIndex === 0}
          style={{
            background: 'transparent',
            border: `1px solid ${stepIndex === 0 ? C.border : C.muted}`,
            color: stepIndex === 0 ? C.dim : C.muted,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '10px',
            padding: '5px 12px',
            borderRadius: '4px',
            cursor: stepIndex === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          ← prev
        </button>
        <span style={{ color: C.muted, fontFamily: "'JetBrains Mono',monospace", fontSize: '10px' }}>
          {stepIndex + 1} / {totalSteps}
        </span>
        <button
          onClick={onNext}
          disabled={stepIndex === totalSteps - 1}
          style={{
            background: 'transparent',
            border: `1px solid ${stepIndex === totalSteps - 1 ? C.border : step.color}`,
            color: stepIndex === totalSteps - 1 ? C.dim : step.color,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '10px',
            padding: '5px 12px',
            borderRadius: '4px',
            cursor: stepIndex === totalSteps - 1 ? 'not-allowed' : 'pointer',
          }}
        >
          next →
        </button>
      </div>
    </div>
  );
}
