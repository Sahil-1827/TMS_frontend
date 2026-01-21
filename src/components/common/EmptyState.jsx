import { Box, Typography, Button, alpha, useTheme } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const EmptyState = ({
    title = "No Data Available",
    description = "There is no data to display at this time.",
    icon: Icon = InfoOutlinedIcon,
    action,
    height = '100%'
}) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: height,
                textAlign: 'center',
                p: 3,
                borderRadius: 2,
            }}
        >
            <Box
                sx={{
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Icon sx={{ fontSize: 40, opacity: 0.9 }} />
            </Box>

            <Typography variant="h6" fontWeight="bold" gutterBottom>
                {title}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mb: action ? 3 : 0 }}>
                {description}
            </Typography>

            {action && (
                <Box sx={{ mt: 2 }}>
                    {action}
                </Box>
            )}
        </Box>
    );
};

export default EmptyState;
