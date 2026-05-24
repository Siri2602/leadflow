import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { RiMoonLine, RiSunLine, RiUserLine, RiLockLine } from 'react-icons/ri';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [name, setName] = useState(user?.name || '');

  return (
    <div className="max-w-2xl space-y-5">
      {/* Profile */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <RiUserLine className="text-indigo-500 text-xl" />
          <h2 className="font-bold text-slate-800 dark:text-white">Profile</h2>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}&backgroundColor=6366f1`}
            className="w-16 h-16 rounded-2xl" />
          <div>
            <p className="font-semibold text-slate-800 dark:text-white text-lg">{user?.name}</p>
            <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
            <span className="badge bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 mt-1 capitalize">{user?.role}</span>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Display Name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Email</label>
            <input className="input" value={user?.email} readOnly className="input opacity-60 cursor-not-allowed" />
          </div>
          <button onClick={() => toast.success('Profile updated!')} className="btn-primary">Save Changes</button>
        </div>
      </div>
      {/* Theme */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          {dark ? <RiMoonLine className="text-indigo-500 text-xl" /> : <RiSunLine className="text-yellow-500 text-xl" />}
          <h2 className="font-bold text-slate-800 dark:text-white">Appearance</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-300">Dark Mode</p>
            <p className="text-sm text-slate-400">Switch between light and dark themes</p>
          </div>
          <button onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${dark ? 'bg-indigo-600' : 'bg-slate-200'}`}>
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${dark ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
      {/* Credentials info */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <RiLockLine className="text-indigo-500 text-xl" />
          <h2 className="font-bold text-slate-800 dark:text-white">Demo Credentials</h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <span className="text-slate-600 dark:text-slate-400">Admin</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">admin@leadflow.com / admin123</span>
          </div>
          <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <span className="text-slate-600 dark:text-slate-400">BDA</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">rahul@leadflow.com / bda123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
