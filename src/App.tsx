/**
 * App.tsx
 * 
 * Root application component. Handles the main routing structure:
 * - Public routes: Landing page, auth pages, pricing
 * - Protected routes: Dashboard, Builder
 * - Shared components: Navbar (global)
 */
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import NewHeroPage from './pages/NewHeroPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PasswordResetPage from './pages/PasswordResetPage';
import BuilderPage from './pages/BuilderPage';
import PricingPage from './pages/PricingPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import BackgroundEffects from './components/BackgroundEffects';
import FigmaDesignPage from './pages/FigmaDesignPage';

function App() {
  const { checkAuth } = useAuthStore();
  const location = useLocation();

  // Check for existing auth token on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle OAuth callback — extract token from URL hash
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    if (token) {
      useAuthStore.getState().setToken(token);
      useAuthStore.getState().checkAuth();
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen bg-surface-950 relative">
      <BackgroundEffects />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<FigmaDesignPage />} />
          <Route path="/old-landing" element={<LandingPage />} />
          <Route path="/hero-test" element={<NewHeroPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/password-reset" element={<PasswordResetPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route
            path="/builder"
            element={
              <ProtectedRoute>
                <BuilderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;