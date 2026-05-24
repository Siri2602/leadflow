import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import api from '../services/api';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316'];

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/stats'),
      api.get('/dashboard/analytics'),
      api.get('/employees/performance'),
    ]).then(([s, a, p]) => {
      setStats(s.data);
      setAnalytics(a.data);
      setPerformance(p.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card p-5 h-64 animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4" />
          <div className="h-full bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
        </div>
      ))}
    </div>
  );

  const perfChartData = performance.map(p => ({
    name: p.employee.name.split(' ')[0],
    leads: p.totalLeads,
    won: p.closedWon,
    rate: parseFloat(p.conversionRate),
  }));

  return (
    <div className="space-y-5">
      {/* Monthly trends */}
      <div className="card p-5">
        <h2 className="font-bold text-slate-800 dark:text-white mb-4">Monthly Lead Trends</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={analytics?.chartData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }} />
            <Legend />
            <Line type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} name="Total Leads" />
            <Line type="monotone" dataKey="won" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} name="Won" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Team performance */}
        <div className="card p-5">
          <h2 className="font-bold text-slate-800 dark:text-white mb-4">Team Performance</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={perfChartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Legend />
              <Bar dataKey="leads" fill="#6366f1" radius={[6, 6, 0, 0]} name="Leads" />
              <Bar dataKey="won" fill="#10b981" radius={[6, 6, 0, 0]} name="Won" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Source distribution */}
        <div className="card p-5">
          <h2 className="font-bold text-slate-800 dark:text-white mb-4">Lead Sources</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={stats?.sourceCounts?.map(s => ({ name: s._id, value: s.count })) || []}
                cx="50%" cy="50%" outerRadius={80} paddingAngle={4} dataKey="value">
                {(stats?.sourceCounts || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Employee table */}
      <div className="card p-5">
        <h2 className="font-bold text-slate-800 dark:text-white mb-4">Employee Performance Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                {['Employee', 'Total Leads', 'Active', 'Closed Won', 'Conversion Rate'].map(h => (
                  <th key={h} className="text-left pb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
              {performance.map(p => (
                <tr key={p.employee._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${p.employee.name}&backgroundColor=6366f1`}
                        className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">{p.employee.name}</p>
                        <p className="text-xs text-slate-400">{p.employee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-400 font-medium">{p.totalLeads}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{p.activeLeads}</td>
                  <td className="py-3 text-emerald-600 dark:text-emerald-400 font-semibold">{p.closedWon}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full max-w-24">
                        <div className="h-2 bg-indigo-500 rounded-full" style={{ width: `${Math.min(p.conversionRate, 100)}%` }} />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300 font-semibold text-xs">{p.conversionRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              {performance.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400">No employee data available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
