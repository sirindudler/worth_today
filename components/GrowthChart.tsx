'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from './ThemeProvider';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DataPoint {
  year: number;
  value: number;
}

interface GrowthChartProps {
  title: string;
  data: DataPoint[];
  color: string;
  startingAmount: number;
}

export default function GrowthChart({ title, data, color, startingAmount }: GrowthChartProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { theme } = useTheme();
  const [, setRenderTrigger] = useState(0);

  // Force re-render when theme changes to update chart colors
  useEffect(() => {
    setRenderTrigger(prev => prev + 1);
  }, [theme]);

  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? '#e5e7eb' : '#171717';
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';

  const chartData = {
    labels: data.map((d) => d.year.toString()),
    datasets: [
      {
        label: 'Value ($)',
        data: data.map((d) => d.value),
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
        tension: 0.1,
        pointRadius: data.length > 50 ? 0 : 2,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: typeof window !== 'undefined' && window.innerWidth < 640 ? 1.2 : 2,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Value: $${context.parsed.y.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
        backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          color: textColor,
          callback: function (value: any) {
            return '$' + value.toLocaleString('en-US');
          },
        },
        title: {
          display: true,
          text: 'Value ($)',
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Year',
          color: textColor,
        },
        ticks: {
          color: textColor,
          maxTicksLimit: typeof window !== 'undefined' && window.innerWidth < 640 ? 8 : 15,
          autoSkip: true,
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };

  return (
    <div className="mt-4 border-t pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left font-semibold text-xs sm:text-sm mb-3 hover:opacity-70 transition-opacity touch-manipulation"
      >
        <span>{title}</span>
        <span className="text-base sm:text-lg">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className="bg-white dark:bg-gray-900 p-2 sm:p-4 rounded-lg">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}
