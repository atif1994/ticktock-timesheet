# ticktock — Backend API

Express + TypeScript REST API powering the ticktock Timesheet Management app.

---

## Getting Started

```bash
cd backend
npm install
npm run dev      # starts on http://localhost:4000
```

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/timesheets` | Paginated, filterable list |
| `GET` | `/api/timesheets/:id` | Single timesheet with entries |
| `POST` | `/api/timesheets/:id/entries` | Add an entry to a timesheet |

### Query parameters for `GET /api/timesheets`

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `perPage` | number | `5` | Items per page (max 100) |
| `status` | string | — | Filter: `COMPLETED`, `INCOMPLETE`, `MISSING` |
| `dateFrom` | string | — | ISO date lower bound (inclusive) |
| `dateTo` | string | — | ISO date upper bound (inclusive) |

### Security

All `/api/*` routes require the header:
```
x-internal-secret: <INTERNAL_API_SECRET>
```
Set `INTERNAL_API_SECRET` in `.env` (must match the frontend `.env.local`).

---

## Project Structure

```
src/
├── server.ts              Entry point — starts HTTP server
├── app.ts                 Express app factory (middleware + routes)
├── routes/
│   ├── index.ts           Mounts sub-routers at /api/*
│   └── timesheets.routes.ts
├── controllers/
│   └── timesheets.controller.ts
├── middleware/
│   ├── errorHandler.ts    Global 404 + 500 handler
│   └── validateSecret.ts  Internal API secret guard
├── data/
│   └── store.ts           In-memory store (swap for DB in production)
└── types/
    └── index.ts           Domain types + DTOs
```
