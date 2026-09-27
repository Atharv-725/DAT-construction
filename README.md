# 🏗️ DAT Construction — Website & Quote Portal

[![Astro](https://img.shields.io/badge/Astro-5.0+-BC52EE.svg?style=flat&logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000.svg?style=flat&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-Proprietary-navy.svg)](#)

Official corporate website and quote request web application for **DAT Construction**, a premier civil engineering, water treatment (STP), institutional landscaping, and infrastructure maintenance contractor based in Indore, Madhya Pradesh.

---

## 🌟 Key Features

* **⚡ Ultra-Fast Static & Serverless Hybrid Performance**: Built with **Astro 5** for lightning-fast page loads, automatic asset bundling, and minimal JavaScript overhead.
* **📱 100% Mobile Responsive & WCAG AA Accessible**:
  * Slide-down mobile navigation drawer with animated hamburger toggle.
  * Optimized touch targets, font scaling (iOS Safari zoom safe), and high-contrast typography tokens.
* **📝 Interactive Project Quote Portal**:
  * Provider-agnostic contact form (`/api/quote`) handling client inquiries.
  * **Anti-Spam Shield**: Built-in honeypot verification and minimum time-to-submit security checks.
  * **Automated Data Sync**: Submissions automatically forward to a Google Sheets webhook and log formatted Excel records.
* **🛠️ Equipment, Capabilities & Project Showcase**: Dynamic content pages showcasing civil capabilities, STP plant maintenance, equipment fleet, and verified credentials.
* **🔍 Built-in SEO & Sitemap**: Automated meta tags, OpenGraph social previews, canonical URLs, and sitemap generation via `@astrojs/sitemap`.

---

## 🛠️ Tech Stack

* **Framework**: [Astro](https://astro.build/)
* **Deployment Adapter**: `@astrojs/vercel` (Serverless Functions + Static CDN)
* **Language**: TypeScript (Strict Mode)
* **Styling**: Vanilla CSS (Custom Design System with CSS Custom Properties)
* **Fonts**: Manrope & Plus Jakarta Sans via `@fontsource`
* **Data Processing**: ExcelJS & Google Apps Script Webhooks

---

## 📂 Project Structure

```text
DAT-CONSTRUCTION/
├── astro.config.mjs         # Astro & Vercel adapter configuration
├── package.json             # Dependencies & npm scripts
├── tsconfig.json            # TypeScript configuration
├── public/                  # Static assets (favicons, manifest, images)
└── src/
    ├── components/          # Reusable Astro components (WhatsApp float, etc.)
    ├── content/             # Markdown content collections (projects, cases)
    ├── data/                # Company metadata & profile JSON files
    ├── layouts/             # Base HTML document layout & site header/footer
    ├── lib/                 # Helper utilities (company data loader)
    ├── pages/               # Site pages & API endpoints
    │   ├── api/
    │   │   └── quote.ts     # Serverless POST endpoint for quote requests
    │   ├── index.astro      # Homepage
    │   ├── about.astro      # About Us
    │   ├── services.astro   # Civil & maintenance services
    │   ├── projects.astro   # Infrastructure portfolio
    │   ├── contact.astro    # Quote request form
    │   └── ...              # Legal, credentials, team, & 404 pages
    ├── scripts/             # Client-side TypeScript modules (enquiry form logic)
    └── styles/              # Global CSS, typography tokens, & responsive media queries
```

---

## ⚙️ Environment Variables

Configure these variables in your local `.env` file or on your **Vercel Project Settings**:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| **`PUBLIC_FORM_ENDPOINT`** | API endpoint for the quote form | `/api/quote` |
| **`PUBLIC_FORM_KEY`** | Optional 3rd-party API key | *(Leave empty for built-in handler)* |
| **`GOOGLE_SHEETS_WEBHOOK_URL`** | Webhook URL to stream quotes to Google Sheets | *(Google Apps Script Exec URL)* |

---

## 🚀 Local Development Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Atharv-725/DAT-construction.git
   cd DAT-construction
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local dev server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:8080](http://localhost:8080) in your browser to view the site.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build locally**:
   ```bash
   npm run preview
   ```

---

## ☁️ Deployment on Vercel

This repository is optimized for one-click deployment on **Vercel**:

1. Push your changes to GitHub (`main` branch).
2. Connect your repository to **Vercel**.
3. Vercel will automatically detect Astro and select `@astrojs/vercel`.
4. When prompted for `PUBLIC_FORM_ENDPOINT`, enter `/api/quote`.
5. Click **Deploy**.

---

## 📄 License

Copyright © 2026 DAT Construction. All rights reserved.
