import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      api.get("/auth/me")
        .then(({ data }) => {
          if (data && data.isActive === false) {
            setToken(null);
            setUser(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toast.error("You are deactivated by admin");
            navigate("/");
          } else {
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user profile:", err);
          if (err.response?.status === 401) {
            setToken(null);
            setUser(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { data } = response;
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/tasks");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const verifyUserStatus = async () => {
    if (!token) return;
    try {
      const { data } = await api.get("/auth/me");
      if (data && data.isActive === false) {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("You are deactivated by admin");
        navigate("/");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser, verifyUserStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
