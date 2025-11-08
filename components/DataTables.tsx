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

export default function DataTables() {
  const [viewMode, setViewMode] = useState<ViewMode>('yearly');
  const [yearRange, setYearRange] = useState({ start: 2020, end: 2025 });

  // Get data based on view mode
  const cpiData = useMemo(() => {
    if (viewMode === 'yearly') {
      return getCPIDataByYear(yearRange.start, yearRange.end);
    } else {
      return getCPIDataByMonth(yearRange.start, yearRange.end);
    }
  }, [viewMode, yearRange]);

  const treasuryData = useMemo(() => {
    if (viewMode === 'yearly') {
      return getTreasuryDataByYear(yearRange.start, yearRange.end);
    } else {
      return getTreasuryDataByMonth(yearRange.start, yearRange.end);
    }
  }, [viewMode, yearRange]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Controls */}
      <div className="bg-card-bg dark:bg-gray-800 rounded-2xl shadow-apple dark:shadow-lg p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <h2 className="text-2xl sm:text-3xl font-semibold">Historical Data</h2>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Year Range Inputs */}
            <div className="flex items-center gap-3">
              <label htmlFor="startYear" className="text-sm font-medium text-secondary dark:text-gray-400 whitespace-nowrap">
                From:
              </label>
              <input
                id="startYear"
                type="number"
                min="1934"
                max={yearRange.end}
                value={yearRange.start}
                onChange={(e) => setYearRange(prev => ({ ...prev, start: parseInt(e.target.value) || prev.start }))}
                className="w-28 sm:w-24 px-3 py-2.5 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-sm transition-apple"
              />
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="endYear" className="text-sm font-medium text-secondary dark:text-gray-400 whitespace-nowrap">
                To:
              </label>
              <input
                id="endYear"
                type="number"
                min={yearRange.start}
                max={new Date().getFullYear()}
                value={yearRange.end}
                onChange={(e) => setYearRange(prev => ({ ...prev, end: parseInt(e.target.value) || prev.end }))}
                className="w-28 sm:w-24 px-3 py-2.5 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-sm transition-apple"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-border dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('yearly')}
                className={`px-4 py-2.5 rounded-md text-sm font-medium transition-apple touch-manipulation ${
                  viewMode === 'yearly'
                    ? 'bg-white dark:bg-gray-600 text-foreground dark:text-white shadow-apple-sm'
                    : 'text-secondary dark:text-gray-400 hover:text-foreground dark:hover:text-white'
                }`}
              >
                Yearly
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-4 py-2.5 rounded-md text-sm font-medium transition-apple touch-manipulation ${
                  viewMode === 'monthly'
                    ? 'bg-white dark:bg-gray-600 text-foreground dark:text-white shadow-apple-sm'
                    : 'text-secondary dark:text-gray-400 hover:text-foreground dark:hover:text-white'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* CPI Table */}
        <div className="bg-card-bg dark:bg-gray-800 rounded-2xl shadow-apple dark:shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 sm:px-8 py-4 sm:py-5">
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              Consumer Price Index (CPI)
            </h3>
          </div>
          <div className="overflow-auto max-h-[400px] sm:max-h-[600px]">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                <tr>
                  {viewMode === 'monthly' && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                  )}
                  {viewMode === 'yearly' && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Year
                    </th>
                  )}
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    CPI Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {cpiData.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No data available for this range
                    </td>
                  </tr>
                ) : viewMode === 'yearly' ? (
                  cpiData.map((item: any) => (
                    <tr key={item.year} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {item.year}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                        {item.cpi}
                      </td>
                    </tr>
                  ))
                ) : (
                  cpiData.map((item: any) => (
                    <tr key={item.date} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {MONTH_NAMES[item.month - 1]} {item.year}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                        {item.cpi}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Treasury Bills Table */}
        <div className="bg-card-bg dark:bg-gray-800 rounded-2xl shadow-apple dark:shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 sm:px-8 py-4 sm:py-5">
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              3-Month Treasury Bill Rates
            </h3>
          </div>
          <div className="overflow-auto max-h-[400px] sm:max-h-[600px]">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                <tr>
                  {viewMode === 'monthly' && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                  )}
                  {viewMode === 'yearly' && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Year
                    </th>
                  )}
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rate (%)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {treasuryData.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No data available for this range
                    </td>
                  </tr>
                ) : viewMode === 'yearly' ? (
                  treasuryData.map((item: any) => (
                    <tr key={item.year} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {item.year}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                        {item.rate}%
                      </td>
                    </tr>
                  ))
                ) : (
                  treasuryData.map((item: any) => (
                    <tr key={item.date} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {MONTH_NAMES[item.month - 1]} {item.year}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                        {item.rate}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
