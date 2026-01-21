"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '@mui/material';
import PieChart from './PieChart';
import api from '../../api';
import { useNotifications } from '../../context/NotificationContext';

const TaskStatusChart = () => {
  const { token } = useAuth();
  const { registerUpdateCallback, unregisterUpdateCallback } = useNotifications();
  const theme = useTheme();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const callbackId = "task-status-chart";
    const handleDataUpdate = (entityType) => {
      if (entityType === "task") {
        setRefetchTrigger((prev) => prev + 1);
      }
    };

    registerUpdateCallback(callbackId, handleDataUpdate);

    const fetchData = async () => {
      if (!token) return;

      setLoading(true);

      try {
        const res = await api.get('/tasks');
        const tasks = res.data.tasks || res.data;

        const statusCounts = tasks.reduce((acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        }, {});

        setChartData([
          { name: 'To Do', value: statusCounts['To Do'] || 0, color: theme.palette.info.main },
          { name: 'In Progress', value: statusCounts['In Progress'] || 0, color: theme.palette.warning.main },
          { name: 'Done', value: statusCounts['Done'] || 0, color: theme.palette.success.main }
        ]);
      } catch (err) {
        console.error("Failed to fetch task data", err);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => unregisterUpdateCallback(callbackId);
  }, [token, theme, refetchTrigger, registerUpdateCallback, unregisterUpdateCallback]);

  return (
    <PieChart
      data={chartData}
      title="All Tasks by Status"
      loading={loading}
    />
  );
};

export default TaskStatusChart;