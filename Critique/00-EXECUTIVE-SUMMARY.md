# CyberShield Agency — Executive Security Review Summary
**Project:** Nanaksar Dhaba Indore (Astro 5 + React 19 + Tailwind + Nanostores, SSG, WhatsApp ordering)
**Mode:** Passive review only • Local code only • READ-ONLY (5 SMEs modified nothing; 6 markdown reports added to `Critique/` only)
**Lens:** OWASP Top 10 + ASVS + DPDP Act 2023 + FSSAI display + WCAG 2.2 AA + SEO truthfulness

## Reports in this folder (read in order)
1. `00-EXECUTIVE-SUMMARY.md` (this file)
2. `SME-01-Offensive-AppSec-Report.md` — Dr. Arjun Mehta (injection / trust boundaries)
3. `SME-02-Privacy-DPDP-Report.md` — Ms. Kavya Nair (PII / consent / retention)
4. `SME-03-SupplyChain-Config-Report.md` — Mr. Vikram Shah (deps / headers / dev bridge)
5. `SME-04-BusinessLogic-Fraud-Report.md` — Ms. Elena D'Souza (price authority / refs / spam)
6. `SME-05-Perf-Resilience-SEO-A11y-Report.md` — Mr. Rohan Iyer (weight / crash paths / meta truth)

## Verdict in 30 seconds
No critical RCE/XSS. No secrets leaked. The site is a **static menu + WhatsApp dispatch** with no backend — which bounds damage but pushes all trust to (a) the browser (prices/totals), (b) WhatsApp text (PII + totals as claims), and (c) the counter human (real firewall). **Do not collect real customer data or go live on real branch numbers until the 5 pre-launch must-dos below are closed.**

## Severity roll-up (deduplicated)
| # | Issue | Owner SME | Severity |
|---|-------|-----------|----------|
| 1 | Customer PII in `localStorage` (no expiry/consent) + in `wa.me?text=` URL | 02 (+01) | **High** |
| 2 | Client is price authority (`getCartSummary`, quick-add fallbacks); WhatsApp total is a claim | 04 | **High integrity / Med financial** |
| 3 | Zero DPDP notice/consent/retention; no `/privacy`; silent analytics key | 02 | **High (compliance)** |
| 4 | Dev bridge `127.0.0.1:44922` CORS `*` + unauth file-write (when run) | 03 | **High if run / Low in prod** |
| 5 | No CSP/HSTS/Referrer-Policy configured | 03 (+01) | Medium |
| 6 | Predictable `NK/TB-xxxx` refs (9k space), unlimited booking spam (no OTP/captcha/cooldown) | 04 | Medium |
| 7 | Unsourced `aggregateRating 4.5/5000` + invalid `og:type=restaurant` + hours mismatch (11:00-23:30 vs 11:45-3AM) | 05 | Medium |
| 8 | Corrupt-cart `JSON.parse` crash path; unbounded qty/notes; `window.open` w/o `noopener` | 05+04+01 | Low |
| 9 | Image duplication (full+thumb ×20), unused Mono font, `.gitignore` gaps (`__pycache__/`, `.visualpatch/`) | 05+03 | Low |

## 5 pre-launch must-dos (no code changed by agency)
1. **Privacy:** add `/privacy` + inline DPDP notice; opt-in "remember me" (default off); expiry + Clear-my-data; trim WhatsApp payload (ref + total, minimize name/phone/notes; cap notes 140).
2. **Counter SOP:** re-price every WhatsApp order from menu/KOT; treat text total as quote ("Payable confirmed at counter"); use non-sequential refs with date+outlet prefix.
3. **Deploy headers:** CSP report-only→enforce, `frame-ancestors 'self'`, HSTS, `Referrer-Policy: strict-origin-when-cross-origin`; fix `og:type→website`; source/remove rating; align hours.
4. **Quarantine dev bridge:** never run `bridge/live` on shared/prod hosts; add body cap + origin check; gitignore `.visualpatch/__pycache__`.
5. **Input guards:** phone `pattern`+`maxLength`, qty cap 20, notes `maxLength`, booking cooldown + mandatory manager `CONFIRMED` before holding tables.

## What was explicitly NOT done (per your scoping answers)
- No payload execution, no live `wa.me`/`nanaksardhaba.com` probing, no build/audit runs, no file edits outside `Critique/*.md`.

## How to use these reports
Each SME file contains: persona, tasks, scope, assumptions, constraints, line-cited findings, risks→mitigations, QA checklist, recommendations. Hand SME-02+04 to ops/legal first (customer-facing risk), SME-03+05 to engineering pre-deploy, SME-01 as regression guard for every future form change.

*Agency sign-off: 5/5 SME reports saved in `Critique/`. No source files touched. Approve fixes and we will implement in a follow-up build engagement.*
