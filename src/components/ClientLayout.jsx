import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useLocation } from 'react-router-dom';
import { useGlobalLoader } from "../context/GlobalLoaderContext";
import GlobalLoader from "./GlobalLoader";
import { Box, AppBar, Toolbar, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const DRAWER_WIDTH = 260;
const MINI_DRAWER_WIDTH = 80;

export default function ClientLayout({ children }) {
  const { user, loading: authLoading, verifyUserStatus } = useAuth();
  const { isLoading: navIsLoading, setIsLoading: setNavIsLoading } = useGlobalLoader();
  const location = useLocation();
  const pathname = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    if (navIsLoading) {
      setNavIsLoading(false);
    }
    if (user) {
      verifyUserStatus();
    }
  }, [pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopToggle = () => {
    setDesktopOpen(!desktopOpen);
  };

  const isAppLoading = authLoading || navIsLoading;
  const isLoginPage = pathname === "/login" || pathname === "/signup";

  const showSidebar = !isLoginPage && !authLoading && user;
  const showNavBar = !isLoginPage && !authLoading && !user;
  const currentSidebarWidth = desktopOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH;
  const mainContentStyle = {
    flexGrow: 1,
    p: showSidebar ? { xs: 0, sm: 0 } : 0,
    width: showSidebar
      ? { xs: '100%', lg: `calc(100% - ${currentSidebarWidth}px)` }
      : '100%',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    mt: (showNavBar || (showSidebar && !isDesktop)) ? '64px' : 0,
    filter: navIsLoading ? 'blur(4px)' : 'none',
    visibility: authLoading ? 'hidden' : 'visible',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: showSidebar ? 'row' : 'column',
      minHeight: '100vh',
      bgcolor: 'var(--background)'
    }}>
      {isAppLoading && <GlobalLoader />}

      {showSidebar && (
        <>
          <Box
            component="nav"
            sx={{
              width: { lg: currentSidebarWidth },
              flexShrink: { lg: 0 },
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }}
          >
            <Sidebar
              mobileOpen={mobileOpen}
              handleDrawerToggle={handleDrawerToggle}
              desktopOpen={desktopOpen}
              handleDesktopToggle={handleDesktopToggle}
              drawerWidth={DRAWER_WIDTH}
              miniDrawerWidth={MINI_DRAWER_WIDTH}
            />
          </Box>

          <AppBar
            position="fixed"
            elevation={0}
            sx={{
              width: { lg: `calc(100% - ${currentSidebarWidth}px)` },
              ml: { lg: `${currentSidebarWidth}px` },
              display: { lg: 'none' },
              bgcolor: 'background.default',
              color: 'text.primary',
              borderBottom: '1px solid',
              borderColor: 'divider',
              backdropFilter: 'blur(8px)',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', fontSize: {xs: '1rem', sm: '1.2rem'}, display: 'flex', alignItems: 'center', gap: 1 }}>
               <img src="/tms-logo-small.png" alt="Logo" width={40} height={40} /> Task Management System
              </Typography>
            </Toolbar>
          </AppBar>
        </>
      )}

      {showNavBar && (
        <NavBar />
      )}

      <Box
        component="main"
        sx={mainContentStyle}
      >
        {children}
      </Box>

      {showNavBar && <Footer />}
    </Box>
  );
}
