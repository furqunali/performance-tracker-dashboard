import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle2 } from 'lucide-react';
import { store } from '../data/store.js';
import { SectionCard } from '../components/ui.jsx';
import { DEPARTMENTS, REPORTING_PERIODS } from '../data/seed.js';

const EMPTY = {
  kpi_name: '',
  department: DEPARTMENTS[0],
  reporting_period: REPORTING_PERIODS[1],
  percentage: '',
  notes: '',
};

export default function SubmitReport() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function validate() {
    const err = {};
    if (!form.kpi_name.trim()) err.kpi_name = 'KPI name is required.';
    const pct = Number(form.percentage);
    if (form.percentage === '' || Number.isNaN(pct)) err.percentage = 'Enter a number.';
    else if (pct < 0 || pct > 100) err.percentage = 'Must be between 0 and 100.';
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    store.addReport({
      kpi_name: form.kpi_name.trim(),
      department: form.department,
      reporting_period: form.reporting_period,
      percentage: Number(form.percentage),
      notes: form.notes.trim(),
    });
    setSaved(true);
    setForm(EMPTY);
    setTimeout(() => navigate('/my-reports'), 1100);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-navy-800">Submit KPI Report</h1>
          <p className="text-sm text-slate-500">Record attainment for a reporting period.</p>
        </div>
      </div>

      {saved && (
        <div className="mb-5 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5" /> Report submitted — redirecting to My Reports…
        </div>
      )}

      <SectionCard title="Report Details">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="KPI name" error={errors.kpi_name}>
            <input
              type="text"
              value={form.kpi_name}
              onChange={set('kpi_name')}
              placeholder="e.g. YoY revenue growth"
              className={input(errors.kpi_name)}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Department">
              <select value={form.department} onChange={set('department')} className={input()}>
                {DEPARTMENTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </Field>
            <Field label="Reporting period">
              <select value={form.reporting_period} onChange={set('reporting_period')} className={input()}>
                {REPORTING_PERIODS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Attainment (%)" error={errors.percentage}>
            <input
              type="number"
              min="0"
              max="100"
              value={form.percentage}
              onChange={set('percentage')}
              placeholder="0 – 100"
              className={input(errors.percentage)}
            />
          </Field>

          <Field label="Notes (optional)">
            <textarea
              value={form.notes}
              onChange={set('notes')}
              rows={3}
              placeholder="Context, drivers, risks…"
              className={input()}
            />
          </Field>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Submit report
            </button>
            <button
              type="button"
              onClick={() => setForm(EMPTY)}
              className="text-slate-600 hover:bg-slate-100 font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-navy-800 mb-1.5">{label}</span>
      {children}
      {error && <span className="block text-xs text-rose-600 mt-1">{error}</span>}
    </label>
  );
}

function input(error) {
  return `w-full rounded-lg border px-3.5 py-2.5 text-sm text-navy-800 outline-none transition-colors focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 ${
    error ? 'border-rose-400' : 'border-slate-300'
  }`;
}
