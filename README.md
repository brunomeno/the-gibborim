# The Gibborim

Community fitness app for MENO — faith, fitness, fellowship.

**Stack:** React + Vite · Tailwind CSS v4 · Supabase · OpenAI (Captain Joab) · Resend · Vercel

## Getting started

```bash
cp .env.example .env   # fill in Supabase URL + anon key
npm install
npm run dev
```

## Structure

```
api/                    Vercel serverless functions (OpenAI coach, Resend reminders) — server-side keys live here
supabase/migrations/    SQL schema + row-level security policies
src/
  components/ui/        Reusable primitives (Logo, loaders, buttons…)
  components/layout/    App shell, nav, route guards
  context/              React context (AuthContext)
  hooks/                Data hooks (useWorkouts, useSteps, useGoals…)
  lib/                  Clients (supabase.js)
  services/             Calls to /api and Supabase queries
  pages/                Route-level screens
```

Never expose `OPENAI_API_KEY`, `RESEND_API_KEY`, or the Supabase service role key with a `VITE_` prefix — they'd ship to the browser.
