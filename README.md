# Phygital — Digital Business Card SaaS

> Create stunning digital business cards with QR codes, custom URLs, and printable card exports.

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite, Tailwind CSS, Framer Motion, Zustand |
| Backend | Node.js + Express.js, MongoDB (Mongoose), JWT |
| Media | Cloudinary (images, QR upload) |
| Cache | Redis (optional, public card caching) |
| Deploy | Render (backend web service + frontend static site) |

---

## Project Structure

```
Phygital_Saas/
├── backend/                   # Express API
│   ├── src/
│   │   ├── config/            # db, cloudinary, redis, env
│   │   ├── controllers/       # auth, card, analytics, public, upload
│   │   ├── middleware/        # auth, errorHandler, rateLimiter, upload
│   │   ├── models/            # User, Card, Analytics
│   │   ├── repositories/      # DB abstraction layer
│   │   ├── routes/            # /api/v1/*
│   │   ├── services/          # Business logic
│   │   └── utils/             # jwt, qrcode, vcard, slugify
│   ├── server.js
│   └── package.json
├── frontend/                  # React SPA
│   ├── src/
│   │   ├── components/        # ui/, layout/, card/, wizard/
│   │   ├── hooks/             # useDebounce, useCards
│   │   ├── pages/             # Home, Login, Register, Dashboard, CardWizard, PublicCard
│   │   ├── services/          # api.js, authService, cardService, analyticsService
│   │   ├── store/             # useAuthStore, useCardStore (Zustand + persist)
│   │   └── utils/             # templates.js
│   └── package.json
├── render.yaml                # Render deployment config
└── README.md
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas URI)
- Cloudinary account
- Redis (optional — app works without it)

### 1. Clone

```bash
git clone <repo-url>
cd Phygital_Saas
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Fill in your env values in .env
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api/v1
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## GitHub Push (First Time)

If this project folder is not already its own git repository, initialize it from inside `Phygital_Saas`:

```bash
git init
git add .
git commit -m "Initial commit: Phygital SaaS"
git branch -M main
git remote add origin https://github.com/thankiuday/DigitalBusinessCard.git
git push -u origin main
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Secret for access tokens |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `REDIS_URL` | Redis URL (optional) |
| `CLIENT_URL` | Allowed frontend origins for CORS (comma-separated) |
| `NODE_ENV` | `development` or `production` |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (`https://<backend>.onrender.com/api/v1` in production) |

---

## Deploying to Render

### Automatic (render.yaml)

1. Push your repo to GitHub
2. Go to [render.com](https://render.com) → New → Blueprint
3. Connect your GitHub repo — Render will detect `render.yaml` and create both services
4. Fill in the secret environment variables in the Render dashboard:
   - Backend: `MONGODB_URI`, `CLOUDINARY_*`, `CLIENT_URL` (your frontend Render URL, or comma-separated list of origins), `REDIS_URL` (optional)
   - Frontend: `VITE_API_URL` (your backend Render URL + `/api/v1`)

### Manual

**Backend (Web Service)**
- Root Dir: `backend`
- Build: `npm install`
- Start: `node server.js`
- Node version: 18

**Frontend (Static Site)**
- Root Dir: `frontend`
- Build: `npm install && npm run build`
- Publish Dir: `dist`
- Rewrite all routes to `index.html`

---

## API Routes

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/me

GET    /api/v1/cards
POST   /api/v1/cards
GET    /api/v1/cards/:id
PUT    /api/v1/cards/:id
DELETE /api/v1/cards/:id
POST   /api/v1/cards/:id/qr
POST   /api/v1/cards/:id/duplicate
GET    /api/v1/cards/slug/check/:slug

POST   /api/v1/upload/image
POST   /api/v1/upload/video

GET    /api/v1/public/:slug
GET    /api/v1/public/:slug/vcard

POST   /api/v1/analytics/event
GET    /api/v1/analytics/cards/:id

GET    /health
```

---

## Features

- **4-Step Card Wizard** — Content → Design → Publish → Print
- **12 Templates** — Professional, Creative, Minimal, Bold, Elegant, Dark, Sunset, Ocean, Forest, Neon, Rose, Slate
- **Live Preview** — Real-time card rendering as you edit
- **QR Code** — Auto-generated and uploaded to Cloudinary
- **vCard Download** — Visitors can save contact to phone
- **Analytics** — Track views, clicks, QR scans per card
- **Printable Export** — html2canvas PNG download
- **Draft Autosave** — localStorage persistence across sessions
- **Duplicate Card** — Clone any existing card
- **Redis Caching** — Public cards cached for fast response

---

## Security

- JWT access (15m) + refresh tokens (7d, httpOnly cookie, rotation)
- Helmet security headers
- CORS restricted to known origins
- Rate limiting on auth (10 req/15min) and uploads (50/hr)
- MongoDB indexing on slug and userId

---

## License

MIT
