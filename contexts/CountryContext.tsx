'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { CountryCode, Country } from '@/lib/types';
import { getCountry } from '@/lib/countries';

interface CountryContextType {
  countryCode: CountryCode;
  country: Country;
  setCountry: (code: CountryCode) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const [countryCode, setCountryCode] = useState<CountryCode>('US');

  const value: CountryContextType = {
    countryCode,
    country: getCountry(countryCode),
    setCountry: setCountryCode,
  };

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}
