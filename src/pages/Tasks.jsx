import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Container,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Pagination,
  Grid,
  Skeleton,
  Tooltip,
  Stack,
  useTheme as useMuiTheme
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TaskIcon from '@mui/icons-material/Task';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api";
import { useActivityLog } from "../context/ActivityLogContext";
import { useNotifications } from "../context/NotificationContext";
import StatusBadge from "../components/common/StatusBadge";
import TaskFormDialog from "../components/tasks/TaskFormDialog";

export default function Tasks() {
  const { user, token, loading } = useAuth();
  const { mode } = useTheme();
  const theme = useMuiTheme();
  const navigate = useNavigate();
  const { fetchLogs } = useActivityLog();
  const { registerUpdateCallback, unregisterUpdateCallback } =
    useNotifications();

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [tasks, setTasks] = useState([]);
  const [displayTasks, setDisplayTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [tasksPerPage, setTasksPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const callbackId = "tasks-page";
    const handleDataUpdate = (entityType) => {
      setRefetchTrigger((prev) => prev + 1);
    };

    registerUpdateCallback(callbackId, handleDataUpdate);

    return () => {
      unregisterUpdateCallback(callbackId);
    };
  }, [registerUpdateCallback, unregisterUpdateCallback]);

  useEffect(() => {
    if (loading || !user) return;

    const fetchData = async () => {
      setLoadingTasks(true);
      try {
        const queryParams = new URLSearchParams({
          page,
          limit: tasksPerPage,
          search: debouncedSearch,
          status: statusFilter === "All" ? "" : statusFilter,
          priority: priorityFilter === "All" ? "" : priorityFilter,
          dueDate: dateFilter
        });

        const [tasksRes, usersRes, teamsRes] = await Promise.all([
          api.get(
            `/tasks?${queryParams.toString()}`
          ),
          api.get("/users"),
          api.get("/teams")
        ]);

        setTasks(tasksRes.data.tasks);
        setDisplayTasks(tasksRes.data.tasks);
        setTotalTasks(tasksRes.data.totalTasks);
        setTotalPages(tasksRes.data.totalPages);
        setUsers(usersRes.data);
        setTeams(teamsRes.data.teams || teamsRes.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch page data");
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchData();
  }, [
    token,
    user,
    loading,
    page,
    tasksPerPage,
    refetchTrigger,
    debouncedSearch,
    debouncedSearch,
    statusFilter,
    priorityFilter,
    dateFilter
  ]);


  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const isUserAssigned = (task, currentUser, allTeams) => {
    if (!task || !currentUser || !allTeams) return false;

    const currentUserId = currentUser._id || currentUser.id;
    if (!currentUserId) return false;

    if (task.assignees && task.assignees.some(a => a._id === currentUserId)) {
      return true;
    }

    if (task.team && task.team._id) {
      const assignedTeam = allTeams.find(t => t._id === task.team._id);
      if (assignedTeam && assignedTeam.members) {
        return assignedTeam.members.some(member => member._id === currentUserId);
      }
    }

    return false;
  };

  if (loading || !user) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }



  const handleDeleteTask = async (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: theme.palette.error.main,
      confirmButtonText: "Yes, delete it!",
      background: mode === 'dark' ? '#1e293b' : '#ffffff',
      color: mode === 'dark' ? '#f1f5f9' : '#1e293b'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/tasks/${taskId}`);
          Swal.fire({
            title: "Deleted!",
            text: "Task has been deleted.",
            icon: "success",
            background: mode === 'dark' ? '#1e293b' : '#ffffff',
            color: mode === 'dark' ? '#f1f5f9' : '#1e293b'
          });
          setRefetchTrigger((prev) => prev + 1);
          fetchLogs();
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to delete task");
        }
      }
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditTask(null);
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setOpenDialog(true);
  };

  const handleTaskSuccess = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };


  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(
        `/tasks/${taskId}`,
        { status: newStatus }
      );
      toast.success("Task status updated successfully!");
      setRefetchTrigger((prev) => prev + 1);
      fetchLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task status");
    }
  };

  return (
    <Container maxWidth="2xl" sx={{ py: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ mb: 4, display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: "100%", sm: "auto" }, justifyContent: { xs: "flex-start", sm: "flex-start" } }}>
          <TaskIcon fontSize="large" />
          <Typography variant="h4" sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" }, fontWeight: "bold" }}>Task Management</Typography>
        </Stack>

        {(user.role === "admin" || user.role === "manager") && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setEditTask(null);
              setOpenDialog(true);
            }}
            startIcon={<AddCircleIcon />}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Add New Task
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
          alignItems: "center"
        }}
      >
        <TextField
          label="Search Tasks"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1, minWidth: "300px", maxWidth: { xs: "100%", sm: "500px" }, width: { xs: "100%", sm: "200px" } }}
        />

        <FormControl size="small" sx={{ minWidth: "150px", width: { xs: "100%", sm: "200px" } }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="All">All Statuses</MenuItem>
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: "150px", width: { xs: "100%", sm: "200px" } }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priorityFilter}
            label="Priority"
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="All">All Priorities</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </FormControl>

        <TextField
          type="date"
          label="Due Date"
          InputLabelProps={{ shrink: true }}
          size="small"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: "150px", width: { xs: "100%", sm: "200px" } }}
        />

        {(search || statusFilter !== "All" || dateFilter) && (
          <Button
            variant="text"
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setDateFilter("");
            }}
          >
            Clear
          </Button>
        )}
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '12px', boxShadow: 'none' }}>
        <TableContainer
          sx={(theme) => ({
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
          })}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Assignees/Team</TableCell>
                {(user.role === "admin" || user.role === "manager") && (
                  <TableCell>Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingTasks ? (
                Array.from(new Array(tasksPerPage)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    {(user.role === "admin" || user.role === "manager") && (
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <Skeleton variant="circular" width={30} height={30} sx={{ mr: 1 }} />
                          <Skeleton variant="circular" width={30} height={30} />
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : displayTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={user.role === "admin" || user.role === "manager" ? 7 : 6} sx={{ textAlign: "center" }}>
                    No tasks found.
                  </TableCell>
                </TableRow>
              ) : (
                displayTasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell component="th" scope="row">
                      {task.title}
                    </TableCell>
                    <TableCell>{task.description || "-"}</TableCell>
                    <TableCell>
                      {(user.role === 'user' && isUserAssigned(task, user, teams)) ? (
                        <FormControl fullWidth size="small">
                          <Select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          >
                            <MenuItem value="To Do">To Do</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Done">Done</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <StatusBadge status={task.status} size="small" />
                      )}
                    </TableCell>
                    <TableCell><StatusBadge status={task.priority} size="small" /></TableCell>
                    <TableCell>
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {task.assignees && task.assignees.length > 0
                        ? task.assignees.map(a => a.name).join(", ")
                        : task.team?.name || "-"}
                    </TableCell>
                    {(user.role === "admin" || user.role === "manager") && (
                      <TableCell>
                        <Tooltip title="Edit" placement="top" arrow>
                          <IconButton onClick={() => handleEditTask(task)}>
                            <EditIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" placement="top" arrow>
                          <IconButton onClick={() => handleDeleteTask(task._id)}>
                            <DeleteForeverTwoToneIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
        Total Tasks: {totalTasks}
      </Typography>


      <TaskFormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        taskToEdit={editTask}
        onSuccess={handleTaskSuccess}
        users={users}
        teams={teams}
      />

    </Container>
  );
}
