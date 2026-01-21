"use client";
import { Box, useTheme, alpha } from '@mui/material';
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
import ChartCard from '../dashboard/ChartCard';
import EmptyState from '../common/EmptyState';
import PieChartIcon from '@mui/icons-material/PieChart';

ChartJS.register(
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend
);

const PolarAreaChart = ({ data, title, loading }) => {
    const theme = useTheme();

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: theme.palette.text.secondary,
                    font: {
                        family: theme.typography.fontFamily,
                        size: 11
                    },
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 15
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
            }
        },
        scales: {
            r: {
                ticks: {
                    display: false,
                    backdropColor: 'transparent'
                },
                grid: {
                    color: theme.palette.divider,
                    circular: true,
                    lineWidth: 0.5
                },
                angleLines: {
                    color: theme.palette.divider,
                    lineWidth: 0.5
                },
                pointLabels: {
                    display: false
                }
            }
        },
        layout: {
            padding: 10
        }
    };

    const chartData = {
        labels: data?.map(d => d.name) || [],
        datasets: [
            {
                label: 'Tasks',
                data: data?.map(d => d.value) || [],
                backgroundColor: data?.map(d => alpha(d.color || theme.palette.primary.main, 0.7)) || [],
                borderColor: data?.map(d => d.color || theme.palette.primary.main) || [],
                borderWidth: 1,
            },
        ],
    };

    const hasData = data && data.length > 0 && data.some(d => d.value > 0);

    return (
        <ChartCard title={title} loading={loading} chartType="polarArea">
            {hasData ? (
                <Box sx={{ width: '100%', height: '100%', minHeight: 250 }}>
                    <PolarArea data={chartData} options={chartOptions} />
                </Box>
            ) : (
                <EmptyState
                    title="No Data Available"
                    description="No data to display at the moment."
                    icon={PieChartIcon}
                />
            )}
        </ChartCard>
    );
};

export default PolarAreaChart;
