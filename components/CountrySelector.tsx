'use client';

import { useCountry } from '@/contexts/CountryContext';
import { getAllCountries } from '@/lib/countries';
import { CountryCode } from '@/lib/types';

export default function CountrySelector() {
  const { countryCode, setCountry } = useCountry();
  const countries = getAllCountries();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="country-select" className="text-sm font-medium text-secondary dark:text-gray-400">
        Country:
      </label>
      <select
        id="country-select"
        value={countryCode}
        onChange={(e) => setCountry(e.target.value as CountryCode)}
        className="px-4 py-2 border border-border dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-base transition-apple cursor-pointer"
      >
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
}
