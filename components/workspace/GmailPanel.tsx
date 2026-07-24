'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Send, RefreshCw, Loader2, Inbox, ExternalLink } from 'lucide-react';
import { sendGmailMessage, fetchGmailMessages, GmailMessageItem } from '@/lib/googleWorkspaceExtra';
import { getTasksAccessToken } from '@/lib/googleTasks';

interface GmailPanelProps {
  isDarkMode: boolean;
  subCardBg: string;
  showToast: (msg: string) => void;
}

export default function GmailPanel({
  isDarkMode,
  subCardBg,
  showToast,
}: GmailPanelProps) {
  const [messages, setMessages] = useState<GmailMessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [toEmail, setToEmail] = useState('prosecutor.office@ksp.gov.in');
  const [subject, setSubject] = useState('URGENT: Forensic Video Timeline FIR KRP/2026/0456');
  const [bodyText, setBodyText] = useState(
    'Respected Prosecutor,\n\n' +
    'Attached is the verified digital video evidence log for CCTV Front Gate (Case FIR KRP/2026/0456).\n' +
    'SHA-256 Hash verification matched: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.\n\n' +
    'Regards,\nInvestigating Officer'
  );
  const [isSending, setIsSending] = useState(false);

  const loadGmail = async () => {
    setIsLoading(true);
    try {
      const token = getTasksAccessToken();
      const list = await fetchGmailMessages(token || undefined);
      setMessages(list);
    } catch (e: any) {
      console.warn('Gmail list fallback:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => loadGmail());
  }, []);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail.trim() || !subject.trim()) return;

    setIsSending(true);
    try {
      const token = getTasksAccessToken();
      await sendGmailMessage(toEmail, subject, bodyText, token || undefined);
      showToast(`Email dispatched via Gmail to ${toEmail}`);
      setShowCompose(false);
      await loadGmail();
    } catch (err: any) {
      showToast(`Gmail dispatch error: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between pb-1 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-red-500/10 text-red-500">
            <Mail size={14} />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            GMAIL DISPATCH & DISPATCH NOTIFICATIONS
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => loadGmail()}
            disabled={isLoading}
            className="p-1 rounded text-gray-400 hover:text-red-500 cursor-pointer"
            title="Refresh Gmail Inbox"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setShowCompose(!showCompose)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
          >
            <Send size={12} />
            <span>Compose</span>
          </button>
        </div>
      </div>

      {showCompose && (
        <form onSubmit={handleSendEmail} className="p-3 rounded-xl border border-red-500/30 bg-red-500/5 flex flex-col gap-2">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
              To Recipient Email *
            </label>
            <input
              type="email"
              required
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              className={`w-full px-2.5 py-1 rounded-lg border text-xs outline-none ${
                isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
              Subject *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`w-full px-2.5 py-1 rounded-lg border text-xs outline-none ${
                isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
              Message
            </label>
            <textarea
              rows={3}
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className={`w-full px-2.5 py-1 rounded-lg border text-xs outline-none ${
                isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-slate-900'
              }`}
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowCompose(false)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 cursor-pointer"
            >
              {isSending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              <span>Send Email</span>
            </button>
          </div>
        </form>
      )}

      {/* DISPATCH MESSAGES LIST */}
      <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto pr-1">
        {messages.map((m) => (
          <div key={m.id} className={`p-2.5 rounded-xl border flex flex-col gap-1 ${subCardBg}`}>
            <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
              <span className="font-bold text-red-400 truncate max-w-[200px]">{m.from}</span>
              <span>{m.date}</span>
            </div>
            <div className="text-xs font-bold truncate text-white">{m.subject}</div>
            {m.snippet && <div className="text-[11px] text-gray-300 line-clamp-1">{m.snippet}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
