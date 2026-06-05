# InvestArena

Virtual stock market simulator — learn investing, trade with ₹10L virtual capital, and compete on leaderboards.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables (**put real API keys in `.env.local`, not `.env.example`**):

```bash
cp .env.example .env.local
```

Edit `.env.local`:

- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — long random string for signing auth tokens
- `GROQ_API_KEY` — [Groq Console](https://console.groq.com/keys) key for AI Portfolio Mentor (recommended; generous free tier)
- `GEMINI_API_KEY` — optional fallback via [Google AI Studio](https://aistudio.google.com/apikey)
- `TWELVE_DATA_API_KEY` and/or `ALPHA_VANTAGE_API_KEY` — live quotes (both can be set; Twelve Data first, Alpha Vantage fallback)

3. Seed the database (stocks):

```bash
npm run seed
```

4. (Optional) Pull live prices into MongoDB:

```bash
npm run sync-market
```

Optional demo account:

```bash
npm run seed -- --demo-user
```

Demo login: `demo@investarena.com` / `demo12345`

5. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Running without optional API keys

| Feature | Without API key |
|---------|-----------------|
| **Market prices** | Seeded static prices. Market shows **Seeded data**; prices still **tick live** via SSE simulation. |
| **AI Mentor** | Rule-based fallback. Add `GROQ_API_KEY` (recommended) or `GEMINI_API_KEY` for real LLM analysis. |
| **Everything else** | Auth, trading, limit/stop orders, leaderboard work normally. |

## Features

- **AI Portfolio Mentor** — Groq Llama (or Gemini/Anthropic/OpenAI fallback)
- **Live price ticks** — SSE stream updates every 3s on Market page
- **Limit & stop-loss orders** — pending until price is hit
- Register / login with JWT + Zustand client auth state
- Watchlist on market + dashboard
- Reset portfolio on profile page
- Mobile bottom navigation
- Daily snapshot cron at `GET /api/cron/snapshots`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run seed` | Seed stocks into MongoDB |
| `npm run sync-market` | Fetch live quotes from Twelve Data / Alpha Vantage |

## Cron: daily portfolio snapshots

`GET /api/cron/snapshots` with `Authorization: Bearer <CRON_SECRET>` once per day.
