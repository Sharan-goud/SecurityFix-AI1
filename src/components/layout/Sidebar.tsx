'use client';

import React from 'react';
import {
  LayoutDashboard,
  ScanSearch,
  BrainCircuit,
  Wrench,
  TestTube,
  Library,
  FileBarChart,
  ShieldCheck,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ToolType } from '@/types';
import { cn } from '@/lib/utils';

interface NavItem {
  id: ToolType;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    currentTool,
    setCurrentTool,
    vulnerabilities,
    fixes,
    selectedProject,
  } = useApp();

  const pendingFixesCount = fixes.filter(
    (f) => f.status === 'PENDING' || f.status === 'APPROVED'
  ).length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'scan-center',
      label: 'Scan Center',
      icon: ScanSearch,
      badge: vulnerabilities.length,
      badgeColor: 'bg-electric-500/20 text-cyan-400 border border-cyan-500/30',
    },
    {
      id: 'intelligence-center',
      label: 'Intelligence Center',
      icon: BrainCircuit,
      badge: 'AI',
      badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    },
    {
      id: 'fix-center',
      label: 'Fix Center',
      icon: Wrench,
      badge: pendingFixesCount > 0 ? pendingFixesCount : undefined,
      badgeColor: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    },
    {
      id: 'testing-center',
      label: 'Testing Center',
      icon: TestTube,
    },
    {
      id: 'libraries',
      label: 'Libraries',
      icon: Library,
    },
    {
      id: 'security-report',
      label: 'Security Report',
      icon: FileBarChart,
    },
  ];

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-72 bg-[#090e1a] border-r border-slate-800/80 z-30 flex flex-col justify-between shadow-2xl">
      {/* Brand & Logo Header */}
      <div>
        <div className="p-5 border-b border-slate-800/80 bg-[#070b14]/70">
          <div className="flex items-start gap-3.5">
            {/* Logo: shield-check symbol inside a blue rounded square */}
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-electric-600 via-electric-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-electric-600/30 flex-shrink-0 border border-cyan-400/30">
              <ShieldCheck className="h-6 w-6 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white">
                  SecurityFix
                </span>
                <span className="font-bold text-xs px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-mono tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[11px] leading-snug text-slate-400 mt-1 font-normal line-clamp-2">
                Don&apos;t just detect vulnerabilities. Know what to fix first.
              </p>
            </div>
          </div>
        </div>

        {/* Current Active Workspace Indicator */}
        <div className="px-5 py-3 border-b border-slate-800/40 bg-slate-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-xs text-slate-300 font-medium truncate">
              {selectedProject?.name || 'ShopFlow Core'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono">
            v{selectedProject?.version || '1.0'}
          </span>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1.5 mt-2">
          <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Workspaces
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTool === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentTool(item.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                  isActive
                    ? 'bg-electric-600/15 text-white border border-electric-500/40 shadow-sm shadow-electric-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                )}
              >
                {/* Active Left Glow Accent */}
                {isActive && (
                  <span className="absolute -left-1 top-2 bottom-2 w-1.5 bg-gradient-to-b from-electric-400 to-cyan-400 rounded-r-full shadow-[0_0_8px_#38bdf8]" />
                )}

                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      isActive
                        ? 'text-cyan-400'
                        : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        'text-[11px] font-semibold px-2 py-0.5 rounded-full',
                        item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="h-3.5 w-3.5 text-cyan-400/80" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: Engine Status & Telemetry */}
      <div className="p-4 border-t border-slate-800/80 bg-[#070b14]/90 space-y-3">
        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center">
              <Activity className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">OSV Core Engine</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live Sync Active
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">v1.12</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span>SecurityFix AI Platform</span>
          <span className="hover:text-cyan-400 cursor-pointer">Docs & API</span>
        </div>
      </div>
    </aside>
  );
};

