'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  RefreshCw, 
  Trash2, 
  Calendar, 
  AlertCircle, 
  LogOut, 
  CheckCircle2, 
  Loader2,
  ListTodo,
  ExternalLink
} from 'lucide-react';
import { 
  initGoogleAuth, 
  signInWithGoogleTasks, 
  logoutGoogleTasks, 
  fetchGoogleTasks, 
  createGoogleTask, 
  updateGoogleTaskStatus, 
  deleteGoogleTask, 
  GoogleTaskItem 
} from '@/lib/googleTasks';
import { User } from 'firebase/auth';
import { useInvestigationStore } from '@/lib/stores/investigationStore';

interface GoogleTasksPanelProps {
  isDarkMode: boolean;
  subCardBg: string;
  showToast: (msg: string) => void;
  isCompact?: boolean; // Compact mode for Overview card
}

export default function GoogleTasksPanel({
  isDarkMode,
  subCardBg,
  showToast,
  isCompact = false
}: GoogleTasksPanelProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [googleTasks, setGoogleTasks] = useState<GoogleTaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New task form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation state
  const [taskToDelete, setTaskToDelete] = useState<GoogleTaskItem | null>(null);

  const activeCase = useInvestigationStore((s) => s.activeCase);

  // Default initial offline tasks as fallback if not signed in
  const [localTasks, setLocalTasks] = useState<GoogleTaskItem[]>([]);

  useEffect(() => {
    if (activeCase) {
      const timer = setTimeout(() => {
        setLocalTasks([
          { id: 'loc-1', title: 'Collect FSL Blood Sample Report', notes: `FIR ${activeCase.crimeNo}`, status: 'needsAction', due: activeCase.registrationDate },
          { id: 'loc-2', title: `Record Statement of Witness (${activeCase.victims?.[0]?.name || 'Unknown'})`, notes: 'Witness pending statement', status: 'needsAction', due: activeCase.incidentDate },
          { id: 'loc-3', title: 'Obtain Call Detail Records', notes: 'Request sent to Nodal Officer', status: 'needsAction', due: activeCase.registrationDate },
          { id: 'loc-4', title: `Verify Alibi of Accused ${activeCase.accused?.[0]?.name || 'Unknown'}`, notes: 'Check CCTV around area', status: 'needsAction', due: activeCase.registrationDate },
          { id: 'loc-5', title: 'Seize Weapon for Ballistic Test', notes: 'Latent prints on handle', status: 'needsAction', due: activeCase.incidentDate }
        ]);
      }, 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCase]);

  const loadTasks = async (accessToken?: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const items = await fetchGoogleTasks(accessToken || token || undefined);
      setGoogleTasks(items);
    } catch (err: any) {
      console.error('Error fetching Google Tasks:', err);
      setErrorMsg(err.message || 'Failed to sync Google Tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = initGoogleAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        loadTasks(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsSyncing(true);
    setErrorMsg(null);
    try {
      const result = await signInWithGoogleTasks();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        showToast('Successfully connected Google Tasks!');
        await loadTasks(result.accessToken);
      }
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      setErrorMsg(err.message || 'Google Sign-in failed');
      showToast('Google Tasks connection failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogleTasks();
    setUser(null);
    setToken(null);
    setGoogleTasks([]);
    showToast('Disconnected Google Tasks');
  };

  const handleToggleTask = async (task: GoogleTaskItem) => {
    const isCompleted = task.status !== 'completed';
    const newStatus: 'completed' | 'needsAction' = isCompleted ? 'completed' : 'needsAction';

    if (token) {
      // Optimistic update
      setGoogleTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );

      try {
        await updateGoogleTaskStatus(task.id, isCompleted, token);
        showToast(isCompleted ? `Marked complete in Google Tasks: "${task.title}"` : `Reopened in Google Tasks: "${task.title}"`);
      } catch (err: any) {
        // Rollback
        setGoogleTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t))
        );
        showToast(`Failed to update Google Task: ${err.message}`);
      }
    } else {
      // Local tasks toggle
      setLocalTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );
      showToast(isCompleted ? `Marked completed: "${task.title}"` : `Reopened: "${task.title}"`);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      if (token) {
        const newTask = await createGoogleTask(newTitle.trim(), newNotes, newDueDate, token);
        setGoogleTasks((prev) => [newTask, ...prev]);
        showToast(`Task created in Google Tasks: "${newTask.title}"`);
      } else {
        const localItem: GoogleTaskItem = {
          id: `loc-${Date.now()}`,
          title: newTitle.trim(),
          notes: newNotes,
          status: 'needsAction',
          due: newDueDate ? new Date(newDueDate).toISOString() : undefined
        };
        setLocalTasks((prev) => [localItem, ...prev]);
        showToast(`Task created locally: "${localItem.title}"`);
      }

      setNewTitle('');
      setNewNotes('');
      setNewDueDate('');
      setShowAddModal(false);
    } catch (err: any) {
      showToast(`Error creating task: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    if (token) {
      try {
        await deleteGoogleTask(taskToDelete.id, token);
        setGoogleTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
        showToast(`Deleted from Google Tasks: "${taskToDelete.title}"`);
      } catch (err: any) {
        showToast(`Error deleting Google Task: ${err.message}`);
      }
    } else {
      setLocalTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      showToast(`Deleted task: "${taskToDelete.title}"`);
    }

    setTaskToDelete(null);
  };

  const displayTasks = token ? googleTasks : localTasks;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* HEADER & GOOGLE SYNC STATUS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-blue-500/10 text-blue-500">
            <ListTodo size={14} />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            {token ? 'GOOGLE TASKS (LIVE SYNC)' : 'PENDING TASKS'}
          </span>
          {token && (
            <span className="text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Synced
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!token ? (
            <button
              onClick={handleGoogleSignIn}
              disabled={isSyncing}
              title="Sync with Google Tasks"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-700 hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-all cursor-pointer shadow-2xs"
            >
              {isSyncing ? (
                <Loader2 size={12} className="animate-spin text-[#FF5A1F]" />
              ) : (
                <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              )}
              <span className="text-[11px]">Sync Google Tasks</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => loadTasks()}
                disabled={isLoading}
                title="Refresh Google Tasks"
                className="p-1 rounded-md text-gray-400 hover:text-[#FF5A1F] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={handleLogout}
                title="Disconnect Google Account"
                className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut size={13} />
              </button>
            </div>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E04D18] transition-colors cursor-pointer"
          >
            <Plus size={13} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* ERROR BANNER */}
      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => handleGoogleSignIn()}
            className="text-[10px] font-bold underline hover:text-red-400 shrink-0"
          >
            Re-authenticate
          </button>
        </div>
      )}

      {/* USER ACCOUNT BANNER WHEN LOGGED IN */}
      {user && token && (
        <div className="flex items-center justify-between text-[11px] px-2 py-1 rounded-lg bg-blue-500/5 border border-blue-500/10 text-blue-600 dark:text-blue-400">
          <div className="flex items-center gap-1.5 truncate">
            {user.photoURL && (
              <img src={user.photoURL} alt="" className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
            )}
            <span className="font-semibold truncate">Connected: {user.email || user.displayName}</span>
          </div>
          <a
            href="https://tasks.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-bold hover:underline shrink-0 text-[#FF5A1F]"
          >
            Open Web <ExternalLink size={10} />
          </a>
        </div>
      )}

      {/* TASK LIST */}
      {isLoading ? (
        <div className="p-8 flex flex-col items-center justify-center gap-2 text-gray-400 text-xs">
          <Loader2 size={20} className="animate-spin text-[#FF5A1F]" />
          <span>Fetching tasks from Google...</span>
        </div>
      ) : displayTasks.length === 0 ? (
        <div className="p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-800 flex flex-col items-center justify-center gap-2 text-center text-gray-400 text-xs">
          <CheckCircle2 size={24} className="text-emerald-500/50" />
          <p>No pending tasks found.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-[#FF5A1F] font-bold hover:underline mt-1"
          >
            + Add a task
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {(isCompact ? displayTasks.slice(0, 5) : displayTasks).map((task) => {
            const isDone = task.status === 'completed';
            return (
              <div
                key={task.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all group ${
                  isDone
                    ? 'opacity-50 line-through bg-gray-100/50 dark:bg-gray-800/30 border-transparent'
                    : subCardBg
                }`}
              >
                <div
                  onClick={() => handleToggleTask(task)}
                  className="flex items-center gap-2.5 overflow-hidden cursor-pointer flex-1 mr-2"
                >
                  <button className="text-gray-400 hover:text-[#FF5A1F] shrink-0">
                    {isDone ? (
                      <CheckSquare size={16} className="text-emerald-500" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                  <div className="flex flex-col min-w-0">
                    <span className={`text-xs font-semibold truncate ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                      {task.title}
                    </span>
                    {task.notes && (
                      <span className="text-[10px] text-gray-400 truncate">
                        {task.notes}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {task.due && (
                    <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(task.due).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTaskToDelete(task);
                    }}
                    title="Delete task"
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-500/10 transition-all cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className={`p-5 rounded-2xl border max-w-md w-full flex flex-col gap-4 shadow-2xl ${
            isDarkMode ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-gray-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Plus size={16} className="text-[#FF5A1F]" />
                {token ? 'Create Google Task' : 'Add Local Task'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white cursor-pointer text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Verify CCTV footage at Gate 3"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
                    isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Notes / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Add details, case references, or instructions..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
                    isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
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
                  disabled={isSubmitting || !newTitle.trim()}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E04D18] disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 size={13} className="animate-spin" />}
                  <span>{token ? 'Add to Google Tasks' : 'Save Task'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG FOR TASK DELETION (MANDATORY FOR MUTATION/DELETION) */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className={`p-5 rounded-2xl border max-w-sm w-full flex flex-col gap-4 shadow-2xl ${
            isDarkMode ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-gray-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
              <AlertCircle size={18} />
              <span>Confirm Task Deletion</span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to delete the task <span className="font-bold text-white">&quot;{taskToDelete.title}&quot;</span>?
              {token ? ' This will remove it from your Google Tasks account.' : ' This action cannot be undone.'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTask}
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
