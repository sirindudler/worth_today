import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Worth Today - Inflation Calculator & Treasury Bill Investment Tool | Historical Financial Data',
  description: 'Learn how Worth Today helps you calculate inflation-adjusted values and Treasury Bill investment returns using historical CPI data from 1947-2025 and T-Bill rates from 1934-2025. Free online financial calculator.',
  keywords: 'inflation calculator, Treasury Bill calculator, CPI calculator, historical inflation rates, investment calculator, money value calculator, purchasing power calculator, FRED data, inflation adjustment, real value of money',
  openGraph: {
    title: 'About Worth Today - Free Inflation & Investment Calculator',
    description: 'Calculate the real value of money over time using historical inflation and Treasury Bill data. Compare purchasing power changes from 1934 to 2025.',
    type: 'website',
    url: 'https://worthtoday.com/about',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function About() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Worth Today',
    applicationCategory: 'FinanceApplication',
    description: 'Free online calculator for inflation adjustment and Treasury Bill investment returns using historical federal reserve data',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Inflation Calculator using CPI data (1947-2025)',
      'Treasury Bill Investment Calculator (1934-2025)',
      'Historical financial data comparison',
      'Real-time value calculations',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen p-4 sm:p-8 pb-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-8">
            <Link
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Back to Calculator
            </Link>
          </nav>

          <article>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              About Worth Today
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  What is Worth Today?
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Worth Today is a free online financial calculator that helps you understand the real value of money over time.
                  Our tool combines two powerful calculations: <strong>inflation adjustment</strong> using Consumer Price Index (CPI) data
                  and <strong>Treasury Bill investment returns</strong> to show you how purchasing power changes across decades.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Whether you're researching historical prices, planning investments, or simply curious about how the value of
                  a dollar has changed since 1934, Worth Today provides accurate, data-driven insights using official Federal
                  Reserve Economic Data (FRED).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  How Does the Inflation Calculator Work?
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Our inflation calculator uses the <strong>Consumer Price Index (CPI)</strong>, the official measure of inflation
                  in the United States. The CPI tracks the average change in prices paid by consumers for a basket of goods and services.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  When you enter an amount and select two dates, our calculator:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                  <li>Retrieves the CPI values for both dates from FRED</li>
                  <li>Calculates the inflation rate between those periods</li>
                  <li>Adjusts your amount to show its equivalent purchasing power</li>
                  <li>Displays the total percentage change in value</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300">
                  This shows you what amount of money in the later date would have the same purchasing power as your original amount.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  Treasury Bill Investment Calculator
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  The <strong>Treasury Bill (T-Bill) calculator</strong> shows what would have happened if you had invested
                  your money in 3-month Treasury Bills instead of holding cash. T-Bills are considered one of the safest
                  investments, backed by the U.S. government.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Our calculator:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                  <li>Uses historical 3-month Treasury Bill rates from 1934 to 2025</li>
                  <li>Applies compound interest calculations</li>
                  <li>Shows your total investment returns over time</li>
                  <li>Compares investment growth against inflation</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  Why Compare Inflation vs. Investment Returns?
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  The side-by-side comparison reveals an important financial insight: <strong>holding cash loses value over time</strong>
                  due to inflation, while investing (even in conservative instruments like T-Bills) can help preserve or grow your wealth.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  This comparison helps you understand:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                  <li>The opportunity cost of holding cash vs. investing</li>
                  <li>How inflation erodes purchasing power</li>
                  <li>Historical investment performance trends</li>
                  <li>Real vs. nominal returns on investments</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  Historical Data Coverage
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Worth Today provides access to extensive historical financial data:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                  <li><strong>CPI Data:</strong> January 1947 to present (updated monthly)</li>
                  <li><strong>Treasury Bill Rates:</strong> January 1934 to present (updated monthly)</li>
                  <li><strong>Data Source:</strong> Federal Reserve Economic Data (FRED)</li>
                  <li><strong>Update Frequency:</strong> Data is refreshed to include the latest available information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  Use Cases for Worth Today
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Our inflation and investment calculator is useful for:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                  <li><strong>Historical Research:</strong> Compare prices and wages across different time periods</li>
                  <li><strong>Financial Planning:</strong> Understand how inflation affects long-term savings and retirement planning</li>
                  <li><strong>Investment Analysis:</strong> Evaluate real returns vs. nominal returns on investments</li>
                  <li><strong>Economic Education:</strong> Learn about inflation, purchasing power, and compound interest</li>
                  <li><strong>Real Estate:</strong> Compare historical property values adjusted for inflation</li>
                  <li><strong>Salary Comparison:</strong> Understand wage growth in real terms across decades</li>
                  <li><strong>Estate Planning:</strong> Calculate inheritance values in today's dollars</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  Why Use Official FRED Data?
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  The Federal Reserve Economic Data (FRED) is maintained by the Federal Reserve Bank of St. Louis and is
                  the authoritative source for U.S. economic data. By using FRED data, Worth Today ensures:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                  <li>Accuracy and reliability of calculations</li>
                  <li>Access to official government statistics</li>
                  <li>Regular updates with the latest data</li>
                  <li>Transparency in data sources</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  Free and Open Source
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Worth Today is completely free to use with no registration required. The project is open source and
                  built with modern web technologies including Next.js, React, and TypeScript.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  We believe financial literacy tools should be accessible to everyone, which is why we've made Worth Today
                  available at no cost.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  Frequently Asked Questions
                </h2>

                <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                  How accurate are the calculations?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Our calculations are based on official CPI and Treasury Bill data from FRED. The results are as accurate
                  as the underlying data, which is the same data used by economists and financial professionals.
                </p>

                <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                  Can I use this for tax or legal purposes?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  While our calculator uses official data, it's designed for informational and educational purposes.
                  For tax or legal matters, please consult with a qualified professional.
                </p>

                <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                  Why might Treasury Bill returns be lower than inflation in some periods?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  During certain periods, especially the 1940s and 1970s-1980s, inflation rates exceeded T-Bill returns,
                  resulting in negative real returns. This demonstrates why diversified investing is important for
                  long-term wealth preservation.
                </p>

                <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                  How often is the data updated?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  FRED updates CPI and T-Bill data monthly. Worth Today pulls the latest available data to ensure
                  you have access to the most current information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  Get Started
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Ready to explore the real value of money over time? Try our calculator now:
                </p>
                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Use the Calculator
                </Link>
              </section>
            </div>
          </article>

          <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-500">
            <p>Data sourced from FRED (Federal Reserve Economic Data)</p>
            <p className="mt-1">CPI: Consumer Price Index | T-Bills: 3-Month Treasury Bill Rates</p>
          </footer>
        </div>
      </main>
    </>
  );
}
