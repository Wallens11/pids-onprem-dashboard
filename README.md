# PIDS On-Prem Dashboard

Admin dashboard concept for managing an on-prem Passenger Information Display System (PIDS) environment.

This project was initially scaffolded from a v0 export, then adapted into a local Next.js codebase and refined as a portfolio-ready dashboard prototype. It focuses on the operational surface of a station display management system: display monitoring, train timetable control, announcements, emergency broadcast management, media assets, audit logs, and settings.

## Highlights

- Dashboard overview with operational KPIs and recent activity
- Display monitoring pages with detail routes
- Timetable, announcements, emergency broadcast, media, users, logs, and settings sections
- Reusable UI components built with Next.js, React, Radix UI, and Tailwind CSS
- Mock data layer suitable for replacing with API integrations later

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- Recharts
- pnpm

## Local Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) after the dev server starts.

## Production Check

```bash
pnpm build
pnpm start
```

## Portfolio Notes

This repository is positioned as a product-style admin dashboard concept. The current implementation uses mock operational data and is a good base for future improvements such as:

- API integration for live display and train updates
- Authentication and role-based access
- Search, filtering, and bulk actions
- Real-time status updates via websockets or polling
