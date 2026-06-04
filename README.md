# InvestArena

Virtual stock market simulator — learn investing, trade with ₹10L virtual capital, and compete on leaderboards.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — long random string for signing auth tokens
- `TWELVE_DATA_API_KEY` or `ALPHA_VANTAGE_API_KEY` — live NSE/BSE stock quotes (optional; see `.env.example`)

3. Seed the database (stocks):

```bash
npm run seed
```

4. (Optional) Pull live prices into MongoDB — requires a [Twelve Data](https://twelvedata.com/) or [Alpha Vantage](https://www.alphavantage.co/) API key in `.env.local`:

```bash
npm run sync-market
```

The market page auto-refreshes every 60 seconds and gradually updates stale symbols when live data is enabled.

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

## Features

- Register / login with JWT (HTTP-only cookie)
- Protected dashboard, market, portfolio, leaderboard, profile
- Buy and sell stocks (updates cash, holdings, transactions)
- Leaderboard ranked by portfolio value
- XP, investor levels, and achievements
- Rule-based AI portfolio insights on the dashboard

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run seed` | Seed stocks into MongoDB |
| `npm run sync-market` | Fetch live quotes from Twelve Data / Alpha Vantage |
