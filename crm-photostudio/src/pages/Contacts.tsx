import { useState, useEffect } from 'react';
import { demoApi } from '@/services/demoApi';
import { Plus, Mail, Phone, Building, User, Truck, Star, Users } from 'lucide-react';
import type { Contact } from '@/types';

const typeIcon = {
  client: { icon: User, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  vendor: { icon: Truck, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  referral: { icon: Star, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  prospect: { icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filter, setFilter] = useState<Contact['type'] | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    demoApi.getContacts().then((data) => { setContacts(data); setLoading(false); });
  }, []);

  const filtered = filter === 'all' ? contacts : contacts.filter((c) => c.type === filter);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Contacts</h2>
          <p className="text-slate-400 text-sm">{contacts.length} total contacts</p>
        </div>
        <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-[#0a0f1a] font-medium px-4 py-2 rounded-lg text-sm transition-colors w-fit">
          <Plus className="w-4 h-4" /> New Contact
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {(['all', 'client', 'vendor', 'referral', 'prospect'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
              filter === t ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {t} ({t === 'all' ? contacts.length : contacts.filter((c) => c.type === t).length})
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((contact) => {
          const ti = typeIcon[contact.type];
          return (
            <div key={contact.id} className="bg-[#0d1321] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${ti.bg} rounded-lg flex items-center justify-center`}>
                  <ti.icon className={`w-5 h-5 ${ti.color}`} />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{contact.type}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">{contact.name}</h3>
              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {contact.email}</div>
                {contact.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {contact.phone}</div>}
                {contact.company && <div className="flex items-center gap-1.5"><Building className="w-3 h-3" /> {contact.company}</div>}
              </div>
              {contact.tags && contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {contact.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/5 rounded text-slate-400">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
