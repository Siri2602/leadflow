import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon: Icon, color, change, suffix = '' }) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    indigo: 'from-indigo-500 to-indigo-600',
  };
  const bgColors = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    green: 'bg-emerald-50 dark:bg-emerald-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20',
  };

  return (
    <motion.div whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="card p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
            {value}<span className="text-lg">{suffix}</span>
          </p>
          {change !== undefined && (
            <p className={`text-xs mt-1 font-medium ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% this month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${bgColors[color]} flex items-center justify-center`}>
          <Icon className={`text-2xl bg-gradient-to-br ${colors[color]} bg-clip-text text-transparent`}
            style={{ color: color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : color === 'purple' ? '#8b5cf6' : color === 'orange' ? '#f97316' : color === 'indigo' ? '#6366f1' : '#ef4444' }} />
        </div>
      </div>
    </motion.div>
  );
}
