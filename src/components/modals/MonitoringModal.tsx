'use client';

import React, { useState } from 'react';
import {
  Clock,
  Bell,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  GitBranch,
  X,
  Save,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const MonitoringModal: React.FC = () => {
  const {
    isMonitoringModalOpen,
    setIsMonitoringModalOpen,
    selectedProject,
    toggleMonitoring,
  } = useApp();

  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'manual'>(
    selectedProject?.scheduleFrequency || 'daily'
  );
  const [notifyOnCritical, setNotifyOnCritical] = useState(true);
  const [autoBranch, setAutoBranch] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState('security-team@acmecorp.io');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isMonitoringModalOpen) return null;

  const handleSave = () => {
    toggleMonitoring(frequency);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsMonitoringModalOpen(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-electric-500/20 border border-electric-500/30 text-cyan-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Scheduled Continuous Monitoring
              </h3>
              <p className="text-xs text-slate-400">
                Project: {selectedProject?.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMonitoringModalOpen(false)}
            className="text-slate-400 hover:text-white text-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Schedule Frequency Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Scan Cadence
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'daily', title: 'Daily Scan', desc: 'Runs every 24h at 00:00 UTC' },
              { id: 'weekly', title: 'Weekly Scan', desc: 'Every Monday morning' },
              { id: 'manual', title: 'Manual Only', desc: 'On commit or manual trigger' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setFrequency(option.id as any)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  frequency === option.id
                    ? 'bg-electric-600/20 border-cyan-400/60 shadow-sm shadow-cyan-500/20 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold">{option.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  {option.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Timing Information */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400">Last Verified Scan:</span>
            <div className="font-mono text-slate-200 mt-0.5">
              {selectedProject?.lastScanDate
                ? new Date(selectedProject.lastScanDate).toLocaleString()
                : 'Never'}
            </div>
          </div>
          <div>
            <span className="text-slate-400">Next Scheduled Scan:</span>
            <div className="font-mono text-cyan-400 mt-0.5">
              {frequency === 'manual'
                ? 'Paused (Manual only)'
                : selectedProject?.nextScheduledScan
                ? new Date(selectedProject.nextScheduledScan).toLocaleString()
                : 'In 24 hours'}
            </div>
          </div>
        </div>

        {/* Automated Branching & Alerts */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <GitBranch className="h-4 w-4 text-cyan-400" />
              <div>
                <div className="text-xs font-semibold text-white">
                  Automated Security Branches
                </div>
                <div className="text-[11px] text-slate-400">
                  Create isolated branches (<code>securityfix/patch-*</code>) for verified fixes
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoBranch}
              onChange={(e) => setAutoBranch(e.target.checked)}
              className="h-4 w-4 rounded accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Bell className="h-4 w-4 text-orange-400" />
              <div>
                <div className="text-xs font-semibold text-white">
                  Immediate Critical CVE Alerts
                </div>
                <div className="text-[11px] text-slate-400">
                  Notify DevSecOps channel immediately if CVSS &gt;= 9.0 detected
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifyOnCritical}
              onChange={(e) => setNotifyOnCritical(e.target.checked)}
              className="h-4 w-4 rounded accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">
              Notification Email / Webhook Recipient
            </label>
            <input
              type="email"
              value={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Continuous OSV monitoring
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMonitoringModalOpen(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-electric-600 to-cyan-500 hover:from-electric-500 hover:to-cyan-400 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-electric-600/30 transition-all"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

