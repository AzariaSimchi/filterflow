# 🏡 FilterFlow

**Real-time real-estate filter & notification system**  
Built to help users find the perfect property by filtering listings, normalizing data, and sending instant alerts.

---

## 🚀 Features
- **Real-time Scraping** – fetches new listings from selected sources every few minutes.
- **Smart Filters** – filter by price, location, keywords, number of rooms and more.
- **Alerts** – receive instant notifications via Email & WhatsApp.
- **Normalization** – deduplication and standardized fields across multiple sources.
- **Dashboard** – easy-to-use web interface to manage filters and see results.

---

## 🛠 Tech Stack
- **Backend:** Node.js + Express/NestJS  
- **Frontend:** Next.js (React)  
- **Database:** PostgreSQL  
- **Queue & Cache:** Redis  
- **Search:** OpenSearch (Elasticsearch compatible)  
- **Notifications:** SendGrid (Email) + Twilio (WhatsApp)

---

## 📦 Local Development
1. Install [Docker](https://docs.docker.com/get-docker/).
2. Run services:
   ```bash
   docker compose up -d
