import React, { useState } from 'react';

import { C } from '@/constants/colors';
import { sanitiseUrl } from '@/utils/sanitiseUrl';

/** Props for the LinkInput component. */
export interface LinkInputProps {
  /** Step id the link belongs to. */
  id: number;
  /** Callback to add a URL. Called only if the URL passes sanitisation. */
  onAdd: (id: number, url: string) => void;
}

/**
 * Compact URL input that sanitises then adds a link on Enter key or button click.
 * Rejects `javascript:`, `data:`, and `vbscript:` protocols at input time.
 * Shows a brief inline error if the URL is dangerous/invalid.
 * Clears itself after successful submission.
 */
export function LinkInput({ id, onAdd }: LinkInputProps): React.JSX.Element {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const submit = (): void => {
    const clean = sanitiseUrl(value);
    if (value.trim() && !clean) {
      setError('Invalid URL — only https:// and http:// are allowed.');
      return;
    }
    setError('');
    onAdd(id, value);
    setValue('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <div style={{ display: 'flex', gap: '5px' }}>
        <input
          id={`link-input-${id}`}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          placeholder="github.com/… or notebook URL"
          aria-describedby={error ? `link-error-${id}` : undefined}
          style={{
            flex: 1,
            background: C.bg,
            border: `1px solid ${error ? '#f87171' : C.border}`,
            borderRadius: '4px',
            color: '#94a3b8',
            fontSize: '10px',
            fontFamily: "'IBM Plex Mono',monospace",
            padding: '5px 8px',
            outline: 'none',
          }}
        />
        <button
          id={`link-add-btn-${id}`}
          onClick={submit}
          type="button"
          style={{
            background: `${C.orange}15`,
            border: `1px solid ${C.orange}40`,
            color: C.orange,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '9px',
            fontWeight: '700',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          + ADD
        </button>
      </div>
      {error && (
        <span
          id={`link-error-${id}`}
          role="alert"
          style={{
            color: '#f87171',
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '8px',
          }}
        >
          ⚠ {error}
        </span>
      )}
    </div>
  );
}
