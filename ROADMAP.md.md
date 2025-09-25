# 🗺 FilterFlow Roadmap

This document tracks the main steps to get FilterFlow MVP ready.

## ✅ Phase 1 — Setup (Infra & Repo)
- [x] Create GitHub repository
- [x] Add README.md
- [x] Add docker-compose.yml
- [ ] Add `.env.example` file
- [ ] Create backend/, frontend/, worker/ folders

## 🏗 Phase 2 — Backend
- [ ] Setup Express/NestJS backend skeleton
- [ ] Connect to PostgreSQL & Redis
- [ ] Implement basic CRUD for Filters
- [ ] Matching engine (price, keywords, location)

## 🖥 Phase 3 — Frontend
- [ ] Create Next.js dashboard skeleton
- [ ] Implement Filter creation form
- [ ] Display matched listings

## 🔔 Phase 4 — Notifications
- [ ] Integrate SendGrid (Email)
- [ ] Integrate Twilio (WhatsApp)

## 📊 Phase 5 — Scaling & Polish
- [ ] Rate limiting & proxy rotation for scraping
- [ ] User authentication & JWT
- [ ] Multi-source integration
- [ ] Deployment to production
