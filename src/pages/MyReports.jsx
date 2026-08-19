import { Link } from 'react-router-dom';
import { Trash2, List, Plus } from 'lucide-react';
import { useStore, store } from '../data/store.js';
import { SectionCard } from '../components/ui.jsx';
import { statusFor } from '../lib/theme.js';

export default function MyReports() {
  const user = useStore((s) => s.user);
  const reports = useStore((s) => s.kpiReports);
  const mine = reports.filter((r) => r.created_by === user.email);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-navy-800 text-white flex items-center justify-center">
            <List className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-navy-800">My Reports</h1>
            <p className="text-sm text-slate-500">{mine.length} report{mine.length === 1 ? '' : 's'} submitted by you.</p>
          </div>
        </div>
        <Link
          to="/submit-report"
          className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> New report
        </Link>
      </div>

      <SectionCard title="Submitted Reports">
        {mine.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">You haven't submitted any reports yet.</p>
            <Link to="/submit-report" className="text-brand-600 font-semibold text-sm mt-2 inline-block">
              Submit your first report →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {mine.map((r) => {
              const st = statusFor(r.percentage);
              return (
                <div
                  key={r.id}
                  className="rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-navy-800">{r.kpi_name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                          {r.percentage}% · {st.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        {r.department} · {r.reporting_period} · {r.submitted_date}
                      </p>
                      {r.notes && <p className="text-sm text-slate-600 mt-2">{r.notes}</p>}
                    </div>
                    <button
                      onClick={() => store.deleteReport(r.id)}
                      className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
