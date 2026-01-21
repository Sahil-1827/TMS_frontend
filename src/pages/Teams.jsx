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
import Groups3Icon from '@mui/icons-material/Groups3';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api";
import { useActivityLog } from "../context/ActivityLogContext";
import { useNotifications } from "../context/NotificationContext";

export default function Teams() {
  const { user, token, loading } = useAuth();
  const { mode } = useTheme();
  const theme = useMuiTheme();
  const navigate = useNavigate();
  const { fetchLogs } = useActivityLog();
  const { registerUpdateCallback, unregisterUpdateCallback } =
    useNotifications();

  const [teams, setTeams] = useState([]);
  const [displayTeams, setDisplayTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    members: []
  });
  const [editTeam, setEditTeam] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const validate = () => {
    let tempErrors = {};
    if (!newTeam.name) tempErrors.name = "Team name is required";
    if (!newTeam.description) tempErrors.description = "Description is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTeams, setTotalTeams] = useState(0);
  const [teamsPerPage, setTeamsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [memberFilter, setMemberFilter] = useState("");
  const [creatorFilter, setCreatorFilter] = useState("");
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [loadingTeams, setLoadingTeams] = useState(true);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const callbackId = "teams-page";
    const handleDataUpdate = (entityType) => {
      if (entityType === "team") {
        setRefetchTrigger((prev) => prev + 1);
      }
    };

    registerUpdateCallback(callbackId, handleDataUpdate);

    return () => {
      unregisterUpdateCallback(callbackId);
    };
  }, [registerUpdateCallback, unregisterUpdateCallback]);

  useEffect(() => {
    if (loading || !user) return;

    const fetchTeams = async () => {
      setLoadingTeams(true);
      setDisplayTeams([]);
      try {
        const queryParams = new URLSearchParams({
          page,
          limit: 5,
          search: debouncedSearch,
          member: memberFilter,
          createdBy: creatorFilter
        });

        const response = await api.get(
          `/teams?${queryParams.toString()}`
        );

        setTeams(response.data.teams);
        setDisplayTeams(response.data.teams);
        setTotalTeams(response.data.totalTeams);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch teams");
      } finally {
        setLoadingTeams(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch users");
      }
    };

    fetchTeams();
    if (user.role !== "user") {
      fetchUsers();
    } else {
      fetchUsers();
    }
  }, [
    token,
    user,
    loading,
    page,
    refetchTrigger,
    refetchTrigger,
    debouncedSearch,
    memberFilter,
    creatorFilter
  ]);


  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeam({ ...newTeam, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleMembersChange = (event) => {
    const {
      target: { value }
    } = event;
    setNewTeam({
      ...newTeam,
      members: typeof value === "string" ? value.split(",") : value
    });
  };

  const handleEditTeam = (team) => {
    setEditTeam(team);
    setNewTeam({
      name: team.name,
      description: team.description || "",
      members: team.members.map((member) => member._id)
    });
    setOpenDialog(true);
  };

  const handleSubmitTeam = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setActionLoading(true);

    try {
      if (editTeam) {
        await api.put(`/teams/${editTeam._id}`, newTeam);
        toast.success("Team updated successfully");
      } else {
        await api.post("/teams", newTeam);
        toast.success("Team created successfully!");
      }
      setOpenDialog(false);
      setNewTeam({ name: "", description: "", members: [] });
      setEditTeam(null);
      setRefetchTrigger((prev) => prev + 1);
      fetchLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || (editTeam ? "Failed to update team" : "Failed to create team"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId) => {
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
          await api.delete(`/teams/${teamId}`);
          Swal.fire({
            title: "Deleted!",
            text: "Team has been deleted.",
            icon: "success",
            background: mode === 'dark' ? '#1e293b' : '#ffffff',
            color: mode === 'dark' ? '#f1f5f9' : '#1e293b'
          });
          setRefetchTrigger((prev) => prev + 1);
          fetchLogs();
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to delete team");
        }
      }
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewTeam({ name: "", description: "", members: [] });
    setEditTeam(null);
    setErrors({});
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };


  return (
    <Container maxWidth="2xl" sx={{ py: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ mb: 4, display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: "100%", sm: "auto" }, justifyContent: { xs: "flex-start", sm: "flex-start" } }}>
          <Groups3Icon fontSize="large" />
          <Typography variant="h4" sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" }, fontWeight: "bold" }}>Team Management</Typography>
        </Stack>

        {(user.role === "admin" || user.role === "manager") && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setEditTeam(null);
              setNewTeam({
                name: "",
                description: "",
                members: []
              });
              setErrors({});
              setOpenDialog(true);
            }}
            startIcon={<AddCircleIcon />}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Add New Team
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
          label="Search Teams"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: { xs: "100%", sm: "500px" }, width: { xs: "100%", sm: "200px" } }}
        />

        {(user.role === "admin" || user.role === "manager") && (
          <FormControl size="small" sx={{ minWidth: "200px", width: { xs: "100%", sm: "200px" } }}>
            <InputLabel>Filter by Member</InputLabel>
            <Select
              value={memberFilter}
              label="Filter by Member"
              onChange={(e) => {
                setMemberFilter(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">All Members</MenuItem>
              {users.map((u) => (
                <MenuItem key={u._id} value={u._id}>
                  {u.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {(search || memberFilter || creatorFilter) && (
          <Button
            variant="text"
            onClick={() => {
              setSearch("");
              setMemberFilter("");
              setCreatorFilter("");
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
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Members</TableCell>
                <TableCell>Created By</TableCell>
                {(user.role === "admin" || user.role === "manager") && (
                  <TableCell>Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingTeams ? (
                Array.from(new Array(teamsPerPage)).map((_, index) => (
                  <TableRow key={index}>
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
              ) : displayTeams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={user.role === "admin" || user.role === "manager" ? 5 : 4} sx={{ textAlign: "center" }}>
                    No teams found.
                  </TableCell>
                </TableRow>
              ) : (
                displayTeams.map((team) => (
                  <TableRow key={team._id}>
                    <TableCell>{team.name}</TableCell>
                    <TableCell>{team.description || "-"}</TableCell>
                    <TableCell>
                      {team.members.map((member) => member.name).join(", ") || "-"}
                    </TableCell>
                    <TableCell>{team.createdBy?.name || "-"}</TableCell>
                    {(user.role === "admin" || user.role === "manager") && (
                      <TableCell>
                        <Tooltip title="Edit" placement="top" arrow>
                          <IconButton onClick={() => handleEditTeam(team)}>
                            <EditIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" placement="top" arrow>
                          <IconButton onClick={() => handleDeleteTeam(team._id)}>
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
        Total Teams: {totalTeams}
      </Typography>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        style={{ backdropFilter: "blur(3px)" }}
      >
        <DialogTitle>
          {/* {editTeam ? "Edit Team" : "Add Team"} */}
          <Stack direction="row" spacing={1} alignItems="center">
            {editTeam ? <EditIcon color="primary" /> : <AddCircleIcon color="primary" />}
            <Typography variant="h6" component="span" fontWeight="bold">
              {editTeam ? "Edit Team" : "Add Team"}
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmitTeam}
            id="team-form"
            sx={{
              mt: 1,
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 2,
            }}
          >
            <TextField
              label="Team Name"
              name="name"
              value={newTeam.name}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              label="Description"
              name="description"
              value={newTeam.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description}
            />

            <FormControl fullWidth>
              <InputLabel>Members</InputLabel>
              <Select
                multiple
                name="members"
                value={newTeam.members}
                onChange={handleMembersChange}
                label="Members"
              >
                {users.map((u) => (
                  <MenuItem key={u._id} value={u._id}>
                    {u.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="team-form"
            variant="contained"
            loading={actionLoading}
            loadingPosition="end"
          >
            {editTeam ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
