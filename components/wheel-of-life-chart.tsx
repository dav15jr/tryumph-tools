'use client';

import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

interface WheelOfLifeChartProps {
  currentData: number[];
  comparisonData?: number[];
  labels: string[];
  fullWidth?: boolean;
  currentTotalScore: number;
  comparisonTotalScore?: number;
  currentDate: string;
  comparisonDate?: string;
}

export function WheelOfLifeChart({
  currentData,
  comparisonData,
  labels,
  fullWidth = true,
  currentTotalScore,
  comparisonTotalScore,
  currentDate,
  comparisonDate,
}: WheelOfLifeChartProps) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Current',
        data: currentData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(147, 112, 219, 0.8)',
          'rgba(50, 205, 50, 0.8)',
          'rgba(255, 165, 0, 0.8)',
          'rgba(255, 0, 0, 0.8)',
          'rgba(34, 139, 34, 0.8)',
          'rgba(0, 191, 255, 0.8)',
          'rgba(138, 43, 226, 0.8)',
          'rgba(220, 20, 60, 0.8)',
          'rgba(46, 139, 87, 0.8)',
        ],
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
      },
      ...(comparisonData
        ? [
            {
              label: 'Comparison',
              data: comparisonData,
              backgroundColor: 'rgba(100, 100, 100, 0.7)',
              borderColor: 'rgba(128, 128, 128, 1)',
              borderWidth: 1,
            },
          ]
        : []),
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
          display: false,
        },
        grid: {
          color: 'rgba(0, 200, 0, 0.2)',
          circular: true,
        },
        pointLabels: {
          display: true,
          centerPointLabels: true,
          font: {
            size: 12
          }
        },
        angleLines: {
          display: true,
          color: 'rgba(0, 200, 0, 0.2)',
          lineWidth: 1,
          borderDash: [5, 5],
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        display: false, // Remove chart keys
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.chart.data.labels[context.dataIndex];
            const value = context.raw;
            const datasetLabel = context.dataset.label;
            return `${datasetLabel} - ${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center sm:text-left text-xl">
          Wheel of Life {currentDate}{' '}
          {comparisonDate ? `vs ${comparisonDate}` : ''}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <p className="text-md font-semibold">
            Current Total: {currentTotalScore.toFixed(1)}
          </p>
          {comparisonTotalScore !== undefined && (
            <p className="text-md font-semibold">
              Previous Total: {comparisonTotalScore.toFixed(1)}
            </p>
          )}
        </div>
        <div className="aspect-square w-full max-w-xl min-w-[240px] mx-auto">
          <PolarArea data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
