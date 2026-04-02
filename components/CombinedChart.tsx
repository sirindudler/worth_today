'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface DataPoint {
  year: number;
  value: number;
}

interface CombinedChartProps {
  inflationData: DataPoint[];
  investmentData: DataPoint[];
  startingAmount: number;
}

export default function CombinedChart({ inflationData, investmentData, startingAmount }: CombinedChartProps) {
  const labels = inflationData.map(d => d.year.toString());

  const data = {
    labels,
    datasets: [
      {
        label: 'T-Bill Investment',
        data: investmentData.map(d => d.value),
        borderColor: '#27ae60',
        backgroundColor: 'rgba(39,174,96,0.06)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2.5,
      },
      {
        label: 'Inflation-adjusted',
        data: inflationData.map(d => d.value),
        borderColor: '#c0392b',
        backgroundColor: 'rgba(192,57,43,0.04)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
        borderDash: [5, 3],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 3,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#1a1a1a',
        bodyColor: '#555',
        borderColor: '#e0ddd8',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx: any) =>
            `${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: '#f0ece8' },
        border: { display: false },
        ticks: {
          color: '#aaa',
          font: { size: 11 },
          callback: (v: any) => '$' + Number(v).toLocaleString('en-US'),
        },
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: '#aaa',
          font: { size: 11 },
          maxTicksLimit: 11,
          autoSkip: true,
        },
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
      <div className="flex gap-6 mt-3">
        <div className="flex items-center gap-2 text-xs text-[var(--secondary)]">
          <span className="inline-block w-6 h-0.5 bg-[#27ae60]"></span>
          T-Bill investment
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--secondary)]">
          <span className="inline-block w-6 border-t-2 border-dashed border-[#c0392b]"></span>
          Inflation-adjusted
        </div>
      </div>
    </div>
  );
}
