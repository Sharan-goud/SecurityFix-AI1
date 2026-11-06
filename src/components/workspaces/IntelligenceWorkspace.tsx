'use client';

import React, { useState } from 'react';
import {
  BrainCircuit,
  ShieldAlert,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  GitBranch,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  FileText,
  Lock,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { Vulnerability } from '@/types';
import {
  getSeverityBadgeClass,
  getSeverityColor,
  getRiskScoreColor,
  getRiskScoreBg,
} from '@/lib/utils';

interface IntelligenceWorkspaceProps {
  onOpenApplyFixModal: (vuln: Vulnerability) => void;
}

export const IntelligenceWorkspace: React.FC<IntelligenceWorkspaceProps> = ({
  onOpenApplyFixModal,
}) => {
  const {
    vulnerabilities,
    selectedVulnerability,
    setSelectedVulnerability,
    setCurrentTool,
    selectedProject,
  } = useApp();

  const current = selectedVulnerability || vulnerabilities[0];

  // Risk factor radar breakdown data
  const radarData = current
    ? [
        { subject: 'CVSS Severity', score: Math.round(current.cvssScore * 10), fullMark: 100 },
        {
          subject: 'Exploit In Wild',
          score: current.exploitStatus === 'ACTIVE_IN_WILD' ? 95 : current.exploitStatus === 'PROOF_OF_CONCEPT' ? 70 : 30,
          fullMark: 100,
        },
        { subject: 'Direct Exposure', score: current.dependencyType === 'DIRECT' ? 90 : 45, fullMark: 100 },
        { subject: 'Call Reachability', score: 85, fullMark: 100 },
        { subject: 'Fix Complexity', score: current.fixRecommendation.isBreaking ? 80 : 30, fullMark: 100 },
      ]
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Intelligence Center
            </h1>
            <span className="text-[11px] font-semibold bg-purple-950/70 text-purple-300 border border-purple-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI Prioritization Engine
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            Deep context-aware analysis: understand why vulnerabilities matter and how to fix them without breaking production.
          </p>
        </div>

        {/* Selected Package Navigator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Inspecting:</span>
          <select
            value={current?.id || ''}
            onChange={(e) => {
              const target = vulnerabilities.find((v) => v.id === e.target.value);
              if (target) setSelectedVulnerability(target);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-cyan-500"
          >
            {vulnerabilities.map((v) => (
              <option key={v.id} value={v.id}>
                {v.packageName} ({v.severity} • Risk: {v.riskScore})
              </option>
            ))}
          </select>
        </div>
      </div>

      {current ? (
        <div className="space-y-6">
          {/* Section A & B: Risk Prioritization & Multi-Factor Radar Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Component A: Core Vulnerability Profile */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-bold text-white">
                      {current.packageName}
                    </h2>
                    <span className="text-xs font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                      v{current.installedVersion}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getSeverityBadgeClass(
                        current.severity
                      )}`}
                    >
                      {current.severity}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-cyan-400">
                    {current.cveId || current.id} • {current.ecosystem} ecosystem
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Computed Risk Score</div>
                  <div className={`text-2xl font-extrabold ${getRiskScoreColor(current.riskScore)}`}>
                    {current.riskScore} <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                </div>
              </div>

              {/* 4 Metadata Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                    CVSS 3.1 Base
                  </span>
                  <div className="text-base font-bold text-white mt-0.5">
                    {current.cvssScore} / 10.0
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Exploit Telemetry
                  </span>
                  <div className="text-xs font-bold text-orange-400 mt-1 truncate">
                    {current.exploitStatus.replace(/_/g, ' ')}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Dependency Tier
                  </span>
                  <div className="text-xs font-bold text-cyan-400 mt-1">
                    {current.dependencyType} DEP
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Fix Availability
                  </span>
                  <div className="text-xs font-bold text-emerald-400 mt-1">
                    {current.fixedVersion ? `v${current.fixedVersion}` : 'In Triage'}
                  </div>
                </div>
              </div>

              {/* Summary Description */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-300">Advisory Summary</span>
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {current.summary}
                </p>
              </div>

              {/* Call Path & Project Reachability */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <GitBranch className="h-3.5 w-3.5 text-cyan-400" />
                  Call Reachability &amp; Exposure Trace:
                </span>
                <div className="bg-[#060a14] p-3 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 flex items-center gap-2 overflow-x-auto">
                  {current.callPath.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="bg-slate-900 px-2 py-1 rounded text-cyan-300 border border-slate-800">
                        {step}
                      </span>
                      {idx < current.callPath.length - 1 && (
                        <ArrowRight className="h-3.5 w-3.5 text-slate-600 flex-shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Component B: Multi-Factor Radar Chart */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-card flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Risk Factor Radar
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Holistic weighting beyond raw CVSS
                </p>
              </div>

              <div className="h-60 w-full my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                    <Radar
                      name="Risk Vector"
                      dataKey="score"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3 space-y-1">
                <div className="flex justify-between">
                  <span>CVSS Impact:</span>
                  <span className="text-white font-mono">{current.cvssScore * 10}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Exploit In The Wild:</span>
                  <span className="text-orange-400 font-mono">
                    {current.exploitStatus === 'ACTIVE_IN_WILD' ? 'Active' : 'PoC Public'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section C: AI Vulnerability Explanation */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-[#0c1326] border border-cyan-500/20 shadow-card space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-electric-500/20 text-cyan-400 flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  AI Vulnerability Deep Explanation
                </h3>
                <p className="text-xs text-slate-400">
                  Grounded strictly in verified OSV advisories and application runtime topology
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* What It Means */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> What the vulnerability means:
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {current.aiExplanation.whatItMeans}
                </p>
              </div>

              {/* Why It Matters */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-orange-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" /> Why it matters for this project:
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {current.aiExplanation.whyItMatters}
                </p>
              </div>

              {/* Worst Case Scenario */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-red-500/20 space-y-1.5">
                <div className="font-bold text-red-300 flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5" /> Worst-case impact if unresolved:
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {current.aiExplanation.worstCaseScenario}
                </p>
              </div>

              {/* Evidence & References */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-purple-300 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" /> Exploit Evidence &amp; References:
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {current.aiExplanation.evidence}
                </p>
              </div>
            </div>
          </div>

          {/* Section D: AI Fix Suggestions & Compatibility Considerations */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Remediation &amp; Compatibility Assessment
                </h3>
                <p className="text-xs text-slate-400">
                  Recommended patch version with SemVer breaking change risk evaluation
                </p>
              </div>

              {current.fixedVersion && (
                <button
                  onClick={() => onOpenApplyFixModal(current)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-electric-600 to-cyan-500 hover:from-electric-500 hover:to-cyan-400 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-electric-600/30 transition-all self-start sm:self-center"
                >
                  <span>Apply Remediated Version</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  SemVer Upgrade Type
                </span>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="font-mono">{current.installedVersion}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="font-mono text-emerald-400">
                    {current.fixRecommendation.targetVersion}
                  </span>
                </div>
                <span
                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                    current.fixRecommendation.isBreaking
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {current.fixRecommendation.changeType} UPGRADE ({current.fixRecommendation.isBreaking ? 'Breaking changes possible' : 'Non-breaking patch'})
                </span>
              </div>

              <div className="md:col-span-2 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  Remediation Justification &amp; Compatibility
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {current.fixRecommendation.reason}
                </p>
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Recommended Verification Steps:
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                    {current.fixRecommendation.verificationSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500 text-sm">
          No vulnerabilities found for analysis.
        </div>
      )}
    </div>
  );
};

