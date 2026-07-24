'use client';

import React, { useState, useEffect } from 'react';
import { 
  HardDrive, 
  FileText, 
  FileSpreadsheet, 
  FileCheck, 
  Image as ImageIcon, 
  Film, 
  FileCode, 
  Folder, 
  Download, 
  Trash2, 
  ExternalLink, 
  Upload, 
  RefreshCw, 
  Search, 
  Plus, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  fetchDriveEvidenceFiles, 
  uploadDriveEvidenceFile, 
  deleteDriveEvidenceFile, 
  DriveEvidenceFile 
} from '@/lib/googleDrive';
import { getTasksAccessToken, signInWithGoogleTasks } from '@/lib/googleTasks';

interface GoogleDriveEvidencePanelProps {
  isDarkMode: boolean;
  subCardBg: string;
  showToast: (msg: string) => void;
}

export default function GoogleDriveEvidencePanel({
  isDarkMode,
  subCardBg,
  showToast
}: GoogleDriveEvidencePanelProps) {
  const [token, setToken] = useState<string | null>(() => getTasksAccessToken());
  const [files, setFiles] = useState<DriveEvidenceFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modals & confirmation
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [newFileType, setNewFileType] = useState('text/plain');
  const [isUploading, setIsUploading] = useState(false);

  const [fileToDelete, setFileToDelete] = useState<DriveEvidenceFile | null>(null);

  // Fallback offline drive files
  const [localFiles, setLocalFiles] = useState<DriveEvidenceFile[]>([
    {
      id: 'dr-1',
      name: 'CCTV_ExitGate_15Jul_Forensic_Report.pdf',
      mimeType: 'application/pdf',
      size: '14.2 MB',
      webViewLink: 'https://drive.google.com',
      category: 'PDF',
      caseId: 'FIR KRP/2026/0456',
      createdTime: '2025-07-16T10:24:00Z'
    },
    {
      id: 'dr-2',
      name: 'CDR_Airtel_Call_Logs_Matrix.xlsx',
      mimeType: 'application/vnd.google-apps.spreadsheet',
      size: '2.8 MB',
      webViewLink: 'https://drive.google.com',
      category: 'Spreadsheet',
      caseId: 'FIR KRP/2026/0456',
      createdTime: '2025-07-17T08:12:00Z'
    },
    {
      id: 'dr-3',
      name: 'ANPR_Vehicle_KA03MN4481_Track.docx',
      mimeType: 'application/vnd.google-apps.document',
      size: '1.1 MB',
      webViewLink: 'https://drive.google.com',
      category: 'Document',
      caseId: 'FIR KRP/2026/0456',
      createdTime: '2025-07-17T11:45:00Z'
    },
    {
      id: 'dr-4',
      name: 'FSL_Latent_Fingerprint_Sample01.jpg',
      mimeType: 'image/jpeg',
      size: '3.4 MB',
      webViewLink: 'https://drive.google.com',
      category: 'Image',
      caseId: 'FIR KRP/2026/0456',
      createdTime: '2025-07-18T09:30:00Z'
    },
    {
      id: 'dr-5',
      name: 'Case_Briefing_HighCourt_Pres.pptx',
      mimeType: 'application/vnd.google-apps.presentation',
      size: '8.5 MB',
      webViewLink: 'https://drive.google.com',
      category: 'Presentation',
      caseId: 'FIR KRP/2026/0456',
      createdTime: '2025-07-19T14:15:00Z'
    }
  ]);

  const loadDriveFiles = async (accessToken?: string) => {
    setIsLoading(true);
    try {
      const driveItems = await fetchDriveEvidenceFiles(accessToken || token || undefined);
      if (driveItems && driveItems.length > 0) {
        setFiles(driveItems);
      }
    } catch (e: any) {
      console.warn('Drive sync fallback:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cached = getTasksAccessToken();
    if (cached) {
      Promise.resolve().then(() => loadDriveFiles(cached));
    }
  }, []);

  const handleConnectDrive = async () => {
    try {
      const res = await signInWithGoogleTasks();
      if (res?.accessToken) {
        setToken(res.accessToken);
        showToast('Connected to Google Drive API');
        await loadDriveFiles(res.accessToken);
      }
    } catch (e: any) {
      showToast(`Drive authentication error: ${e.message}`);
    }
  };

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    setIsUploading(true);
    try {
      if (token) {
        const uploaded = await uploadDriveEvidenceFile(newFileName, newFileContent, newFileType, token);
        setFiles((prev) => [uploaded, ...prev]);
        showToast(`Uploaded file to Google Drive: "${uploaded.name}"`);
      } else {
        const localDoc: DriveEvidenceFile = {
          id: `loc-dr-${Date.now()}`,
          name: newFileName,
          mimeType: newFileType,
          size: '0.8 MB',
          webViewLink: 'https://drive.google.com',
          category: newFileType.includes('pdf') ? 'PDF' : newFileType.includes('sheet') ? 'Spreadsheet' : 'Document',
          caseId: 'FIR KRP/2026/0456',
          createdTime: new Date().toISOString()
        };
        setLocalFiles((prev) => [localDoc, ...prev]);
        showToast(`Saved evidence file locally: "${localDoc.name}"`);
      }

      setNewFileName('');
      setNewFileContent('');
      setShowUploadModal(false);
    } catch (err: any) {
      showToast(`Upload error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;

    if (token && !fileToDelete.id.startsWith('dr-')) {
      try {
        await deleteDriveEvidenceFile(fileToDelete.id, token);
        setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
        showToast(`Deleted from Google Drive: "${fileToDelete.name}"`);
      } catch (err: any) {
        showToast(`Error deleting file from Drive: ${err.message}`);
      }
    } else {
      setLocalFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      showToast(`Deleted evidence file: "${fileToDelete.name}"`);
    }

    setFileToDelete(null);
  };

  const activeFiles = token && files.length > 0 ? files : localFiles;

  const filteredFiles = activeFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || file.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const getCategoryIcon = (category: DriveEvidenceFile['category']) => {
    switch (category) {
      case 'Document': return <FileText size={16} className="text-blue-500" />;
      case 'Spreadsheet': return <FileSpreadsheet size={16} className="text-emerald-500" />;
      case 'Presentation': return <FileCheck size={16} className="text-amber-500" />;
      case 'Image': return <ImageIcon size={16} className="text-purple-400" />;
      case 'Video': return <Film size={16} className="text-[#FF5A1F]" />;
      case 'PDF': return <FileCode size={16} className="text-rose-500" />;
      default: return <Folder size={16} className="text-teal-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-indigo-500/10 text-indigo-500">
            <HardDrive size={14} />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            EVIDENCE REPOSITORY (GOOGLE DRIVE)
          </span>
          {token && (
            <span className="text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Drive Connected
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!token ? (
            <button
              onClick={handleConnectDrive}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-700 hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-all cursor-pointer"
            >
              <HardDrive size={13} className="text-indigo-500" />
              <span>Connect Drive</span>
            </button>
          ) : (
            <button
              onClick={() => loadDriveFiles()}
              disabled={isLoading}
              className="p-1 rounded-md text-gray-400 hover:text-[#FF5A1F] transition-colors cursor-pointer"
              title="Refresh Drive Files"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            </button>
          )}

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E04D18] transition-colors cursor-pointer"
          >
            <Upload size={13} />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* SEARCH & CATEGORY FILTERS */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative w-full flex-1">
          <Search size={13} className="absolute left-2.5 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search evidence docs, sheets, PDFs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
              isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
            }`}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={`px-2.5 py-1.5 rounded-xl border text-xs outline-none cursor-pointer ${
            isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
          }`}
        >
          <option value="All">All Types</option>
          <option value="Document">Docs</option>
          <option value="Spreadsheet">Sheets</option>
          <option value="Presentation">Slides</option>
          <option value="PDF">PDF</option>
          <option value="Image">Image</option>
        </select>
      </div>

      {/* FILES LIST */}
      {isLoading ? (
        <div className="p-8 flex flex-col items-center justify-center gap-2 text-gray-400 text-xs">
          <Loader2 size={20} className="animate-spin text-[#FF5A1F]" />
          <span>Searching Google Drive files...</span>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-800 text-center text-gray-400 text-xs">
          No evidence files found in Drive repository matching query.
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition-all group ${subCardBg}`}
            >
              <div className="flex items-center gap-2.5 min-w-0 mr-2">
                <div className="p-2 rounded-lg bg-gray-500/10 shrink-0">
                  {getCategoryIcon(file.category)}
                </div>
                <div className="flex flex-col min-w-0">
                  <a
                    href={file.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold truncate hover:text-[#FF5A1F] transition-colors flex items-center gap-1"
                  >
                    <span className="truncate">{file.name}</span>
                    <ExternalLink size={10} className="shrink-0 text-gray-400" />
                  </a>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                    <span>{file.category}</span>
                    <span>•</span>
                    <span>{file.size}</span>
                    <span>•</span>
                    <span className="text-[#FF5A1F]">{file.caseId}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={file.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded text-gray-400 hover:text-[#FF5A1F] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Open in Google Drive"
                >
                  <Download size={13} />
                </a>

                <button
                  onClick={() => setFileToDelete(file)}
                  className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Delete from Repository"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className={`p-5 rounded-2xl border max-w-md w-full flex flex-col gap-4 shadow-2xl ${
            isDarkMode ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-gray-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Upload size={16} className="text-[#FF5A1F]" />
                {token ? 'Upload to Google Drive' : 'Store Local Evidence File'}
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-white cursor-pointer text-xs font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadFile} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  File Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Witness_Statement_Ramesh.pdf"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
                    isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  File Type
                </label>
                <select
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
                    isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
                  }`}
                >
                  <option value="text/plain">Text Document (.txt)</option>
                  <option value="application/pdf">Forensic PDF (.pdf)</option>
                  <option value="text/csv">CDR Call Data (.csv / .xlsx)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Document Notes / Content
                </label>
                <textarea
                  rows={3}
                  placeholder="Insert forensic summaries or evidence text..."
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
                    isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !newFileName.trim()}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E04D18] disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {isUploading && <Loader2 size={13} className="animate-spin" />}
                  <span>{token ? 'Upload to Google Drive' : 'Save File'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG FOR FILE DELETION (MANDATORY DESTRUCTIVE GUARD) */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className={`p-5 rounded-2xl border max-w-sm w-full flex flex-col gap-4 shadow-2xl ${
            isDarkMode ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-gray-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
              <AlertCircle size={18} />
              <span>Confirm File Deletion</span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-white">&quot;{fileToDelete.name}&quot;</span>?
              {token ? ' This will permanently remove the file from your Google Drive.' : ' This action cannot be undone.'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setFileToDelete(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteFile}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
