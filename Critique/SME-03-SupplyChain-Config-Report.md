# SME-03 — Supply-Chain, Configuration & Secrets
**Agency:** CyberShield • **Expert:** Mr. Vikram Shah (15y, DevSecOps, CIS/SLSA auditor)
**Mode:** Passive review only • **Scope:** Local code only • **Permission:** READ-ONLY

## 1. Persona & Mandate
Harden the build-and-ship path: dependencies, Astro/Vite config, secrets handling, dev-only backdoors, third-party domains.

## 2. Tasks Assigned
1. Audit manifests + configs for missing security headers/CSP.
2. Hunt hardcoded secrets/keys/endpoints.
3. Assess `visualpatch-bridge.js` + `scripts/*` for prod-escape risk.

## 3. Scope
**In:** `package.json`, `package-lock.json`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`, `.gitignore`, `visualpatch-bridge.js`, `scripts/*`, `public/assets/icons.svg`, `src/layouts/Layout.astro:98-117` (fonts/OG)
**Out:** `npm audit/install/build` execution; live header scan (forbidden by local-only scope).

## 4. Assumptions
- Deploy target is static hosting (`dist/`); no Node server in prod.
- `visualpatch-bridge.js` + `scripts/wait-for-inbox.js` are dev-only; must never ship or run in prod.
- No `.env` files present in repo listing (only `.gitignore` references).

## 5. Constraints
- No dependency install or version-resolution against live registry; CVE claims limited to class-level reasoning.
- Bridge never executed; analysis is static.

## 6. Findings

### F1 [High if run] — `visualpatch-bridge.js:1-128` localhost unauth file-write bridge (dev-only, must stay dev-only)
- Binds `127.0.0.1:44922`, `POST /api/inbox|/__visualpatch_inbox` with `Access-Control-Allow-Origin: *`, `JSON.parse(body)` → `fs.writeFileSync(.visualpatch/preview_N.png, Buffer.from(base64))` + `fs.writeFileSync(.visualpatch/inbox.md, markdown)`.
- No auth, no origin check, no size/rate limit (`req.on('data')` unbounded concat), `item.sourceFile` → `path.resolve(cwd, ...)` reflected into markdown `file:///` links.
- Practical blast radius today: only when a dev runs `npm run bridge`. Any website open in the same browser could POST to `127.0.0.1:44922` (CORS `*` + no preflight for simple POST) and drop files into the project. Classic DNS-rebinding-adjacent dev-bridge risk.
- Positive: binds loopback (not `0.0.0.0`), writes scoped to `.visualpatch/`, not arbitrary paths. `package.json:10` exposes it as `npm run bridge` — ensure never in prod start command.

### F2 [Medium] — No CSP / HSTS / security headers configured anywhere
- `astro.config.mjs:1-27`: no `headers`, no adapter header config; `server.host 127.0.0.1:4321` fine for dev. No `<meta http-equiv="Content-Security-Policy">` in `Layout.astro`. With 3 inline scripts + Google Fonts + `wa.me` + `maps.google.com`, first deploy will be CSP-absent → amplifies any future XSS (see SME-01 F5).

### F3 [Low] — No hardcoded API keys/secrets found (good)
- Grep `apiKey|secret|token|password` → only benign `whatsappPhone/phone/FSSAI` hits. `.gitignore:9-12` correctly ignores `.env*`. No `.env` files in listing. No private keys in `public/`.

### F4 [Low] — `tsconfig.json:5` `allowJs:true` + broad `scripts/*.py` helpers
- `scripts/` contains `write_files.py`, `fix_*.py`, `clean_data.py`, `update_*.py`, `step*.py` — file-writing helpers with no sandbox markers. Passive risk: a future agent running them could overwrite `src/` silently. Recommend `scripts/README` guard ("dev-only, never in CI deploy") + `__pycache__/` already present suggests local runs — ensure `__pycache__` stays ignored (currently not in `.gitignore` — minor gap).

### F5 [Info] — Third-party domain sprawl (static allow-list)
- `fonts.googleapis.com`, `fonts.gstatic.com`, `wa.me`, `maps.google.com`, `instagram.com`. No Subresource Integrity needed (stylesheet + navigation, not scripts), but CSP allow-list should enumerate exactly these at deploy.

### F6 [Info] — `.gitignore` gaps (minor)
- Missing `__pycache__/`, `.visualpatch/`, `*.log`. `dist/`, `.astro/`, `node_modules/`, `.env*` correctly covered. Recommend appending the three.

## 7. Risks & Mitigations (SME's own)
| Risk | Mitigation |
|------|------------|
| Overstating bridge as prod RCE | Explicitly scoped: exploitable only when dev runs bridge; not in `dist/` |
| Claiming dep CVEs without audit | No CVE IDs asserted; flagged version-pinning (`^`) + React 19 freshness only |
| Missing hidden `.env` | Directory listing + glob reviewed; none present |

## 8. QA Checklist
- [x] Manifests + 3 configs + tsconfig read
- [x] Secret grep across `src/scripts/public` (no keys)
- [x] Bridge + inbox-watcher statically traced (CORS, write path, bind addr)
- [x] `.gitignore` vs actual artifacts (`dist/.astro/node_modules/__pycache__/.visualpatch`) compared
- [x] Third-party domains enumerated
- [x] Mapped to CIS Astro/Node + OWASP A06/A08 + SLSA L1
- [x] No files modified

## 9. Recommendations (not applied)
1. Never run `npm run bridge/live` on prod or internet-exposed hosts; bind already loopback — add `--allowed-origins` check + 1 MB body cap + remove `Access-Control-Allow-Origin: *`.
2. Add deploy-time headers (CSP report-only → enforce, `frame-ancestors 'self'`, HSTS, `Referrer-Policy: strict-origin-when-cross-origin` to limit `wa.me?text=` leakage).
3. Append `__pycache__/`, `.visualpatch/`, `*.log` to `.gitignore`.
4. Pin prod deploy to `npm ci && astro build` only; exclude `scripts/` + `visualpatch-bridge.js` from artifact.

**Verdict:** Ship-chain is clean (no secrets). Only material risk is the **dev bridge's open CORS + file-write** — quarantine to dev machines.
