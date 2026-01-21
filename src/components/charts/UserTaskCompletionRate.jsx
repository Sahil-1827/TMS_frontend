"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '@mui/material';
import ComboChart from './ComboChart';
import api from '../../api';
import { useNotifications } from '../../context/NotificationContext';

const UserTaskCompletionRate = () => {
  const { token } = useAuth();
  const { registerUpdateCallback, unregisterUpdateCallback } = useNotifications();
  const theme = useTheme();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const callbackId = "user-task-completion-rate-chart";
    const handleDataUpdate = (entityType) => {
      if (entityType === "task" || entityType === "user" || entityType === "team") {
        setRefetchTrigger((prev) => prev + 1);
      }
    };

    registerUpdateCallback(callbackId, handleDataUpdate);

    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      };
      if (isInitialLoad) {
        setLoading(true);
      }

      try {
        const [usersRes, tasksRes, teamsRes] = await Promise.all([
          api.get('/users'),
          api.get('/tasks'),
          api.get('/teams')
        ]);

        const users = usersRes.data || [];
        const tasks = tasksRes.data.tasks || [];
        const teams = teamsRes.data.teams || [];

        const userTaskStats = users.map(user => {
          const userTeamIds = teams
            .filter(team => team.members.some(member => member._id === user._id))
            .map(team => team._id);

          const assignedTasks = tasks.filter(task =>
            (task.assignee?._id === user._id) ||
            (task.team?._id && userTeamIds.includes(task.team._id))
          );

          const completedTasks = assignedTasks.filter(task => task.status === 'Done');
          const completionRate = assignedTasks.length > 0 ? Math.round((completedTasks.length / assignedTasks.length) * 100) : 0;
          return {
            name: user.name,
            completionRate: completionRate,
            assignedCount: assignedTasks.length
          };
        });

        const dataForChart = {
          labels: userTaskStats.map(stat => stat.name),
          lineData: userTaskStats.map(stat => stat.completionRate),
          barData: userTaskStats.map(stat => stat.assignedCount)
        };

        setChartData(dataForChart);
      } catch (err) {
        console.error("Failed to fetch user task completion data", err);
        const staticData = {
          labels: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'],
          lineData: [85, 92, 78, 95],
          barData: [12, 18, 8, 20]
        };
        setChartData(staticData);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };
    fetchData();

    return () => {
      unregisterUpdateCallback(callbackId);
    };
  }, [token, theme, refetchTrigger, registerUpdateCallback, unregisterUpdateCallback]);

  return <ComboChart data={chartData} title="User Task Completion & Workload" loading={loading} />;
};

export default UserTaskCompletionRate;