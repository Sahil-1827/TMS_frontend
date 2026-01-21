import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Skeleton,
} from "@mui/material";
import api from "../api";
import { toast } from 'react-toastify';

export default function Profile() {
  const { user, loading, setUser } = useAuth();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Name is required";
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
    if (user) {
      setFormData({ name: user.name, email: user.email });
      setPreviewUrl(user.profilePicture || null);
    }
  }, [user, loading, navigate]);

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleEditProfile = () => {
    setErrors({});
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setErrors({});
    setSelectedImage(null);
    setPreviewUrl(user?.profilePicture || null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!validate()) return;

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      if (selectedImage) {
        data.append("profilePicture", selectedImage);
      }

      const response = await api.put(
        "/users/profile",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      toast.success("Profile updated successfully");
      setOpenDialog(false);
      setSelectedImage(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading || !user) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 1, sm: 2, md: 3 } }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          User Profile
        </Typography>
        <Paper sx={{ p: { xs: 2, md: 4 } }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Skeleton variant="circular" width={80} height={80} sx={{ mr: 2 }} />
            <Box>
              <Skeleton variant="text" width={150} height={30} />
              <Skeleton variant="text" width={100} height={20} />
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> <Skeleton variant="text" width={200} />
            </Typography>
            <Typography variant="body1">
              <strong>Joined:</strong> <Skeleton variant="text" width={150} />
            </Typography>
          </Box>

          <Skeleton variant="rectangular" width={120} height={36} />
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="2xl" sx={{ py: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        User Profile
      </Typography>
      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Avatar
            src={user.profilePicture}
            alt={user.name}
            sx={{
              width: 80,
              height: 80,
              bgcolor: "primary.main",
              fontSize: "1.5rem",
            }}
          >
            {!user.profilePicture && getInitials(user.name)}
          </Avatar>
          <Box>
            <Typography variant="h6">{user.name}</Typography>
            <Typography color="textSecondary" sx={{ textTransform: 'capitalize' }}>{user.role}</Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant="body1">
            <strong>Joined:</strong>{" "}
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Not available"}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleEditProfile}
        >
          Edit Profile
        </Button>
      </Paper>

      <Dialog open={openDialog} onClose={handleClose} style={{ backdropFilter: "blur(3px)" }}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={previewUrl}
              sx={{ width: 100, height: 100, mb: 2 }}
            >
              {!previewUrl && getInitials(formData.name)}
            </Avatar>
            <Button
              variant="outlined"
              component="label"
            >
              Upload Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
