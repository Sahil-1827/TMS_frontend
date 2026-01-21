"use client";
import { useState, useEffect } from 'react';
import { useActivityLog } from '../../context/ActivityLogContext';
import { useNotifications } from '../../context/NotificationContext';
import EmptyState from '../common/EmptyState';
import { Typography, Paper, Skeleton, Box, Avatar, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

const RecentActivity = () => {
  const { logs, loading, fetchLogs } = useActivityLog();
  const { registerUpdateCallback, unregisterUpdateCallback } = useNotifications();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const callbackId = "recent-activity-dashboard";
    const handleDataUpdate = (entityType) => {
      if (entityType === "task" || entityType === "team" || entityType === "generic") {
        fetchLogs({ limit: 3 });
      }
    };

    registerUpdateCallback(callbackId, handleDataUpdate);
    fetchLogs({ limit: 3 }).then(() => setIsInitialLoad(false));

    return () => {
      unregisterUpdateCallback(callbackId);
    };
  }, [fetchLogs, registerUpdateCallback, unregisterUpdateCallback]);

  const getActivityIcon = (text) => {
    if (!text) return <HistoryIcon />;
    const lower = text.toLowerCase();
    if (lower.includes('create') || lower.includes('add')) return <AddIcon fontSize="small" />;
    if (lower.includes('update') || lower.includes('edit')) return <EditIcon fontSize="small" />;
    if (lower.includes('delete') || lower.includes('remove')) return <DeleteIcon fontSize="small" />;
    if (lower.includes('complete') || lower.includes('done')) return <CheckCircleIcon fontSize="small" />;
    return <HistoryIcon fontSize="small" />;
  };

  const getActivityColor = (text) => {
    if (!text) return 'default';
    const lower = text.toLowerCase();
    if (lower.includes('create') || lower.includes('add')) return 'success.main';
    if (lower.includes('update') || lower.includes('edit')) return 'info.main';
    if (lower.includes('delete') || lower.includes('remove')) return 'error.main';
    if (lower.includes('complete') || lower.includes('done')) return 'success.main';
    return 'primary.main';
  };

  const LoadingSkeleton = () => (
    <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent' }}>
      {[1, 2, 3].map((i) => (
        <Box key={i} sx={{ display: 'flex', mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
            <Skeleton variant="circular" width={32} height={32} />
            {i !== 3 && <Skeleton variant="rectangular" width={2} height={30} sx={{ mt: 1 }} />}
          </Box>
          <Box sx={{ pt: 0.5, flexGrow: 1 }}>
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
        </Box>
      ))}
    </Paper>
  );

  if ((loading || isInitialLoad) && logs.length === 0) {
    return (
      <Paper sx={{ p: 3, height: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider' }} elevation={0}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
          <HistoryIcon color="action" />
          <Typography variant="h6" fontWeight="bold">Recent Activity</Typography>
        </Box>
        <LoadingSkeleton />
      </Paper>
    )
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 380,
        overflow: 'auto'
      }}
      elevation={0}
    >
      <Box sx={{ display: {xs: 'grid', sm: 'flex'}, gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr'}, justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">Recent Activity</Typography>
        </Box>
        <Button
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate('/activity-log')}
          size="small"
          sx={{ borderRadius: 2 }}
        >
          View All
        </Button>
      </Box>

      <Box sx={{
        flexGrow: 1, overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
        }, pr: 1
      }}>
        {logs.length > 0 ? (
          logs.slice(0, 5).map((log, index) => {
            const isLast = index === logs.length - 1 || index === 5;
            return (
              <Box key={log._id || index} sx={{ display: 'flex' }}>
                {/* Timeline Line & Dot */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'background.paper',
                      border: '2px solid',
                      borderColor: getActivityColor(log.details),
                      color: getActivityColor(log.details),
                      zIndex: 1
                    }}
                  >
                    {getActivityIcon(log.details)}
                  </Avatar>
                  {!isLast && (
                    <Box
                      sx={{
                        width: 2,
                        flexGrow: 1,
                        bgcolor: 'divider',
                        my: 0.5,
                        minHeight: 24
                      }}
                    />
                  )}
                </Box>

                {/* Content */}
                <Box sx={{ pb: isLast ? 0 : 3, pt: 0.5 }}>
                  <Typography variant="body2" fontWeight="medium" sx={{ lineHeight: 1.3, mb: 0.5 }}>
                    {log.details}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {log.performedBy?.avatar ? (
                      <Avatar src={log.performedBy.avatar} sx={{ width: 16, height: 16 }} />
                    ) : (
                      <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {log.performedBy?.name || 'System'} • {new Date(log.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })
        ) : (
          <EmptyState
            title="No Recent Activity"
            description="No recent activity to display."
            icon={HistoryIcon}
            height={275}
          />
        )}
      </Box>
    </Paper>
  );
};

export default RecentActivity;