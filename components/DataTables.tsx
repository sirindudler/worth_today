'use client';

import { useState, useMemo } from 'react';
import {
  getCPIDataByYear,
  getCPIDataByMonth,
  getTreasuryDataByYear,
  getTreasuryDataByMonth,
} from '@/lib/dataLoader';

type ViewMode = 'yearly' | 'monthly';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

interface DataTablesProps {
  startYear: number;
  endYear: number;
}

export default function DataTables({ startYear, endYear }: DataTablesProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('yearly');
  const yearRange = { start: startYear, end: endYear };

  const cpiData = useMemo(() => {
    if (viewMode === 'yearly') return getCPIDataByYear(yearRange.start, yearRange.end);
    return getCPIDataByMonth(yearRange.start, yearRange.end);
  }, [viewMode, yearRange]);

  const treasuryData = useMemo(() => {
    if (viewMode === 'yearly') return getTreasuryDataByYear(yearRange.start, yearRange.end);
    return getTreasuryDataByMonth(yearRange.start, yearRange.end);
  }, [viewMode, yearRange]);

  const thClass = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[var(--secondary)]';
  const tdClass = 'px-4 py-2.5 text-sm text-[var(--foreground)]';

  return (
    <div className="space-y-8">
      {/* Section header + controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <h2 className="font-serif text-2xl font-bold text-[var(--foreground)]">Historical Data</h2>

        <div className="flex flex-wrap items-center gap-5">
          <span className="text-sm text-[var(--secondary)]">
            {startYear} – {endYear}
          </span>

          <div className="flex gap-1 border border-[var(--border)] rounded-sm p-0.5">
            {(['yearly', 'monthly'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors rounded-sm ${
                  viewMode === mode
                    ? 'bg-[var(--foreground)] text-[var(--background)]'
                    : 'text-[var(--secondary)] hover:text-[var(--foreground)]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CPI */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-inflation)] flex-shrink-0"></span>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--secondary)]">
              Consumer Price Index (CPI)
            </h3>
          </div>
          <div className="border border-[var(--border)] rounded-sm overflow-hidden">
            <div className="overflow-auto max-h-80">
              <table className="w-full">
                <thead className="sticky top-0 bg-[var(--card-bg)] border-b border-[var(--border)]">
                  <tr>
                    <th className={thClass}>{viewMode === 'monthly' ? 'Date' : 'Year'}</th>
                    <th className={thClass + ' text-right'}>YoY Change</th>
                  </tr>
                </thead>
                <tbody className="bg-[var(--card-bg)] divide-y divide-[var(--border)]">
                  {cpiData.length === 0 ? (
                    <tr>
                      <td colSpan={2} className={tdClass + ' py-8 text-center text-[var(--secondary)]'}>
                        No data for this range
                      </td>
                    </tr>
                  ) : viewMode === 'yearly' ? (
                    cpiData.map((item: any, i: number) => {
                      const prev = cpiData[i - 1] as any;
                      const change = prev ? ((item.cpi - prev.cpi) / prev.cpi) * 100 : null;
                      return (
                        <tr key={item.year} className="hover:bg-[var(--background)] transition-colors">
                          <td className={tdClass}>{item.year}</td>
                          <td className={tdClass + ' text-right tabular-nums'}>
                            {change === null ? (
                              <span className="text-[var(--secondary)]">—</span>
                            ) : (
                              <span style={{ color: change > 0 ? 'var(--accent-inflation)' : 'var(--accent-tbill)' }}>
                                {change > 0 ? '+' : ''}{change.toFixed(2)}%
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    cpiData.map((item: any, i: number) => {
                      const prev = cpiData[i - 1] as any;
                      const change = prev ? ((item.cpi - prev.cpi) / prev.cpi) * 100 : null;
                      return (
                        <tr key={item.date} className="hover:bg-[var(--background)] transition-colors">
                          <td className={tdClass}>{MONTH_NAMES[item.month - 1]} {item.year}</td>
                          <td className={tdClass + ' text-right tabular-nums'}>
                            {change === null ? (
                              <span className="text-[var(--secondary)]">—</span>
                            ) : (
                              <span style={{ color: change > 0 ? 'var(--accent-inflation)' : 'var(--accent-tbill)' }}>
                                {change > 0 ? '+' : ''}{change.toFixed(2)}%
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* T-Bills */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-tbill)] flex-shrink-0"></span>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--secondary)]">
              3-Month Treasury Bill Rates
            </h3>
          </div>
          <div className="border border-[var(--border)] rounded-sm overflow-hidden">
            <div className="overflow-auto max-h-80">
              <table className="w-full">
                <thead className="sticky top-0 bg-[var(--card-bg)] border-b border-[var(--border)]">
                  <tr>
                    <th className={thClass}>{viewMode === 'monthly' ? 'Date' : 'Year'}</th>
                    <th className={thClass + ' text-right'}>Rate (%)</th>
                  </tr>
                </thead>
                <tbody className="bg-[var(--card-bg)] divide-y divide-[var(--border)]">
                  {treasuryData.length === 0 ? (
                    <tr>
                      <td colSpan={2} className={tdClass + ' py-8 text-center text-[var(--secondary)]'}>
                        No data for this range
                      </td>
                    </tr>
                  ) : viewMode === 'yearly' ? (
                    treasuryData.map((item: any) => (
                      <tr key={item.year} className="hover:bg-[var(--background)] transition-colors">
                        <td className={tdClass}>{item.year}</td>
                        <td className={tdClass + ' text-right tabular-nums'}>{item.rate}%</td>
                      </tr>
                    ))
                  ) : (
                    treasuryData.map((item: any) => (
                      <tr key={item.date} className="hover:bg-[var(--background)] transition-colors">
                        <td className={tdClass}>{MONTH_NAMES[item.month - 1]} {item.year}</td>
                        <td className={tdClass + ' text-right tabular-nums'}>{item.rate}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
