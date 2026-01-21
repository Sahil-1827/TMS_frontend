"use client";
import { useState, useEffect } from 'react';
import { Paper, Typography, Box, Grid, Card, CardContent, Skeleton } from '@mui/material';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const TeamTasksChart = () => {
    const { token } = useAuth();
    const { registerUpdateCallback, unregisterUpdateCallback } = useNotifications();
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const callbackId = "team-tasks-chart";
        const handleDataUpdate = (entityType) => {
            if (entityType === "task" || entityType === "team") {
                setRefetchTrigger((prev) => prev + 1);
            }
        };

        registerUpdateCallback(callbackId, handleDataUpdate);

        const fetchData = async () => {
            if (!token) return;
            try {
                const [tasksRes, teamsRes] = await Promise.all([
                    api.get('/tasks'),
                    api.get('/teams')
                ]);

                const tasks = tasksRes.data.tasks || tasksRes.data;
                const teams = teamsRes.data.teams || teamsRes.data;

                const teamTaskCounts = teams.map(team => {
                    const count = tasks.filter(task => task.team?._id === team._id).length;
                    return { id: team._id, name: team.name, count };
                });
                
                setData(teamTaskCounts);
            } catch (err) {
                setError("Failed to fetch team task data");
            } finally {
                setIsInitialLoad(false);
            }
        };
        fetchData();

        return () => {
            unregisterUpdateCallback(callbackId);
        };
    }, [token, refetchTrigger, registerUpdateCallback, unregisterUpdateCallback]);

    if (error) return <Paper sx={{p:3, height: '100%'}}><Typography color="error">{error}</Typography></Paper>;
    if (!data && isInitialLoad) return (
        <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Skeleton variant="text" width="80%" height={30} />
                <Grid container spacing={2}>
                    {[...Array(2)].map((_, index) => (
                        <Grid item sx={{ minWidth: "150px" }} key={index}>
                            <Skeleton variant="rectangular" height={100} sx={{ width: '100%' }} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Paper>
    );

    return (
        <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Tasks per Team</Typography>
            <Grid container spacing={2} sx={{mt: 1}}>
                {data.length > 0 ? data.map(team => (
                    <Grid item sx={{ minWidth: "150px" }} key={team.id}>
                        <Card variant="outlined" sx={{ width: '100%' }}>
                             <CardContent>
                                 <Typography variant="body1" fontWeight="bold">{team.name}</Typography>
                                 <Typography variant="h4" color="primary">{team.count}</Typography>
                                 <Typography variant="body2" color="text.secondary">
                                   Active Task{team.count === 1 ? '' : 's'}
                                 </Typography>
                             </CardContent>
                        </Card>
                    </Grid>
                )) : (
                    <Grid item sx={{ minWidth: "150px" }}>
                        <Typography color="text.secondary">No teams with assigned tasks found.</Typography>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
};

export default TeamTasksChart;