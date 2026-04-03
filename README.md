# AdSpark

Production-ready SaaS starter to generate AI-powered ads (copy + image + video frames), with authentication, usage limits, history, and Stripe billing.

## Stack

- Next.js App Router + TypeScript + Tailwind
- Vercel AI SDK (`ai`) with OpenAI provider
- NextAuth (Auth.js v5)
- Prisma + PostgreSQL
- Stripe Checkout + webhook

## Required env vars

Copy `.env.example` to `.env.local`:

```bash
OPENAI_API_KEY=
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
EMAIL_SERVER=
EMAIL_FROM=
```

## Setup

```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

## Build

```bash
npm run build
```

## Vercel deployment checklist

1. Add all env vars from `.env.example` in Vercel project settings.
2. Set `DATABASE_URL` to your Neon/Supabase PostgreSQL URL.
3. Set Google OAuth callback URL to `https://<your-domain>/api/auth/callback/google`.
4. Set Stripe webhook endpoint to `https://<your-domain>/api/webhook`.
5. Set build command to `npm run db:migrate && npm run build`.
6. Keep install command as `npm install` (`postinstall` will run `prisma generate`).

## Notes

- Free plan enforces 5 generations/day and resets daily credits.
- Pro plan is unlimited and bypasses daily credit checks.
- Stripe webhook handler is idempotent using stored Stripe event IDs.

## Routes

- `/login`
- `/dashboard`
- `/dashboard/history`
- `/dashboard/billing`
- `/api/generate`
- `/api/webhook`
- `/api/stripe/checkout`


## Import to Vercel (Vo)

1. Push this repo to GitHub.
2. In Vercel, click **Add New Project** and import the repository.
3. Configure all environment variables from `.env.example`.
4. Set Neon/Supabase `DATABASE_URL`.
5. Keep install command: `npm install`.
6. Build command is preconfigured in `vercel.json` as `npm run db:migrate && npm run build`.
7. Deploy.
8. In Stripe dashboard, add webhook endpoint: `https://<your-domain>/api/webhook`.
9. In Google Cloud OAuth credentials, add callback: `https://<your-domain>/api/auth/callback/google`.
