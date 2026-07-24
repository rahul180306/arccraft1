'use client';

import React, { useState } from 'react';
import { FileText, Plus, ExternalLink, Download, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { createGoogleDoc, GoogleDocExportResult } from '@/lib/googleWorkspaceExtra';
import { getTasksAccessToken } from '@/lib/googleTasks';

interface GoogleDocsPanelProps {
  isDarkMode: boolean;
  subCardBg: string;
  showToast: (msg: string) => void;
}

export default function GoogleDocsPanel({
  isDarkMode,
  subCardBg,
  showToast,
}: GoogleDocsPanelProps) {
  const [docTitle, setDocTitle] = useState('KSP_Forensic_CaseReport_FIR_KRP_2026_0456');
  const [docContent, setDocContent] = useState(
    `KARNATAKA STATE POLICE - DIGITAL EVIDENCE FORENSIC BRIEFING\n` +
    `FIR No: KRP/2026/0456\n` +
    `Investigating Officer: Inspector Arjun / ASI Ramesh\n` +
    `Date of Incident: 15 July 2026\n` +
    `Evidence Hash (SHA-256): e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n\n` +
    `EXECUTIVE SUMMARY:\n` +
    `CCTV footage from Front Gate Camera #1 captured suspect vehicle KA03MN4481 entering the restricted zone at 02:15 AM.\n` +
    `ANPR high-confidence match confirmed plate alignment with 98.4% certainty.`
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [createdDocs, setCreatedDocs] = useState<GoogleDocExportResult[]>([
    {
      documentId: 'doc-ksp-456',
      title: 'KSP_Official_Investigation_Report_FIR_456.docx',
      documentUrl: 'https://docs.google.com/document/u/0/',
    },
    {
      documentId: 'doc-ksp-457',
      title: 'Court_Briefing_Prosecution_BenchNotes.docx',
      documentUrl: 'https://docs.google.com/document/u/0/',
    },
  ]);

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    setIsGenerating(true);
    try {
      const token = getTasksAccessToken();
      const res = await createGoogleDoc(docTitle.trim(), docContent, token || undefined);
      setCreatedDocs((prev) => [res, ...prev]);
      showToast(`Created Google Doc: "${res.title}"`);
    } catch (err: any) {
      showToast(`Error creating Google Doc: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between pb-1 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-blue-500/10 text-blue-500">
            <FileText size={14} />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            GOOGLE DOCS CASE BRIEFINGS
          </span>
        </div>
      </div>

      <form onSubmit={handleCreateDoc} className="flex flex-col gap-2.5">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Google Doc Title
          </label>
          <input
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            className={`w-full px-3 py-1.5 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
              isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
            }`}
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Report Body Content
          </label>
          <textarea
            rows={4}
            value={docContent}
            onChange={(e) => setDocContent(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
              isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer shadow-md"
        >
          {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          <span>Generate Google Doc Report</span>
        </button>
      </form>

      {/* RECENTLY CREATED DOCS */}
      <div className="flex flex-col gap-1.5 mt-2">
        <span className="text-[10px] font-mono font-bold uppercase text-gray-400">
          Synced Documents ({createdDocs.length})
        </span>
        <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto">
          {createdDocs.map((doc) => (
            <div key={doc.documentId} className={`p-2 rounded-xl border flex items-center justify-between ${subCardBg}`}>
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={14} className="text-blue-500 shrink-0" />
                <span className="text-xs font-bold truncate">{doc.title}</span>
              </div>
              <a
                href={doc.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded text-gray-400 hover:text-blue-400 cursor-pointer"
                title="Open in Google Docs"
              >
                <ExternalLink size={13} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
