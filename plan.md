# Worth Today - Project Plan

## Project Overview
A Next.js web application that calculates the real value of money over time using two approaches:
1. **Inflation Adjustment**: How much is a dollar from [year] worth today in purchasing power?
2. **Investment Returns**: What would a dollar invested in Treasury Bills in [year] be worth today?

## Core Features

### 1. Inflation Calculator
- Input: Dollar amount and starting year
- Output: Equivalent purchasing power in today's dollars
- Based on: Consumer Price Index (CPI) data

### 2. Treasury Bill Investment Calculator
- Input: Dollar amount and starting year
- Output: Total value if invested in T-bills with compound returns
- Based on: Historical Treasury Bill rates

### 3. Comparison View
- Side-by-side comparison of inflation vs. investment
- Visualization showing the difference between holding cash vs. investing

## Data Sources

### Historical Inflation Data
**Primary Source: FRED (Federal Reserve Economic Data)**
- Dataset: Consumer Price Index for All Urban Consumers (CPIAUCSL)
- URL: https://fred.stlouisfed.org/series/CPIAUCSL
- Format: CSV download available
- Coverage: 1913-present, monthly data
- Alternative: Bureau of Labor Statistics (BLS) API

### Historical Treasury Bill Rates
**Primary Source: FRED**
- Dataset: 3-Month Treasury Bill Secondary Market Rate (TB3MS)
- URL: https://fred.stlouisfed.org/series/TB3MS
- Format: CSV download available
- Coverage: 1934-present, monthly data
- Alternative: 1-Year Treasury Rate (GS1) for longer-term data

## Technical Stack

### Framework & Core
- **Next.js 14+** (App Router)
- **React 18+**
- **TypeScript**

### Styling
- **Tailwind CSS**
- **shadcn/ui** components (optional, for modern UI)

### Data Visualization
- **Recharts** or **Chart.js** for graphs
- Show historical trends and comparisons

### Data Management
- Static JSON files for historical data (stored in `/public/data/` or `/data/`)
- Data update script to refresh periodically from FRED

## Project Structure

```
worth_today/
├── app/
│   ├── page.tsx                 # Main calculator page
│   ├── layout.tsx               # Root layout
│   └── api/
│       └── calculate/
│           └── route.ts         # API route for calculations
├── components/
│   ├── InflationCalculator.tsx
│   ├── TreasuryCalculator.tsx
│   ├── ComparisonView.tsx
│   └── ui/                      # Reusable UI components
├── lib/
│   ├── calculations.ts          # Core calculation logic
│   ├── dataLoader.ts            # Load and parse historical data
│   └── types.ts                 # TypeScript interfaces
├── data/
│   ├── cpi.json                 # Historical CPI data
│   └── treasury-rates.json      # Historical T-bill rates
├── scripts/
│   └── updateData.js            # Script to fetch latest data from FRED
└── public/
    └── ...
```

## Implementation Phases

### Phase 1: Data Acquisition & Setup
- [ ] Set up Next.js project with TypeScript
- [ ] Download historical CPI data from FRED (1913-present)
- [ ] Download historical Treasury Bill rates from FRED (1934-present)
- [ ] Convert CSV data to JSON format
- [ ] Create data loading utilities

### Phase 2: Core Calculation Logic
- [ ] Implement inflation calculator
  - Formula: `Future Value = Present Value × (CPI_end / CPI_start)`
- [ ] Implement Treasury Bill investment calculator
  - Compound interest with historical rates
  - Formula: Apply each year's rate cumulatively
- [ ] Write unit tests for calculations
- [ ] Handle edge cases (missing data, invalid years)

### Phase 3: UI Components
- [ ] Create input form (dollar amount, starting year, ending year)
- [ ] Build inflation calculator component
- [ ] Build Treasury Bill calculator component
- [ ] Create comparison component
- [ ] Add data visualization charts
- [ ] Implement responsive design

### Phase 4: Polish & Features
- [ ] Add year range selector/slider
- [ ] Show inflation rate over selected period
- [ ] Show average T-bill rate over selected period
- [ ] Add ability to compare multiple starting years
- [ ] Create shareable links with pre-filled values
- [ ] Add methodology/about page explaining calculations

### Phase 5: Deployment
- [ ] Optimize for production
- [ ] Deploy to Vercel/Netlify
- [ ] Set up automated data updates (monthly/quarterly)
- [ ] Add meta tags and SEO optimization

## Calculation Methodologies

### Inflation Adjustment
```typescript
inflationAdjustedValue = initialAmount × (CPI_currentYear / CPI_startYear)
```

Example: $1 in 1970
- CPI in 1970: 38.8
- CPI in 2024: 315.0
- Value: $1 × (315.0 / 38.8) = $8.12

### Treasury Bill Investment
```typescript
// Compound each year's return
let value = initialAmount;
for (year = startYear; year < endYear; year++) {
  const rate = getTreasuryRate(year);
  value = value × (1 + rate);
}
```

Example: $1 invested in T-bills in 1970
- Apply each year's T-bill rate cumulatively
- Accounts for compound growth

## Data Update Strategy

### Manual Updates (Initial)
1. Visit FRED website
2. Download updated CSV files
3. Run conversion script to update JSON
4. Commit to repository

### Automated Updates (Future Enhancement)
- Use FRED API to fetch latest data
- Run GitHub Action monthly to update data
- Auto-commit if new data available

## Key Considerations

### Data Accuracy
- Use official government sources (FRED, BLS)
- Document data sources and last update date
- Show methodology clearly to users

### Date Ranges
- CPI data: 1913-present (comprehensive)
- T-bill data: 1934-present (when T-bills became standardized)
- UI should handle cases where only one calculation is available

### Performance
- Pre-calculate common queries
- Use static generation where possible
- Keep data files optimized (JSON format)

### User Experience
- Clear explanations of what each calculator shows
- Visual comparison to make the difference obvious
- Educational content about inflation and investing
- Mobile-friendly interface

## Future Enhancements
- Add other investment vehicles (S&P 500, bonds, gold)
- Allow custom date ranges (not just "to today")
- Show purchasing power of specific items (e.g., "cost of a car")
- Historical events overlay on charts
- Inflation calculator by category (housing, food, etc.)

## API Endpoints Needed

### GET /api/calculate/inflation
```typescript
// Query params: amount, fromYear, toYear
// Returns: { adjustedValue, inflationRate, cpiStart, cpiEnd }
```

### GET /api/calculate/treasury
```typescript
// Query params: amount, fromYear, toYear
// Returns: { finalValue, totalReturn, averageRate, yearByYear[] }
```

### GET /api/data/range
```typescript
// Returns: { minYear, maxYear, lastUpdated }
```
