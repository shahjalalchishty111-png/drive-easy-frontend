import { useState } from 'react';
import { Outlet, NavLink, useNavigate, ScrollRestoration, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from '../lib/toast';
import {
  Car, LayoutDashboard, CalendarCheck, Settings,
  LogOut, Menu, Sun, Moon, Bell, ChevronRight,
  Users, Building2, PlusCircle, ListChecks, User, Star,
} from 'lucide-react';
import useTheme from '../hooks/useTheme';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';

const navByRole = {
  user: [
    { to: '/dashboard/user', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/user/bookings', label: 'My Bookings', icon: CalendarCheck },
    { to: '/dashboard/user/reviews', label: 'My Reviews', icon: Star },
    { to: '/dashboard/user/settings', label: 'Settings', icon: Settings },
  ],
  admin: [
    { to: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/admin/users', label: 'Users', icon: Users },
    { to: '/dashboard/admin/bookings', label: 'All Bookings', icon: CalendarCheck },
    { to: '/dashboard/admin/cars', label: 'Fleet', icon: Car },
    { to: '/dashboard/admin/reviews', label: 'Reviews', icon: Star },
    { to: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
  ],
  agency: [
    { to: '/dashboard/agency', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/agency/fleet', label: 'My Fleet', icon: Car },
    { to: '/dashboard/agency/add-car', label: 'Add Car', icon: PlusCircle },
    { to: '/dashboard/agency/bookings', label: 'Bookings', icon: ListChecks },
    { to: '/dashboard/agency/reviews', label: 'Reviews', icon: Star },
    { to: '/dashboard/agency/settings', label: 'Settings', icon: Building2 },
  ],
};

const roleMeta = {
  user: { label: 'Customer', color: 'text-brand-500', bg: 'bg-brand-500' },
  admin: { label: 'Administrator', color: 'text-red-500', bg: 'bg-red-500' },
  agency: { label: 'Agency Partner', color: 'text-emerald-500', bg: 'bg-emerald-500' },
};

function Avatar({ photoURL, name, className = 'w-10 h-10' }) {
  return photoURL ? (
    <img src={photoURL} alt={name} className={`${className} rounded-xl object-cover`} referrerPolicy="no-referrer" />
  ) : (
    <div className={`${className} rounded-xl brand-gradient flex items-center justify-center`}>
      <User size={16} className="text-white" />
    </div>
  );
}

function Sidebar({ navItems, meta, displayName, photoURL, theme, toggleTheme, onLogout, onNavigate }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-[#1e2d47]">
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 brand-gradient rounded-lg flex items-center justify-center">
            <Car size={15} className="text-white" />
          </div>
          <span className="font-display font-black tracking-tighter text-slate-900 dark:text-white">
            Drive<span className="text-brand-600 dark:text-brand-400">Easy</span>
          </span>
        </NavLink>
      </div>

      {/* User Profile */}
      <div className="px-4 py-4 mx-2 mt-4 rounded-2xl bg-slate-50 dark:bg-[#0d1930]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar photoURL={photoURL} name={displayName} />
            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${meta.bg} border-2 border-white dark:border-[#0d1930] rounded-full`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{displayName}</p>
            <p className={`text-xs font-medium ${meta.color}`}>{meta.label}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2640] hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="opacity-60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-[#1e2d47] space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2640] transition-all"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const { theme, toggleTheme } = useTheme();
  const { user, logOut } = useAuth();
  const { role, dbUser } = useUserRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = navByRole[role] || navByRole.user;
  const meta = roleMeta[role] || roleMeta.user;
  const displayName = dbUser?.name || user?.displayName || 'DriveEasy User';
  const photoURL = user?.photoURL || dbUser?.photoURL;

  const handleLogout = async () => {
    setSidebarOpen(false);
    await logOut();
    toast.success('Logged out');
    navigate('/');
  };

  const sidebarProps = {
    navItems, meta, displayName, photoURL, theme, toggleTheme,
    onLogout: handleLogout, onNavigate: () => setSidebarOpen(false),
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0b1326]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white dark:bg-[#0d1930] border-r border-slate-200 dark:border-[#1e2d47] fixed h-full">
        <Sidebar {...sidebarProps} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 bg-white dark:bg-[#0d1930] z-50 border-r border-slate-200 dark:border-[#1e2d47]"
            >
              <Sidebar {...sidebarProps} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#0d1930]/80 glass border-b border-slate-200 dark:border-[#1e2d47] flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-[#131b2e] text-slate-700 dark:text-slate-300"
          >
            <Menu size={18} />
          </button>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-[#131b2e] text-slate-600 dark:text-slate-400">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Link to={`/dashboard/${role}/settings`} className="ring-2 ring-brand-500/30 rounded-xl">
              <Avatar photoURL={photoURL} name={displayName} className="w-9 h-9" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-5 sm:p-6">
          <Outlet />
        </main>
      </div>
      <ScrollRestoration />
    </div>
  );
}
