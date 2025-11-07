'use client';

import { ThemeProvider } from './ThemeProvider';
import ThemeToggle from './ThemeToggle';
import { ReactNode } from 'react';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeToggle />
      {children}
    </ThemeProvider>
  );
}
