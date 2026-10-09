# Comprehensive Security Checklist & Hardening Guide

**Project:** Achol Akhe — Superstar Portfolio & Press Kit  
**Stack:** React 19, TypeScript, Tailwind CSS v4, Express 5, Node.js  
**Scope:** Client Application, Express Backend API, Persistence Layer, and Deployment Configuration.

---

## 1. Domain-by-Domain Security Checklist

| Category | Item / Control | Current Implementation Status | Evaluation |
| :--- | :--- | :--- | :--- |
| **Authentication** | Server-side identity verification for admin | No server authentication exists; client string compare only | ❌ Failed |
| **Authorization / RBAC** | Role-based permission gating for data mutation | `POST /api/instagram` accessible to any unauthenticated caller | ❌ Failed |
| **Session / Token Security** | Secure session management (HttpOnly cookies / JWT) | No session or token mechanism implemented | ❌ Failed |
| **Input Validation** | Strict schema validation for incoming JSON payloads | Only verifies `Array.isArray(data)` in `server.ts:116` | ⚠️ Inadequate |
| **Injection** | SQL / NoSQL / Command Injection prevention | No SQL/NoSQL database used; no shell execution | ✅ Not Applicable |
| **XSS Prevention** | DOM XSS and script injection defenses | Standard React JSX escaping; no `dangerouslySetInnerHTML` | ✅ Pass (Baseline) |
| **CSRF Defense** | Anti-CSRF tokens for state-modifying POST requests | No CSRF tokens or SameSite cookie controls | ⚠️ Inadequate |
| **API Security** | Authentication, payload constraints, method gating | `POST` endpoint open; body parser limit set to generous 15MB | ❌ Failed |
| **Rate Limiting / Abuse** | Request throttling on API routes | No rate limiting middleware configured in Express | ❌ Failed |
| **File Uploads** | Secure multipart file handling, extension validation | No backend file upload endpoints configured | ✅ Not Applicable |
| **Database Security** | Connection encryption, least privilege, parameterization | No database used; flat file `instagram_data.json` on disk | ⚠️ Inadequate (Flat File) |
| **Secrets Management** | Environment variable storage, secret isolation | `.env.example` empty; passcodes hardcoded in client code | ❌ Failed |
| **Encryption in Transit** | HTTPS enforcement, HSTS headers | Dependent on reverse proxy/CDN; no HSTS in Express | ⚠️ Unenforced in App |
| **CORS Policy** | Explicit Allowed Origins for API consumption | No CORS middleware configured in Express | ⚠️ Default Permissive |
| **Dependency Security** | Dependency vulnerability auditing | Express 5, React 19 up to date; dev build dependencies have warnings | ⚠️ Needs Review |
| **Logging & Monitoring** | Audit logging of administrative actions | Only `console.error` on runtime exceptions | ❌ Failed |
| **Admin Security** | Restricted admin URL/route, MFA, brute-force limits | Client modal with hardcoded passcode & in-UI hint | ❌ Failed |
| **Deployment / Infra** | Security headers (CSP, HSTS, X-Frame-Options) | `helmet` middleware absent; no CSP configured | ❌ Failed |
| **Data Privacy** | Protection of PII (names, contact details) | Contact emails exposed in client code | ⚠️ Informational |
| **Error Handling** | Generic user errors without stack/path leakage | Error messages leak internal error strings (`error.message`) | ⚠️ Needs Hardening |
| **Backup & Recovery** | Automated backup for data files | No versioning or backup for `instagram_data.json` | ❌ Failed |

---

## 2. Categorized Findings with Remediation

### 2.1. Confirmed Vulnerabilities

#### VULN-01: Unauthenticated Public Write Access to Server State
* **Severity:** **Critical**
* **Evidence:**  
  [server.ts:113-127](file:///C:/Users/RajRu/.gemini/antigravity-ide/scratch/achol-repo/server.ts#L113-L127):
  ```typescript
  app.post("/api/instagram", (req, res) => {
    try {
      const { data } = req.body;
      if (!Array.isArray(data)) {
        return res.status(400).json({ success: false, message: "Invalid data format..." });
      }
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
      return res.json({ success: true, message: "Instagram posts saved successfully!" });
    }
  ```
* **Risk:** Any client on the internet can make unauthenticated HTTP POST requests to rewrite or wipe `instagram_data.json`, defacing the live social gallery.
* **Affected Location:** `server.ts:113-135`.
* **Why It Matters:** Direct violation of OWASP API Top 10 (Broken Object Level Authorization & Broken Authentication). Anyone can overwrite site content.
* **Recommended Fix:**  
  Implement a server-side authentication check using a pre-shared API secret or signed token:
  ```typescript
  const ADMIN_KEY = process.env.ADMIN_API_KEY;

  app.post("/api/instagram", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!ADMIN_KEY || authHeader !== `Bearer ${ADMIN_KEY}`) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    // Proceed with validated payload...
  });
  ```

---

#### VULN-02: Hardcoded Administrative Credentials in Client JavaScript
* **Severity:** **High**
* **Evidence:**  
  [src/App.tsx:150-159](file:///C:/Users/RajRu/.gemini/antigravity-ide/scratch/achol-repo/src/App.tsx#L150-L159):
  ```typescript
  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = adminPasscode.trim().toLowerCase();
    if (cleanCode === 'achol' || cleanCode === 'achol123' || cleanCode === 'admin') {
      setIsAdminUnlocked(true);
      setPasscodeError('');
    } else {
      setPasscodeError('Invalid passcode! / সঠিক পাসকোড দিন (Hint: achol123)');
    }
  };
  ```
* **Risk:** The passcode is compiled directly into the client bundle and exposed via browser Developer Tools. The error message explicitly provides the passcode as a hint (`Hint: achol123`).
* **Affected Location:** `src/App.tsx:153-157`.
* **Why It Matters:** Client-side validation cannot enforce security. It gives a false impression of access control while providing zero protection.
* **Recommended Fix:**  
  Remove the hardcoded strings and hint. Authenticate via a server-side endpoint (`POST /api/auth/login`) that issues an HTTP-only, secure, SameSite session cookie.

---

### 2.2. Security Weaknesses

#### WEAK-01: Missing Payload Validation & Unsanitized JSON Write
* **Severity:** **High**
* **Evidence:**  
  `server.ts:116` only verifies `Array.isArray(data)`. Individual objects within the array are not validated for required fields (`id`, `imageUrl`, `caption`, `postUrl`), string lengths, or valid URL schemes (`http:`, `https:`).
* **Risk:** Malicious payloads can inject arbitrarily large strings or unexpected fields that crash frontend rendering or introduce broken links.
* **Affected Location:** `server.ts:116-123`.
* **Why It Matters:** Lacks defensive data integrity guarantees (OWASP Improper Input Handling).
* **Recommended Fix:**  
  Use schema validation with Zod or Joi before persisting data:
  ```typescript
  import { z } from "zod";

  const PostSchema = z.array(z.object({
    id: z.string().max(50),
    imageUrl: z.string().url().max(500),
    caption: z.string().max(1000),
    likes: z.string().max(20),
    comments: z.number().int().nonnegative(),
    postUrl: z.string().url().max(500)
  })).max(20);

  const result = PostSchema.safeParse(req.body.data);
  if (!result.success) {
    return res.status(400).json({ success: false, errors: result.error.format() });
  }
  ```

---

#### WEAK-02: Event Loop Blocking via Synchronous File I/O
* **Severity:** **Medium**
* **Evidence:**  
  [server.ts:86, 95, 123](file:///C:/Users/RajRu/.gemini/antigravity-ide/scratch/achol-repo/server.ts#L86): `fs.readFileSync` and `fs.writeFileSync` run synchronously on the main Node.js thread during HTTP request processing.
* **Risk:** Synchronous I/O halts the entire Node.js event loop during disk reads/writes. A single slow I/O operation delays all concurrent users.
* **Affected Location:** `server.ts:86, 95, 123`.
* **Why It Matters:** Performance and availability risk under load.
* **Recommended Fix:**  
  Replace synchronous calls with asynchronous promises (`fs.promises.readFile`, `fs.promises.writeFile`).

---

### 2.3. Missing Controls

#### CTRL-01: Absence of HTTP Security Headers (Helmet)
* **Severity:** **Medium**
* **Evidence:**  
  [server.ts:76-80](file:///C:/Users/RajRu/.gemini/antigravity-ide/scratch/achol-repo/server.ts#L76-L80): `server.ts` does not load `helmet`.
* **Risk:** Missing defenses against clickjacking (`X-Frame-Options`), MIME-type sniffing (`X-Content-Type-Options`), and cross-site scripting via Content Security Policy (`CSP`).
* **Affected Location:** `server.ts:76-80`.
* **Why It Matters:** Industry-standard defense-in-depth requires basic HTTP security headers.
* **Recommended Fix:**  
  Install and enable `helmet`:
  ```typescript
  import helmet from "helmet";
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "https:", "data:"],
        frameSrc: ["'self'", "https://www.youtube.com"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"]
      }
    }
  }));
  ```

---

#### CTRL-02: Absence of API Rate Limiting
* **Severity:** **Medium**
* **Evidence:**  
  No rate limiting middleware (`express-rate-limit`) is installed or configured.
* **Risk:** Automated clients can spam `POST /api/instagram` or flood `GET /api/instagram`, degrading server responsiveness.
* **Affected Location:** `server.ts:80-83`.
* **Why It Matters:** Protects backend services against brute force, denial of service, and resource exhaustion.
* **Recommended Fix:**  
  Apply rate limiting to all `/api/` routes:
  ```typescript
  import rateLimit from "express-rate-limit";
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/", apiLimiter);
  ```

---

### 2.4. Potential Risks Requiring Verification

#### RISK-01: Deployment Topology Mismatch (Vercel vs. Hostinger vs. Node Server)
* **Severity:** **Low**
* **Evidence:**  
  The live URL is `https://achol.vercel.app/` (Vercel static hosting). The repo also documents Hostinger static hosting in `README.md`, while maintaining a Node.js Express server (`server.ts`).
* **Risk:**
  - On static hosting platforms (Vercel SPA, Hostinger `public_html`), `server.ts` is never executed. Requests to `/api/instagram` will fail (404), causing the gallery save function to fail silently.
  - On self-hosted Node.js servers, if deployed directly without an HTTPS reverse proxy (Nginx/Caddy/Cloudflare), traffic is transmitted over unencrypted plaintext HTTP.
* **Affected Location:** Deployment configuration.
* **Why It Matters:** Architectural mismatches between static hosting and dynamic backend code create broken features or unencrypted communication channels.
* **Recommended Fix:** Clarify hosting strategy:
  - If pure static hosting: Migrate Instagram feed editing to a headless CMS (Sanity, Contentful, or static JSON in Git).
  - If Node.js hosting: Ensure an HTTPS reverse proxy terminates TLS and enforces secure headers.

---

## 3. Prioritized Hardening Roadmap

1. **Phase 1 (Immediate / Critical):**
   - Restrict `POST /api/instagram` with a pre-shared environment secret (`ADMIN_API_KEY`).
   - Remove client-side passcodes (`'achol123'`) and hint copy from `src/App.tsx`.
   - Reduce body parser limit from `15mb` to `100kb`.
2. **Phase 2 (High / Within 7 Days):**
   - Implement Zod schema validation on incoming JSON posts.
   - Convert synchronous file I/O (`fs.writeFileSync`) to asynchronous atomic file writes.
   - Install `helmet` for HTTP security headers and Content Security Policy.
3. **Phase 3 (Medium / Next Sprint):**
   - Add `express-rate-limit` on all API routes.
   - Implement structured request logging with error anonymization.
   - Standardize deployment pipeline and environment variable documentation.
