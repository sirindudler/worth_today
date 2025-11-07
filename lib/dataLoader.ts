import cpiData from '@/data/cpi.json';
import treasuryData from '@/data/treasury-bills.json';
import { CPIData, TreasuryBillData, DataRange } from './types';

// Type the imported data
const cpiDataTyped = cpiData as CPIData[];
const treasuryDataTyped = treasuryData as TreasuryBillData[];

/**
 * Get CPI value for a specific year (using December value of that year)
 * If December is not available, use the last available month for that year
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
    const lastMonth = yearData[yearData.length - 1];
    if (lastMonth.CPIAUCSL !== '.') {
      return parseFloat(lastMonth.CPIAUCSL);
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
