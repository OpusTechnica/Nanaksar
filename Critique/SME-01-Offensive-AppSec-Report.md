# SME-01 — Offensive Application Security (Client-Side Injection & Trust Boundaries)
**Agency:** CyberShield • **Expert:** Dr. Arjun "Interceptor" Mehta (14y, OSCP/OSWE, ex-fintech red-team lead)
**Mode:** Passive review only • **Scope:** Local code only, no live probing • **Permission:** READ-ONLY (no edits executed by SME)

## 1. Persona & Mandate
Offensive specialist for XSS, open-redirect, DOM-clobbering, and trust-boundary abuse in Astro SSG + React Islands. Thinks like an attacker with only a browser + DevTools.

## 2. Tasks Assigned
1. Trace every user-input → URL/DOM sink (booking, cart, dispatch, search).
2. Review inline scripts, `set:html`, `window.open`, `tel:`/`maps` links.
3. Rate exploitability under passive-only constraint (theoretical PoC strings, never fired).

## 3. Scope
**In:** `src/layouts/Layout.astro`, `src/components/Threshold.astro`, `src/components/TableReservationModal.tsx`, `src/components/BookTableInlineForm.tsx`, `src/components/CartDrawer.tsx`, `src/components/cart/DispatchForm.tsx`, `src/components/cart/TrayItem.tsx`, `src/components/StructuredData.astro`, `src/components/MenuExplorer.tsx`, `src/components/ui/LuxuryControls.tsx`, `src/components/Header.tsx`, `src/components/Footer.astro`
**Out:** Backend (none exists), live `wa.me` accounts, live `nanaksardhaba.com` headers.

## 4. Assumptions
- Site is pure SSG; no server validation exists (no `fetch('/api')` found).
- `encodeURIComponent` is the sole output-encoding control for WhatsApp deep links.
- Attacker can fully control DevTools: edit `localStorage`, cart store, URL params.

## 5. Constraints (Read-Only Enforcement)
- No payload execution, no form submit, no `window.open` firing, bridge never started.
- Findings are code-path reasoned + grep-verified, not dynamically confirmed.

## 6. Findings (with evidence)

### F1 [Medium] — PII + Free-text reflected into `wa.me?text=` GET URL (log-shouldering / injection carrier)
- `src/data/cartStore.ts:205-238` `buildWhatsAppOrderUrl(name, phone, notes)` interpolates `customerName/phone/notes` + item names into `text`, then `encodeURIComponent` + `https://wa.me/${phone}?text=${encoded}`.
- Same pattern `TableReservationModal.tsx:50-64`, `BookTableInlineForm.tsx:45-59`.
- `encodeURIComponent` correctly neutralizes `&`, `#`, line-break abuse for URL-splitting. **No URL-parameter breakout.**
- Residual risk: full order + PII sits in URL (browser history, proxy logs, `Referer` if wa.me redirects, shoulder-surfing). Not XSS but privacy-amplified injection carrier: attacker-crafted `notes` like `CONFIRMED... + fake refund UPI:` will render verbatim in outlet manager's WhatsApp — **social-engineering payload delivery**, no sanitization/length cap.
- Inputs: `DispatchForm.tsx:129-165` — `type=text/tel` + `required` only; no `pattern`, `maxLength`, or profanity/URL stripping. `orderNotes` unbounded.

### F2 [Low] — `window.open(url,'_blank')` without `noopener` (tabnabbing)
- `CartDrawer.tsx:188`, `BookTableInlineForm.tsx:64`, `TableReservationModal.tsx:69`: `window.open(whatsappUrl,'_blank')` with no `noopener,noreferrer`. Target is `wa.me` (trusted) so practical risk Low, but any future attacker-influenced `phone` (via poisoned `OUTLETS` in localStorage? No — OUTLETS is code-constant, not stored) keeps it Low. Still flag for hardening: `window.open(url,'_blank','noopener,noreferrer')`.

### F3 [Low] — `StructuredData.astro:5` `set:html={JSON.stringify(...)}` — SAFE as-is
- `JSON.stringify` of code-constant `MENU_ITEMS/OUTLETS` with no user input. No breakout (`</script>` inside JSON would need `\/` escaping — Astro handles; dish descriptions contain no `</script>`). No action, regression guard only.

### F4 [Info/Low] — `Threshold.astro:309` `?skip=1` + `sessionStorage` gate bypass — by design, no vuln
- `urlParams.get('skip')==='1'` hides welcome curtain. Client-side only, no authz behind it. Fine, but document as intentional.

### F5 [Low] — Inline scripts without CSP (`Layout.astro:31-77`, `Threshold.astro:282-455`)
- Three inline `<script is:inline>` blocks (curtain gate, progress bar, typewriter + analytics). No `Content-Security-Policy` meta or header in `astro.config.mjs`. Passive finding: any future stored-XSS (e.g., via compromised dish description) would execute unconstrained. Recommend `nonce`-based CSP at deploy (report-only first).

### F6 [Info] — Search input (`MenuExplorer.tsx:20-97`) — debounced, no sink
- `searchQuery` → local filter only, no `innerHTML`, no URL reflection. No `dangerouslySetInnerHTML`/`eval` anywhere (grep-verified zero hits). Good.

### F7 [Low] — `tel:` links (`OutletsStack.tsx:109,158` `tel:${phone.replace(/\s/g,'')}`) + `mapsUrl` constants — no user control, safe.

## 7. Risks & Mitigations (for this SME's own work)
| Risk | Mitigation applied |
|------|--------------------|
| False positive on `set:html` | Read full data flow; confirmed code-constant source |
| Over-claiming XSS without execution | Rated as social-engineering carrier, not stored-XSS; marked theoretical |
| Missing sink | Grep `innerHTML\|dangerouslySetInnerHTML\|eval\|document.cookie` → only benign `local/sessionStorage` hits |

## 8. Quality Assurance Checklist
- [x] Every `input` traced to sink (booking×2, dispatch×3 incl. notes)
- [x] Every `window.open` checked for `noopener` (3 hits, all missing)
- [x] `encodeURIComponent` coverage verified 100% on interpolated WhatsApp fields
- [x] `dangerouslySetInnerHTML`/`eval` grep → zero
- [x] Findings mapped to OWASP 2021 A03 Injection + A01 Broken Access (tabnabbing)
- [x] No files modified (read-only honored)

## 9. Recommendations (for owner, not applied)
1. Add `maxLength` (name 60, phone 15, notes 140) + `pattern="^[0-9+ ]{10,15}$"` on phone; strip URLs from notes before encoding.
2. `window.open(url,'_blank','noopener,noreferrer')` in 3 files.
3. Deploy CSP `script-src 'self'` + nonces; start report-only.
4. Manager SOP: never trust Order Ref/Total from WhatsApp text — re-price from menu.

**Verdict:** No critical XSS/RCE. Highest real risk is **WhatsApp-as-transport social engineering + PII-in-URL**, not code execution.
