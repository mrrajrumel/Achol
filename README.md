# 💎 Achol Akhe — Superstar Portfolio & Digital Press Kit

An ultra-premium, high-fashion digital press kit and portfolio engineered for **Achol Akhe** (Hasna Hena Akhee Achol), the premier contemporary icon of the Bangladeshi cinematic industry (Dhallywood).

---

## 📢 User & Editor Guide

A clear, step-by-step guide for updating content, replacing images, and deploying the portfolio.

---

### 1. How to Update Website Text & Content
All website content—such as filmography, biography highlights, awards timeline, showreel video details, and Instagram feed data—is organized in a single central file:

* **File Location:** `/src/data.ts`
* **Instructions:**
  1. Open `/src/data.ts` in your code editor.
  2. Locate the section you want to modify:
     - `filmographyProjects`: Movie titles, release years, badges, roles, and descriptions.
     - `timelineAwards`: Career milestone awards, awarding organizations, and years.
     - `showreelVideos`: Video trailer titles, YouTube embed IDs, and runtimes.
     - `instagramPosts`: Curated social gallery photos, captions, and links.
  3. Edit the text values directly.
  4. Save the file. The changes will update immediately in development or after your next build.

---

### 2. How to Add and Replace Images
There are two ways to add or replace images across the website:

* **Option A: Using Online Image URLs (Recommended & Easiest)**
  * Copy the direct URL of any image (hosted on Cloudinary, Imgur, Unsplash, or CDN).
  * Paste the link into the `imageUrl` or `thumbnail` property inside `/src/data.ts`.

* **Option B: Using Local Image Files**
  1. Copy your local image file (e.g., `banner.jpg` or `poster.png`).
  2. Place it inside the **`/public`** folder of this repository.
  3. In `/src/data.ts`, set the path to `"/banner.jpg"` (prefixed with `/`, omitting the `public` folder name).

---

### 3. How to Deploy to Hostinger (or Static Web Hosting)
Follow these simple steps to deploy the application to Hostinger:

#### Step 1: Generate the Production Build
Run the build script in your terminal:
```bash
npm run build
```
*This generates a compiled, optimized static bundle in the **`dist`** directory.*

#### Step 2: Create a ZIP Archive
1. Open the generated **`dist`** directory.
2. Select **all files and folders inside `dist`** (including `index.html` and the `assets` folder).
3. Compress/Zip the selected files into an archive (e.g., `dist-bundle.zip`).  
*(Important: Compress the contents inside the `dist` folder, not the `dist` folder itself).*

#### Step 3: Log In to Hostinger
1. Navigate to [Hostinger hPanel](https://hpanel.hostinger.com).
2. Click **Manage** next to your hosting account.

#### Step 4: Access File Manager
1. In the hPanel dashboard, select **File Manager**.
2. Open the **`public_html`** directory (the root web directory).

#### Step 5: Upload and Extract Files
1. Click **Upload** in the top navigation and select your `dist-bundle.zip` file.
2. Once uploaded, right-click the zip archive and choose **Extract**.
3. Extract directly to `.` (the current `public_html` directory).
4. After extraction, delete the `.zip` file.

#### Step 6: Verify Deployment
Open your domain (e.g., `https://acholakhe.com` or `https://achol.vercel.app/`) in a web browser to confirm your live portfolio is functioning properly.

---

## 🛠️ Local Development & Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server (Vite + Express on Port 3000)
npm run dev

# 3. Create production build & bundle server
npm run build

# 4. Start production server locally
npm run start

# 5. Type-check TypeScript codebase
npm run lint
```

---

## 💎 Design Concept & Aesthetic Highlights

* **Volcanic Obsidian Canvas**: Pure deep obsidian (`#0A0A0A`) background providing high contrast and framing radiant portraiture.
* **Translucent Champagne Gold**: Metallic glow accents (`#D4B27A` / `#DFBA73`) signifying luxury, prestige, and cinematic elegance.
* **Creamy Alabaster Pearl Elements**: High-contrast, readable typography (`#FDFBF7`) meeting WCAG accessibility guidelines.
* **Streamlined Architecture**: Single-page application architecture powered by React 19, Tailwind CSS v4, and Motion animations.
