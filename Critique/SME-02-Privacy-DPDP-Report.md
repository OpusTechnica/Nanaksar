# SME-02 — Privacy, PII Leakage & DPDP Compliance
**Agency:** CyberShield • **Expert:** Ms. Kavya Nair (12y, CIPP/E, ex-healthtech DPO, DPDP Act specialist)
**Mode:** Passive review only • **Scope:** Local code only • **Permission:** READ-ONLY

## 1. Persona & Mandate
Privacy auditor. Maps every PII collection, storage, transmission, and display point; benchmarks against India's DPDP Act 2023 + FSSAI display rules.

## 2. Tasks Assigned
1. Inventory PII stores (localStorage/sessionStorage/cart).
2. Trace PII-in-transit (WhatsApp URLs) and PII-at-rest (hardcoded phones).
3. Flag missing consent/retention/privacy-notice artifacts.

## 3. Scope
**In:** `src/data/cartStore.ts`, `src/data/restaurantData.ts`, `src/components/CartDrawer.tsx`, `src/components/cart/DispatchForm.tsx`, `TableReservationModal.tsx`, `BookTableInlineForm.tsx`, `Footer.astro`, `Threshold.astro`, `src/pages/*`
**Out:** Legal drafting; live WhatsApp interception.

## 4. Assumptions
- `+91 98260 12345` … `56789` + `9198260xxxxx` are sequential placeholder numbers, not live personal mobiles — but treated as Business-PII until owner confirms.
- WhatsApp (`wa.me`) is a third-party data processor; outlet manager's device is out-of-scope storage.
- No backend DB; browser + WhatsApp chat are the only PII stores.

## 5. Constraints
- No contact with data subjects; no live link testing; no cookie-banner runtime check (static only).

## 6. Findings

### F1 [High] — Customer PII transmitted in URL query + stored unencrypted in `localStorage`
- `CartDrawer.tsx:64-76,89-101`: `nanaksar_diner_name/phone` persisted on every keystroke, never expires, no encryption.
- `cartStore.ts:19-25`: `nanaksar_cart_v1` (full tray + prices + Jain flags) + `nanaksar_outlet_v1` persistent.
- `Threshold.astro:292-303`: `nanaksar_threshold_analytics {shown, entered, ctaTimes}` in `localStorage` — behavioral telemetry without notice.
- Transmission: `buildWhatsAppOrderUrl():228-230` appends `Customer: name/phone/notes` to `wa.me?text=` GET URL → retained in browser history, ISP/proxy logs, any analytics that capture full URL. **DPDP §§4-6 (purpose limitation, accuracy) risk.**
- Any shared-device user leaves name+phone+order history retrievable via DevTools → `JSON.parse(localStorage...)`.

### F2 [Medium] — No consent, no privacy notice, no retention policy found
- `src/pages/`: `index, story, outlets, welcome, all-categories` — no `/privacy`, `/terms`, cookie/consent component found (glob + grep for `consent|privacy|cookie` → zero, except unrelated). DPDP requires Notice + Consent before collecting name/phone; none present at `DispatchForm` or booking forms.
- No "remember me" toggle — remembrance is silent (`✓ Remembered on this device` label only after the fact, `DispatchForm.tsx:122-124`).

### F3 [Medium] — Hardcoded business contact graph (5 outlets + footer + JSON-LD)
- `restaurantData.ts:75-133`: 5 phones + 5 wa numbers in plaintext, mirrored in `StructuredData.astro:63` (`telephone`), `Footer.astro:154` (`wa.me/919826012345`), `OutletsStack.tsx`. Scraping-trivial. If numbers are live staff mobiles → spam/smishing target. Recommend role-based numbers + obfuscation note, confirm placeholders before launch.

### F4 [Low] — FSSAI display: present but thin
- Positive: `BRAND_INFO.fssaiNumber='21421850002914'` + `Footer.astro:69` display. Gap: no outlet-wise license distinction, no FSSAI logo alt/verification link, `StructuredData` omits `fssai` field. Low legal risk, easy win.

### F5 [Low] — Over-collection: `orderNotes` free-text invites excess PII
- Placeholder `e.g. Extra napkins, less spicy, prepare for 8:30 PM` is fine, but unbounded text field with no guidance ("don't share OTP/Aadhaar") invites over-sharing that then ships to WhatsApp.

## 7. Risks & Mitigations (SME's own)
| Risk | Mitigation |
|------|------------|
| Mislabeling placeholder phones as breach | Classified Business-PII, asked owner to confirm liveness |
| Claiming live-URL leakage without firing links | Cited code-constructed URL string, not network capture |
| Missing hidden consent component | Full `src/**/*` glob + grep for consent/privacy/cookie |

## 8. QA Checklist
- [x] All `localStorage/sessionStorage` keys inventoried (6 keys)
- [x] All PII-in-URL flows listed (order ×1, reservation ×2 entry points)
- [x] Hardcoded phones enumerated (5 pairs + footer hardcode)
- [x] Privacy/terms/consent absence evidenced (no matching pages/components)
- [x] Mapped to DPDP Act §§4,5,6,8 + OWASP A01/A09 + FSSAI Labelling Regs

## 9. Recommendations (not applied)
1. Add `/privacy` + concise DPDP notice at both forms; explicit "Save on this device ☑" opt-in (default off); `max-age` + Clear-my-data button.
2. Minimize WhatsApp payload: send Order Ref + pickup code; keep name/phone out of `text` or truncate notes to 140 chars with PII warning.
3. Confirm/replace sequential `98260 xxxxx` with real branch numbers before launch; remove footer hardcoded `wa.me` duplicate in favor of `$selectedOutletId`.
4. Add FSSAI logo + per-outlet license line if licenses differ.

**Verdict:** Highest privacy debt is **silent persistent PII + PII-in-WhatsApp-URL + zero DPDP notice**. Fix before collecting real customer data.
