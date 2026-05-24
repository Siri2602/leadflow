import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { RiUserLine, RiCalendarLine, RiMoreLine, RiContactsLine } from 'react-icons/ri';
import api from '../services/api';
import toast from 'react-hot-toast';
import StatusBadge from '../components/common/StatusBadge';

const COLUMNS = [
  { id: 'New', label: 'New', color: 'bg-blue-500' },
  { id: 'Contacted', label: 'Contacted', color: 'bg-yellow-500' },
  { id: 'Proposal Sent', label: 'Proposal', color: 'bg-purple-500' },
  { id: 'Negotiation', label: 'Negotiation', color: 'bg-orange-500' },
  { id: 'Closed Won', label: 'Won', color: 'bg-green-500' },
  { id: 'Closed Lost', label: 'Lost', color: 'bg-red-500' },
];

const priorityColors = { High: 'border-l-red-400', Medium: 'border-l-yellow-400', Low: 'border-l-slate-300' };

export default function Kanban() {
  const [board, setBoard] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const { data } = await api.get('/leads?limit=200');
      const grouped = {};
      COLUMNS.forEach(c => { grouped[c.id] = []; });
      data.leads.forEach(lead => {
        if (grouped[lead.status]) grouped[lead.status].push(lead);
      });
      setBoard(grouped);
    } catch (e) { toast.error('Failed to load board'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLeads(); }, []);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const srcCol = source.droppableId;
    const dstCol = destination.droppableId;
    const srcItems = Array.from(board[srcCol]);
    const dstItems = srcCol === dstCol ? srcItems : Array.from(board[dstCol]);
    const [moved] = srcItems.splice(source.index, 1);
    dstItems.splice(destination.index, 0, { ...moved, status: dstCol });

    setBoard(prev => ({ ...prev, [srcCol]: srcItems, [dstCol]: dstItems }));

    if (srcCol !== dstCol) {
      try {
        await api.put(`/leads/${draggableId}`, { status: dstCol });
        toast.success(`Moved to ${dstCol}`);
      } catch {
        toast.error('Failed to update status');
        fetchLeads();
      }
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : null;

  if (loading) return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map(col => (
        <div key={col.id} className="flex-shrink-0 w-64">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl mb-3 animate-pulse" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl mb-2 animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">Drag and drop leads to update their status</p>
        <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <RiContactsLine /> {Object.values(board).flat().length} total leads
        </span>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {COLUMNS.map(col => (
            <div key={col.id} className="flex-shrink-0 w-64">
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className={`w-2.5 h-2.5 rounded-full ${col.color}`}></span>
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{col.label}</h3>
                <span className="ml-auto text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                  {board[col.id]?.length || 0}
                </span>
              </div>
              {/* Droppable */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}
                    className={`min-h-[200px] space-y-2 p-2 rounded-2xl transition-colors ${
                      snapshot.isDraggingOver ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-slate-100/50 dark:bg-slate-800/30'
                    }`}>
                    {(board[col.id] || []).map((lead, index) => (
                      <Draggable key={lead._id} draggableId={lead._id} index={index}>
                        {(prov, snap) => (
                          <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}
                            className={`bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border-l-4 ${priorityColors[lead.priority] || 'border-l-slate-200'}
                              ${snap.isDragging ? 'shadow-lg rotate-1' : ''} border border-slate-100 dark:border-slate-700 cursor-grab active:cursor-grabbing transition-shadow`}>
                            <p className="font-semibold text-slate-800 dark:text-white text-sm leading-tight">{lead.clientName}</p>
                            <p className="text-xs text-slate-400 mb-2">{lead.companyName}</p>
                            {lead.value > 0 && (
                              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                                ₹{Number(lead.value).toLocaleString('en-IN')}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              {lead.assignedTo ? (
                                <div className="flex items-center gap-1">
                                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${lead.assignedTo.name}&backgroundColor=6366f1`}
                                    className="w-5 h-5 rounded-full" />
                                  <span className="text-xs text-slate-400">{lead.assignedTo.name?.split(' ')[0]}</span>
                                </div>
                              ) : <span className="text-xs text-slate-300">Unassigned</span>}
                              {lead.followUpDate && (
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                  <RiCalendarLine />
                                  {formatDate(lead.followUpDate)}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
