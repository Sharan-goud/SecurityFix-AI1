'use client';

import React, { useState } from 'react';
import {
  Library,
  Plus,
  Search,
  Trash2,
  Copy,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SavedLibrary } from '@/types';

interface LibrariesWorkspaceProps {
  onOpenAddLibraryModal: () => void;
}

export const LibrariesWorkspace: React.FC<LibrariesWorkspaceProps> = ({
  onOpenAddLibraryModal,
}) => {
  const {
    savedLibraries,
    removeSavedLibrary,
    duplicates,
    compatibilityChecks,
    replacements,
    selectedProject,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'saved' | 'duplicates' | 'compatibility' | 'replacements'>('saved');
  const [libSearch, setLibSearch] = useState('');

  const filteredSaved = savedLibraries.filter(
    (l) =>
      !libSearch ||
      l.name.toLowerCase().includes(libSearch.toLowerCase()) ||
      l.description.toLowerCase().includes(libSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Libraries
            </h1>
            <span className="text-[11px] font-semibold bg-purple-950/70 text-purple-300 border border-purple-800/50 px-2 py-0.5 rounded-full">
              Package Health &amp; Architecture
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            Audit dependencies, identify duplicate functionality, evaluate compatibility, and discover modern secure replacements.
          </p>
        </div>

        <button
          onClick={onOpenAddLibraryModal}
          className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-electric-600 to-cyan-500 hover:from-electric-500 hover:to-cyan-400 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-electric-600/30 transition-all self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Library</span>
        </button>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'saved', label: `Saved Libraries (${savedLibraries.length})` },
          { id: 'duplicates', label: `Duplicate Detection (${duplicates.length})` },
          { id: 'compatibility', label: `Compatibility Checker (${compatibilityChecks.length})` },
          { id: 'replacements', label: `Modern Replacements (${replacements.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === tab.id
                ? 'bg-electric-600/20 text-cyan-300 border border-electric-500/40 shadow-sm shadow-electric-500/10'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUBSECTION A: SAVED LIBRARIES */}
      {activeSubTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={libSearch}
                onChange={(e) => setLibSearch(e.target.value)}
                placeholder="Search saved libraries..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <span className="text-xs text-slate-400">
              Tracking {filteredSaved.length} packages
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 overflow-hidden shadow-card bg-slate-900/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0a0f1d] text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Package Name</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">Ecosystem</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Health Score</th>
                  <th className="py-3 px-4">Saved Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSaved.map((lib) => (
                  <tr key={lib.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">
                      {lib.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-400">
                      v{lib.version}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 uppercase">
                      {lib.ecosystem}
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                      {lib.description}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-400 font-bold font-mono">
                        {lib.healthScore}/100
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {lib.savedDate}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => removeSavedLibrary(lib.id)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBSECTION B: DUPLICATE DETECTION */}
      {activeSubTab === 'duplicates' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-cyan-400">Architectural Note:</span>{' '}
            SecurityFix AI detects redundant and overlapping libraries to reduce bundle bloat and attack surface. Libraries are never automatically removed—always verify usage before refactoring.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {duplicates.map((dup) => (
              <div
                key={dup.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-card space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Copy className="h-4 w-4 text-orange-400" />
                    <span className="font-bold text-sm text-white">
                      {dup.functionalArea}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono border border-amber-500/20">
                    Overlap Detected
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Conflicting Packages:</span>
                  <div className="flex items-center gap-1.5">
                    {dup.packages.map((pkg, i) => (
                      <span
                        key={i}
                        className="font-mono bg-slate-950 px-2 py-0.5 rounded text-cyan-300 border border-slate-800"
                      >
                        {pkg}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {dup.overlapDetails}
                </p>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-400">
                    Architectural Recommendation:
                  </span>
                  <p className="text-slate-400 text-[11px]">
                    {dup.recommendation}
                  </p>
                  <div className="text-[10px] font-mono text-cyan-400 pt-1">
                    Potential Savings: {dup.estimatedSavings}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBSECTION C: COMPATIBILITY CHECKER */}
      {activeSubTab === 'compatibility' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {compatibilityChecks.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-card space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-sm text-white">
                      {item.packageName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.status === 'COMPATIBLE'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="my-2.5 flex items-center gap-2 font-mono text-xs">
                    <span className="text-slate-400">{item.currentVersion}</span>
                    <ArrowRight className="h-3 w-3 text-cyan-400" />
                    <span className="text-emerald-400 font-bold">
                      {item.proposedVersion}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="text-slate-400 text-[11px]">
                      Node Runtime: <strong className="text-slate-200">{item.nodeCompatibility}</strong>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed mt-1">
                      {item.details}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                  Peer dependency conflicts: {item.peerDependencyConflicts.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBSECTION D: REPLACEMENT RECOMMENDATIONS */}
      {activeSubTab === 'replacements' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {replacements.map((rep) => (
              <div
                key={rep.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-card space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs text-red-400 font-mono">
                      {rep.existingPackage}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      {rep.migrationComplexity} Migration
                    </span>
                  </div>

                  <div className="my-2 flex items-center gap-2">
                    <span className="text-xs text-slate-400">Suggests:</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      {rep.suggestedAlternative}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rep.reason}
                  </p>

                  <div className="mt-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                    <div className="text-cyan-400 font-semibold">
                      Security Benefit:
                    </div>
                    <div className="text-slate-300">
                      {rep.securityAdvantage}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Savings:</span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    {rep.bundleSizeReduction}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

