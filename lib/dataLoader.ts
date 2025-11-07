import cpiData from '@/data/cpi.json';
import treasuryData from '@/data/treasury-bills.json';
import { CPIData, TreasuryBillData, DataRange } from './types';

// Type the imported data
const cpiDataTyped = cpiData as CPIData[];
const treasuryDataTyped = treasuryData as TreasuryBillData[];

/**
 * Get CPI value for a specific year (using December value of that year)
 * If December is not available, use the last available month for that year
 * This handles partial years (e.g., current year with incomplete data)
 */
export function getCPIForYear(year: number): number | null {
  // Try to find December data for the year
  const decemberData = cpiDataTyped.find(
    (item) => item.observation_date.startsWith(`${year}-12`)
  );

  if (decemberData && decemberData.CPIAUCSL !== '.') {
    return parseFloat(decemberData.CPIAUCSL);
  }

  // If December not found, get the last available month for that year
  const yearData = cpiDataTyped.filter((item) =>
    item.observation_date.startsWith(`${year}-`)
  );

  if (yearData.length > 0) {
    // Find the last entry with valid data
    for (let i = yearData.length - 1; i >= 0; i--) {
      if (yearData[i].CPIAUCSL !== '.') {
        return parseFloat(yearData[i].CPIAUCSL);
      }
    }
  }

  return null;
}

/**
 * Get average Treasury Bill rate for a specific year (annual average)
 */
export function getTreasuryRateForYear(year: number): number | null {
  const yearData = treasuryDataTyped.filter((item) =>
    item.observation_date.startsWith(`${year}-`)
  );

  if (yearData.length === 0) {
    return null;
  }

  // Calculate average rate for the year, excluding missing data (marked as '.')
  const validRates = yearData
    .filter((item) => item.TB3MS !== '.')
    .map((item) => parseFloat(item.TB3MS));

  if (validRates.length === 0) {
    return null;
  }

  const sum = validRates.reduce((acc, rate) => acc + rate, 0);
  return sum / validRates.length;
}

/**
 * Get monthly Treasury Bill rates for a specific year and month range
 * Returns array of {month, rate} objects for month-by-month compounding
 * If end month data is missing, it will return data up to the last available month
 */
export function getMonthlyTreasuryRates(startYear: number, startMonth: number, endYear: number, endMonth: number): Array<{year: number, month: number, rate: number}> | null {
  const monthlyRates: Array<{year: number, month: number, rate: number}> = [];

  for (let year = startYear; year <= endYear; year++) {
    const monthStart = (year === startYear) ? startMonth : 1;
    const monthEnd = (year === endYear) ? endMonth : 12;

    for (let month = monthStart; month <= monthEnd; month++) {
      const monthStr = month.toString().padStart(2, '0');
      const dateStr = `${year}-${monthStr}-01`;

      const data = treasuryDataTyped.find((item) => item.observation_date === dateStr);

      if (!data || data.TB3MS === '.') {
        // For the end year, if we're missing data, stop at the last available month
        // This allows calculations for partial years (e.g., current year)
        if (year === endYear && monthlyRates.length > 0) {
          return monthlyRates;
        }
        // For years in the middle of the range, missing data is an error
        return null;
      }

      monthlyRates.push({
        year,
        month,
        rate: parseFloat(data.TB3MS)
      });
    }
  }

  return monthlyRates;
}

/**
 * Get the available data range for both CPI and Treasury data
 */
export function getDataRange(): DataRange {
  // Get CPI range
  const cpiYears = cpiDataTyped
    .filter((item) => item.CPIAUCSL !== '.')
    .map((item) => parseInt(item.observation_date.substring(0, 4)));

  const cpiMinYear = Math.min(...cpiYears);
  const cpiMaxYear = Math.max(...cpiYears);

  // Get Treasury Bill range
  const tbillYears = treasuryDataTyped
    .filter((item) => item.TB3MS !== '.')
    .map((item) => parseInt(item.observation_date.substring(0, 4)));

  const tbillMinYear = Math.min(...tbillYears);
  const tbillMaxYear = Math.max(...tbillYears);

  return {
    minYear: Math.max(cpiMinYear, tbillMinYear), // Overall min (for both calculators)
    maxYear: Math.min(cpiMaxYear, tbillMaxYear), // Overall max (for both calculators)
    cpiMinYear,
    cpiMaxYear,
    tbillMinYear,
    tbillMaxYear,
  };
}

/**
 * Check if a year is within the valid range for CPI data
 */
export function isValidCPIYear(year: number): boolean {
  const range = getDataRange();
  return year >= range.cpiMinYear && year <= range.cpiMaxYear;
}

/**
 * Check if a year is within the valid range for Treasury Bill data
 */
export function isValidTreasuryYear(year: number): boolean {
  const range = getDataRange();
  return year >= range.tbillMinYear && year <= range.tbillMaxYear;
}

/**
 * Get all CPI data points (for charting)
 */
export function getAllCPIData(): CPIData[] {
  return cpiDataTyped.filter((item) => item.CPIAUCSL !== '.');
}

/**
 * Get all Treasury Bill data points (for charting)
 */
export function getAllTreasuryData(): TreasuryBillData[] {
  return treasuryDataTyped.filter((item) => item.TB3MS !== '.');
}
