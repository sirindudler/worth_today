'use client';

import { ThemeProvider } from './ThemeProvider';
import { CountryProvider } from '@/contexts/CountryContext';
import ThemeToggle from './ThemeToggle';
import { ReactNode } from 'react';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <CountryProvider>
        <ThemeToggle />
        {children}
      </CountryProvider>
    </ThemeProvider>
  );
}
