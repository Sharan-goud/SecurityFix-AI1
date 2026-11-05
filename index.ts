export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ToolType = 
  | 'dashboard' 
  | 'scan-center' 
  | 'intelligence-center' 
  | 'fix-center' 
  | 'testing-center' 
  | 'libraries' 
  | 'security-report';

export interface Project {
  id: string;
  name: string;
  type: 'node' | 'python' | 'go';
  ecosystem: 'npm' | 'PyPI';
  version: string;
  branch: string;
  repoUrl?: string;
  lastScanDate: string;
  riskScore: number; // 0 - 100
  dependenciesCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  isMonitored: boolean;
  scheduleFrequency: 'daily' | 'weekly' | 'manual';
  nextScheduledScan?: string;
}

export interface Vulnerability {
  id: string; // CVE or GHSA
  cveId?: string;
  packageName: string;
  ecosystem: 'npm' | 'PyPI';
  installedVersion: string;
  fixedVersion: string | null;
  severity: Severity;
  cvssScore: number;
  riskScore: number; // custom weighted priority 0-100
  exploitStatus: 'ACTIVE_IN_WILD' | 'PROOF_OF_CONCEPT' | 'THEORETICAL' | 'NO_KNOWN_EXPLOIT';
  dependencyType: 'DIRECT' | 'TRANSITIVE';
  callPath: string[];
  summary: string;
  details: string;
  aiExplanation: {
    whatItMeans: string;
    whyItMatters: string;
    affectedPackage: string;
    evidence: string;
    worstCaseScenario: string;
    recommendedRemediation: string;
    compatibilityImpact: 'LOW_RISK' | 'MEDIUM_RISK' | 'POTENTIAL_BREAKING_CHANGES';
  };
  fixRecommendation: {
    targetVersion: string;
    reason: string;
    isBreaking: boolean;
    changeType: 'PATCH' | 'MINOR' | 'MAJOR';
    verificationSteps: string[];
    releaseNotesUrl?: string;
  };
  status: 'DETECTED' | 'FIX_PROPOSED' | 'APPROVED' | 'APPLIED' | 'TESTED_PASSED' | 'ROLLED_BACK';
  publishedAt: string;
}

export interface FixItem {
  id: string;
  vulnerabilityId: string;
  packageName: string;
  currentVersion: string;
  targetVersion: string;
  severity: Severity;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'FAILED' | 'ROLLED_BACK';
  explanation: string;
  compatibilityRisk: 'LOW_RISK' | 'MEDIUM_RISK' | 'POTENTIAL_BREAKING_CHANGES';
  backupCreated: boolean;
  backupSnapshotId?: string;
  branchName?: string;
  pullRequestUrl?: string;
  proposedDiff: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestResult {
  id: string;
  timestamp: string;
  fixId: string;
  packageName: string;
  overallStatus: 'PASSED' | 'FAILED' | 'RUNNING' | 'PENDING';
  buildVerification: {
    status: 'PASSED' | 'FAILED' | 'PENDING';
    durationMs: number;
    details: string;
  };
  unitTests: {
    total: number;
    passed: number;
    failed: number;
    status: 'PASSED' | 'FAILED' | 'PENDING';
  };
  dependencyCompatibility: {
    status: 'PASSED' | 'FAILED' | 'PENDING';
    conflictsFound: number;
    details: string;
  };
  regressionCheck: {
    status: 'PASSED' | 'FAILED' | 'PENDING';
    details: string;
  };
  beforeScore: number;
  afterScore: number;
  logs: string[];
}

export interface SavedLibrary {
  id: string;
  name: string;
  version: string;
  ecosystem: 'npm' | 'PyPI';
  description: string;
  savedDate: string;
  license: string;
  healthScore: number;
  vulnerabilitiesCount: number;
  weeklyDownloads: string;
}

export interface DuplicateLibrary {
  id: string;
  packages: string[];
  functionalArea: string;
  overlapDetails: string;
  recommendation: string;
  estimatedSavings: string;
}

export interface CompatibilityCheckItem {
  id: string;
  packageName: string;
  currentVersion: string;
  proposedVersion: string;
  nodeCompatibility: string;
  peerDependencyConflicts: string[];
  status: 'COMPATIBLE' | 'WARNING' | 'INCOMPATIBLE';
  details: string;
}

export interface ReplacementRecommendation {
  id: string;
  existingPackage: string;
  suggestedAlternative: string;
  reason: string;
  securityAdvantage: string;
  bundleSizeReduction: string;
  migrationComplexity: 'EASY' | 'MODERATE' | 'COMPLEX';
}

export interface ScanHistoryRecord {
  id: string;
  date: string;
  projectName: string;
  targetFile: string;
  dependenciesScanned: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  totalVulnerabilities: number;
  riskScore: number;
  status: 'COMPLETED' | 'FAILED';
  duration: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  read: boolean;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
}

