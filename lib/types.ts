export interface CPIData {
  observation_date: string;
  CPIAUCSL: string;
}

export interface TreasuryBillData {
  observation_date: string;
  TB3MS: string;
}

export interface InflationResult {
  originalAmount: number;
  adjustedValue: number;
  inflationRate: number;
  cpiStart: number;
  cpiEnd: number;
  startYear: number;
  endYear: number;
  yearByYear: YearlyInflation[];
}

export interface YearlyInflation {
  year: number;
  cpi: number;
  value: number;
}

export interface TreasuryInvestmentResult {
  originalAmount: number;
  finalValue: number;
  totalReturn: number;
  totalReturnPercentage: number;
  averageRate: number;
  startYear: number;
  endYear: number;
  yearByYear: YearlyReturn[];
}

export interface YearlyReturn {
  year: number;
  rate: number;
  value: number;
}

export interface CalculatorInputs {
  amount: number;
  startYear: number;
  endYear: number;
}

export interface DataRange {
  minYear: number;
  maxYear: number;
  cpiMinYear: number;
  cpiMaxYear: number;
  tbillMinYear: number;
  tbillMaxYear: number;
}

export type CountryCode = 'US' | 'CH';

export interface Country {
  code: CountryCode;
  name: string;
  currency: string;
  currencySymbol: string;
  inflationLabel: string;
  investmentLabel: string;
  investmentDescription: string;
}
