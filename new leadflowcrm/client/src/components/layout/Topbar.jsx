import { RiMenuLine, RiMoonLine, RiSunLine, RiBellLine } from 'react-icons/ri';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/leads': 'Lead Management',
  '/kanban': 'Kanban Board',
  '/analytics': 'Analytics',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
};

export default function Topbar({ onMenuClick }) {
  const { dark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const title = pageTitles[location.pathname] || 'LeadFlow CRM';

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 md:px-6 py-3 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
          <RiMenuLine className="text-xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition">
          <RiBellLine className="text-xl" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition">
          {dark ? <RiSunLine className="text-xl" /> : <RiMoonLine className="text-xl" />}
        </button>
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}&backgroundColor=6366f1`}
          alt="avatar" className="w-8 h-8 rounded-full cursor-pointer"
          onClick={() => navigate('/settings')}
        />
      </div>
    </header>
  );
}
