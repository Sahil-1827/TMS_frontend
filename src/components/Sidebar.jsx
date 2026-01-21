import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useGlobalLoader } from "../context/GlobalLoaderContext";
import { useNotifications } from "../context/NotificationContext";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Drawer,
    IconButton,
    Avatar,
    Divider,
    useMediaQuery,
    Tooltip,
    Badge,
    Chip,
    Button,
    Stack
} from "@mui/material";
import { useTheme as useMuiTheme, styled } from "@mui/material/styles";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupsIcon from "@mui/icons-material/Groups";
import PeopleIcon from "@mui/icons-material/People";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CircleIcon from '@mui/icons-material/Circle';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';

const OpenedMixin = (theme, drawerWidth) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    boxShadow: "none",
    borderRight: "1px dashed rgba(145, 158, 171, 0.24)",
});

const ClosedMixin = (theme, miniDrawerWidth) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: miniDrawerWidth,
    borderRight: "1px dashed rgba(145, 158, 171, 0.24)",
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(0, 2),
    height: 80,
}));

export default function Sidebar({
    mobileOpen,
    handleDrawerToggle,
    desktopOpen,
    handleDesktopToggle,
    drawerWidth,
    miniDrawerWidth,
}) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const { mode, toggleTheme } = useTheme();
    const { setIsLoading } = useGlobalLoader();
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down("lg"));

    const { notifications, unreadCount, markAsRead, markAllAsRead, clearAllNotifications } = useNotifications();

    const [view, setView] = useState('menu');

    const handleNavigation = (path) => {
        if (pathname !== path) {
            setIsLoading(true);
        }
        navigate(path);
        if (isMobile) {
            handleDrawerToggle();
        }
    };

    const handleLogout = () => {
        setIsLoading(true);
        logout();
    };

    const handleSwitchToNotifications = () => {
        if (!desktopOpen && !isMobile) {
            handleDesktopToggle();
        }
        setView('notifications');
    };

    const handleBackToMenu = () => {
        setView('menu');
    };

    const formatTime = (timestamp) => {
        const now = new Date();
        const notifTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    const menuGroups = [
        {
            id: "dashboard",
            title: "Dashboard",
            items: [
                { label: "Dashboard", path: "/dashboard", icon: <DashboardRoundedIcon /> },
                { label: "Board", path: "/board", icon: <ViewKanbanIcon /> },
            ],
        },
        {
            id: "pages",
            title: "Pages",
            items: [
                { label: "Tasks", path: "/tasks", icon: <AssignmentIcon /> },
                { label: "Teams", path: "/teams", icon: <GroupsIcon /> },
            ],
        },
        {
            id: "activity",
            title: "Activity Log",
            items: [
                { label: "Activity Log", path: "/activity-log", icon: <HistoryIcon /> },
            ],
        },
    ];

    if (user?.role === "admin" || user?.role === "manager") {
        menuGroups.push({
            id: "admin",
            title: "Management",
            items: [
                { label: "Users", path: "/users", icon: <PeopleIcon /> },
            ],
        });
    }

    const renderMenuContent = () => (
        <>
            <Box sx={{ flexGrow: 1, overflowY: "auto", px: 2, pb: 2 }}>
                {menuGroups.map((group) => (
                    <Box key={group.id} sx={{ mb: 2 }}>
                        {(desktopOpen || isMobile) && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                fontWeight="bold"
                                sx={{ display: "block", mb: 1, mt: 1, ml: 1.5 }}
                            >
                                {group.title}
                            </Typography>
                        )}
                        <List disablePadding>
                            {group.items.map((item) => {
                                const isSelected = pathname === item.path;
                                return (
                                    <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                                        <Tooltip title={!desktopOpen && !isMobile ? item.label : ""} placement="right" arrow>
                                            <ListItemButton
                                                onClick={() => handleNavigation(item.path)}
                                                selected={isSelected}
                                                sx={{
                                                    minHeight: 44,
                                                    borderRadius: 1.5,
                                                    justifyContent: desktopOpen ? "initial" : "center",
                                                    px: 2,
                                                    color: isSelected ? "primary.main" : "text.secondary",
                                                    bgcolor: isSelected ? "primary.lighter" : "transparent",
                                                    "&.Mui-selected": {
                                                        bgcolor: "primary.light",
                                                        color: "primary.main",
                                                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(24, 144, 255, 0.12)' : '#e6f7ff',
                                                    },
                                                    "&:hover": {
                                                        bgcolor: (theme) => isSelected ? (theme.palette.mode === 'dark' ? 'rgba(24, 144, 255, 0.12)' : '#e6f7ff') : 'action.hover',
                                                    }
                                                }}
                                            >
                                                <ListItemIcon
                                                    sx={{
                                                        minWidth: 0,
                                                        mr: desktopOpen ? 2 : "auto",
                                                        justifyContent: "center",
                                                        color: isSelected ? "primary.main" : "inherit",
                                                    }}
                                                >
                                                    {item.icon}
                                                </ListItemIcon>
                                                {(desktopOpen || isMobile) && (
                                                    <ListItemText
                                                        primary={item.label}
                                                        primaryTypographyProps={{
                                                            variant: "body2",
                                                            fontWeight: isSelected ? 500 : 400,
                                                        }}
                                                    />
                                                )}
                                            </ListItemButton>
                                        </Tooltip>
                                    </ListItem>
                                );
                            })}
                        </List>
                        {(desktopOpen || isMobile) && <Divider sx={{ my: 1, borderStyle: 'dashed' }} />}
                    </Box>
                ))}
            </Box>

            <Box sx={{ p: 2 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: desktopOpen ? 'flex-start' : 'center',
                    gap: 1,
                    flexDirection: desktopOpen ? 'row' : 'column',
                }}>
                    <Tooltip title="Toggle Theme" placement={!desktopOpen ? 'right' : 'bottom'} arrow>
                        <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.secondary', border: '1px solid', borderColor: 'divider' }}>
                            {mode === "dark" ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Notifications" placement={!desktopOpen ? 'right' : 'bottom'} arrow>
                        <IconButton
                            onClick={handleSwitchToNotifications}
                            size="small"
                            sx={{ color: 'text.secondary', border: '1px solid', borderColor: 'divider' }}
                        >
                            <Badge badgeContent={unreadCount} color="error" variant="dot">
                                <NotificationsIcon fontSize="small" />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    {(!desktopOpen && !isMobile) && (
                        <Tooltip title="Logout" placement="right" arrow>
                            <IconButton
                                onClick={handleLogout}
                                size="small"
                                sx={{ color: 'text.secondary', border: '1px solid', borderColor: 'divider' }}
                            >
                                <LogoutIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </Box>
        </>
    );

    const renderNotificationsContent = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflowY: 'hidden' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={handleBackToMenu} size="small">
                    <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
                <Stack direction="row" alignItems="center" gap={1}>
                    <CircleNotificationsIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">Notifications</Typography>
                    {unreadCount > 0 && <Chip label={unreadCount} size="small" color="error" sx={{ ml: 'auto', height: 'auto' }} />}
                </Stack>
            </Box>

            <Box sx={{ px: 2, pb: 2, display: 'flex', gap: 1 }}>
                <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    startIcon={<MarkChatReadIcon />}
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                >
                    Mark read
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    fullWidth
                    startIcon={<DeleteSweepIcon />}
                    onClick={clearAllNotifications}
                    disabled={notifications.length === 0}
                    sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                >
                    Clear
                </Button>
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
                {notifications.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <NotificationsActiveIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            You're all caught up!
                        </Typography>
                    </Box>
                ) : (
                    notifications.map((notification) => (
                        <ListItemButton
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            alignItems="flex-start"
                            sx={{
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                bgcolor: notification.read ? 'transparent' : 'action.hover',
                                gap: 2,
                                py: 2
                            }}
                        >
                            <Badge
                                variant="dot"
                                color="primary"
                                invisible={notification.read}
                                sx={{
                                    '& .MuiBadge-badge': {
                                        top: 5,
                                        left: 6,
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        border: '2px solid #fff',
                                        boxShadow: '0 0 0 2px rgba(255,255,255,0.5)'
                                    }
                                }}
                                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                            >
                                <Avatar sx={{ bgcolor: notification.read ? 'action.disabledBackground' : 'primary.lighter', color: 'primary.main', width: 40, height: 40 }}>
                                    {notification.icon || <NotificationsIcon />}
                                </Avatar>
                            </Badge>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" fontWeight={notification.read ? 400 : 700} noWrap>
                                    {notification.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mt: 0.5,
                                        mb: 1,
                                        lineHeight: 1.4,
                                        whiteSpace: "normal",
                                        wordBreak: "break-word"
                                    }}
                                >
                                    {notification.message}
                                </Typography>
                                <Typography variant="caption" color="text.disabled">
                                    {formatTime(notification.timestamp)}
                                </Typography>
                            </Box>
                        </ListItemButton>
                    ))
                )}
            </List>
        </Box>
    );

    const drawerContent = (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.paper",
                color: "text.primary",
            }}
        >
            {view === 'menu' && (
                <DrawerHeader sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: desktopOpen ? "row" : "column", my: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, overflow: 'hidden' }}>
                        <Box sx={{
                            position: 'relative',
                            width: desktopOpen || isMobile ? 190 : 40,
                            height: 60,
                            transition: 'width 0.3s ease-in-out',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <Box
                                component="img"
                                src="/tms-logo.png"
                                alt="TMS"
                                sx={{
                                    position: 'absolute',
                                    left: 0,
                                    width: 190,
                                    height: 'auto',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    opacity: desktopOpen || isMobile ? 1 : 0,
                                    transition: 'opacity 0.3s ease-in-out',
                                    transitionDelay: desktopOpen || isMobile ? '0.1s' : '0s'
                                }}
                            />
                            <Box
                                component="img"
                                src="/tms-logo-small.png"
                                alt="TMS"
                                sx={{
                                    position: 'absolute',
                                    left: 0,
                                    width: 40,
                                    height: 'auto',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    opacity: desktopOpen || isMobile ? 0 : 1,
                                    transition: 'opacity 0.3s ease-in-out',
                                    transitionDelay: desktopOpen || isMobile ? '0s' : '0.1s'
                                }}
                            />
                        </Box>
                    </Box>
                    {!isMobile && (
                        <IconButton
                            onClick={handleDesktopToggle}
                            size="small"
                            sx={{
                                bgcolor: "action.hover",
                                borderRadius: 1,
                                border: "1px solid",
                                borderColor: "divider",
                                "&:hover": { bgcolor: "action.selected" },
                            }}
                        >
                            {/* <Tooltip title={desktopOpen ? "Collapse" : "Expand"} placement="right" arrow> */}
                            {desktopOpen ? <MenuOpenIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
                            {/* </Tooltip> */}
                        </IconButton>
                    )}
                </DrawerHeader>
            )}

            {view === 'menu' ? renderMenuContent() : renderNotificationsContent()}

            <Box sx={{ p: 2, borderTop: '1px dashed', borderColor: 'divider', mt: 'auto' }}>
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        justifyContent: desktopOpen ? 'flex-start' : 'center',
                        '&:hover': {
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                        }
                    }}
                    onClick={() => handleNavigation("/profile")}
                >
                    <Avatar
                        src={user?.profilePicture}
                        sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
                    >
                        {user?.name?.[0] || <AccountCircleIcon />}
                    </Avatar>

                    {(desktopOpen || isMobile) && (
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" noWrap fontWeight="bold">
                                {user?.name || "User"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap display="block">
                                {user?.role || "Member"}
                            </Typography>
                        </Box>
                    )}

                    {(desktopOpen || isMobile) && (
                        <Tooltip title="Logout" placement="right" arrow>
                            <IconButton size="small" onClick={(e) => {
                                e.stopPropagation();
                                handleLogout();
                            }}>
                                <LogoutIcon fontSize="small" color="action" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { lg: desktopOpen ? drawerWidth : miniDrawerWidth }, flexShrink: { lg: 0 } }}
        >
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", lg: "none" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                        backgroundImage: 'none',
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop Drawer (Persistent/Permanent) */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", lg: "block" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        whiteSpace: "nowrap",
                        ...(!desktopOpen && {
                            ...ClosedMixin(muiTheme, miniDrawerWidth),
                            "& .MuiDrawer-paper": ClosedMixin(muiTheme, miniDrawerWidth),
                        }),
                        ...(desktopOpen && {
                            ...OpenedMixin(muiTheme, drawerWidth),
                            "& .MuiDrawer-paper": OpenedMixin(muiTheme, drawerWidth),
                        }),
                    },
                }}
                open={desktopOpen}
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
}
