# Attack Surface Analysis: Achol Akhe Superstar Portfolio

**Document Version:** 1.0.0  
**Scope:** Network listeners, HTTP endpoints, browser runtime inputs, client-side state managers, storage sinks, external dependencies, and third-party integrations.

---

## 1. Attack Surface Summary Matrix

| Surface Category | Exposure Level | Primary Risk Vector | Findings Summary |
| :--- | :--- | :--- | :--- |
| **Public API Endpoints** | High | Unauthenticated file writes & resource exhaustion | 2 active endpoints (`GET /api/instagram`, `POST /api/instagram`) |
| **Internal Endpoints** | None | N/A | No private microservices, VPC endpoints, or internal routes |
| **Auth / Access Control** | High | Complete client-side bypass | Client-evaluated passcode in React state; zero server checks |
| **User Input Processing** | Medium | Denial of Service / Malformed data | JSON body parser (15MB), contact form client inputs |
| **File Uploads** | None | N/A | No multipart file upload parser (e.g., `multer`) configured |
| **Storage / Persistence** | High | Flat-file corruption, unauthenticated overwrites | `instagram_data.json` at process working root |
| **Webhooks** | None | N/A | No incoming or outgoing webhooks |
| **Third-Party Integrations**| Low | External image fetching, YouTube iframe embed | Unsplash, Google CDN, Manorama Online, YouTube |
| **Network & Hosting** | Medium | Missing security headers, exposed 0.0.0.0 binding | Express listening on port 3000 without Helmet or CORS |

---

## 2. HTTP Endpoints & API Surface

### 2.1. Public Endpoints

#### 1. `POST /api/instagram`
* **Network Visibility:** Internet-accessible (Port 3000 / Reverse Proxy).
* **Handler:** [server.ts:113-135](file:///C:/Users/RajRu/.gemini/antigravity-ide/scratch/achol-repo/server.ts#L113-L135).
* **Authentication:** None.
* **Request Format:** `application/json` (Payload limit: `15mb`).
* **Expected Parameters:** `{ data: Array<InstagramPost> }`.
* **Behavior:** Directly executes `fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8")`.
* **Confirmed Vulnerability (Severity: Critical):**
  * *Evidence:* `server.ts:113` lacks any authentication middleware or session verification.
  * *Risk:* Remote attackers can deface the gallery by replacing all posts with arbitrary image links and text, or cause a denial of service by sending `{"data": []}`.
  * *Affected Location:* `server.ts:113-135`.
  * *Why It Matters:* Public write access allows persistent unauthorized modification of website content.
  * *Recommended Fix:* Gate this route behind server-side authentication (e.g., Bearer API token). Validate the request payload against a strict schema (e.g., Zod).

#### 2. `GET /api/instagram`
* **Network Visibility:** Internet-accessible (Port 3000 / Reverse Proxy).
* **Handler:** [server.ts:83-110](file:///C:/Users/RajRu/.gemini/antigravity-ide/scratch/achol-repo/server.ts#L83-L110).
* **Authentication:** None (Public read).
* **Response Format:** `application/json`.
* **Behavior:** Reads `instagram_data.json` and returns `{ success: true, source: "file", data: [...] }`.
* **Security Weakness (Severity: Medium):**
  * *Evidence:* Reads the file using synchronous `fs.readFileSync(DATA_FILE_PATH, "utf-8")` inside the route handler (`server.ts:86`).
  * *Risk:* Concurrent high-volume requests can block the Node.js event loop during file read and JSON parsing operations.
  * *Affected Location:* `server.ts:83-110`.
  * *Why It Matters:* Degrades response times and enables event loop exhaustion attacks under load.
  * *Recommended Fix:* Use asynchronous `fs.promises.readFile` with in-memory caching to avoid disk reads on every request.

#### 3. `GET *` (Static SPA Fallback)
* **Network Visibility:** Internet-accessible.
* **Handler:** [server.ts:147-149](file:///C:/Users/RajRu/.gemini/antigravity-ide/scratch/achol-repo/server.ts#L147-L149).
* **Behavior:** Serves `dist/index.html` and static assets (`dist/assets/*`).
* **Missing Control (Severity: Medium):**
  * *Evidence:* Express static files are served without standard security response headers (`helmet` is absent).
  * *Risk:* Clickjacking via iframes, MIME-sniffing attacks, and lack of Content-Security-Policy (CSP).
  * *Affected Location:* `server.ts:145-150`.
  * *Why It Matters:* Absence of baseline HTTP security headers weakens browser-level defenses.
  * *Recommended Fix:* Add `helmet` middleware configured with frameguard, nosniff, and strict CSP policies.

---

## 3. Administrative Surface & Client Authorization

### 3.1. Client-Side Admin Modal (`src/App.tsx`)
* **Trigger:** Clickable secret button in UI footer / gallery management.
* **State Variables:** `isAdminOpen`, `isAdminUnlocked`, `adminPasscode`.
* **Authorization Check:**
  ```typescript
  const cleanCode = adminPasscode.trim().toLowerCase();
  if (cleanCode === 'achol' || cleanCode === 'achol123' || cleanCode === 'admin') {
    setIsAdminUnlocked(true);
  }
  ```
* **Attack Vector:**
  1. **Inspection:** Attacker opens browser Developer Tools, searches bundle for `isAdminUnlocked` or `Hint:`, and finds the hardcoded passcodes.
  2. **Bypass:** Attacker types `achol123` or modifies the React component state directly via React DevTools to gain access to the post creation and deletion interface.
  3. **Direct API Call:** Attacker ignores the client modal entirely and sends raw HTTP requests directly to `POST /api/instagram`.

---

## 4. User Input Surfaces

### 4.1. Contact & Booking Form (`src/App.tsx:860-965`)
* **Inputs:**
  * `Full Name` (`bookingForm.name`) — Text input (`maxlength` unconstrained).
  * `Production / Brand House` (`bookingForm.company`) — Text input.
  * `Professional Email` (`bookingForm.email`) — Email input.
  * `Project Framework` (`bookingForm.projectType`) — Dropdown select.
  * `Collaboration Brief` (`bookingForm.message`) — Multi-line textarea.
* **Data Flow:**
  - The form is processed entirely client-side by `handleBookingSubmit`.
  - Values are interpolated into an email body string and encoded using `encodeURIComponent`.
  - Triggers a browser redirect via `window.location.href = mailto:...`.
* **Security Evaluation:**
  - **No Server Injection Risk:** Because input never touches a backend SQL database, shell command, or server runtime, server-side injection is impossible.
  - **XSS Assessment:** React JSX renders values via standard text nodes (`<span>{post.likes}</span>`), preventing DOM-based HTML injection.
  - **Spam / Abuse:** Because no backend email service is invoked, the server cannot be abused as an open email relay.

---

## 5. Storage & File System Surface

### 5.1. Flat-File Persistence (`instagram_data.json`)
* **Location:** Process current working directory (`process.cwd() + "/instagram_data.json"`).
* **Access Permissions:** Read/Write by the operating system user running the Node.js process.
* **Attack Vectors:**
  - **Overwrites:** Full file replacement on every valid `POST /api/instagram`.
  - **Race Conditions:** Simultaneous writes from concurrent requests will corrupt file contents due to lack of file locking.
  - **Disk Filling:** Rapid submissions of 15MB arrays will consume disk storage.

---

## 6. Third-Party Integrations & External Asset Surface

### 6.1. External Image Sinks
* **Domain Whitelist / CSP:** None enforced.
* **Observed Image Origins:**
  - `images.unsplash.com`
  - `encrypted-tbn0.gstatic.com`
  - `img-mm.manoramaonline.com`
  - `i0.wp.com`
  - `alchetron.com`
* **Risk:** The application loads images from arbitrary remote URLs defined in `instagram_data.json`. An attacker can specify images hosted on malicious servers to track visitor IP addresses or display inappropriate media.

### 6.2. YouTube Video Embed Player (`InteractiveShowreel.tsx`)
* **Implementation:**
  ```tsx
  <iframe
    src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
    title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    className="w-full h-full"
  />
  ```
* **Risk:** `activeVideo` is populated from `showreelVideos[].embedId` defined in `src/data.ts`. Because `showreelVideos` is static code and not user-editable at runtime, iframe injection is mitigated under current code.

---

## 7. Network & Deployment Exposure

### 7.1. Server Binding Configuration
* **Code:** `app.listen(PORT, "0.0.0.0", ...)` ([server.ts:152](file:///C:/Users/RajRu/.gemini/antigravity-ide/scratch/achol-repo/server.ts#L152)).
* **Analysis:** Binding to `0.0.0.0` exposes the Express listener to all network interfaces on the host (internal LAN, public WAN if without firewall).
* **Recommendation:** In containerized/proxied production deployments, bind to `127.0.0.1` unless running inside a Docker bridge network.

### 7.2. CORS Configuration
* **Code:** No `cors` middleware configured in `server.ts`.
* **Analysis:** Requests originating from third-party browser contexts are subject to browser Same-Origin Policy (SOP). However, `POST` requests without custom headers can be issued cross-origin (simple requests), or callers can invoke the API using server-to-server HTTP tools.

---

## 8. Dependency Attack Surface

* **Production Dependencies:**
  * `express: ^5.2.1` — Modern release of Express framework.
  * `lucide-react: ^0.546.0` — UI icons.
  * `motion: ^12.23.24` — Framer/Motion animation engine.
  * `react: ^19.0.1` / `react-dom: ^19.0.1` — Core React runtime.
  * `vite: ^6.2.3` — Bundler and development server.
* **Vulnerability Audit Status:**
  - Run via `npm audit`: Found 7 legacy transitive vulnerabilities in dev dependencies related to Vite dev server dependencies. Zero critical vulnerabilities exist in core production dependencies.
