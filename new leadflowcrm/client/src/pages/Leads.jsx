import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RiAddLine, RiSearchLine, RiFilter3Line, RiEditLine, RiDeleteBinLine, RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';
import api from '../services/api';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import LeadForm from '../components/leads/LeadForm';
import StatusBadge from '../components/common/StatusBadge';
import { SkeletonRow } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';

const statuses = ['', 'New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { user } = useAuth();
  const LIMIT = 10;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/leads', { params });
      setLeads(data.leads);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) { toast.error('Failed to fetch leads'); }
    finally { setLoading(false); }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const handleDelete = async () => {
    try {
      await api.delete(`/leads/${deleteId}`);
      toast.success('Lead deleted');
      setDeleteId(null);
      fetchLeads();
    } catch { toast.error('Delete failed'); }
  };

  const priorityColor = { Low: 'text-slate-400', Medium: 'text-yellow-500', High: 'text-red-500' };

  const formatCurrency = (v) => v ? `₹${Number(v).toLocaleString('en-IN')}` : '—';
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Leads <span className="text-slate-400 text-base font-normal">({total})</span></h2>
        </div>
        <button onClick={() => { setEditLead(null); setModalOpen(true); }} className="btn-primary">
          <RiAddLine /> New Lead
        </button>
      </div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search by name, company or email..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <RiFilter3Line className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select className="input pl-9 pr-4 appearance-none" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {statuses.map(s => <option key={s} value={s}>{s || 'All Status'}</option>)}
          </select>
        </div>
      </div>
      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                {['Client', 'Company', 'Status', 'Source', 'Assigned To', 'Follow-Up', 'Value', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
              {loading ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />) :
                leads.length === 0 ? (
                  <tr><td colSpan={8}><EmptyState title="No leads found" message="Create a new lead or adjust your filters" /></td></tr>
                ) : leads.map((lead) => (
                  <motion.tr key={lead._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 dark:text-white">{lead.clientName}</div>
                      <div className="text-xs text-slate-400">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{lead.companyName || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{lead.source}</td>
                    <td className="px-4 py-3">
                      {lead.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${lead.assignedTo.name}&backgroundColor=6366f1`}
                            className="w-6 h-6 rounded-full" />
                          <span className="text-slate-600 dark:text-slate-400 text-xs">{lead.assignedTo.name}</span>
                        </div>
                      ) : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatDate(lead.followUpDate)}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">{formatCurrency(lead.value)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditLead(lead); setModalOpen(true); }}
                          className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-500 transition">
                          <RiEditLine />
                        </button>
                        {user?.role === 'admin' && (
                          <button onClick={() => setDeleteId(lead._id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-400 transition">
                            <RiDeleteBinLine />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700">
            <p className="text-sm text-slate-500">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary py-1.5 px-3 disabled:opacity-40">
                <RiArrowLeftLine /> Prev
              </button>
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="btn-secondary py-1.5 px-3 disabled:opacity-40">
                Next <RiArrowRightLine />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Lead form modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editLead ? 'Edit Lead' : 'New Lead'} size="lg">
        <LeadForm lead={editLead} onSuccess={() => { setModalOpen(false); fetchLeads(); }} onClose={() => setModalOpen(false)} />
      </Modal>
      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Lead" size="sm">
        <p className="text-slate-600 dark:text-slate-400 mb-5">Are you sure you want to delete this lead? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-xl transition">Delete</button>
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
