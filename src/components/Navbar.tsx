import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

/**
 * Lightweight classname utility — joins truthy strings with a space.
 * Replaces clsx / cn from shadcn without adding a dependency.
 */
const cn = (...classes: (string | boolean | undefined | null)[]) =>
  classes.filter(Boolean).join(' ');

/**
 * Top-level navigation items.
 * `href` can be a hash anchor (scrolls on the landing page) or a route path.
 *
 * NOTE: Hash links (#features, #solution, #about) only work on the landing
 * page. If you need them to scroll from other pages, consider programmatic
 * scrolling with react-router + useEffect.
 */
const menuItems = [
  { name: 'Features', href: '#features' },
  { name: 'Solution', href: '#solution' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About', href: '#about' },
];

/**
 * Navbar — Fixed, floating navigation bar.
 *
 * Behaviour:
 * - Starts transparent and full-width.
 * - On scroll (> 50 px) it compacts into a frosted-glass pill (backdrop-blur).
 * - On mobile (< lg) a hamburger opens a full-width dropdown panel.
 * - Auth-aware: shows Dashboard/Profile/Logout when logged in,
 *   or Login/Sign Up/Get Started when logged out.
 */
const Navbar: React.FC = () => {
  const { user, isAuthenticated, isGuest, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();



  /** Whether the mobile dropdown is open. */
  const [menuState, setMenuState] = useState(false);

  /** Whether the user has scrolled past the threshold (50 px). */
  const [isScrolled, setIsScrolled] = useState(false);

  // ── Scroll listener — adds compact glass style on scroll ──────────────
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 58);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Close the mobile menu on route change ─────────────────────────────
  // BUG FIX: Previously the mobile menu stayed open when navigating via
  // a menu link. Every <Link> now calls setMenuState(false) on click.

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuState(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        // If not on homepage, let the Link navigate to /#section naturally
        // But since we want to scroll after navigating, we'll let react-router handle the route change
        // We'll just close the menu.
        setMenuState(false);
      } else {
        // If already on homepage, smoothly scroll to the section
        e.preventDefault();
        const elementId = href.substring(1);
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        setMenuState(false);
      }
    } else {
      setMenuState(false);
    }
  };

  const hideOnRoutes = ['/login', '/register', '/password-reset', '/builder', '/profile'];
  if (hideOnRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <header>
      <nav
        data-state={menuState ? 'active' : 'inactive'}
        className={cn(
          "fixed z-50 w-full group left-0 transition-all duration-300",
          isScrolled ? 'top-4 px-4' : 'top-0'
        )}
      >
        {/* ── Inner container — animates between full-width and compact pill ── */}
        <div
          className={cn(
            'transition-all duration-300 mx-auto',
            isScrolled
              ? 'bg-[#12141D]/90 max-w-5xl rounded-[20px] backdrop-blur-xl py-2.5 shadow-xl'
              : 'w-full bg-transparent py-5'
          )}
        >
          <div className="px-6 lg:px-8 relative flex flex-wrap items-center justify-between gap-6 lg:gap-0">

            {/* ── Left: Logo + Mobile toggle ──────────────────────────── */}
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                to="/"
                className="flex items-center gap-2.5 group/logo"
                onClick={() => setMenuState(false)}
              >
                <div className="w-8 h-8 bg-red-500 rounded-lg shadow-sm transition-transform hover:scale-105" />
              </Link>

              {/* Hamburger / Close — visible only on mobile (< lg) */}
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-white"
              >
                {/* Menu icon — fades out when open */}
                <Menu
                  className={cn(
                    'm-auto size-6 duration-200 transition-all',
                    menuState ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                  )}
                />
                {/* X icon — fades in when open (absolutely positioned on top) */}
                <X
                  className={cn(
                    'absolute inset-0 m-auto size-6 duration-200 transition-all',
                    menuState
                      ? 'rotate-0 scale-100 opacity-100'
                      : '-rotate-180 scale-0 opacity-0'
                  )}
                />
              </button>
            </div>

            {/* ── Centre: Desktop navigation links ────────────────────── */}
            <div className="absolute inset-0 m-auto hidden size-fit lg:flex items-center">
              <ul className="flex gap-8 text-sm font-medium">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href.startsWith('#') && location.pathname !== '/' ? `/${item.href}` : item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="text-surface-300 hover:text-white transition-colors duration-150 block"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Right: Auth buttons + mobile dropdown ───────────────── */}
            <div
              className={cn(
                'bg-surface-900 mb-6 w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-surface-700/50 p-6 shadow-2xl',
                'md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0',
                'lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none',
                menuState ? 'block lg:flex' : 'hidden'
              )}
            >
              {/* Mobile-only duplicate of the nav links (hidden on desktop) */}
              <div className="lg:hidden">
                <ul className="space-y-6 text-base font-medium">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.href.startsWith('#') && location.pathname !== '/' ? `/${item.href}` : item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className="text-surface-300 hover:text-white transition-colors duration-150 block"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── Auth-dependent buttons ──────────────────────────── */}
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit items-center">
                {isAuthenticated ? (
                  <>
                    {/* Dashboard + profile/logout — hidden when scrolled (on desktop) */}
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuState(false)}
                      className={cn(
                        'px-4 py-2 text-sm font-medium rounded-xl border border-surface-700 text-white hover:bg-surface-800 transition-colors flex items-center justify-center gap-2',
                        isScrolled && 'lg:hidden'
                      )}
                    >
                      <Sparkles size={14} />
                      <span>Dashboard</span>
                    </Link>

                    <div
                      className={cn(
                        'flex items-center gap-2',
                        isScrolled && 'lg:hidden'
                      )}
                    >
                      {isGuest ? (
                        <span className="text-xs px-2 py-1 rounded-md bg-surface-800 border border-surface-700 text-surface-300">
                          Guest
                        </span>
                      ) : (
                        <Link
                          to="/profile"
                          onClick={() => setMenuState(false)}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-800 border border-surface-700 hover:border-brand-500 transition-colors"
                        >
                          {user?.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt="Profile"
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <UserIcon size={14} className="text-surface-300" />
                          )}
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="text-surface-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-surface-800 transition-colors"
                        aria-label="Sign Out"
                      >
                        <LogOut size={16} />
                      </button>
                    </div>

                    {/*
                     * Compact "Dashboard" pill — only visible when scrolled
                     * on desktop. Replaces the expanded button set above.
                     */}
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuState(false)}
                      className={cn(
                        'px-4 py-2 text-sm font-medium rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors text-center flex items-center gap-2',
                        isScrolled ? 'lg:inline-flex' : 'hidden'
                      )}
                    >
                      <Sparkles size={14} />
                      <span>Dashboard</span>
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Login + Sign Up — hidden when scrolled (on desktop) */}
                    <Link
                      to="/login"
                      onClick={() => setMenuState(false)}
                      className={cn(
                        'px-4 py-2 text-sm font-medium rounded-xl border border-surface-700/50 text-white hover:bg-surface-800 transition-colors text-center w-full sm:w-auto',
                        isScrolled && 'lg:hidden'
                      )}
                    >
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuState(false)}
                      className={cn(
                        'px-4 py-2 text-sm font-medium rounded-xl bg-white text-black hover:bg-gray-200 transition-colors text-center w-full sm:w-auto',
                        isScrolled && 'lg:hidden'
                      )}
                    >
                      <span>Sign Up</span>
                    </Link>

                    {/*
                     * Compact "Get Started" pill — only visible when scrolled
                     * on desktop. Replaces Login + Sign Up above.
                     */}
                    <Link
                      to={location.pathname !== '/' ? '/#solution' : '#solution'}
                      onClick={(e) => handleNavClick(e, '#solution')}
                      className={cn(
                        'px-4 py-2 text-sm font-medium rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/20 transition-colors text-center w-full sm:w-auto',
                        isScrolled ? 'lg:inline-flex' : 'hidden'
                      )}
                    >
                      <span>Get Started</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
