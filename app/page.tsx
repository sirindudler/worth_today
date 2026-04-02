'use client';

import { useState } from 'react';
import Calculator from '@/components/Calculator';
import DataTables from '@/components/DataTables';
import Link from 'next/link';

export default function Home() {
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState(1970);
  const [endYear, setEndYear] = useState(currentYear);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] px-8 py-5 flex items-baseline justify-between">
        <span className="font-serif text-2xl font-bold text-[var(--foreground)]">Worth Today</span>
        <span className="text-xs text-[var(--secondary)] tracking-widest uppercase">
          <Link href="/about" className="hover:text-[var(--foreground)] transition-colors">
            A historical money calculator
          </Link>
        </span>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-16">
        <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight tracking-tight text-[var(--foreground)] mb-16 text-balance">
          What is <em className="italic text-[var(--secondary)]">old money</em><br />worth today?
        </h1>

        <Calculator
          startYear={startYear}
          endYear={endYear}
          onStartYearChange={setStartYear}
          onEndYearChange={setEndYear}
        />

        <div className="mt-20">
          <DataTables startYear={startYear} endYear={endYear} />
        </div>

        <footer className="mt-16 pt-8 border-t border-[var(--border)] text-xs text-[var(--secondary)]">
          Data sourced from FRED (Federal Reserve Economic Data) · CPI: Consumer Price Index · T-Bills: 3-Month Treasury Bill Rates
        </footer>
      </div>
    </main>
  );
}
