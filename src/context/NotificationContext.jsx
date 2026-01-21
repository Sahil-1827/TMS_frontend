"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from "react";
import { useAuth } from "./AuthContext";
import { io } from "socket.io-client";
import EditNoteIcon from "@mui/icons-material/EditNote";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import GroupsIcon from "@mui/icons-material/Groups";
import CelebrationIcon from "@mui/icons-material/Celebration";
import DeleteIcon from "@mui/icons-material/Delete";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import NotificationsIcon from "@mui/icons-material/Notifications";

let socket = null;
const initializeSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    socket.on("connect", () => console.log("Socket Connected:", socket.id));
    socket.on("connect_error", (err) => console.log("Socket Connection Error:", err));
  }
  return socket;
};

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const [updateCallbacks, setUpdateCallbacks] = useState({});
  const [notificationSoundEnabled, setNotificationSoundEnabled] = useState(true);

  const toggleNotificationSound = useCallback(() => {
    setNotificationSoundEnabled((prev) => !prev);
  }, []);

  const registerUpdateCallback = useCallback((key, callback) => {
    setUpdateCallbacks((prev) => ({ ...prev, [key]: callback }));
  }, []);

  const unregisterUpdateCallback = useCallback((key) => {
    setUpdateCallbacks((prev) => {
      const newCallbacks = { ...prev };
      delete newCallbacks[key];
      return newCallbacks;
    });
  }, []);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      ...notification,
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, 20));
    setUnreadCount((prev) => prev + 1);

    if (notificationSoundEnabled) {
      const audio = new Audio('/bell.mp3');
      audio.play().catch(e => console.error("Error playing notification sound:", e));
    }
  }, [notificationSoundEnabled]);

  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId && !notif.read
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const addTestNotification = useCallback(() => {
    addNotification({
      type: "test",
      title: "Test Notification",
      message: "This is a test notification to check the system.",
      icon: <NotificationsIcon />
    });
  }, [addNotification]);

  useEffect(() => {
    const userId = user?.id || user?._id;
    if (!userId) return;

    const socketInstance = initializeSocket();

    if (!socketInstance.connected) socketInstance.connect();

    socketInstance.emit("join", userId);

    const createHandler = (entityType, title, icon) => (data) => {
      addNotification({ type: entityType, title, message: data.message, icon });
      Object.values(updateCallbacks).forEach((cb) => cb(entityType));
    };

    const onTaskUpdated = createHandler(
      "task",
      "Task Updated",
      <EditNoteIcon />
    );
    const onTaskAssigned = createHandler(
      "task",
      "Task Assigned",
      <TaskAltIcon />
    );
    const onTaskUnassigned = createHandler(
      "task",
      "Task Unassigned",
      <CancelIcon />
    );
    const onTaskAssignedToTeam = createHandler(
      "task",
      "Task Assigned to Team",
      <GroupsIcon />
    );

    const onTeamAdded = createHandler(
      "team",
      "Team Added",
      <CelebrationIcon />
    );
    const onTeamRemoved = createHandler("team", "Team Removed", <DeleteIcon />);
    const onTeamUpdated = createHandler(
      "team",
      "Team Updated",
      <AutorenewIcon />
    );

    socketInstance.on("taskUpdated", onTaskUpdated);
    socketInstance.on("taskAssigned", onTaskAssigned);
    socketInstance.on("taskUnassigned", onTaskUnassigned);
    socketInstance.on("taskAssignedToTeam", onTaskAssignedToTeam);
    socketInstance.on("teamAdded", onTeamAdded);
    socketInstance.on("teamRemoved", onTeamRemoved);
    socketInstance.on("teamUpdated", onTeamUpdated);

    socketInstance.on("activityUpdate", () => {
      Object.values(updateCallbacks).forEach((cb) => cb("generic"));
    });

    return () => {
      socketInstance.off("taskUpdated", onTaskUpdated);
      socketInstance.off("taskAssigned", onTaskAssigned);
      socketInstance.off("taskUnassigned", onTaskUnassigned);
      socketInstance.off("taskAssignedToTeam", onTaskAssignedToTeam);
      socketInstance.off("teamAdded", onTeamAdded);
      socketInstance.off("teamRemoved", onTeamRemoved);
      socketInstance.off("teamUpdated", onTeamUpdated);
      socketInstance.off("activityUpdate");
    };
  }, [user, addNotification, updateCallbacks]);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    addTestNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    registerUpdateCallback,
    unregisterUpdateCallback,
    notificationSoundEnabled,
    toggleNotificationSound,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
