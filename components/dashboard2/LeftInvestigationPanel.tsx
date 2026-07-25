'use client';

import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Clock3,
  FileText,
  FlaskConical,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';

interface LeftInvestigationPanelProps {
  isDarkMode: boolean;
  onContinueInvestigation: () => void;
  onOpenCopilot: (prompt?: string) => void;
  onShowToast: (msg: string) => void;
}

export default function LeftInvestigationPanel({
  isDarkMode,
  onContinueInvestigation,
  onOpenCopilot,
  onShowToast,
}: LeftInvestigationPanelProps) {
  const cardBg = isDarkMode
    ? 'bg-[#111827] border-[#1F2937] text-white'
    : 'bg-white border-[#E2E8F0] text-slate-900 shadow-sm transition-shadow';

  const itemBg = isDarkMode
    ? 'bg-[#1F2937]/50 border-[#374151]/50 hover:bg-[#1F2937]'
    : 'bg-white border-[#E2E8F0] hover:shadow-md transition-shadow';

  const workflow: Array<{ label: string; status: 'done' | 'active' | 'blocked'; detail: string }> = [
    { label: 'FIR Intake', status: 'done', detail: 'Complaint registered and validated' },
    { label: 'Scene Seizure', status: 'active', detail: 'Pending FSL handoff by 5:00 PM' },
    { label: 'Witness Statement', status: 'blocked', detail: 'Ramesh Kumar unavailable until 7 PM' },
    { label: 'Chargesheet Draft', status: 'done', detail: 'Draft prepared with AI support' },
  ];

  const evidenceFilters = ['All', 'Video', 'Forensics', 'Telecom', 'Witness'];
  const evidenceItems = [
    { title: 'Exit Gate CCTV', meta: 'Missing • Needs procurement', tone: 'amber', icon: AlertTriangle },
    { title: 'Latent Print Card', meta: 'Uploader: FSL Lab • 07:45 AM', tone: 'emerald', icon: CheckCircle2 },
    { title: 'Airtel CDR Request', meta: 'Awaiting nodal officer acknowledgement', tone: 'blue', icon: Clock3 },
  ];

  const tasks = [
    { label: 'FSL request', priority: 'Urgent', due: '14m', officer: 'PSI Nikhil', state: 'urgent' },
    { label: 'Witness call-back', priority: 'Medium', due: '1h', officer: 'WPC Bhavya', state: 'info' },
    { label: 'Chargesheet review', priority: 'High', due: 'Overdue', officer: 'IO Arjun', state: 'blocked' },
  ];

  const persons = [
    { name: 'Suresh Kumar', role: 'Accused', badge: 'High Risk', tone: isDarkMode ? 'bg-rose-500/10 text-rose-600 border-rose-200' : 'bg-red-50 text-red-700 border-red-200', priors: '3 Priors' },
    { name: 'Ramesh Kumar', role: 'Witness', badge: 'Reliable', tone: isDarkMode ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200', priors: 'None' },
  ];

  const actionButtons: Array<{ label: string; subtitle: string; icon: LucideIcon; action: () => void; tone: string }> = [
    { label: 'Add Evidence', subtitle: 'Upload new exhibit', icon: FlaskConical, action: () => onShowToast('Opened evidence intake workflow'), tone: 'text-red-500' },
    { label: 'Request FSL', subtitle: 'Dispatch sample packet', icon: Briefcase, action: () => onShowToast('Queued FSL request'), tone: 'text-amber-500' },
    { label: 'Start AI Analysis', subtitle: 'Cross-check timelines', icon: Sparkles, action: () => onOpenCopilot('Analyse the current case timeline and evidence chain'), tone: 'text-purple-500' },
    { label: 'Draft Chargesheet', subtitle: 'Build legal summary', icon: FileText, action: onContinueInvestigation, tone: 'text-blue-500' },
  ];

  return (
    <div className="flex flex-col gap-3.5 w-full">
      <div className={`rounded-[24px] border p-4 flex flex-col gap-4 ${cardBg}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-gray-400">Case Command Center</div>
            <div className="mt-2 text-lg font-black">FIR KRP/2026/0456 • Burglary & Housebreaking</div>
          </div>
          <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-500">Updated 2m ago</div>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
          <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-red-600">Days since FIR: 4</span>
          <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-blue-600">Last updated: 14:12</span>
          <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-purple-600">Pending tasks: 3</span>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-2">
          {['Registered', 'Seizure', 'Review', 'Draft'].map((segment, index) => (
            <div key={segment} className="flex items-center gap-2 flex-1 min-w-0">
              <div className={`h-2.5 rounded-full ${index < 3 ? 'bg-emerald-500' : 'bg-slate-300'} flex-1`} />
              {index < 3 ? <div className="hidden sm:block h-2.5 w-2.5 rounded-full bg-emerald-500" /> : null}
            </div>
          ))}
        </div>
      </div>

      <div className={`rounded-[24px] border p-4 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search size={15} className="text-[#FF5A1F]" />
            <span className={`text-[10px] font-mono font-bold uppercase tracking-[0.24em] ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Search & Filters</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-500">Recent searches</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Blue SUV', 'exit gate', 'Ramesh statement', 'Airtel CDR'].map((term) => (
            <span key={term} className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${isDarkMode ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}`}>
              {term}
            </span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 border-b border-slate-200 pb-1">
          {evidenceFilters.map((filter) => (
            <button key={filter} className={`pb-1 text-sm ${filter === 'All' ? 'text-[#FF5A1F] border-b-2 border-[#FF5A1F] font-semibold' : 'text-slate-500 border-b-2 border-transparent hover:text-slate-700'}`}>
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className={`rounded-[24px] border p-4 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock3 size={15} className="text-[#FF5A1F]" />
            <span className={`text-[10px] font-mono font-bold uppercase tracking-[0.24em] ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Progress Workflow</span>
          </div>
          <span className="text-[10px] font-semibold text-amber-500">2 flagged</span>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {workflow.map((step) => {
            const statusClasses = 
              step.status === 'done' ? (isDarkMode ? 'border-emerald-900/50 bg-emerald-900/20' : 'bg-emerald-50 border-emerald-300') :
              step.status === 'active' ? (isDarkMode ? 'border-orange-900/50 bg-orange-900/20' : 'bg-orange-50 border-orange-400') :
              (isDarkMode ? 'border-slate-800 bg-slate-900/40' : 'bg-white border-slate-300 text-slate-500');

            const textTone = 
              step.status === 'done' ? 'text-emerald-700' :
              step.status === 'active' ? 'text-orange-700' :
              'text-slate-500';

            return (
              <div key={step.label} className={`rounded-2xl border p-2.5 ${statusClasses}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {step.status === 'done' ? <CheckCircle2 size={14} className={textTone} /> : step.status === 'active' ? <BadgeCheck size={14} className={textTone} /> : <AlertTriangle size={14} className={textTone} />}
                    <span className={`text-sm font-semibold ${textTone}`}>{step.label}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${textTone}`}>{step.status}</span>
                </div>
                <p className={`mt-1 text-[11px] ${textTone}`}>{step.detail}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`rounded-[24px] border p-4 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-mono font-bold uppercase tracking-[0.24em] ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Evidence</span>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">Chain of custody</span>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {evidenceItems.map((item) => {
             const borderTone = isDarkMode ? `border-${item.tone}-900/50` : item.tone === 'emerald' ? 'border-emerald-300' : item.tone === 'amber' ? 'border-orange-300' : 'border-blue-300';
             const Icon = item.icon;
             return (
              <div key={item.title} className={`rounded-2xl border p-2.5 ${isDarkMode ? itemBg : 'bg-white shadow-sm'} ${borderTone}`}>
                <div className="flex items-start gap-2">
                  <Icon size={16} className={`mt-0.5 text-${item.tone === 'amber' ? 'orange' : item.tone}-600`} />
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</div>
                    <div className="text-[11px] text-slate-500">{item.meta}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`rounded-[24px] border p-4 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-gray-400">Tasks</span>
          <span className="text-[10px] font-semibold text-rose-500">Overdue: 1</span>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {tasks.map((task) => (
            <div key={task.label} className={`rounded-2xl border p-2.5 ${isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold">{task.label}</div>
                  <div className="text-[11px] text-slate-500">Assigned to {task.officer}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${task.state === 'urgent' ? 'bg-rose-500/10 text-rose-600' : task.state === 'blocked' ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-600'}`}>{task.priority}</span>
                  <span className="text-[10px] font-semibold text-slate-500">{task.due}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`rounded-[24px] border p-4 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-mono font-bold uppercase tracking-[0.24em] ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Key Persons</span>
          <span className="text-[10px] font-semibold text-slate-500">Split view</span>
        </div>
        <div className="mt-3 grid gap-2">
          {persons.map((person) => (
            <div key={person.name} className={`flex items-center justify-between rounded-2xl border p-2.5 ${itemBg}`}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200/70 text-slate-700">
                  {person.role === 'Accused' ? <UserRound size={18} /> : <Users size={18} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{person.name}</span>
                  <span className="text-[11px] text-slate-500">{person.role}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${person.tone}`}>{person.badge}</span>
                <span className="text-[10px] text-slate-400">{person.priors}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`rounded-[24px] border p-4 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-gray-400">Quick Tools</span>
          <span className="text-[10px] font-semibold text-purple-500">Case actions</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {actionButtons.map((action) => {
            const Icon = action.icon;
            return (
              <button key={action.label} onClick={action.action} className={`rounded-2xl border p-2.5 text-left transition-all ${itemBg}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 ${action.tone}`}>
                  <Icon size={15} />
                </div>
                <div className="mt-2 text-sm font-semibold">{action.label}</div>
                <div className="text-[10px] text-slate-500">{action.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
