import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { demoApi } from '@/services/demoApi';
import {
  Users, Briefcase, Receipt, DollarSign, TrendingUp, TrendingDown,
  Calendar, Clock, MapPin, ChevronRight, Star
} from 'lucide-react';
import type { DashboardStats, Job, CalendarEvent } from '@/types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [s, j, e] = await Promise.all([
        demoApi.getStats(),
        demoApi.getJobs(),
        demoApi.getEvents(),
      ]);
      setStats(s);
      setJobs(j);
      setEvents(e);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'New Leads', value: stats?.new_leads ?? 0, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10', change: stats?.leads_change ?? 0 },
    { label: 'Active Jobs', value: stats?.active_jobs ?? 0, icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-500/10', change: stats?.jobs_change ?? 0 },
    { label: 'Pending Invoices', value: stats?.pending_invoices ?? 0, icon: Receipt, color: 'text-amber-400', bg: 'bg-amber-500/10', change: stats?.invoices_change ?? 0 },
    { label: 'This Month', value: `$${(stats?.monthly_revenue ?? 0).toLocaleString()}`, icon: DollarSign, color: 'text-violet-400', bg: 'bg-violet-500/10', change: stats?.revenue_change ?? 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Dashboard</h2>
        <p className="text-slate-400 text-sm">Overview of your studio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="bg-[#0d1321] border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${s.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {s.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(s.change)}%
              </span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Upcoming Jobs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0d1321] border border-white/5 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <h3 className="font-semibold text-sm">Upcoming Active Jobs</h3>
              <Link to="/jobs" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {jobs.slice(0, 4).map((job) => (
                <div key={job.id} className="px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      job.status === 'in_progress' ? 'bg-emerald-400' :
                      job.status === 'pending' ? 'bg-amber-400' :
                      job.status === 'editing' ? 'bg-cyan-400' : 'bg-slate-400'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{job.client_name}</p>
                      <p className="text-xs text-slate-400">{job.shoot_type} • {job.package_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">{job.event_date}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      job.status === 'in_progress' ? 'bg-emerald-500/15 text-emerald-400' :
                      job.status === 'pending' ? 'bg-amber-500/15 text-amber-400' :
                      'bg-cyan-500/15 text-cyan-400'
                    }`}>
                      {job.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned to me / 7 days */}
          <div className="bg-[#0d1321] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5">
              <h3 className="font-semibold text-sm">My Tasks — Next 7 Days</h3>
            </div>
            <div className="p-4 space-y-2">
              {events.slice(0, 3).map((evt) => (
                <div key={evt.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                  <div className="w-1 h-8 rounded-full" style={{ backgroundColor: evt.color }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{evt.title}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{evt.date.slice(0, 10)}</span>
                      {evt.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{evt.location}</span>}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{Math.round(evt.duration_minutes / 60 * 10) / 10}h</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Schedule */}
          <div className="bg-[#0d1321] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5">
              <h3 className="font-semibold text-sm">Schedule</h3>
            </div>
            <div className="p-4 space-y-3">
              {events.map((evt) => (
                <div key={evt.id} className="flex items-start gap-3">
                  <div className="w-1 h-full self-stretch rounded-full" style={{ backgroundColor: evt.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{evt.title}</p>
                    <p className="text-xs text-slate-400">{evt.date.slice(0, 10)} • {evt.type}</p>
                  </div>
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#0d1321] border border-white/5 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-sm mb-2">Quick Actions</h3>
            <Link to="/leads" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.05] transition-colors text-sm">
              <Users className="w-4 h-4 text-cyan-400" /> New Lead
            </Link>
            <Link to="/jobs" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.05] transition-colors text-sm">
              <Briefcase className="w-4 h-4 text-emerald-400" /> New Job
            </Link>
            <Link to="/calendar" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.05] transition-colors text-sm">
              <Calendar className="w-4 h-4 text-violet-400" /> Schedule Session
            </Link>
          </div>

          {/* Rating */}
          <div className="bg-[#0d1321] border border-white/5 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Client Rating</p>
            <div className="flex items-center justify-center gap-1 mb-1">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className={`w-5 h-5 ${s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
              ))}
            </div>
            <p className="text-2xl font-bold">4.8<span className="text-sm text-slate-400">/5</span></p>
            <p className="text-xs text-slate-500 mt-1">128 reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
}
