'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, X, ChevronRight, Filter, Circle, CheckCircle2, AlertCircle,
  Folder, MapPin, User, Calendar, Shield, TrendingUp, FileText
} from 'lucide-react';
import { useUIStore } from '@/lib/stores/uiStore';
import { useInvestigationStore } from '@/lib/stores/investigationStore';

const STATUS_COLOR: Record<string, string> = {
  'Under Investigation': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Charge Sheeted': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Pending Trial': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  'Convicted': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Acquitted': 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  'Closed': 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  'BoundOver': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'Dis/Acq': 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  'False Case': 'bg-red-500/15 text-red-400 border-red-500/30',
  'Undetected': 'bg-red-500/15 text-red-400 border-red-500/30',
  'Abated': 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  'Compounded': 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  'Traced': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Un Traced': 'bg-red-500/15 text-red-400 border-red-500/30',
  'Other Disposal': 'bg-gray-500/15 text-gray-400 border-gray-500/30',
};

const CRIME_HEAD_ICON: Record<string, React.ReactNode> = {
  'Crimes Against Body': <Shield size={12} className="text-red-400" />,
  'Crimes Against Property': <Folder size={12} className="text-amber-400" />,
  'Crimes Against Women': <AlertCircle size={12} className="text-pink-400" />,
  'Crimes Against Children': <AlertCircle size={12} className="text-pink-400" />,
  'Economic Offences': <TrendingUp size={12} className="text-blue-400" />,
  'Cyber Crimes': <FileText size={12} className="text-purple-400" />,
  'Special, Local & Procedural Laws': <FileText size={12} className="text-gray-400" />,
  'Traffic & Motor Vehicle Offences': <Circle size={12} className="text-orange-400" />,
};

export default function FIRSwitcherModal() {
  const isDarkMode = useUIStore(s => s.isDarkMode);
  const closeFIRSwitcher = useUIStore(s => s.closeFIRSwitcher);
  const showToast = useUIStore(s => s.showToast);

  const cases = useInvestigationStore(s => s.cases);
  const activeCase = useInvestigationStore(s => s.activeCase);
  const setActiveCase = useInvestigationStore(s => s.setActiveCase);

  const [query, setQuery] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterCrimeHead, setFilterCrimeHead] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => searchRef.current?.focus(), 100);
  }, []);

  // Unique filter options
  const districts = useMemo(() => Array.from(new Set(cases.map(c => c.district))).sort(), [cases]);
  const crimeHeads = useMemo(() => Array.from(new Set(cases.map(c => c.crimeHead))).sort(), [cases]);
  const statuses = useMemo(() => Array.from(new Set(cases.map(c => c.caseStatus))).sort(), [cases]);

  // Filtered & searched cases
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return cases.filter(c => {
      if (filterDistrict && c.district !== filterDistrict) return false;
      if (filterCrimeHead && c.crimeHead !== filterCrimeHead) return false;
      if (filterStatus && c.caseStatus !== filterStatus) return false;
      if (!q) return true;
      return (
        c.crimeNo.toLowerCase().includes(q) ||
        c.crimeSubHead.toLowerCase().includes(q) ||
        c.crimeHead.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.ioName.toLowerCase().includes(q) ||
        c.policeStation.toLowerCase().includes(q) ||
        c.accused.some(a => a.name.toLowerCase().includes(q)) ||
        c.caseStatus.toLowerCase().includes(q)
      );
    });
  }, [cases, query, filterDistrict, filterCrimeHead, filterStatus]);

  const handleSelect = (crimeNo: string) => {
    setActiveCase(crimeNo);
    const selected = cases.find(c => c.crimeNo === crimeNo);
    showToast(`Active Investigation switched to FIR ${crimeNo.slice(-8)}`);
    closeFIRSwitcher();
  };

  const bg = isDarkMode ? 'bg-[#0B0F19] text-white' : 'bg-white text-slate-900';
  const panelBg = isDarkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-[#F8FAFC] border-[#E2E8F0]';
  const rowBg = isDarkMode
    ? 'hover:bg-[#1F2937] border-[#1F2937]'
    : 'hover:bg-slate-50 border-[#E2E8F0]';
  const activeBg = isDarkMode ? 'bg-[#FF5A1F]/10 border-[#FF5A1F]/30' : 'bg-[#FF5A1F]/5 border-[#FF5A1F]/30';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[7vh] px-4"
      onClick={closeFIRSwitcher}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -16 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onClick={e => e.stopPropagation()}
        className={`relative w-full max-w-4xl max-h-[82vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${bg} ${isDarkMode ? 'border-[#1F2937]' : 'border-[#E2E8F0]'}`}
      >
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center gap-3 shrink-0 ${isDarkMode ? 'border-[#1F2937]' : 'border-[#E2E8F0]'}`}>
          <div className="w-8 h-8 rounded-xl bg-[#FF5A1F] flex items-center justify-center shrink-0">
            <Folder size={15} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight">Switch Active Investigation</h2>
            <p className="text-[10px] text-gray-400 font-mono mt-0.5">
              {filtered.length.toLocaleString()} of {cases.length.toLocaleString()} FIRs · KSP CCTNS Database
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                showFilters || filterDistrict || filterCrimeHead || filterStatus
                  ? 'bg-[#FF5A1F] text-white border-[#FF5A1F]'
                  : isDarkMode
                    ? 'bg-[#1F2937] border-[#374151] text-gray-300 hover:bg-[#374151]'
                    : 'bg-white border-[#E2E8F0] text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter size={12} />
              Filters
              {(filterDistrict || filterCrimeHead || filterStatus) && (
                <span className="bg-white/30 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black">
                  {[filterDistrict, filterCrimeHead, filterStatus].filter(Boolean).length}
                </span>
              )}
            </button>
            <button onClick={closeFIRSwitcher} className="p-1.5 rounded-xl hover:bg-gray-100/10 transition-colors cursor-pointer">
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className={`px-5 py-3 border-b shrink-0 ${isDarkMode ? 'border-[#1F2937]' : 'border-[#E2E8F0]'}`}>
          <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border ${panelBg}`}>
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              ref={searchRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by FIR no, crime type, district, officer, accused name..."
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-0.5 rounded-lg hover:bg-gray-200/20 cursor-pointer">
                <X size={12} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Filters (collapsible) */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`overflow-hidden border-b shrink-0 ${isDarkMode ? 'border-[#1F2937]' : 'border-[#E2E8F0]'}`}
            >
              <div className="px-5 py-3 flex gap-3 flex-wrap">
                {/* District filter */}
                <select
                  value={filterDistrict}
                  onChange={e => setFilterDistrict(e.target.value)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${panelBg}`}
                >
                  <option value="">All Districts</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                {/* Crime head filter */}
                <select
                  value={filterCrimeHead}
                  onChange={e => setFilterCrimeHead(e.target.value)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${panelBg}`}
                >
                  <option value="">All Crime Heads</option>
                  {crimeHeads.map(h => <option key={h} value={h}>{h}</option>)}
                </select>

                {/* Status filter */}
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${panelBg}`}
                >
                  <option value="">All Statuses</option>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                {(filterDistrict || filterCrimeHead || filterStatus) && (
                  <button
                    onClick={() => { setFilterDistrict(''); setFilterCrimeHead(''); setFilterStatus(''); }}
                    className="text-xs font-bold text-[#FF5A1F] hover:underline cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Column headers */}
        <div className={`px-5 py-2 grid grid-cols-12 gap-2 text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 border-b shrink-0 ${isDarkMode ? 'border-[#1F2937]' : 'border-[#E2E8F0]'}`}>
          <div className="col-span-3">FIR No</div>
          <div className="col-span-3">Crime Type</div>
          <div className="col-span-2">District</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">IO / Officer</div>
        </div>

        {/* Cases list */}
        <div className="overflow-y-auto flex-1 min-h-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <Search size={32} className="text-gray-300" />
              <p className="text-sm font-semibold text-gray-400">No FIRs match your search</p>
              <p className="text-xs text-gray-500">Try a different keyword or clear the filters</p>
            </div>
          ) : (
            filtered.map(c => {
              const isActive = c.crimeNo === activeCase?.crimeNo;
              return (
                <button
                  key={c.caseId}
                  onClick={() => handleSelect(c.crimeNo)}
                  className={`w-full px-5 py-3 grid grid-cols-12 gap-2 items-center border-b text-left transition-all cursor-pointer group ${
                    isActive ? activeBg : rowBg
                  } ${isDarkMode ? 'border-[#1F2937]' : 'border-[#F1F5F9]'}`}
                >
                  {/* FIR No */}
                  <div className="col-span-3 flex items-center gap-2 min-w-0">
                    {isActive ? (
                      <CheckCircle2 size={13} className="text-[#FF5A1F] shrink-0" />
                    ) : (
                      <Folder size={13} className="text-gray-400 shrink-0 group-hover:text-[#FF5A1F] transition-colors" />
                    )}
                    <div className="min-w-0">
                      <div className={`text-xs font-bold font-mono truncate ${isActive ? 'text-[#FF5A1F]' : ''}`}>
                        {c.crimeNo.slice(-10)}
                      </div>
                      <div className="text-[9px] text-gray-400 truncate">{c.registrationDate}</div>
                    </div>
                  </div>

                  {/* Crime Type */}
                  <div className="col-span-3 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {CRIME_HEAD_ICON[c.crimeHead] ?? <FileText size={12} className="text-gray-400" />}
                      <span className="text-xs font-semibold truncate">{c.crimeSubHead}</span>
                    </div>
                    <div className="text-[9px] text-gray-400 truncate mt-0.5">{c.crimeHead}</div>
                  </div>

                  {/* District */}
                  <div className="col-span-2 min-w-0">
                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin size={10} className="text-gray-400 shrink-0" />
                      <span className="text-xs font-medium truncate">{c.district}</span>
                    </div>
                    <div className="text-[9px] text-gray-400 truncate mt-0.5">{c.policeStation.replace(' Police Station', '').replace(' PS', '')}</div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 min-w-0">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-lg border truncate inline-block max-w-full ${STATUS_COLOR[c.caseStatus] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/30'}`}>
                      {c.caseStatus}
                    </span>
                  </div>

                  {/* IO */}
                  <div className="col-span-2 min-w-0 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <User size={10} className="text-gray-400 shrink-0" />
                        <span className="text-xs font-medium truncate">{c.ioName}</span>
                      </div>
                      <div className="text-[9px] text-gray-400 truncate mt-0.5">{c.ioKgid}</div>
                    </div>
                    <ChevronRight size={13} className="text-gray-300 shrink-0 group-hover:text-[#FF5A1F] transition-colors" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className={`px-5 py-3 border-t shrink-0 flex items-center justify-between ${isDarkMode ? 'border-[#1F2937]' : 'border-[#E2E8F0]'}`}>
          <span className="text-[10px] font-mono text-gray-500">
            KSP CCTNS · {cases.length.toLocaleString()} FIRs loaded from Police_FIR_Combined_Dataset_Final.xlsx
          </span>
          <span className="text-[10px] font-mono text-gray-500">Press <kbd className="px-1 py-0.5 rounded bg-gray-200/20 border border-gray-200/20 font-bold">ESC</kbd> to close</span>
        </div>
      </motion.div>
    </div>
  );
}
