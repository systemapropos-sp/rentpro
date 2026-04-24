import { useState, useEffect } from 'react';
import { demoApi } from '@/services/demoApi';
import {
  Plus, Search, Filter, MoreHorizontal, Mail, Calendar,
  ArrowRight
} from 'lucide-react';
import type { Lead } from '@/types';

const columns: { id: Lead['status']; title: string; color: string }[] = [
  { id: 'new', title: 'New Lead', color: 'bg-slate-500' },
  { id: 'qualified', title: 'Lead Qualified', color: 'bg-blue-500' },
  { id: 'proposal_sent', title: 'Proposal Sent', color: 'bg-amber-500' },
  { id: 'contract_signed', title: 'Contract Signed', color: 'bg-emerald-500' },
  { id: 'active_job', title: 'Active Job', color: 'bg-cyan-500' },
];

const shootTypeBadge: Record<string, { bg: string; text: string; label: string }> = {
  wedding: { bg: 'bg-pink-500/15', text: 'text-pink-400', label: 'Wedding' },
  portrait: { bg: 'bg-violet-500/15', text: 'text-violet-400', label: 'Portrait' },
  family: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: 'Family' },
  senior: { bg: 'bg-blue-500/15', text: 'text-blue-400', label: 'Senior' },
  engagement: { bg: 'bg-rose-500/15', text: 'text-rose-400', label: 'Engagement' },
  maternity: { bg: 'bg-orange-500/15', text: 'text-orange-400', label: 'Maternity' },
  event: { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'Event' },
  commercial: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', label: 'Commercial' },
  other: { bg: 'bg-slate-500/15', text: 'text-slate-400', label: 'Other' },
};

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [newModal, setNewModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', shoot_type: 'wedding' as Lead['shoot_type'], budget: '', event_date: '', notes: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    demoApi.getLeads().then((data) => { setLeads(data); setLoading(false); });
  }, []);

  const filtered = leads.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    l.shoot_type.toLowerCase().includes(search.toLowerCase())
  );

  const byStatus = (status: Lead['status']) => filtered.filter((l) => l.status === status);

  const moveLead = async (leadId: string, newStatus: Lead['status']) => {
    await demoApi.updateLeadStatus(leadId, newStatus);
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
  };

  const createLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const lead = await demoApi.createLead({
      name: form.name,
      email: form.email,
      shoot_type: form.shoot_type,
      budget: Number(form.budget) || 0,
      event_date: form.event_date,
      notes: form.notes,
      status: 'new',
      priority: 'medium',
      assigned_to: 'user-1',
    });
    setLeads((prev) => [lead, ...prev]);
    setNewModal(false);
    setForm({ name: '', email: '', shoot_type: 'wedding', budget: '', event_date: '', notes: '' });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Leads Pipeline</h2>
          <p className="text-slate-400 text-sm">{leads.length} total leads</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
              className="w-48 bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <button className="p-2 hover:bg-white/5 rounded-lg border border-white/10">
            <Filter className="w-4 h-4 text-slate-400" />
          </button>
          <button onClick={() => setNewModal(true)} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-[#0a0f1a] font-medium px-4 py-2 rounded-lg text-sm transition-colors">
            <Plus className="w-4 h-4" /> New Lead
          </button>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {columns.map((col) => (
          <div key={col.id} className="min-w-[260px] w-[260px] flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${col.color}`} />
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <span className="text-xs text-slate-500 ml-auto">{byStatus(col.id).length}</span>
            </div>
            <div className="space-y-2">
              {byStatus(col.id).map((lead) => {
                const badge = shootTypeBadge[lead.shoot_type] || shootTypeBadge.other;
                return (
                  <div
                    key={lead.id}
                    className="bg-[#0d1321] border border-white/5 rounded-xl p-3 hover:border-white/10 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${badge.bg} ${badge.text} font-medium`}>
                        {badge.label}
                      </span>
                      <div className="relative">
                        <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded transition-all">
                          <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{lead.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                      <Mail className="w-3 h-3" /> {lead.email}
                    </div>
                    {lead.event_date && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                        <Calendar className="w-3 h-3" /> {lead.event_date}
                      </div>
                    )}
                    {lead.budget && (
                      <div className="text-xs text-cyan-400 font-medium mb-2">Budget: ${lead.budget.toLocaleString()}</div>
                    )}
                    {/* Move buttons */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {columns.map((c) => (
                        c.id !== lead.status && (
                          <button
                            key={c.id}
                            onClick={() => moveLead(lead.id, c.id)}
                            className="text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 rounded transition-colors flex items-center gap-1"
                          >
                            <ArrowRight className="w-2.5 h-2.5" /> {c.title}
                          </button>
                        )
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* New Lead Modal */}
      {newModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-[#0d1321] border border-white/10 rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">New Lead</h3>
            <form onSubmit={createLead} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 block">Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 block">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 block">Shoot Type</label>
                  <select value={form.shoot_type} onChange={(e) => setForm({ ...form, shoot_type: e.target.value as Lead['shoot_type'] })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50">
                    {Object.keys(shootTypeBadge).map((t) => (
                      <option key={t} value={t}>{shootTypeBadge[t].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 block">Budget</label>
                  <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 block">Event Date</label>
                <input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 block">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setNewModal(false)} className="flex-1 py-2.5 border border-white/10 rounded-lg text-sm hover:bg-white/5">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#0a0f1a] font-semibold rounded-lg text-sm">Create Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
