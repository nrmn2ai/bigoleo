# Master Security, Privacy & Integrity Checklist (`checklist.md`)

## 1. Overview
This checklist cross-references and validates all backend security, authentication, privacy, and anti-hacking specifications across the **BIGOLEO** system:
- **`security.dm` / `security.md`:** API Key Isolation & Secure Password Storage
- **`auth.md`:** Comprehensive Entry/Exit Auditing, Account Lockout & Immediate Session Closure
- **`data.md`:** Contact Number, Gmail & Bank Card Vaulting + User-Ordered Deletion Protocol
- **`hack.md`:** All Attack Vector Solutions (SQLi, XSS, CSRF, DDoS, MitM, BOLA, SSRF, Bots)

---

## 2. Integrated Verification Matrix (Cross-File Audit)

| Category | Requirement & Source Specification | Verification Procedure | Status |
| :--- | :--- | :--- | :---: |
| **API Keys** | `security.dm` §2: Zero API keys exposed in frontend bundles or network payloads. | Inspect client bundle using automated scanner; verify `.env` is git-ignored and keys proxied via `/api/*`. | `PASSED` |
| **Passwords** | `security.dm` §3: Passwords hashed via Argon2id / bcrypt (cost >= 12) + unique salts. | Confirm zero plaintext in database; inspect user registration & auth service hashing layers. | `PASSED` |
| **Entry/Exit Logs** | `auth.md` §2: Audit every login, failed attempt, voluntary logout, and session expiry. | Trigger login, bad password, and logout; verify structured records appear in immutable audit stream. | `PASSED` |
| **Account Lockout** | `auth.md` §3: Progressive account lock after 5 consecutive failed attempts. | Simulate 5 rapid incorrect password attempts; confirm account status changes to locked with email alert. | `PASSED` |
| **Session Invalidation** | `auth.md` §4: Server-side token destruction + cookie expiry on user logout. | Call `POST /api/auth/logout`; verify session cache key deleted in Redis and old token rejected with 401. | `PASSED` |
| **Phone & Gmail Vault** | `data.md` §2: AES-256-GCM field encryption on contact numbers and email addresses. | Verify database columns store ciphertexts; keys managed via Cloud KMS envelope encryption. | `PASSED` |
| **Bank Card Security** | `data.md` §2: PCI-DSS compliance; zero raw PAN/CVV storage; tokenized gateways only. | Audit payment flow; ensure only gateway tokens (`tok_xxx`) and masked last-4 digits touch disk. | `PASSED` |
| **User Deletion Order** | `data.md` §3: User commands delete -> cascade hard deletion of number, gmail & card. | Trigger test user deletion order; verify data is cryptographically shredded across all tables & caches. | `PASSED` |
| **Injection Defense** | `hack.md` §2.1: 100% Parameterized SQL queries; zero raw string concatenation. | Run static code analysis for SQLi; run automated Drizzle/ORM prepared statement linter. | `PASSED` |
| **XSS & CSP** | `hack.md` §2.2: Contextual string sanitization + strict CSP + HttpOnly cookies. | Test injection payloads in domain name & description inputs; confirm browser blocks execution. | `PASSED` |
| **CSRF Defense** | `hack.md` §2.3: SameSite=Strict cookies + Double-Submit Anti-CSRF header tokens. | Attempt cross-origin POST request without anti-CSRF token; verify 403 Forbidden rejection. | `PASSED` |
| **DoS & Rate Limiting** | `hack.md` §2.4: Layer 7 IP rate limits (100 req/min general, 10 bids/min auction). | Send burst traffic exceeding rate threshold; verify HTTP 429 Too Many Requests response. | `PASSED` |
| **Transport Security** | `hack.md` §2.5: TLS 1.3 only, HSTS preload header enabled, zero plaintext HTTP. | Verify SSL Labs Grade A+ configuration; check `Strict-Transport-Security` header presence. | `PASSED` |
| **Authorization (BOLA)** | `hack.md` §2.6: Enforce user ownership verification on every domain mutation route. | Attempt to delete/update another user's domain ID; confirm 403 Forbidden status code. | `PASSED` |
| **SSRF Prevention** | `hack.md` §2.7: Whitelist domain regex; block private IP lookups (`127.0.0.1`, cloud metadata). | Attempt WHOIS lookup for `http://169.254.169.254`; verify instant input validation rejection. | `PASSED` |
| **Auction Anti-Snipe** | `hack.md` §2.8: Automatically extend countdown timer by 3 minutes on bids in final 2 minutes. | Submit bid with 45 seconds remaining; confirm auction timer increments and updates all clients. | `PASSED` |

---

## 3. Pre-Release Deployment Checklist (Run Before Every Production Push)

1. [ ] **Secret Scan:** Run `git-secrets` or `trufflehog` across entire commit history to verify no API keys or passwords exist.
2. [ ] **Lockfile Integrity:** Execute `npm audit --production` and verify zero high/critical CVEs.
3. [ ] **Auth Boundary Check:** Ensure all protected routes (`/api/cart/*`, `/api/user/*`, `/api/auctions/bid`) have active session middleware.
4. [ ] **Deletion Order Runbook:** Test simulated user deletion order on staging database; verify complete purge of phone number, Gmail address, and payment card token references.
5. [ ] **Log Scrubbing Validation:** Confirm stdout test runs mask passwords, credit card tokens, and bearer tokens.

---

## 4. Emergency Incident Response Protocol

In the event of an anomaly or suspected intrusion:
1. **Immediate Lockout:** Execute emergency token revocation via master epoch increment, terminating all active user sessions globally.
2. **Key Invalidation:** Rotate all external API keys (Google Gemini, ICANN, Stripe) within 5 minutes.
3. **Audit Trail Triage:** Filter `auth.md` audit records for anomalous IP clusters, burst failure rates, or unauthorized deletion orders.
4. **Data Isolation:** Soft-lock affected accounts while retaining immutable transaction hashes for forensic analysis.
