"use client";
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartCard from '../dashboard/ChartCard';
import EmptyState from '../common/EmptyState';
import BarChartIcon from '@mui/icons-material/BarChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data, title, loading, xAxisLabel, horizontal }) => {
  const theme = useTheme();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
        beginAtZero: true,
      },
    },
    elements: {
      bar: {
        borderRadius: 6,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          if (horizontal) {
            return theme.palette.primary.main
          }
          const color = context.raw?.color || theme.palette.primary.main;
          return color;
        }
      }
    }
  };

  const chartData = {
    labels: data?.map(d => d.name) || [],
    datasets: [
      {
        label: title,
        data: data?.map(d => d.value) || [],
        backgroundColor: data?.map(d => d.color || theme.palette.primary.main) || [],
        maxBarThickness: 40,
      },
    ],
  };

  return (
    <ChartCard title={title} loading={loading} chartType={horizontal ? 'horizontalBar' : 'bar'}>
      {data && data.length > 0 && data.some(d => d.value > 0) ? (
        <Box sx={{ width: '100%', height: '100%', minHeight: 250 }}>
          <Bar options={options} data={chartData} />
        </Box>
      ) : (
        <EmptyState
          title="No Data Available"
          description="No data to display at the moment."
          icon={BarChartIcon}
        />
      )}
    </ChartCard>
  );
};

export default BarChart;