# Secrets & Credentials Security Assessment

**Document Version:** 1.0.0  
**Scope:** Configuration files, environment variables, source code, client bundles, logging streams, and version control history.  
**Audited Directory:** Project Root (`server.ts`, `src/App.tsx`, `src/data.ts`, `metadata.json`, `.env.example`).

---

## 1. Executive Summary

A comprehensive scan of the repository was conducted to inspect for active secrets, API keys, private keys, database credentials, tokens, and hardcoded authentication passcodes.

**Key Findings:**
1. **No Cloud or Third-Party API Keys Present:** The project does not currently store or utilize third-party cloud secrets (e.g., AWS, GCP, Stripe, SendGrid, Firebase keys).
2. **Hardcoded Administrative Passcodes in Client Bundle:** Administrative authorization relies on plaintext passcodes hardcoded directly into the client-side React code (`src/App.tsx`).
3. **Absence of Server-Side Environment Variable Management:** The backend (`server.ts`) does not utilize `dotenv` or reference environment-backed secret stores for API operations.
4. **Hardcoded Personal Contact Email:** A developer/manager email address is hardcoded into client-side booking functions.

---

## 2. Inventory of Where Secrets Are Expected vs. Actual Implementation

| Domain | Expected Control | Actual Implementation in Codebase | Status |
| :--- | :--- | :--- | :--- |
| **Admin Authentication** | Server-side password hash (bcrypt/argon2) stored in secure database or secret manager. | Plaintext string literals evaluated in browser runtime (`src/App.tsx:153`). | **Vulnerable** |
| **API Route Authorization** | Bearer token / Session cookie verified against environment secret (`ADMIN_API_KEY` or `JWT_SECRET`). | Zero authorization checks on `POST /api/instagram` (`server.ts:113`). | **Missing** |
| **Environment Config** | `.env` parsed via `dotenv`, `.env.example` documenting required keys, `.gitignore` excluding `.env`. | `.env.example` is 0 bytes (empty); `.env` is absent; `dotenv` is not in `package.json`. | **Incomplete** |
| **Database Credentials** | Database URI with encrypted user/password via environment variables. | No database used; flat file `instagram_data.json` accessed directly via local file system. | **N/A (Flat File)** |
| **Email Service Credentials** | SMTP credentials or transactional email API key (e.g. Resend, SendGrid) stored server-side. | Client-side `mailto:` protocol link construction; no server-side mailer configured. | **N/A (Client mailto)** |

---

## 3. Detailed Findings with Evidence

### 3.1. Confirmed Vulnerability: Hardcoded Admin Passcode in Client Bundle
* **Severity:** High
* **Evidence:**  
  In [src/App.tsx](file:///C:/Users/RajRu/.gemini/antigravity-ide/scratch/achol-repo/src/App.tsx#L150-L159):
  ```typescript
  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = adminPasscode.trim().toLowerCase();
    if (cleanCode === '<REDACTED_PASSCODE_1>' || cleanCode === '<REDACTED_PASSCODE_2>' || cleanCode === '<REDACTED_PASSCODE_3>') {
      setIsAdminUnlocked(true);
      setPasscodeError('');
    } else {
      setPasscodeError('Invalid passcode! / সঠিক পাসকোড দিন (Hint: <REDACTED_HINT>)');
    }
  };
  ```
* **Risk:** Anyone viewing the production bundle (`dist/assets/index-*.js`) or opening browser Developer Tools can locate the passcode string literals. Furthermore, the hint text directly informs visitors of the valid passcode.
* **Affected Location:** `src/App.tsx:153`, `src/App.tsx:157`.
* **Why It Matters:** Hardcoded passcodes in client-side code provide zero confidentiality. They give a false sense of administrative security while allowing unauthorized visitors to unlock the Instagram management modal.
* **Recommended Fix:** Remove client-side passcode validation entirely. Implement server-side authentication using standard session cookies or JWT tokens validated against a securely stored environment hash.

---

### 3.2. Security Weakness: Public Endpoint Lacks API Key or Secret Verification
* **Severity:** High
* **Evidence:**  
  In [server.ts](file:///C:/Users/RajRu/.gemini/antigravity-ide/scratch/achol-repo/server.ts#L113-L127):
  ```typescript
  app.post("/api/instagram", (req, res) => {
    try {
      const { data } = req.body;
      if (!Array.isArray(data)) {
        return res.status(400).json({ success: false, message: "Invalid data format..." });
      }
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
      return res.json({ success: true, message: "Instagram posts saved successfully!" });
  ```
* **Risk:** Even if client-side passcodes were fixed, the backend accepts write requests without validating any pre-shared secret, token, or session header.
* **Affected Location:** `server.ts:113-135`.
* **Why It Matters:** Administrative state updates are accessible to unauthenticated callers across the network.
* **Recommended Fix:** Define an environment variable `ADMIN_SECRET_KEY` on the server. Require incoming requests to include an `Authorization: Bearer <token>` header, and validate it using constant-time string comparison (`crypto.timingSafeEqual`).

---

### 3.3. Missing Control: Empty Environment Configuration Template
* **Severity:** Low
* **Evidence:**  
  File `.env.example` at the repository root contains 0 bytes.
* **Risk:** Developers deploying to production environments have no specification of required configuration flags (e.g., `PORT`, `NODE_ENV`, `ADMIN_SECRET_KEY`).
* **Affected Location:** `.env.example`.
* **Why It Matters:** Undocumented configuration leads to inconsistent deployments, deployment in default development modes, or accidental hardcoding of parameters in code files.
* **Recommended Fix:** Populate `.env.example` with standard non-sensitive template keys:
  ```env
  PORT=3000
  NODE_ENV=production
  ADMIN_API_KEY=your_secure_random_api_key_here
  ```

---

### 3.4. Potential Risk Requiring Verification: Static Hosting Secret Disconnect
* **Severity:** Medium
* **Evidence:**  
  The project is hosted on Vercel at `https://achol.vercel.app/`. The repository contains a standalone Node/Express server (`server.ts`) alongside a Vite static SPA configuration.
* **Risk:** When deployed to Vercel as a pure static Vite site, `server.ts` is not executed unless configured as a Vercel Serverless Function via `vercel.json` or `/api` directory serverless handlers. Consequently, calls to `/api/instagram` will fail (HTTP 404), causing client error states. Conversely, if deployed to an unmanaged VPS or Hostinger using Node.js without an HTTPS reverse proxy (Nginx/Caddy), raw HTTP traffic exposes all communication.
* **Affected Location:** `server.ts`, Vercel deployment topology.
* **Why It Matters:** Architectural mismatches between static CDN hosting and dynamic backend endpoints can lead to unexpected exposure or feature failure in production.
* **Recommended Fix:** Either decouple the backend by using a headless CMS/serverless architecture, or explicitly configure serverless functions with HTTPS-only communication.

---

## 4. Git & Version Control History Analysis

A forensic inspection of the Git commit history (`git log -p`) was conducted across all commits:
* **Commit History Checked:** `feb632e`, `e7c4d18`, `a20b147`, `5eabef2`, `dfb6835`.
* **Findings:**
  - No database connection strings, private SSH keys (`id_rsa`), or AWS/GCP service account tokens were ever committed to the repository history.
  - The client-side passcode strings (`'achol123'`) were committed in the initial application commits and remain in version history.
  - No `.env` file has been tracked by Git (verified via `git ls-files .env`).
  - `.gitignore` properly excludes `node_modules`, `dist`, and `.env`.

---

## 5. Secret Rotation & Lifecycle Requirements

Should backend authentication and administrative API keys be added to this project, the following lifecycle policies must be enforced:

1. **Storage:** All secrets must reside exclusively in process environment variables (`process.env`) supplied by hosting platforms (e.g., Vercel Project Settings, Hostinger Environment Variables, Docker secrets).
2. **Key Generation:** Administrative tokens must be generated using cryptographically secure pseudorandom number generators (CSPRNG):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. **Rotation Schedule:** Administrative API keys should be rotated semi-annually (every 180 days) or immediately upon suspected credential exposure.
4. **Revocation Procedure:** Because the current system has no authentication store, adding a secret key requires a restart of the Node.js process with the updated environment variable to immediately invalidate old credentials.
