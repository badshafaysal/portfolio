# Badsha Faysal — Portfolio (v3.3 · Easy to update)

Professional portfolio with a **simple admin panel**.  
Add projects (text + photos) **without writing code**.

**Improvements in this revision**
- **Auto-synced filters** — category buttons are generated from the projects you actually publish (no hard-coded filters to maintain)
- **Faster images** — project and profile photos ship as optimized JPEG + WebP; browser picks the smaller modern format
- **Smarter loading** — lazy-load below the fold, higher priority for the first few cards, correct `sizes` / dimensions
- Still pure static output (fast), still Decap CMS at `/admin`

---

## What you get

- Beautiful portfolio (dark / light mode)
- Project filters + per-project photo gallery
- **Admin panel** at `/admin` — title, description, image, publish
- Free hosting on Cloudflare Pages
- Connected to your GitHub

---

## One-time setup (do this once)

### 1. Create a GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `badsha-portfolio`
3. Keep it **Public**
4. Click **Create repository**

### 2. Upload this project to GitHub

```bash
cd badsha-portfolio-cms-improved
git init
git add .
git commit -m "Portfolio v3.3"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/badsha-portfolio.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your real GitHub username.

### 3. Edit the admin config (important)

Open `public/admin/config.yml` and change:

```yaml
repo: YOUR_GITHUB_USERNAME/badsha-portfolio
```

to your real username/repo, e.g. `badshafaysal/badsha-portfolio`. Commit and push.

### 4. Deploy on Cloudflare Pages (free)

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages**
2. Connect GitHub → select `badsha-portfolio`
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. **Save and Deploy**

Live URL example: `https://badsha-portfolio.pages.dev`  
You can add a custom domain later.

### 5. Set up admin login (one time)

Decap's GitHub login needs an OAuth proxy when hosted on Cloudflare Pages (it only works out-of-the-box on Netlify).

1. Create a GitHub OAuth App (GitHub → Settings → Developer settings → OAuth Apps). Callback URL: `https://YOUR-PROXY/callback`
2. Deploy a free OAuth proxy, e.g. a Cloudflare Worker such as [sterlingwes/decap-proxy](https://github.com/sterlingwes/decap-proxy), with the app's Client ID/Secret
3. Put the proxy URL in `public/admin/config.yml` → `base_url`
4. Open `https://YOUR-SITE.pages.dev/admin/` → **Login with GitHub**

Only GitHub accounts with write access to the repo can publish.

---

## Daily use — add a project

1. Open `https://YOUR-SITE.pages.dev/admin/`
2. **Projects** → **New Project**
3. Fill title, description, categories, tags, image, order
4. **Publish**
5. Wait 1–2 minutes → refresh homepage

Edit or delete the same way from Admin.

See `HOW-TO-ADD-PROJECT.txt` for a short checklist.

---

## Image tips (speed)

Admin uploads land in `public/images/`. For best speed:

1. Prefer photos under ~2 MB before upload when possible
2. After uploading several large files, optionally run locally:

```bash
npm run optimize-images
git add public/images
git commit -m "Optimize images"
git push
```

That recompresses JPEGs and creates matching `.webp` files so the site serves modern formats automatically.

You do **not** need this for every single upload; the site still works with plain JPEG.

---

## Categories & filters

- Admin category options: **Industrial**, **Portal / PEB**, **Multi-storey**
- Filter buttons on the homepage are **built automatically** from categories used by published projects
- If you stop using a category, its filter button disappears after the next deploy
- To add a new category: add it to `CATEGORY_ORDER` + `CATEGORY_LABELS` in `src/lib/categories.ts` and to `public/admin/config.yml`. Unknown categories now fail the build instead of silently appearing

---

## Before going live

- Add your real `public/resume.pdf` (CV buttons 404 without it)
- Update `site` in `astro.config.mjs` and the URL in `public/robots.txt` if you use a custom domain
- In Web3Forms, restrict the access key to your domain

---

## Local development

```bash
npm install
npm run dev
```

Open the URL Astro prints (usually `http://localhost:4321`).

---

## Stack

- [Astro](https://astro.build) — static site generator
- [Decap CMS](https://decapcms.org) — Git-backed admin UI
- Cloudflare Pages — free host + Git deploys
