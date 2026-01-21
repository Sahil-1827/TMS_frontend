"use client";
import { useState, useEffect } from 'react';
import { CircularProgress, Typography, useTheme, Box, Skeleton } from '@mui/material';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import PieChart from './PieChart';
import { useNotifications } from '../../context/NotificationContext';

const MyTasksStatusChart = () => {
    const { user, token } = useAuth();
    const { registerUpdateCallback, unregisterUpdateCallback } = useNotifications();
    const theme = useTheme();
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState("");
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const callbackId = "my-tasks-status-chart";
        const handleDataUpdate = (entityType) => {
            if (entityType === "task") {
                setRefetchTrigger((prev) => prev + 1);
            }
        };

        registerUpdateCallback(callbackId, handleDataUpdate);

        const fetchData = async () => {
            if (!token || !user) return;
            try {
                const res = await api.get('/tasks');
                const allTasks = res.data.tasks || res.data;
                
                const myTasks = allTasks.filter(task => task.assignee?._id === user._id);

                const statusCounts = myTasks.reduce((acc, task) => {
                    acc[task.status] = (acc[task.status] || 0) + 1;
                    return acc;
                }, {});
                
                const dataForChart = [
                    { name: 'To Do', value: statusCounts['To Do'] || 0, color: theme.palette.info.main },
                    { name: 'In Progress', value: statusCounts['In Progress'] || 0, color: theme.palette.warning.main },
                    { name: 'Done', value: statusCounts['Done'] || 0, color: theme.palette.success.main }
                ];
                setChartData(dataForChart);
            } catch (err) {
                setError("Failed to fetch your task data");
            } finally {
                setIsInitialLoad(false);
            }
        };
        fetchData();

        return () => {
            unregisterUpdateCallback(callbackId);
        };
    }, [token, user, theme, refetchTrigger, registerUpdateCallback, unregisterUpdateCallback]);
    
    if (error) return <Typography color="error">{error}</Typography>;
    if (!chartData && isInitialLoad) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Skeleton variant="circular" width={100} height={100} />
            <Skeleton variant="text" width="60%" sx={{ mt: 2 }} />
        </Box>
    );

    return <PieChart data={chartData} title="My Assigned Tasks" />;
};

export default MyTasksStatusChart;