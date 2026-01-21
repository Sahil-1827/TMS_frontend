import React from 'react';
import { Chip, useTheme, alpha } from '@mui/material';

const StatusBadge = ({ status, size = 'medium' }) => {
    const theme = useTheme();

    const getStatusStyle = (status) => {
        const normalizedStatus = status?.toLowerCase() || '';

        switch (normalizedStatus) {
            case 'done':
            case 'completed':
            case 'paid':
                return {
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    borderColor: alpha(theme.palette.success.main, 0.2),
                };
            case 'in progress':
            case 'negotiating':
            case 'medium':
                return {
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                    borderColor: alpha(theme.palette.warning.main, 0.2),
                };
            case 'to do':
            case 'pending':
                return {
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    borderColor: alpha(theme.palette.info.main, 0.2),
                };
            case 'failed':
            case 'high':
                return {
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main,
                    borderColor: alpha(theme.palette.error.main, 0.2),
                };
            case 'overdue':
            case 'low':
                return {
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.main,
                    borderColor: alpha(theme.palette.secondary.main, 0.2),
                };
            default:
                return {
                    bgcolor: alpha(theme.palette.grey[500], 0.1),
                    color: theme.palette.text.primary,
                    borderColor: alpha(theme.palette.grey[500], 0.2),
                };
        }
    };

    const styles = getStatusStyle(status);

    return (
        <Chip
            label={status}
            size={size}
            sx={{
                ...styles,
                fontWeight: 600,
                borderRadius: '8px',
                border: '0px solid',
                textTransform: 'uppercase',
                height: size === 'small' ? 24 : 32,
                fontSize: size === 'small' ? '0.75rem' : '0.8125rem',
                '& .MuiChip-label': {
                    px: 2
                }
            }}
        />
    );
};

export default StatusBadge;
