# Performance Tracker

A modern, enterprise-style **performance & KPI tracking dashboard** built with React
and Vite. It gives leadership a single-screen view of corporate goals, departmental
KPIs and business-segment performance, and lets managers submit KPI reports through a
clean, role-aware interface.

> **Live demo:** _add your Vercel URL here_
>
> The application ships with **fictional sample data** ("Meridian Group") and runs
> entirely in the browser — no backend or sign-in required. Data you add is persisted
> to `localStorage` and can be reset from **Admin Settings**.

---

## Features

- **Executive dashboard** — headline stat tiles (average attainment, total goals, on-track, at-risk), two composition **donut charts** (goal status, goals by category) and a **business-segment bar chart**.
- **Corporate goals** — progress-ring cards with automatic status (On track / Watch / At risk).
- **Departmental goals** — current-vs-target KPI rows across departments.
- **Submit KPI report** — validated form (department, reporting period, attainment %, notes).
- **My Reports** — review and delete the reports you submitted.
- **Admin Settings** — add, adjust (live sliders) and remove corporate goals; reset demo data. Gated to the `admin` role.
- **Role switcher** — flip between **Admin** and **Manager** in the top bar to explore role-gated views.
- **Responsive & accessible** — works on mobile and desktop; colorblind-safe chart palette; legends plus direct labels so identity is never color-alone.

## Tech stack

| Area | Choice |
|------|--------|
| Framework | React 18 + React Router |
| Build tool | Vite 5 |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | lucide-react |
| State | Lightweight `useSyncExternalStore` store + `localStorage` |

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build to /dist
npm run preview  # preview the production build
```

## Project structure

```
src/
  data/
    seed.js      # fictional sample data (Meridian Group)
    store.js     # client-side store + persistence (replaces a backend)
  lib/
    theme.js     # validated categorical palette + status helpers
  components/
    Layout.jsx   # top nav, role switcher, footer
    GoalCard.jsx # progress-ring goal card
    ui.jsx       # shared primitives (Card, StatTile, ProgressBar, Badge)
  pages/
    Dashboard.jsx
    SubmitReport.jsx
    MyReports.jsx
    AdminSettings.jsx
  App.jsx        # routes
  main.jsx       # entry
```

## Deployment

The app is a static Vite build and deploys to any static host. On **Vercel**, the
defaults work out of the box (Build command `npm run build`, Output directory `dist`).

## Notes

This is a portfolio / demo project. All company names, people, figures and KPIs are
invented for illustration and do not represent any real organization.

## License

Released under the [MIT License](LICENSE).
