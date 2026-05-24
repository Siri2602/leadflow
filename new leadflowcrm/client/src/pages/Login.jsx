import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiEyeLine, RiEyeOffLine, RiDashboardFill } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(form.email, form.password);
    if (ok) navigate('/dashboard');
  };

  const demoLogin = async (role) => {
    const creds = role === 'admin'
      ? { email: 'admin@leadflow.com', password: 'admin123' }
      : { email: 'rahul@leadflow.com', password: 'bda123' };
    const ok = await login(creds.email, creds.password);
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200 dark:shadow-none">
            <RiDashboardFill className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome to LeadFlow</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sign in to your CRM dashboard</p>
        </div>
        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <input type="email" className="input" placeholder="you@company.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="input pr-10"
                  placeholder="••••••••" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 disabled:opacity-70 shadow-lg shadow-indigo-200 dark:shadow-none">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          {/* Demo buttons */}
          <div className="mt-5">
            <p className="text-center text-xs text-slate-400 mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => demoLogin('admin')}
                className="text-sm py-2 px-3 rounded-xl border border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition font-medium">
                Admin Demo
              </button>
              <button onClick={() => demoLogin('bda')}
                className="text-sm py-2 px-3 rounded-xl border border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition font-medium">
                BDA Demo
              </button>
            </div>
          </div>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
