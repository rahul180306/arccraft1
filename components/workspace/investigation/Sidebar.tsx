import React from 'react';
import { motion } from 'motion/react';
import { pageItemVariants } from '@/lib/motion';
import { KSPCase } from '@/lib/data/realCases';
import { Pencil, MessageSquare, Video, CheckCircle2, FileText, Camera, ArrowRight } from 'lucide-react';

interface SidebarProps {
  activeCase: KSPCase;
  isDarkMode: boolean;
  cardBg: string;
  subCardBg: string;
  setActiveTab: (tab: string) => void;
  setSelectedPerson: (person: any) => void;
  openCopilot: (prompt: string) => void;
  showToast: (msg: string) => void;
}

export default function Sidebar({
  activeCase,
  isDarkMode,
  cardBg,
  subCardBg,
  setActiveTab,
  setSelectedPerson,
  openCopilot,
  showToast
}: SidebarProps) {
  const persons = [
    ...(activeCase.complainant ? [{
      name: activeCase.complainant,
      role: 'Complainant',
      initials: activeCase.complainant.substring(0, 2).toUpperCase(),
      color: 'bg-blue-500/15 text-blue-500',
      phone: '—',
      statement: 'Filed FIR'
    }] : []),
    ...(activeCase.victims || []).map(v => ({
      name: v.name,
      role: 'Victim',
      initials: v.name ? v.name.substring(0, 2).toUpperCase() : 'V',
      color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
      phone: '—',
      statement: `Age: ${v.age || '—'}, Gender: ${v.gender || '—'}`
    })),
    ...(activeCase.accused || []).map(a => ({
      name: a.name,
      role: 'Accused',
      initials: a.name ? a.name.substring(0, 2).toUpperCase() : 'A',
      color: 'bg-red-500/15 text-red-500',
      phone: '—',
      statement: `Age: ${a.age || '—'}, Gender: ${a.gender || '—'}`
    }))
  ];

  const tags = [
    activeCase.crimeSubHead,
    activeCase.district,
    activeCase.hasArrest ? 'Arrest Made' : 'No Arrests',
    activeCase.hasChargesheet ? 'Chargesheet Filed' : null
  ].filter(Boolean);

  return (
    <div className="lg:col-span-3 flex flex-col gap-5">
      <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3.5 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            CASE AT A GLANCE
          </span>
          <button
            onClick={() => showToast('Opening Case Metadata Editor')}
            className="p-1 text-gray-400 hover:text-[#FF5A1F] cursor-pointer"
            title="Edit Metadata"
          >
            <Pencil size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Gravity</span>
            <span className="font-bold text-[#FF5A1F] flex items-center gap-1">
              {activeCase.gravity ? (
                <><span className="w-2 h-2 rounded-full bg-[#FF5A1F]" /> {activeCase.gravity}</>
              ) : '—'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Category</span>
            <span className="font-bold flex items-center gap-1">
               {activeCase.category || '—'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Case Value</span>
            <span className="font-mono font-extrabold text-slate-900 dark:text-white">—</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Property Stolen</span>
            <span className="font-mono font-extrabold text-[#FF5A1F]">—</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Linked Cases</span>
            <span className="font-mono font-bold">—</span>
          </div>

          <div className="flex flex-col gap-1.5 mt-1 border-t pt-2.5 border-gray-200 dark:border-gray-800">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">Case Tags</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
              <button
                onClick={() => showToast('Add new Tag dialog opened')}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md border border-dashed border-gray-400 text-gray-400 hover:text-[#FF5A1F] hover:border-[#FF5A1F] cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            KEY PERSONS
          </span>
          <button
            onClick={() => {
              setActiveTab('Witnesses');
              showToast('Opening Persons Directory');
            }}
            className="text-xs font-bold text-[#FF5A1F] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {persons.length > 0 ? persons.map((person, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPerson(person)}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${subCardBg}`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center shrink-0 ${person.color}`}>
                  {person.initials}
                </div>
                <div className="flex flex-col max-w-[120px]">
                  <span className={`text-xs font-bold truncate ${isDarkMode ? 'text-gray-100' : 'text-slate-900'}`}>
                    {person.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">{person.role}</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openCopilot(`Draft a message or question list for ${person.name} (${person.role})`);
                }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-[#FF5A1F] hover:bg-[#FF5A1F]/10 cursor-pointer transition-colors"
                title="Send Message / Copilot Query"
              >
                <MessageSquare size={14} />
              </button>
            </div>
          )) : (
            <div className="text-center text-xs text-gray-500 py-4">No persons recorded in FIR</div>
          )}
        </div>
      </motion.div>

      <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            LATEST ACTIVITY
          </span>
          <span className="text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
          </span>
        </div>

        <div className="flex flex-col gap-3 text-xs">
          {[
            { title: 'CCTV footage uploaded', time: '10:24 AM by ASI Ramesh', icon: Video, color: 'text-purple-400' },
            { title: 'Fingerprint matched', time: '09:58 AM by HC Kavya', icon: CheckCircle2, color: 'text-emerald-500' },
            { title: 'Witness statement recorded', time: '09:32 AM by SI Naveen', icon: FileText, color: 'text-[#FF5A1F]' },
            { title: 'Scene photos added', time: 'Yesterday, 08:15 PM by AI System', icon: Camera, color: 'text-blue-500' },
          ].map((act, idx) => {
            const IconComp = act.icon;
            return (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
                  <IconComp size={14} className={act.color} />
                </div>
                <div className="flex flex-col">
                  <span className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                    {act.title}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">{act.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => showToast('Opening Audit Activity Stream')}
          className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center gap-1 cursor-pointer w-fit mt-1"
        >
          <span>View All Activity</span>
          <ArrowRight size={13} />
        </button>
      </motion.div>
    </div>
  );
}
