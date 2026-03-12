import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import SubmitSetup from './pages/SubmitSetup';
import GenerateSensitivity from './pages/GenerateSensitivity';
import Generating from './pages/Generating';
import SensitivityResult from './pages/SensitivityResult';
import History from './pages/History';
import Guilds from './pages/Guilds';
import Settings from './pages/Settings';
import PlaceholderPage from './pages/PlaceholderPage';
import { useAuth } from './hooks/useAuth';

function RouteLoading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">Checking session...</p>
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <RouteLoading />;

  return isAuthenticated
    ? children
    : <Navigate to="/login" replace state={{ from: location.pathname, reason: 'Please log in to continue.' }} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/submit" element={<PrivateRoute><SubmitSetup /></PrivateRoute>} />
        <Route path="/generate-sensitivity" element={<GenerateSensitivity />} />
        <Route path="/generating" element={<Generating />} />
        <Route path="/sensitivity-result" element={<SensitivityResult />} />
        <Route path="/history" element={<History />} />
        <Route path="/clans" element={<PrivateRoute><Guilds /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      </Route>

      <Route path="*" element={<PlaceholderPage />} />
    </Routes>
  );
}
