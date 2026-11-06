import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SecurityFix AI — Intelligent Vulnerability Prioritization & Remediation',
  description: "Don't just detect vulnerabilities. Know what to fix first. Modern cybersecurity SaaS platform for automated dependency scanning and safe remediation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#070b13] text-slate-100 antialiased selection:bg-cyan-500/20 selection:text-cyan-300">
        {children}
      </body>
    </html>
  );
}

