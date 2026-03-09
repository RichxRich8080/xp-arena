import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AreniProvider } from './context/AreniContext';
import MobileAppShell from './layouts/MobileAppShell';
import { ThemeEngine } from './utils/ThemeEngine';

// Lazy loaded feature pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tool = lazy(() => import('./pages/Tool'));
const Shop = lazy(() => import('./pages/Shop'));
const Vault = lazy(() => import('./pages/Vault'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Quests = lazy(() => import('./pages/Quests'));
const Premium = lazy(() => import('./pages/Premium'));
const Ecosystem = lazy(() => import('./pages/Ecosystem'));
const Profile = lazy(() => import('./pages/Profile'));
const Tournaments = lazy(() => import('./pages/Tournaments'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Result = lazy(() => import('./pages/Result'));
const Presets = lazy(() => import('./pages/Presets'));
const Mystery = lazy(() => import('./pages/Mystery'));
const Clips = lazy(() => import('./pages/Clips'));
const Submit = lazy(() => import('./pages/Submit'));
const DailyLogin = lazy(() => import('./pages/DailyLogin'));
const Ranks = lazy(() => import('./pages/Leaderboard')); // Reusing Leaderboard for Ranks per blueprint
const Guilds = lazy(() => import('./pages/Guilds'));
const Sponsors = lazy(() => import('./pages/Sponsors'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Support = lazy(() => import('./pages/Support'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const MyData = lazy(() => import('./pages/MyData'));
const Compare = lazy(() => import('./pages/Compare'));
const StylePreview = lazy(() => import('./pages/StylePreview'));

function App() {
  React.useEffect(() => {
    ThemeEngine.init();
  }, []);

  return (
    <AreniProvider>
      <Router>
        <MobileAppShell>
          <Suspense fallback={
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-cyan-400 rounded-full animate-spin"></div>
              <div className="mt-4 text-xs font-bold text-gray-400 tracking-widest uppercase">Initializing Module...</div>
            </div>
          }>
            <Routes>
              {/* Core Routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/tool" element={<Tool />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/vault" element={<Vault />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/quests" element={<Quests />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/ecosystem" element={<Ecosystem />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/guilds" element={<Guilds />} />

              {/* Scaffolded 28-Page Rebirth Routes */}
              <Route path="/ranks" element={<Leaderboard />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/support" element={<Support />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/daily-login" element={<DailyLogin />} />
              <Route path="/clips" element={<Clips />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/mydata" element={<MyData />} />
              <Route path="/mystery" element={<Mystery />} />
              <Route path="/submit" element={<Submit />} />
              <Route path="/result" element={<Result />} />
              <Route path="/presets" element={<Presets />} />
              <Route path="/style-preview" element={<StylePreview />} />

              {/* 404 Fallback */}
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </MobileAppShell>
      </Router>
    </AreniProvider>
  );
}

export default App;
