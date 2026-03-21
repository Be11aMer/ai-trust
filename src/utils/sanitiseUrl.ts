/**
 * Allowed URL protocols for user-entered artifact links.
 * `javascript:`, `data:`, `vbscript:` and other attack vectors are blocked.
 */
const ALLOWED_PROTOCOLS = new Set(['https:', 'http:']);

/**
 * Sanitise a user-entered URL before rendering as an `href`.
 *
 * - Adds `https://` prefix if no protocol is present.
 * - Rejects any URL whose protocol is not in `ALLOWED_PROTOCOLS`.
 * - Returns an empty string for invalid/dangerous URLs.
 *
 * @example
 * sanitiseUrl('github.com/foo')    // → 'https://github.com/foo'
 * sanitiseUrl('javascript:alert') // → ''
 * sanitiseUrl('https://ok.com')   // → 'https://ok.com'
 */
export function sanitiseUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';

  // Prepend https:// if there is no protocol
  const withProtocol =
    trimmed.includes('://') ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) return '';
    return parsed.href;
  } catch {
    return '';
  }
}

/**
 * Return a truncated display label for a URL (for UI rendering only).
 * Never pass this to `href` — always use `sanitiseUrl` for that.
 */
export function displayUrl(url: string, maxLen: number): string {
  return url.length > maxLen ? `${url.slice(0, maxLen)}…` : url;
}
