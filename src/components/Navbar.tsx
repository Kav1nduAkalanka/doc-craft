import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  LogOut,
  User as UserIcon,
  CreditCard,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isGuest, logout } = useAuthStore();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };



  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-900/80 backdrop-blur-xl border-b border-surface-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" id="navbar-logo">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
              <FileText className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-white">
              Doc<span className="text-brand-400">Craft</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/pricing" className="text-sm font-medium text-surface-300 hover:text-white transition-colors" id="nav-pricing">
              Pricing
            </Link>

            <div className="h-4 w-px bg-surface-700/50" />

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="btn-primary text-sm !py-1.5 !px-4 shadow-sm" id="nav-builder">
                  <Sparkles size={14} />
                  Dashboard
                </Link>

                <div className="flex items-center gap-2">
                  {isGuest ? (
                    <span className="badge-free text-xs">Guest</span>
                  ) : (
                    <Link to="/profile" className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-800 border border-surface-700 hover:border-brand-500 transition-colors" id="nav-profile" title="Profile">
                      {user?.avatar_url ? (
                        <img src={user.avatar_url} alt="Profile" className="w-full h-full rounded-full" />
                      ) : (
                        <UserIcon size={14} className="text-surface-300" />
                      )}
                    </Link>
                  )}

                  <button onClick={handleLogout} className="text-surface-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-surface-800 transition-colors" id="nav-logout" title="Sign Out">
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-surface-300 hover:text-white transition-colors" id="nav-login">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm !py-1.5 !px-4 shadow-sm" id="nav-register">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden btn-ghost"
            onClick={() => setMobileOpen(!mobileOpen)}
            id="nav-mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-900 border-t border-surface-700/50 animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {isAuthenticated && (
              <Link
                to="/builder"
                className="block px-4 py-3 rounded-xl text-surface-200 hover:bg-surface-800 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <Sparkles size={18} className="text-brand-400" />
                  Create Document
                </div>
              </Link>
            )}
            <Link
              to="/pricing"
              className="block px-4 py-3 rounded-xl text-surface-200 hover:bg-surface-800 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <div className="flex items-center gap-3">
                <CreditCard size={18} className="text-brand-400" />
                Pricing
              </div>
            </Link>
            {isAuthenticated ? (
              <>
                {!isGuest && (
                  <Link
                    to="/profile"
                    className="block px-4 py-3 rounded-xl text-surface-200 hover:bg-surface-800 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <UserIcon size={18} className="text-brand-400" />
                      Profile
                    </div>
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-surface-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={18} />
                    Sign Out
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 rounded-xl text-surface-200 hover:bg-surface-800 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 rounded-xl bg-brand-600 text-white text-center font-semibold hover:bg-brand-500 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
