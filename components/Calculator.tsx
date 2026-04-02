'use client';

import { useState, useEffect } from 'react';
import CombinedChart from './CombinedChart';

interface YearlyInflation {
  year: number;
  cpi: number;
  value: number;
}

interface YearlyReturn {
  year: number;
  rate: number;
  value: number;
}

interface CalculationResult {
  inflation: {
    originalAmount: number;
    adjustedValue: number;
    inflationRate: number;
    cpiStart: number;
    cpiEnd: number;
    startYear: number;
    endYear: number;
    yearByYear: YearlyInflation[];
  };
  investment: {
    originalAmount: number;
    finalValue: number;
    totalReturn: number;
    totalReturnPercentage: number;
    averageRate: number;
    startYear: number;
    endYear: number;
    yearByYear: YearlyReturn[];
  };
  comparison: {
    realGain: number;
    realGainPercentage: number;
    investmentBeatsInflation: boolean;
  };
}

interface CalculatorProps {
  startYear: number;
  endYear: number;
  onStartYearChange: (year: number) => void;
  onEndYearChange: (year: number) => void;
}

export default function Calculator({ startYear, endYear, onStartYearChange, onEndYearChange }: CalculatorProps) {
  const currentYear = new Date().getFullYear();
  const [amount, setAmount] = useState<number>(100);

  const [startYearInput, setStartYearInput] = useState<string>(startYear.toString());
  const [endYearInput, setEndYearInput] = useState<string>(endYear.toString());

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/calculate?amount=${amount}&startYear=${startYear}&endYear=${endYear}`
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to calculate');
        return;
      }
      setResult(data);
    } catch {
      setError('An error occurred while calculating');
    } finally {
      setLoading(false);
    }
  };

  const handleStartYearChange = (value: string) => {
    setStartYearInput(value);
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1934 && num <= currentYear) {
      onStartYearChange(num);
    }
  };

  const handleEndYearChange = (value: string) => {
    setEndYearInput(value);
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1934 && num <= currentYear) {
      onEndYearChange(num);
    }
  };

  useEffect(() => {
    handleCalculate();
  }, [amount, startYear, endYear]);

  const fmt = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const inputClass =
    'border-b-2 border-[var(--foreground)] bg-transparent text-[var(--foreground)] font-semibold outline-none text-xl w-24 text-center pb-0.5 focus:border-[var(--accent-inflation)] transition-colors';

  return (
    <div className="space-y-10">
      {/* Fill-in-the-blank input */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-sm p-8 md:p-10">
        <p className="text-xl md:text-2xl font-light text-[var(--foreground)] leading-relaxed">
          If you had{' '}
          <span className="inline-flex items-baseline gap-1">
            $<input
              type="number"
              min="0.01"
              step="1"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className={inputClass}
              style={{ width: '110px' }}
            />
          </span>{' '}
          in{' '}
          <input
            type="number"
            min="1934"
            max={currentYear}
            value={startYearInput}
            onChange={(e) => handleStartYearChange(e.target.value)}
            className={inputClass}
          />
          , by{' '}
          <input
            type="number"
            min="1934"
            max={currentYear}
            value={endYearInput}
            onChange={(e) => handleEndYearChange(e.target.value)}
            className={inputClass}
          />{' '}
          it would be worth...
        </p>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-[var(--accent-inflation)]">{error}</p>
      )}

      {/* Results */}
      {result && !loading && (
        <>
          {/* Callout cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-sm p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--secondary)] mb-4">
                Adjusted for inflation (CPI)
              </p>
              <p
                className="font-serif font-bold leading-none mb-4 break-words"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--accent-inflation)' }}
              >
                {fmt(result.inflation.adjustedValue)}
              </p>
              <p className="text-sm text-[var(--secondary)] leading-relaxed">
                Inflation eroded{' '}
                <strong className="text-[var(--foreground)]">
                  {(100 - (result.inflation.originalAmount / result.inflation.adjustedValue) * 100).toFixed(1)}%
                </strong>{' '}
                of purchasing power.{' '}
                Total inflation: {result.inflation.inflationRate.toFixed(1)}%.
              </p>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-sm p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--secondary)] mb-4">
                Invested in Treasury Bills
              </p>
              <p
                className="font-serif font-bold leading-none mb-4 break-words"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--accent-tbill)' }}
              >
                {fmt(result.investment.finalValue)}
              </p>
              <p className="text-sm text-[var(--secondary)] leading-relaxed">
                Compounding at an average{' '}
                <strong className="text-[var(--foreground)]">
                  {result.investment.averageRate.toFixed(2)}% annually
                </strong>{' '}
                over {result.investment.endYear - result.investment.startYear} years.
                Total return: {result.investment.totalReturnPercentage.toFixed(1)}%.
              </p>
            </div>
          </div>

          {/* Verdict */}
          <div
            className="rounded-sm px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            style={{ background: 'var(--verdict-bg)' }}
          >
            <div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#666' }}>
                Bottom line
              </p>
              <p
                className="font-serif font-bold text-xl"
                style={{ color: result.comparison.investmentBeatsInflation ? '#4ade80' : '#f87171' }}
              >
                {result.comparison.investmentBeatsInflation
                  ? `T-Bills outran inflation by ${fmt(result.comparison.realGain)} (${result.comparison.realGainPercentage.toFixed(1)}%)`
                  : `Inflation outpaced T-Bills by ${fmt(Math.abs(result.comparison.realGain))}`}
              </p>
            </div>
            <p className="text-sm font-serif italic" style={{ color: '#555' }}>
              {result.inflation.startYear} – {result.inflation.endYear}
            </p>
          </div>

          {/* Combined chart */}
          {result.inflation.yearByYear?.length > 0 && result.investment.yearByYear?.length > 0 && (
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-sm p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--secondary)] mb-6">
                {fmt(result.inflation.originalAmount)} invested in {result.inflation.startYear} — two paths to {result.inflation.endYear}
              </p>
              <CombinedChart
                inflationData={result.inflation.yearByYear.map(y => ({ year: y.year, value: y.value }))}
                investmentData={result.investment.yearByYear.map(y => ({ year: y.year, value: y.value }))}
                startingAmount={result.inflation.originalAmount}
              />
            </div>
          )}
        </>
      )}

      {loading && (
        <p className="text-sm text-[var(--secondary)]">Calculating...</p>
      )}
    </div>
  );
}
