# ticktock — Timesheet Management App

A SaaS-style timesheet management application built as a frontend technical assessment for TenTwenty.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
cd task-assignment
npm install
```

### Environment Setup

A `.env.local` file is included with default development values:

```env
NEXTAUTH_SECRET=ticktock-super-secret-key-2024
NEXTAUTH_URL=http://localhost:3000
```

> In production, replace `NEXTAUTH_SECRET` with a strong random value (e.g. `openssl rand -base64 32`).

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Login Credentials (Dummy Auth)

| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@ticktock.com`   |
| Password | `password123`          |

---

## Features

| Feature | Details |
|---|---|
| **Authentication** | next-auth v4 with Credentials provider; JWT session stored securely in an HTTP-only cookie |
| **Login screen** | Split-screen layout matching Figma, with form validation via react-hook-form + Zod |
| **Dashboard — Table View** | Paginated table of 99 seeded weeks; columns: Week #, Date, Status, Actions |
| **Filters** | Filter by date range and/or status (All / Completed / Incomplete / Missing) |
| **Pagination** | Configurable rows per page (5 / 10 / 25); smart ellipsis page numbers |
| **Status badges** | Colour-coded: green = Completed, orange = Incomplete, red = Missing |
| **Add Entry Modal** | react-hook-form + Zod validation; project & work-type dropdowns, textarea, hours stepper |
| **Detail view** | Weekly list view grouped by day; progress bar showing hours vs. 40 h target |
| **Internal API routes** | All data access goes through `/api/timesheets/*` — the client never calls an external API directly |
| **Responsive** | Fully responsive from mobile to desktop |

---

## Tech Stack

| Library | Purpose |
|---|---|
| **Next.js 16** (App Router) | Framework |
| **TypeScript** | Type safety |
| **TailwindCSS v4** | Styling |
| **next-auth v4** | Authentication |
| **react-hook-form** | Form state management |
| **Zod** | Schema validation |
| **SWR** | Client-side data fetching with revalidation |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # next-auth handler
│   │   └── timesheets/
│   │       ├── route.ts                  # GET list (paginated + filtered)
│   │       └── [id]/
│   │           ├── route.ts              # GET single timesheet
│   │           └── entries/route.ts      # POST add entry
│   ├── login/page.tsx                    # Login screen
│   ├── dashboard/
│   │   ├── page.tsx                      # Table view
│   │   └── [id]/page.tsx                 # Detail / list view
│   ├── layout.tsx                        # Root layout with AuthProvider
│   └── page.tsx                          # Root redirect
├── components/
│   ├── auth/LoginForm.tsx
│   ├── dashboard/
│   │   ├── Header.tsx
│   │   ├── TimesheetTable.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── EntryModal.tsx
│   │   ├── Filters.tsx
│   │   └── Pagination.tsx
│   └── providers/AuthProvider.tsx
├── hooks/
│   └── useTimesheets.ts                  # SWR hooks + API helpers
├── lib/
│   ├── auth.ts                           # next-auth config
│   ├── data.ts                           # In-memory data store + seed data
│   └── validations.ts                    # Zod schemas
├── middleware.ts                          # Route protection
└── types/
    ├── index.ts
    └── next-auth.d.ts
```

---

## Assumptions & Notes

- **Data persistence**: The timesheet store is in-memory (module-level variable). Data resets on server restart. In production this would be backed by a database.
- **Authentication**: Dummy credentials are hardcoded. In production, use a proper user table with hashed passwords.
- **Timesheet seed data**: 99 weeks are seeded from 2024-01-01 following a repeating pattern (COMPLETED → COMPLETED → INCOMPLETE → COMPLETED → MISSING).
- **Status logic**: Derived from total hours — ≥ 40 = Completed, 1–39 = Incomplete, 0 = Missing.
- **"View" action**: Navigates to the detail page for a completed timesheet. "Update" / "Create" open the Add Entry modal.
- **No external API**: The assessment referenced "supplied APIs" but none were provided, so all data is served from internal Next.js API routes.

---

## Time Spent

~4 hours total:
- Project setup & architecture: 30 min
- Authentication (next-auth): 30 min
- API routes + data layer: 45 min
- UI components (table, modal, pagination, filters): 1.5 h
- Detail view + responsive polish: 45 min
