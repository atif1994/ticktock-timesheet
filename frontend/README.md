# ticktock — Timesheet Management App (Frontend)

A SaaS-style timesheet management application built as a TenTwenty Frontend Technical Assessment.

---

## Live Demo

> **Frontend:** https://ticktock-timesheet.vercel.app  
> **Backend API:** https://ticktock-backend.up.railway.app

---

## Login Credentials

| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@ticktock.com`   |
| Password | `password123`          |

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- Backend API running on port 4000 (see `../backend/README.md`)

### Installation

```bash
cd frontend
npm install
```

### Environment Setup

Create `.env.local` (or copy from `.env.example`):

```env
NEXTAUTH_SECRET=ticktock-super-secret-key-2024
NEXTAUTH_URL=http://localhost:3000
BACKEND_URL=http://localhost:4000
INTERNAL_API_SECRET=ticktock-internal-api-secret-2024
```

### Run dev server

```bash
npm run dev        # → http://localhost:3000
```

### Run tests

```bash
npm test                # run all tests
npm run test:watch      # watch mode
npm run test:coverage   # with coverage report
```

---

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| **Next.js** | 16 | Framework (App Router) |
| **TypeScript** | 5 | Type safety |
| **TailwindCSS** | 4 | Styling |
| **next-auth** | 4 | Authentication (Credentials + JWT) |
| **react-hook-form** | 7 | Form state management |
| **Zod** | 4 | Schema validation |
| **SWR** | 2 | Client-side data fetching |
| **Jest** | 29 | Unit testing |
| **@testing-library/react** | — | Component testing |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     next-auth handler
│   │   └── timesheets/             BFF proxy routes → backend
│   ├── login/                      Login page
│   ├── dashboard/                  Table view + detail view
│   ├── layout.tsx                  Root layout with AuthProvider
│   └── page.tsx                    Root redirect
├── components/
│   ├── auth/LoginForm.tsx
│   ├── dashboard/
│   │   ├── Header.tsx
│   │   ├── TimesheetTable.tsx      Mobile cards + desktop table
│   │   ├── StatusBadge.tsx
│   │   ├── EntryModal.tsx          Add New Entry form
│   │   ├── Filters.tsx             Date range + status filter
│   │   └── Pagination.tsx          Smart pagination
│   └── providers/AuthProvider.tsx
├── __tests__/                      Jest + Testing Library tests
├── hooks/useTimesheets.ts           SWR hooks + API helpers
├── lib/
│   ├── auth.ts                     next-auth config
│   └── validations.ts              Zod schemas
└── types/
    ├── index.ts
    └── next-auth.d.ts
```

---

## Architecture: BFF Pattern

```
Browser  ──→  Next.js /api/*  ──→  Express Backend :4000
              (validates session)   (validates x-internal-secret)
```

All client-side API calls go through internal Next.js API routes.
The browser never calls the backend directly.

---

## Features

- **Authentication** — next-auth v4 with Credentials provider; JWT session in HTTP-only cookie
- **Dashboard** — paginated table (5/10/25 per page) with Week #, Date, Status, Actions
- **Filters** — filter by date range and status
- **Add Entry Modal** — react-hook-form + Zod validation, hours stepper, project/work-type dropdowns
- **Detail View** — weekly breakdown by day with progress bar
- **Responsive** — mobile card layout, stacked filters, simplified pagination on phones
- **19 unit/component tests** — StatusBadge, Pagination, TimesheetTable, Filters

---

## Assumptions & Notes

- **Data persistence**: In-memory store (resets on server restart). Production would use a database.
- **Auth**: Hardcoded dummy credentials. Production would use a real user table with hashed passwords.
- **99 weeks seeded**: Starting 2024-01-01, status pattern: COMPLETED → COMPLETED → INCOMPLETE → COMPLETED → MISSING.
- **No external API provided**: Assessment mentioned "supplied APIs" but none were included, so internal API routes serve mock data from the Express backend.

---

## Time Spent

| Task | Time |
|---|---|
| Project setup + architecture | 30 min |
| Authentication (next-auth) | 30 min |
| Backend (Express + TypeScript) | 45 min |
| API routes + BFF layer | 30 min |
| UI components (table, modal, pagination) | 1h 30 min |
| Detail view + responsive polish | 45 min |
| Tests | 30 min |
| **Total** | **~5 hours** |
