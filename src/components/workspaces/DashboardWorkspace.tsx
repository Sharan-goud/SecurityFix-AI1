'use client';

import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Clock,
  ScanSearch,
  Wrench,
  Library,
  FileBarChart,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import {
  getSeverityBadgeClass,
  getSeverityColor,
  getRiskScoreColor,
  getRiskScoreBg,
  getRiskLevelText,
  formatDate,
} from '@/lib/utils';
import { Severity, Vulnerability } from '@/types';

interface DashboardWorkspaceProps {
  onOpenNewScan: () => void;
}

export const DashboardWorkspace: React.FC<DashboardWorkspaceProps> = ({
  onOpenNewScan,
}) => {
  const {
    selectedProject,
    vulnerabilities,
    fixes,
    testResults,
    scanHistory,
    setCurrentTool,
    setSelectedVulnerability,
    searchQuery,
  } = useApp();

  // Vulnerability Distribution Data for Recharts
  const critCount = vulnerabilities.filter((v) => v.severity === 'CRITICAL').length;
  const highCount = vulnerabilities.filter((v) => v.severity === 'HIGH').length;
  const medCount = vulnerabilities.filter((v) => v.severity === 'MEDIUM').length;
  const lowCount = vulnerabilities.filter((v) => v.severity === 'LOW').length;

  const distributionData = [
    { name: 'Critical', count: critCount, color: '#ef4444' },
    { name: 'High', count: highCount, color: '#f97316' },
    { name: 'Medium', count: medCount, color: '#eab308' },
    { name: 'Low', count: lowCount, color: '#3b82f6' },
  ];

  // Priority Queue: Sorted by riskScore descending
  const filteredQueue = vulnerabilities
    .filter(
      (v) =>
        !searchQuery ||
        v.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.cveId && v.cveId.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => b.riskScore - a.riskScore);

  const riskScore = selectedProject?.riskScore ?? 78;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Security Overview
            </h1>
            <span className="text-[11px] font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-800/50 px-2 py-0.5 rounded-full">
              Live Baseline
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            Monitor your project security and manage vulnerabilities from one place.
          </p>
        </div>

        {/* Quick Actions Header Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenNewScan}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-electric-600 to-cyan-500 hover:from-electric-500 hover:to-cyan-400 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-electric-600/25 transition-all"
          >
            <ScanSearch className="h-4 w-4" />
            <span>New Scan</span>
          </button>
          <button
            onClick={() => setCurrentTool('fix-center')}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Wrench className="h-4 w-4 text-orange-400" />
            <span>Review Fixes</span>
          </button>
          <button
            onClick={() => setCurrentTool('libraries')}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Library className="h-4 w-4 text-purple-400" />
            <span>View Libraries</span>
          </button>
          <button
            onClick={() => setCurrentTool('security-report')}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <FileBarChart className="h-4 w-4 text-emerald-400" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Main Four Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Vulnerabilities */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-all shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Total Vulnerabilities
            </span>
            <div className="h-8 w-8 rounded-lg bg-electric-500/10 border border-electric-500/20 text-electric-400 flex items-center justify-center">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {vulnerabilities.length}
            </span>
            <span className="text-xs text-slate-400">
              Across {selectedProject?.dependenciesCount || 42} packages
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-800/60 pt-2 flex items-center justify-between">
            <span>Resolved this week:</span>
            <span className="text-emerald-400 font-semibold font-mono">
              +{fixes.filter((f) => f.status === 'COMPLETED').length} verified
            </span>
          </div>
        </div>

        {/* Critical Issues */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-red-500/20 hover:border-red-500/40 transition-all shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-red-400 uppercase tracking-wider">
              Critical Issues
            </span>
            <div className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-red-400 tracking-tight">
              {critCount}
            </span>
            <span className="text-xs text-red-300/80 font-medium">
              CVSS 9.0 - 10.0
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-800/60 pt-2 flex items-center justify-between">
            <span>RCE / Root Takeover:</span>
            <span className="text-red-400 font-semibold font-mono">
              Immediate action
            </span>
          </div>
        </div>

        {/* High Priority Issues */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-orange-500/20 hover:border-orange-500/40 transition-all shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-orange-400 uppercase tracking-wider">
              High Priority Issues
            </span>
            <div className="h-8 w-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-orange-400 tracking-tight">
              {highCount}
            </span>
            <span className="text-xs text-orange-300/80 font-medium">
              CVSS 7.0 - 8.9
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-800/60 pt-2 flex items-center justify-between">
            <span>Patches available:</span>
            <span className="text-cyan-400 font-semibold font-mono">
              100% compatible
            </span>
          </div>
        </div>

        {/* Dependencies Scanned */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-all shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Dependencies Scanned
            </span>
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {selectedProject?.dependenciesCount || 42}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {selectedProject?.ecosystem || 'npm'} manifest
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-800/60 pt-2 flex items-center justify-between">
            <span>Last OSV refresh:</span>
            <span className="text-slate-300 font-mono">Today</span>
          </div>
        </div>
      </div>

      {/* Row 2: Charts & Visual Risk Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Component B: Security Risk Score */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white tracking-wide">
                Security Risk Score
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRiskScoreBg(riskScore)} ${getRiskScoreColor(riskScore)}`}>
                PRIORITY INDEX
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-factor risk weighting combining CVSS, active exploit telemetry, and call path exposure.
            </p>
          </div>

          <div className="my-6 flex flex-col items-center justify-center text-center">
            {/* Visual Gauge Circle */}
            <div className="relative h-36 w-36 flex items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-800"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={riskScore > 70 ? '#ef4444' : riskScore > 50 ? '#f97316' : '#10b981'}
                  strokeWidth="8"
                  strokeDasharray={`${(riskScore / 100) * 264} 264`}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-extrabold ${getRiskScoreColor(riskScore)}`}>
                  {riskScore}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400">
                  / 100 Risk
                </span>
              </div>
            </div>

            <div className="mt-3">
              <div className={`text-xs font-bold ${getRiskScoreColor(riskScore)}`}>
                {getRiskLevelText(riskScore)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[240px]">
                {riskScore >= 70
                  ? 'Urgent attention required. 1 critical RCE vulnerability requires immediate upgrade.'
                  : 'Maintain standard vulnerability review cycle.'}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Target Security Goal:</span>
            <span className="text-emerald-400 font-semibold font-mono">
              &lt; 25 Low Risk
            </span>
          </div>
        </div>

        {/* Component A: Vulnerability Distribution Chart */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-card flex flex-col justify-between lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Vulnerability Distribution
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Breakdown by severity level across active scanned dependencies
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              {distributionData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-slate-300 font-medium">{d.name}</span>
                  <span className="text-slate-400 font-mono">({d.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-52 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c1220',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  itemStyle={{ color: '#38bdf8' }}
                  cursor={{ fill: 'rgba(56, 189, 248, 0.05)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              Prioritized fixing order reduces aggregate risk by 74%
            </span>
            <button
              onClick={() => setCurrentTool('intelligence-center')}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              Analyze in Intelligence Center <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Priority Queue & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Component C: Priority Queue */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Priority Remediation Queue
                </h2>
                <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-mono">
                  Ranked by Exploitation Risk
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                The most important vulnerabilities that need immediate attention first.
              </p>
            </div>
            <button
              onClick={() => setCurrentTool('fix-center')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              Go to Fix Center <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Table / List */}
          <div className="space-y-2.5">
            {filteredQueue.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      {item.packageName}
                    </span>
                    <span className="text-xs text-slate-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded">
                      v{item.installedVersion}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getSeverityBadgeClass(item.severity)}`}>
                      {item.severity}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.cveId || item.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 max-w-lg">
                    {item.summary}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>
                      Exploit: <strong className="text-slate-300">{item.exploitStatus.replace(/_/g, ' ')}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Dependency: <strong className="text-slate-300">{item.dependencyType}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">
                      Risk: <span className={getRiskScoreColor(item.riskScore)}>{item.riskScore}/100</span>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-mono">
                      Fix: {item.fixedVersion || 'Patch available'}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedVulnerability(item);
                      setCurrentTool('intelligence-center');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-electric-600/20 hover:bg-electric-600/30 border border-electric-500/40 text-cyan-300 text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    Investigate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Component D: Recent Activity */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Recent Activity
            </h2>
            <Clock className="h-4 w-4 text-slate-500" />
          </div>

          <div className="space-y-3.5">
            {/* Scans */}
            <div className="flex gap-2.5 items-start">
              <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ScanSearch className="h-3.5 w-3.5" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-200">
                  Dependency scan completed
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Scanned <code>package-lock.json</code> ({selectedProject?.dependenciesCount} packages)
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  Today, 18:30 UTC
                </div>
              </div>
            </div>

            {/* Verified updates */}
            <div className="flex gap-2.5 items-start">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-200">
                  Automated test verification passed
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Update verified for <code>lodash@4.17.21</code> (48/48 tests passed)
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  Yesterday, 19:05 UTC
                </div>
              </div>
            </div>

            {/* PR Created */}
            <div className="flex gap-2.5 items-start">
              <div className="h-7 w-7 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Wrench className="h-3.5 w-3.5" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-200">
                  Draft PR opened on GitHub
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Branch <code>securityfix/update-lodash-4.17.21</code>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  Yesterday, 19:10 UTC
                </div>
              </div>
            </div>

            {/* New CVE Alert */}
            <div className="flex gap-2.5 items-start">
              <div className="h-7 w-7 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle className="h-3.5 w-3.5" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-200">
                  Critical vulnerability detected
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  CVE-2022-23529 flagged in <code>jsonwebtoken@8.5.1</code>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  2 days ago
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-center">
            <button
              onClick={() => setCurrentTool('testing-center')}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              View Full Test History &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

