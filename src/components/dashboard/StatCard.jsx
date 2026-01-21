"use client";
import { Card, Typography, Box, Avatar, Skeleton, Paper } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const StatCard = ({ title, value, icon, color, loading, trend, trendLabel }) => {
  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          minWidth: 150,
          height: '100%'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Skeleton variant="text" width={80} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={20} height={40} />
          </Box>
          <Skeleton
            variant="rounded"
            width={48}
            height={48}
            sx={{ borderRadius: 3 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
          <Skeleton variant="circular" width={16} height={16} />
          <Skeleton variant="text" width={120} height={20} />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight="medium" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary' }}>
            {value}
          </Typography>
        </Box>
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: (theme) => {
              const colorKey = color?.split('.')[0] || 'primary';
              return theme.palette.mode === 'dark'
                ? `${theme.palette[colorKey]?.main || theme.palette.primary.main}33`
                : `${theme.palette[colorKey]?.light || theme.palette.primary.light}40`;
            },
            color: (theme) => {
              const colorKey = color?.split('.')[0] || 'primary';
              return theme.palette[colorKey]?.main || theme.palette.primary.main;
            },
            width: 48,
            height: 48,
            borderRadius: 3
          }}
        >
          {icon}
        </Avatar>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
        {trend !== undefined && (
          <>
            <TrendingUpIcon
              fontSize="small"
              color={trend >= 0 ? "success" : "error"}
              sx={{ transform: trend >= 0 ? 'none' : 'rotate(180deg)' }}
            />
            <Typography variant="body2" color={trend >= 0 ? "success.main" : "error.main"} fontWeight="bold">
              {trend >= 0 ? '+' : ''}{trend}%
            </Typography>
          </>
        )}
        <Typography variant="caption" color="text.secondary">
          {trendLabel || "from last month"}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StatCard;