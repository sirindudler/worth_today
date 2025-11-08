import cpiData from '@/data/cpi.json';
import treasuryData from '@/data/treasury-bills.json';
import { CPIData, TreasuryBillData, TIPSData, DataRange } from './types';

// Type the imported data
const cpiDataTyped = cpiData as CPIData[];
const treasuryDataTyped = treasuryData as TreasuryBillData[];

// TIPS data is optional - import only if available
let tipsDataTyped: TIPSData[] = [];
try {
  const tipsData = require('@/data/tips.json');
  tipsDataTyped = tipsData as TIPSData[];
} catch (e) {
  // TIPS data not available - feature will be disabled
  console.warn('TIPS data not available. TIPS calculations will be disabled.');
}

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
 * Get average TIPS real yield for a specific year (annual average)
 */
export function getTIPSRateForYear(year: number): number | null {
  if (tipsDataTyped.length === 0) return null;

  const yearData = tipsDataTyped.filter((item) =>
    item.DATE.startsWith(`${year}-`)
  );

  if (yearData.length === 0) {
    return null;
  }

  // Calculate average rate for the year, excluding missing data (marked as '.')
  const validRates = yearData
    .filter((item) => item.DFII10 !== '.')
    .map((item) => parseFloat(item.DFII10));

  if (validRates.length === 0) {
    return null;
  }

  const sum = validRates.reduce((acc, rate) => acc + rate, 0);
  return sum / validRates.length;
}

/**
 * Get monthly TIPS real yields for a specific year and month range
 * Returns array of {year, month, rate} objects for month-by-month compounding
 * If end month data is missing, it will return data up to the last available month
 */
export function getMonthlyTIPSRates(startYear: number, startMonth: number, endYear: number, endMonth: number): Array<{year: number, month: number, rate: number}> | null {
  if (tipsDataTyped.length === 0) return null;

  const monthlyRates: Array<{year: number, month: number, rate: number}> = [];

  for (let year = startYear; year <= endYear; year++) {
    const monthStart = (year === startYear) ? startMonth : 1;
    const monthEnd = (year === endYear) ? endMonth : 12;

    for (let month = monthStart; month <= monthEnd; month++) {
      const monthStr = month.toString().padStart(2, '0');
      // TIPS data uses different date format - try different day values
      let data = null;

      // Try common date formats in FRED data (01, 02, 03, 04)
      for (const day of ['01', '02', '03', '04']) {
        const dateStr = `${year}-${monthStr}-${day}`;
        data = tipsDataTyped.find((item) => item.DATE === dateStr);
        if (data && data.DFII10 !== '.') {
          break;
        }
      }

      if (!data || data.DFII10 === '.') {
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
        rate: parseFloat(data.DFII10)
      });
    }
  }

  return monthlyRates;
}

/**
 * Get the available data range for CPI, Treasury, and TIPS data
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

  // Get TIPS range (if available)
  let tipsMinYear = 0;
  let tipsMaxYear = 0;

  if (tipsDataTyped.length > 0) {
    const tipsYears = tipsDataTyped
      .filter((item) => item.DFII10 !== '.')
      .map((item) => parseInt(item.DATE.substring(0, 4)));

    if (tipsYears.length > 0) {
      tipsMinYear = Math.min(...tipsYears);
      tipsMaxYear = Math.max(...tipsYears);
    }
  }

  return {
    minYear: Math.max(cpiMinYear, tbillMinYear), // Overall min (for both calculators)
    maxYear: Math.min(cpiMaxYear, tbillMaxYear), // Overall max (for both calculators)
    cpiMinYear,
    cpiMaxYear,
    tbillMinYear,
    tbillMaxYear,
    tipsMinYear,
    tipsMaxYear,
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
 * Check if a year is within the valid range for TIPS data
 */
export function isValidTIPSYear(year: number): boolean {
  if (tipsDataTyped.length === 0) return false;
  const range = getDataRange();
  return year >= range.tipsMinYear && year <= range.tipsMaxYear && range.tipsMinYear > 0;
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

/**
 * Get CPI data grouped by year (yearly average)
 */
export function getCPIDataByYear(startYear?: number, endYear?: number): Array<{year: number, cpi: number}> {
  const years = new Set<number>();

  cpiDataTyped
    .filter((item) => item.CPIAUCSL !== '.')
    .forEach((item) => {
      const year = parseInt(item.observation_date.substring(0, 4));
      years.add(year);
    });

  const sortedYears = Array.from(years).sort((a, b) => a - b);
  const filteredYears = sortedYears.filter(year => {
    if (startYear && year < startYear) return false;
    if (endYear && year > endYear) return false;
    return true;
  });

  return filteredYears.map(year => {
    // Get average CPI for the year
    const yearData = cpiDataTyped.filter((item) =>
      item.observation_date.startsWith(`${year}-`) && item.CPIAUCSL !== '.'
    );

    const avgCPI = yearData.reduce((sum, item) => sum + parseFloat(item.CPIAUCSL), 0) / yearData.length;

    return {
      year,
      cpi: parseFloat(avgCPI.toFixed(2))
    };
  });
}

/**
 * Get CPI data by month
 */
export function getCPIDataByMonth(startYear?: number, endYear?: number): Array<{year: number, month: number, date: string, cpi: number}> {
  return cpiDataTyped
    .filter((item) => {
      if (item.CPIAUCSL === '.') return false;

      const year = parseInt(item.observation_date.substring(0, 4));
      if (startYear && year < startYear) return false;
      if (endYear && year > endYear) return false;

      return true;
    })
    .map((item) => {
      const [year, month] = item.observation_date.split('-');
      return {
        year: parseInt(year),
        month: parseInt(month),
        date: item.observation_date,
        cpi: parseFloat(parseFloat(item.CPIAUCSL).toFixed(2))
      };
    });
}

/**
 * Get Treasury Bill data grouped by year (yearly average)
 */
export function getTreasuryDataByYear(startYear?: number, endYear?: number): Array<{year: number, rate: number}> {
  const years = new Set<number>();

  treasuryDataTyped
    .filter((item) => item.TB3MS !== '.')
    .forEach((item) => {
      const year = parseInt(item.observation_date.substring(0, 4));
      years.add(year);
    });

  const sortedYears = Array.from(years).sort((a, b) => a - b);
  const filteredYears = sortedYears.filter(year => {
    if (startYear && year < startYear) return false;
    if (endYear && year > endYear) return false;
    return true;
  });

  return filteredYears.map(year => {
    // Get average rate for the year
    const yearData = treasuryDataTyped.filter((item) =>
      item.observation_date.startsWith(`${year}-`) && item.TB3MS !== '.'
    );

    const avgRate = yearData.reduce((sum, item) => sum + parseFloat(item.TB3MS), 0) / yearData.length;

    return {
      year,
      rate: parseFloat(avgRate.toFixed(2))
    };
  });
}

/**
 * Get Treasury Bill data by month
 */
export function getTreasuryDataByMonth(startYear?: number, endYear?: number): Array<{year: number, month: number, date: string, rate: number}> {
  return treasuryDataTyped
    .filter((item) => {
      if (item.TB3MS === '.') return false;

      const year = parseInt(item.observation_date.substring(0, 4));
      if (startYear && year < startYear) return false;
      if (endYear && year > endYear) return false;

      return true;
    })
    .map((item) => {
      const [year, month] = item.observation_date.split('-');
      return {
        year: parseInt(year),
        month: parseInt(month),
        date: item.observation_date,
        rate: parseFloat(parseFloat(item.TB3MS).toFixed(2))
      };
    });
}
