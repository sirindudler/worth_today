'use client';

import { useState, useEffect } from 'react';
import GrowthChart from './GrowthChart';

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

export default function Calculator() {
  const currentYear = new Date().getFullYear();
  const [amount, setAmount] = useState<number>(1);
  const [startYear, setStartYear] = useState<number>(1970);
  const [endYear, setEndYear] = useState<number>(currentYear);
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
        setResult(null);
        return;
      }

      setResult(data);
    } catch (err) {
      setError('An error occurred while calculating');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Calculate on component mount and when inputs change
  useEffect(() => {
    handleCalculate();
  }, [amount, startYear, endYear]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Calculate Historical Value</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-2">
              Amount ($)
            </label>
            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
            />
          </div>

          {/* Start Year Input */}
          <div>
            <label htmlFor="startYear" className="block text-sm font-medium mb-2">
              Start Year
            </label>
            <input
              id="startYear"
              type="number"
              min="1934"
              max={endYear - 1}
              value={startYear}
              onChange={(e) => setStartYear(parseInt(e.target.value) || 1970)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
            />
          </div>

          {/* End Year Input */}
          <div>
            <label htmlFor="endYear" className="block text-sm font-medium mb-2">
              End Year
            </label>
            <input
              id="endYear"
              type="number"
              min={startYear + 1}
              max={currentYear}
              value={endYear}
              onChange={(e) => setEndYear(parseInt(e.target.value) || currentYear)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Calculating...</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inflation Result */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg shadow-lg p-6 border border-red-100 dark:border-red-800">
            <h3 className="text-xl font-bold mb-4 text-red-900 dark:text-red-100">
              Inflation Adjustment
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Original Amount ({result.inflation.startYear})</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(result.inflation.originalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Equivalent in {result.inflation.endYear}
                </p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(result.inflation.adjustedValue)}
                </p>
              </div>
              <div className="pt-3 border-t border-red-200 dark:border-red-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Inflation</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {result.inflation.inflationRate.toFixed(2)}%
                </p>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                CPI: {result.inflation.cpiStart} → {result.inflation.cpiEnd}
              </div>
            </div>

            {result.inflation.yearByYear && result.inflation.yearByYear.length > 0 && (
              <GrowthChart
                title="Inflation Growth Over Time"
                data={result.inflation.yearByYear.map(y => ({ year: y.year, value: y.value }))}
                color="rgb(220, 38, 38)"
                startingAmount={result.inflation.originalAmount}
              />
            )}
          </div>

          {/* Investment Result */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg shadow-lg p-6 border border-green-100 dark:border-green-800">
            <h3 className="text-xl font-bold mb-4 text-green-900 dark:text-green-100">
              Treasury Bill Investment
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Original Investment ({result.investment.startYear})</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(result.investment.originalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Value in {result.investment.endYear}
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(result.investment.finalValue)}
                </p>
              </div>
              <div className="pt-3 border-t border-green-200 dark:border-green-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Return</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(result.investment.totalReturn)} ({result.investment.totalReturnPercentage.toFixed(2)}%)
                </p>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Avg. annual rate: {result.investment.averageRate.toFixed(2)}%
              </div>
            </div>

            {result.investment.yearByYear && result.investment.yearByYear.length > 0 && (
              <GrowthChart
                title="Investment Growth Over Time"
                data={result.investment.yearByYear.map(y => ({ year: y.year, value: y.value }))}
                color="rgb(22, 163, 74)"
                startingAmount={result.investment.originalAmount}
              />
            )}
          </div>
        </div>
      )}

    </div>
  );
}
