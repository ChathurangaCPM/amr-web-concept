# Infinitude Robotics — NEXUS M2 Web Platform

Next.js App Router web platform for **NEXUS M2**, the flagship infrastructure-free Autonomous Mobile Robot (AMR) by **Infinitude Robotics**. Built for ultra-high performance on **Cloudflare Workers** with **Tailwind CSS v4** and real-time **Three.js WebGL simulations**.

---

## ⚡ Features

- **Hero 3D Studio Simulation**: Real-time Three.js WebGL visualization demonstrating 4 AMR capabilities:
  - `01`: 1,000 kg electro-mechanical scissor-lift deck & cargo crate.
  - `02`: Natural-feature 20 Hz vSLAM navigation & obstacle bypass.
  - `03`: ISO 3691-4 PL-d collaborative 360° safety shield & ±5 mm auto-docking.
  - `04`: 13-module industrial serviceable architecture (exploded X-ray).
- **Mind of the Machine (3D Synchronized Simulations)**: Section 2 cards with real-time 3D interactive demonstrations for zero-track vSLAM, 360° sensor fusion, sub-5ms dynamic re-planning, and 24/7 continuous duty cycles.
- **360° Studio Inspection & Dossier**: Orthographic perspectives (`FRONT 000°`, `PORT 090°`, `REAR 180°`, `STARBOARD 270°`, `ZENITH +90°`, `NADIR −90°`) with interactive hardware callout pins and live camera azimuth radar compass.
- **Dynamic Drive Simulator**: Interactive A* + Dynamic Window Approach (DWA) SLAM pathfinding simulation canvas.
- **Dynamic Demo Dispatch Terminal**: Cyberpunk terminal interface with client-side & server-side **Zod validation**, dynamic status stream, ticket generator, and **Gmail SMTP** automated email dispatch.
- **Modern Industrial Dark UI**: Tailwind CSS v4 utility classes, custom fonts (Cabinet Grotesk & JetBrains Mono), magnetic cursor physics, and ambient particle clouds.
- **SEO & Performance Optimized**: Metadata, OpenGraph cards, Twitter preview cards, canonical tags, `sitemap.xml`, and `robots.txt`.

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (Optional for Live Gmail SMTP)

Copy `.env.example` to `.env` and fill in your Gmail app credentials:

```bash
cp .env.example .env
```

```ini
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
CONTACT_RECIPIENT_EMAIL=dispatch@infinituderobotics.com
```

*(If environment variables are omitted, the contact API runs in preview mode with full Zod validation and local console logging).*

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production

```bash
npm run build
```

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) App Router via [vinext](https://github.com/vinext/vinext)
- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/) (`@vinext/cloudflare` + `workerd`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS
- **3D Graphics**: [Three.js](https://threejs.org/)
- **Validation**: [Zod v4](https://zod.dev/)
- **Email Delivery**: [Nodemailer](https://nodemailer.com/) via Gmail SMTP
- **Animation**: CSS Hardware-Accelerated Transforms & Motion

---

## 📄 License

© 2026 Infinitude Robotics Inc. All rights reserved.
