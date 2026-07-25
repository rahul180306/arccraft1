'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Plus, 
  RefreshCw, 
  ExternalLink, 
  Trash2, 
  AlertCircle,
  Loader2,
  Briefcase,
  Gavel,
  ShieldAlert
} from 'lucide-react';
import { 
  fetchGoogleCalendarEvents, 
  createGoogleCalendarEvent, 
  deleteGoogleCalendarEvent, 
  CalendarEvent 
} from '@/lib/googleCalendar';
import { getTasksAccessToken, signInWithGoogleTasks } from '@/lib/googleTasks';

interface GoogleCalendarWidgetProps {
  isDarkMode: boolean;
  subCardBg: string;
  showToast: (msg: string) => void;
}

export default function GoogleCalendarWidget({
  isDarkMode,
  subCardBg,
  showToast
}: GoogleCalendarWidgetProps) {
  const [token, setToken] = useState<string | null>(() => getTasksAccessToken());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New event modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Bangalore City Sessions Court');
  const [startDate, setStartDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deletion modal
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);

  // Offline fallback court & shift schedule
  const [localEvents, setLocalEvents] = useState<CalendarEvent[]>(() => {
    const now = Date.now();
    return [
      {
        id: 'cal-1',
        summary: 'High Court Bail Hearing - FIR KRP/2026/0456',
        description: 'Present CCTV video timeline analysis to Bench 3',
        location: 'Karnataka High Court, Courtroom 4',
        start: { dateTime: new Date(now + 86400000).toISOString() },
        end: { dateTime: new Date(now + 90000000).toISOString() },
        eventType: 'Court',
        htmlLink: 'https://calendar.google.com'
      },
      {
        id: 'cal-2',
        summary: 'FSL Report Submission Deadline',
        description: 'Submit ballistics report for Case #456 to ACP Office',
        location: 'KR Puram Sub-Division HQ',
        start: { dateTime: new Date(now + 172800000).toISOString() },
        end: { dateTime: new Date(now + 176400000).toISOString() },
        eventType: 'Deadline',
        htmlLink: 'https://calendar.google.com'
      },
      {
        id: 'cal-3',
        summary: 'Night Patrol & ANPR Checking Shift',
        description: 'Inspect CCTV feed uptime at Outer Ring Road Checkpost',
        location: 'Checkpost 7 - Tin Factory',
        start: { dateTime: new Date(now + 259200000).toISOString() },
        end: { dateTime: new Date(now + 288000000).toISOString() },
        eventType: 'Shift',
        htmlLink: 'https://calendar.google.com'
      },
      {
        id: 'cal-4',
        summary: 'Magistrate Witness Recording (Sec 164 CrPC)',
        description: 'Escort witness Ramesh to 4th ACMM Court',
        location: 'Mayo Hall Court Complex',
        start: { dateTime: new Date(now + 345600000).toISOString() },
        end: { dateTime: new Date(now + 352800000).toISOString() },
        eventType: 'Hearing',
        htmlLink: 'https://calendar.google.com'
      }
    ];
  });

  const loadCalendarEvents = async (accessToken?: string) => {
    setIsLoading(true);
    try {
      const calendarItems = await fetchGoogleCalendarEvents(accessToken || token || undefined);
      if (calendarItems && calendarItems.length > 0) {
        setEvents(calendarItems);
      }
    } catch (err: any) {
      console.warn('Calendar fetch fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cached = getTasksAccessToken();
    if (cached) {
      Promise.resolve().then(() => loadCalendarEvents(cached));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnectCalendar = async () => {
    try {
      const res = await signInWithGoogleTasks();
      if (res?.accessToken) {
        setToken(res.accessToken);
        showToast('Google Calendar synced');
        await loadCalendarEvents(res.accessToken);
      }
    } catch (e: any) {
      showToast(`Calendar auth error: ${e.message}`);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim() || !startDate) return;

    setIsSubmitting(true);
    const startIso = new Date(startDate).toISOString();
    const endIso = new Date(new Date(startDate).getTime() + 3600000).toISOString();

    try {
      if (token) {
        const created = await createGoogleCalendarEvent(summary, description, startIso, endIso, location, token);
        setEvents((prev) => [created, ...prev]);
        showToast(`Created event in Google Calendar: "${created.summary}"`);
      } else {
        const localEv: CalendarEvent = {
          id: `loc-cal-${Date.now()}`,
          summary,
          description,
          location,
          start: { dateTime: startIso },
          end: { dateTime: endIso },
          eventType: 'Court',
          htmlLink: 'https://calendar.google.com'
        };
        setLocalEvents((prev) => [localEv, ...prev]);
        showToast(`Saved schedule event: "${localEv.summary}"`);
      }

      setSummary('');
      setDescription('');
      setStartDate('');
      setShowAddModal(false);
    } catch (err: any) {
      showToast(`Calendar creation error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;

    if (token && !eventToDelete.id.startsWith('cal-')) {
      try {
        await deleteGoogleCalendarEvent(eventToDelete.id, token);
        setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
        showToast(`Deleted from Google Calendar: "${eventToDelete.summary}"`);
      } catch (err: any) {
        showToast(`Error deleting event: ${err.message}`);
      }
    } else {
      setLocalEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
      showToast(`Deleted event: "${eventToDelete.summary}"`);
    }

    setEventToDelete(null);
  };

  const activeEvents = token && events.length > 0 ? events : localEvents;

  const getTypeBadge = (type: CalendarEvent['eventType']) => {
    switch (type) {
      case 'Court':
      case 'Hearing':
        return (
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
            <Gavel size={10} /> COURT
          </span>
        );
      case 'Deadline':
        return (
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1">
            <ShieldAlert size={10} /> DEADLINE
          </span>
        );
      default:
        return (
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center gap-1">
            <Briefcase size={10} /> SHIFT
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-amber-500/10 text-amber-500">
            <CalendarIcon size={14} />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            COURT & FIELD SCHEDULE (CALENDAR)
          </span>
          {token && (
            <span className="text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Calendar Synced
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!token ? (
            <button
              onClick={handleConnectCalendar}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-700 hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-all cursor-pointer"
            >
              <CalendarIcon size={13} className="text-amber-500" />
              <span>Connect Calendar</span>
            </button>
          ) : (
            <button
              onClick={() => loadCalendarEvents()}
              disabled={isLoading}
              className="p-1 rounded-md text-gray-400 hover:text-[#FF5A1F] transition-colors cursor-pointer"
              title="Refresh Calendar"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E04D18] transition-colors cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* EVENT LIST */}
      {isLoading ? (
        <div className="p-8 flex flex-col items-center justify-center gap-2 text-gray-400 text-xs">
          <Loader2 size={20} className="animate-spin text-[#FF5A1F]" />
          <span>Fetching schedule from Google Calendar...</span>
        </div>
      ) : activeEvents.length === 0 ? (
        <div className="p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-800 text-center text-gray-400 text-xs">
          No upcoming court dates or shifts scheduled.
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
          {activeEvents.map((ev) => {
            const dateStr = ev.start.dateTime
              ? new Date(ev.start.dateTime).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  weekday: 'short',
                })
              : 'Upcoming';

            const timeStr = ev.start.dateTime
              ? new Date(ev.start.dateTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'All Day';

            return (
              <div
                key={ev.id}
                className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${subCardBg}`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 flex flex-col items-center justify-center text-center shrink-0 min-w-[55px]">
                    <span className="text-[10px] font-bold font-mono uppercase">{dateStr.split(',')[0]}</span>
                    <span className="text-xs font-black">{timeStr}</span>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold truncate">{ev.summary}</span>
                      {getTypeBadge(ev.eventType)}
                    </div>

                    {ev.description && (
                      <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{ev.description}</p>
                    )}

                    {ev.location && (
                      <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono mt-1">
                        <MapPin size={10} className="text-[#FF5A1F]" />
                        <span className="truncate">{ev.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                  {ev.htmlLink && (
                    <a
                      href={ev.htmlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded text-gray-400 hover:text-[#FF5A1F] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="View in Google Calendar"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}

                  <button
                    onClick={() => setEventToDelete(ev)}
                    className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete Event"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className={`p-5 rounded-2xl border max-w-md w-full flex flex-col gap-4 shadow-2xl ${
            isDarkMode ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-gray-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-black flex items-center gap-2">
                <CalendarIcon size={16} className="text-[#FF5A1F]" />
                {token ? 'Add to Google Calendar' : 'Add Field Event'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white cursor-pointer text-xs font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Session Court Hearing - Witness Statement"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
                    isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
                    isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Karnataka High Court / KR Puram PS"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
                    isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Description / Case Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="Details for bench presentation, case files required..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  disabled={isSubmitting || !summary.trim() || !startDate}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E04D18] disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 size={13} className="animate-spin" />}
                  <span>{token ? 'Sync to Google Calendar' : 'Save Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETION MODAL */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className={`p-5 rounded-2xl border max-w-sm w-full flex flex-col gap-4 shadow-2xl ${
            isDarkMode ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-gray-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
              <AlertCircle size={18} />
              <span>Confirm Event Deletion</span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-white">&quot;{eventToDelete.summary}&quot;</span>?
              {token ? ' This will remove the event from your Google Calendar.' : ' This action cannot be undone.'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setEventToDelete(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteEvent}
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
