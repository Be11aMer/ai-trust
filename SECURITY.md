# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest (`main`) | ✅ |
| older branches | ❌ |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Email: [your-security-email@domain.com]  
Response target: 48 hours.

Please include:
- Description of the vulnerability and affected code path
- Reproduction steps
- Impact assessment (what can an attacker do)
- Suggested fix if you have one

## Known Security Architecture

This is a **client-side only** React SPA. There is no backend, no authentication, and no server-side processing. All data is stored in `localStorage` on the user's own browser.

### Attack Surface

| Vector | Status | Mitigation |
|--------|--------|-----------|
| XSS via user-entered URLs | ✅ Mitigated | `sanitiseUrl()` in `src/utils/sanitiseUrl.ts` blocks `javascript:`, `data:`, `vbscript:` at input and render time |
| Clickjacking | ✅ Mitigated | `X-Frame-Options: DENY` via nginx |
| MIME sniffing | ✅ Mitigated | `X-Content-Type-Options: nosniff` via nginx |
| Malicious external links | ✅ Mitigated | All external `<a>` tags have `rel="noopener noreferrer"` |
| localStorage injection | ✅ Mitigated | All `JSON.parse` calls are wrapped in `try/catch` |
| CSP bypass | ✅ Mitigated | Content-Security-Policy in nginx blocks inline scripts and external script origins |
| Supply chain (npm) | ⚠️ Monitored | Run `npm audit` before each release; only `devDependencies` flagged |

### CSP Policy (Production)

```
default-src 'self'
script-src 'self'
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src 'self' https://fonts.gstatic.com
img-src 'self' data:
connect-src 'self'
frame-ancestors 'none'
base-uri 'self'
form-action 'self'
```

`'unsafe-inline'` on `style-src` is required because Vite injects critical CSS inline. There is no `'unsafe-eval'`.

## Development Dependencies

The following moderate CVEs exist in devDependencies (not shipped to production users):

- **GHSA-67mh-4wv8-2f99** (esbuild ≤0.24.2): Only affects the Vite dev server — a malicious web page could read dev server responses. **Not exploitable in production** (production uses nginx). Fixed in Vite ≥6.2.
- **vitest ≤2.2.0-beta.2**: Moderate, test-runner only, not in production bundle.

Run `npm audit` any time to see the current status.
