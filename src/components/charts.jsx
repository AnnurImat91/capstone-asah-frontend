import React, { useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { monthLabels } from '../data/mocks'; // Diperbaiki: Ekstensi .jsx dihapus

// Daftarkan komponen Chart.js yang dibutuhkan
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const LeadVolumeChart = ({ leadsByMonth }) => {
  const data = useMemo(() => ({
    labels: monthLabels,
    datasets: [
      {
        label: 'Volume Lead',
        data: leadsByMonth,
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  }), [leadsByMonth]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Volume Lead per Bulan' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }), []);

  return <div className="h-80"><Line options={options} data={data} /></div>;
};

export const LeadScoreDistributionChart = ({ predictionSummary }) => {
  const scoreBins = {
    'NO (Low Priority)': predictionSummary.negative,
    'YES (High Priority)': predictionSummary.positive,
  };

  const data = useMemo(() => ({
    labels: Object.keys(scoreBins),
    datasets: [
      {
        label: 'Distribusi Prediksi',
        data: Object.values(scoreBins),
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)', // red
          'rgba(16, 185, 129, 0.7)', // green
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(16, 185, 129)',
        ],
        borderWidth: 1,
      },
    ],
  }), [predictionSummary]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Distribusi Hasil Prediksi Lead' },
    },
    scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true }
    }
  }), []);

  return <div className="h-80"><Bar options={options} data={data} /></div>;
};