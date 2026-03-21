import { C } from '@/constants/colors';

/** Props for the MiniBar progress component. */
export interface MiniBarProps {
  /** Number of completed items. */
  value: number;
  /** Total number of items. */
  total: number;
  /** Accent color for the filled bar and count text when complete. */
  color: string;
}

/**
 * Compact horizontal progress bar used in phase headers and the legend.
 * Displays a thin bar and a `value/total` label, both coloured on completion.
 */
export function MiniBar({ value, total, color }: MiniBarProps): React.JSX.Element {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div
        style={{
          flex: 1,
          height: '3px',
          background: C.border,
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: '2px',
            transition: 'width 0.3s',
          }}
        />
      </div>
      <span
        style={{
          color: value === total ? color : C.muted,
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: '9px',
          fontWeight: '700',
          minWidth: '36px',
          textAlign: 'right',
        }}
      >
        {value}/{total}
      </span>
    </div>
  );
}
