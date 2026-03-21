import React, { useState, useEffect } from 'react';

import { C } from '@/constants/colors';

/** Props for the NoteArea component. */
export interface NoteAreaProps {
  /** Step id for aria labelling. */
  id: number;
  /** Current note value. */
  value: string;
  /** Callback fired on textarea blur with the current text value. */
  onSave: (id: number, text: string) => void;
}

/**
 * Controlled textarea for user notes.
 * Maintains local state and calls `onSave` on blur.
 * This prevents unnecessary store writes on every keystroke.
 */
export function NoteArea({ id, value, onSave }: NoteAreaProps): React.JSX.Element {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <textarea
      id={`note-${id}`}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => onSave(id, local)}
      placeholder="Resources, insights, connections to CDDBS projects…"
      style={{
        width: '100%',
        background: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: '5px',
        color: '#94a3b8',
        fontSize: '11px',
        fontFamily: "'IBM Plex Mono',monospace",
        padding: '7px 10px',
        resize: 'vertical',
        minHeight: '60px',
        outline: 'none',
        boxSizing: 'border-box',
        lineHeight: '1.5',
      }}
    />
  );
}
