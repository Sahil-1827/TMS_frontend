import { useState, useEffect } from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Typography,
    Divider,
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
import api from "../../api";
import { useNotifications } from "../../context/NotificationContext";
import { useActivityLog } from "../../context/ActivityLogContext";

export default function TaskFormDialog({
    open,
    onClose,
    taskToEdit = null,
    onSuccess,
    users = [],
    teams = []
}) {
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        status: "To Do",
        priority: "Medium",
        dueDate: new Date().toISOString().split('T')[0],
        assignees: [],
        team: ""
    });
    const [errors, setErrors] = useState({});
    const [actionLoading, setActionLoading] = useState(false);
    const { fetchLogs } = useActivityLog();

    useEffect(() => {
        if (open) {
            if (taskToEdit) {
                setNewTask({
                    title: taskToEdit.title,
                    description: taskToEdit.description || "",
                    status: taskToEdit.status,
                    priority: taskToEdit.priority,
                    dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.split("T")[0] : "",
                    assignees: taskToEdit.assignees ? taskToEdit.assignees.map(a => a._id) : [],
                    team: taskToEdit.team?._id || ""
                });
            } else {
                setNewTask({
                    title: "",
                    description: "",
                    status: "To Do",
                    priority: "Medium",
                    dueDate: new Date().toISOString().split('T')[0],
                    assignees: [],
                    team: ""
                });
            }
            setErrors({});
        }
    }, [open, taskToEdit]);

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const validate = () => {
        let tempErrors = {};
        if (!newTask.title) tempErrors.title = "Title is required";
        if (!newTask.description) tempErrors.description = "Description is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateTeamMembers = (teamId) => {
        if (!teamId) return true;
        const selectedTeam = teams.find((team) => team._id === teamId);
        if (!selectedTeam) return false;
        return selectedTeam.members && selectedTeam.members.length > 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        if (newTask.team && !validateTeamMembers(newTask.team)) {
            toast.error("Cannot assign task to a team with no members");
            return;
        }

        const taskData = {
            ...newTask,
            assignees: newTask.assignees || [],
            team: newTask.team || null
        };

        setActionLoading(true);
        try {
            if (taskToEdit) {
                await api.put(`/tasks/${taskToEdit._id}`, taskData);
                toast.success("Task updated successfully");
            } else {
                await api.post("/tasks", taskData);
                toast.success("Task created successfully!");
            }
            if (onSuccess) onSuccess();
            onClose();
            fetchLogs();
        } catch (error) {
            toast.error(error.response?.data?.message || (taskToEdit ? "Failed to update task" : "Failed to create task"));
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            style={{ backdropFilter: "blur(3px)" }}
        >
            <DialogTitle>
                <Stack direction="row" spacing={1} alignItems="center">
                    {taskToEdit ? <EditIcon color="primary" /> : <AddCircleIcon color="primary" />}
                    <Typography variant="h6" component="span" fontWeight="bold">
                        {taskToEdit ? "Edit Task" : "Add Task"}
                    </Typography>
                </Stack>
            </DialogTitle>

            <DialogContent>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    id="task-form"
                    sx={{
                        mt: 1,
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: 2,
                    }}
                >
                    <TextField
                        label="Task Title"
                        name="title"
                        value={newTask.title}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!errors.title}
                        helperText={errors.title}
                    />

                    <TextField
                        label="Description"
                        name="description"
                        value={newTask.description}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={3}
                        error={!!errors.description}
                        helperText={errors.description}
                    />

                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={newTask.status}
                            onChange={handleInputChange}
                            label="Status"
                        >
                            <MenuItem value="To Do">To Do</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Done">Done</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            name="priority"
                            value={newTask.priority}
                            onChange={handleInputChange}
                            label="Priority"
                        >
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Due Date"
                        name="dueDate"
                        type="date"
                        value={newTask.dueDate}
                        onChange={handleInputChange}
                        fullWidth
                        slotProps={{
                            htmlInput: { min: getTodayDate() },
                            inputLabel: { shrink: true },
                        }}
                    />

                    <FormControl fullWidth disabled={!!newTask.team}>
                        <InputLabel>Assignees</InputLabel>
                        <Select
                            name="assignees"
                            multiple
                            value={newTask.assignees}
                            onChange={(e) => {
                                const { value } = e.target;
                                let updatedAssignees = typeof value === 'string' ? value.split(',') : value;

                                if (updatedAssignees.includes('all')) {
                                    if (newTask.assignees.length === users.length) {
                                        updatedAssignees = [];
                                    } else {
                                        updatedAssignees = users.map(u => u._id);
                                    }
                                }

                                setNewTask({
                                    ...newTask,
                                    assignees: updatedAssignees,
                                    team: "",
                                });
                            }}
                            label="Assignees"
                        >
                            <MenuItem value="all" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                {newTask.assignees.length === users.length && users.length > 0 ? "Deselect All" : "Select All"}
                            </MenuItem>
                            <Divider />
                            {users.map((u) => (
                                <MenuItem key={u._id} value={u._id}>
                                    {u.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth disabled={newTask.assignees && newTask.assignees.length > 0}>
                        <InputLabel>Team</InputLabel>
                        <Select
                            name="team"
                            value={newTask.team}
                            onChange={(e) =>
                                setNewTask({
                                    ...newTask,
                                    team: e.target.value,
                                    assignees: [],
                                })
                            }
                            label="Team"
                        >
                            <MenuItem value="">None</MenuItem>
                            {teams.map((t) => (
                                <MenuItem key={t._id} value={t._id}>
                                    {t.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    form="task-form"
                    variant="contained"
                    loading={actionLoading}
                    loadingPosition="end"
                >
                    {taskToEdit ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
