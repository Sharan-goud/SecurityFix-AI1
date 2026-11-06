'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  FolderGit2,
  ChevronDown,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Shield,
  User,
  LogOut,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

interface TopNavbarProps {
  onOpenNewScanModal?: () => void;
  onOpenGitHubModal?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenNewScanModal,
  onOpenGitHubModal,
}) => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    setIsMonitoringModalOpen,
    searchQuery,
    setSearchQuery,
    setIsAssistantOpen,
  } = useApp();

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        projectDropdownRef.current &&
        !projectDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProjectDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-20 h-16 w-full bg-[#070b13]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between">
        {/* Left: Project Selector */}
        <div className="flex items-center gap-4">
          <div className="relative" ref={projectDropdownRef}>
            <button
              onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 transition-all text-sm font-medium focus:outline-none focus:ring-1 focus:ring-electric-500"
            >
              <div className="h-5 w-5 rounded bg-electric-500/20 text-electric-400 flex items-center justify-center">
                <FolderGit2 className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold text-white max-w-[180px] truncate">
                {selectedProject?.name || 'Select Project'}
              </span>
              <span className="text-[11px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded uppercase">
                {selectedProject?.type || 'node'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Project Switcher Dropdown */}
            {isProjectDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-[#0c1220] border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Active Projects
                </div>
                {projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setIsProjectDropdownOpen(false);
                    }}
                    className={cn(
                      'w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800/60 transition-colors',
                      proj.id === selectedProjectId
                        ? 'bg-electric-500/10 text-white'
                        : 'text-slate-300'
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{proj.name}</span>
                      <span className="text-xs text-slate-400">
                        {proj.dependenciesCount} deps • Risk: {proj.riskScore}/100
                      </span>
                    </div>
                    {proj.id === selectedProjectId && (
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    )}
                  </button>
                ))}
                <div className="border-t border-slate-800 my-1 pt-1">
                  <button
                    onClick={() => {
                      setIsProjectDropdownOpen(false);
                      if (onOpenNewScanModal) onOpenNewScanModal();
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 hover:bg-slate-800/40"
                  >
                    <Plus className="h-3.5 w-3.5" /> Import New Project
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Schedule Status Badge */}
          <button
            onClick={() => setIsMonitoringModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors group"
          >
            <Clock className="h-3 w-3 text-cyan-400 group-hover:animate-spin" />
            <span>
              {selectedProject?.isMonitored
                ? `Auto-scan: ${selectedProject.scheduleFrequency}`
                : 'Schedule: Off'}
            </span>
            <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1 rounded border border-cyan-800/40">
              Manage
            </span>
          </button>
        </div>

        {/* Middle: Global Search */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search packages, CVE identifiers, recommendations..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-3">
          {/* AI Assistant Quick Pill */}
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-electric-600/20 to-cyan-500/20 hover:from-electric-600/30 hover:to-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-sm shadow-cyan-500/10 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>AI Assistant</span>
          </button>

          {/* Help Modal Trigger */}
          <button
            onClick={() => setIsHelpOpen(true)}
            title="Application Guide & Architecture"
            className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-cyan-500 text-black text-[10px] font-bold flex items-center justify-center ring-2 ring-[#070b13]">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#0c1220] border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Notifications
                  </span>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={cn(
                          'p-3 cursor-pointer hover:bg-slate-800/50 transition-colors text-left flex gap-2.5',
                          !notif.read ? 'bg-slate-800/20' : 'opacity-70'
                        )}
                      >
                        {notif.type === 'critical' ? (
                          <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                        ) : notif.type === 'success' ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Info className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="text-xs font-semibold text-slate-200">
                            {notif.title}
                          </div>
                          <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                            {notif.message}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1 font-mono">
                            {notif.timestamp}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-cyan-600 to-electric-500 flex items-center justify-center text-white text-xs font-bold">
                SF
              </div>
              <span className="text-xs font-medium text-slate-200 hidden sm:inline">
                DevSecOps
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0c1220] border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-800">
                  <div className="text-xs font-bold text-white">Security Lead</div>
                  <div className="text-[11px] text-slate-400 truncate">
                    security-admin@acmecorp.io
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsMonitoringModalOpen(true);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800/60 flex items-center gap-2"
                  >
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    Monitoring & Schedules
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsHelpOpen(true);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800/60 flex items-center gap-2"
                  >
                    <Shield className="h-3.5 w-3.5 text-cyan-400" />
                    Security Baseline Guide
                  </button>
                </div>
                <div className="border-t border-slate-800 pt-1">
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full px-4 py-2 text-left text-xs text-slate-400 hover:text-red-400 hover:bg-slate-800/60 flex items-center gap-2"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Interactive Quick Help & Architecture Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-electric-500/20 text-cyan-400 flex items-center justify-center">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base">
                  SecurityFix AI Platform Tour
                </h3>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>SecurityFix AI</strong> is engineered to eliminate vulnerability alert fatigue by prioritizing the vulnerabilities that actually matter to your project context, and orchestrating safe, verifiable remediations.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="font-semibold text-cyan-400 mb-1">1. Intelligent OSV Scanning</div>
                  <p className="text-slate-400 text-[11px]">
                    Scans <code>package.json</code>, <code>package-lock.json</code>, and <code>requirements.txt</code> against OpenSSF OSV advisories.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="font-semibold text-electric-400 mb-1">2. Risk Prioritization</div>
                  <p className="text-slate-400 text-[11px]">
                    CVSS is only one factor. We weigh active exploits, direct call paths, and blast radius to formulate an actionable 0-100 risk score.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="font-semibold text-purple-400 mb-1">3. Safe Fix Orchestration</div>
                  <p className="text-slate-400 text-[11px]">
                    Never modifies files blindly. Requires developer approval, takes snapshots, runs verification, and supports instant rollback.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="font-semibold text-emerald-400 mb-1">4. Verification & Testing</div>
                  <p className="text-slate-400 text-[11px]">
                    Validates syntax, peer compatibility, and test suites in disposable sandboxes before merging to main.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="px-4 py-2 rounded-lg bg-electric-600 hover:bg-electric-500 text-white font-medium text-xs transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

