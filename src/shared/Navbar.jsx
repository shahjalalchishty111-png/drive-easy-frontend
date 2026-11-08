import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, LayoutDashboard, LogOut, User, Car } from 'lucide-react';
import useTheme from '../hooks/useTheme';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import toast from '../lib/toast';

const dashboardLinks = {
  user: '/dashboard/user',
  admin: '/dashboard/admin',
  agency: '/dashboard/agency',
};

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/cars', label: 'Cars' },
  { to: '/about', label: 'About' },
];

function AvatarImage({ user, size = 'sm' }) {
  const cls = size === 'lg' ? 'w-10 h-10' : 'w-9 h-9';
  return (
    <div className={`${cls} rounded-full ring-2 ring-brand-500/40 overflow-hidden shrink-0`}>
      {user?.photoURL ? (
        <img
          src={user.photoURL}
          alt={user.displayName || 'User'}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full brand-gradient flex items-center justify-center">
          <User size={size === 'lg' ? 18 : 15} className="text-white" />
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logOut } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dashLink = dashboardLinks[role] || '/dashboard/user';
  const settingsLink = `${dashLink}/settings`;

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    await logOut();
    toast.success('Logged out', 'You have been signed out successfully.');
    navigate('/');
  };


  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-[#0b1326]/95 backdrop-blur-md shadow-sm shadow-black/5 dark:shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 brand-gradient rounded-xl flex items-center justify-center shadow-md shadow-brand-600/30 group-hover:scale-110 transition-transform">
            <Car size={16} className="text-white sm:hidden" />
            <Car size={18} className="text-white hidden sm:block" />
          </div>
          <span className="text-lg sm:text-xl font-black tracking-tighter font-display text-slate-900 dark:text-white">
            Drive<span className="text-brand-600 dark:text-brand-400">Easy</span>
          </span>
        </Link>

        {/* ── Desktop Nav links ── */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* ── Right Controls ── */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Theme Toggle — always visible */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-[#131b2e] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#1a2640] transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            /* ── Avatar + dropdown (desktop) ── */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="rounded-full ring-2 ring-brand-500/40 hover:ring-brand-500 transition-all overflow-hidden focus:outline-none focus-visible:ring-brand-500"
                aria-label="Open user menu"
                aria-expanded={dropdownOpen}
              >
                <AvatarImage user={user} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#0d1930] border border-slate-200 dark:border-[#1e2d47] rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-[#1e2d47]">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {user.displayName || 'User'}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                    </div>

                    <div className="p-2">
                      <Link
                        to={settingsLink}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2640] transition-all"
                      >
                        <User size={15} className="text-slate-400 shrink-0" />
                        Profile
                      </Link>

                      <Link
                        to={dashLink}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2640] transition-all"
                      >
                        <LayoutDashboard size={15} className="text-slate-400 shrink-0" />
                        Dashboard
                      </Link>

                      <hr className="my-1.5 border-slate-100 dark:border-[#1e2d47]" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      >
                        <LogOut size={15} className="shrink-0" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* ── Login button (desktop only) ── */
            <Link
              to="/login"
              className="hidden md:flex btn-primary text-sm px-4 py-2 lg:px-5 lg:py-2.5 whitespace-nowrap"
            >
              Login
            </Link>
          )}

          {/* ── Hamburger (mobile only) ── */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-[#131b2e] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1a2640] transition-all"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
            className="md:hidden bg-white dark:bg-[#0d1930] border-t border-slate-200 dark:border-[#1e2d47]"
          >
            <div className="px-4 pb-5 pt-2 space-y-1">

              {/* Nav links */}
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2640]'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              <div className="pt-2 border-t border-slate-100 dark:border-[#1e2d47]">
                {user ? (
                  <div className="space-y-1">
                    {/* User card */}
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 dark:bg-[#131b2e]">
                      <AvatarImage user={user} size="lg" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {user.displayName || 'User'}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>

                    <Link
                      to={settingsLink}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2640] transition-all"
                    >
                      <User size={16} className="text-slate-400 shrink-0" />
                      Profile
                    </Link>

                    <Link
                      to={dashLink}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2640] transition-all"
                    >
                      <LayoutDashboard size={16} className="text-slate-400 shrink-0" />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <LogOut size={16} className="shrink-0" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 btn-primary w-full text-sm py-3 mt-1"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
