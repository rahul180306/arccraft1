'use client';

import React, { useState, useEffect } from 'react';
import { 
  StickyNote, 
  Plus, 
  Trash2, 
  Tag, 
  Clock, 
  User, 
  RefreshCw, 
  Search, 
  AlertCircle,
  Loader2,
  Bookmark
} from 'lucide-react';
import { 
  fetchKeepNotes, 
  createKeepNote, 
  deleteKeepNote, 
  KeepNote 
} from '@/lib/googleKeep';
import { getTasksAccessToken, signInWithGoogleTasks } from '@/lib/googleTasks';

interface GoogleKeepNotesPanelProps {
  isDarkMode: boolean;
  subCardBg: string;
  showToast: (msg: string) => void;
}

export default function GoogleKeepNotesPanel({
  isDarkMode,
  subCardBg,
  showToast
}: GoogleKeepNotesPanelProps) {
  const [token, setToken] = useState<string | null>(() => getTasksAccessToken());
  const [notes, setNotes] = useState<KeepNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New Note Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [caseId, setCaseId] = useState('FIR KRP/2026/0456');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deletion Modal
  const [noteToDelete, setNoteToDelete] = useState<KeepNote | null>(null);

  const loadNotes = async (accessToken?: string) => {
    setIsLoading(true);
    try {
      const items = await fetchKeepNotes(accessToken || token || undefined);
      setNotes(items);
    } catch (err: any) {
      console.warn('Keep notes load fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        loadNotes();
      }, 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleConnectKeep = async () => {
    try {
      const res = await signInWithGoogleTasks();
      if (res?.accessToken) {
        setToken(res.accessToken);
        showToast('Google Keep / Field Notes synced');
        await loadNotes(res.accessToken);
      }
    } catch (e: any) {
      showToast(`Keep connection error: ${e.message}`);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await createKeepNote(title.trim(), body.trim(), caseId, token || undefined);
      setNotes((prev) => [created, ...prev]);
      showToast(`Field observation saved: "${created.title}"`);

      setTitle('');
      setBody('');
      setShowAddModal(false);
    } catch (err: any) {
      showToast(`Note creation error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      await deleteKeepNote(noteToDelete.id, token || undefined);
      setNotes((prev) => prev.filter((n) => n.id !== noteToDelete.id));
      showToast(`Deleted field observation: "${noteToDelete.title}"`);
    } catch (err: any) {
      showToast(`Error deleting note: ${err.message}`);
    }

    setNoteToDelete(null);
  };

  const filteredNotes = notes.filter((n) => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.caseId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-yellow-500/10 text-yellow-500">
            <StickyNote size={14} />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            QUICK FIELD OBSERVATIONS (GOOGLE KEEP)
          </span>
          {token && (
            <span className="text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Keep Linked
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!token ? (
            <button
              onClick={handleConnectKeep}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-700 hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-all cursor-pointer"
            >
              <StickyNote size={13} className="text-yellow-500" />
              <span>Connect Keep</span>
            </button>
          ) : (
            <button
              onClick={() => loadNotes()}
              disabled={isLoading}
              className="p-1 rounded-md text-gray-400 hover:text-[#FF5A1F] transition-colors cursor-pointer"
              title="Refresh Keep Notes"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E04D18] transition-colors cursor-pointer"
          >
            <Plus size={13} />
            <span>New Observation</span>
          </button>
        </div>
      </div>

      {/* SEARCH FIELD */}
      <div className="relative w-full">
        <Search size={13} className="absolute left-2.5 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Filter field notes by keyword or Case FIR ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
            isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
          }`}
        />
      </div>

      {/* NOTES GRID */}
      {isLoading ? (
        <div className="p-8 flex flex-col items-center justify-center gap-2 text-gray-400 text-xs">
          <Loader2 size={20} className="animate-spin text-[#FF5A1F]" />
          <span>Syncing quick notes with Google Keep...</span>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-800 text-center text-gray-400 text-xs">
          No quick notes captured yet. Click &quot;New Observation&quot; to log ephemeral observations.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded-xl border flex flex-col justify-between gap-2 transition-all relative group ${subCardBg}`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold truncate text-[#FF5A1F] flex items-center gap-1">
                    <Bookmark size={11} /> {note.title}
                  </span>
                  <button
                    onClick={() => setNoteToDelete(note)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-500/10 transition-all cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <p className="text-[11px] text-gray-300 leading-relaxed line-clamp-3">
                  {note.body}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-gray-800/50 text-[10px] text-gray-400 font-mono">
                <span className="bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded font-semibold border border-yellow-500/20">
                  {note.caseId}
                </span>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5">
                    <Clock size={9} /> {note.timestamp}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <User size={9} /> {note.officerName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE NOTE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className={`p-5 rounded-2xl border max-w-md w-full flex flex-col gap-4 shadow-2xl ${
            isDarkMode ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-gray-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-black flex items-center gap-2">
                <StickyNote size={16} className="text-[#FF5A1F]" />
                {token ? 'Log Observation to Google Keep' : 'Log Quick Field Note'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white cursor-pointer text-xs font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Active Case FIR ID
                </label>
                <input
                  type="text"
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
                    isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Observation Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unattended metallic briefcase near platform 2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
                    isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Field Details / Observations *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record timestamped notes, physical descriptors, vehicle numbers..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
                    isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !body.trim()}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E04D18] disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 size={13} className="animate-spin" />}
                  <span>{token ? 'Sync to Keep' : 'Save Field Note'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {noteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className={`p-5 rounded-2xl border max-w-sm w-full flex flex-col gap-4 shadow-2xl ${
            isDarkMode ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-gray-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
              <AlertCircle size={18} />
              <span>Confirm Observation Deletion</span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to delete observation <span className="font-bold text-white">&quot;{noteToDelete.title}&quot;</span>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setNoteToDelete(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteNote}
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
