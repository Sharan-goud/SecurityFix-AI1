'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { AIAssistant } from '@/components/assistant/AIAssistant';
import { DashboardWorkspace } from '@/components/workspaces/DashboardWorkspace';
import { ScanCenterWorkspace } from '@/components/workspaces/ScanCenterWorkspace';
import { IntelligenceWorkspace } from '@/components/workspaces/IntelligenceWorkspace';
import { FixCenterWorkspace } from '@/components/workspaces/FixCenterWorkspace';
import { TestingWorkspace } from '@/components/workspaces/TestingWorkspace';
import { LibrariesWorkspace } from '@/components/workspaces/LibrariesWorkspace';
import { SecurityReportWorkspace } from '@/components/workspaces/SecurityReportWorkspace';
import { MonitoringModal } from '@/components/modals/MonitoringModal';
import { GitHubModal } from '@/components/modals/GitHubModal';
import { ApplyFixModal } from '@/components/modals/ApplyFixModal';
import { AddLibraryModal } from '@/components/modals/AddLibraryModal';
import { FixItem, Vulnerability } from '@/types';

function MainApp() {
  const { currentTool, setCurrentTool, fixes } = useApp();

  // Modals state
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isAddLibModalOpen, setIsAddLibModalOpen] = useState(false);
  const [fixModalTarget, setFixModalTarget] = useState<FixItem | null>(null);
  const [isApplyFixModalOpen, setIsApplyFixModalOpen] = useState(false);

  // Helper to open fix modal directly from a vulnerability
  const handleOpenFixForVuln = (vuln: Vulnerability) => {
    // Find matching fix item or construct one
    let targetFix = fixes.find((f) => f.vulnerabilityId === vuln.id);
    if (!targetFix) {
      targetFix = {
        id: `fix-adhoc-${vuln.id}`,
        vulnerabilityId: vuln.id,
        packageName: vuln.packageName,
        currentVersion: vuln.installedVersion,
        targetVersion: vuln.fixedVersion || 'latest',
        severity: vuln.severity,
        status: 'PENDING',
        explanation: vuln.aiExplanation.whatItMeans,
        compatibilityRisk: vuln.aiExplanation.compatibilityImpact,
        backupCreated: false,
        proposedDiff: `--- package.json (Current)\n+++ package.json (Proposed Update)\n@@ -12,2 +12,2 @@\n- "${vuln.packageName}": "${vuln.installedVersion}"\n+ "${vuln.packageName}": "${vuln.fixedVersion || 'latest'}"`,
        verified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    setFixModalTarget(targetFix);
    setIsApplyFixModalOpen(true);
  };

  const handleOpenFixForFixItem = (fix: FixItem) => {
    setFixModalTarget(fix);
    setIsApplyFixModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070b13] flex">
      {/* 1. Fixed Left Sidebar */}
      <Sidebar />

      {/* 2. Main Application Wrapper (Shifted right for 72 = 18rem width sidebar) */}
      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <TopNavbar
          onOpenNewScanModal={() => setCurrentTool('scan-center')}
          onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        />

        {/* Dynamic Workspace Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {currentTool === 'dashboard' && (
            <DashboardWorkspace
              onOpenNewScan={() => setCurrentTool('scan-center')}
            />
          )}

          {currentTool === 'scan-center' && (
            <ScanCenterWorkspace
              onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
              onOpenApplyFixModal={handleOpenFixForVuln}
            />
          )}

          {currentTool === 'intelligence-center' && (
            <IntelligenceWorkspace
              onOpenApplyFixModal={handleOpenFixForVuln}
            />
          )}

          {currentTool === 'fix-center' && (
            <FixCenterWorkspace
              onOpenApplyFixModal={handleOpenFixForFixItem}
              onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
            />
          )}

          {currentTool === 'testing-center' && <TestingWorkspace />}

          {currentTool === 'libraries' && (
            <LibrariesWorkspace
              onOpenAddLibraryModal={() => setIsAddLibModalOpen(true)}
            />
          )}

          {currentTool === 'security-report' && <SecurityReportWorkspace />}
        </main>
      </div>

      {/* 3. Floating AI Assistant (Accessible throughout entire application) */}
      <AIAssistant />

      {/* 4. Global Modals */}
      <MonitoringModal />
      <GitHubModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
      <ApplyFixModal
        fix={fixModalTarget}
        isOpen={isApplyFixModalOpen}
        onClose={() => {
          setIsApplyFixModalOpen(false);
          setFixModalTarget(null);
        }}
      />
      <AddLibraryModal
        isOpen={isAddLibModalOpen}
        onClose={() => setIsAddLibModalOpen(false)}
      />
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

