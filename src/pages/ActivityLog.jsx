import { Container, Typography } from "@mui/material";
import ActivityLogList from "../components/ActivityLog/ActivityLogList";
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import { Stack } from "@mui/material";

export default function ActivityLogPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 1, sm: 2, md: 3 } }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center", display: "flex", alignItems: "center" }}>
          <RecentActorsIcon sx={{ mr: 1 }} fontSize="large" />
          Activity Log
        </Typography>
        <ActivityLogList />
      </Stack>
    </Container>
  );
}
