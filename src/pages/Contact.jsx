import InfoPageLayout from '../components/InfoPageLayout';
import {
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Paper,
  Stack
} from '@mui/material';

export default function ContactPage() {
  return (
    <InfoPageLayout title="Contact Us">
      <Typography paragraph color="text.secondary">
        We'd love to hear from you! Whether you have a question about features,
        pricing, or anything else, our team is ready to answer.
      </Typography>

        <Box component="form" noValidate autoComplete="off">
          <Stack spacing={3}>
            <TextField
              label="Your Name"
              fullWidth
              required
            />

            <TextField
              label="Your Email"
              type="email"
              fullWidth
              required
            />

            <TextField
              label="Your Message"
              multiline
              rows={4}
              fullWidth
              required
            />

            <Button
              variant="contained"
              size="large"
              sx={{ alignSelf: 'center', px: 5 }}
            >
              Send Message
            </Button>
          </Stack>
        </Box>
    </InfoPageLayout>
  );
}
