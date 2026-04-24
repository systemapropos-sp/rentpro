import { useState, useEffect } from 'react';
import { demoApi } from '@/services/demoApi';
import { Plus, Search, FileText, Image, FileSpreadsheet, FileCheck, Folder, Download } from 'lucide-react';
import type { Document } from '@/types';

const typeConfig: Record<string, { icon: typeof FileText; color: string; bg: string }> = {
  contract: { icon: FileCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  invoice: { icon: FileSpreadsheet, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  gallery: { icon: Image, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  questionnaire: { icon: FileText, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  other: { icon: Folder, color: 'text-slate-400', bg: 'bg-slate-500/10' },
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    demoApi.getDocuments().then((data) => { setDocs(data); setLoading(false); });
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
          <h2 className="text-xl font-bold">Documents</h2>
          <p className="text-slate-400 text-sm">{docs.length} files</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Search files..." className="w-48 bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" />
          </div>
          <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-[#0a0f1a] font-medium px-4 py-2 rounded-lg text-sm transition-colors">
            <Plus className="w-4 h-4" /> Upload
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {docs.map((doc) => {
          const tc = typeConfig[doc.type] || typeConfig.other;
          return (
            <div key={doc.id} className="bg-[#0d1321] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${tc.bg} rounded-lg flex items-center justify-center`}>
                  <tc.icon className={`w-5 h-5 ${tc.color}`} />
                </div>
                <button className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded transition-all">
                  <Download className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <h3 className="text-sm font-medium mb-1 line-clamp-2">{doc.name}</h3>
              <p className="text-xs text-slate-500 mb-1">{doc.client_name}</p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="capitalize">{doc.type}</span>
                <span>{doc.size}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
