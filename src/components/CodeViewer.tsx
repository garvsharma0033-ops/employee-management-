import React, { useState } from 'react';
import { PROJECT_FILES, ProjectFile } from '../data/javaSources';
import { ENTERPRISE_SOURCES, EnterpriseSourceFile } from '../data/enterpriseSources';
import { 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  Database, 
  FileText, 
  Settings, 
  Archive,
  Info,
  Shield,
  Layers,
  Server
} from 'lucide-react';
import JSZip from 'jszip';

export const CodeViewer: React.FC = () => {
  const [activeStack, setActiveStack] = useState<'SPRING_BOOT' | 'SWING_JDBC'>('SPRING_BOOT');
  const [selectedSpringFile, setSelectedSpringFile] = useState<EnterpriseSourceFile>(ENTERPRISE_SOURCES[2]); // Employee.java
  const [selectedSwingFile, setSelectedSwingFile] = useState<ProjectFile>(PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const activeContent = activeStack === 'SPRING_BOOT' ? selectedSpringFile.content : selectedSwingFile.content;
  const activeFileName = activeStack === 'SPRING_BOOT' ? selectedSpringFile.name : selectedSwingFile.name;
  const activePath = activeStack === 'SPRING_BOOT' ? selectedSpringFile.path : selectedSwingFile.path;
  const activeDescription = activeStack === 'SPRING_BOOT' ? selectedSpringFile.description : selectedSwingFile.explanation;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([activeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSpringBootZip = async () => {
    try {
      setIsZipping(true);
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
      setIsZipping(false);
    }
  };

  const getFileIcon = (category: string) => {
    switch (category) {
      case 'entity':
      case 'java':
        return <FileCode className="w-4 h-4 text-amber-400" />;
      case 'repository':
      case 'sql':
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 'security':
        return <Shield className="w-4 h-4 text-purple-400" />;
      case 'controller':
        return <Server className="w-4 h-4 text-blue-400" />;
      case 'config':
        return <Settings className="w-4 h-4 text-slate-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* Top Action Bar */}
      <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Stack Switcher Pills */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveStack('SPRING_BOOT')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                activeStack === 'SPRING_BOOT'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Enterprise Spring Boot 3.3
            </button>
            <button
              onClick={() => setActiveStack('SWING_JDBC')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                activeStack === 'SWING_JDBC'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Java Desktop Swing & JDBC
            </button>
          </div>

          <div className="hidden md:block text-xs text-slate-400">
            {activeStack === 'SPRING_BOOT' 
              ? 'JPA Entities · Spring Data Repositories · Services · Controllers · JWT'
              : 'WindowBuilder JFrame · DAO Pattern · PreparedStatement'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownloadSingle}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Download File</span>
          </button>

          <button
            onClick={handleDownloadSpringBootZip}
            disabled={isZipping}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition active:scale-95 disabled:opacity-50"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>{isZipping ? 'Creating Archive...' : 'Export Full Maven Project (ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* Main Split: File Tree on left, Code on right */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Tree Navigator */}
        <div className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {activeStack === 'SPRING_BOOT' ? 'Maven Artifacts' : 'Desktop Project'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {activeStack === 'SPRING_BOOT' ? `${ENTERPRISE_SOURCES.length} files` : `${PROJECT_FILES.length} files`}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {activeStack === 'SPRING_BOOT' ? (
              ENTERPRISE_SOURCES.map(file => (
                <button
                  key={file.name}
                  onClick={() => setSelectedSpringFile(file)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition ${
                    selectedSpringFile.name === file.name
                      ? 'bg-blue-600/30 text-blue-200 border border-blue-500/40 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  {getFileIcon(file.category)}
                  <span className="truncate">{file.name}</span>
                </button>
              ))
            ) : (
              PROJECT_FILES.map(file => (
                <button
                  key={file.name}
                  onClick={() => setSelectedSwingFile(file)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition ${
                    selectedSwingFile.name === file.name
                      ? 'bg-blue-600/30 text-blue-200 border border-blue-500/40 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  {getFileIcon(file.category)}
                  <span className="truncate">{file.name}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Code & Explanation Panel */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
          <div className="p-4 bg-slate-950/70 border-b border-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-blue-900/40 text-blue-400 shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">{activeFileName}</h4>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {activePath}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {activeDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed">
            <pre className="select-text whitespace-pre tab-size-4">
              <code>{activeContent}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
