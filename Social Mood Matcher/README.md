# 🎭 Social Mood Matcher

A full-stack social platform that matches users by their current emotional vibe.

**Stack:** ASP.NET Core 8 API + React 18 + Vite + SQLite via EF Core

---

## 🚀 Quick Start (Docker)

> Requires Docker Desktop running.

```bash
# 1. Clone and enter the project
cd "Social Mood Matcher"

# 2. Build and start both services
docker compose up --build

# 3. Open the app
open http://localhost:3000
```

- **Frontend:** http://localhost:3000
- **API:** http://localhost:5000

---

## 💻 Local Dev (without Docker, requires Node ≥ 18)

### Backend

```bash
cd backend
# Requires .NET 8 SDK
dotnet run
# → API on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# → App on http://localhost:5173 (proxied to backend on port 5000)
```

---

## 🏗️ Project Structure

```
Social Mood Matcher/
├── backend/                     # ASP.NET Core 8 Web API
│   ├── Controllers/             # AuthController, MoodsController, MatchesController
│   ├── Models/                  # ApplicationUser, UserMood
│   ├── DTOs/                    # Auth, Mood, Match DTOs
│   ├── Services/                # TokenService, MoodMatchingService
│   ├── Data/                    # AppDbContext (EF Core + SQLite)
│   ├── Program.cs               # DI wiring, JWT, CORS, Identity
│   └── Dockerfile
│
├── frontend/                    # React 18 + Vite + TypeScript
│   ├── src/
│   │   ├── api/                 # axios client + API service functions
│   │   ├── context/             # AuthContext (JWT + user state)
│   │   ├── components/          # Navbar, MoodCard, MatchCard
│   │   ├── pages/               # Login, Register, Home, Feed, Matches, Profile
│   │   ├── routes/              # ProtectedRoute
│   │   ├── types/               # TypeScript types + mood config
│   │   └── styles/              # Global CSS design system
│   ├── Dockerfile
│   └── nginx.conf
│
└── docker-compose.yml           # Orchestrates backend + frontend
```

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login → JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/profile` | ✅ | Update profile |
| POST | `/api/moods` | ✅ | Post current mood |
| GET | `/api/moods/mine` | ✅ | My mood history |
| GET | `/api/moods/feed` | ✅ | Feed from same-mood users |
| GET | `/api/moods/current` | ✅ | My latest mood |
| GET | `/api/matches` | ✅ | Users sharing your mood |

---

## 🎭 Mood Types

`Happy 😊` · `Sad 😔` · `Angry 😡` · `Calm 😌` · `Stressed 😰` · `Excited 🤩`

---

## 🧠 Matching Algorithm

1. Get your latest mood posted within the **last 2 hours**
2. Find other users whose latest mood **matches yours** (within 2 hours)
3. Return them sorted by most recent

---

## 🎨 Features

- **Dark glassmorphism UI** with Inter font
- **JWT Authentication** via ASP.NET Identity
- **Mood Picker** with animated emoji pills
- **Matching Feed** – posts from people feeling like you
- **Matches Page** – grid of matched users with glowing avatars
- **Profile Page** – view/edit bio with mood history

---

## 🐳 Production Notes

- SQLite data is persisted in a Docker named volume (`sqlite-data`)
- Change `JwtSettings__Secret` in `docker-compose.yml` before deploying
- Frontend nginx proxies `/api/` to the backend container

Email	Password	Mood

alice@test.com
Test123!	😰 Stressed

bob@test.com
Test123!	😰 Stressed

priya@test.com
Test123!	😊 Happy

sam@test.com
Test123!	😌 Calm

jordan@test.com
Test123!	🤩 Excited