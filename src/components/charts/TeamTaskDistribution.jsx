"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '@mui/material';
import PolarAreaChart from './PolarAreaChart';
import api from '../../api';
import { useNotifications } from '../../context/NotificationContext';

const TeamTaskDistribution = () => {
  const { token } = useAuth();
  const { registerUpdateCallback, unregisterUpdateCallback } = useNotifications();
  const theme = useTheme();

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const callbackId = "team-task-distribution-chart";

    const handleDataUpdate = (entityType) => {
      if (entityType === "task" || entityType === "team") {
        setRefetchTrigger(prev => prev + 1);
      }
    };

    registerUpdateCallback(callbackId, handleDataUpdate);

    const fetchData = async () => {
      if (!token) return;

      setLoading(true);

      try {
        const [tasksRes, teamsRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/teams')
        ]);

        const tasks = tasksRes.data.tasks || [];
        const teams = teamsRes.data.teams || [];

        const teamTaskCounts = teams.map(team => ({
          id: team._id,
          name: team.name,
          value: tasks.filter(
            task => task.team && task.team._id === team._id
          ).length
        }));

        const colors = [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.info.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main
        ];

        setChartData(
          teamTaskCounts.map((team, index) => ({
            ...team,
            color: colors[index % colors.length]
          }))
        );
      } catch (err) {
        console.error("Failed to fetch team task data", err);
        const staticData = [
          { id: '1', name: 'Design Team', value: 12 },
          { id: '2', name: 'Frontend', value: 19 },
          { id: '3', name: 'Backend', value: 8 },
          { id: '4', name: 'QA Team', value: 5 },
        ];
        const colors = [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.info.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main
        ];
        setChartData(
          staticData.map((team, index) => ({
            ...team,
            color: colors[index % colors.length]
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => unregisterUpdateCallback(callbackId);
  }, [token, theme, refetchTrigger, registerUpdateCallback, unregisterUpdateCallback]);

  return (
    <PolarAreaChart
      title="Team Task Distribution"
      data={chartData}
      loading={loading}
    />
  );
};

export default TeamTaskDistribution;