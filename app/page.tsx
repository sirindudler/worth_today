import Calculator from '@/components/Calculator';
import DataTables from '@/components/DataTables';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-8 pb-20 bg-gray-50 dark:bg-gray-900">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Worth Today
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            Calculate the real value of money over time
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
            Compare inflation vs. Treasury Bill investment returns using historical data
          </p>
          <Link
            href="/about"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            Learn more about this calculator →
          </Link>
        </div>

        <Calculator />

        <div className="mt-16">
          <DataTables />
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-500">
          <p>Data sourced from FRED (Federal Reserve Economic Data)</p>
          <p className="mt-1">CPI: Consumer Price Index | T-Bills: 3-Month Treasury Bill Rates</p>
        </footer>
    </main>
  );
}
