# Threat Matrix, Attack Solutions & Hardened Defenses (`hack.md`)

## 1. Overview
This document catalogs all critical cyber attack vectors targeting domain marketplaces, auctions, and web applications, detailing the **precise technical solutions and active remediations** implemented across the **BIGOLEO** backend.

---

## 2. Attack Vectors, Threat Profiles & Technical Solutions

### 2.1 SQL & NoSQL Injection (SQLi)
- **Threat Vector:** Attackers inject malicious SQL/NoSQL syntax through query parameters, search inputs, or auction bid amounts to bypass authentication or extract the entire database.
- **Implemented Solution:**
  - **100% Parameterized Queries:** All database queries utilize ORM prepared statements with strict parameter binding (Drizzle/Prisma/pg). Raw string concatenation in SQL execution is strictly forbidden by ESLint rule `security/detect-non-literal-fs-filename`.
  - **Schema Validation with Zod:** Every incoming payload is validated against strict TypeScript schemas before database evaluation.
  - **Least-Privilege Database User:** The backend application connects using a database role with access restricted exclusively to necessary tables; `DROP`, `ALTER`, and superuser commands are revoked.

---

### 2.2 Cross-Site Scripting (XSS — Stored, Reflected, DOM)
- **Threat Vector:** Injecting malicious JavaScript inside domain names, seller descriptions, bidder handles, or support tickets to hijack session cookies.
- **Implemented Solution:**
  - **Contextual Input Sanitization:** All user-supplied strings are sanitized using `DOMPurify` and HTML-entity escaped before storage or rendering.
  - **Strict Content Security Policy (CSP):**
    ```http
    Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self';
    ```
  - **HTTP-Only Cookies:** Auth session cookies have the `HttpOnly` flag enabled, making them inaccessible to client-side JavaScript (`document.cookie`), completely neutralising token exfiltration via XSS.

---

### 2.3 Cross-Site Request Forgery (CSRF)
- **Threat Vector:** Tricking an authenticated user's browser into submitting unauthorized transactions (e.g., placing auction bids or modifying domain DNS) via a malicious third-party site.
- **Implemented Solution:**
  - **SameSite Cookie Enforcement:** All auth and session cookies are configured with `SameSite=Strict` or `SameSite=Lax`.
  - **Cryptographic Anti-CSRF Double-Submit Tokens:** Non-idempotent endpoints (`POST`, `PUT`, `DELETE`) require a cryptographically signed CSRF token passed via custom headers (`X-CSRF-Token`).
  - **CORS Allowlist:** Cross-Origin Resource Sharing is strictly constrained to authorized domain origins only; wildcards (`*`) are disallowed.

---

### 2.4 Denial of Service (DoS) & Distributed Denial of Service (DDoS)
- **Threat Vector:** Flooding auction servers, domain search engines, or Scrabble evaluation endpoints with volumetric traffic to cause service unavailability.
- **Implemented Solution:**
  - **Multi-Tier Rate Limiting (`express-rate-limit` + Redis Token Bucket):**
    - General Public Endpoints: 100 requests per minute per IP.
    - Domain WHOIS Search: 25 requests per minute per IP.
    - Auction Bidding Endpoint: 10 bids per minute per authenticated user.
    - Scrabble Evaluation: 15 evaluations per minute per user.
  - **Edge DDoS Scrubbing:** Cloudflare / Google Cloud Armor filters volumetric Layer 3/4 SYN floods and Layer 7 HTTP floods at the CDN boundary before reaching the origin.
  - **Payload Size Limits:** `express.json({ limit: '100kb' })` prevents memory exhaustion attacks via oversized JSON bodies.

---

### 2.5 Man-in-the-Middle (MitM) & Session Hijacking
- **Threat Vector:** Intercepting unencrypted network traffic on public networks to sniff API tokens, passwords, or payment credentials.
- **Implemented Solution:**
  - **End-to-End TLS 1.3 Encryption:** All HTTP traffic is permanently redirected to HTTPS.
  - **HTTP Strict Transport Security (HSTS):**
    ```http
    Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
    ```
  - **Secure Cookie Flag:** Session cookies are marked `Secure`, preventing transmission over unencrypted connections.

---

### 2.6 Broken Object Level Authorization (BOLA / IDOR)
- **Threat Vector:** Changing an ID in an API route (e.g., `DELETE /api/domains/dom-99` or `GET /api/orders/user-123`) to view or mutate another user's domains or personal financial data.
- **Implemented Solution:**
  - **Mandatory Ownership Verification:** Every route handler explicitly compares `session.userId === targetResource.ownerId` before querying or mutating records.
  - **UUIDv4 / CUID Identifiers:** Sequential auto-incrementing IDs (e.g., `id: 1, 2, 3`) are replaced with cryptographically random UUIDs, preventing predictive resource enumeration.

---

### 2.7 Server-Side Request Forgery (SSRF)
- **Threat Vector:** Tricking the backend domain WHOIS checker into requesting internal infrastructure endpoints (e.g., `http://169.254.169.254/computeMetadata/v1/` on Google Cloud/AWS).
- **Implemented Solution:**
  - **Strict URL & Domain Parsing:** WHOIS and DNS lookups only accept sanitized alphanumeric domain names matching `^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z]{2,})+$`.
  - **Private IP Blacklisting:** Outbound HTTP agents block requests targeting `127.0.0.1`, `localhost`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, and cloud metadata IP `169.254.169.254`.

---

### 2.8 Auction Sniper & Scraping Bot Automation
- **Threat Vector:** Automated high-frequency bots sniping domain auctions in the final millisecond or aggressively scraping marketplace inventories.
- **Implemented Solution:**
  - **Soft Close / Anti-Sniping Extension:** If a bid is submitted in the final 2 minutes of an auction, the timer automatically extends by 3 minutes to guarantee fair human counter-bids.
  - **Cryptographic Request Signing:** Auction bids require client challenge-response tokens validated by the server.
  - **Behavioral Telemetry:** Heuristic detection flags programmatic mouse/touchless interactions, routing suspect sessions to CAPTCHA verification.

---

### 2.9 Supply Chain & Dependency Infiltration
- **Threat Vector:** Compromised npm packages or malicious transitive dependencies introducing backdoors into server builds.
- **Implemented Solution:**
  - **Lockfile Enforcement:** Builds strictly use `npm ci` with immutable `package-lock.json` validation.
  - **Automated Vulnerability Auditing:** Continuous `npm audit` and Dependabot vulnerability checks integrated into CI/CD pipelines.
  - **Zero Unverified Scripts:** `npm config set ignore-scripts true` for untrusted modules.
