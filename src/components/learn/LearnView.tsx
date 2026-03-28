import React, { useState, useEffect, useCallback } from 'react';
import { C } from '@/constants/colors';
import { PHASE_REGISTRY } from '@/learn/index';
import type { LearnPhase } from '@/learn/types';
import { LearnPhaseNav } from './LearnPhaseNav';
import { LearnStepDetail } from './LearnStepDetail';

export interface LearnViewProps {
  /** If set, jump straight to this step on mount (from Path View "Study" button). */
  initialStepId?: string | null;
}

/**
 * Top-level Learn view — composites PhaseNav + StepDetail with lazy-loaded phase content.
 */
export function LearnView({ initialStepId }: LearnViewProps): React.JSX.Element {
  const [activePhaseId, setActivePhaseId] = useState('foundation');
  const [activeStepId, setActiveStepId] = useState<string | null>(initialStepId ?? '01');
  const [loadedPhase, setLoadedPhase] = useState<LearnPhase | null>(null);
  const [loading, setLoading] = useState(false);

  const loadPhase = useCallback(async (phaseId: string): Promise<void> => {
    const entry = PHASE_REGISTRY.find((p) => p.id === phaseId);
    if (!entry?.available) {
      setLoadedPhase(null);
      return;
    }
    setLoading(true);
    try {
      const mod = await entry.load();
      setLoadedPhase(mod.default);
    } catch {
      setLoadedPhase(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load phase on mount and on phase change
  useEffect(() => {
    void loadPhase(activePhaseId);
  }, [activePhaseId, loadPhase]);

  // Jump to step if initialStepId changes (cross-link from Path View)
  useEffect(() => {
    if (initialStepId) {
      setActiveStepId(initialStepId);
      // resolve which phase this step belongs to
      const entry = PHASE_REGISTRY.find((p) => {
        const [start, end] = p.stepRange.split('–').map(Number);
        const stepNum = parseInt(initialStepId, 10);
        return stepNum >= start && stepNum <= end;
      });
      if (entry) setActivePhaseId(entry.id);
    }
  }, [initialStepId]);

  const handlePhaseSelect = (phaseId: string): void => {
    setActivePhaseId(phaseId);
    setActiveStepId(null);
  };

  const handleStepSelect = (stepId: string): void => {
    setActiveStepId(stepId);
  };

  const activeStep = loadedPhase?.steps.find((s) => s.id === activeStepId) ?? loadedPhase?.steps[0] ?? null;
  const activeStepIndex = loadedPhase?.steps.findIndex((s) => s.id === activeStep?.id) ?? 0;
  const activePhase = PHASE_REGISTRY.find((p) => p.id === activePhaseId);

  const handlePrev = (): void => {
    if (!loadedPhase || activeStepIndex <= 0) return;
    setActiveStepId(loadedPhase.steps[activeStepIndex - 1].id);
  };

  const handleNext = (): void => {
    if (!loadedPhase || activeStepIndex >= loadedPhase.steps.length - 1) return;
    setActiveStepId(loadedPhase.steps[activeStepIndex + 1].id);
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        background: C.bg,
      }}
    >
      {/* Phase + step nav */}
      <LearnPhaseNav
        phases={PHASE_REGISTRY}
        activePhaseId={activePhaseId}
        activeStepId={activeStepId}
        loadedPhase={loadedPhase}
        loading={loading}
        onPhaseSelect={handlePhaseSelect}
        onStepSelect={handleStepSelect}
      />

      {/* Main content area */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Phase banner */}
        <div
          style={{
            padding: '8px 18px',
            borderBottom: `1px solid ${C.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
            background: activePhase ? `${activePhase.color}08` : 'transparent',
          }}
        >
          <span
            style={{
              color: activePhase?.color ?? C.muted,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '9px',
              letterSpacing: '0.12em',
              fontWeight: '700',
            }}
          >
            ◳ LEARN
          </span>
          <span style={{ color: C.border }}>·</span>
          <span
            style={{
              color: activePhase?.color ?? C.muted,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '9px',
            }}
          >
            {activePhase?.title?.toUpperCase() ?? ''}
          </span>
          {loadedPhase && (
            <>
              <span style={{ color: C.border }}>·</span>
              <span
                style={{
                  color: C.muted,
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '9px',
                }}
              >
                {loadedPhase.stepRange} · {loadedPhase.duration}
              </span>
            </>
          )}
        </div>

        {/* Step detail or placeholder */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {loading && (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: C.muted,
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '11px',
              }}
            >
              loading phase content…
            </div>
          )}

          {!loading && !loadedPhase && (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '40px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  color: activePhase?.color ?? C.muted,
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '28px',
                }}
              >
                ◳
              </div>
              <div
                style={{
                  color: '#e2e8f0',
                  fontFamily: "'Crimson Pro',Georgia,serif",
                  fontSize: '20px',
                  fontWeight: '700',
                }}
              >
                {activePhase?.title ?? 'Phase'} — Coming Soon
              </div>
              <p style={{ color: C.muted, fontSize: '12px', maxWidth: '420px', lineHeight: 1.65 }}>
                Generate content using{' '}
                <code
                  style={{
                    color: activePhase?.color ?? C.muted,
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '11px',
                  }}
                >
                  docs/LEARN_CONTENT_PROMPT.md
                </code>
                , attach the phase explainer from{' '}
                <code
                  style={{
                    color: activePhase?.color ?? C.muted,
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '11px',
                  }}
                >
                  CONTEXT/
                </code>
                , then add the output to{' '}
                <code
                  style={{
                    color: activePhase?.color ?? C.muted,
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '11px',
                  }}
                >
                  src/learn/content/
                </code>
                .
              </p>
            </div>
          )}

          {!loading && loadedPhase && activeStep && (
            <LearnStepDetail
              step={activeStep}
              phaseColor={activePhase?.color ?? C.muted}
              stepIndex={activeStepIndex}
              totalSteps={loadedPhase.steps.length}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          )}
        </div>
      </div>
    </div>
  );
}
