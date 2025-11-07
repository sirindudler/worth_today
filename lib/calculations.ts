import { getCPIForYear, getTreasuryRateForYear, getMonthlyTreasuryRates } from './dataLoader';
import { InflationResult, TreasuryInvestmentResult, YearlyReturn, YearlyInflation } from './types';

/**
 * Calculate inflation-adjusted value
 * Formula: Future Value = Present Value × (CPI_end / CPI_start)
 */
export function calculateInflationAdjustment(
  amount: number,
  startYear: number,
  endYear: number
): InflationResult | null {
  const cpiStart = getCPIForYear(startYear);
  const cpiEnd = getCPIForYear(endYear);

  if (cpiStart === null || cpiEnd === null) {
    return null;
  }

  // Calculate the inflation-adjusted value
  const adjustedValue = amount * (cpiEnd / cpiStart);

  // Calculate the total inflation rate as a percentage
  const inflationRate = ((cpiEnd - cpiStart) / cpiStart) * 100;

  // Calculate year-by-year inflation values
  const yearByYear: YearlyInflation[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const cpiForYear = getCPIForYear(year);

    if (cpiForYear === null) {
      return null;
    }

    const valueForYear = amount * (cpiForYear / cpiStart);

    yearByYear.push({
      year,
      cpi: parseFloat(cpiForYear.toFixed(2)),
      value: parseFloat(valueForYear.toFixed(2)),
    });
  }

  return {
    originalAmount: amount,
    adjustedValue: parseFloat(adjustedValue.toFixed(2)),
    inflationRate: parseFloat(inflationRate.toFixed(2)),
    cpiStart: parseFloat(cpiStart.toFixed(2)),
    cpiEnd: parseFloat(cpiEnd.toFixed(2)),
    startYear,
    endYear,
    yearByYear,
  };
}

/**
 * Calculate Treasury Bill investment returns
 * Compounds month-by-month using actual historical T-Bill rates for accuracy
 */
export function calculateTreasuryInvestment(
  amount: number,
  startYear: number,
  endYear: number
): TreasuryInvestmentResult | null {
  // Get all monthly rates for the period (starting from January, ending in December)
  const monthlyRates = getMonthlyTreasuryRates(startYear, 1, endYear, 12);

  if (!monthlyRates || monthlyRates.length === 0) {
    return null;
  }

  let currentValue = amount;
  const yearByYear: YearlyReturn[] = [];
  let totalRates = 0;
  let lastCompletedYear = startYear - 1;

  // Add the starting year value
  yearByYear.push({
    year: startYear,
    rate: 0,
    value: parseFloat(amount.toFixed(2)),
  });

  // Compound month-by-month
  for (const monthData of monthlyRates) {
    const { year, month, rate } = monthData;

    // Annual rate to monthly rate: divide by 12, then convert to decimal
    // e.g., 5.25% annual -> 5.25/12 = 0.4375% monthly -> 0.004375 decimal
    const monthlyRateDecimal = rate / 12 / 100;

    // Apply this month's return
    currentValue = currentValue * (1 + monthlyRateDecimal);

    totalRates += rate;

    // At the end of each year (December), record the year-end value
    if (month === 12 && year > lastCompletedYear) {
      // Calculate the average rate for this year
      const yearRates = monthlyRates.filter(m => m.year === year);
      const yearAvgRate = yearRates.reduce((sum, m) => sum + m.rate, 0) / yearRates.length;

      yearByYear.push({
        year: year,
        rate: parseFloat(yearAvgRate.toFixed(2)),
        value: parseFloat(currentValue.toFixed(2)),
      });

      lastCompletedYear = year;
    }
  }

  // If the end year hasn't been added yet (partial year), add it
  if (lastCompletedYear < endYear) {
    const yearRates = monthlyRates.filter(m => m.year === endYear);
    const yearAvgRate = yearRates.length > 0
      ? yearRates.reduce((sum, m) => sum + m.rate, 0) / yearRates.length
      : 0;

    yearByYear.push({
      year: endYear,
      rate: parseFloat(yearAvgRate.toFixed(2)),
      value: parseFloat(currentValue.toFixed(2)),
    });
  }

  const finalValue = currentValue;
  const totalReturn = finalValue - amount;
  const totalReturnPercentage = ((finalValue - amount) / amount) * 100;
  const averageRate = monthlyRates.length > 0 ? totalRates / monthlyRates.length : 0;

  return {
    originalAmount: amount,
    finalValue: parseFloat(finalValue.toFixed(2)),
    totalReturn: parseFloat(totalReturn.toFixed(2)),
    totalReturnPercentage: parseFloat(totalReturnPercentage.toFixed(2)),
    averageRate: parseFloat(averageRate.toFixed(2)),
    startYear,
    endYear,
    yearByYear,
  };
}

/**
 * Calculate both inflation and investment, and return comparison
 */
export function calculateComparison(
  amount: number,
  startYear: number,
  endYear: number
) {
  const inflation = calculateInflationAdjustment(amount, startYear, endYear);
  const investment = calculateTreasuryInvestment(amount, startYear, endYear);

  if (!inflation || !investment) {
    return null;
  }

  // Calculate how much better the investment performed vs just holding cash
  const realGain = investment.finalValue - inflation.adjustedValue;
  const realGainPercentage =
    ((investment.finalValue - inflation.adjustedValue) / inflation.adjustedValue) * 100;

  return {
    inflation,
    investment,
    comparison: {
      realGain: parseFloat(realGain.toFixed(2)),
      realGainPercentage: parseFloat(realGainPercentage.toFixed(2)),
      investmentBeatsInflation: investment.finalValue > inflation.adjustedValue,
    },
  };
}
