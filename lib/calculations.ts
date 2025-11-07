import { getCPIForYear, getTreasuryRateForYear } from './dataLoader';
import { InflationResult, TreasuryInvestmentResult, YearlyReturn } from './types';

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

  return {
    originalAmount: amount,
    adjustedValue: parseFloat(adjustedValue.toFixed(2)),
    inflationRate: parseFloat(inflationRate.toFixed(2)),
    cpiStart: parseFloat(cpiStart.toFixed(2)),
    cpiEnd: parseFloat(cpiEnd.toFixed(2)),
    startYear,
    endYear,
  };
}

/**
 * Calculate Treasury Bill investment returns
 * Compounds the yearly returns using historical T-Bill rates
 */
export function calculateTreasuryInvestment(
  amount: number,
  startYear: number,
  endYear: number
): TreasuryInvestmentResult | null {
  let currentValue = amount;
  const yearByYear: YearlyReturn[] = [];
  let totalRates = 0;
  let rateCount = 0;

  // Compound each year's return
  for (let year = startYear; year < endYear; year++) {
    const rate = getTreasuryRateForYear(year);

    if (rate === null) {
      // If we encounter a year with no data, we can't continue
      return null;
    }

    // Convert percentage to decimal (e.g., 5.5% becomes 0.055)
    const rateDecimal = rate / 100;

    // Apply this year's return
    currentValue = currentValue * (1 + rateDecimal);

    yearByYear.push({
      year,
      rate: parseFloat(rate.toFixed(2)),
      value: parseFloat(currentValue.toFixed(2)),
    });

    totalRates += rate;
    rateCount++;
  }

  const finalValue = currentValue;
  const totalReturn = finalValue - amount;
  const totalReturnPercentage = ((finalValue - amount) / amount) * 100;
  const averageRate = rateCount > 0 ? totalRates / rateCount : 0;

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
