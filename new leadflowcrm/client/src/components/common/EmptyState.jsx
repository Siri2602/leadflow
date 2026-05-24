import { RiInboxLine } from 'react-icons/ri';

export default function EmptyState({ title = 'No data found', message = 'Try adjusting your filters', icon: Icon = RiInboxLine }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="text-3xl text-slate-400" />
      </div>
      <h3 className="text-slate-700 dark:text-slate-300 font-semibold mb-1">{title}</h3>
      <p className="text-slate-400 text-sm">{message}</p>
    </div>
  );
}
