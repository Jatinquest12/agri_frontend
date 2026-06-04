# Agritrust Frontend

Next.js 16 application for the Agritrust farm registry, crop intelligence, and verification platform.

## Quick start

```bash
npm install
cp .env.example .env.local   # if present
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the marketing home page and portal links.

## Environment

Set `NEXT_PUBLIC_BACKEND_API_BASE` to your API root including `/api` (for example `http://127.0.0.1:5000/api`).

Backend demo auth: `DEMO_OTP` and `ADMIN_PHONES` on the API service.

## Portals

| Route | Audience |
|-------|----------|
| `/farmer/login` | Farmers — farms, insights, proof |
| `/admin/login` | Staff — approvals, analytics, verification |
| `/verify` | Public — proof checks without login |
| `/lab` | Developers — direct API console |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run test:e2e` — Playwright tests

## Content & marketing

Landing page copy and structure live in `src/data/site-content.ts`. Section components are under `src/components/sections/`.

## Implementation plan

See [docs/FRONTEND_IMPLEMENTATION_PLAN.md](./docs/FRONTEND_IMPLEMENTATION_PLAN.md) for the phased API integration roadmap.
