import { describe, it, expect } from 'vitest';
import { sanitiseUrl, displayUrl } from './sanitiseUrl';

describe('sanitiseUrl', () => {
  it('returns empty string for empty input', () => {
    expect(sanitiseUrl('')).toBe('');
    expect(sanitiseUrl('   ')).toBe('');
  });

  it('prepends https:// for bare domain', () => {
    expect(sanitiseUrl('github.com/foo')).toBe('https://github.com/foo');
  });

  it('allows https:// URLs unchanged', () => {
    expect(sanitiseUrl('https://example.com/path')).toBe('https://example.com/path');
  });

  it('allows http:// URLs', () => {
    expect(sanitiseUrl('http://localhost:3000')).toBe('http://localhost:3000/');
  });

  it('blocks javascript: protocol — returns empty string', () => {
    expect(sanitiseUrl('javascript:alert(1)')).toBe('');
    expect(sanitiseUrl('JAVASCRIPT:alert(1)')).toBe('');
  });

  it('blocks data: protocol', () => {
    expect(sanitiseUrl('data:text/html,<script>alert(1)</script>')).toBe('');
  });

  it('blocks vbscript: protocol', () => {
    expect(sanitiseUrl('vbscript:MsgBox(1)')).toBe('');
  });

  it('blocks invalid/malformed URLs', () => {
    expect(sanitiseUrl('not a url !!!')).toBe('');
  });
});

describe('displayUrl', () => {
  it('returns full string if under limit', () => {
    expect(displayUrl('https://ok.com', 40)).toBe('https://ok.com');
  });

  it('truncates with ellipsis if over limit', () => {
    const result = displayUrl('https://very-long-url.example.com/path/to/resource', 20);
    expect(result).toHaveLength(21); // 20 chars + '…'
    expect(result.endsWith('…')).toBe(true);
  });
});
