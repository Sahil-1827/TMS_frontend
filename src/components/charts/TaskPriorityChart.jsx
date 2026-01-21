import { useState, useEffect } from 'react';
import { Typography, useTheme } from '@mui/material';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import PieChart from './PieChart';
import { useNotifications } from '../../context/NotificationContext';

const TaskPriorityChart = () => {
    const { token } = useAuth();
    const { registerUpdateCallback, unregisterUpdateCallback } = useNotifications();
    const theme = useTheme();

    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refetchTrigger, setRefetchTrigger] = useState(0)

    useEffect(() => {
        const callbackId = "task-priority-chart";
        const handleDataUpdate = (entityType) => {
            if (entityType === "task") {
                setRefetchTrigger((prev) => prev + 1);
            }
        };

        registerUpdateCallback(callbackId, handleDataUpdate);

        const fetchData = async () => {
            if (!token) return;

            setLoading(true);
            setError('');

            try {
                const res = await api.get('/tasks/stats/priority');
                const priorityCounts = res.data;

                setChartData([
                    { name: 'Low', value: priorityCounts.low || 0, color: theme.palette.info.main },
                    { name: 'Medium', value: priorityCounts.medium || 0, color: theme.palette.warning.main },
                    { name: 'High', value: priorityCounts.high || 0, color: theme.palette.error.main }
                ]);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch task data');
                setChartData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => unregisterUpdateCallback(callbackId);
    }, [token, theme, refetchTrigger, registerUpdateCallback, unregisterUpdateCallback]);

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <PieChart
            title="All Tasks by Priority"
            data={chartData}
            loading={loading}
        />
    );
};

export default TaskPriorityChart;