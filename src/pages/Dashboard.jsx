import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../data/store.js';
import { Card, SectionCard, StatTile } from '../components/ui.jsx';
import GoalCard from '../components/GoalCard.jsx';
import { CATEGORICAL, STATUS, statusFor, segmentColor } from '../lib/theme.js';
import { ORG_NAME } from '../data/seed.js';

export default function Dashboard() {
  const corporateGoals = useStore((s) => s.corporateGoals);
  const departmentalGoals = useStore((s) => s.departmentalGoals);
  const businessSegments = useStore((s) => s.businessSegments);
  const reports = useStore((s) => s.kpiReports);

  const avg =
    corporateGoals.length > 0
      ? Math.round(
          corporateGoals.reduce((s, g) => s + (g.current_percentage || 0), 0) /
            corporateGoals.length
        )
      : 0;
  const onTrack = corporateGoals.filter((g) => (g.current_percentage || 0) >= 95).length;
  const atRisk = corporateGoals.filter((g) => (g.current_percentage || 0) < 80).length;

  // Pie 1 — goal status distribution (reserved status colors).
  const statusData = [
    {
      name: STATUS.onTrack.label,
      value: corporateGoals.filter((g) => (g.current_percentage || 0) >= 95).length,
      color: STATUS.onTrack.color,
    },
    {
      name: STATUS.watch.label,
      value: corporateGoals.filter(
        (g) => (g.current_percentage || 0) >= 80 && (g.current_percentage || 0) < 95
      ).length,
      color: STATUS.watch.color,
    },
    {
      name: STATUS.atRisk.label,
      value: corporateGoals.filter((g) => (g.current_percentage || 0) < 80).length,
      color: STATUS.atRisk.color,
    },
  ].filter((d) => d.value > 0);

  // Pie 2 — number of goals by category (a true composition of the whole).
  const byCategory = Object.values(
    corporateGoals.reduce((acc, g) => {
      const key = g.category || 'Other';
      acc[key] = acc[key] || { name: key, value: 0 };
      acc[key].value += 1;
      return acc;
    }, {})
  );

  const segmentData = businessSegments.map((s) => ({
    name: s.code,
    fullName: s.name,
    value: s.current_percentage || 0,
  }));

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-navy-800 via-navy-700 to-brand-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-brand-100/80 text-sm font-medium">Management Review</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
            {ORG_NAME} Performance Dashboard
          </h1>
          <p className="text-slate-200 mt-2 max-w-2xl">
            Corporate goals, departmental KPIs and business-segment performance at a glance.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-12 space-y-6">
        {/* Stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile label="Avg Attainment" value={`${avg}%`} icon={TrendingUp} accent="#0d9488" />
          <StatTile label="Total Goals" value={corporateGoals.length} icon={Target} accent="#4f46e5" />
          <StatTile label="On Track" value={onTrack} icon={CheckCircle2} accent="#059669" />
          <StatTile label="At Risk" value={atRisk} icon={AlertTriangle} accent="#e11d48" />
        </div>

        {/* Charts row — two donuts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title="Goal Status Distribution">
            <DonutChart data={statusData} colors={statusData.map((d) => d.color)} unit=" goals" />
          </SectionCard>
          <SectionCard title="Goals by Category">
            <DonutChart
              data={byCategory}
              colors={byCategory.map((_, i) => segmentColor(i))}
              unit=" goals"
            />
          </SectionCard>
        </div>

        {/* Business segments bar */}
        <SectionCard title="Business Segment Performance">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={segmentData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  formatter={(v) => [`${v}%`, 'Attainment']}
                  labelFormatter={(l) => segmentData.find((s) => s.name === l)?.fullName || l}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={64} isAnimationActive={false}>
                  {segmentData.map((s, i) => (
                    <Cell key={s.name} fill={statusFor(s.value).color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Corporate goals grid */}
        <SectionCard title="Corporate Goals">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {corporateGoals.map((g) => (
              <GoalCard key={g.id} goal={g} />
            ))}
          </div>
        </SectionCard>

        {/* Departmental goals */}
        <SectionCard title="Departmental Goals">
          <div className="space-y-3">
            {departmentalGoals.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-5 py-4 hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-navy-800">{g.department}</p>
                  <p className="text-sm text-slate-500 truncate">{g.goal_title}</p>
                </div>
                <div className="flex items-center gap-6 text-right shrink-0">
                  <div>
                    <p className="text-xs text-slate-400">KPI</p>
                    <p className="text-sm font-medium text-slate-700">{g.kpi}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Current / Target</p>
                    <p className="text-sm font-bold text-navy-800">
                      {g.current_value} <span className="text-slate-400 font-normal">/ {g.target}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Recent reports */}
        <SectionCard
          title="Recent KPI Reports"
          action={
            <Link
              to="/submit-report"
              className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Submit report <ArrowRight className="w-4 h-4" />
            </Link>
          }
        >
          <ReportsTable reports={reports.slice(0, 8)} />
        </SectionCard>
      </div>
    </div>
  );
}

function DonutChart({ data, colors, unit }) {
  if (!data.length) {
    return <div className="h-64 flex items-center justify-center text-slate-400">No data</div>;
  }
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            stroke="#fff"
            strokeWidth={2}
            isAnimationActive={false}
            label={({ name, value }) => `${name}: ${value}${unit === '%' ? '%' : ''}`}
            labelLine={false}
          >
            {data.map((d, i) => (
              <Cell key={d.name} fill={colors[i]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v, n) => [`${v}${unit}`, n]}
            contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: 12, color: '#475569' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function ReportsTable({ reports }) {
  if (!reports.length) {
    return <div className="text-center py-10 text-slate-400">No reports submitted yet.</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b-2 border-slate-100">
            <th className="py-2.5 pr-4 font-semibold">KPI</th>
            <th className="py-2.5 pr-4 font-semibold">Department</th>
            <th className="py-2.5 pr-4 font-semibold">Period</th>
            <th className="py-2.5 pr-4 font-semibold">Attainment</th>
            <th className="py-2.5 pr-4 font-semibold">Submitted by</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => {
            const st = statusFor(r.percentage);
            return (
              <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-3 pr-4 font-medium text-navy-800">{r.kpi_name}</td>
                <td className="py-3 pr-4 text-slate-600">{r.department}</td>
                <td className="py-3 pr-4 text-slate-600">{r.reporting_period}</td>
                <td className="py-3 pr-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                    {r.percentage}%
                  </span>
                </td>
                <td className="py-3 pr-4 text-slate-500">{r.created_by}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
