"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Alert, Snackbar } from "@mui/material";

let socket = null;
const initializeSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export default function Notification({ userId, onTaskUpdate, onTeamUpdate }) {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!userId) {
      console.log("No userId provided, skipping WebSocket setup");
      return;
    }

    console.log("Setting up WebSocket for user:", userId);
    
    const socketInstance = initializeSocket();

    if (!socketInstance.connected) {
      socketInstance.connect();
    }

    socketInstance.emit("join", userId);

    const handleTaskUpdated = (data) => {
      console.log("Received taskUpdated event:", data);
      setMessage(data.message);
      setOpen(true);
      if (onTaskUpdate) {
        console.log("Calling onTaskUpdate callback");
        onTaskUpdate();
      }
    };

    const handleTaskAssigned = (data) => {
      console.log("Received taskAssigned event:", data);
      setMessage(data.message);
      setOpen(true);
      if (onTaskUpdate) {
        console.log("Calling onTaskUpdate callback");
        onTaskUpdate();
      }
    };

    const handleTaskUnassigned = (data) => {
      console.log("Received taskUnassigned event:", data);
      setMessage(data.message);
      setOpen(true);
      if (onTaskUpdate) {
        console.log("Calling onTaskUpdate callback");
        onTaskUpdate();
      }
    };

    const handleTaskAssignedToTeam = (data) => {
      console.log("Received taskAssignedToTeam event:", data);
      setMessage(data.message);
      setOpen(true);
      if (onTaskUpdate) {
        console.log("Calling onTaskUpdate callback");
        onTaskUpdate();
      }
    };

    const handleTeamAdded = (data) => {
      console.log("Received teamAdded event:", data);
      setMessage(data.message);
      setOpen(true);
      if (onTeamUpdate) {
        console.log("Calling onTeamUpdate callback");
        onTeamUpdate();
      }
    };

    const handleTeamRemoved = (data) => {
      console.log("Received teamRemoved event:", data);
      setMessage(data.message);
      setOpen(true);
      if (onTeamUpdate) {
        console.log("Calling onTeamUpdate callback");
        onTeamUpdate();
      }
    };

    const handleTeamUpdated = (data) => {
      console.log("Received teamUpdated event:", data);
      setMessage(data.message);
      setOpen(true);
      if (onTeamUpdate) {
        console.log("Calling onTeamUpdate callback");
        onTeamUpdate();
      }
    };

    socketInstance.on("taskUpdated", handleTaskUpdated);
    socketInstance.on("taskAssigned", handleTaskAssigned);
    socketInstance.on("taskUnassigned", handleTaskUnassigned);
    socketInstance.on("taskAssignedToTeam", handleTaskAssignedToTeam);
    socketInstance.on("teamAdded", handleTeamAdded);
    socketInstance.on("teamRemoved", handleTeamRemoved);
    socketInstance.on("teamUpdated", handleTeamUpdated);

    return () => {
      console.log("Cleaning up WebSocket listeners for user:", userId);
      socketInstance.off("taskUpdated", handleTaskUpdated);
      socketInstance.off("taskAssigned", handleTaskAssigned);
      socketInstance.off("taskUnassigned", handleTaskUnassigned);
      socketInstance.off("taskAssignedToTeam", handleTaskAssignedToTeam);
      socketInstance.off("teamAdded", handleTeamAdded);
      socketInstance.off("teamRemoved", handleTeamRemoved);
      socketInstance.off("teamUpdated", handleTeamUpdated);
    };
  }, [userId, onTaskUpdate, onTeamUpdate]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity="info"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}