"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from "react";
import { activityLogService } from "../services/activityLogService";
import { useAuth } from "./AuthContext";

const ActivityLogContext = createContext();

export const ActivityLogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  const fetchLogs = useCallback(
    async (filters = {}) => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await activityLogService.getLogs(filters);
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user, fetchLogs]);


  return (
    <ActivityLogContext.Provider
      value={{
        logs,
        loading,
        fetchLogs,
      }}
    >
      {children}
    </ActivityLogContext.Provider>
  );
};

export const useActivityLog = () => useContext(ActivityLogContext);