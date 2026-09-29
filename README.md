# ZELIO — Full-Stack App (Next.js + SQLite)

ZELIO — "AI Operating System for Founders. One founder. An entire AI
company." A full-stack Next.js (App Router) + React + TypeScript + Tailwind
CSS app with real authentication and a SQLite database (Prisma).

Everything is built from code: the ZELIO wordmark and Z-ribbon logo are
inline SVG, the product dashboard mockup is divs + SVG, and all imagery is
CSS gradients. No external image assets required.

## Requirements

- Node.js 18.18+ (tested with Node 24)
- npm 9+

## Setup

```bash
npm install
cp .env.example .env   # then fill in AUTH_SECRET (any long random string)
npx prisma db push     # create the SQLite database
npm run db:seed        # seed the demo user + AI team
```

## Run the dev server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` — the ZELIO landing page
- `/login` — sign in (demo account below)
- `/register` — create your company (real working registration)
- `/dashboard` — the HQ product dashboard, protected by middleware:
  redirects to `/login` without a valid session

Demo credentials (seeded): **alex@zelio.ai** / **zelio123**

## How it works

- **Auth** — `lib/auth.ts` (bcrypt password hashing, JWT session via
  `jose`, httpOnly `zelio_session` cookie). API: `POST /api/auth/register`,
  `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`.
  `middleware.ts` protects `/dashboard/*`.
- **Database** — Prisma + SQLite (`prisma/schema.prisma`). Models: `User`,
  `Agent`, `Task`, `Activity`. The dashboard reads and writes through
  `GET/PATCH /api/agents`, `GET/POST/PATCH /api/tasks`,
  `GET /api/activity` — agent cards, the approve flow, task checkboxes,
  the command bar, and the activity feed all persist.
- **SQLite is for local dev.** Switching to Postgres for production is a
  one-line datasource change in `prisma/schema.prisma` — the rest of the
  code is database-agnostic.

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
  page.tsx        # Landing page — composes all sections
  login/          # Sign-in page (real auth, demo hint)
  register/       # Registration page
  dashboard/      # HQ dashboard (DB-driven client)
  api/
    auth/         # register, login, logout, me
    agents/       # list agents, update agent
    tasks/        # list/create tasks, toggle task
    activity/     # latest activity feed
lib/
  db.ts           # PrismaClient singleton
  auth.ts         # hashing, JWT sessions, cookie helpers
prisma/
  schema.prisma   # User, Agent, Task, Activity (SQLite)
  seed.ts         # demo user + 6 agents + tasks + activity
middleware.ts     # protects /dashboard/*
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
