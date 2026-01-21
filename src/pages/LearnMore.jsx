import { Box, Container, Typography, Grid, Card, IconButton, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import ListBullets from '@mui/icons-material/FormatListBulleted';
import Calendar from '@mui/icons-material/CalendarToday';
import Users from '@mui/icons-material/Group';
import Bell from '@mui/icons-material/NotificationsActive';
import ChartLine from '@mui/icons-material/ShowChart';
import File from '@mui/icons-material/Description';
import Clock from '@mui/icons-material/AccessTime';
import UsersThree from '@mui/icons-material/Groups';
import ShieldCheck from '@mui/icons-material/Security';
import Money from '@mui/icons-material/AttachMoney';
import Smiley from '@mui/icons-material/SentimentSatisfiedAlt';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const FeatureCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '16px',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  backgroundColor: theme.palette.background.paper,
}));

export default function LearnMore() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="2xl" sx={{ py: 5, flex: 1 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>

        {/* Key Features Section */}
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          Key Features
        </Typography>

        <Box sx={{ mb: 10 }}>
          <Typography variant="h2" sx={{ mb: 2, fontWeight: 'bold', maxWidth: 720 }}>
            Powerful Features to Boost Your Productivity
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 720 }}>
            Task Management System offers a comprehensive suite of features designed to help you manage your tasks and projects effectively.
          </Typography>

          <Grid container spacing={3}>
            {[
              { icon: <ListBullets />, title: 'Task Management', description: 'Create, assign, and organize tasks efficiently.' },
              { icon: <Calendar />, title: 'Scheduling & Deadlines', description: 'Set deadlines and schedule tasks with ease.' },
              { icon: <Users />, title: 'Team Collaboration', description: 'Collaborate with your team in real-time.' },
              { icon: <Bell />, title: 'Notifications & Reminders', description: 'Stay on top of your tasks with timely notifications.' },
              { icon: <ChartLine />, title: 'Progress Tracking', description: 'Monitor progress and identify bottlenecks.' },
              { icon: <File />, title: 'File Sharing', description: 'Share files and documents seamlessly.' }
            ].map((feature, index) => (
              <Grid item sx={{ minWidth: "150px" }} key={index}>
                <FeatureCard>
                  <IconButton sx={{ alignSelf: 'flex-start', color: 'text.primary' }}>
                    {feature.icon}
                  </IconButton>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
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

        {/* Benefits Section */}
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          Benefits of Using Task Management System
        </Typography>

        <Box sx={{ mb: 10 }}>
          <Typography variant="h2" sx={{ mb: 2, fontWeight: 'bold', maxWidth: 720 }}>
            Experience the Difference with Task Management System
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 720 }}>
            Task Management System empowers teams to work smarter, not harder, by providing the tools they need to succeed.
          </Typography>

          <Grid container spacing={3}>
            {[
              { icon: <Clock />, title: 'Increased Efficiency', description: 'Streamline your workflow and save time on task management.' },
              { icon: <UsersThree />, title: 'Improved Teamwork', description: 'Foster better communication and collaboration within your team.' },
              { icon: <ChartLine />, title: 'Enhanced Productivity', description: 'Achieve more in less time with our intuitive tools.' },
              { icon: <ShieldCheck />, title: 'Secure & Reliable', description: 'Your data is safe and secure with our robust security measures.' },
              { icon: <Money />, title: 'Cost-Effective', description: 'Affordable pricing plans to suit your needs.' },
              { icon: <Smiley />, title: 'User-Friendly Interface', description: 'Easy to learn and use, even for beginners.' }
            ].map((benefit, index) => (
              <Grid item sx={{ minWidth: "150px" }} key={index}>
                <FeatureCard>
                  <IconButton sx={{ alignSelf: 'flex-start', color: 'text.primary' }}>
                    {benefit.icon}
                  </IconButton>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </Box>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
