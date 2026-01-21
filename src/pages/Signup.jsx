import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { toast } from 'react-toastify';
import api from '../api';

export default function SignUp() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password });
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error("Registration failed:", error); 
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (user) {
    return null;
  }

  return (
    <Container sx={{ maxWidth: '500px !important', my: 'auto' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Button
          startIcon={<KeyboardBackspaceIcon />}
          onClick={() => navigate('/')}
          size="small"
          sx={{ borderRadius: 2, mb: 4 }}
        >
          Back to Home
        </Button>
      </Box>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        Sign Up
      </Typography>
      <Box component="form" onSubmit={handleSignUp}>
        <TextField
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
          Sign Up
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Button color="primary" onClick={() => navigate('/login')}>
            Already have an account? Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}