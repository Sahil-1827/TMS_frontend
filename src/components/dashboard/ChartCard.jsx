import { Paper, Typography, Box, Skeleton, useTheme, alpha } from '@mui/material';

const ChartCard = ({ title, children, loading, action, chartType = 'bar', className, sx, ...other }) => {
    const theme = useTheme();

    const renderSkeleton = () => {
        if (chartType === 'doughnut' || chartType === 'pie' || chartType === 'polarArea') {
            return (
                <Box>
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Skeleton variant="circular" width={230} height={230} animation="wave" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 3 }}>
                        {[1, 2, 3].map((item) => (
                            <Box
                                key={item}
                                sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                            >
                                <Skeleton variant="circular" width={10} height={10} />
                                <Skeleton variant="text" width={40} />
                            </Box>
                        ))}
                    </Box>
                </Box>
            );
        }

        if (chartType === 'line') {
            return (
                <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', px: 2, pb: 2, justifyContent: 'flex-end', position: 'relative' }}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        transform: 'translateY(-50%)',
                        px: 2
                    }}>
                        <Skeleton variant="rectangular" height={2} width="100%" sx={{ mb: 4 }} />
                        <Skeleton variant="rectangular" height={2} width="100%" sx={{ mb: 4 }} />
                        <Skeleton variant="rectangular" height={2} width="100%" sx={{ mb: 4 }} />
                    </Box>
                    <Skeleton variant="rectangular" height={100} width="100%" sx={{ clipPath: 'polygon(0 100%, 20% 60%, 40% 80%, 60% 40%, 80% 70%, 100% 20%, 100% 100%)', opacity: 0.2 }} animation="wave" />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} variant="text" width={40} />)}
                    </Box>
                </Box>
            );
        }

        if (chartType === 'horizontalBar') {
            return (
                <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', px: 2, py: 1 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <Skeleton variant="text" width={60} />
                            <Skeleton
                                variant="rectangular"
                                width={`${Math.random() * (90 - 40) + 40}%`}
                                height={24}
                                sx={{ borderRadius: 1 }}
                                animation="wave"
                            />
                        </Box>
                    ))}
                </Box>
            );
        }

        if (chartType === 'combo') {
            return (
                <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', px: 2, pb: 2, position: 'relative' }}>
                    {/* Fake Legend and Title */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, gap: 3 }}>
                        <Skeleton variant="text" width={80} />
                        <Skeleton variant="text" width={80} />
                    </Box>
                    <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'flex-end', justifyContent: 'space-around', position: 'relative' }}>
                        {/* Bars */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '15%', height: '100%', justifyContent: 'flex-end' }}>
                                <Skeleton
                                    variant="rectangular"
                                    width="100%"
                                    height={`${Math.random() * (70 - 30) + 30}%`}
                                    sx={{ borderRadius: 1 }}
                                    animation="wave"
                                />
                            </Box>
                        ))}
                        {/* Fake data points for Line */}
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', pointerEvents: 'none' }}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton
                                    key={`dot-${i}`}
                                    variant="circular"
                                    width={12}
                                    height={12}
                                    sx={{
                                        mb: `${Math.random() * (80 - 40) + 40}%`,
                                        bgcolor: theme.palette.success.light,
                                        opacity: 0.6
                                    }}
                                    animation="pulse"
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            );
        }

        return (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', px: 2, pb: 4 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton
                        key={i}
                        variant="rectangular"
                        width="15%"
                        height={`${Math.random() * (85 - 40) + 40}%`}
                        sx={{ borderRadius: 1.5 }}
                        animation="wave"
                    />
                ))}
            </Box>
        );
    }

    return (
        <Paper
            className={className}
            sx={[{
                p: 3,
                height: '100%',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: theme.palette.mode === 'dark',
                overflow: 'hidden',
                position: 'relative'
            }, ...(Array.isArray(sx) ? sx : [sx])]}
            elevation={0}
            {...other}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                    {title}
                </Typography>
                {action && <Box>{action}</Box>}
            </Box>

            {/* Content */}
            <Box sx={{ flexGrow: 1, position: 'relative', minHeight: 250 }}>
                {loading ? (
                    renderSkeleton()
                ) : (
                    children
                )}
            </Box>

            {/* Background Decoration (optional) */}
            <>
                <Box
                    sx={{
                        position: 'absolute',
                        top: -60,
                        right: -60,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                        zIndex: 0,
                        pointerEvents: 'none',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: -30,
                        left: -30,
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                        zIndex: 0,
                        pointerEvents: 'none',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: -30,
                        left: -30,
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        zIndex: 0,
                        pointerEvents: 'none',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -60,
                        right: -60,
                        width: 170,
                        height: 170,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.03),
                        zIndex: 0,
                        pointerEvents: 'none',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -30,
                        right: -30,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        zIndex: 0,
                        pointerEvents: 'none',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -30,
                        left: -30,
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.09),
                        zIndex: 0,
                        pointerEvents: 'none',
                    }}
                />
            </>

        </Paper>
    );
};

export default ChartCard;
