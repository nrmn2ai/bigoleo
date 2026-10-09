# Security Policy & Key Management Protocol (`security.md`)

*Note: This file mirrors `security.dm` to ensure compatibility across all documentation and runtime linters.*

## 1. Overview
This specification establishes mandatory security standards for the **BIGOLEO** backend infrastructure, ensuring all API keys, system credentials, and user passwords remain confidential, tamper-proof, and isolated from public access.

---

## 2. API Key Protection Architecture

### 2.1 Non-Public Credential Isolation
- **Strict Server-Side Containment:** API keys (such as `GEMINI_API_KEY`, Stripe escrow keys, ICANN registrar credentials, database connection strings) must **never** be exposed in client-side bundles, frontend source code, or browser network requests.
- **Environment Variable Configuration:**
  - All keys are injected through system environment variables defined in `.env`.
  - The `.env` file is permanently excluded from version control via `.gitignore`.
  - A sanitized template (`.env.example`) with zero real secrets is maintained for deployment configuration.
- **Backend Proxy Pattern (`/api/*`):**
  - All external API calls that require authorization tokens must be proxied through dedicated backend endpoints.
  - The client only communicates with the internal API using ephemeral session authentication; third-party service tokens never cross the client boundary.

### 2.2 Key Rotation & Least-Privilege Scoping
- **Periodic Rotation:** Production API keys and secret tokens undergo automatic rotation every 90 days, or immediate invalidation upon detected breach.
- **Granular Scoping:** Keys are strictly scoped to minimum necessary permissions (e.g., registrar push keys are isolated from billing keys).
- **Secret Manager Integration:** Production deployments use cloud secret storage (Google Cloud Secret Manager / KMS) with restricted IAM service accounts.

---

## 3. Password Security & Storage Standards

### 3.1 Cryptographic Storage (Zero Plaintext Policy)
- **No Plaintext Storage:** User passwords must never be stored in plain text, reversible encryption, or weak hash formats (such as MD5, SHA-1, or unsalted SHA-256).
- **Approved Hashing Algorithms:**
  - **Argon2id (Primary):** Configured with minimum memory cost = 64MB, time cost = 3 iterations, parallelism = 4.
  - **bcrypt (Fallback):** Work factor cost >= 12, with cryptographically unique salts generated via CSPRNG (Cryptographically Secure Pseudo-Random Number Generator).
- **Salting Requirement:** A unique, random 128-bit salt must be generated per password to prevent rainbow table attacks.

### 3.2 Key Protection & Hardware Security
- **Pepper Architecture:** A server-side pepper key stored in Cloud KMS / HSM is combined with user hashes, ensuring data cannot be cracked even if the database snapshot is compromised.
- **Log Sanitation:** Passwords, tokens, and authorization headers are scrubbed from server stdout, morgan/winston log streams, and APM tracing tools.

### 3.3 Password Policy & Validation
- **Complexity Requirements:** Minimum 12 characters, requiring uppercase, lowercase, numerical, and special characters.
- **Compromised Password Verification:** Password submissions are checked against the HaveIBeenPwned k-Anonymity API to prevent use of known breached passwords.
- **Memory Cleanup:** In-memory password buffers are cleared immediately after hash comparison using zeroing routines.
