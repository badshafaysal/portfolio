# Badsha Faysal — Portfolio (v3.7.2 · Easy to update)

Professional portfolio with a **simple admin panel**.  
Add projects (text + photos) **without writing code**.

**v3.7.2 — fixes the actual Cloudflare build failure**
- `astro build` failed with `pickRelated is not defined` on the project pages. Astro compiles `getStaticPaths` into its own isolated module and doesn't carry along separate helper functions defined alongside it — that logic is now inlined directly inside `getStaticPaths`, which is the only place it's used
- Confirmed clean by tracing every function called from `getStaticPaths` across all pages, and by matching this deployment's own build log

**v3.7.1 — bug fixes (audit pass, no visible changes needed on your end)**
- The WhatsApp and LinkedIn buttons in the Contact section were hardcoded and would not update if you changed the number/URL in Site settings — they now read from Site settings like the floating WhatsApp button does
- The sample-drawing PDF upload now saves to `public/files/` instead of mixing into the images folder
- Full pass over every template, script and data file to confirm nothing references a field, id or class that doesn't exist

**What's new in v3.6**
- **New sections, all editable in `/admin`:** experience timeline, education & training, grouped skills, clients strip, FAQ, availability badge, 9 services (incl. RCC/architectural, ETP/WTP, site inspection, safety & compliance)
- **Project pages:** role, software, deliverables, size, duration, challenge / solution / result, *links to previous or related work*, sample-sheet PDF, "More projects", "Get a quote" (pre-fills the contact form), full-screen photo viewer with swipe and arrow keys
- **Contact:** structure type, location, timeline and drawings-link fields; floating WhatsApp button on phones; map loads only when tapped
- **Speed:** smaller card images (480/800 px), compressed hero video (2.8 MB → 0.6 MB, no autoplay on phones / data saver / reduced motion), skeleton placeholders, fewer font weights
- **SEO:** Person, ProfessionalService, FAQ and project structured data; alt text with type and location; `robots.txt` and sitemap follow your domain automatically
- **Accessibility:** skip link, better light-mode contrast, focus returns to the Share button after the dialog closes, visible focus rings
- **Maintenance:** GitHub build check on every push, optional cookie-free Cloudflare analytics, 404 page links to Projects
- **Public CV:** `public/resume.pdf` generated without family details, date of birth, marital status, home address or reference

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

- Admin category options: **Industrial**, **Portal / PEB**, **Multi-storey**, **Retrofitting / As-Built**
- Filter buttons on the homepage are **built automatically** from categories used by published projects
- If you stop using a category, its filter button disappears after the next deploy
- To add a new category: add it to `CATEGORY_ORDER` + `CATEGORY_LABELS` in `src/lib/categories.ts` and to `public/admin/config.yml`. Unknown categories now fail the build instead of silently appearing

---

## Editing site content (no code)

Admin → **Site content** has one entry each for: Site settings, Services, Experience, Education & training, Skills, Clients strip, FAQ, Model → drawing comparison and Testimonials.

- **Years of experience** are calculated from the start year in Site settings, so "9+" updates itself each year.
- **Availability badge** (hero) can be switched off or reworded.
- **Model → drawing slider:** upload two images, then tick *Show on site*. It stays hidden until both exist.
- **FAQ answers, the pricing note and service descriptions are starter text.** Read them and change anything that is not how you actually work.
- **Clients strip:** list only clients who agree to be named.

---

## Hosting: Cloudflare Pages (badshafaysal.pages.dev)

This site is served by **Cloudflare Pages**, connected to this GitHub repo. Cloudflare builds and deploys automatically on every push to `main` — you don't need a GitHub Actions deploy workflow for this.

**One-time Cloudflare Pages project settings** (Cloudflare dashboard → your Pages project → Settings → Builds & deployments):
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/` (leave blank unless this repo has the project in a subfolder)

**Turn off GitHub's own Pages feature**, so it stops trying to build/serve this repo on its own (that system doesn't know how to build Astro and its failed runs are just noise): repo → **Settings → Pages → Build and deployment → Source → None**.

The `.github/workflows/build-check.yml` workflow in this repo is CI only — it runs `npm run build` on every push so a broken build shows up as a red ❌ in the Actions tab *before* Cloudflare tries to deploy it. It does not publish anything.

---

## Before going live

- Replace `public/resume.pdf` whenever your CV changes (the current file is a public version without personal details)
- **Domain:** set the `SITE_URL` environment variable in Cloudflare Pages (or edit the fallback in `astro.config.mjs`). Meta tags, sitemap and `robots.txt` follow it. Also update `site_url` in `public/admin/config.yml`
- In Web3Forms, restrict the access key to your domain
- Optional: paste a Cloudflare Web Analytics token in Site settings for cookie-free visitor stats
- Optional: self-host the two Google Fonts (DM Sans, Playfair Display) for extra speed. Download them, place them in `public/fonts/`, add `@font-face` rules to `styles.css`, and remove the Google Fonts links in `src/layouts/Base.astro`
- Add real client testimonials when you have them; the section appears automatically

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
