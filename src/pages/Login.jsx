import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { toast } from 'react-toastify';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

export default function Login() {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
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
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        Login
      </Typography>
      <Box component="form" onSubmit={handleLogin}>
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
          disabled={isSubmitting}
          endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          Login
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Button color="primary" onClick={() => navigate('/signup')}>
            Don't have an account? Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
