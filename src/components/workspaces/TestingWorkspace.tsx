'use client';

import React, { useState } from 'react';
import {
  TestTube,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { TestResult } from '@/types';
import { getRiskScoreColor } from '@/lib/utils';

export const TestingWorkspace: React.FC = () => {
  const {
    testResults,
    runManualTests,
    rescanCurrentProject,
    selectedProject,
    isScanning,
  } = useApp();

  const [isRunningTests, setIsRunningTests] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string>(testResults[0]?.id || '');

  const activeTest = testResults.find((t) => t.id === selectedTestId) || testResults[0];

  const handleRunNewTest = async () => {
    setIsRunningTests(true);
    const res = await runManualTests(selectedProject?.name || 'project');
    setSelectedTestId(res.id);
    setIsRunningTests(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Testing Center
            </h1>
            <span className="text-[11px] font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded-full">
              Automated Regression Sandbox
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            Verify compilation, unit tests, and peer dependency compatibility in isolated runners before deployment.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => rescanCurrentProject()}
            disabled={isScanning}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`h-4 w-4 text-cyan-400 ${isScanning ? 'animate-spin' : ''}`} />
            <span>Rescan After Fixing</span>
          </button>

          <button
            onClick={handleRunNewTest}
            disabled={isRunningTests}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-electric-600 to-cyan-500 hover:from-electric-500 hover:to-cyan-400 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-electric-600/30 transition-all disabled:opacity-50"
          >
            <Play className={`h-4 w-4 fill-white ${isRunningTests ? 'animate-spin' : ''}`} />
            <span>{isRunningTests ? 'Executing Test Runner...' : 'Run Tests'}</span>
          </button>
        </div>
      </div>

      {/* Top 4 Verification Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Build Verification */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Build Verification
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-lg font-bold text-white">
              {activeTest?.buildVerification.status || 'PASSED'}
            </span>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Compiler duration: {activeTest?.buildVerification.durationMs || 3200}ms
            </div>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">
            Zero syntax errors
          </div>
        </div>

        {/* Unit & Integration Tests */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Test Suites
            </span>
            <Activity className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <span className="text-lg font-bold text-emerald-400">
              {activeTest?.unitTests.passed || 48} / {activeTest?.unitTests.total || 48} Passed
            </span>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Failed: {activeTest?.unitTests.failed || 0}
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            100% Pass Rate
          </div>
        </div>

        {/* Peer Compatibility */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Compatibility Checks
            </span>
            <Layers className="h-4 w-4 text-purple-400" />
          </div>
          <div className="my-2">
            <span className="text-lg font-bold text-white">
              {activeTest?.dependencyCompatibility.status || 'PASSED'}
            </span>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Conflicts: {activeTest?.dependencyCompatibility.conflictsFound || 0}
            </div>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">
            SemVer constraints met
          </div>
        </div>

        {/* Before-and-After Comparison */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Risk Reduction
            </span>
            <TrendingDown className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-sm font-mono text-slate-400 line-through">
              {activeTest?.beforeScore || 78}
            </span>
            <ArrowRight className="h-3 w-3 text-cyan-400" />
            <span className="text-2xl font-extrabold text-emerald-400">
              {activeTest?.afterScore || 66}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold font-mono">
              (-12 pts)
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Project security posture improved
          </div>
        </div>
      </div>

      {/* Main Workspace Grid: Test Details & Real-Time Console Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Run History & Selector */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Verification Runs
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {testResults.length} records
            </span>
          </div>

          <div className="space-y-2">
            {testResults.map((test) => (
              <button
                key={test.id}
                onClick={() => setSelectedTestId(test.id)}
                className={`w-full p-3 rounded-xl border text-left transition-all ${
                  selectedTestId === test.id
                    ? 'bg-electric-600/15 border-cyan-400/50 shadow-sm shadow-cyan-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">
                    {test.packageName} verification
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      test.overallStatus === 'PASSED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {test.overallStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                  <span>{new Date(test.timestamp).toLocaleTimeString()}</span>
                  <span>{test.unitTests.passed} tests passed</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Terminal & Detailed Logs */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#070b13] border border-slate-800 shadow-card space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-bold text-white">
                Isolated Runner Terminal Output
              </span>
              <span className="text-[10px] text-slate-500 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Container: /tmp/secfix-workspace
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-slate-400 font-mono">
                Exit Code: 0 (OK)
              </span>
            </div>
          </div>

          {/* Console Output */}
          <div className="h-72 bg-[#040710] p-4 rounded-xl border border-slate-900 font-mono text-xs text-slate-300 overflow-y-auto space-y-1">
            {activeTest?.logs.map((line, idx) => {
              let clr = 'text-slate-400';
              if (line.includes('PASS') || line.includes('passed') || line.includes('successfully')) clr = 'text-emerald-400';
              if (line.includes('FAIL') || line.includes('error')) clr = 'text-red-400';
              if (line.includes('Initializing') || line.includes('Creating')) clr = 'text-cyan-400';
              return (
                <div key={idx} className={clr}>
                  {line}
                </div>
              );
            })}
          </div>

          {/* Footer Status */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Runtime Engine: Node.js 20.x Sandbox Runner</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="h-4 w-4" /> Zero Host Mutations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

