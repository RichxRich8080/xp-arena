import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import EliteForge from './pages/EliteForge';
import EliteResult from './pages/EliteResult';
import { useAuth } from './hooks/useAuth';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" />;
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

        {/* Phase 2: Sensitivity Generator */}
        <Route path="/generate-sensitivity" element={<GenerateSensitivity />} />
        <Route path="/generating" element={<Generating />} />
        <Route path="/sensitivity-result" element={<SensitivityResult />} />
        <Route path="/history" element={<History />} />
        <Route path="/elite-forge" element={<PrivateRoute><EliteForge /></PrivateRoute>} />
        <Route path="/elite-result" element={<PrivateRoute><EliteResult /></PrivateRoute>} />
      </Route>
    </Routes>
  );
}
