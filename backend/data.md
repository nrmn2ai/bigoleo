# Sensitive Data Vault & User-Ordered Deletion Protocol (`data.md`)

## 1. Overview
This policy governs the retention, encryption, and lifecycle of sensitive customer records in **BIGOLEO**—specifically **contact numbers (`number`)**, **email addresses (`gmail` / primary email)**, and **payment card data (`bank card`)**—and defines the strict protocol for **User-Ordered Data Deletion**.

---

## 2. Secure Data Vault Architecture

### 2.1 Protected Data Fields
The system isolates and secures the following high-sensitivity identifiers:

| Identifier | Storage Mode | Encryption Standard | Access Scope |
| :--- | :--- | :--- | :--- |
| **Phone Number (`number`)** | Field-level encrypted in Vault DB | AES-256-GCM with Envelope Encryption | SMS 2FA delivery & Escrow notifications only |
| **Email Address (`gmail`)** | Deterministically salted hash + encrypted string | AES-256-GCM + SHA-256 blind indexing | Account authentication, invoices, and WHOIS proxy contacts |
| **Payment Card (`bank card`)** | PCI-DSS Compliant Gateway Tokenization | Zero raw PAN storage; Stripe / Escrow Token (`tok_xxx`) + Masked display (`**** **** **** 4242`) | Payment processing, auction settlements & escrow payouts |

### 2.2 Payment Card (Bank Card) PCI-DSS Safeguards
- **Zero Raw PAN Storage:** Primary Account Numbers (PAN), CVV/CVC security codes, and magnetic stripe PIN data never touch persistent backend disks or server RAM unencrypted.
- **Vault Tokenization:** Raw card credentials are submitted directly to the certified Level-1 PCI-DSS payment partner (Stripe / Escrow processor) via client-side elements. The backend only stores:
  - `card_token_id`: Cryptographic surrogate identifier
  - `card_last_four`: Display digits (`4242`)
  - `card_brand`: Card scheme (Visa, Mastercard, etc.)
  - `card_expiry`: Month and Year

---

## 3. User-Ordered Data Deletion Protocol (`When You Order Deletion`)

Under **BIGOLEO's Sovereign Privacy Guarantee** (aligned with GDPR Art. 17 "Right to Erasure" and CCPA/CPRA), any user has absolute authority to command the total and irreversible deletion of their personal records.

### 3.1 Step-by-Step Deletion Lifecycle
```
[User Issues Deletion Order]
          │
          ▼
[Step 1: Identity & Re-Authentication Challenge] (Password + 2FA Confirmation)
          │
          ▼
[Step 2: Active Obligation Check] (Ensure no pending escrow funds or live winning bids)
          │
          ▼
[Step 3: Immediate Cryptographic Invalidation & Soft-Lock] (Account disabled, tokens revoked)
          │
          ▼
[Step 4: Cascade Hard Deletion & Cryptographic Shredding]
   ├── Phone Number (`number`): Purged & overwrote with zeros in all tables
   ├── Gmail / Primary Email (`gmail`): Scrubbed, anonymized, indices purged
   ├── Bank Card Tokens (`bank card`): Detached from gateway vault & deleted
   └── Session & Verification Cache: Flushed from Redis & memory buffers
          │
          ▼
[Step 5: Issue Cryptographic Deletion Receipt] (SHA-256 verification proof sent to user)
```

### 3.2 Granular Deletion Commands
Users can execute deletion commands via API or dashboard:
1. **Targeted Deletion Orders:**
   - `DELETE /api/user/payment-methods/:id`: Irrevocably purges linked bank card tokens.
   - `DELETE /api/user/phone`: Purges phone number and revokes SMS authorization channels.
2. **Total Account & Data Erasure (`Hard Delete Order`):**
   - `POST /api/user/delete-account-order`: Permanently purges all user identifiers, history, and records.

### 3.3 Backup Pruning & Cryptographic Erasure
- In compliance with cryptographic erasure standards, database encryption keys assigned specifically to the user partition are immediately destroyed upon deletion order execution.
- Even in offline disaster recovery snapshots, the encrypted blocks become mathematically irrecoverable ciphertext.
