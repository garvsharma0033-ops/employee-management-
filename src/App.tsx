/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EnterpriseSimulator } from './components/EnterpriseSimulator';
import { ApiConsole } from './components/ApiConsole';
import { CodeViewer } from './components/CodeViewer';
import { DatabaseViewer } from './components/DatabaseViewer';
import { SwingSimulator } from './components/SwingSimulator';
import { ENTERPRISE_SOURCES } from './data/enterpriseSources';
import { Download, Sparkles } from 'lucide-react';
import JSZip from 'jszip';

type WorkbenchTab = 'ENTERPRISE' | 'API' | 'CODE' | 'DATABASE' | 'DESKTOP';

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkbenchTab>('ENTERPRISE');
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      const zip = new JSZip();
      const rootFolder = zip.folder('enterprise-employee-management-service');

      ENTERPRISE_SOURCES.forEach(file => {
        rootFolder?.file(file.path, file.content);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'enterprise-employee-management-springboot.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create zip:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Bar Contract: Exactly 3 zones separated by gap-8 */}
      <header className="flex items-center justify-between gap-8 px-6 py-3 border-b border-slate-800 bg-slate-950 shrink-0">
        {/* Zone 1: Single text element wordmark */}
        <span className="text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2">
          <span>Enterprise Employee Management</span>
          <span className="text-[10px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
            Spring Boot 3.3
          </span>
        </span>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="flex items-center gap-6 text-xs font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('ENTERPRISE')}
            className={`transition whitespace-nowrap shrink-0 hover:text-white pb-0.5 ${
              activeTab === 'ENTERPRISE' ? 'text-blue-400 font-semibold border-b-2 border-blue-400' : ''
            }`}
          >
            Enterprise App
          </button>
          <button
            onClick={() => setActiveTab('API')}
            className={`transition whitespace-nowrap shrink-0 hover:text-white pb-0.5 ${
              activeTab === 'API' ? 'text-blue-400 font-semibold border-b-2 border-blue-400' : ''
            }`}
          >
            REST API Console
          </button>
          <button
            onClick={() => setActiveTab('CODE')}
            className={`transition whitespace-nowrap shrink-0 hover:text-white pb-0.5 ${
              activeTab === 'CODE' ? 'text-blue-400 font-semibold border-b-2 border-blue-400' : ''
            }`}
          >
            Java Code Explorer
          </button>
          <button
            onClick={() => setActiveTab('DATABASE')}
            className={`transition whitespace-nowrap shrink-0 hover:text-white pb-0.5 ${
              activeTab === 'DATABASE' ? 'text-blue-400 font-semibold border-b-2 border-blue-400' : ''
            }`}
          >
            MySQL Database
          </button>
          <button
            onClick={() => setActiveTab('DESKTOP')}
            className={`transition whitespace-nowrap shrink-0 hover:text-white pb-0.5 ${
              activeTab === 'DESKTOP' ? 'text-blue-400 font-semibold border-b-2 border-blue-400' : ''
            }`}
          >
            Desktop Swing Mode
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadZip}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition active:scale-95 disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Export Spring Boot ZIP'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 overflow-hidden flex flex-col">
        {activeTab === 'ENTERPRISE' && <EnterpriseSimulator />}
        {activeTab === 'API' && <ApiConsole />}
        {activeTab === 'CODE' && <CodeViewer />}
        {activeTab === 'DATABASE' && <DatabaseViewer />}
        {activeTab === 'DESKTOP' && <SwingSimulator />}
      </main>

      {/* Quiet Technical Metadata Footer */}
      <footer className="px-6 py-2 border-t border-slate-900 bg-slate-950 text-slate-500 text-[11px] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span>Enterprise EMS Architecture</span>
          <span aria-hidden="true">·</span>
          <span>Spring Security (JWT RBAC)</span>
          <span aria-hidden="true">·</span>
          <span>Spring Data JPA / Hibernate</span>
          <span aria-hidden="true">·</span>
          <span>HikariCP Connection Pool</span>
        </div>
        <div className="flex items-center gap-2">
          <span>MySQL 8.x Dialect</span>
          <span aria-hidden="true">·</span>
          <span>Apache PDFBox Payslips</span>
        </div>
      </footer>
    </div>
  );
}
