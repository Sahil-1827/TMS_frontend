"use client";
import { Box, Typography, useTheme } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartCard from '../dashboard/ChartCard';
import EmptyState from '../common/EmptyState';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, title, loading }) => {
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
                    padding: 20
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
        cutout: '70%',
    };

    const chartData = {
        labels: data?.map(d => d.name) || [],
        datasets: [
            {
                data: data?.map(d => d.value) || [],
                backgroundColor: data?.map(d => d.color) || [],
                borderColor: theme.palette.background.paper,
                borderWidth: 2,
                hoverOffset: 4
            },
        ],
    };

    const hasData = data && data.length > 0 && data.some(d => d.value > 0);

    return (
        <ChartCard title={title} loading={loading} chartType="doughnut">
            {hasData ? (
                <Box sx={{ width: '100%', height: '100%', minHeight: 250, position: 'relative' }}>
                    <Doughnut data={chartData} options={chartOptions} />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -60%)',
                            textAlign: 'center',
                            pointerEvents: 'none'
                        }}
                    >
                        <Typography variant="h4" fontWeight="bold">
                            {data.reduce((acc, curr) => acc + curr.value, 0)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Total
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <EmptyState
                    title="No Data Available"
                    description="No data to display at the moment."
                    icon={DonutLargeIcon}
                />
            )}
        </ChartCard>
    );
};

export default PieChart;