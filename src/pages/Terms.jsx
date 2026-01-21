import InfoPageLayout from '../components/InfoPageLayout';
import { Typography } from '@mui/material';

export default function TermsOfServicePage() {
  return (
    <InfoPageLayout title="Terms of Service">
      <Typography paragraph>
        By accessing the website at Task Management System, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
      </Typography>
      <Typography variant="h3" component="h2">1. Use License</Typography>
      <Typography paragraph>
        Permission is granted to temporarily download one copy of the materials (information or software) on Task Management System's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
      </Typography>
      <Typography variant="h3" component="h2">2. Disclaimer</Typography>
      <Typography paragraph>
        The materials on Task Management System's website are provided on an 'as is' basis. Task Management System makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
      </Typography>
      <Typography variant="h3" component="h2">3. Limitations</Typography>
      <Typography paragraph>
        In no event shall Task Management System or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Task Management System's website.
      </Typography>
    </InfoPageLayout>
  );
}
