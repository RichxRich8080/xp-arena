import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ui/ScrollToTop';

// Core Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Sensitivity / Tool Pages
import Tool from './pages/Tool';
import Result from './pages/Result';
import GenerateSensitivity from './pages/GenerateSensitivity';
import Generating from './pages/Generating';
import SensitivityResult from './pages/SensitivityResult';
import EliteForge from './pages/EliteForge';
import EliteResult from './pages/EliteResult';
import SubmitSetup from './pages/SubmitSetup';

// Community / Progression Pages
import Leaderboard from './pages/Leaderboard';
import Guilds from './pages/Guilds';
import History from './pages/History';
import Quests from './pages/Quests';
import DailyLogin from './pages/DailyLogin';
import Mystery from './pages/Mystery';
import Tournaments from './pages/Tournaments';
import Ecosystem from './pages/Ecosystem';

// Utility Pages
import About from './pages/About';
import Support from './pages/Support';
import Contact from './pages/Contact';
import Premium from './pages/Premium';
import StylePreview from './pages/StylePreview';
import PlaceholderPage from './pages/PlaceholderPage';

import { useAuth } from './hooks/useAuth';

function RouteLoading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-slate-700 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Loading...</p>
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
    <>
      <ScrollToTop />
      <Routes>
        {/* Auth Entry Points */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Main App Canvas */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {/* Core Dashboard & Profiling */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          
          {/* Sensitivity & Calibration */}
          <Route path="/tool" element={<Tool />} />
          <Route path="/result" element={<Result />} />
          <Route path="/generate-sensitivity" element={<GenerateSensitivity />} />
          <Route path="/generating" element={<Generating />} />
          <Route path="/sensitivity-result" element={<SensitivityResult />} />
          <Route path="/elite-forge" element={<PrivateRoute><EliteForge /></PrivateRoute>} />
          <Route path="/elite-result" element={<EliteResult />} />
          
          {/* Content & Submission */}
          <Route path="/submit" element={<PrivateRoute><SubmitSetup /></PrivateRoute>} />
          
          {/* Progression & Social */}
          <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="/guilds" element={<PrivateRoute><Guilds /></PrivateRoute>} />
          <Route path="/clans" element={<Navigate to="/guilds" replace />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/quests" element={<PrivateRoute><Quests /></PrivateRoute>} />
          <Route path="/daily-login" element={<PrivateRoute><DailyLogin /></PrivateRoute>} />
          <Route path="/mystery" element={<PrivateRoute><Mystery /></PrivateRoute>} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/ecosystem" element={<Ecosystem />} />
          
          {/* Utility & Info */}
          <Route path="/premium" element={<Premium />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/style-preview" element={<StylePreview />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<PlaceholderPage />} />
      </Routes>
    </>
  );
}
