import React from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_ANALYTICS_DATA } from '../../data/seedData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Clock,
  Activity,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';

export function AnalyticsView() {
  const { incidents, nodes, patrols } = useApp();

  // Dynamically compute category counts from actual incidents in state
  const categoryCounts = {};
  incidents.forEach((inc) => {
    const cat = inc.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryChartData = Object.keys(categoryCounts).map((cat, i) => {
    const colors = ['#EF4444', '#F59E0B', '#06B6D4', '#8B5CF6', '#10B981', '#38BDF8'];
    return {
      name: cat.split(' / ')[0],
      count: categoryCounts[cat],
      color: colors[i % colors.length],
    };
  });

  // Severity Breakdown
  const severityCounts = {
    CRITICAL: incidents.filter((i) => i.severity === 'CRITICAL').length,
    HIGH: incidents.filter((i) => i.severity === 'HIGH').length,
    MEDIUM: incidents.filter((i) => i.severity === 'MEDIUM').length,
    LOW: incidents.filter((i) => i.severity === 'LOW').length,
  };

  const severityPieData = [
    { name: 'Critical', value: severityCounts.CRITICAL, color: '#EF4444' },
    { name: 'High', value: severityCounts.HIGH, color: '#F59E0B' },
    { name: 'Medium', value: severityCounts.MEDIUM, color: '#EAB308' },
    { name: 'Low', value: severityCounts.LOW, color: '#10B981' },
  ].filter((d) => d.value > 0);

  // False positive suppression count
  const dismissedCount = incidents.filter((i) => i.status === 'DISMISSED').length;
  const resolvedCount = incidents.filter((i) => i.status === 'RESOLVED').length;
  const activeCount = incidents.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'DISMISSED'
  ).length;

  const totalEvaluated = INITIAL_ANALYTICS_DATA.responseMetrics.suppressedFalsePositivesCount + incidents.length;
  const totalSuppressed = INITIAL_ANALYTICS_DATA.responseMetrics.suppressedFalsePositivesCount + dismissedCount;
  const suppressionRate = ((totalSuppressed / totalEvaluated) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-command-900 border border-command-700/60 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Civic Safety Analytics & Response Intelligence
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              SEEDED DEMO TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time metric aggregation across Guntur safety zones. Real-time updates reflect current incident lifecycles and false-alarm suppressions.
          </p>
        </div>

        <div className="text-[11px] font-mono text-slate-400 bg-command-950 px-3 py-1.5 rounded-lg border border-command-800">
          Last Synced: <span className="text-cyan-300">Just Now</span>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Mean Operator Verification Time */}
        <div className="glass-panel p-4 rounded-xl border border-command-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>AVG VERIFICATION</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono">
            28<span className="text-base text-slate-400 font-normal"> sec</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Simulated operator response benchmark
          </div>
        </div>

        {/* KPI 2: Patrol Dispatch Time */}
        <div className="glass-panel p-4 rounded-xl border border-command-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>DISPATCH LATENCY</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            1.4<span className="text-base text-slate-400 font-normal"> min</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Simulated nearest-unit allocation vector
          </div>
        </div>

        {/* KPI 3: False-Positive Suppression */}
        <div className="glass-panel p-4 rounded-xl border border-command-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>SUPPRESSION RATE</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-mono">
            {suppressionRate}%
          </div>
          <div className="text-[11px] text-slate-400">
            {totalSuppressed} harmless events filtered (Live + Baseline)
          </div>
        </div>

        {/* KPI 4: Mean Arrival ETA */}
        <div className="glass-panel p-4 rounded-xl border border-command-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>ESTIMATED ON-SCENE</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
            3.8<span className="text-base text-slate-400 font-normal"> min</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Simulated city sector average (not live GPS)
          </div>
        </div>
      </div>

      {/* Main Charts Row 1: Hourly Trends & Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Volume Area Chart (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-4 rounded-xl border border-command-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              24-Hour Diurnal Event & Suppression Profile
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Hourly Events (Guntur)
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={INITIAL_ANALYTICS_DATA.hourlyTrend}>
                <defs>
                  <linearGradient id="colorDetected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorSuppressed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="hour" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'Inter',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
                <Area
                  type="monotone"
                  dataKey="detected"
                  name="Verified Incidents"
                  stroke="#EF4444"
                  fillOpacity={1}
                  fill="url(#colorDetected)"
                />
                <Area
                  type="monotone"
                  dataKey="suppressed"
                  name="Benign Noise Suppressed"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorSuppressed)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Breakdown Donut (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-4 rounded-xl border border-command-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Live Incident Severity Breakdown
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">
              {incidents.length} in System
            </span>
          </div>

          {severityPieData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2 opacity-80" />
              <div className="text-xs text-slate-300 font-semibold">Zero Recorded Incidents</div>
              <div className="text-[11px] text-slate-500 mt-1">Run a scenario in Detection Lab to generate live telemetry.</div>
            </div>
          ) : (
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {severityPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Categories Bar Chart & Area Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Categories Bar Chart (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-4 rounded-xl border border-command-700/60 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-400" />
            Incident Classification Distribution
          </h3>

          {categoryChartData.length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center text-center p-4">
              <Info className="w-8 h-8 text-cyan-400 mb-2 opacity-80" />
              <div className="text-xs text-slate-300 font-semibold">No Category Telemetry Available</div>
              <div className="text-[11px] text-slate-500 mt-1">Classification breakdown will display when incidents are registered.</div>
            </div>
          ) : (
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" name="Incidents" radius={[4, 4, 0, 0]}>
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Hotspots & Device Uptime (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-4 rounded-xl border border-command-700/60 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            Area Vulnerability Index (Guntur)
          </h3>

          <div className="space-y-2.5 pt-1">
            {INITIAL_ANALYTICS_DATA.areaHotspots.map((area, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-command-950 border border-command-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">{area.area}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Historical Recorded: {area.incidents} alerts
                  </div>
                </div>

                <span
                  className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold border ${
                    area.riskLevel === 'HIGH'
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : area.riskLevel === 'MEDIUM'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {area.riskLevel} PRIORITY
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
