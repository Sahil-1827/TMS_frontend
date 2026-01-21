import { Box, Container, Typography, Button } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function InfoPageLayout({ title, children }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container component="main" maxWidth="md" sx={{ py: { xs: 4, md: 8 }, flex: 1 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>
        <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Box sx={{
          '& p': { mb: 2, lineHeight: 1.75, color: 'text.secondary' },
          '& h3': { mt: 4, mb: 2, fontWeight: 'bold' }
        }}>
            {children}
        </Box>
      </Container>
    </Box>
  );
}
