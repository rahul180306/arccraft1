'use client';

import React, { useState } from 'react';
import { HardDrive, FileText, FileSpreadsheet, Check, Search, X, Folder, Image as ImageIcon, Film } from 'lucide-react';

interface GooglePickerModalProps {
  isOpen: boolean;
  isDarkMode: boolean;
  onClose: () => void;
  onSelectFile: (file: { id: string; name: string; mimeType: string; url: string }) => void;
  showToast: (msg: string) => void;
}

export default function GooglePickerModal({
  isOpen,
  isDarkMode,
  onClose,
  onSelectFile,
  showToast,
}: GooglePickerModalProps) {
  const [activeTab, setActiveTab] = useState<'Recent' | 'Docs' | 'Sheets' | 'Media'>('Recent');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const mockPickerFiles = [
    { id: 'picker-1', name: 'FIR_KRP_2026_0456_PrimaryCaseBrief.pdf', mimeType: 'application/pdf', category: 'Recent', url: 'https://drive.google.com' },
    { id: 'picker-2', name: 'CCTV_ExitGate_Forensic_Report.docx', mimeType: 'application/vnd.google-apps.document', category: 'Docs', url: 'https://docs.google.com' },
    { id: 'picker-3', name: 'ANPR_KA03MN4481_Registration_Matrix.xlsx', mimeType: 'application/vnd.google-apps.spreadsheet', category: 'Sheets', url: 'https://docs.google.com' },
    { id: 'picker-4', name: 'HighCourt_Hearing_Evidence_Slides.pptx', mimeType: 'application/vnd.google-apps.presentation', category: 'Recent', url: 'https://docs.google.com' },
    { id: 'picker-5', name: 'FrontGate_SuspectVehicle_Keyframe.jpg', mimeType: 'image/jpeg', category: 'Media', url: 'https://drive.google.com' },
    { id: 'picker-6', name: 'CCTV_FrontGate_15Jul_Enhancements.mp4', mimeType: 'video/mp4', category: 'Media', url: 'https://drive.google.com' },
  ];

  const filtered = mockPickerFiles.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === 'Recent' || (activeTab === 'Docs' && f.mimeType.includes('document')) || (activeTab === 'Sheets' && f.mimeType.includes('spreadsheet')) || (activeTab === 'Media' && (f.mimeType.startsWith('image') || f.mimeType.startsWith('video')));
    return matchSearch && matchTab;
  });

  return (
    <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className={`w-full max-w-2xl p-6 rounded-2xl border shadow-2xl flex flex-col gap-4 ${
          isDarkMode ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-gray-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
              <HardDrive size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">GOOGLE PICKER - WORKSPACE EVIDENCE SELECTOR</h3>
              <p className="text-[10px] text-gray-400">Select Google Drive files, Docs, or Sheets to attach to case FIR</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* SEARCH & FILTER TABS */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Google Drive / Docs / Sheets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
                isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
              }`}
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full sm:w-auto">
            {(['Recent', 'Docs', 'Sheets', 'Media'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* FILES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
          {filtered.map((file) => (
            <div
              key={file.id}
              onClick={() => {
                onSelectFile({ id: file.id, name: file.name, mimeType: file.mimeType, url: file.url });
                showToast(`Attached "${file.name}" via Google Picker`);
                onClose();
              }}
              className={`p-3 rounded-xl border flex items-center justify-between gap-2 hover:border-[#FF5A1F] transition-all cursor-pointer group ${
                isDarkMode ? 'bg-[#1F2937]/50 border-gray-800 hover:bg-[#1F2937]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                  {file.mimeType.includes('document') ? (
                    <FileText size={16} className="text-blue-500" />
                  ) : file.mimeType.includes('spreadsheet') ? (
                    <FileSpreadsheet size={16} className="text-emerald-500" />
                  ) : file.mimeType.startsWith('image') ? (
                    <ImageIcon size={16} className="text-purple-400" />
                  ) : file.mimeType.startsWith('video') ? (
                    <Film size={16} className="text-[#FF5A1F]" />
                  ) : (
                    <Folder size={16} className="text-teal-400" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold truncate group-hover:text-[#FF5A1F] transition-colors">{file.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{file.category}</span>
                </div>
              </div>

              <div className="p-1 rounded bg-[#FF5A1F]/10 text-[#FF5A1F] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Check size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
