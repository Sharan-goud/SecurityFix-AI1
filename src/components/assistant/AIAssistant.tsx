'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Trash2,
  Bot,
  User,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

export const AIAssistant: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    selectedProject,
    vulnerabilities,
    fixes,
    setCurrentTool,
    setSelectedVulnerability,
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your **SecurityFix AI Assistant**.\n\nI have access to your active project **${selectedProject?.name || 'ShopFlow Core'}** and its current scan findings (${vulnerabilities.length} vulnerabilities detected, Risk Score: ${selectedProject?.riskScore || 78}/100).\n\nHow can I assist you with vulnerability prioritization, remediation safety, or compatibility analysis today?`,
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'What should I fix first?', action: 'What vulnerability has the highest priority and what should I fix first?' },
        { label: 'Explain jsonwebtoken RCE', action: 'Explain the critical vulnerability in jsonwebtoken and why it matters.' },
        { label: 'Check breaking change risks', action: 'Are there breaking changes if I upgrade jsonwebtoken to 9.0.0 or lodash to 4.17.21?' },
        { label: 'Summarize risk posture', action: 'Give me an executive summary of our project security risks.' },
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAssistantOpen]);

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInput('');
    setIsTyping(true);

    // AI contextual response generator based on genuine project scan findings
    setTimeout(() => {
      const response = generateAIResponse(textToSend, vulnerabilities, selectedProject, fixes);
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        timestamp: 'Just now',
        suggestedActions: response.suggestedActions,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 700);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'reset',
        role: 'assistant',
        content: `Conversation cleared. I am ready to answer any questions about **${selectedProject?.name}**'s dependencies and vulnerabilities.`,
        timestamp: 'Just now',
        suggestedActions: [
          { label: 'What should I fix first?', action: 'What vulnerability has the highest priority and what should I fix first?' },
          { label: 'Explain prototype pollution in lodash', action: 'Explain prototype pollution in lodash.' },
        ],
      },
    ]);
  };

  return (
    <>
      {/* Floating Toggle Button (Bottom Right) */}
      <button
        id="ai-assistant-toggle"
        onClick={() => setIsAssistantOpen(!isAssistantOpen)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-tr from-electric-600 via-electric-500 to-cyan-400 text-white shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border border-cyan-300/40"
        title="Open SecurityFix AI Assistant"
      >
        <Sparkles className="h-6 w-6 text-white stroke-[2.2] animate-pulse-slow" />
      </button>

      {/* Floating Slide-out Chat Panel */}
      {isAssistantOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-[420px] max-w-[calc(100vw-3rem)] h-[580px] max-h-[calc(100vh-8rem)] bg-[#090e1a]/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-[#070b14] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-electric-600 to-cyan-500 flex items-center justify-center text-white shadow-sm shadow-cyan-500/30">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">SecurityFix AI Assistant</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                  Context: {selectedProject?.name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={clearChat}
                title="Clear conversation"
                className="h-7 w-7 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsAssistantOpen(false)}
                title="Close Assistant"
                className="h-7 w-7 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Context Banner */}
          <div className="bg-slate-900/60 px-3.5 py-1.5 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldAlert className="h-3 w-3 text-red-400" />
              {vulnerabilities.filter((v) => v.severity === 'CRITICAL').length} Critical • {vulnerabilities.filter((v) => v.severity === 'HIGH').length} High
            </span>
            <span className="text-cyan-400 font-mono text-[10px]">
              Grounding: Active Scan Data
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-2.5',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="h-6 w-6 rounded-md bg-electric-600/30 border border-electric-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={cn(
                    'rounded-xl px-3.5 py-2.5 max-w-[85%] leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-electric-600 text-white rounded-br-none shadow-md shadow-electric-600/20'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none'
                  )}
                >
                  <div className="whitespace-pre-line text-xs">
                    {msg.content}
                  </div>

                  {/* Suggested Quick Follow-ups */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(action.action)}
                          className="text-[10px] bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 px-2 py-1 rounded border border-cyan-500/20 transition-colors text-left flex items-center gap-1"
                        >
                          <span>{action.label}</span>
                          <ArrowRight className="h-2.5 w-2.5 text-cyan-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="h-6 w-6 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs pl-2">
                <Bot className="h-4 w-4 text-cyan-400 animate-spin" />
                <span className="italic">Analyzing project vulnerability graph...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#070b14] border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about vulnerabilities, fixes, or risks..."
                className="flex-1 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="h-8 w-8 rounded-lg bg-electric-600 hover:bg-electric-500 disabled:opacity-40 disabled:hover:bg-electric-600 text-white flex items-center justify-center transition-all flex-shrink-0 shadow-sm shadow-electric-600/30"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Grounded intelligent helper for answering user queries strictly from project findings
function generateAIResponse(
  query: string,
  vulnerabilities: any[],
  project: any,
  fixes: any[]
): { content: string; suggestedActions?: { label: string; action: string }[] } {
  const q = query.toLowerCase();

  if (q.includes('what should i fix first') || q.includes('priority') || q.includes('prioritize')) {
    const highestRisk = [...vulnerabilities].sort((a, b) => b.riskScore - a.riskScore)[0];
    if (highestRisk) {
      return {
        content: `**Top Fix Recommendation:**\n\nYou should prioritize **${highestRisk.packageName}** (${highestRisk.installedVersion} ➔ ${highestRisk.fixedVersion || 'patch'}).\n\n- **Vulnerability ID:** ${highestRisk.cveId || highestRisk.id}\n- **Severity:** ${highestRisk.severity} (CVSS: ${highestRisk.cvssScore})\n- **Calculated Risk Score:** ${highestRisk.riskScore}/100\n- **Exploit Status:** ${highestRisk.exploitStatus.replace(/_/g, ' ')}\n- **Reason:** ${highestRisk.aiExplanation.whyItMatters}\n\nWould you like me to open Fix Center to review the backup and verification workflow for this package?`,
        suggestedActions: [
          { label: 'Go to Fix Center', action: 'Take me to the Fix Center for this package' },
          { label: 'Check Breaking Changes', action: `Are there breaking changes if I upgrade ${highestRisk.packageName}?` },
        ],
      };
    }
  }

  if (q.includes('jwt') || q.includes('jsonwebtoken')) {
    const jwt = vulnerabilities.find((v) => v.packageName === 'jsonwebtoken');
    if (jwt) {
      return {
        content: `**Vulnerability Deep Dive: jsonwebtoken**\n\n- **Advisory:** ${jwt.cveId} (${jwt.id})\n- **Severity:** CRITICAL (${jwt.cvssScore})\n- **Installed Version:** ${jwt.installedVersion}\n- **Fixed In:** ${jwt.fixedVersion}\n\n**What it means:** ${jwt.aiExplanation.whatItMeans}\n\n**Impact:** Insecure key parsing allows attackers controlling signature parameters to trigger prototype pollution and execute arbitrary code on your server.\n\n**Remediation:** Upgrade to \`jsonwebtoken@9.0.0\`. Note: This is a **MAJOR** SemVer bump, so review custom key objects passed to \`jwt.verify()\`.`,
        suggestedActions: [
          { label: 'Review Fix in Fix Center', action: 'Review proposed diff for jsonwebtoken in Fix Center' },
        ],
      };
    }
  }

  if (q.includes('lodash') || q.includes('prototype pollution')) {
    const lodash = vulnerabilities.find((v) => v.packageName === 'lodash');
    if (lodash) {
      return {
        content: `**Vulnerability Deep Dive: lodash**\n\n- **Advisory:** ${lodash.cveId} (${lodash.id})\n- **Severity:** HIGH (${lodash.cvssScore})\n- **Installed Version:** ${lodash.installedVersion}\n- **Fixed In:** ${lodash.fixedVersion}\n\n**What it means:** ${lodash.aiExplanation.whatItMeans}\n\n**Remediation Safety:** Upgrading to \`4.17.21\` is a **PATCH** level upgrade (LOW RISK). It maintains 100% backwards compatibility while sanitizing \`__proto__\` keys in merge/defaultsDeep.`,
        suggestedActions: [
          { label: 'Approve Lodash Fix', action: 'How do I approve the lodash update in Fix Center?' },
        ],
      };
    }
  }

  if (q.includes('breaking') || q.includes('compatibility')) {
    return {
      content: `**Compatibility & Breaking Change Assessment:**\n\n1. **jsonwebtoken (8.5.1 ➔ 9.0.0):** ⚠️ **POTENTIAL BREAKING CHANGES**. Auth0 introduced strict type enforcement on keys. String and Buffer secrets work seamlessly, but custom object coercion is rejected.\n2. **lodash (4.17.15 ➔ 4.17.21):** ✅ **NON-BREAKING PATCH**. Fully safe.\n3. **express (4.17.1 ➔ 4.19.2):** ✅ **NON-BREAKING PATCH**. Safe upgrade within 4.x.\n4. **ip (1.1.8 ➔ 2.0.1):** ⚠️ Minor SemVer bump. Fixes SSRF validation without changing standard IPv4/IPv6 lookup APIs.`,
      suggestedActions: [
        { label: 'Open Compatibility Checker', action: 'Show me the Libraries Compatibility Checker' },
      ],
    };
  }

  if (q.includes('summary') || q.includes('posture') || q.includes('executive')) {
    return {
      content: `**Executive Security Summary for ${project?.name}:**\n\n- **Project Health Score:** ${100 - (project?.riskScore || 78)}/100 (Risk Score: ${project?.riskScore || 78}/100)\n- **Dependencies Monitored:** ${project?.dependenciesCount || 42}\n- **Critical Findings:** ${vulnerabilities.filter((v) => v.severity === 'CRITICAL').length}\n- **High Findings:** ${vulnerabilities.filter((v) => v.severity === 'HIGH').length}\n- **Remediation Status:** ${fixes.filter((f) => f.status === 'COMPLETED').length} verified, ${fixes.filter((f) => f.status === 'PENDING').length} pending developer approval.\n\n**Next Recommended Action:** Apply the verified fix for \`lodash\` and run integration tests for \`jsonwebtoken\`.`,
    };
  }

  // General grounded response
  return {
    content: `I've analyzed your question regarding "${query}".\n\nIn project **${project?.name}**, there are currently **${vulnerabilities.length} cataloged vulnerabilities** across ${project?.dependenciesCount} dependencies. Our risk model prioritizes findings with confirmed exploit evidence (such as CVE-2022-23529 in jsonwebtoken) above theoretical ReDoS issues.\n\nYou can inspect specific details in **Intelligence Center**, test patches in **Fix Center**, or run an automated test suite in **Testing Center**.`,
    suggestedActions: [
      { label: 'View Priority Queue', action: 'What should I fix first?' },
      { label: 'Review All Fixes', action: 'Give me an executive summary of our project security risks.' },
    ],
  };
}

