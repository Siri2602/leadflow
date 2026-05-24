import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const statusOptions = ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];
const sourceOptions = ['Website', 'Referral', 'Cold Call', 'Email Campaign', 'LinkedIn', 'Trade Show', 'Other'];

export default function LeadForm({ lead, onSuccess, onClose }) {
  const getInitialForm = () => {
    const base = {
      clientName: '', companyName: '', email: '', phone: '', source: 'Website',
      status: 'New', notes: '', followUpDate: '', assignedTo: '', value: '', priority: 'Medium',
    };
    if (!lead) return base;
    return {
      ...base,
      ...lead,
      followUpDate: lead.followUpDate ? new Date(lead.followUpDate).toISOString().split('T')[0] : '',
      assignedTo: lead.assignedTo?._id || lead.assignedTo || '',
    };
  };
  const [form, setForm] = useState(getInitialForm);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/employees/performance').then(r => setEmployees(r.data.map(e => e.employee))).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (lead?._id) {
        await api.put(`/leads/${lead._id}`, form);
        toast.success('Lead updated!');
      } else {
        await api.post('/leads', form);
        toast.success('Lead created!');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving lead');
    } finally { setLoading(false); }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Client Name *</label>
          <input className="input" value={form.clientName} onChange={e => f('clientName', e.target.value)} placeholder="John Doe" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Company Name</label>
          <input className="input" value={form.companyName} onChange={e => f('companyName', e.target.value)} placeholder="Acme Corp" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Email</label>
          <input className="input" type="email" value={form.email} onChange={e => f('email', e.target.value)} placeholder="client@email.com" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Phone</label>
          <input className="input" value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="+91 9876543210" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Source</label>
          <select className="input" value={form.source} onChange={e => f('source', e.target.value)}>
            {sourceOptions.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Status</label>
          <select className="input" value={form.status} onChange={e => f('status', e.target.value)}>
            {statusOptions.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Assign To</label>
          <select className="input" value={form.assignedTo} onChange={e => f('assignedTo', e.target.value)}>
            <option value="">Unassigned</option>
            {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Follow-up Date</label>
          <input className="input" type="date" value={form.followUpDate} onChange={e => f('followUpDate', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Deal Value (₹)</label>
          <input className="input" type="number" value={form.value} onChange={e => f('value', e.target.value)} placeholder="500000" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Priority</label>
          <select className="input" value={form.priority} onChange={e => f('priority', e.target.value)}>
            {['Low', 'Medium', 'High'].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Notes</label>
        <textarea className="input resize-none" rows={3} value={form.notes} onChange={e => f('notes', e.target.value)} placeholder="Any additional notes..." />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
          {loading ? 'Saving...' : lead?._id ? 'Update Lead' : 'Create Lead'}
        </button>
        <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
      </div>
    </form>
  );
}
