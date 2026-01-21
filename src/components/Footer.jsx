import {
  Box,
  Container,
  Typography,
  Grid,
  Link as MuiLink
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FooterContainer = styled(Box)(({ theme }) => ({
  fontFamily: "'Roboto', sans-serif",
  background:
    theme.palette.mode === "dark"
      ? `linear-gradient(180deg, ${theme.palette.background.paper} 0%, #0c1221 100%)`
      : `linear-gradient(180deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.primary.contrastText,
  position: "relative",
  overflow: "hidden"
}));

const FooterWave = styled("svg")({
  backgroundColor: "transparent",
  display: "block",
  height: "30px",
  position: "relative",
  top: "-1px",
  width: "100%",
  "@media (min-width: 760px)": {
    height: "50px"
  }
});

const FooterWavePath = styled("path")(({ theme }) => ({
  fill: theme.palette.background.default
}));

const FooterContent = styled(Container)({
  padding: "40px 15px",
  position: "relative"
});

const FooterContentColumn = styled(Grid)({
  boxSizing: "border-box",
});

const FooterMenuName = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.primary.contrastText,
  fontSize: "15px",
  fontWeight: 900,
  letterSpacing: ".1em",
  lineHeight: "18px",
  textTransform: "uppercase",
  marginBottom: 0,
  marginTop: 0
}));

const FooterMenuList = styled("ul")(({ theme }) => ({
  listStyle: "none",
  marginBottom: 0,
  marginTop: "10px",
  paddingLeft: 0,
  "& li": {
    marginTop: "5px"
  },
  "& a": {
    color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : theme.palette.primary.contrastText,
    textDecoration: "none",
    opacity: 0.9,
    "&:hover": {
      opacity: 1,
      textDecoration: "underline"
    }
  }
}));

const FooterCallToActionButton = styled(MuiLink)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.dark,
  borderRadius: "21px",
  color: `${theme.palette.primary.contrastText} !important`,
  display: "inline-block",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: ".1em",
  lineHeight: "18px",
  padding: "12px 30px",
  margin: "10px 10px 10px 0",
  textDecoration: "none !important",
  textTransform: "uppercase",
  transition: "background-color .2s",
  cursor: "pointer",
  position: "relative",
  "&:hover": {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.text.primary
  }
}));

const FooterSocialLinksContainer = styled("div")(({ theme }) => ({
  position: "relative",
  marginTop: "30px",
  paddingBottom: "30px",
  [theme.breakpoints.up("md")]: {
    position: "absolute",
    bottom: "-10px",
    right: "60px",
    width: "236px",
    height: "54px"
  }
}));

const FooterSocialAmoebaSvg = styled("svg")(({ theme }) => ({
  height: "54px",
  left: -10,
  display: "none",
  position: "absolute",
  top: -9,
  width: "260px",
  path: {
    fill: theme.palette.mode === 'dark' ? "#0c1221" : theme.palette.primary.dark,
  },
  [theme.breakpoints.up("md")]: {
    display: "flex"
  }
}));

const SocialLink = styled("a")(({ theme }) => ({
  display: "block",
  top: "20px",
  left: "0",
  height: "30px",
  width: "30px",
  position: "absolute",
  ".hidden-link-text": {
    position: "absolute",
    clip: "rect(1px, 1px, 1px, 1px)",
    WebkitClipPath: "inset(0px 0px 99.9% 99.9%)",
    clipPath: "inset(0px 0px 99.9% 99.9%)",
    overflow: "hidden",
    height: "1px",
    width: "1px",
    padding: 0,
    border: 0
  },
  "& svg": {
    display: "block"
  },
  "& svg path": {
    fill: theme.palette.mode === "dark" ? theme.palette.text.primary : theme.palette.primary.contrastText,
    transition: "fill .2s"
  },
  "&:hover svg path": {
    fill: theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.text.primary
  }
}));


const FooterCopyright = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#0c1221" : theme.palette.primary.dark,
  color: theme.palette.primary.contrastText,
  padding: "15px 30px",
  textAlign: "center"
}));

const FooterCopyrightText = styled(Typography)(({ theme }) => ({
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: "18px",
  marginBottom: 0,
  marginTop: 0,
  opacity: 0.8,
  "& a": {
    color: "inherit",
    textDecoration: "none"
  },
  color: theme.palette.mode === "dark" ? theme.palette.text.primary : theme.palette.primary.contrastText
}));

const Footer = () => {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <FooterContainer>
      <FooterContent maxWidth="2xl">
        <Grid
          spacing={4}
          sx={{
            justifyContent: "space-between",
            display: "flex",
            flexWrap: "wrap",
            maxWidth: "80%",
            marginX: "auto",
            marginBottom: "30px",
            marginTop: "30px"
          }}
          container
        >
          <FooterContentColumn item sx={{ minWidth: "150px", maxWidth: "200px" }}>
            <Box><Typography variant="h6" component="h1" sx={{ fontWeight: "bold", mb: "20px" }}>
                <img src="/tms-logo.png" alt="Logo" width={140} height={60} />
            </Typography></Box>
            <Box>
              <FooterMenuName variant="h2">Get Started</FooterMenuName>
              <Typography sx={{ opacity: 0.8, color: 'inherit', mt: 2, fontSize: "0.9rem", lineHeight: 1.6 }}>
                Our comprehensive task management system helps teams collaborate
                efficiently and boost productivity.
              </Typography>
            </Box>
          </FooterContentColumn>
          <FooterContentColumn item sx={{ minWidth: "150px" }}>
            <Box><FooterMenuName variant="h2">Company</FooterMenuName>
              <FooterMenuList>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </FooterMenuList>
            </Box>
            <Box sx={{ marginTop: "30px" }}><FooterMenuName variant="h2">Legal</FooterMenuName>
              <FooterMenuList>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
              </FooterMenuList>
            </Box>
          </FooterContentColumn>
          <FooterContentColumn item sx={{ minWidth: "150px" }}>
            <Box><FooterMenuName variant="h2">Product</FooterMenuName>
              <FooterMenuList>
                <li><Link to="/learn-more">Features</Link></li>
                {user && (
                  <>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/tasks">Tasks</Link></li>
                    <li><Link to="/teams">Teams</Link></li>
                  </>
                )}
              </FooterMenuList>
            </Box>
          </FooterContentColumn>
          <FooterContentColumn item sx={{ minWidth: "150px" }}>
            <Box><FooterMenuName variant="h2">Let's Chat</FooterMenuName>
              <Typography sx={{ color: "inherit", opacity: 0.9, marginTop: "10px", marginBottom: "10px" }}>
                Have a support question?
              </Typography>
              <FooterCallToActionButton component={Link} to="/contact">Get in Touch</FooterCallToActionButton>
            </Box>
          </FooterContentColumn>
        </Grid>

        <FooterSocialLinksContainer>
          <FooterSocialAmoebaSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 236 54">
            <path d="M223.06,43.32c-.77-7.2,1.87-28.47-20-32.53C187.78,8,180.41,18,178.32,20.7s-5.63,10.1-4.07,16.7-.13,15.23-4.06,15.91-8.75-2.9-6.89-7S167.41,36,167.15,33a18.93,18.93,0,0,0-2.64-8.53c-3.44-5.5-8-11.19-19.12-11.19a21.64,21.64,0,0,0-18.31,9.18c-2.08,2.7-5.66,9.6-4.07,16.69s.64,14.32-6.11,13.9S108.35,46.5,112,36.54s-1.89-21.24-4-23.94S96.34,0,85.23,0,57.46,8.84,56.49,24.56s6.92,20.79,7,24.59c.07,2.75-6.43,4.16-12.92,2.38s-4-10.75-3.46-12.38c1.85-6.6-2-14-4.08-16.69a21.62,21.62,0,0,0-18.3-9.18C13.62,13.28,9.06,19,5.62,24.47A18.81,18.81,0,0,0,3,33a21.85,21.85,0,0,0,1.58,9.08,16.58,16.58,0,0,1,1.06,5A6.75,6.75,0,0,1,0,54H236C235.47,54,223.83,50.52,223.06,43.32Z" />
          </FooterSocialAmoebaSvg>
          <SocialLink href="#" target="_blank" sx={{left: "15px", top: "12px", width: "25px"}}><span className="hidden-link-text">Linkedin</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><path d="M9,25H4V10h5V25z M6.501,8C5.118,8,4,6.879,4,5.499S5.12,3,6.501,3C7.879,3,9,4.121,9,5.499C9,6.879,7.879,8,6.501,8z M27,25h-4.807v-7.3c0-1.741-0.033-3.98-2.499-3.98c-2.503,0-2.888,1.896-2.888,3.854V25H12V9.989h4.614v2.051h0.065 c0.642-1.18,2.211-2.424,4.551-2.424c4.87,0,5.77,3.109,5.77,7.151C27,16.767,27,25,27,25z" /></svg></SocialLink>
          <SocialLink href="#" target="_blank" sx={{left: "73px", top: "5px", width: "30px"}}><span className="hidden-link-text">Twitter</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><path d="M 25.855469 5.574219 C 24.914063 5.992188 23.902344 6.273438 22.839844 6.402344 C 23.921875 5.75 24.757813 4.722656 25.148438 3.496094 C 24.132813 4.097656 23.007813 4.535156 21.8125 4.769531 C 20.855469 3.75 19.492188 3.113281 17.980469 3.113281 C 15.082031 3.113281 12.730469 5.464844 12.730469 8.363281 C 12.730469 8.773438 12.777344 9.175781 12.867188 9.558594 C 8.503906 9.339844 4.636719 7.246094 2.046875 4.070313 C 1.59375 4.847656 1.335938 5.75 1.335938 6.714844 C 1.335938 8.535156 2.261719 10.140625 3.671875 11.082031 C 2.808594 11.054688 2 10.820313 1.292969 10.425781 C 1.292969 10.449219 1.292969 10.46875 1.292969 10.492188 C 1.292969 13.035156 3.101563 15.15625 5.503906 15.640625 C 5.0625 15.761719 4.601563 15.824219 4.121094 15.824219 C 3.78125 15.824219 3.453125 15.792969 3.132813 15.730469 C 3.800781 17.8125 5.738281 19.335938 8.035156 19.375 C 6.242188 20.785156 3.976563 21.621094 1.515625 21.621094 C 1.089844 21.621094 0.675781 21.597656 0.265625 21.550781 C 2.585938 23.039063 5.347656 23.90625 8.3125 23.90625 C 17.96875 23.90625 23.25 15.90625 23.25 8.972656 C 23.25 8.742188 23.246094 8.515625 23.234375 8.289063 C 24.261719 7.554688 25.152344 6.628906 25.855469 5.574219 " /></svg></SocialLink>
          <SocialLink href="#" target="_blank" sx={{left: "136px", top: "15px", width: "23px"}}><span className="hidden-link-text">Youtube</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><path d="M 15 4 C 10.814 4 5.3808594 5.0488281 5.3808594 5.0488281 L 5.3671875 5.0644531 C 3.4606632 5.3693645 2 7.0076245 2 9 L 2 15 L 2 15.001953 L 2 21 L 2 21.001953 A 4 4 0 0 0 5.3769531 24.945312 L 5.3808594 24.951172 C 5.3808594 24.951172 10.814 26.001953 15 26.001953 C 19.186 26.001953 24.619141 24.951172 24.619141 24.951172 L 24.621094 24.949219 A 4 4 0 0 0 28 21.001953 L 28 21 L 28 15.001953 L 28 15 L 28 9 A 4 4 0 0 0 24.623047 5.0546875 L 24.619141 5.0488281 C 24.619141 5.0488281 19.186 4 15 4 z M 12 10.398438 L 20 15 L 12 19.601562 L 12 10.398438 z" /></svg></SocialLink>
          <SocialLink href="#" target="_blank" sx={{left: "184px", top: "8px", width: "35px"}}><span className="hidden-link-text">Github</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M 16 4 C 9.371094 4 4 9.371094 4 16 C 4 21.300781 7.4375 25.800781 12.207031 27.386719 C 12.808594 27.496094 13.027344 27.128906 13.027344 26.808594 C 13.027344 26.523438 13.015625 25.769531 13.011719 24.769531 C 9.671875 25.492188 8.96875 23.160156 8.96875 23.160156 C 8.421875 21.773438 7.636719 21.402344 7.636719 21.402344 C 6.546875 20.660156 7.71875 20.675781 7.71875 20.675781 C 8.921875 20.761719 9.554688 21.910156 9.554688 21.910156 C 10.625 23.746094 12.363281 23.214844 13.046875 22.910156 C 13.15625 22.132813 13.46875 21.605469 13.808594 21.304688 C 11.144531 21.003906 8.34375 19.972656 8.34375 15.375 C 8.34375 14.0625 8.8125 12.992188 9.578125 12.152344 C 9.457031 11.851563 9.042969 10.628906 9.695313 8.976563 C 9.695313 8.976563 10.703125 8.65625 12.996094 10.207031 C 13.953125 9.941406 14.980469 9.808594 16 9.804688 C 17.019531 9.808594 18.046875 9.941406 19.003906 10.207031 C 21.296875 8.65625 22.300781 8.976563 22.300781 8.976563 C 22.957031 10.628906 22.546875 11.851563 22.421875 12.152344 C 23.191406 12.992188 23.652344 14.0625 23.652344 15.375 C 23.652344 19.984375 20.847656 20.996094 18.175781 21.296875 C 18.605469 21.664063 18.988281 22.398438 18.988281 23.515625 C 18.988281 25.121094 18.976563 26.414063 18.976563 26.808594 C 18.976563 27.128906 19.191406 27.503906 19.800781 27.386719 C 24.566406 25.796875 28 21.300781 28 16 C 28 9.371094 22.628906 4 16 4 Z" /></svg></SocialLink>
        </FooterSocialLinksContainer>
      </FooterContent>
      <FooterCopyright>
        <FooterCopyrightText>
          {new Date().getFullYear()}. Designed By: Sahil Gadhiya. All rights reserved.
        </FooterCopyrightText>
      </FooterCopyright>
    </FooterContainer>
  );
};

export default Footer;
