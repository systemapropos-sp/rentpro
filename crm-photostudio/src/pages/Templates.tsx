import { useState, useEffect } from 'react';
import { demoApi } from '@/services/demoApi';
import { Plus, FileText, ChevronDown, ChevronRight, Trash2, Copy, GripVertical } from 'lucide-react';
import type { QuestionnaireTemplate } from '@/types';

export default function Templates() {
  const [templates, setTemplates] = useState<QuestionnaireTemplate[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    demoApi.getTemplates().then((data) => { setTemplates(data); setLoading(false); });
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
          <h2 className="text-xl font-bold">Questionnaire Templates</h2>
          <p className="text-slate-400 text-sm">{templates.length} templates</p>
        </div>
        <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-[#0a0f1a] font-medium px-4 py-2 rounded-lg text-sm transition-colors w-fit">
          <Plus className="w-4 h-4" /> New Template
        </button>
      </div>

      <div className="space-y-3">
        {templates.map((template) => (
          <div key={template.id} className="bg-[#0d1321] border border-white/5 rounded-xl overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === template.id ? null : template.id)}
              className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white/[0.02] transition-colors text-left"
            >
              <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{template.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{template.description}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
                <span className="capitalize">{template.shoot_type}</span>
                <span className="mx-1">•</span>
                <span>{template.questions.length} questions</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-1.5 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-all">
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button className="p-1.5 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
                {expanded === template.id ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              </div>
            </button>

            {expanded === template.id && (
              <div className="px-4 pb-4 space-y-2">
                {template.questions.map((q, i) => (
                  <div key={q.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03]">
                    <GripVertical className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-500 font-mono">{i + 1}.</span>
                        <span className="text-sm font-medium">{q.label}</span>
                        {q.required && <span className="text-[10px] px-1.5 py-0.5 bg-red-500/15 text-red-400 rounded">Required</span>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="capitalize px-2 py-0.5 bg-white/5 rounded">{q.type}</span>
                        {q.options && <span>({q.options.length} options)</span>}
                        {q.placeholder && <span className="text-slate-600">"{q.placeholder}"</span>}
                      </div>
                      {q.options && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {q.options.map((opt) => (
                            <span key={opt} className="text-[10px] px-2 py-0.5 bg-white/5 rounded text-slate-400">{opt}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <button className="w-full py-2 border border-dashed border-white/10 rounded-lg text-xs text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors flex items-center justify-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Question
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
