import { useState, useEffect } from 'react';
import { RiBellLine, RiAlarmWarningLine, RiCalendarCheckLine } from 'react-icons/ri';
import api from '../services/api';

export default function Notifications() {
  const [data, setData] = useState({ upcoming: [], overdue: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications').then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const isToday = (d) => new Date(d).toDateString() === new Date().toDateString();
  const isTomorrow = (d) => {
    const t = new Date(); t.setDate(t.getDate() + 1);
    return new Date(d).toDateString() === t.toDateString();
  };
  const getLabel = (d) => isToday(d) ? 'Today' : isTomorrow(d) ? 'Tomorrow' : formatDate(d);

  const LeadCard = ({ lead, overdue }) => (
    <div className={`card p-4 border-l-4 ${overdue ? 'border-l-red-400' : 'border-l-indigo-400'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-slate-800 dark:text-white">{lead.clientName}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{lead.companyName}</p>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            {overdue ? <RiAlarmWarningLine className="text-red-400" /> : <RiCalendarCheckLine className="text-indigo-400" />}
            Follow-up: {getLabel(lead.followUpDate)}
          </p>
        </div>
        <span className={`badge text-xs ${overdue ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
          {overdue ? 'Overdue' : 'Upcoming'}
        </span>
      </div>
    </div>
  );

  if (loading) return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => <div key={i} className="card p-4 h-20 animate-pulse" />)}
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Overdue */}
      {data.overdue.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <RiAlarmWarningLine className="text-red-500 text-lg" />
            <h2 className="font-bold text-slate-800 dark:text-white">Overdue Follow-ups <span className="text-red-500">({data.overdue.length})</span></h2>
          </div>
          <div className="space-y-3">
            {data.overdue.map(l => <LeadCard key={l._id} lead={l} overdue />)}
          </div>
        </div>
      )}
      {/* Upcoming */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <RiBellLine className="text-indigo-500 text-lg" />
          <h2 className="font-bold text-slate-800 dark:text-white">Upcoming Follow-ups <span className="text-slate-400">({data.upcoming.length})</span></h2>
        </div>
        {data.upcoming.length === 0 ? (
          <div className="card p-8 text-center text-slate-400">
            <RiCalendarCheckLine className="text-3xl mx-auto mb-2 text-slate-300" />
            <p>No upcoming follow-ups this week</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.upcoming.map(l => <LeadCard key={l._id} lead={l} />)}
          </div>
        )}
      </div>
    </div>
  );
}
