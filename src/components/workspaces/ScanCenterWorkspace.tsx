'use client';

import React, { useState, useRef } from 'react';
import {
  ScanSearch,
  Upload,
  FolderGit2,
  FileCode,
  FileArchive,
  RefreshCw,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Clock,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Severity, Vulnerability } from '@/types';
import { getSeverityBadgeClass, getRiskScoreColor, formatDate } from '@/lib/utils';

interface ScanCenterWorkspaceProps {
  onOpenGitHubModal: () => void;
  onOpenApplyFixModal: (vuln: Vulnerability) => void;
}

export const ScanCenterWorkspace: React.FC<ScanCenterWorkspaceProps> = ({
  onOpenGitHubModal,
  onOpenApplyFixModal,
}) => {
  const {
    vulnerabilities,
    selectedProject,
    setSelectedVulnerability,
    setCurrentTool,
    runScanOnContent,
    rescanCurrentProject,
    isScanning,
    scanProgressText,
    scanProgressPercent,
    scanHistory,
    searchQuery,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'results' | 'history'>('results');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [projectNameInput, setProjectNameInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handler
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target?.result as string;
      await runScanOnContent(
        projectNameInput.trim() || file.name.replace(/\.[^/.]+$/, ''),
        file.name,
        content
      );
    };

    reader.readAsText(file);
  };

  // Filter vulnerabilities
  const filteredVulns = vulnerabilities.filter((v) => {
    const matchesSeverity =
      severityFilter === 'ALL' || v.severity === severityFilter;
    const matchesSearch =
      !searchQuery ||
      v.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.cveId && v.cveId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSeverity && matchesSearch;
  });

  // Export Results
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
    a.download = `securityfix-scan-${selectedProject?.name || 'report'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(vulnerabilities, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securityfix-scan-${selectedProject?.name || 'report'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Scan Center
            </h1>
            <span className="text-[11px] font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-800/50 px-2 py-0.5 rounded-full">
              OSV-Scanner Enabled
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            Upload dependency manifests, connect Git repositories, and inspect genuine CVE advisories.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => rescanCurrentProject()}
            disabled={isScanning}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 text-cyan-400 ${isScanning ? 'animate-spin' : ''}`} />
            <span>Rescan Project</span>
          </button>
          <div className="relative group">
            <button className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all">
              <Download className="h-4 w-4 text-electric-400" />
              <span>Export</span>
            </button>
            <div className="hidden group-hover:block absolute right-0 mt-1 w-36 bg-[#0c1220] border border-slate-800 rounded-lg shadow-xl py-1 z-20">
              <button
                onClick={handleExportCSV}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800/70"
              >
                Export CSV
              </button>
              <button
                onClick={handleExportJSON}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800/70"
              >
                Export JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload & Repository Import Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drag & Drop Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            handleFileUpload(e.dataTransfer.files);
          }}
          className={`lg:col-span-2 p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center ${
            isDragOver
              ? 'border-cyan-400 bg-cyan-950/20'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
            accept=".json,.txt,.lock,.zip"
            className="hidden"
          />

          <div className="h-12 w-12 rounded-xl bg-electric-500/10 border border-electric-500/20 text-cyan-400 flex items-center justify-center mb-3">
            <Upload className="h-6 w-6 stroke-[2]" />
          </div>

          <h3 className="text-base font-bold text-white">
            Upload Dependency Manifest or Project Archive
          </h3>
          <p className="text-xs text-slate-400 max-w-md mt-1">
            Drag and drop your <code>package-lock.json</code>, <code>package.json</code>, or <code>requirements.txt</code> here to run instant OSV-Scanner checks.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-lg bg-electric-600 hover:bg-electric-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-electric-600/30 transition-all"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Select File</span>
            </button>

            <button
              onClick={onOpenGitHubModal}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <FolderGit2 className="h-3.5 w-3.5 text-cyan-400" />
              <span>Connect GitHub Repository</span>
            </button>
          </div>

          <div className="mt-4 flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <FileCode className="h-3 w-3 text-cyan-400" /> package-lock.json (npm)
            </span>
            <span className="flex items-center gap-1">
              <FileCode className="h-3 w-3 text-electric-400" /> requirements.txt (PyPI)
            </span>
            <span className="flex items-center gap-1">
              <FileArchive className="h-3 w-3 text-purple-400" /> Project ZIP
            </span>
          </div>
        </div>

        {/* Scan Target & Engine Configuration Details */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Scan Configuration
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Current Project Context
            </p>

            <div className="space-y-3 mt-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectNameInput}
                  onChange={(e) => setProjectNameInput(e.target.value)}
                  placeholder={selectedProject?.name || 'Enter custom name...'}
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Scanner Engine:</span>
                  <span className="text-cyan-400 font-semibold">Google OSV + Trivy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Ecosystem:</span>
                  <span className="text-slate-200 font-mono uppercase">{selectedProject?.ecosystem || 'npm'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Repository:</span>
                  <span className="text-slate-200 font-mono truncate max-w-[140px]">{selectedProject?.repoUrl || 'Local Workspace'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Direct Isolation:</span>
                  <span className="text-emerald-400 font-semibold">Sandbox Protected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ScanSearch className="h-4 w-4" />
              <span>Start Scan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Scan Progress Indicator */}
      {isScanning && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-cyan-400 animate-spin" />
              {scanProgressText || 'Scanning dependencies...'}
            </span>
            <span className="font-mono text-cyan-400 font-bold">
              {scanProgressPercent}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-electric-500 to-cyan-400 transition-all duration-300 rounded-full"
              style={{ width: `${scanProgressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Tabs: Scan Results vs Scan History */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('results')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'results'
                ? 'bg-electric-600/20 border border-electric-500/40 text-cyan-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Scan Findings ({filteredVulns.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-electric-600/20 border border-electric-500/40 text-cyan-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Scan History ({scanHistory.length})
          </button>
        </div>

        {/* Severity Filters */}
        {activeTab === 'results' && (
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-slate-400 text-[11px] mr-1">Filter:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  severityFilter === sev
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab Content: Results Table */}
      {activeTab === 'results' ? (
        <div className="rounded-xl border border-slate-800 overflow-hidden shadow-card bg-slate-900/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0a0f1d] text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Package Name</th>
                  <th className="py-3 px-4">Installed Version</th>
                  <th className="py-3 px-4">Vulnerability ID</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Fixed Version</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredVulns.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                      No vulnerabilities found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredVulns.map((vuln) => (
                    <tr
                      key={vuln.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Package Name */}
                      <td className="py-3.5 px-4 font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {vuln.packageName}
                      </td>

                      {/* Installed Version */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {vuln.installedVersion}
                      </td>

                      {/* Vulnerability ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-cyan-400 font-medium">
                          {vuln.cveId || vuln.id}
                        </div>
                        {vuln.cveId && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            {vuln.id}
                          </div>
                        )}
                      </td>

                      {/* Severity */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getSeverityBadgeClass(
                            vuln.severity
                          )}`}
                        >
                          {vuln.severity}
                        </span>
                      </td>

                      {/* Fixed Version */}
                      <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">
                        {vuln.fixedVersion || 'No fixed version yet'}
                      </td>

                      {/* Risk Score */}
                      <td className="py-3.5 px-4 font-bold">
                        <span className={getRiskScoreColor(vuln.riskScore)}>
                          {vuln.riskScore}/100
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-medium text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          {vuln.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedVulnerability(vuln);
                              setCurrentTool('intelligence-center');
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                          >
                            Investigate
                          </button>
                          {vuln.fixedVersion && (
                            <button
                              onClick={() => {
                                onOpenApplyFixModal(vuln);
                              }}
                              className="px-2.5 py-1 rounded bg-electric-600/30 hover:bg-electric-600/50 border border-electric-500/40 text-cyan-300 text-xs font-medium transition-colors"
                            >
                              Fix
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Tab Content: Scan History */
        <div className="rounded-xl border border-slate-800 overflow-hidden shadow-card bg-slate-900/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0f1d] text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Manifest</th>
                <th className="py-3 px-4">Dependencies</th>
                <th className="py-3 px-4">Critical / High</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {scanHistory.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {rec.date}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {rec.projectName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {rec.targetFile}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {rec.dependenciesScanned} packages
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-red-400 font-bold">{rec.critical} Crit</span> /{' '}
                    <span className="text-orange-400 font-bold">{rec.high} High</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    <span className={getRiskScoreColor(rec.riskScore)}>
                      {rec.riskScore}/100
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {rec.duration}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-emerald-400 font-semibold flex items-center justify-end gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

