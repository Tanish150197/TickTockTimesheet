# ticktock Timesheet App

A simple Next.js + TypeScript timesheet management app built with Tailwind CSS.

## Features

- Login screen with dummy authentication and session cookie handling
- Dashboard listing weekly timesheet summaries
- Internal API routes for login, logout, and timesheet data
- Filterable table view with status badges
- Add/edit timesheet entries using a modal form
- Responsive layout styled to match the provided design direction

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Credentials

- Email: `admin@ticktock.com`
- Password: `Password123!`

## Notes

- The app uses internal API routes under `src/app/api`
- Authentication is simulated using a secure `HttpOnly` session cookie
- Timesheet data is mocked in `src/lib/mock-data.ts`

## Project Structure

- `src/app/page.tsx` — login page
- `src/app/dashboard/page.tsx` — protected dashboard route
- `src/components` — reusable UI components
- `src/app/api` — internal API route handlers
- `src/lib` — mock data and types

## Assumptions

- No backend persistence is required for the mock task
- The app is built for demonstration and client-side mock flows
- The dashboard is protected by a simple server-side cookie check
