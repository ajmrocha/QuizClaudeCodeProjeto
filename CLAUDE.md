# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Important:** Read `AGENTS.md` first — this Next.js version has breaking changes from older training data.

## Commands

```bash
npm run dev        # development server (localhost:3000)
npm run build      # production build
npm run lint       # ESLint
```

## Tech Stack

- **Next.js 16** — App Router, Server Components, TypeScript strict mode
- **Supabase** — PostgreSQL, RLS policies, `@supabase/supabase-js`
- **Tailwind CSS v4 + shadcn/ui + lucide-react**
- **next-intl** — i18n (PT-BR default + EN)
- **@vercel/og** — dynamic badge OG images at `/api/badge/[tier]`
- **Vercel** — deployment

## Architecture

### Routing

`app/[locale]/` wraps all pages for i18n. Routes:
- `/` → redirect to `/{locale}/`
- `/{locale}/` — home (nickname, track, round size, timer toggle)
- `/{locale}/quiz` — active quiz
- `/{locale}/resultado/[id]` — shareable result
- `/{locale}/ranking` — top 100 per track
- `/{locale}/revisao` — post-quiz review

### API Routes (`app/api/`)

| Route | Method | Notes |
|-------|--------|-------|
| `/api/questions` | GET | `?track=&size=&locale=` — **never expose `correct_answer`** |
| `/api/results` | POST | Server validates answers, calculates score, persists |
| `/api/ranking` | GET | `?track=` — top 100 sorted score DESC + time ASC |
| `/api/badge/[tier]` | GET | Returns OG image (PNG) for bronze/silver/gold |

### Supabase

- `lib/supabase/client.ts` — browser client (anon key)
- `lib/supabase/server.ts` — server client (service role key, server components + API routes only)
- Two tables: `questions` and `results`
- RLS: public read for questions (active=true), public insert for results

### Scoring (`lib/quiz/scoring.ts`)

Weighted by difficulty: beginner=1pt, intermediate=2pt, advanced=3pt.
Badge tiers: bronze ≥70%, silver ≥80%, gold ≥90%.
`calculateScore(answers, questions)` → `{ score, correctCount, percentage, badgeTier }`

## Security Rules

- `/api/questions` must NEVER return `correct_answer` field
- Answer validation happens server-side only in `/api/results`
- `SUPABASE_SERVICE_ROLE_KEY` used server-side only (never `NEXT_PUBLIC_`)
- Rate limiting: 10 submissions/hour per hashed IP (`IP_HASH_SALT` env var)

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
IP_HASH_SALT=
```

## i18n

Locale detection via `middleware.ts` (next-intl). Toggle stored in `localStorage`.
Message files: `lib/i18n/messages/pt-BR.json` and `lib/i18n/messages/en.json`.
PT-BR is the default locale.

## Non-Functional Constraints

- LCP < 2.5s on 4G
- WCAG 2.1 AA accessibility
- Mobile-first: 320px–2560px
- No cookies, no personal data
