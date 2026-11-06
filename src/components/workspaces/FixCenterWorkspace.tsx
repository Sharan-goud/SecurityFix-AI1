'use client';

import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  GitBranch,
  ShieldCheck,
  FileDiff,
  ExternalLink,
  FolderGit2,
  ChevronRight,
  Database,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { FixItem, Severity } from '@/types';
import { getSeverityBadgeClass, getRiskScoreColor } from '@/lib/utils';

interface FixCenterWorkspaceProps {
  onOpenApplyFixModal: (fix: FixItem) => void;
  onOpenGitHubModal: () => void;
}

export const FixCenterWorkspace: React.FC<FixCenterWorkspaceProps> = ({
  onOpenApplyFixModal,
  onOpenGitHubModal,
}) => {
  const {
    fixes,
    approveFix,
    rollbackFix,
    selectedProject,
    setCurrentTool,
    searchQuery,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'COMPLETED' | 'FAILED'>('ALL');
  const [selectedFixForDiff, setSelectedFixForDiff] = useState<FixItem | null>(null);

  // Filtered Fixes
  const filteredFixes = fixes.filter((f) => {
    const matchesTab = activeTab === 'ALL' || f.status === activeTab;
    const matchesSearch =
      !searchQuery ||
      f.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.vulnerabilityId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = fixes.filter((f) => f.status === 'PENDING').length;
  const approvedCount = fixes.filter((f) => f.status === 'APPROVED').length;
  const completedCount = fixes.filter((f) => f.status === 'COMPLETED').length;
  const failedCount = fixes.filter((f) => f.status === 'FAILED').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Fix Center
            </h1>
            <span className="text-[11px] font-semibold bg-orange-950/70 text-orange-400 border border-orange-800/50 px-2 py-0.5 rounded-full">
              Automated Remediation
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            Review proposed version bumps, approve dependency patches, and verify isolated builds before merge.
          </p>
        </div>

        {/* GitHub PR Connection Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenGitHubModal}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <FolderGit2 className="h-4 w-4 text-cyan-400" />
            <span>GitHub PR Settings</span>
          </button>
        </div>
      </div>

      {/* Fix Pipeline Stage Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { id: 'PENDING', label: 'Pending Approval', count: pendingCount, color: 'text-orange-400', border: 'border-orange-500/20' },
          { id: 'APPROVED', label: 'Approved (Staged)', count: approvedCount, color: 'text-cyan-400', border: 'border-cyan-500/20' },
          { id: 'COMPLETED', label: 'Verified & Merged', count: completedCount, color: 'text-emerald-400', border: 'border-emerald-500/20' },
          { id: 'FAILED', label: 'Failed Verification', count: failedCount, color: 'text-red-400', border: 'border-red-500/20' },
        ].map((stage) => (
          <button
            key={stage.id}
            onClick={() => setActiveTab(stage.id as any)}
            className={`p-4 rounded-xl bg-slate-900/80 border text-left transition-all ${
              activeTab === stage.id
                ? 'border-cyan-400/50 bg-slate-850 shadow-md shadow-cyan-500/10'
                : `${stage.border} hover:border-slate-700`
            }`}
          >
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {stage.label}
            </div>
            <div className={`text-2xl font-extrabold mt-1 ${stage.color}`}>
              {stage.count}
            </div>
          </button>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {(['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'FAILED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab
                ? 'bg-electric-600/20 text-cyan-300 border border-electric-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Fix Cards List */}
      <div className="space-y-4">
        {filteredFixes.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs rounded-xl border border-slate-800 bg-slate-900/40">
            No fixes found in &quot;{activeTab}&quot; category.
          </div>
        ) : (
          filteredFixes.map((fix) => (
            <div
              key={fix.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 shadow-card transition-all space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base font-bold text-white">
                      {fix.packageName}
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span className="text-slate-400">{fix.currentVersion}</span>
                      <ArrowRight className="h-3 w-3 text-cyan-400" />
                      <span className="text-emerald-400 font-bold">
                        {fix.targetVersion}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getSeverityBadgeClass(
                        fix.severity
                      )}`}
                    >
                      {fix.severity}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Target Advisory: {fix.vulnerabilityId}
                  </div>
                </div>

                {/* Status Pill */}
                <div className="self-start sm:self-center">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                      fix.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : fix.status === 'APPROVED'
                        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                        : fix.status === 'FAILED'
                        ? 'bg-red-500/10 text-red-300 border-red-500/30'
                        : 'bg-orange-500/10 text-orange-300 border-orange-500/30'
                    }`}
                  >
                    Status: {fix.status}
                  </span>
                </div>
              </div>

              {/* Fix Explanation & Compatibility Badge */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {fix.explanation}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Compatibility:</span>
                  <span
                    className={`text-[11px] font-semibold ${
                      fix.compatibilityRisk === 'POTENTIAL_BREAKING_CHANGES'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {fix.compatibilityRisk.replace(/_/g, ' ')}
                  </span>
                </div>

                {fix.backupCreated && (
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                    <Database className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="text-[11px] font-mono">
                      Snapshot: {fix.backupSnapshotId}
                    </span>
                  </div>
                )}

                {fix.branchName && (
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1.5 text-cyan-300">
                    <GitBranch className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="text-[11px] font-mono">
                      {fix.branchName}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() =>
                    setSelectedFixForDiff(
                      selectedFixForDiff?.id === fix.id ? null : fix
                    )
                  }
                  className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                >
                  <FileDiff className="h-3.5 w-3.5 text-cyan-400" />
                  <span>
                    {selectedFixForDiff?.id === fix.id
                      ? 'Hide Proposed Diff'
                      : 'View Manifest Diff'}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  {/* Approve button if pending */}
                  {fix.status === 'PENDING' && (
                    <button
                      onClick={() => approveFix(fix.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                    >
                      Approve Fix
                    </button>
                  )}

                  {/* Apply Update button */}
                  {fix.status !== 'COMPLETED' && (
                    <button
                      onClick={() => onOpenApplyFixModal(fix)}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-electric-600 to-cyan-500 hover:from-electric-500 hover:to-cyan-400 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-electric-600/30 transition-all"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Apply Update (Sandbox)</span>
                    </button>
                  )}

                  {/* Rollback button if completed */}
                  {fix.status === 'COMPLETED' && (
                    <button
                      onClick={() => rollbackFix(fix.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Rollback</span>
                    </button>
                  )}

                  {fix.pullRequestUrl && (
                    <a
                      href={fix.pullRequestUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1 hover:bg-purple-500/30 transition-colors"
                    >
                      <span>Draft PR</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Inline Diff Viewer */}
              {selectedFixForDiff?.id === fix.id && (
                <div className="mt-3 p-3 rounded-xl bg-[#060a14] border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre">
                  {fix.proposedDiff.split('\n').map((line, idx) => {
                    let clr = 'text-slate-400';
                    if (line.startsWith('+')) clr = 'text-emerald-400 bg-emerald-500/10 px-1';
                    if (line.startsWith('-')) clr = 'text-red-400 bg-red-500/10 px-1';
                    if (line.startsWith('@')) clr = 'text-cyan-400';
                    return <div key={idx} className={clr}>{line}</div>;
                  })}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

