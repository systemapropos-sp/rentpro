import { useEffect, useState } from 'react';
import { demoApi } from '@/services/demoApi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import type { Lead, Job } from '@/types';

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b', '#ef4444'];

export default function Reports() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([demoApi.getLeads(), demoApi.getJobs()]).then(([l, j]) => {
      setLeads(l);
      setJobs(j);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  );

  // Leads by shoot type
  const leadsByType = Object.entries(
    leads.reduce((acc, l) => { acc[l.shoot_type] = (acc[l.shoot_type] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  // Jobs by status
  const jobsByStatus = Object.entries(
    jobs.reduce((acc, j) => { acc[j.status] = (acc[j.status] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()), value }));

  // Monthly revenue (mock)
  const monthlyRevenue = [
    { month: 'Jan', revenue: 3200 },
    { month: 'Feb', revenue: 4100 },
    { month: 'Mar', revenue: 2800 },
    { month: 'Apr', revenue: 5200 },
    { month: 'May', revenue: 4200 },
  ];

  // Pipeline funnel
  const pipelineData = [
    { stage: 'New', count: leads.filter((l) => l.status === 'new').length },
    { stage: 'Qualified', count: leads.filter((l) => l.status === 'qualified').length },
    { stage: 'Proposal', count: leads.filter((l) => l.status === 'proposal_sent').length },
    { stage: 'Signed', count: leads.filter((l) => l.status === 'contract_signed').length },
    { stage: 'Active', count: leads.filter((l) => l.status === 'active_job').length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Reports & Analytics</h2>
        <p className="text-slate-400 text-sm">Studio performance overview</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Leads', value: leads.length, icon: Users, color: 'text-cyan-400' },
          { label: 'Conversion Rate', value: `${Math.round((leads.filter(l => l.status === 'active_job').length / leads.length) * 100)}%`, icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Active Jobs', value: jobs.length, icon: Calendar, color: 'text-amber-400' },
          { label: 'Avg Job Value', value: `$${Math.round(jobs.reduce((s, j) => s + j.price, 0) / jobs.length)}`, icon: DollarSign, color: 'text-violet-400' },
        ].map((s) => (
          <div key={s.label} className="bg-[#0d1321] border border-white/5 rounded-xl p-4">
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <div className="bg-[#0d1321] border border-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#0d1321', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
              />
              <Bar dataKey="revenue" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline Funnel */}
        <div className="bg-[#0d1321] border border-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-4">Pipeline Funnel</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pipelineData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis dataKey="stage" type="category" stroke="#64748b" fontSize={12} width={70} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#0d1321', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Leads by Type */}
        <div className="bg-[#0d1321] border border-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-4">Leads by Shoot Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={leadsByType}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {leadsByType.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#0d1321', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {leadsByType.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-slate-400">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs by Status */}
        <div className="bg-[#0d1321] border border-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-4">Jobs by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={jobsByStatus}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {jobsByStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#0d1321', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {jobsByStatus.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-slate-400">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue trend */}
      <div className="bg-[#0d1321] border border-white/5 rounded-xl p-4">
        <h3 className="font-semibold text-sm mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <RechartsTooltip
              contentStyle={{ backgroundColor: '#0d1321', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
            />
            <Line type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
