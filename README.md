# Worth Today

**What is old money worth today?**

Worth Today calculates the real value of money over time using historical data from the Federal Reserve. Enter an amount and a year range to see two things side by side: how inflation eroded purchasing power, and how much you would have if you'd invested in Treasury Bills instead.

## What it does

- **Inflation adjustment** — uses the Consumer Price Index (CPI) to show what a dollar from any year is equivalent to today
- **Treasury Bill returns** — compounds historical 3-month T-Bill rates year by year to show real investment growth
- **Side-by-side comparison** — tells you by how much T-Bills beat (or lost to) inflation over your chosen period
- **Historical data tables** — browse raw CPI and T-Bill rate data by year or month

Data goes back to 1934 and is updated from [FRED](https://fred.stlouisfed.org/) (Federal Reserve Economic Data).

## Stack

- [Next.js 16](https://nextjs.org/) — React framework
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/) — growth chart

## Running locally

You'll need Node.js 18 or later.

```bash
git clone https://github.com/sirindudler/worth_today.git
cd worth_today
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Updating the data

Data is bundled at build time from `data/cpi.json` and `data/treasury-bills.json`. To pull the latest from FRED:

```bash
npm run update-data
```

Then restart the dev server.

## Data sources

| Dataset | Source | Series |
|---|---|---|
| Consumer Price Index | FRED | `CPIAUCSL` |
| 3-Month Treasury Bill Rate | FRED | `TB3MS` |
