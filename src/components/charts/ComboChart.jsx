"use client";
import React from 'react';
import { Box, useTheme } from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    LineController,
    BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import ChartCard from '../dashboard/ChartCard';
import EmptyState from '../common/EmptyState';
import BarChartIcon from '@mui/icons-material/BarChart';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    LineController,
    BarController,
    Title,
    Tooltip,
    Legend
);

const ComboChart = ({ data, title, loading }) => {
    const theme = useTheme();

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: theme.palette.text.primary,
                    usePointStyle: true,
                }
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
                type: 'linear',
                display: true,
                position: 'left',
                grid: {
                    color: theme.palette.divider,
                    borderDash: [5, 5],
                    drawBorder: false,
                },
                ticks: {
                    color: theme.palette.text.secondary,
                },
                title: {
                    display: true,
                    text: 'Tasks Assigned',
                    color: theme.palette.text.secondary,
                    font: { size: 10 }
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    color: theme.palette.text.secondary,
                    callback: function (value) {
                        return value + '%';
                    }
                },
                title: {
                    display: true,
                    text: 'Completion Rate',
                    color: theme.palette.text.secondary,
                    font: { size: 10 }
                },
                min: 0,
                max: 100,
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
    };

    const chartData = {
        labels: data?.labels || [],
        datasets: [
            {
                type: 'line',
                label: 'Completion Rate (%)',
                data: data?.lineData || [],
                borderColor: theme.palette.success.main,
                backgroundColor: theme.palette.success.main,
                borderWidth: 2,
                tension: 0.3,
                yAxisID: 'y1',
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                type: 'bar',
                label: 'Tasks Assigned',
                data: data?.barData || [],
                backgroundColor: theme.palette.primary.main,
                maxBarThickness: 40,
                borderRadius: 4,
                yAxisID: 'y',
            },
        ],
    };

    const hasData = data?.labels?.length > 0 &&
        (data.lineData?.some(v => v > 0) || data.barData?.some(v => v > 0));

    return (
        <ChartCard title={title} loading={loading} chartType="combo">
            {hasData ? (
                <Box sx={{ width: '100%', height: '100%', minHeight: 300 }}>
                    <Chart type='bar' data={chartData} options={options} />
                </Box>
            ) : (
                <EmptyState
                    title="No Data Available"
                    description="Nodata to display at the moment."
                    icon={BarChartIcon}
                />
            )}
        </ChartCard>
    );
};

export default ComboChart;
