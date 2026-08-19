// Small shared UI primitives.

export function Card({ className = '', children }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200/70 ${className}`}>
      {children}
    </div>
  );
}

export function SectionCard({ title, action, children }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <h2 className="text-lg font-bold text-navy-800">{title}</h2>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </Card>
  );
}

export function StatTile({ label, value, sub, icon: Icon, accent }) {
  return (
    <Card className="p-5 border-t-4" >
      <div className="flex items-center justify-between" style={{ borderColor: accent }}>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-extrabold text-navy-800 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${accent}1a`, color: accent }}
        >
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
    </Card>
  );
}

export function ProgressBar({ value, color }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}
