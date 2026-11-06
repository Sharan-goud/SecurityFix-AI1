import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Severity } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSeverityBadgeClass(severity: Severity): string {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-red-500/15 text-red-400 border border-red-500/30';
    case 'HIGH':
      return 'bg-orange-500/15 text-orange-400 border border-orange-500/30';
    case 'MEDIUM':
      return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
    case 'LOW':
      return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
    default:
      return 'bg-slate-500/15 text-slate-400 border border-slate-500/30';
  }
}

export function getSeverityColor(severity: Severity): string {
  switch (severity) {
    case 'CRITICAL':
      return '#ef4444';
    case 'HIGH':
      return '#f97316';
    case 'MEDIUM':
      return '#f59e0b';
    case 'LOW':
      return '#3b82f6';
    default:
      return '#94a3b8';
  }
}

export function getRiskScoreColor(score: number): string {
  if (score >= 80) return 'text-red-400';
  if (score >= 60) return 'text-orange-400';
  if (score >= 40) return 'text-amber-400';
  if (score >= 20) return 'text-blue-400';
  return 'text-emerald-400';
}

export function getRiskScoreBg(score: number): string {
  if (score >= 80) return 'bg-red-500/10 border-red-500/20';
  if (score >= 60) return 'bg-orange-500/10 border-orange-500/20';
  if (score >= 40) return 'bg-amber-500/10 border-amber-500/20';
  if (score >= 20) return 'bg-blue-500/10 border-blue-500/20';
  return 'bg-emerald-500/10 border-emerald-500/20';
}

export function getRiskLevelText(score: number): string {
  if (score >= 80) return 'Critical Risk - Immediate Fix Required';
  if (score >= 60) return 'High Risk - Prioritize This Sprint';
  if (score >= 40) return 'Moderate Risk - Plan Remediations';
  if (score >= 20) return 'Low Risk - Routine Upgrades';
  return 'Minimal Risk - Secure Baseline';
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

