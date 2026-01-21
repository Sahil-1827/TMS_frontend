import InfoPageLayout from '../components/InfoPageLayout';
import { Typography } from '@mui/material';

export default function PrivacyPolicyPage() {
  return (
    <InfoPageLayout title="Privacy Policy">
      <Typography paragraph>
        Your privacy is important to us. It is Task Management System's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.
      </Typography>
      <Typography variant="h3" component="h2">1. Information we collect</Typography>
      <Typography paragraph>
        We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
      </Typography>
      <Typography variant="h3" component="h2">2. How we use your information</Typography>
      <Typography paragraph>
        We use the information we collect in various ways, including to: provide, operate, and maintain our website; improve, personalize, and expand our website; understand and analyze how you use our website; develop new products, services, features, and functionality.
      </Typography>
      <Typography variant="h3" component="h2">3. Security</Typography>
      <Typography paragraph>
        We are committed to protecting your personal information and have implemented appropriate technical and organizational security measures to protect it from unauthorized access, disclosure, alteration, and destruction.
      </Typography>
    </InfoPageLayout>
  );
}
