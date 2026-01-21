"use client";
import { Box, useTheme } from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ChartCard from '../dashboard/ChartCard';
import EmptyState from '../common/EmptyState';
import ShowChartIcon from '@mui/icons-material/ShowChart';

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

const LineChart = ({ data, title, loading }) => {
    const theme = useTheme();

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    color: theme.palette.text.secondary,
                    font: {
                        family: theme.typography.fontFamily,
                        size: 11
                    },
                    usePointStyle: true,
                    boxWidth: 8
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
                intersect: false,
                mode: 'index',
            }
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
                        family: theme.typography.fontFamily,
                        size: 11
                    }
                }
            },
            y: {
                grid: {
                    color: theme.palette.divider,
                    drawBorder: false,
                    borderDash: [4, 4],
                },
                ticks: {
                    color: theme.palette.text.secondary,
                    font: {
                        family: theme.typography.fontFamily,
                        size: 11
                    },
                    stepSize: 1
                },
                beginAtZero: true
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    let chartData = { labels: [], datasets: [] };

    if (Array.isArray(data)) {
        chartData = {
            labels: data.map(d => d.name),
            datasets: [
                {
                    label: 'Count',
                    data: data.map(d => d.value),
                    borderColor: data.length > 0 ? data[0].color : theme.palette.primary.main,
                    backgroundColor: data.length > 0 ? `${data[0].color}33` : `${theme.palette.primary.main}33`,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: theme.palette.background.paper,
                    pointBorderColor: data.length > 0 ? data[0].color : theme.palette.primary.main,
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        };
    } else if (data && data.labels && data.datasets) {
        chartData = data;
    }

    const hasData = chartData.datasets.some(ds => ds.data.some(val => val > 0));

    return (
        <ChartCard title={title} loading={loading} chartType="line">
            {hasData ? (
                <Box sx={{ width: '100%', height: '100%', minHeight: 250 }}>
                    <Line data={chartData} options={chartOptions} />
                </Box>
            ) : (
                <EmptyState
                    title="No Data Available"
                    description="No data to display at the moment."
                    icon={ShowChartIcon}
                />
            )}
        </ChartCard>
    );
};

export default LineChart;
