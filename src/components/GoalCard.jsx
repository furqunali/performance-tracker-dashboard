import { statusFor } from '../lib/theme.js';
import { Badge } from './ui.jsx';

// Compact card with a circular progress ring for a single corporate goal.
export default function GoalCard({ goal }) {
  const pct = goal.current_percentage || 0;
  const status = statusFor(pct);
  const radius = 26;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;

  return (
    <div className="rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-brand-300 transition-all bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
            {goal.category}
          </p>
          <h3 className="font-bold text-navy-800 leading-snug mt-0.5">{goal.title}</h3>
        </div>
        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="6" />
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke={status.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-navy-800">
            {pct}%
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-500 truncate">{goal.kpi}</span>
        <Badge className={`${status.bg} ${status.text}`}>{status.label}</Badge>
      </div>
    </div>
  );
}
