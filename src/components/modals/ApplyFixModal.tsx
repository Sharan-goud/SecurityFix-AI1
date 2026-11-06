'use client';

import React, { useState } from 'react';
import {
  Wrench,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  GitBranch,
  Terminal,
  FileDiff,
  Loader2,
  X,
  Database,
  ArrowRight,
} from 'lucide-react';
import { FixItem } from '@/types';
import { useApp } from '@/context/AppContext';
import { getSeverityBadgeClass } from '@/lib/utils';

interface ApplyFixModalProps {
  fix: FixItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyFixModal: React.FC<ApplyFixModalProps> = ({
  fix,
  isOpen,
  onClose,
}) => {
  const { applyFixWithVerification, rollbackFix, selectedProject } = useApp();

  const [step, setStep] = useState<'REVIEW' | 'APPLYING' | 'RESULT'>('REVIEW');
  const [currentActionLog, setCurrentActionLog] = useState<string>('');
  const [verificationPassed, setVerificationPassed] = useState<boolean | null>(null);

  if (!isOpen || !fix) return null;

  const handleStartApply = async () => {
    setStep('APPLYING');
    setCurrentActionLog('1/4 Creating pre-update project backup snapshot...');

    await new Promise((r) => setTimeout(r, 600));
    setCurrentActionLog('2/4 Initializing isolated sandbox workspace (/tmp/secfix-workspace)...');

    await new Promise((r) => setTimeout(r, 700));
    setCurrentActionLog(`3/4 Applying update: ${fix.packageName}@${fix.targetVersion}...`);

    await new Promise((r) => setTimeout(r, 800));
    setCurrentActionLog('4/4 Running compiler build and test suite verification...');

    const success = await applyFixWithVerification(fix.id);
    setVerificationPassed(success);
    setStep('RESULT');
  };

  const handleRollback = () => {
    rollbackFix(fix.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Remediate {fix.packageName}
              </h3>
              <p className="text-xs text-slate-400">
                Safe Verification &amp; Isolated Workspace Protocol
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={step === 'APPLYING'}
            className="text-slate-400 hover:text-white text-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STEP 1: REVIEW PROPOSED CHANGE & REQUIRE CONFIRMATION */}
        {step === 'REVIEW' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Target Upgrade:</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-sm text-slate-200">
                    {fix.packageName}@{fix.currentVersion}
                  </span>
                  <ArrowRight className="h-4 w-4 text-cyan-400" />
                  <span className="font-mono text-sm font-bold text-cyan-400">
                    {fix.packageName}@{fix.targetVersion}
                  </span>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getSeverityBadgeClass(fix.severity)}`}>
                {fix.severity}
              </span>
            </div>

            {/* Proposed Diff Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  <FileDiff className="h-4 w-4 text-cyan-400" /> Proposed Manifest Diff
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Target: package.json / requirements.txt
                </span>
              </div>
              <div className="bg-[#050811] p-3 rounded-lg border border-slate-800/80 font-mono text-xs overflow-x-auto text-slate-300 whitespace-pre">
                {fix.proposedDiff.split('\n').map((line, idx) => {
                  let color = 'text-slate-400';
                  if (line.startsWith('+')) color = 'text-emerald-400 bg-emerald-500/10 px-1';
                  if (line.startsWith('-')) color = 'text-red-400 bg-red-500/10 px-1';
                  if (line.startsWith('@')) color = 'text-cyan-400';
                  return (
                    <div key={idx} className={color}>
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Safety Steps Notice */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Strict Safety Verification Process:
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] pl-1">
                <li>Create snapshot backup in <code>.secfix-backups/</code></li>
                <li>Mount isolated sandbox container (no live production mutations)</li>
                <li>Execute build compiler and 52 test suites</li>
                <li>Open draft PR with verification badge only upon 100% pass</li>
              </ol>
            </div>

            {/* Confirmation Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-500">
                Requires developer confirmation
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-lg text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartApply}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-electric-600 to-cyan-500 hover:from-electric-500 hover:to-cyan-400 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-electric-600/30 transition-all"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Confirm &amp; Apply in Isolated Runner</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: RUNNING VERIFICATION IN ISOLATED WORKSPACE */}
        {step === 'APPLYING' && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <Loader2 className="h-12 w-12 text-cyan-400 animate-spin" />
              <ShieldCheck className="h-6 w-6 text-electric-400 absolute inset-0 m-auto" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                Applying Update &amp; Running Verification
              </div>
              <div className="text-xs text-cyan-300 font-mono mt-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                {currentActionLog}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 max-w-sm">
              Your active workspace files remain untouched until tests pass completely.
            </p>
          </div>
        )}

        {/* STEP 3: OUTCOME DISPLAY WITH ROLLBACK OPTION */}
        {step === 'RESULT' && (
          <div className="space-y-4">
            {verificationPassed ? (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                  Verification Successful! Zero Regressions.
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The update to <strong>{fix.packageName}@{fix.targetVersion}</strong> compiled cleanly. All unit tests, peer dependency checks, and payload schemas passed verification.
                </p>
                <div className="pt-2 text-xs font-mono text-cyan-300 flex items-center gap-1.5">
                  <GitBranch className="h-3.5 w-3.5" />
                  Branch: <code>securityfix/update-{fix.packageName}-{fix.targetVersion}</code>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-red-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Verification Failed in Isolated Workspace
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  One or more test suites failed during package execution. No production code was modified.
                </p>
              </div>
            )}

            {/* Backup Snapshot Record */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-cyan-400" />
                <span className="text-slate-300">Backup Snapshot:</span>
                <span className="font-mono text-slate-400">
                  {fix.backupSnapshotId || 'snapshot-active-verified'}
                </span>
              </div>
              <span className="text-emerald-400 font-semibold text-[11px]">
                Preserved
              </span>
            </div>

            {/* Actions: Close or Rollback */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleRollback}
                className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-orange-400 hover:text-orange-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Rollback / Restore Snapshot</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-electric-600 hover:bg-electric-500 text-white text-xs font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

