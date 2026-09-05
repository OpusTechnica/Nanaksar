# SME-04 — Business Logic, Fraud & Abuse Economics
**Agency:** CyberShield • **Expert:** Ms. Elena D'Souza (11y, food-delivery fraud modeling)
**Mode:** Passive review only • **Scope:** Local code only • **Permission:** READ-ONLY

## 1. Persona & Mandate
Think like a bargain-hunter, reseller, and reservation-spammer. Every total, ref, and hold policy is attacker-controlled until a human re-checks it.

## 2. Tasks Assigned
1. Trace price authority (who decides the payable total?).
2. Assess ref predictability, quantity/portion edge cases, outlet-switch behavior.
3. Quantify per-order impact under pay-on-pickup reality.

## 3. Scope
**In:** `src/data/cartStore.ts`, `src/data/restaurantData.ts`, `src/components/CartDrawer.tsx`, `src/components/cart/TrayItem.tsx`, `src/components/cart/DispatchForm.tsx`, `TableReservationModal.tsx`, `BookTableInlineForm.tsx`
**Out:** Payment gateway (none — WhatsApp + pay-on-pickup).

## 4. Assumptions
- Outlet manager manually reads WhatsApp text and re-prices from physical menu (human-in-loop). No auto-charge/KOT integration.
- `OUTLETS`/`MENU_ITEMS` are code constants; attacker cannot change server prices, only their own browser state.

## 5. Constraints
- No order submission; arithmetic walkthrough only; no load/flood testing.

## 6. Findings

### F1 [High integrity / Medium financial] — Client is price authority; totals are claims, not charges
- `getCartSummary():186-202`: `subtotal = Σ price×qty` (client `price`), `packagingTotal = Σ packagingFee×qty`, `gst = round(subtotal×0.05)`, `grandTotal = subtotal+packaging+gst`. All from `localStorage`-backed `$cart`.
- `addToCart():33-88` takes `price` from `MenuItem` object in browser; `updateCartItemPortion():117-170` re-prices from optional `menuItem` param (attacker can omit/pass spoofed object via DevTools — function is exported).
- `POPULAR_ACCOMPANIMENTS` (`CartDrawer.tsx:32-49`) hardcodes `₹50/₹110` outside `MENU_ITEMS` truth; `handleQuickAddAccompaniment():156-175` builds fallback object with `priceSingle: itemDef.price` if menu lookup fails — price decided in UI code.
- Impact math (example): Dal Makhani Full ₹195 → attacker sets `price:1` in stored cart → `grandTotal` shows ₹1+fees; WhatsApp text `GRAND TOTAL: Rs. X` is whatever browser claims. **If staff trusts the text, loss = full ticket.** Mitigating reality: staff almost certainly re-totals at counter → downgrade financial to Medium, integrity to High.

### F2 [Medium] — Predictable refs: `NK-1000..9999` + `TB-1000..9999`
- `cartStore.ts:208` `NK-${1000+random*9000}`, `TableReservationModal.tsx:47` / `BookTableInlineForm.tsx:41` `TB-...`. 9,000 possibilities, no date/outlet entropy, no dedup. Collision + impersonation ("my ref is NK-1234, I already paid online") plausible at busy counter. Recommend `NK-<outlet>-<yymmdd>-<rand6>` + manager sequence book.

### F3 [Low] — Quantity/portion edge cases mostly guarded, two nits
- Guards good: `updateCartQuantity` drops at `qty<=0` (`cartStore.ts:98-111`), stepper is ±1 only (`TrayItem.tsx:111-129`), portion toggle only `half|full` (`TrayItem.tsx:62-88`), date picker blocks past dates (`LuxuryControls.tsx:145`).
- Nits: (a) No upper bound — qty can be clicked to 999+ (prank 500-naan order via WhatsApp → staff confusion; no `max=20`). (b) `updateCartItemPortion` without `menuItem` keeps stale `price` (line 132: `let newPrice = currentItem.price`) — cosmetic overcharge/undercharge possible on crafted calls, but UI always passes `menuItem` so real-path safe.

### F4 [Low] — Outlet-switch wipes tray (correct anti-mixing, harsh UX)
- `switchOutlet():176-183` clears cart on outlet change + `DispatchForm.tsx:78-113` confirm dialog. Right call (prices/fees per outlet may diverge), but copy "will reset your tray" buries the cost. No cross-outlet price arbitrage possible — good.

### F5 [Medium] — Reservation spam / no-show economics, no throttling
- Booking is `required name+phone` only, no OTP, no CAPTCHA, no per-device cooldown (`TableReservationModal.tsx:225-248`, `BookTableInlineForm.tsx:196-218`). Phone `type=tel` accepts `abc` (no pattern). Attacker (or bored teen) can generate unlimited `TB-xxxx` WhatsApp passes → manager inbox flood + table-hoarding on peak nights. 15-min hold policy is stated but unenforced in code (manual). Recommend OTP-lite (WhatsApp reply `CONFIRMED` already in copy — make it mandatory before holding) + `minLength/pattern` + honeypot.

## 7. Risks & Mitigations (SME's own)
| Risk | Mitigation |
|------|------------|
| Overstating loss (human re-checks total) | Split rating: Integrity High, Financial Medium with explicit human-in-loop caveat |
| Claiming exploit without execution | Cited exact lines + data-flow; marked theoretical |
| Missing server API | Grep for `fetch|axios|/api` → none; documented pay-on-pickup model |

## 8. QA Checklist
- [x] Price source traced for all 3 add paths (menu add, quick-add, portion switch)
- [x] Ref entropy calculated (9k space, no uniqueness)
- [x] Qty bounds + past-date + portion-toggle edge cases listed
- [x] No-backend-validation evidenced (zero API calls)
- [x] Mapped to OWASP Business Logic + A04 Insecure Design
- [x] No files modified

## 9. Recommendations (not applied)
1. Treat WhatsApp total as **quote, not invoice**: manager SOP + printed KOT re-price; add "Payable confirmed at counter" disclaimer under `₹{grandTotal}`.
2. Server-less hardening: cap qty at 20, `maxLength` on notes, phone `pattern`, non-sequential refs with date+outlet prefix.
3. Anti-spam: 60-sec resubmit cooldown in booking forms + require manager `CONFIRMED` reply before table is held.
4. Move `POPULAR_ACCOMPANIMENTS` prices to derive from `MENU_ITEMS` lookup (fail closed if missing, don't fallback-construct).

**Verdict:** No payment theft possible (no online payment), but **menu-price integrity is entirely client-side** — process controls at the counter are the real firewall until a backend exists.
