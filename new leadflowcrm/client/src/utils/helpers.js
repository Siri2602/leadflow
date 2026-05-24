// Status colors
export const statusColors = {
  'New': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Contacted': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Proposal Sent': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Negotiation': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Closed Won': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Closed Lost': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export const statusDot = {
  'New': 'bg-blue-500',
  'Contacted': 'bg-yellow-500',
  'Proposal Sent': 'bg-purple-500',
  'Negotiation': 'bg-orange-500',
  'Closed Won': 'bg-green-500',
  'Closed Lost': 'bg-red-500',
};

export const sourceColors = {
  'Website': 'bg-cyan-100 text-cyan-700',
  'Referral': 'bg-emerald-100 text-emerald-700',
  'Cold Call': 'bg-slate-100 text-slate-700',
  'Email Campaign': 'bg-violet-100 text-violet-700',
  'Social Media': 'bg-pink-100 text-pink-700',
  'Trade Show': 'bg-amber-100 text-amber-700',
  'Other': 'bg-gray-100 text-gray-700',
};

// Format currency
export const formatCurrency = (amount) => {
  if (!amount) return '₹0';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

// Format date
export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Get avatar URL
export const getAvatar = (name) => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=3b82f6&textColor=ffffff`;
};

// Time ago
export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
