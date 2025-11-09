import Calculator from '@/components/Calculator';
import CountrySelector from '@/components/CountrySelector';
import DataTables from '@/components/DataTables';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-8 pb-20 bg-background dark:bg-gray-900">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-accent via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Worth Today
          </h1>
          <p className="text-lg sm:text-xl text-secondary dark:text-gray-400 mb-3 px-4 max-w-2xl mx-auto">
            Calculate the real value of money over time
          </p>
          <p className="text-sm sm:text-base text-secondary dark:text-gray-500 px-4 max-w-2xl mx-auto mb-6">
            Compare inflation vs. Treasury Bill investment returns using historical data
          </p>

          {/* Country Selector */}
          <div className="flex justify-center mb-6">
            <CountrySelector />
          </div>

          <Link
            href="/about"
            className="inline-block text-accent dark:text-blue-400 hover:opacity-80 text-sm font-semibold transition-apple"
          >
            Learn more about this calculator →
          </Link>
        </div>

        <Calculator />

        <div className="mt-16">
          <DataTables />
        </div>

        <footer className="mt-16 text-center text-xs sm:text-sm text-secondary dark:text-gray-500 px-4">
          <p>Data sourced from FRED (Federal Reserve Economic Data)</p>
          <p className="mt-2 text-xs">CPI: Consumer Price Index | T-Bills: 3-Month Treasury Bill Rates</p>
        </footer>
    </main>
  );
}
