import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiDashboardLine, RiContactsLine, RiDashboard3Line, RiBarChartLine,
  RiBellLine, RiSettings3Line, RiLogoutBoxLine, RiDashboardFill } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { to: '/leads', icon: RiContactsLine, label: 'Leads' },
  { to: '/kanban', icon: RiDashboard3Line, label: 'Kanban Board' },
  { to: '/analytics', icon: RiBarChartLine, label: 'Analytics' },
  { to: '/notifications', icon: RiBellLine, label: 'Notifications' },
  { to: '/settings', icon: RiSettings3Line, label: 'Settings' },
];

export default function Sidebar({ open, setOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-700">
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <RiDashboardFill className="text-white text-lg" />
        </div>
        <div>
          <p className="font-bold text-slate-800 dark:text-white text-sm">LeadFlow</p>
          <p className="text-xs text-slate-400">CRM System</p>
        </div>
      </div>
      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-white'
              }`
            }>
            <Icon className="text-lg flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      {/* User */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-3 px-2">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}&backgroundColor=6366f1`}
            alt="avatar" className="w-8 h-8 rounded-full"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
          <RiLogoutBoxLine /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex w-60 flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-shrink-0">
        <SidebarContent />
      </div>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-800 z-50 md:hidden shadow-2xl">
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
