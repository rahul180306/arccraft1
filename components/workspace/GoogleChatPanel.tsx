'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, User, ShieldAlert, Loader2 } from 'lucide-react';
import { sendGoogleChatMessage } from '@/lib/googleWorkspaceExtra';
import { getTasksAccessToken } from '@/lib/googleTasks';

interface GoogleChatPanelProps {
  isDarkMode: boolean;
  subCardBg: string;
  showToast: (msg: string) => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  text: string;
  time: string;
}

export default function GoogleChatPanel({
  isDarkMode,
  subCardBg,
  showToast,
}: GoogleChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'c1',
      sender: 'ACP Cyber Crime',
      role: 'HQ Supervisor',
      text: 'ANPR alert flagged white sedan KA03MN4481 near KR Puram. Send video timestamp analysis to Chat.',
      time: '02:20 AM',
    },
    {
      id: 'c2',
      sender: 'ASI Ramesh',
      role: 'Field Lead',
      text: 'Keyframe snapshot uploaded to Drive at 02:15 AM timestamp. Vehicle hazard lights were active.',
      time: '02:22 AM',
    },
  ]);

  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsgText = chatInput.trim();
    setChatInput('');
    setIsSending(true);

    try {
      const token = getTasksAccessToken();
      await sendGoogleChatMessage('spaces/KSP_INCIDENT_ROOM', newMsgText, token || undefined);

      setMessages((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          sender: 'Investigating Officer',
          role: 'Active Duty',
          text: newMsgText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      showToast('Dispatched message to Google Chat incident space');
    } catch (e: any) {
      showToast(`Google Chat error: ${e.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between pb-1 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-teal-500/10 text-teal-500">
            <MessageSquare size={14} />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            GOOGLE CHAT - KSP INCIDENT ROOM
          </span>
        </div>
        <span className="text-[9px] font-mono font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-1.5 py-0.5 rounded-full">
          LIVE CHAT
        </span>
      </div>

      <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto p-1">
        {messages.map((m) => (
          <div key={m.id} className={`p-2.5 rounded-xl border flex flex-col gap-1 ${subCardBg}`}>
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-teal-400 flex items-center gap-1">
                <User size={10} /> {m.sender}
              </span>
              <span className="text-gray-400 font-mono">{m.time}</span>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed">{m.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Type incident update for Google Chat..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className={`flex-1 px-3 py-1.5 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
            isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
          }`}
        />
        <button
          type="submit"
          disabled={isSending || !chatInput.trim()}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white cursor-pointer flex items-center gap-1"
        >
          {isSending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
