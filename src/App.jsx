import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import ActivityLog from './pages/ActivityLog';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import LearnMore from './pages/LearnMore';
import Login from './pages/Login';
import Privacy from './pages/Privacy';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Tasks from './pages/Tasks';
import EditTask from './pages/EditTask';
import Teams from './pages/Teams';
import Terms from './pages/Terms';
import Users from './pages/Users';
import Board from './pages/Board';
import { AuthProvider } from "./context/AuthContext";
import { ThemeProviderWrapper } from "./context/ThemeContext";
import { ActivityLogProvider } from "./context/ActivityLogContext";
import { NotificationProvider } from "./context/NotificationContext";
import { GlobalLoaderProvider } from "./context/GlobalLoaderContext";
import ThemedToastContainer from './components/ThemedToastContainer';
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProviderWrapper>
          <GlobalLoaderProvider>
            <NotificationProvider>
              <ActivityLogProvider>
                <Routes>
                  <Route element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="activity-log" element={<ActivityLog />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="learn-more" element={<LearnMore />} />
                    <Route path="login" element={<Login />} />
                    <Route path="privacy" element={<Privacy />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="tasks" element={<Tasks />} />
                    <Route path="board" element={<Board />} />
                    <Route path="tasks/edit/:id" element={<EditTask />} />
                    <Route path="teams" element={<Teams />} />
                    <Route path="terms" element={<Terms />} />
                    <Route path="users" element={<Users />} />
                  </Route>
                </Routes>
                <ThemedToastContainer />
              </ActivityLogProvider>
            </NotificationProvider>
          </GlobalLoaderProvider>
        </ThemeProviderWrapper>
      </AuthProvider>
    </Router>
  );
}

export default App;
