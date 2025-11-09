import cpiDataUS from '@/data/cpi.json';
import treasuryDataUS from '@/data/treasury-bills.json';
import cpiDataCH from '@/data/ch/cpi.json';
import bondsDataCH from '@/data/ch/bonds.json';
import { CPIData, TreasuryBillData, DataRange, CountryCode } from './types';

// Type the imported data
const cpiDataUSTyped = cpiDataUS as CPIData[];
const treasuryDataUSTyped = treasuryDataUS as TreasuryBillData[];

// Switzerland data uses different field names
interface SwissCPIData {
  observation_date: string;
  CPI: string;
}

interface SwissBondData {
  observation_date: string;
  RATE: string;
}

const cpiDataCHTyped = cpiDataCH as SwissCPIData[];
const bondsDataCHTyped = bondsDataCH as SwissBondData[];

// Helper functions to get country-specific data
function getCPIDataForCountry(country: CountryCode): CPIData[] {
  if (country === 'CH') {
    // Convert Swiss CPI format to standard format
    return cpiDataCHTyped.map(item => ({
      observation_date: item.observation_date,
      CPIAUCSL: item.CPI
    }));
  }
  return cpiDataUSTyped;
}

function getInvestmentDataForCountry(country: CountryCode): TreasuryBillData[] {
  if (country === 'CH') {
    // Convert Swiss bond format to standard format
    return bondsDataCHTyped.map(item => ({
      observation_date: item.observation_date,
      TB3MS: item.RATE
    }));
  }
  return treasuryDataUSTyped;
}

/**
 * Get CPI value for a specific year (using December value of that year)
 * If December is not available, use the last available month for that year
 * This handles partial years (e.g., current year with incomplete data)
 */
export function getCPIForYear(year: number, country: CountryCode = 'US'): number | null {
  const cpiData = getCPIDataForCountry(country);

  // Try to find December data for the year
  const decemberData = cpiData.find(
    (item) => item.observation_date.startsWith(`${year}-12`)
  );

  if (decemberData && decemberData.CPIAUCSL !== '.') {
    return parseFloat(decemberData.CPIAUCSL);
  }

  // If December not found, get the last available month for that year
  const yearData = cpiData.filter((item) =>
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
export function getTreasuryRateForYear(year: number, country: CountryCode = 'US'): number | null {
  const investmentData = getInvestmentDataForCountry(country);

  const yearData = investmentData.filter((item) =>
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
export function getMonthlyTreasuryRates(startYear: number, startMonth: number, endYear: number, endMonth: number, country: CountryCode = 'US'): Array<{year: number, month: number, rate: number}> | null {
  const investmentData = getInvestmentDataForCountry(country);
  const monthlyRates: Array<{year: number, month: number, rate: number}> = [];

  for (let year = startYear; year <= endYear; year++) {
    const monthStart = (year === startYear) ? startMonth : 1;
    const monthEnd = (year === endYear) ? endMonth : 12;

    for (let month = monthStart; month <= monthEnd; month++) {
      const monthStr = month.toString().padStart(2, '0');
      const dateStr = `${year}-${monthStr}-01`;

      const data = investmentData.find((item) => item.observation_date === dateStr);

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
export function getDataRange(country: CountryCode = 'US'): DataRange {
  const cpiData = getCPIDataForCountry(country);
  const investmentData = getInvestmentDataForCountry(country);

  // Get CPI range
  const cpiYears = cpiData
    .filter((item) => item.CPIAUCSL !== '.')
    .map((item) => parseInt(item.observation_date.substring(0, 4)));

  const cpiMinYear = Math.min(...cpiYears);
  const cpiMaxYear = Math.max(...cpiYears);

  // Get Treasury Bill range
  const tbillYears = investmentData
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
export function isValidCPIYear(year: number, country: CountryCode = 'US'): boolean {
  const range = getDataRange(country);
  return year >= range.cpiMinYear && year <= range.cpiMaxYear;
}

/**
 * Check if a year is within the valid range for Treasury Bill data
 */
export function isValidTreasuryYear(year: number, country: CountryCode = 'US'): boolean {
  const range = getDataRange(country);
  return year >= range.tbillMinYear && year <= range.tbillMaxYear;
}

/**
 * Get all CPI data points (for charting)
 */
export function getAllCPIData(country: CountryCode = 'US'): CPIData[] {
  const cpiData = getCPIDataForCountry(country);
  return cpiData.filter((item) => item.CPIAUCSL !== '.');
}

/**
 * Get all Treasury Bill data points (for charting)
 */
export function getAllTreasuryData(country: CountryCode = 'US'): TreasuryBillData[] {
  const investmentData = getInvestmentDataForCountry(country);
  return investmentData.filter((item) => item.TB3MS !== '.');
}

/**
 * Get CPI data grouped by year (yearly average)
 */
export function getCPIDataByYear(startYear?: number, endYear?: number, country: CountryCode = 'US'): Array<{year: number, cpi: number}> {
  const cpiData = getCPIDataForCountry(country);
  const years = new Set<number>();

  cpiData
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
    const yearData = cpiData.filter((item) =>
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
export function getCPIDataByMonth(startYear?: number, endYear?: number, country: CountryCode = 'US'): Array<{year: number, month: number, date: string, cpi: number}> {
  const cpiData = getCPIDataForCountry(country);
  return cpiData
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
export function getTreasuryDataByYear(startYear?: number, endYear?: number, country: CountryCode = 'US'): Array<{year: number, rate: number}> {
  const investmentData = getInvestmentDataForCountry(country);
  const years = new Set<number>();

  investmentData
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
    const yearData = investmentData.filter((item) =>
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
export function getTreasuryDataByMonth(startYear?: number, endYear?: number, country: CountryCode = 'US'): Array<{year: number, month: number, date: string, rate: number}> {
  const investmentData = getInvestmentDataForCountry(country);
  return investmentData
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
