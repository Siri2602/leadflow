import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiContactsLine, RiUserStarLine, RiCheckboxCircleLine, RiLineChartLine, RiTimeLine, RiArrowRightLine } from 'react-icons/ri';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import api from '../services/api';
import StatCard from '../components/dashboard/StatCard';
import { SkeletonCard } from '../components/common/Skeleton';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#6366f1', '#f59e0b', '#8b5cf6', '#f97316', '#10b981', '#ef4444'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [s, a, act] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/analytics'),
          api.get('/activities?limit=5'),
        ]);
        setStats(s.data);
        setAnalytics(a.data);
        setActivities(act.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const activityIcons = {
    lead_created: '🟢', lead_updated: '🔵', status_changed: '🟡', login: '👤', lead_assigned: '📋',
  };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />) : (
          <>
            <StatCard title="Total Leads" value={stats?.totalLeads || 0} icon={RiContactsLine} color="blue" change={12} />
            <StatCard title="Active Clients" value={stats?.activeClients || 0} icon={RiUserStarLine} color="purple" change={5} />
            <StatCard title="Closed Won" value={stats?.closedWon || 0} icon={RiCheckboxCircleLine} color="green" change={8} />
            <StatCard title="Conversion Rate" value={stats?.conversionRate || 0} icon={RiLineChartLine} color="orange" suffix="%" change={3} />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 dark:text-white">Lead Performance (6 Months)</h2>
          </div>
          {loading ? <div className="h-48 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics?.chartData || []}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="leads" fill="#6366f1" radius={[6, 6, 0, 0]} name="Total Leads" />
                <Bar dataKey="won" fill="#10b981" radius={[6, 6, 0, 0]} name="Won" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        {/* Status pie */}
        <div className="card p-5">
          <h2 className="font-bold text-slate-800 dark:text-white mb-4">Status Distribution</h2>
          {loading ? <div className="h-48 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={stats?.statusCounts?.map(s => ({ name: s._id, value: s.count })) || []}
                  cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {(stats?.statusCounts || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activities */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 dark:text-white">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">No recent activity</p>
            ) : activities.map((act) => (
              <div key={act._id} className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{activityIcons[act.type] || '📌'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-300">{act.description}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{act.user?.name} • {timeAgo(act.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Quick stats */}
        <div className="card p-5">
          <h2 className="font-bold text-slate-800 dark:text-white mb-4">Lead Sources</h2>
          <div className="space-y-3">
            {(stats?.sourceCounts || []).map((src, i) => {
              const pct = stats?.totalLeads ? Math.round((src.count / stats.totalLeads) * 100) : 0;
              return (
                <div key={src._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">{src._id}</span>
                    <span className="font-medium text-slate-800 dark:text-white">{src.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
