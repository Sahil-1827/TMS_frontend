"use client";
import { useState, useEffect } from 'react';
import { Typography, useTheme, Box, Skeleton, Paper } from '@mui/material';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import PieChart from './PieChart';
import { useNotifications } from '../../context/NotificationContext';

const UserRoleChart = () => {
    const { user, token } = useAuth();
    const { registerUpdateCallback, unregisterUpdateCallback } = useNotifications();
    const theme = useTheme();

    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const callbackId = "user-role-chart";

        const handleDataUpdate = (entityType) => {
            if (entityType === "user") {
                setRefetchTrigger(prev => prev + 1);
            }
        };

        registerUpdateCallback(callbackId, handleDataUpdate);

        const fetchData = async () => {
            if (!token || !user) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get('/users');
                const fetchedUsers = res.data || [];

                const usersForCounting = fetchedUsers.some(u => u._id === user._id)
                    ? fetchedUsers
                    : [...fetchedUsers, user];

                const roleCounts = usersForCounting.reduce((acc, u) => {
                    acc[u.role] = (acc[u.role] || 0) + 1;
                    return acc;
                }, {});

                const dataForChart = [
                    { name: 'Admin', value: roleCounts.admin || 0, color: theme.palette.error.main },
                    { name: 'Manager', value: roleCounts.manager || 0, color: theme.palette.primary.main },
                    { name: 'User', value: roleCounts.user || 0, color: theme.palette.secondary.main }
                ];

                setChartData(dataForChart);
            } catch (err) {
                setError("Failed to fetch user data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => unregisterUpdateCallback(callbackId);
    }, [token, user, theme, refetchTrigger, registerUpdateCallback, unregisterUpdateCallback]);

    if (error) return <Typography color="error">{error}</Typography>;

    return <PieChart data={chartData} title="Users by Role" loading={loading} />;
};

export default UserRoleChart;
