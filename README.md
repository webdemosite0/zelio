# ZELIO — Next.js Landing Page

A Next.js (App Router) + React + TypeScript + Tailwind CSS recreation of the
ZELIO landing page — "AI Operating System for Founders. One founder. An
entire AI company."

Everything is built from code: the ZELIO wordmark and Z-ribbon logo are
inline SVG, the product dashboard mockup is divs + SVG, and all imagery is
CSS gradients. No external image assets required.

## Requirements

- Node.js 18.18+ (tested with Node 24)
- npm 9+

## Setup

```bash
npm install
```

## Run the dev server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

## Project structure

```
app/
  layout.tsx      # Root layout, metadata, Geist font
  page.tsx        # Composes all sections
  globals.css     # Tailwind v4 theme tokens, brand keyframes, utilities
components/
  ZelioLogo.tsx        # Wordmark + two-ribbon Z mark (inline SVG)
  Navbar.tsx           # Floating nav, translucent on scroll, mobile menu
  Hero.tsx             # Badge, headline, CTAs, social proof, gradient blobs
  DashboardPreview.tsx # Tilted 3D product mockup: sidebar, greeting,
                       # agent constellation with hover tooltips + pulses,
                       # command bar. Mouse parallax + reduced-motion safe.
  LogoStrip.tsx        # "Trusted by founders worldwide" text wordmarks
  FeatureCards.tsx     # AI Team / Real Execution / All in One Place /
                       # Built for Founders
  HowItWorks.tsx       # "From idea to execution in minutes." + 4 steps
  FinalCTA.tsx         # Rounded panel with cursor-reactive gradient
  Footer.tsx           # Minimal footer
```

## Notes

- Animations use CSS transforms/opacity only, respect
  `prefers-reduced-motion`, and degrade gracefully on touch devices.
- Brand palette: `#258BFF → #6157FF → #B642FF → #FF3E9D → #FF7657 → #FFCB45`
  (signature gradient), ink `#11121A`, muted `#727586`, mist `#F7F7FB`.
