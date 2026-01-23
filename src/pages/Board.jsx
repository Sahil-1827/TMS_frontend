import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
    Box,
    Typography,
    Paper,
    Chip,
    Avatar,
    IconButton,
    Container,
    Grid,
    TextField,
    Button,
    InputAdornment,
    Divider,
    useTheme,
    alpha,
    AvatarGroup,
    Tooltip,
    List,
    ListItem,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    ClickAwayListener,
    useMediaQuery,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Stack,
} from '@mui/material';
import {
    Add as AddIcon,
    ChatBubbleOutline as CommentIcon,
    Link as LinkIcon,
    DeleteOutline as DeleteIcon,
    Send as SendIcon,
    Launch as LaunchIcon,
    Person as PersonIcon,
    CheckCircleOutline as CheckCircleIcon,
    Schedule as ClockIcon,
    ListAlt as ListIcon,
    Close as CloseIcon,
    FlagOutlined as FlagIcon,
    MoreHoriz as MoreHorizIcon,
    Reply as ReplyIcon,
    PushPin as PushPinIcon,
    PushPinOutlined as PushPinOutlinedIcon,
    KeyboardArrowDown as ArrowDownIcon,
    Block as BlockIcon,
    Groups as GroupsIcon,
    ViewModule as BoardViewIcon,
    TableRows as TableViewIcon,
    Assignment as TaskIcon,
    Assignment as AssignmentIcon,
    Timeline as TimelineIcon,
    Error as ErrorIcon,
    Today as TodayIcon
} from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TaskFormDialog from '../components/tasks/TaskFormDialog';
import { Menu, MenuItem, CircularProgress, Skeleton } from '@mui/material';
import Offcanvas, { OffcanvasHeader, OffcanvasBody, OffcanvasFooter } from '../components/common/Offcanvas';
import EmptyState from '../components/common/EmptyState';
import StatusBadge from '../components/common/StatusBadge';
import api from '../api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const ENDPOINT = import.meta.env.VITE_SOCKET_URL;

const Board = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [tasks, setTasks] = useState({
        'To Do': [],
        'In Progress': [],
        'Done': []
    });
    const [activeTab, setActiveTab] = useState('To Do');
    const [allTasksList, setAllTasksList] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedComment, setSelectedComment] = useState(null);
    const [highlightedCommentId, setHighlightedCommentId] = useState(null);
    const [activePinIndex, setActivePinIndex] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [newLinkTitle, setNewLinkTitle] = useState('');
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [mentionQuery, setMentionQuery] = useState(null);
    const [mentionCursorPos, setMentionCursorPos] = useState(null);
    const [taskMenuAnchorEl, setTaskMenuAnchorEl] = useState(null);
    const [activeMenuTask, setActiveMenuTask] = useState(null);
    const [isCommentLoading, setIsCommentLoading] = useState(false);
    const [isLinkLoading, setIsLinkLoading] = useState(false);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [viewMode, setViewMode] = useState('board');
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [openTaskDialog, setOpenTaskDialog] = useState(false);
    const [socket, setSocket] = useState(null);

    const allTasksListRef = useRef(allTasksList);
    const selectedTaskRef = useRef(selectedTask);

    useEffect(() => {
        allTasksListRef.current = allTasksList;
        selectedTaskRef.current = selectedTask;
    }, [allTasksList, selectedTask]);

    const inputRef = useRef(null);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        const newSocket = io(ENDPOINT);
        setSocket(newSocket);

        if (user?._id) {
            newSocket.emit("join", user?._id);
        }

        fetchTasks();
        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [comments, selectedTask]);

    useEffect(() => {
        if (!selectedTask?._id) {
            setComments([]);
            return;
        }

        const fetchComments = async () => {
            setIsLoadingComments(true);
            try {
                const res = await api.get(`/comments/task/${selectedTask?._id}`);
                setComments(res.data);
            } catch (error) {
                console.error("Failed to fetch comments", error);
            } finally {
                setIsLoadingComments(false);
            }
        };

        fetchComments();

        if (!socket) return;

        socket.emit("joinTask", selectedTask?._id);

        const handleCommentAdded = (newComment) => {
            const currentSelectedTask = selectedTaskRef.current;
            if (currentSelectedTask && newComment.task === currentSelectedTask._id) {
                setComments(prev => {
                    if (prev.some(c => c._id === newComment._id)) return prev;
                    return [...prev, newComment];
                });
                const updatedTask = {
                    ...currentSelectedTask,
                    commentCount: (currentSelectedTask.commentCount || 0) + 1
                };
                updateLocalTask(updatedTask);
            }
        };

        const handleCommentDeleted = (commentId) => {
            setComments(prev => prev.filter(c => c._id !== commentId));
            const currentSelectedTask = selectedTaskRef.current;
            if (currentSelectedTask) {
                const updatedTask = {
                    ...currentSelectedTask,
                    commentCount: Math.max(0, (currentSelectedTask.commentCount || 1) - 1)
                };
                updateLocalTask(updatedTask);
            }
        };

        const handleCommentUpdated = (updatedComment) => {
            setComments(prev => prev.map(c => c._id === updatedComment._id ? updatedComment : c));
        };

        socket.on("commentAdded", handleCommentAdded);
        socket.on("commentDeleted", handleCommentDeleted);
        socket.on("commentUpdated", handleCommentUpdated);

        return () => {
            if (selectedTaskRef.current) {
                socket.emit("leaveTask", selectedTaskRef.current._id);
            }
            socket.off("commentAdded", handleCommentAdded);
            socket.off("commentDeleted", handleCommentDeleted);
            socket.off("commentUpdated", handleCommentUpdated);
        };

    }, [selectedTask?._id, socket]);

    const scrollToMessage = (commentId) => {
        const element = document.getElementById(`comment-${commentId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHighlightedCommentId(commentId);
            setTimeout(() => setHighlightedCommentId(null), 2000);
        }
    };

    const handlePinHeaderClick = () => {
        const pinnedComments = comments.filter(c => c.isPinned);
        if (pinnedComments.length === 0) return;

        const nextIndex = (activePinIndex + 1) % pinnedComments.length;
        setActivePinIndex(nextIndex);
        scrollToMessage(pinnedComments[nextIndex]._id);
    };

    const fetchTasks = async () => {
        setIsLoadingTasks(true);
        try {
            const [tasksRes, usersRes, teamsRes] = await Promise.all([
                api.get('/tasks?limit=100'),
                api.get('/users'),
                api.get('/teams')
            ]);

            setUsers(usersRes.data);
            setTeams(teamsRes.data.teams || teamsRes.data);

            setAllTasksList(tasksRes.data.tasks);
            const newTasks = { 'To Do': [], 'In Progress': [], 'Done': [] };
            tasksRes.data.tasks.forEach(task => {
                if (newTasks[task.status]) newTasks[task.status].push(task);
            });
            setTasks(newTasks);
        } catch (error) {
            toast.error('Failed to load board data');
        } finally {
            setIsLoadingTasks(false);
        }
    };

    const updateLocalTask = (updatedTask) => {
        const currentAllTasks = allTasksListRef.current;
        const updatedList = currentAllTasks.map(t => t._id === updatedTask._id ? updatedTask : t);
        setAllTasksList(updatedList);

        const newTasks = { 'To Do': [], 'In Progress': [], 'Done': [] };
        updatedList.forEach(task => {
            if (newTasks[task.status]) newTasks[task.status].push(task);
        });
        setTasks(newTasks);

        if (selectedTaskRef.current && selectedTaskRef.current._id === updatedTask._id) {
            setSelectedTask(prev => ({ ...prev, ...updatedTask }));
        }
    };

    const onDragEnd = async (result) => {
        if (user?.role === 'admin') return;

        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const sourceColumn = tasks[source.droppableId];
        const destColumn = tasks[destination.droppableId];
        const taskToMove = sourceColumn.find(t => t._id === draggableId);

        const newSourceColumn = Array.from(sourceColumn);
        newSourceColumn.splice(source.index, 1);

        const newDestColumn = Array.from(destColumn);
        let updatedTask = { ...taskToMove, status: destination.droppableId };

        if (source.droppableId === destination.droppableId) {
            newDestColumn.splice(source.index, 1);
            newDestColumn.splice(destination.index, 0, updatedTask);
            setTasks({ ...tasks, [source.droppableId]: newDestColumn });
        } else {
            newDestColumn.splice(destination.index, 0, updatedTask);
            setTasks({
                ...tasks,
                [source.droppableId]: newSourceColumn,
                [destination.droppableId]: newDestColumn
            });
        }

        try {
            await api.put(`/tasks/${draggableId}`, { status: destination.droppableId });
            toast.success(`Moved to ${destination.droppableId}`);
            updateLocalTask(updatedTask);
        } catch (error) {
            toast.error('Failed to update status');
            fetchTasks();
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !selectedTask) return;

        setIsCommentLoading(true);
        try {
            const res = await api.post('/comments', {
                text: newComment,
                taskId: selectedTask._id,
                replyTo: replyingTo?._id
            });

            setReplyingTo(null);

            setComments(prev => {
                if (prev.some(c => c._id === res.data._id)) return prev;
                return [...prev, res.data];
            });

            setNewComment('');
            const updatedTask = { ...selectedTask, commentCount: (selectedTask.commentCount || 0) + 1 };
            updateLocalTask(updatedTask);
        } catch (error) {
            console.error(error);
            toast.error("Failed to add comment");
        } finally {
            setIsCommentLoading(false);
        }
    };

    const handleCommentChange = (e) => {
        const value = e.target.value;
        const cursorPos = e.target.selectionStart;
        setNewComment(value);

        const lastAtPos = value.lastIndexOf('@', cursorPos - 1);
        if (lastAtPos !== -1) {
            const query = value.substring(lastAtPos + 1, cursorPos);
            const isValid = (lastAtPos === 0 || value[lastAtPos - 1] === ' ') && !query.includes(' ');

            if (isValid) {
                setMentionQuery(query);
                setMentionCursorPos(lastAtPos);
                return;
            }
        }
        setMentionQuery(null);
        setMentionCursorPos(null);
    };

    const getMentionableUsers = () => {
        if (!selectedTask) return [];
        const users = new Map();

        selectedTask.assignees?.forEach(u => users.set(u._id, { ...u, type: 'Assignee' }));

        if (selectedTask.createdBy) {
            if (!users.has(selectedTask.createdBy._id)) {
                users.set(selectedTask.createdBy._id, { ...selectedTask.createdBy, type: 'Task Creator' });
            }
        }

        selectedTask.team?.members?.forEach(m => {
            if (!users.has(m._id)) users.set(m._id, { ...m, type: 'Team Member' });
        });

        const userArray = Array.from(users.values()).filter(u => u._id !== user?._id);

        if (userArray.length > 1) {
            userArray.unshift({
                _id: 'everyone',
                name: 'Everyone',
                type: 'Notify everyone in the chat',
                isSpecial: true
            });
        }

        return userArray;
    };

    const insertMention = (user) => {
        if (mentionCursorPos === null) return;

        const before = newComment.substring(0, mentionCursorPos);
        const after = newComment.substring(inputRef.current?.selectionStart || newComment.length);
        const mentionName = user.name.replace(/\s+/g, '_');
        const newValue = `${before}@${mentionName} ${after}`;

        setNewComment(newValue);
        setMentionQuery(null);
        setMentionCursorPos(null);

        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const filteredUsers = mentionQuery !== null
        ? getMentionableUsers().filter(u => u.name.toLowerCase().includes(mentionQuery.toLowerCase()))
        : [];

    const handleAddLink = async (e) => {
        e.preventDefault();
        if (!newLinkTitle.trim() || !newLinkUrl.trim() || !selectedTask) return;

        setIsLinkLoading(true);
        try {
            let url = newLinkUrl;
            if (!url.startsWith('http')) url = `https://${url}`;

            const res = await api.post(`/tasks/${selectedTask._id}/links`, { title: newLinkTitle, url });
            const updatedTask = { ...selectedTask, links: res.data };
            updateLocalTask(updatedTask);
            setNewLinkTitle('');
            setNewLinkUrl('');
        } catch (error) {
            toast.error("Failed to add link");
        } finally {
            setIsLinkLoading(false);
        }
    };

    const handleDeleteLink = async (link) => {
        if (!selectedTask || !link) return;
        try {
            const res = await api.delete(`/tasks/${selectedTask._id}/links/${link._id}`);
            const updatedTask = { ...selectedTask, links: res.data };
            updateLocalTask(updatedTask);
            toast.success("Link deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete link");
        }
    };

    const handleTaskMenuOpen = (event, task) => {
        event.stopPropagation();
        setTaskMenuAnchorEl(event.currentTarget);
        setActiveMenuTask(task);
    };

    const handleTaskMenuClose = () => {
        setTaskMenuAnchorEl(null);
        setActiveMenuTask(null);
    };

    const handleMoveTask = async (newStatus) => {
        if (!activeMenuTask) return;

        const updatedTask = { ...activeMenuTask, status: newStatus };

        try {
            updateLocalTask(updatedTask);
            handleTaskMenuClose();
            await api.put(`/tasks/${activeMenuTask._id}`, { status: newStatus });
            toast.success(`Moved to ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update status');
            fetchTasks();
        }
    };

    const handleMenuClick = (event, comment) => {
        setAnchorEl(event.currentTarget);
        setSelectedComment(comment);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedComment(null);
    };

    const handlePinComment = async () => {
        if (!selectedComment) return;
        try {
            await api.put(`/comments/${selectedComment._id}/pin`);
            handleMenuClose();
        } catch (error) {
            toast.error("Failed to update pin status");
        }
    };

    const handleDeleteComment = async () => {
        if (!selectedComment) return;
        try {
            await api.delete(`/comments/${selectedComment._id}`);
            handleMenuClose();
        } catch (error) {
            toast.error("Failed to delete comment");
        }
    };

    const renderCommentText = (text) => {
        if (!text) return null;
        if (typeof text !== 'string') return text;

        const parts = text.split(/(@\S+)/g);

        return parts.map((part, index) => {
            if (part.match(/^@\S+/)) {
                return (
                    <Box
                        component="span"
                        key={index}
                        sx={{
                            color: 'primary.main',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}
                    >
                        {part}
                    </Box>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    const getStats = () => {
        const total = allTasksList.length;
        const myTasks = allTasksList.filter(t => t.assignees?.some(a => a._id === user?._id) || t.team?.members?.some(m => m._id === user?._id)).length;
        const today = new Date().toISOString().split('T')[0];
        const dueToday = allTasksList.filter(t => t.dueDate?.startsWith(today) && t.status !== 'Done').length;
        const late = allTasksList.filter(t => {
            if (!t.dueDate || t.status === 'Done') return false;
            return new Date(t.dueDate) < new Date(today);
        }).length;

        return { total, myTasks, dueToday, late };
    };

    const stats = getStats();

    return (
        <Container maxWidth="2xl" sx={{ py: { xs: 1, sm: 2, md: 3 }, height: 'calc(100vh - 50px)' }}>
            <Box sx={{ display: { xs: 'grid', sm: 'flex' }, alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ mb: { xs: 2, sm: 0 }, display: { xs: 'grid', sm: 'flex' }, flexDirection: 'column', alignItems: { xs: 'center', sm: 'start' }, gap: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        {viewMode === 'board' ? <SpaceDashboardIcon fontSize="large" /> : <FeaturedPlayListIcon fontSize="large" />}
                        <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-0.5px', color: 'text.primary' }}>
                            {viewMode === 'board' ? 'Board' : 'List View'}
                        </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                        {viewMode === 'board' ? 'Manage tasks, track progress, and collaborate.' : 'View tasks in a list format for detailed analysis.'}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider', display: 'flex', overflow: 'hidden' }}>
                        <Tooltip title="Board View">
                            <IconButton
                                onClick={() => setViewMode('board')}
                                color={viewMode === 'board' ? 'primary' : 'default'}
                                sx={{ borderRadius: 0, bgcolor: viewMode === 'board' ? alpha(theme.palette.primary.main, 0.1) : 'transparent' }}
                            >
                                <BoardViewIcon />
                            </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" flexItem />
                        <Tooltip title="Table View">
                            <IconButton
                                onClick={() => setViewMode('table')}
                                color={viewMode === 'table' ? 'primary' : 'default'}
                                sx={{ borderRadius: 0, bgcolor: viewMode === 'table' ? alpha(theme.palette.primary.main, 0.1) : 'transparent' }}
                            >
                                <FormatListBulletedIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {(user?.role === 'admin' || user?.role === 'manager') && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setOpenTaskDialog(true)}
                            startIcon={<AddCircleIcon />}
                        >
                            Add New Task
                        </Button>
                    )}
                </Box>
            </Box>

            {viewMode === 'board' ? (
                <Grid container spacing={3} sx={{ height: 'calc(100% - 50px)' }}>
                    <Grid size={{ xs: 12 }} sx={{ height: '100%', overflow: 'hidden' }}>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                overflow: 'hidden'
                            }}>
                                {isMobile && (
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                                        <Tabs
                                            value={activeTab}
                                            onChange={(e, newValue) => setActiveTab(newValue)}
                                            variant="fullWidth"
                                            textColor="primary"
                                            indicatorColor="primary"
                                        >
                                            <Tab label="To Do" value="To Do" />
                                            <Tab label="In Progress" value="In Progress" />
                                            <Tab label="Done" value="Done" />
                                        </Tabs>
                                    </Box>
                                )}

                                <Box sx={{
                                    display: 'flex',
                                    gap: 3,
                                    height: '100%',
                                    overflowX: isMobile ? 'hidden' : 'auto',
                                    pb: 1,
                                    '& > div': {
                                        flex: 1,
                                        minWidth: isMobile ? '100%' : '280px',
                                    }
                                }}>
                                    {['To Do', 'In Progress', 'Done'].filter(id => !isMobile || id === activeTab).map(columnId => (
                                        <Box
                                            key={columnId}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                height: '100%',
                                                width: isMobile ? '100%' : 'auto'
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box sx={{
                                                        width: 8, height: 8, borderRadius: '50%', bgcolor:
                                                            columnId === 'To Do' ? theme.palette.info.main :
                                                                columnId === 'In Progress' ? theme.palette.warning.main :
                                                                    theme.palette.success.main
                                                    }} />
                                                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                                                        {columnId}
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            bgcolor: alpha(theme.palette.text.primary, 0.1),
                                                            color: 'text.secondary',
                                                            borderRadius: '50%',
                                                            width: 20,
                                                            height: 20,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {tasks[columnId]?.length || 0}
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <Droppable droppableId={columnId}>
                                                {(provided, snapshot) => (
                                                    <Box
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        sx={{
                                                            flexGrow: 1,
                                                            overflowY: 'auto',
                                                            pr: 1,
                                                            bgcolor: snapshot.isDraggingOver
                                                                ? alpha(theme.palette.primary.main, 0.08)
                                                                : alpha(theme.palette.background.default, 0.4),
                                                            borderRadius: 2,
                                                            p: 1,
                                                            border: '1px solid',
                                                            borderColor: snapshot.isDraggingOver ? 'primary.light' : 'divider',
                                                            minHeight: '200px',
                                                            transition: 'all 0.2s ease',
                                                        }}
                                                    >
                                                        {isLoadingTasks ? (
                                                            [1, 2].map((item) => (
                                                                <Paper
                                                                    key={item}
                                                                    elevation={0}
                                                                    sx={{
                                                                        p: 2,
                                                                        mb: 2,
                                                                        borderRadius: 3,
                                                                        border: '2px solid',
                                                                        borderColor: 'divider',
                                                                        bgcolor: 'background.paper',
                                                                    }}
                                                                >
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                                                        <Skeleton variant="rounded" width={60} height={22} sx={{ borderRadius: 1 }} />
                                                                        <Skeleton variant="circular" width={24} height={24} />
                                                                    </Box>
                                                                    <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                                                                    <Skeleton variant="text" width="100%" height={16} />
                                                                    <Skeleton variant="text" width="90%" height={16} sx={{ mb: 2 }} />
                                                                    <Skeleton variant="text" width="40%" height={16} sx={{ mb: 1 }} />
                                                                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                                                        <Skeleton variant="circular" width={24} height={24} />
                                                                        <Skeleton variant="circular" width={24} height={24} />
                                                                    </Box>
                                                                    <Divider sx={{ my: 1.5 }} />
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <Skeleton variant="text" width={80} height={16} />
                                                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                                                            <Skeleton variant="text" width={30} height={16} />
                                                                            <Skeleton variant="text" width={30} height={16} />
                                                                        </Box>
                                                                    </Box>
                                                                </Paper>
                                                            ))
                                                        ) : tasks[columnId]?.length === 0 ? (
                                                            <Box sx={{ mt: 4 }}>
                                                                <EmptyState
                                                                    title="No Tasks"
                                                                    description={`No tasks in ${columnId}`}
                                                                    icon={ListIcon}
                                                                    height="auto"
                                                                />
                                                            </Box>
                                                        ) : (
                                                            tasks[columnId]?.map((task, index) => (
                                                                <Draggable
                                                                    key={task._id}
                                                                    draggableId={task._id}
                                                                    index={index}
                                                                    isDragDisabled={user?.role === 'admin'}
                                                                >
                                                                    {(provided) => (
                                                                        <Paper
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            onClick={() => setSelectedTask(task)}
                                                                            elevation={0}
                                                                            sx={{
                                                                                p: 2,
                                                                                mb: 2,
                                                                                borderRadius: 3,
                                                                                border: '2px solid',
                                                                                borderColor: 'divider',
                                                                                bgcolor: 'background.paper',
                                                                                cursor: 'pointer',
                                                                                transition: 'all 0.2s',
                                                                                '&:hover': {
                                                                                    borderColor: 'primary.light',
                                                                                    boxShadow: theme.shadows[2]
                                                                                }
                                                                            }}
                                                                        >
                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                                                                <StatusBadge status={task.priority} size="small" />
                                                                                {isMobile && (
                                                                                    <IconButton
                                                                                        size="small"
                                                                                        onClick={(e) => handleTaskMenuOpen(e, task)}
                                                                                        sx={{ p: 0.5, mt: -0.5, mr: -0.5 }}
                                                                                    >
                                                                                        <MoreHorizIcon fontSize="small" color="action" />
                                                                                    </IconButton>
                                                                                )}
                                                                            </Box>

                                                                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, lineHeight: 1.3, color: 'text.primary' }}>
                                                                                {task.title}
                                                                            </Typography>

                                                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.8rem' }}>
                                                                                {task.description || 'No description provided.'}
                                                                            </Typography>

                                                                            <Typography
                                                                                variant="caption"
                                                                                color="text.secondary"
                                                                                sx={{ display: 'block', mb: 1, fontWeight: 500 }}
                                                                            >
                                                                                Assignees to {task.assignees && task.assignees.length > 0
                                                                                    ? task.assignees.map((a) => a.name).join(', ')
                                                                                    : (task.team?.name || 'Unassigned')} :
                                                                            </Typography>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                {(task.assignees && task.assignees.length > 0) || task.team ? (
                                                                                    <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.7rem' } }}>
                                                                                        {task.assignees && task.assignees.length > 0 ? (
                                                                                            task.assignees.map((user, index) => (
                                                                                                <Avatar key={index} src={user.profilePicture} alt={user.name}>
                                                                                                    {user.name?.[0]?.toUpperCase()}
                                                                                                </Avatar>
                                                                                            ))
                                                                                        ) : (
                                                                                            task.team && (
                                                                                                <Avatar
                                                                                                    src={task.team.profilePicture || task.team?.profilePicture}
                                                                                                    alt={task.team.name}
                                                                                                >
                                                                                                    {task.team.name?.[0]?.toUpperCase()}
                                                                                                </Avatar>
                                                                                            )
                                                                                        )}
                                                                                    </AvatarGroup>
                                                                                ) : (
                                                                                    <Typography variant="body2" color="text.secondary">
                                                                                        -
                                                                                    </Typography>
                                                                                )}
                                                                            </Box>

                                                                            <Divider sx={{ my: 1.5 }} />

                                                                            <Box
                                                                                sx={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'space-between',
                                                                                    color: 'text.secondary',
                                                                                    width: '100%',
                                                                                }}
                                                                            >
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                                                    <FlagIcon sx={{ fontSize: 16 }} />
                                                                                    <Typography variant="caption" fontWeight={500}>
                                                                                        {task.dueDate
                                                                                            ? new Date(task.dueDate).toLocaleDateString('en-GB', {
                                                                                                day: '2-digit',
                                                                                                month: 'short',
                                                                                                year: 'numeric',
                                                                                            })
                                                                                            : 'No Date'}
                                                                                    </Typography>
                                                                                </Box>

                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                                        <CommentIcon sx={{ fontSize: 14 }} />
                                                                                        <Typography variant="caption">
                                                                                            {task.commentCount || 0}
                                                                                        </Typography>
                                                                                    </Box>

                                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                                        <LinkIcon sx={{ fontSize: 14 }} />
                                                                                        <Typography variant="caption">
                                                                                            {task.links?.length || 0}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                </Box>
                                                                            </Box>

                                                                        </Paper>
                                                                    )}
                                                                </Draggable>
                                                            ))
                                                        )}
                                                        {provided.placeholder}
                                                    </Box>
                                                )}
                                            </Droppable>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </DragDropContext>
                    </Grid>
                </Grid>
            ) : (
                <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '12px', boxShadow: 'none' }}>
                    <TableContainer sx={(theme) => ({
                        overflowX: "auto",
                        '&::-webkit-scrollbar': {
                            width: '6px',
                            height: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                            borderRadius: '3px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                        },
                    })}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Priority</TableCell>
                                    <TableCell>Due Date</TableCell>
                                    <TableCell>Assignees</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allTasksList.map((task) => (
                                    <TableRow key={task._id} hover onClick={() => setSelectedTask(task)} sx={{ cursor: 'pointer' }}>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="subtitle2">{task.title}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={task.status} size="small" />
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={task.priority} size="small" />
                                        </TableCell>
                                        <TableCell>
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                                        </TableCell>
                                        <TableCell sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <AvatarGroup max={3}>
                                                {task.assignees?.map((u) => (
                                                    <Avatar key={u._id} src={u.profilePicture} alt={u.name} sx={{ width: 24, height: 24 }}>
                                                        {u.name?.[0]}
                                                    </Avatar>
                                                ))}
                                                {!task.assignees?.length && task.team && (
                                                    <Avatar src={task.team.profilePicture} alt={task.team.name} sx={{ width: 24, height: 24 }}>
                                                        {task.team.name?.[0]}
                                                    </Avatar>
                                                )}
                                            </AvatarGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {allTasksList.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">No tasks found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            <TaskFormDialog
                open={openTaskDialog}
                onClose={() => setOpenTaskDialog(false)}
                onSuccess={() => {
                    fetchTasks();
                    if (viewMode === 'board') {
                        /* Ideally trigger a board refresh or handled by fetchTasks updating props */
                    }
                }}
                users={users}
                teams={teams}
            />

            <Offcanvas
                open={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                anchor="right"
                width={{ xs: '100%', sm: '80%', md: '50%', lg: '30%' }}
            >
                {selectedTask && (
                    <>
                        <OffcanvasHeader onClose={() => setSelectedTask(null)}>
                            <Box>
                                <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                                    {selectedTask.title}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <StatusBadge status={selectedTask.status} size="small" />
                                    <Typography variant="caption" color="text.secondary">
                                        {selectedTask.priority} Priority
                                    </Typography>
                                </Box>
                            </Box>
                        </OffcanvasHeader>
                        <OffcanvasBody sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Task Description & Meta */}
                            <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {selectedTask.description || 'No description provided.'}
                                </Typography>

                                <Divider sx={{ my: 1.5 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom fontWeight={600}>
                                            Assignees
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {(selectedTask.assignees?.length > 0 || selectedTask.team) ? (
                                                <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.7rem' } }}>
                                                    {selectedTask.assignees?.length > 0 ? (
                                                        selectedTask.assignees.map((user, index) => (
                                                            <Avatar key={index} src={user.profilePicture} alt={user.name}>
                                                                {user.name?.[0]?.toUpperCase()}
                                                            </Avatar>
                                                        ))
                                                    ) : (
                                                        selectedTask.team && (
                                                            <Avatar src={selectedTask.team.profilePicture || selectedTask.team?.profilePicture} alt={selectedTask.team.name}>
                                                                {selectedTask.team.name?.[0]?.toUpperCase()}
                                                            </Avatar>
                                                        )
                                                    )}
                                                </AvatarGroup>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">-</Typography>
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom fontWeight={600}>
                                            Due Date
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <FlagIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                            <Typography variant="body2">
                                                {selectedTask.dueDate
                                                    ? new Date(selectedTask.dueDate).toLocaleDateString('en-GB')
                                                    : 'No Date'}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* Comments Section */}
                            <Paper
                                elevation={0}
                                sx={{
                                    flex: 1,
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden',
                                    minHeight: '600px'
                                }}
                            >
                                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: "column", gap: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CommentIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                        <Typography variant="subtitle2" fontWeight="bold" color="text.primary">Team Discussion</Typography>
                                    </Box>
                                    <Typography variant="caption" color='error'>
                                        Please Note that comments are deleted after 2 days.
                                    </Typography>
                                </Box>

                                {comments.filter(c => c.isPinned).length > 0 && (
                                    <Box
                                        onClick={handlePinHeaderClick}
                                        sx={{
                                            p: 1,
                                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            transition: 'background-color 0.2s',
                                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, py: 0.5 }}>
                                            {comments.filter(c => c.isPinned).length > 4 ? (
                                                <Box
                                                    sx={{
                                                        width: 3,
                                                        height: 24,
                                                        bgcolor: 'primary.main',
                                                        borderRadius: 1,
                                                    }}
                                                />
                                            ) : (
                                                comments.filter(c => c.isPinned).map((_, idx) => {
                                                    const count = comments.filter(c => c.isPinned).length;
                                                    const height = count > 0 ? (24 - (count - 1) * 4) / count : 24;

                                                    return (
                                                        <Box
                                                            key={idx}
                                                            sx={{
                                                                width: 3,
                                                                height: height,
                                                                bgcolor: count === 1 ? 'transparent' : (idx === (count > 0 ? (activePinIndex % count) : 0) ? 'primary.main' : alpha(theme.palette.primary.main, 0.2)),
                                                                borderRadius: 1,
                                                                transition: 'all 0.3s'
                                                            }}
                                                        />
                                                    )
                                                })
                                            )}
                                        </Box>

                                        <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PushPinIcon sx={{ fontSize: 14, color: 'primary.main', transform: 'rotate(45deg)' }} />
                                                <Typography variant="caption" fontWeight="bold" color="primary.main">
                                                    Pinned Message
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {comments.filter(c => c.isPinned).length > 0 ? comments.filter(c => c.isPinned)[activePinIndex % comments.filter(c => c.isPinned).length]?.text : ''}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}

                                <Box ref={chatContainerRef} sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2, minHeight: '200px' }}>
                                    {isLoadingComments ? (
                                        [1, 2, 3, 4, 5].map((item) => (
                                            <Box key={item} sx={{
                                                display: 'flex',
                                                gap: 1.5,
                                                flexDirection: item % 2 === 0 ? 'row-reverse' : 'row',
                                            }}>
                                                <Skeleton variant="circular" width={28} height={28} />
                                                <Box sx={{
                                                    width: '25%',
                                                    bgcolor: alpha(theme.palette.background.default, 0.4),
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    borderRadiusTopLeft: item % 2 === 0 ? 2 : 0,
                                                    borderRadiusTopRight: item % 2 === 0 ? 0 : 2,
                                                }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Skeleton variant="text" width={40} height={16} />
                                                        <Skeleton variant="text" width={20} height={12} />
                                                    </Box>
                                                    <Skeleton variant="text" width="100%" height={16} />
                                                </Box>
                                            </Box>
                                        ))
                                    ) : comments.length === 0 ? (
                                        <EmptyState
                                            title="No comments"
                                            description="No comments have been added to this task yet."
                                            icon={CommentIcon}
                                            height="100%"
                                        />
                                    ) : (
                                        (() => {
                                            const formatDateLabel = (dateString) => {
                                                const date = new Date(dateString);
                                                const today = new Date();
                                                const yesterday = new Date(today);
                                                yesterday.setDate(yesterday.getDate() - 1);

                                                if (date.toDateString() === today.toDateString()) {
                                                    return "TODAY";
                                                }
                                                if (date.toDateString() === yesterday.toDateString()) {
                                                    return "YESTERDAY";
                                                }
                                                return date.toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                }).toUpperCase();
                                            };

                                            const groupedComments = comments.reduce((groups, comment) => {
                                                const dateLabel = formatDateLabel(comment.createdAt);
                                                if (!groups[dateLabel]) {
                                                    groups[dateLabel] = [];
                                                }
                                                groups[dateLabel].push(comment);
                                                return groups;
                                            }, {});

                                            return Object.entries(groupedComments).map(([dateLabel, groupComments]) => (
                                                <Box key={dateLabel} sx={{ position: 'relative' }}>
                                                    <Box sx={{
                                                        position: 'sticky',
                                                        top: 0,
                                                        zIndex: 1,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        py: 0,
                                                        pointerEvents: 'none'
                                                    }}>
                                                        <Box sx={{
                                                            pointerEvents: 'auto',
                                                            bgcolor: alpha(theme.palette.text.primary, 0.1),
                                                            borderRadius: 2,
                                                            px: 1.5,
                                                            py: 0.5,
                                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                            backdropFilter: 'blur(2px)'
                                                        }}>
                                                            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.7rem' }}>
                                                                {dateLabel}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    {groupComments.map((comment, idx) => (
                                                        <Box key={comment._id || idx}
                                                            id={`comment-${comment._id}`}
                                                            sx={{
                                                                display: 'flex',
                                                                gap: 1.5,
                                                                flexDirection: comment.user?._id === user?._id ? 'row-reverse' : 'row',
                                                                transition: 'background-color 0.5s',
                                                                bgcolor: highlightedCommentId === comment._id ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                                                                p: 1,
                                                                borderRadius: 2
                                                            }}>
                                                            <Avatar
                                                                src={comment.user?.profilePicture}
                                                                alt={comment.user?.name}
                                                                sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: 'primary.light' }}
                                                            >
                                                                {comment.user?.name?.[0] || <PersonIcon fontSize="inherit" />}
                                                            </Avatar>
                                                            <Box sx={{
                                                                bgcolor: comment.user?._id === user?._id ? alpha(theme.palette.primary.light, 0.4) : alpha(theme.palette.background.default, 0.4),
                                                                color: comment.user?._id === user?._id ? 'black' : 'text.primary',
                                                                p: 1.5,
                                                                borderRadius: 2,
                                                                borderRadiusTopLeft: comment.user?._id === user?._id ? 2 : 0,
                                                                borderRadiusTopRight: comment.user?._id === user?._id ? 0 : 2,
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                maxWidth: '85%',
                                                                position: 'relative',
                                                                '&:hover .reply-btn': { opacity: 1 }
                                                            }}>
                                                                {comment.replyTo && (
                                                                    <Box sx={{
                                                                        mb: 1,
                                                                        p: 0.5,
                                                                        px: 1,
                                                                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                                                                        borderLeft: '3px solid',
                                                                        borderColor: 'primary.main',
                                                                        borderRadius: 1
                                                                    }}>
                                                                        <Typography variant="caption" fontWeight="bold" color="primary">
                                                                            {comment.replyTo.user?.name}
                                                                        </Typography>
                                                                        <Typography variant="body2" sx={{ fontSize: '0.7rem', opacity: 0.8, maxHeight: 40, overflow: 'hidden' }}>
                                                                            {comment.replyTo.text}
                                                                        </Typography>
                                                                    </Box>
                                                                )}
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, gap: 1 }}>
                                                                    <Typography variant="subtitle2" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                                        {comment.user?.name || 'User'}
                                                                    </Typography>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                        <Typography variant="caption" sx={{ fontSize: '0.65rem', opacity: 0.7 }}>
                                                                            {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                        </Typography>
                                                                        {comment.isPinned && !comment.isDeleted && (
                                                                            <PushPinIcon sx={{ fontSize: 12, transform: 'rotate(45deg)', color: 'text.secondary' }} />
                                                                        )}
                                                                        {!comment.isDeleted && (
                                                                            <IconButton
                                                                                className="reply-btn"
                                                                                size="small"
                                                                                sx={{ padding: 0.2, opacity: 0, transition: 'opacity 0.2s', color: 'inherit' }}
                                                                                onClick={(e) => handleMenuClick(e, comment)}
                                                                            >
                                                                                <MoreHorizIcon sx={{ fontSize: 14 }} />
                                                                            </IconButton>
                                                                        )}
                                                                    </Box>
                                                                </Box>
                                                                {comment.isDeleted ? (
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontStyle: 'italic', color: 'text.secondary', opacity: 0.7 }}>
                                                                        <BlockIcon sx={{ fontSize: 14 }} />
                                                                        <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                                                                            {comment.user?._id === user?._id ? "You deleted this message" : "This message was deleted"}
                                                                        </Typography>
                                                                    </Box>
                                                                ) : (
                                                                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                                                        {renderCommentText(comment.text)}
                                                                    </Typography>
                                                                )}
                                                            </Box>

                                                            <Menu
                                                                anchorEl={anchorEl}
                                                                open={Boolean(anchorEl) && selectedComment?._id === comment._id}
                                                                onClose={handleMenuClose}
                                                                PaperProps={{ elevation: 3, sx: { borderRadius: 2, minWidth: 120 } }}
                                                            >
                                                                <MenuItem onClick={() => { setReplyingTo(selectedComment); handleMenuClose(); }} dense>
                                                                    <ReplyIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                                    <Typography variant="caption">Reply</Typography>
                                                                </MenuItem>
                                                                <MenuItem onClick={handlePinComment} dense>
                                                                    {selectedComment?.isPinned ? <PushPinOutlinedIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} /> : <PushPinIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />}
                                                                    <Typography variant="caption">{selectedComment?.isPinned ? 'Unpin' : 'Pin'}</Typography>
                                                                </MenuItem>
                                                                {selectedComment?.user?._id === user?._id && (
                                                                    <MenuItem onClick={handleDeleteComment} dense>
                                                                        <DeleteIcon sx={{ fontSize: 16, mr: 1, color: 'error.main' }} />
                                                                        <Typography variant="caption" color="error">Delete</Typography>
                                                                    </MenuItem>
                                                                )}
                                                            </Menu>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            ));
                                        })()
                                    )}
                                </Box>

                                <Box component="form" onSubmit={handleAddComment} sx={{ p: 1.5, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', position: 'relative' }}>
                                    {replyingTo && (
                                        <Box sx={{
                                            p: 1,
                                            mb: 1,
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            borderLeft: '3px solid',
                                            borderColor: 'primary.main',
                                            borderRadius: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Box>
                                                <Typography variant="caption" color="primary.main" fontWeight="bold">
                                                    Replying to {replyingTo.user?.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', maxHeight: 40, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                    {replyingTo.text}
                                                </Typography>
                                            </Box>
                                            <IconButton size="small" onClick={() => setReplyingTo(null)}>
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    )}
                                    {mentionQuery !== null && filteredUsers.length > 0 && (
                                        <ClickAwayListener onClickAway={() => setMentionQuery(null)}>
                                            <Paper
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: '100%',
                                                    left: 10,
                                                    width: 280,
                                                    maxHeight: 220,
                                                    overflowY: 'auto',
                                                    mb: 1,
                                                    zIndex: 10,
                                                    boxShadow: theme.shadows[4],
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        px: 2,
                                                        py: 1,
                                                        borderBottom: '1px solid',
                                                        borderColor: 'divider',
                                                        bgcolor: 'background.paper',
                                                    }}
                                                >
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ fontWeight: 600, color: 'text.secondary', letterSpacing: 0.5 }}
                                                    >
                                                        Suggestions
                                                    </Typography>
                                                </Box>

                                                <List dense disablePadding>
                                                    {filteredUsers.map(user => (
                                                        <ListItem key={user._id} disablePadding>
                                                            <ListItemButton
                                                                onClick={() => insertMention(user)}
                                                                sx={{ px: 2, '&:hover': { bgcolor: 'action.hover' } }}
                                                            >
                                                                <ListItemAvatar>
                                                                    <Avatar
                                                                        src={user.isSpecial ? undefined : user.profilePicture}
                                                                        alt={user.name}
                                                                        sx={{ width: 28, height: 28, bgcolor: user.isSpecial ? 'transparent' : 'grey.300' }}
                                                                    >
                                                                        {user.isSpecial ? <GroupsIcon sx={{ fontSize: 20, color: 'text.secondary' }} /> : user.name?.[0]}
                                                                    </Avatar>
                                                                </ListItemAvatar>

                                                                <ListItemText
                                                                    primary={user.name}
                                                                    secondary={user.type}
                                                                    primaryTypographyProps={{
                                                                        variant: 'body2',
                                                                        fontWeight: 500,
                                                                    }}
                                                                    secondaryTypographyProps={{
                                                                        variant: 'caption',
                                                                        color: 'text.secondary',
                                                                    }}
                                                                />
                                                            </ListItemButton>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Paper>
                                        </ClickAwayListener>
                                    )}
                                    <TextField
                                        fullWidth
                                        inputRef={inputRef}
                                        placeholder="Type a message..."
                                        variant="outlined"
                                        size="small"
                                        value={newComment}
                                        onChange={handleCommentChange}
                                        InputProps={{
                                            sx: { borderRadius: 2, fontSize: '0.85rem', bgcolor: 'background.default', '& fieldset': { border: 'none' } },
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" type="submit" color="primary" disabled={!newComment.trim() || isCommentLoading}>
                                                        {isCommentLoading ? <CircularProgress size={20} /> : <SendIcon fontSize="small" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Box>
                            </Paper>

                            {/* Resources Section */}
                            <Paper
                                elevation={0}
                                sx={{
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden',
                                    flexShrink: 0
                                }}
                            >
                                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LinkIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
                                    <Typography variant="subtitle2" fontWeight="bold" color="text.primary">Resources</Typography>
                                </Box>

                                <Box sx={{ p: 1, overflowY: 'auto', maxHeight: 200 }}>
                                    {selectedTask.links?.length === 0 ? (
                                        <EmptyState
                                            title="No links"
                                            description="No links have been added yet."
                                            icon={LinkIcon}
                                            height="100%"
                                        />
                                    ) : (
                                        selectedTask.links?.map((link, idx) => (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    p: 1.5,
                                                    m: 0.5,
                                                    bgcolor: 'background.default',
                                                    borderRadius: 2,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    '&:hover .actions': { opacity: 1 }
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
                                                    <LaunchIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                    <Typography variant="body2" noWrap sx={{ fontSize: '0.8rem', fontWeight: 500, color: 'text.primary' }}>
                                                        {link.title}
                                                    </Typography>
                                                </Box>
                                                <Box className="actions" sx={{ opacity: 0, transition: 'opacity 0.2s', display: 'flex' }}>
                                                    <Tooltip title="Open Link" placement="top" arrow>
                                                        <IconButton size="small" href={link.url} target="_blank" color="primary">
                                                            <LaunchIcon fontSize="small" sx={{ fontSize: 14 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Link" placement="top" arrow>
                                                        <IconButton size="small" onClick={() => handleDeleteLink(link)} color="error">
                                                            <DeleteIcon fontSize="small" sx={{ fontSize: 14 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Box>
                                        ))
                                    )}
                                </Box>

                                <Box component="form" onSubmit={handleAddLink} sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                    <TextField
                                        fullWidth
                                        placeholder="Link Name"
                                        variant="outlined"
                                        size="small"
                                        value={newLinkTitle}
                                        onChange={(e) => setNewLinkTitle(e.target.value)}
                                        sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.8rem', bgcolor: 'background.default' } }}
                                    />
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <TextField
                                            fullWidth
                                            placeholder="URL"
                                            variant="outlined"
                                            size="small"
                                            value={newLinkUrl}
                                            onChange={(e) => setNewLinkUrl(e.target.value)}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.8rem', bgcolor: 'background.default' } }}
                                        />
                                        <Button
                                            type="submit"
                                            variant="outlined"
                                            color="secondary"
                                            disabled={!newLinkTitle || !newLinkUrl || isLinkLoading}
                                            sx={{ borderRadius: 2, minWidth: 'auto', px: 2 }}
                                        >
                                            {isLinkLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon fontSize="small" />}
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        </OffcanvasBody>
                    </>
                )}
            </Offcanvas>

            <Menu
                anchorEl={taskMenuAnchorEl}
                open={Boolean(taskMenuAnchorEl)}
                onClose={handleTaskMenuClose}
                PaperProps={{ elevation: 3, sx: { borderRadius: 2, minWidth: 150 } }}
            >
                <MenuItem disabled dense>
                    <Typography variant="caption" fontWeight="bold">Move to...</Typography>
                </MenuItem>
                {['To Do', 'In Progress', 'Done']
                    .filter(status => status !== activeMenuTask?.status)
                    .map(status => (
                        <MenuItem key={status} onClick={() => handleMoveTask(status)} dense>
                            <Typography variant="body2">{status}</Typography>
                        </MenuItem>
                    ))
                }
            </Menu>
        </Container>
    );
};

export default Board;
