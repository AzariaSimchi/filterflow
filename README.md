# FilterFlow Starter (MVP)
Version: 2025-09-27

This repo is a minimal starter to get your **Telegram + Supabase** pipeline running.
It includes:
- Next.js API routes (Vercel-ready)
- Supabase SQL schema (tables + basic indexes)
- Simple Telegram webhook to store chat IDs and send a test message
- Dev endpoint to seed a sample real-estate listing and trigger a match

## 0) What you need to create (accounts)
1. **Vercel** account
2. **Supabase** project (Region: US)
3. **Telegram Bot** via @BotFather (`/newbot`) → BOT token
4. (Optional now) **SendGrid/Mailgun** for email. We'll add later.

## 1) Supabase: create DB + tables
- Open Supabase → SQL Editor → paste contents of `sql/schema.sql` → Run
- Optional: run `sql/policies.sql` to enable RLS (you can keep it simple at first)

## 2) Deploy on Vercel
- Import this project to GitHub/GitLab, then "Import Project" on Vercel
- Set Environment Variables (see `.env.example`)
- Deploy

## 3) Set Telegram webhook
After you deploy, run (replace values):
```
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook"   -d "url=https://<YOUR_VERCEL_DOMAIN>/api/telegram?secret=<TELEGRAM_WEBHOOK_SECRET>"
```

## 4) Start the bot
- In Telegram, open your bot and send: `/start`
- You should get: "Connected ✅"

## 5) Seed a test listing + send alert
- Call the dev endpoint (replace your secret):
```
curl -X POST "https://<YOUR_VERCEL_DOMAIN>/api/dev/seed-listing"   -H "x-webhook-secret: <TELEGRAM_WEBHOOK_SECRET>"
```
- You should receive a "deal card" message on Telegram.

## 6) Next steps
- Hook RSS + Email-inbound ingestion
- Implement comps + ARV model (Python worker) — can be added as separate service later
- Add UI pages for filters & dashboard
