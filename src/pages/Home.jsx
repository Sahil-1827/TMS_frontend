import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ListChecks from "@mui/icons-material/FormatListBulleted";
import Users from "@mui/icons-material/Group";
import Bell from "@mui/icons-material/NotificationsActive";
import Clock from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: "10px 20px",
  textTransform: "none",
  fontWeight: 700,
  fontSize: "1rem",
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  padding: theme.spacing(3),
  height: "100%",
}));

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Container maxWidth="2xl" sx={{ py: { xs: 4, md: 4 } }}>
      <Box
        sx={{
          position: "relative",
          borderRadius: { xs: 0, sm: 4 },
          p: { xs: 3, sm: 6 },
          minHeight: { xs: "360px", md: "480px" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 3,
          color: "common.white",
          overflow: "hidden",
        }}
      >
        <img
          src="/task-manager-landing-1.png"
          alt="Workflow"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: theme.palette.mode === 'light' ? 0.3 : 0.5
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        />
        <Box sx={{ maxWidth: "md", zIndex: 2, position: 'relative' }}>
          <Typography
            variant="h2"
            sx={{ fontWeight: 900, mb: 2, color: theme.palette.primary.main }}
          >
            Streamline Your Workflow with Task Management System
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.secondary.main, fontSize: "1.2rem", fontWeight: 700 }}
          >
            Manage tasks, assign team members, track progress, and boost
            productivity with our intuitive task management system.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            zIndex: 2,
            position: 'relative'
          }}
        >
          <StyledButton
            variant="contained"
            color="primary"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </StyledButton>
          <StyledButton
            variant="contained"
            color="secondary"
            onClick={() => navigate("/learn-more")}
          >
            Learn More
          </StyledButton>
        </Box>
      </Box>

      <Box sx={{ py: 8 }}>
        <Typography
          variant="h3"
          sx={{ mb: 2, fontWeight: 700, textAlign: "center" }}
        >
          Key Features
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 5, textAlign: "center", maxWidth: "md", mx: "auto" }}
        >
          Task Management System offers a comprehensive suite of tools designed to enhance
          team collaboration and productivity.
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              icon: <ListChecks sx={{ fontSize: 40 }} color="primary" />,
              title: "Task Management",
              description:
                "Easily create, assign, and organize tasks with detailed descriptions and deadlines.",
            },
            {
              icon: <Users sx={{ fontSize: 40 }} color="primary" />,
              title: "Team Collaboration",
              description:
                "Assign tasks to team members, set roles, and manage permissions for seamless teamwork.",
            },
            {
              icon: <Bell sx={{ fontSize: 40 }} color="primary" />,
              title: "Real-Time Notifications",
              description:
                "Stay updated with instant notifications on task assignments, updates, and deadlines.",
            },
            {
              icon: <Clock sx={{ fontSize: 40 }} color="primary" />,
              title: "Progress Tracking",
              description:
                "Monitor task completion, track progress, and identify bottlenecks to keep projects on schedule.",
            },
          ].map((feature) => (
            <Grid item sx={{ minWidth: "150px" }} key={feature.title}>
              <FeatureCard>
                {feature.icon}
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          textAlign: "center",
          py: 8,
          bgcolor: "background.paper",
          borderRadius: 4,
        }}
      >
        <Typography variant="h3" sx={{ mb: 2 }}>
          Ready to Transform Your Productivity?
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, maxWidth: "md", mx: "auto" }}
        >
          Join thousands of teams already using Task Management System to achieve their
          goals more efficiently.
        </Typography>
        {user ? (
          <StyledButton
            variant="contained"
            color="primary"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </StyledButton>
        ) : (
          <StyledButton
            variant="contained"
            color="primary"
            onClick={() => navigate("/signup")}
          >
            Sign Up Now
          </StyledButton>
        )}
      </Box>
    </Container>
  );
}
