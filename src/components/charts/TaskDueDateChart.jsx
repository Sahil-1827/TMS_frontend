"use client";
import { useState, useEffect } from 'react';
import { Typography, useTheme } from '@mui/material';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import LineChart from './LineChart';
import { useNotifications } from '../../context/NotificationContext';

const TaskDueDateChart = () => {
    const { token } = useAuth();
    const { registerUpdateCallback, unregisterUpdateCallback } = useNotifications();
    const theme = useTheme();
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const callbackId = "task-due-date-chart";
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
                const res = await api.get('/tasks');
                const tasks = res.data.tasks || res.data;

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const counts = {
                    'Overdue': 0,
                    'Today': 0,
                    'This Week': 0,
                    'Later': 0,
                };

                tasks.forEach(task => {
                    if (!task.dueDate) return;

                    const dueDate = new Date(task.dueDate);
                    dueDate.setHours(0, 0, 0, 0);

                    if (dueDate < today) {
                        counts['Overdue']++;
                    } else if (dueDate.getTime() === today.getTime()) {
                        counts['Today']++;
                    } else if (dueDate > today && dueDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) {
                        counts['This Week']++;
                    } else {
                        counts.Later++;
                    }
                });

                setChartData([
                    { name: 'Overdue', value: counts.Overdue, color: theme.palette.error.main },
                    { name: 'Today', value: counts.Today, color: theme.palette.warning.main },
                    { name: 'This Week', value: counts['This Week'], color: theme.palette.info.main },
                    { name: 'Later', value: counts.Later, color: theme.palette.success.main }
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
        <LineChart
            title="Tasks by Due Date"
            data={chartData}
            loading={loading}
        />
    );
};

export default TaskDueDateChart;
