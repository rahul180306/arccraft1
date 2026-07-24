'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Plus, ExternalLink, Loader2 } from 'lucide-react';
import { createGoogleSheet, GoogleSheetExportResult } from '@/lib/googleWorkspaceExtra';
import { getTasksAccessToken } from '@/lib/googleTasks';

interface GoogleSheetsPanelProps {
  isDarkMode: boolean;
  subCardBg: string;
  showToast: (msg: string) => void;
}

export default function GoogleSheetsPanel({
  isDarkMode,
  subCardBg,
  showToast,
}: GoogleSheetsPanelProps) {
  const [sheetTitle, setSheetTitle] = useState('ANPR_Vehicle_Log_Matrix_FIR_KRP_2026_0456');
  const [isExporting, setIsExporting] = useState(false);
  const [createdSheets, setCreatedSheets] = useState<GoogleSheetExportResult[]>([
    {
      spreadsheetId: 'sheet-anpr-01',
      title: 'ANPR_Vehicle_Detection_Grid_KA03.xlsx',
      spreadsheetUrl: 'https://docs.google.com/spreadsheets/u/0/',
    },
    {
      spreadsheetId: 'sheet-cdr-02',
      title: 'Tower_CDR_Call_Detail_Records.xlsx',
      spreadsheetUrl: 'https://docs.google.com/spreadsheets/u/0/',
    },
  ]);

  const handleCreateSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetTitle.trim()) return;

    setIsExporting(true);
    try {
      const headers = ['Timestamp', 'Vehicle Reg No', 'Vehicle Model', 'Camera ID', 'Match Confidence', 'Status'];
      const rows = [
        ['02:15:43 AM', 'KA03MN4481', 'White Sedan', 'Cam_FrontGate_01', '98.4%', 'SUSPECT_MATCH'],
        ['02:18:10 AM', 'KA04EP9921', 'Black SUV', 'Cam_FrontGate_01', '94.1%', 'VERIFIED_CLEAR'],
        ['02:22:05 AM', 'KA01MH1102', 'Red Hatchback', 'Cam_ExitGate_02', '99.0%', 'VERIFIED_CLEAR'],
      ];

      const token = getTasksAccessToken();
      const res = await createGoogleSheet(sheetTitle.trim(), headers, rows, token || undefined);
      setCreatedSheets((prev) => [res, ...prev]);
      showToast(`Exported ANPR matrix to Google Sheets: "${res.title}"`);
    } catch (err: any) {
      showToast(`Error creating Google Sheet: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between pb-1 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-emerald-500/10 text-emerald-500">
            <FileSpreadsheet size={14} />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            GOOGLE SHEETS ANPR & DATA MATRICES
          </span>
        </div>
      </div>

      <form onSubmit={handleCreateSheet} className="flex flex-col gap-2.5">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Spreadsheet Title
          </label>
          <input
            type="text"
            value={sheetTitle}
            onChange={(e) => setSheetTitle(e.target.value)}
            className={`w-full px-3 py-1.5 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
              isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
            }`}
          />
        </div>

        <div className="p-3 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/5 text-[11px] text-emerald-400 flex flex-col gap-1">
          <span className="font-bold">Matrix Export Package Includes:</span>
          <span className="font-mono text-[10px] text-gray-300">
            • 3 ANPR Vehicle Detection Entries (KA03MN4481)
          </span>
          <span className="font-mono text-[10px] text-gray-300">
            • Timestamped Camera Gate Coordinates & Confidence Matrix
          </span>
        </div>

        <button
          type="submit"
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-md"
        >
          {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          <span>Export Matrix to Google Sheets</span>
        </button>
      </form>

      <div className="flex flex-col gap-1.5 mt-2">
        <span className="text-[10px] font-mono font-bold uppercase text-gray-400">
          Synced Spreadsheets ({createdSheets.length})
        </span>
        <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto">
          {createdSheets.map((s) => (
            <div key={s.spreadsheetId} className={`p-2 rounded-xl border flex items-center justify-between ${subCardBg}`}>
              <div className="flex items-center gap-2 min-w-0">
                <FileSpreadsheet size={14} className="text-emerald-500 shrink-0" />
                <span className="text-xs font-bold truncate">{s.title}</span>
              </div>
              <a
                href={s.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded text-gray-400 hover:text-emerald-400 cursor-pointer"
                title="Open in Google Sheets"
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
