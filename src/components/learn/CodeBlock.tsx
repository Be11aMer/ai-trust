import React, { useState } from 'react';
import { C } from '@/constants/colors';

export interface CodeBlockProps {
  code: string;
}

/**
 * Copy-to-clipboard code block for the Learn view.
 * Renders a scrollable, font-monospaced code area with a copy button.
 */
export function CodeBlock({ code }: CodeBlockProps): React.JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard api not available in some environments
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        background: '#050810',
        border: `1px solid ${C.border}`,
        borderRadius: '6px',
        marginTop: '10px',
        overflow: 'hidden',
      }}
    >
      {/* header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          borderBottom: `1px solid ${C.border}`,
          background: C.surface,
        }}
      >
        <span style={{ color: C.muted, fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', letterSpacing: '0.1em' }}>
          PYTHON
        </span>
        <button
          onClick={() => void handleCopy()}
          style={{
            background: copied ? `${C.green}20` : 'transparent',
            border: `1px solid ${copied ? C.green : C.border}`,
            color: copied ? C.green : C.muted,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '9px',
            padding: '2px 8px',
            borderRadius: '3px',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>

      {/* code body */}
      <pre
        style={{
          margin: 0,
          padding: '14px 16px',
          overflowX: 'auto',
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: '11px',
          lineHeight: '1.65',
          color: '#c9d1d9',
          whiteSpace: 'pre',
          maxHeight: '380px',
          overflowY: 'auto',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
