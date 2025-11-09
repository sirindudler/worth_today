import { Country, CountryCode } from './types';

export const COUNTRIES: Record<CountryCode, Country> = {
  US: {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    inflationLabel: 'Inflation Adjustment',
    investmentLabel: 'Treasury Bill Investment',
    investmentDescription: '3-Month Treasury Bill',
  },
  CH: {
    code: 'CH',
    name: 'Switzerland',
    currency: 'CHF',
    currencySymbol: 'CHF',
    inflationLabel: 'Inflation Adjustment',
    investmentLabel: 'Government Bond Investment',
    investmentDescription: 'Swiss Government Bond',
  },
};

export function getCountry(code: CountryCode): Country {
  return COUNTRIES[code];
}

export function getAllCountries(): Country[] {
  return Object.values(COUNTRIES);
}
