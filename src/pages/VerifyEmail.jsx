import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, CircularProgress, Container, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import api from '../api';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token provided.');
            return;
        }

        const verify = async () => {
            try {
                const response = await api.post('/auth/verify-email', { token });
                const { token: authToken, user } = response.data;

                if (authToken && user) {
                    localStorage.setItem("token", authToken);
                    localStorage.setItem("user", JSON.stringify(user));
                }

                setStatus('success');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);

            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. Link may be invalid or expired.');
            }
        };

        verify();
    }, [token]);

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', width: '100%', borderRadius: 2 }}>
                {status === 'verifying' && (
                    <Box>
                        <CircularProgress size={60} sx={{ mb: 2 }} />
                        <Typography variant="h5">Verifying your email...</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>Please wait while we verify your account.</Typography>
                    </Box>
                )}

                {status === 'success' && (
                    <Box>
                        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                        <Typography variant="h4" gutterBottom>Verified!</Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Your email has been successfully verified. Redirecting you to the dashboard...
                        </Typography>
                    </Box>
                )}

                {status === 'error' && (
                    <Box>
                        <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
                        <Typography variant="h4" gutterBottom>Verification Failed</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            {message}
                        </Typography>
                        <Button variant="outlined" color="primary" onClick={() => navigate('/login')}>
                            Back to Login
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default VerifyEmail;
