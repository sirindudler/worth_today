import { getCPIForYear, getTreasuryRateForYear, getMonthlyTreasuryRates, getMonthlyTIPSRates } from './dataLoader';
import { InflationResult, TreasuryInvestmentResult, TIPSInvestmentResult, YearlyReturn, YearlyInflation } from './types';

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
 * Calculate TIPS (Treasury Inflation-Protected Securities) investment returns
 * TIPS combine inflation protection with real yield
 * Formula: Final Value = Initial × (CPI_end/CPI_start) × Product[(1 + monthly_real_yield)]
 */
export function calculateTIPSInvestment(
  amount: number,
  startYear: number,
  endYear: number
): TIPSInvestmentResult | null {
  // Get CPI values for inflation adjustment
  const cpiStart = getCPIForYear(startYear);
  const cpiEnd = getCPIForYear(endYear);

  if (cpiStart === null || cpiEnd === null) {
    return null;
  }

  // Get all monthly real yields for the period
  const monthlyRates = getMonthlyTIPSRates(startYear, 1, endYear, 12);

  if (!monthlyRates || monthlyRates.length === 0) {
    return null;
  }

  // Start with the initial amount
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

  // Compound month-by-month using real yields
  for (const monthData of monthlyRates) {
    const { year, month, rate } = monthData;

    // Real yield to monthly rate: divide by 12, then convert to decimal
    const monthlyRateDecimal = rate / 12 / 100;

    // Apply this month's real return
    currentValue = currentValue * (1 + monthlyRateDecimal);

    totalRates += rate;

    // At the end of each year (December), record the year-end value
    if (month === 12 && year > lastCompletedYear) {
      // Get CPI for this year to show inflation-adjusted value
      const cpiForYear = getCPIForYear(year);

      // Calculate the average real yield for this year
      const yearRates = monthlyRates.filter(m => m.year === year);
      const yearAvgRate = yearRates.reduce((sum, m) => sum + m.rate, 0) / yearRates.length;

      // Calculate value with both real yield and inflation adjustment
      let yearValue = currentValue;
      if (cpiForYear !== null) {
        yearValue = amount * (cpiForYear / cpiStart);
        // Apply real returns on top of inflation adjustment
        const realMultiplier = monthlyRates
          .filter(m => m.year <= year)
          .reduce((mult, m) => mult * (1 + m.rate / 12 / 100), 1);
        yearValue = amount * (cpiForYear / cpiStart) * realMultiplier;
      }

      yearByYear.push({
        year: year,
        rate: parseFloat(yearAvgRate.toFixed(2)),
        value: parseFloat(yearValue.toFixed(2)),
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

    // Calculate final value with both inflation adjustment and real returns
    const inflationMultiplier = cpiEnd / cpiStart;
    const realMultiplier = monthlyRates.reduce((mult, m) => mult * (1 + m.rate / 12 / 100), 1);
    const finalValue = amount * inflationMultiplier * realMultiplier;

    yearByYear.push({
      year: endYear,
      rate: parseFloat(yearAvgRate.toFixed(2)),
      value: parseFloat(finalValue.toFixed(2)),
    });
  }

  // Calculate final value with both inflation protection and real yield
  const inflationAdjustment = cpiEnd / cpiStart;
  const realMultiplier = monthlyRates.reduce((mult, m) => mult * (1 + m.rate / 12 / 100), 1);
  const finalValue = amount * inflationAdjustment * realMultiplier;

  const totalReturn = finalValue - amount;
  const totalReturnPercentage = ((finalValue - amount) / amount) * 100;
  const averageRealYield = monthlyRates.length > 0 ? totalRates / monthlyRates.length : 0;

  // Real return is the return above inflation
  const inflationOnlyValue = amount * inflationAdjustment;
  const realReturn = finalValue - inflationOnlyValue;

  return {
    originalAmount: amount,
    finalValue: parseFloat(finalValue.toFixed(2)),
    totalReturn: parseFloat(totalReturn.toFixed(2)),
    totalReturnPercentage: parseFloat(totalReturnPercentage.toFixed(2)),
    averageRealYield: parseFloat(averageRealYield.toFixed(2)),
    inflationAdjustment: parseFloat(((inflationAdjustment - 1) * 100).toFixed(2)),
    realReturn: parseFloat(realReturn.toFixed(2)),
    startYear,
    endYear,
    yearByYear,
  };
}

/**
 * Calculate inflation, treasury investment, TIPS investment, and return comparison
 */
export function calculateComparison(
  amount: number,
  startYear: number,
  endYear: number
) {
  const inflation = calculateInflationAdjustment(amount, startYear, endYear);
  const investment = calculateTreasuryInvestment(amount, startYear, endYear);
  const tips = calculateTIPSInvestment(amount, startYear, endYear);

  if (!inflation || !investment) {
    return null;
  }

  // Calculate how much better the investment performed vs just holding cash
  const realGain = investment.finalValue - inflation.adjustedValue;
  const realGainPercentage =
    ((investment.finalValue - inflation.adjustedValue) / inflation.adjustedValue) * 100;

  // Calculate TIPS comparison if available
  let tipsComparison = null;
  if (tips) {
    const tipsRealGain = tips.finalValue - inflation.adjustedValue;
    const tipsRealGainPercentage =
      ((tips.finalValue - inflation.adjustedValue) / inflation.adjustedValue) * 100;

    tipsComparison = {
      realGain: parseFloat(tipsRealGain.toFixed(2)),
      realGainPercentage: parseFloat(tipsRealGainPercentage.toFixed(2)),
      tipsBeatsInflation: tips.finalValue > inflation.adjustedValue,
      tipsBeatsTBills: tips.finalValue > investment.finalValue,
    };
  }

  return {
    inflation,
    investment,
    tips,
    comparison: {
      realGain: parseFloat(realGain.toFixed(2)),
      realGainPercentage: parseFloat(realGainPercentage.toFixed(2)),
      investmentBeatsInflation: investment.finalValue > inflation.adjustedValue,
    },
    tipsComparison,
  };
}
