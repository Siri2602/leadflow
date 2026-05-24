const statusConfig = {
  'New': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  'Contacted': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  'Proposal Sent': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  'Negotiation': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  'Closed Won': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  'Closed Lost': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${statusConfig[status] || 'bg-slate-100 text-slate-600'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
}
