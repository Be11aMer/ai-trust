import React from 'react';

import { PHASE_ORDER, PHASE_COLORS, PHASE_LABELS } from '@/constants';

const VIRTUAL_W = 1800;
const VIRTUAL_H = 1200;

/**
 * Renders SVG background bands, one per phase column.
 */
export function PhaseBands(): React.JSX.Element {
  return (
    <>
      {PHASE_ORDER.map((phase, pi) => {
        const col = PHASE_COLORS[phase];
        const bandW = VIRTUAL_W / PHASE_ORDER.length;
        const cx = (pi + 0.5) * bandW;
        return (
          <g key={phase}>
            <rect
              x={cx - bandW / 2 + 6}
              y={10}
              width={bandW - 12}
              height={VIRTUAL_H - 20}
              fill={`${col}03`}
              stroke={`${col}10`}
              strokeWidth="1"
              rx="8"
            />
            <text
              x={cx}
              y={30}
              textAnchor="middle"
              fill={col}
              opacity={0.45}
              fontFamily="'JetBrains Mono',monospace"
              fontSize="11"
              fontWeight="700"
              letterSpacing="0.1em"
            >
              {PHASE_LABELS[phase].toUpperCase()}
            </text>
          </g>
        );
      })}
    </>
  );
}
