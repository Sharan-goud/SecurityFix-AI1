'use client';

import React, { useState } from 'react';
import {
  GitBranch,
  FolderGit2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  X,
  FileCode,
  Lock,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const { runScanOnContent, setCurrentTool } = useApp();

  const [connectedRepo, setConnectedRepo] = useState('acme-corp/shopflow-api');
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [targetFile, setTargetFile] = useState('package-lock.json');
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImportAndScan = async () => {
    setIsImporting(true);
    setImportStatus('Connecting to GitHub API with installation token...');

    await new Promise((r) => setTimeout(r, 600));
    setImportStatus(`Fetching ${targetFile} from ${connectedRepo}@${selectedBranch}...`);

    await new Promise((r) => setTimeout(r, 800));

    // Sample real package-lock.json content for genuine parsing
    const sampleLock = JSON.stringify(
      {
        name: 'shopflow-api',
        version: '2.4.1',
        lockfileVersion: 2,
        packages: {
          '': { name: 'shopflow-api', version: '2.4.1' },
          'node_modules/jsonwebtoken': { version: '8.5.1' },
          'node_modules/lodash': { version: '4.17.15' },
          'node_modules/axios': { version: '0.21.1' },
          'node_modules/express': { version: '4.17.1' },
          'node_modules/ip': { version: '1.1.8' },
          'node_modules/braces': { version: '3.0.2' },
          'node_modules/semver': { version: '7.3.5' },
        },
      },
      null,
      2
    );

    await runScanOnContent(connectedRepo.split('/')[1], targetFile, sampleLock);

    setIsImporting(false);
    onClose();
    setCurrentTool('scan-center');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700 text-white flex items-center justify-center">
              <FolderGit2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                GitHub Repository Integration
              </h3>
              <p className="text-xs text-slate-400">
                Authorized via GitHub App (OAuth 2.0 Webhook)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Security & Least-Privilege Notice */}
        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-start gap-2.5 text-xs text-cyan-200">
          <Lock className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-cyan-300">Zero-Token Architecture:</span>{' '}
            We use GitHub App fine-grained permissions. Updates are staged on dedicated branches (<code>securityfix/*</code>) and proposed via draft Pull Requests. We never write directly to default branches.
          </div>
        </div>

        {/* Form controls */}
        <div className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-300">
              Select Repository
            </label>
            <select
              value={connectedRepo}
              onChange={(e) => setConnectedRepo(e.target.value)}
              className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="acme-corp/shopflow-api">acme-corp/shopflow-api (Node.js)</option>
              <option value="acme-corp/ml-pipeline">acme-corp/ml-pipeline (Python)</option>
              <option value="acme-corp/auth-gateway">acme-corp/auth-gateway (Node.js/Go)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">
                Target Branch
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="main">main (default)</option>
                <option value="develop">develop</option>
                <option value="staging">staging</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">
                Dependency Manifest
              </label>
              <select
                value={targetFile}
                onChange={(e) => setTargetFile(e.target.value)}
                className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="package-lock.json">package-lock.json</option>
                <option value="package.json">package.json</option>
                <option value="requirements.txt">requirements.txt</option>
              </select>
            </div>
          </div>
        </div>

        {isImporting && (
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-300 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{importStatus}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Read-only manifest access
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isImporting}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleImportAndScan}
              disabled={isImporting}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-electric-600 to-cyan-500 hover:from-electric-500 hover:to-cyan-400 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-electric-600/30 transition-all disabled:opacity-50"
            >
              <FolderGit2 className="h-3.5 w-3.5" />
              <span>Import & Run OSV Scan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

