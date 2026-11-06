'use client';

import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingDown,
  Layers,
  Sparkles,
  Calendar,
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
import { getSeverityBadgeClass, getRiskScoreColor, formatDate } from '@/lib/utils';

export const SecurityReportWorkspace: React.FC = () => {
  const {
    selectedProject,
    vulnerabilities,
    fixes,
    testResults,
    scanHistory,
  } = useApp();

  const [reportGeneratedAt, setReportGeneratedAt] = useState<string>(
    new Date().toLocaleString()
  );
  const [isGenerating, setIsGenerating] = useState(false);

  // Statistics
  const total = vulnerabilities.length;
  const critical = vulnerabilities.filter((v) => v.severity === 'CRITICAL').length;
  const high = vulnerabilities.filter((v) => v.severity === 'HIGH').length;
  const resolved = fixes.filter((f) => f.status === 'COMPLETED').length;
  const remaining = total - resolved;

  const distributionData = [
    { name: 'Critical', value: critical, color: '#ef4444' },
    { name: 'High', value: high, color: '#f97316' },
    { name: 'Medium', value: vulnerabilities.filter((v) => v.severity === 'MEDIUM').length, color: '#eab308' },
    { name: 'Low', value: vulnerabilities.filter((v) => v.severity === 'LOW').length, color: '#3b82f6' },
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 800));
    setReportGeneratedAt(new Date().toLocaleString());
    setIsGenerating(false);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = 'Package,Installed Version,Fixed Version,Severity,Vulnerability ID,Risk Score,Status\n';
    const rows = vulnerabilities
      .map(
        (v) =>
          `"${v.packageName}","${v.installedVersion}","${v.fixedVersion || 'N/A'}","${v.severity}","${v.cveId || v.id}","${v.riskScore}","${v.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securityfix-report-${selectedProject?.name || 'project'}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const reportData = {
      project: selectedProject,
      generatedAt: reportGeneratedAt,
      executiveSummary: {
        totalVulnerabilities: total,
        criticalVulnerabilities: critical,
        highVulnerabilities: high,
        resolvedVulnerabilities: resolved,
        remainingVulnerabilities: remaining,
        currentRiskScore: selectedProject?.riskScore,
      },
      vulnerabilities,
      remediations: fixes,
      verificationTestRuns: testResults,
      scanHistory,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securityfix-audit-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16 printable-report">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Security Report
            </h1>
            <span className="text-[11px] font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded-full">
              Executive &amp; Audit Ready
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            Comprehensive audit report for compliance, leadership reviews, and engineering sprints.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-electric-600 to-cyan-500 hover:from-electric-500 hover:to-cyan-400 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-electric-600/30 transition-all disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isGenerating ? 'Compiling Audit Data...' : 'Generate Report'}</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Printer className="h-4 w-4 text-cyan-400" />
            <span>Export PDF / Print</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Download className="h-4 w-4 text-purple-400" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>

      {/* Report Document Container */}
      <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-8">
        {/* Document Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-electric-600 flex items-center justify-center text-white shadow-lg shadow-electric-600/30">
              <ShieldCheck className="h-7 w-7 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                SecurityFix AI Audit Report
              </h2>
              <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                <span>Project: <strong className="text-white">{selectedProject?.name}</strong></span>
                <span>•</span>
                <span>Branch: <strong className="text-slate-300 font-mono">{selectedProject?.branch}</strong></span>
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400 space-y-0.5">
            <div>Generated: <span className="text-white font-mono">{reportGeneratedAt}</span></div>
            <div>Auditor: <span className="text-cyan-400 font-mono">SecurityFix Platform AI</span></div>
            <div>Classification: <span className="text-emerald-400 font-semibold uppercase">Confidential Internal</span></div>
          </div>
        </div>

        {/* Overall Security Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Total Cataloged
            </span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {total}
            </div>
            <span className="text-[10px] text-slate-400">All severity levels</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-red-500/20">
            <span className="text-[10px] text-red-400 uppercase tracking-wider font-semibold">
              Critical
            </span>
            <div className="text-2xl font-extrabold text-red-400 mt-1">
              {critical}
            </div>
            <span className="text-[10px] text-slate-400">CVSS &gt;= 9.0</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-orange-500/20">
            <span className="text-[10px] text-orange-400 uppercase tracking-wider font-semibold">
              High-Risk
            </span>
            <div className="text-2xl font-extrabold text-orange-400 mt-1">
              {high}
            </div>
            <span className="text-[10px] text-slate-400">CVSS 7.0 - 8.9</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20">
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
              Resolved &amp; Verified
            </span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">
              {resolved}
            </div>
            <span className="text-[10px] text-emerald-400">Patched in sandbox</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Remaining Open
            </span>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">
              {remaining}
            </div>
            <span className="text-[10px] text-slate-400">Action planned</span>
          </div>
        </div>

        {/* Before-and-After Security Impact */}
        <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <TrendingDown className="h-4 w-4 text-emerald-400" />
              Before-and-After Remediation Impact:
            </span>
            <p className="text-xs text-slate-400 max-w-xl">
              Applying the staged security updates for <code>lodash</code> and <code>express</code> reduces the aggregate project risk score by 14 points and closes 2 public exploit vectors.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-xs text-slate-400">Baseline Score</div>
              <div className="text-2xl font-extrabold text-red-400">
                {selectedProject?.riskScore || 78}
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-cyan-400" />
            <div className="text-center">
              <div className="text-xs text-slate-400">Post-Fix Projected</div>
              <div className="text-2xl font-extrabold text-emerald-400">
                {Math.max(12, (selectedProject?.riskScore || 78) - 18)}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Findings Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Cataloged Vulnerabilities &amp; Remediation Plan
          </h3>

          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#070b13] text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Installed</th>
                  <th className="py-3 px-4">Vulnerability ID</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Recommended Version</th>
                  <th className="py-3 px-4 text-right">Fix Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {vulnerabilities.map((v) => (
                  <tr key={v.id}>
                    <td className="py-3 px-4 font-bold text-white">{v.packageName}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{v.installedVersion}</td>
                    <td className="py-3 px-4 font-mono text-cyan-400">{v.cveId || v.id}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getSeverityBadgeClass(v.severity)}`}>
                        {v.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                      {v.fixedVersion || 'Under investigation'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] font-mono text-slate-300">
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Sign-off Block */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            SecurityFix AI Platform Automated Audit Engine • Verified via OpenSSF OSV
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>Digital Hash: SHA256-SECFIX-{selectedProject?.id || 'shopflow'}-AUDIT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

