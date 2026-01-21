import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Alert,
  Avatar,
  Stack,
} from "@mui/material";
import api from "../api";
import { toast } from 'react-toastify';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Switch,
  IconButton,
  Tooltip,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';

export default function Users() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userFormData, setUserFormData] = useState({ name: '', email: '', password: '', role: 'user', profilePicture: null });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    } else if (!loading && user?.role !== "admin" && user?.role !== "manager") {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        setUsers([]);
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleViewProfile = (userToView) => {
    setSelectedUser(userToView);
    setIsAddMode(false);
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleAddUser = () => {
    setUserFormData({ name: '', email: '', password: '', role: 'user', profilePicture: null });
    setPreviewImage(null);
    setIsAddMode(true);
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleEditUser = (userToEdit) => {
    setUserFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      password: '',
      role: userToEdit.role,
      profilePicture: null
    });
    setPreviewImage(userToEdit.profilePicture);
    setSelectedUser(userToEdit);
    setIsEditMode(true);
    setIsAddMode(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setIsAddMode(false);
    setIsEditMode(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserFormData({ ...userFormData, profilePicture: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', userFormData.name);
      formData.append('email', userFormData.email);
      formData.append('role', userFormData.role);
      if (userFormData.password) {
        formData.append('password', userFormData.password);
      }
      if (userFormData.profilePicture) {
        formData.append('profilePicture', userFormData.profilePicture);
      }

      if (isAddMode) {
        await api.post('/users', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('User created successfully');
      } else if (isEditMode) {
        await api.put(`/users/${selectedUser._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('User updated successfully');
      }

      setOpenDialog(false);
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await api.patch(`/users/${userId}/status`);
      setUsers(users.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u));
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to toggle status");
    }
  };

  if (user?.role !== "admin" && user?.role !== "manager") {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">You are not authorized to view this page.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="2xl" sx={{ py: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ mb: 4, display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: "100%", sm: "auto" }, justifyContent: { xs: "flex-start", sm: "flex-start" } }}>
          <PermContactCalendarIcon fontSize="large" />
          <Typography variant="h4">User Management</Typography>
        </Stack>
        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={handleAddUser} sx={{ width: { xs: "100%", sm: "auto" } }}>
          Add User
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '12px', boxShadow: 'none' }}>
        <TableContainer component={Paper} sx={(theme) => ({
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
                <TableCell>Profile</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from(new Array(usersPerPage)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" height={24} width="28%" />
                    </TableCell>
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell sx={{ width: "100px" }}>
                      <Avatar
                        src={u?.profilePicture || undefined}
                        alt={u?.name || 'User avatar'}
                        sx={{
                          width: 40,
                          height: 40,
                          fontSize: 16,
                          bgcolor: 'primary.main',
                        }}
                      >
                        {u?.name?.[0]?.toUpperCase() || '?'}
                      </Avatar>
                    </TableCell>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{u.role}</TableCell>
                    <TableCell>
                      <Switch
                        checked={u.isActive}
                        onChange={() => handleToggleStatus(u._id, u.isActive)}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewProfile(u)}
                          startIcon={<VisibilityIcon />}
                        >
                          View
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="secondary"
                          onClick={() => handleEditUser(u)}
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} style={{ backdropFilter: "blur(3px)" }} maxWidth="sm" fullWidth>
        {isAddMode || isEditMode ? (
          <form onSubmit={handleSubmitUser}>
            <DialogTitle>{isAddMode ? 'Add New User' : 'Edit User'}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={previewImage || undefined}
                      sx={{ width: 100, height: 100 }}
                    />
                    <input
                      accept="image/*"
                      type="file"
                      id="icon-button-file"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <label htmlFor="icon-button-file">
                      <Tooltip title={isEditMode ? 'Edit Image' : 'Upload Image'} placement="right" arrow>
                        <IconButton color="primary" aria-label="upload picture" component="span" sx={{ position: 'absolute', bottom: -5, right: 0, bgcolor: 'background.paper' }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </label>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    fullWidth
                    required
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  />
                </Grid>
                {isAddMode && (
                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      type="password"
                      fullWidth
                      required={isAddMode}
                      value={userFormData.password}
                      onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={userFormData.role}
                      label="Role"
                      onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="manager">Manager</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained">{isAddMode ? 'Create' : 'Update'}</Button>
            </DialogActions>
          </form>
        ) : (
          <>
            <DialogTitle>User Profile</DialogTitle>
            <DialogContent>
              {selectedUser && (
                <Box sx={{ pt: 2, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography gutterBottom sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Avatar
                      src={selectedUser?.profilePicture || undefined}
                      alt={selectedUser?.name || 'User avatar'}
                      sx={{
                        width: "100px",
                        height: "100px",
                        fontSize: 16,
                        bgcolor: 'primary.main',
                        marginBottom: "10px",
                      }}
                    >
                      {selectedUser?.name?.[0]?.toUpperCase() || '?'}
                    </Avatar>
                  </Typography>
                  <Typography gutterBottom><strong>Name:</strong> {selectedUser.name}</Typography>
                  <Typography gutterBottom><strong>Email:</strong> {selectedUser.email}</Typography>
                  <Typography gutterBottom sx={{ textTransform: 'capitalize' }}><strong>Role:</strong> {selectedUser.role}</Typography>
                  <Typography>
                    <strong>Member Since:</strong>{" "}
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container >
  );
}
