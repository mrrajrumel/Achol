# Threat Model: Achol Akhe Superstar Portfolio & Press Kit

**Document Version:** 1.0.0  
**Scope:** Full-Stack Application (`server.ts`, Vite/React SPA frontend, Express backend, flat-file persistence, and deployment topology).  
**Methodology:** STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) combined with OWASP Top 10 for Web Applications.

---

## 1. System Overview & Architecture

The application is an artistic portfolio and digital press kit representing Bangladeshi actress Achol Akhe.
* **Frontend:** Single-page React 19 application bundled with Vite and Tailwind CSS v4, utilizing Motion for UI animation.
* **Backend:** Express 5.2.1 web server in `server.ts` that provides static SPA serving and custom REST endpoints (`/api/instagram`).
* **Data Layer:** Flat-file JSON persistence in `instagram_data.json` located at the process working root. Core portfolio items (filmography, biography, awards) are statically embedded in `src/data.ts`.
* **External Communication:** Client-side `mailto:` generation for bookings, YouTube embeds (`<iframe>`) for showreels, and external CDN image fetching.

```
+-----------------------------------------------------------------------------------------+
|                                     UNTRUSTED ZONE                                      |
|                                                                                         |
|   +-------------------+                     +---------------------------------------+   |
|   | Public Visitor /  |                     | Malicious Actor / Automated Bot       |   |
|   | Booking Client    |                     |                                       |   |
|   +---------+---------+                     +-------------------+-------------------+   |
|             |                                                   |                       |
+-------------|---------------------------------------------------|-----------------------+
              | HTTPS/HTTP                                        | Direct HTTP Requests
              v                                                   v
+-----------------------------------------------------------------------------------------+
| TRUST BOUNDARY 1: Web Application Perimeter                                             |
|                                                                                         |
|   +---------------------------------------------------------------------------------+   |
|   | Express Server (server.ts) - Port 3000 (0.0.0.0)                                |   |
|   | - express.json({ limit: "15mb" })                                               |   |
|   | - GET  /api/instagram                                                           |   |
|   | - POST /api/instagram  [UNAUTHENTICATED FILE OVERWRITE]                         |   |
|   | - Static SPA fallback  (dist/index.html)                                        |   |
|   +---------------------------------------+-----------------------------------------+   |
|                                           |                                             |
+-------------------------------------------|---------------------------------------------+
                                            | Local FS I/O
                                            v
+-----------------------------------------------------------------------------------------+
| TRUST BOUNDARY 2: Server Host Filesystem                                                |
|                                                                                         |
|   +---------------------------------------+                                             |
|   | instagram_data.json (Flat file)       |                                             |
|   +---------------------------------------+                                             |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Key Assets

| Asset ID | Asset Description | Sensitivity Level | Integrity Impact | Confidentiality Impact |
| :--- | :--- | :--- | :--- | :--- |
| **AST-01** | **Instagram Social Feed (`instagram_data.json`)** | Medium | Defacement, injection of malicious or inappropriate links | Publicly accessible feed |
| **AST-02** | **Server Host Availability & CPU/RAM** | High | System crash, event loop locking, disk exhaustion | Service denial |
| **AST-03** | **Brand Reputation & Public Public Relations Data** | High | Defacement, fraudulent representation of actress/brand | Reputational damage |
| **AST-04** | **Booking Inquirer Communication** | Medium | Spoofed submissions, phishing, PR communication interception | High (contains corporate contact emails) |
| **AST-05** | **Client Application Execution Integrity** | High | Malicious redirection via protocol injection (`javascript:`) | Session compromise / phishing |

---

## 3. Trust Boundaries

1. **TB-01: Public Internet to Express Server (`server.ts`)**
   - Unauthenticated perimeter. Any HTTP client on the internet can initiate TCP connections and send HTTP payloads to port 3000.
2. **TB-02: Client SPA Browser to Internal Admin Modal (`src/App.tsx`)**
   - The admin panel (`isAdminOpen`, `isAdminUnlocked`) runs entirely within the client's DOM. The boundary between visitor and admin is governed by client-side JavaScript string equality without server-side enforcement.
3. **TB-03: Express Process to Local File System (`DATA_FILE_PATH`)**
   - Node process execution boundary where JSON data is written to disk via synchronous file descriptors.

---

## 4. Threat Actors

* **TA-01: Unauthenticated Internet Attacker (Script Kiddie / Scanner):** Probes for open POST endpoints, tests default credentials, submits random large JSON arrays to consume disk space.
* **TA-02: Malicious Web Visitor:** Inspects client-side source code via DevTools, discovers hardcoded passcodes (`achol123`), unlocks the admin modal in the browser, and alters public gallery items.
* **TA-03: Defacer / Competitor:** Aims to replace verified celebrity Instagram feed images with defamatory, illicit, or phishing URLs.
* **TA-04: PR Impersonator / Spammer:** Manipulates booking inputs to conduct phishing attacks or client-side spamming.

---

## 5. Entry Points

* **EP-01:** `POST /api/instagram` — Accepts JSON body up to 15MB, writes directly to `instagram_data.json`.
* **EP-02:** `GET /api/instagram` — Returns raw contents of `instagram_data.json`.
* **EP-03:** Client Booking Form (`src/App.tsx:862`) — Accepts user input (`name`, `company`, `email`, `projectType`, `message`) and constructs `mailto:` URLs.
* **EP-04:** Client Admin Passcode Input (`src/App.tsx:150`) — Form input evaluated against hardcoded literals.
* **EP-05:** Static Assets / Catch-all Route (`server.ts:147`) — Delivers bundled HTML/JS.

---

## 6. Threat Analysis (STRIDE Matrix)

### 6.1. Spoofing
* **T-01: Admin Identity Spoofing**
  * *Evidence:* `server.ts:113` accepts `POST /api/instagram` with zero authorization headers, session cookies, or API keys.
  * *Threat:* Any entity can claim to be the site administrator and issue write operations.
  * *Likelihood:* High | *Impact:* High | *Risk Severity:* **Critical**

* **T-02: Booking Inquirer Spoofing**
  * *Evidence:* `src/App.tsx:232-255` generates a client `mailto:` link without validating sender email origin or implementing CAPTCHA.
  * *Threat:* Attackers can craft malicious URLs or spam the booking inbox.
  * *Likelihood:* Medium | *Impact:* Low | *Risk Severity:* **Low**

### 6.2. Tampering
* **T-03: Arbitrary Content Overwrite of Social Gallery**
  * *Evidence:* `server.ts:123` executes `fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");` whenever `data` is an array.
  * *Threat:* An attacker wipes out all curated posts by sending `{"data": []}`, or replaces them with explicit images or phishing links.
  * *Likelihood:* High | *Impact:* High | *Risk Severity:* **Critical**

* **T-04: Client-Side Passcode Bypass**
  * *Evidence:* `src/App.tsx:153`: `if (cleanCode === 'achol' || cleanCode === 'achol123' || cleanCode === 'admin')`
  * *Threat:* Anyone inspecting bundle source code can bypass the modal lock or flip `isAdminUnlocked = true` in React DevTools.
  * *Likelihood:* High | *Impact:* Medium | *Risk Severity:* **High**

### 6.3. Repudiation
* **T-05: Absence of Audit Logging for State Changes**
  * *Evidence:* `server.ts` does not record remote IP addresses, timestamps, or request origins upon executing writes to `instagram_data.json`.
  * *Threat:* If content is altered or defaced, administrators cannot trace the source IP or timestamp of the intrusion.
  * *Likelihood:* High | *Impact:* Medium | *Risk Severity:* **Medium**

### 6.4. Information Disclosure
* **T-06: Passcode and Recipient Email Exposure in Bundled Client Code**
  * *Evidence:* `src/App.tsx:153, 157, 236`: Admin passcodes (`'achol123'`) and personal email (`'rajrum3l@gmail.com'`) are hardcoded in the client bundle.
  * *Threat:* Scrapers collect personal developer emails for phishing and harvest admin passcodes.
  * *Likelihood:* High | *Impact:* Medium | *Risk Severity:* **Medium**

* **T-07: Error Stack / File System Path Leakage**
  * *Evidence:* `server.ts:132`: `return res.status(500).json({ success: false, message: "Failed to save posts: " + error.message });`
  * *Threat:* Internal server paths or filesystem errors are reflected directly in HTTP 500 JSON responses.
  * *Likelihood:* Medium | *Impact:* Low | *Risk Severity:* **Low**

### 6.5. Denial of Service (DoS)
* **T-08: Node.js Event Loop Blocking via Synchronous File I/O**
  * *Evidence:* `server.ts:86, 95, 123` uses `fs.readFileSync` and `fs.writeFileSync` inside Express route handlers.
  * *Threat:* Large payloads being parsed or written synchronously freeze the single-threaded Node.js event loop, preventing all other incoming requests from being served.
  * *Likelihood:* Medium | *Impact:* High | *Risk Severity:* **High**

* **T-09: Disk Space Exhaustion & Resource Overload (15MB Payload Limit)**
  * *Evidence:* `server.ts:80`: `app.use(express.json({ limit: "15mb" }));` with no rate limiting (`express-rate-limit`).
  * *Threat:* Automated bots flood `POST /api/instagram` with 15MB arrays, exhausting server memory and disk storage.
  * *Likelihood:* High | *Impact:* High | *Risk Severity:* **High**

### 6.6. Elevation of Privilege
* **T-10: Complete Authorization Bypass**
  * *Evidence:* The server has no concept of roles or authentication tokens. Any user is implicitly authorized to execute admin writes.
  * *Threat:* Public users exercise unconstrained administrative privileges over server state.
  * *Likelihood:* High | *Impact:* High | *Risk Severity:* **Critical**

---

## 7. Attack Scenarios

### Scenario A: Remote Website Defacement via Unauthenticated API
1. Attacker sends a single HTTP request:
   ```http
   POST /api/instagram HTTP/1.1
   Host: target-host:3000
   Content-Type: application/json

   {
     "data": [
       {
         "id": "defaced-1",
         "imageUrl": "https://malicious-site.com/exploit.jpg",
         "caption": "Defaced by Attacker",
         "likes": "999K",
         "comments": 999,
         "postUrl": "https://phishing-site.com"
       }
     ]
   }
   ```
2. `server.ts` checks only `Array.isArray(data)`, which evaluates to `true`.
3. `fs.writeFileSync` overwrites `instagram_data.json`.
4. Subsequent visitors loading `https://achol.vercel.app/` or the live site receive the defaced feed.

### Scenario B: Server Exhaustion / Crash via Unchecked Payload Flooding
1. Attacker writes a 5-line script looping 100 requests with 14.5MB random JSON string arrays to `POST /api/instagram`.
2. V8 allocates large buffer chunks; `fs.writeFileSync` blocks the event loop synchronously on each write.
3. Server memory spikes, and disk writes fill the host storage or trigger an Out-Of-Memory (OOM) process exit.

---

## 8. Mitigation Status

| Threat ID | Threat Name | Severity | Existing Mitigation | Mitigation Status | Recommended Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T-01, T-10** | Unauthenticated POST Endpoint | Critical | None on server (`App.tsx` has client-only passcode) | **Missing** | Add JWT/Session auth middleware or API key check |
| **T-03** | Arbitrary JSON Overwrite | Critical | Array type check only (`Array.isArray`) | **Inadequate** | Enforce strict schema validation (Zod/Joi) |
| **T-04** | Client Passcode Exposure | High | None (literals `'achol123'` in client JS) | **Missing** | Move authentication entirely to server-side |
| **T-08** | Event Loop Blocking | High | None (`fs.writeFileSync` used) | **Missing** | Use async `fs.promises.writeFile` with atomic rename |
| **T-09** | Unrestricted Payload & DoS | High | Payload capped at 15MB, but no rate limit | **Inadequate** | Reduce payload limit to 100KB; add `express-rate-limit` |
| **T-05** | No Access / Write Logs | Medium | `console.error` on failure only | **Missing** | Implement structured request and audit logging (Morgan/Winston) |
| **T-06** | Bundled Email Exposure | Low | Client obfuscation / mailto | **Acceptable** | Use backend contact form proxy if privacy is required |
