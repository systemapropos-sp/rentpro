import { useState, useEffect } from 'react';
import { demoApi } from '@/services/demoApi';
import { Plus, Search, Filter, MoreHorizontal, MapPin } from 'lucide-react';
import type { Job } from '@/types';

const statusBadge: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  in_progress: { bg: 'bg-cyan-500/15', text: 'text-cyan-400' },
  editing: { bg: 'bg-violet-500/15', text: 'text-violet-400' },
  review: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  delivered: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  archived: { bg: 'bg-slate-500/15', text: 'text-slate-400' },
};

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    demoApi.getJobs().then((data) => { setJobs(data); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Jobs</h2>
          <p className="text-slate-400 text-sm">{jobs.length} active jobs</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Search jobs..." className="w-48 bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" />
          </div>
          <button className="p-2 hover:bg-white/5 rounded-lg border border-white/10"><Filter className="w-4 h-4 text-slate-400" /></button>
          <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-[#0a0f1a] font-medium px-4 py-2 rounded-lg text-sm transition-colors">
            <Plus className="w-4 h-4" /> New Job
          </button>
        </div>
      </div>

      <div className="bg-[#0d1321] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Event Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Balance</th>
                <th className="px-4 py-3 font-medium">Assigned</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {jobs.map((job) => {
                const badge = statusBadge[job.status] || statusBadge.pending;
                return (
                  <tr key={job.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{job.client_name}</p>
                      {job.location && <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{job.location}</p>}
                    </td>
                    <td className="px-4 py-3 capitalize">{job.shoot_type}</td>
                    <td className="px-4 py-3 text-slate-400">{job.event_date}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${badge.bg} ${badge.text}`}>{job.status.replace('_', ' ')}</span>
                    </td>
                    <td className="px-4 py-3">${job.price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={job.balance > 0 ? 'text-amber-400' : 'text-emerald-400'}>${job.balance.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src={job.assigned_user?.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs">{job.assigned_user?.full_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button className="p-1 hover:bg-white/10 rounded"><MoreHorizontal className="w-4 h-4 text-slate-400" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
