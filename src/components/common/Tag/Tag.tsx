import { TAG_COLORS, C } from '@/constants/colors';

/** Props for the Tag component. */
export interface TagProps {
  /** The tag string to render (e.g. "Trust ★", "ML"). */
  tag: string;
}

/**
 * Compact tag badge displaying a category label with its associated colour.
 * Falls back to muted colour for unknown tags.
 */
export function Tag({ tag }: TagProps): React.JSX.Element {
  const col = TAG_COLORS[tag] ?? C.muted;
  return (
    <span
      style={{
        background: `${col}18`,
        border: `1px solid ${col}40`,
        color: col,
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: '9px',
        fontWeight: '700',
        padding: '2px 7px',
        borderRadius: '3px',
        letterSpacing: '0.06em',
        whiteSpace: 'nowrap',
      }}
    >
      {tag}
    </span>
  );
}
