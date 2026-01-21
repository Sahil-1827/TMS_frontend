import InfoPageLayout from '../components/InfoPageLayout';
import { Typography } from '@mui/material';

export default function AboutPage() {
  return (
    <InfoPageLayout title="About Us">
      <Typography paragraph>
        Welcome to Task Management System, your ultimate solution for streamlined task and project management. Our mission is to empower teams to achieve their goals with clarity, efficiency, and collaboration. We believe that the right tools can transform the way people work, turning complex projects into manageable tasks and fostering a culture of productivity.
      </Typography>
      <Typography paragraph>
        Founded in 2025, Task Management System was born out of a desire to create a task management system that is both powerful and intuitive. Our team of developers, designers, and project managers have worked tirelessly to build a platform that addresses the real-world challenges faced by modern teams.
      </Typography>
      <Typography variant="h3" component="h2">Our Vision</Typography>
      <Typography paragraph>
        We envision a world where every team can work together seamlessly, no matter where they are. We are committed to continuous improvement, constantly innovating to bring you new features and enhancements that make your work life easier and more productive.
      </Typography>
    </InfoPageLayout>
  );
}
