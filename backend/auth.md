# Authentication, Session Lifecycle & Access Control (`auth.md`)

## 1. Overview
This document outlines the authentication architecture for **BIGOLEO**, establishing full auditing of user entry and exit events, brute-force mitigation through automated account lockouts, and strict session invalidation upon user logout.

---

## 2. Login & Exit Audit Logging (`Check all the Login and Exits`)

### 2.1 Complete Authentication Event Stream
Every authentication interaction is recorded in an immutable, append-only security log:

| Event Type | Triggers & Description | Recorded Metadata |
| :--- | :--- | :--- |
| `AUTH_LOGIN_SUCCESS` | Successful credential verification & MFA passage | User ID, Timestamp (UTC), IP Address, Geo-Location, User-Agent, Session ID |
| `AUTH_LOGIN_FAILURE` | Invalid password, bad token, or non-existent handle | Attempted Handle, IP Address, Reason Code (`INVALID_CREDENTIALS`, `LOCKED`), Timestamp |
| `AUTH_LOGOUT_VOLUNTARY` | User clicks "Sign Out" or calls `/api/auth/logout` | User ID, Terminated Session ID, Invalidation Timestamp, Exit Route |
| `AUTH_SESSION_EXPIRED` | Inactivity timeout or absolute max session lifetime | User ID, Expired Session ID, Last Activity Timestamp, Expiration Trigger |
| `AUTH_SESSION_REVOKED` | Admin revocation, password reset, or security event | User ID, Revoked Session IDs, Revoking Actor ID, Justification |

### 2.2 Tamper-Evident Audit Storage
- Audit entries are streamed to a dedicated log repository with write-once-read-many (WORM) controls.
- Retention period: 365 days for regulatory and security compliance, with automated anomaly detection flagging suspicious exit/login spikes.

---

## 3. Brute-Force Defense & Progressive Account Lockout (`Account Lockout Protocol`)

To prevent automated credential stuffing, dictionary attacks, and targeted brute-force incursions, the backend implements progressive account lockouts:

```
[Failed Attempt 1-2]  --> Standard failure response with generic message (no username enumeration)
[Failed Attempt 3-4]  --> Adaptive CAPTCHA challenge + 2-second rate-limiting delay
[Failed Attempt 5]    --> TIER 1 LOCKOUT: 15-Minute Automated Account Lock + Security Email Notification
[Failed Attempt 8]    --> TIER 2 LOCKOUT: 1-Hour Automated Lockout + IP-Level Throttling
[Failed Attempt 10+]  --> TIER 3 LOCKOUT: Indefinite Account Freeze requiring cryptographic email unlock token
```

### 3.1 Lockout Rules & Parameters
- **Tracking Scope:** Failed attempt counter tracks both `(UserID)` and `(IP_Address)` independently.
- **Counter Window:** Failed attempt counters reset after 15 minutes of inactivity without further failures.
- **Generic Error Responses:** The API returns `Invalid credentials or account state` to prevent attackers from determining whether the account exists or is currently locked.
- **Emergency Unlock Flow:**
  1. An encrypted, time-limited (15-minute) unlock token is dispatched to the user's verified primary email.
  2. The user passes multi-factor verification before the lock counter is reset to zero.

---

## 4. Session Termination Protocol (`Close Session After Logging Out`)

### 4.1 Immediate Server-Side Invalidation
When a user logs out (`POST /api/auth/logout`), the session must be completely destroyed across both server and client:

1. **Server-Side Session Revocation:**
   - The active session token / refresh token is immediately deleted from the server-side Redis session cache.
   - The token signature is registered on an in-memory high-speed revocation blacklist until its natural TTL expires.
   - For JWT implementations, the user's `tokenVersion` or `sessionEpoch` integer is incremented in the database, rendering all previously issued access tokens instantly invalid.
2. **Client-Side Cookie Cleansing:**
   - The server responds with `Set-Cookie` headers configured to clear all auth tokens:
     ```http
     Set-Cookie: session_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict
     Set-Cookie: refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict
     ```
3. **Multi-Tab Broadcast Invalidation:**
   - The client emits a `BroadcastChannel` or `storage` event informing all open browser tabs to purge state and redirect to the unauthenticated landing view.
4. **Session Timeout Policies:**
   - **Idle Expiration:** Inactivity of 30 minutes automatically triggers session termination.
   - **Absolute Maximum Lifetime:** Sessions expire after a hard limit of 24 hours regardless of continuous activity, forcing re-authentication.
