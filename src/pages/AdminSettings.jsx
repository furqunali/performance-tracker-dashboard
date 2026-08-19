import { useState } from 'react';
import { Settings, Plus, Trash2, RotateCcw } from 'lucide-react';
import { useStore, store } from '../data/store.js';
import { SectionCard, ProgressBar } from '../components/ui.jsx';
import { statusFor } from '../lib/theme.js';

const CATEGORIES = ['Financial', 'Customer', 'Operational', 'Growth', 'ESG', 'Technology'];

export default function AdminSettings() {
  const goals = useStore((s) => s.corporateGoals);
  const [draft, setDraft] = useState({ title: '', category: CATEGORIES[0], kpi: '', current_percentage: '' });

  function addGoal(e) {
    e.preventDefault();
    if (!draft.title.trim()) return;
    store.addCorporateGoal({
      title: draft.title.trim(),
      category: draft.category,
      kpi: draft.kpi.trim() || 'Attainment vs. target',
      current_percentage: Math.max(0, Math.min(100, Number(draft.current_percentage) || 0)),
      owner: 'Corporate',
    });
    setDraft({ title: '', category: CATEGORIES[0], kpi: '', current_percentage: '' });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-navy-800 text-white flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-navy-800">Admin Settings</h1>
            <p className="text-sm text-slate-500">Manage corporate goals and their attainment.</p>
          </div>
        </div>
        <button
          onClick={() => store.reset()}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 px-3.5 py-2 rounded-lg transition-colors"
          title="Restore demo data"
        >
          <RotateCcw className="w-4 h-4" /> Reset demo data
        </button>
      </div>

      <SectionCard title="Add Corporate Goal">
        <form onSubmit={addGoal} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <label className="block sm:col-span-2">
            <span className="block text-xs font-semibold text-navy-800 mb-1">Title</span>
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Goal title"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-navy-800 mb-1">Category</span>
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-navy-800 mb-1">Attainment %</span>
            <input
              type="number"
              min="0"
              max="100"
              value={draft.current_percentage}
              onChange={(e) => setDraft({ ...draft, current_percentage: e.target.value })}
              placeholder="0–100"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
            />
          </label>
          <div className="sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> Add goal
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title={`Corporate Goals (${goals.length})`}>
        <div className="space-y-4">
          {goals.map((g) => {
            const st = statusFor(g.current_percentage || 0);
            return (
              <div key={g.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">{g.category}</p>
                    <h3 className="font-bold text-navy-800">{g.title}</h3>
                    <p className="text-xs text-slate-500">{g.kpi}</p>
                  </div>
                  <button
                    onClick={() => store.deleteCorporateGoal(g.id)}
                    className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={g.current_percentage || 0}
                    onChange={(e) => store.updateCorporateGoal(g.id, { current_percentage: Number(e.target.value) })}
                    className="flex-1 accent-brand-600"
                  />
                  <span className="w-12 text-right text-sm font-bold text-navy-800">{g.current_percentage || 0}%</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>{st.label}</span>
                </div>
                <div className="mt-2">
                  <ProgressBar value={g.current_percentage || 0} color={st.color} />
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
