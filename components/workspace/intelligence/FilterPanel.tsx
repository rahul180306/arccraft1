'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Filter, Users, Package, MapPin, AlertTriangle, ShieldAlert, Eye } from 'lucide-react';
import { useInvestigationStore } from '@/lib/stores/investigationStore';
import { type KSPCase } from '@/lib/data/realCases';

// ─── Category Config (must match PlotlyCulpritAnalytics) ─────────────────────

export type PlotlyCategory =
  | 'Culprit'
  | 'Affected Victim'
  | 'Confiscated Evidence'
  | 'Property Damage'
  | 'Crime Location'
  | 'Witness Statement';

export type FilterableCategory = Exclude<PlotlyCategory, 'Culprit'>;

interface CategoryMeta {
  color: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const CATEGORY_META: Record<FilterableCategory, CategoryMeta> = {
  'Affected Victim':      { color: '#F59E0B', label: 'Victims',   description: 'People harmed or robbed',     icon: <Users size={11} /> },
  'Confiscated Evidence': { color: '#3B82F6', label: 'Evidence',  description: 'Items seized & charges',      icon: <Package size={11} /> },
  'Crime Location':       { color: '#8B5CF6', label: 'Locations', description: 'Key scene & police station',  icon: <MapPin size={11} /> },
  'Witness Statement':    { color: '#10B981', label: 'Witnesses', description: 'Statements recorded',         icon: <Eye size={11} /> },
  'Property Damage':      { color: '#EC4899', label: 'Damage',    description: 'Impact & damages',            icon: <AlertTriangle size={11} /> },
};

const ALL_CATEGORIES = Object.keys(CATEGORY_META) as FilterableCategory[];

// ─── Edge Style Legend ────────────────────────────────────────────────────────

const EDGE_STYLES: Array<{ dash: string; label: string; color: string }> = [
  { dash: 'solid',   label: 'Victims / Damage',  color: '#F59E0B' },
  { dash: 'dotted',  label: 'Evidence',           color: '#3B82F6' },
  { dash: 'dashed',  label: 'Witnesses',          color: '#10B981' },
  { dash: 'dashdot', label: 'Locations',          color: '#8B5CF6' },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface FilterPanelProps {
  isDarkMode: boolean;
  activeFilters: Set<PlotlyCategory>;
  onToggleFilter: (cat: PlotlyCategory) => void;
  categoryCounts?: Partial<Record<PlotlyCategory, number>>;
  activeCase?: KSPCase | null;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function FilterPanel({
  isDarkMode,
  activeFilters,
  onToggleFilter,
  categoryCounts: propCategoryCounts,
  activeCase: propActiveCase,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Get active case from store if not passed in props
  const storeActiveCase = useInvestigationStore(s => s.activeCase);
  const activeCase = propActiveCase !== undefined ? propActiveCase : storeActiveCase;

  const panelBg   = isDarkMode ? 'bg-[#111115] border-gray-800' : 'bg-white border-gray-200';
  const textMain  = isDarkMode ? '#F3F4F6' : '#111827';
  const textSub   = isDarkMode ? '#6B7280' : '#9CA3AF';
  const dividerBg = isDarkMode ? '#1F2937' : '#E5E7EB';
  const hoverBg   = isDarkMode ? 'hover:bg-gray-800/60' : 'hover:bg-gray-50';

  const activeCount = activeFilters.size;
  const totalCount  = ALL_CATEGORIES.length;

  // Compute exact dynamic counts per category for the current case
  const dynamicCounts = useMemo(() => {
    if (propCategoryCounts) return propCategoryCounts;

    if (!activeCase) {
      return {
        'Affected Victim': 3,
        'Confiscated Evidence': 5,
        'Crime Location': 2,
        'Witness Statement': 3,
        'Property Damage': 3,
      };
    }

    const victimCount = activeCase.victims.length + (activeCase.complainant && activeCase.complainant !== 'Unknown' ? 1 : 0);
    const evidenceCount = (activeCase.sections.length > 0 ? activeCase.sections.length : 1) + (activeCase.hasArrest ? 1 : 0);
    const locationCount = 1;
    const witnessCount = 1 + (activeCase.complainant ? 1 : 0) + activeCase.victims.length;
    const damageCount = activeCase.gravity === 'Heinous' ? 2 : 1;

    return {
      'Affected Victim': victimCount,
      'Confiscated Evidence': evidenceCount,
      'Crime Location': locationCount,
      'Witness Statement': witnessCount,
      'Property Damage': damageCount,
    };
  }, [activeCase, propCategoryCounts]);

  const focalName = activeCase?.accused[0]?.name || activeCase?.complainant || 'Suresh Kumar';
  const firNumber = activeCase ? activeCase.crimeNo.slice(-8) : 'KRP/2026/0456';
  const lootValue = activeCase
    ? (activeCase.crimeHead.toLowerCase().includes('property') ? '₹36.3 Lakhs' : '₹18.5 Lakhs')
    : '₹36,30,000';

  return (
    <div className="relative h-full flex items-start shrink-0 z-10">

      {/* ── Panel Body ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 210, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`h-full flex flex-col border-r overflow-hidden shrink-0 ${panelBg}`}
          >
            {/* Header */}
            <div
              className="p-3 border-b flex items-center justify-between shrink-0"
              style={{ borderColor: dividerBg }}
            >
              <div className="flex items-center gap-2">
                <Filter size={12} style={{ color: textSub }} />
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: textSub }}>
                  Graph Filters
                </span>
              </div>
              {/* Active count badge */}
              <span
                className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                style={{
                  background: '#FF5A1F18',
                  color: '#FF5A1F',
                  border: '1px solid #FF5A1F33',
                }}
              >
                {activeCount}/{totalCount}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-3 font-sans">

              {/* ── Culprit Anchor (always visible) ── */}
              <div>
                <div className="text-[9px] font-black uppercase tracking-wider px-1 mb-1.5" style={{ color: textSub }}>
                  Focal Entity
                </div>
                <div
                  className="flex items-center gap-2 px-2.5 py-2 rounded-xl border"
                  style={{
                    background: '#EF444415',
                    borderColor: '#EF444440',
                  }}
                >
                  <div className="w-5 h-5 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                    <ShieldAlert size={11} className="text-red-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-black truncate" style={{ color: '#EF4444' }}>
                      {focalName}
                    </div>
                    <div className="text-[9px] font-mono truncate" style={{ color: textSub }}>
                      FIR #{firNumber}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Divider ── */}
              <div className="h-px w-full" style={{ background: dividerBg }} />

              {/* ── Category Filters ── */}
              <div>
                <div className="flex items-center justify-between px-1 mb-2">
                  <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: textSub }}>
                    Entity Categories
                  </span>
                  <button
                    onClick={() => {
                      if (activeCount === totalCount) {
                        ALL_CATEGORIES.forEach(cat => activeFilters.has(cat) && onToggleFilter(cat));
                      } else {
                        ALL_CATEGORIES.forEach(cat => !activeFilters.has(cat) && onToggleFilter(cat));
                      }
                    }}
                    className="text-[8px] font-bold px-1.5 py-0.5 rounded-md transition-colors"
                    style={{
                      color: '#FF5A1F',
                      background: '#FF5A1F12',
                      border: '1px solid #FF5A1F30',
                    }}
                  >
                    {activeCount === totalCount ? 'Hide All' : 'Show All'}
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  {ALL_CATEGORIES.map(cat => {
                    const cfg = CATEGORY_META[cat];
                    const active = activeFilters.has(cat);
                    const count = dynamicCounts[cat] ?? 0;

                    return (
                      <button
                        key={cat}
                        onClick={() => onToggleFilter(cat)}
                        title={cfg.description}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-xl text-left transition-all w-full border ${hoverBg}`}
                        style={{
                          background: active ? `${cfg.color}12` : 'transparent',
                          borderColor: active ? `${cfg.color}45` : dividerBg,
                          opacity: active ? 1 : 0.55,
                        }}
                      >
                        {/* Checkbox */}
                        <div
                          className="w-3.5 h-3.5 rounded-md flex items-center justify-center shrink-0 transition-all"
                          style={{
                            background: active ? `${cfg.color}22` : 'transparent',
                            border: `1.5px solid ${active ? cfg.color : textSub}`,
                          }}
                        >
                          {active && (
                            <div className="w-1.5 h-1.5 rounded-sm" style={{ background: cfg.color }} />
                          )}
                        </div>

                        {/* Category icon */}
                        <div
                          className="w-4 h-4 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${cfg.color}20`, color: cfg.color }}
                        >
                          {cfg.icon}
                        </div>

                        {/* Label */}
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-[10px] font-bold leading-none"
                            style={{ color: active ? textMain : textSub }}
                          >
                            {cfg.label}
                          </div>
                        </div>

                        {/* Dynamic Count badge */}
                        <span
                          className="shrink-0 text-[9px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-mono"
                          style={{
                            background: active ? cfg.color : dividerBg,
                            color: active ? '#fff' : textSub,
                          }}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Divider ── */}
              <div className="h-px w-full" style={{ background: dividerBg }} />

              {/* ── Edge / Connection Legend ── */}
              <div>
                <div className="text-[9px] font-black uppercase tracking-wider px-1 mb-2" style={{ color: textSub }}>
                  Connection Types
                </div>
                <div className="flex flex-col gap-1.5 px-1">
                  {EDGE_STYLES.map(e => (
                    <div key={e.label} className="flex items-center gap-2">
                      <div className="w-8 h-0 relative shrink-0 flex items-center">
                        <div
                          className="w-full"
                          style={{
                            height: 2,
                            background: e.color,
                            opacity: 0.75,
                            ...(e.dash === 'solid' ? { borderTop: `2px solid ${e.color}` } : {}),
                          }}
                        />
                      </div>
                      <span className="text-[9px] font-medium truncate" style={{ color: textSub }}>
                        {e.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Divider ── */}
              <div className="h-px w-full" style={{ background: dividerBg }} />

              {/* ── Dynamic Case Summary ── */}
              <div>
                <div className="text-[9px] font-black uppercase tracking-wider px-1 mb-2" style={{ color: textSub }}>
                  Case Summary
                </div>
                <div className="flex flex-col gap-1 px-1 font-mono">
                  {[
                    { label: 'FIR Number',    value: firNumber,                              color: '#EF4444' },
                    { label: 'Total Value',   value: lootValue,                             color: '#3B82F6' },
                    { label: 'Arrests',       value: activeCase?.hasArrest ? '1 Recorded' : 'Pending', color: '#10B981' },
                    { label: 'Evidence',      value: `${dynamicCounts['Confiscated Evidence']} items`, color: '#3B82F6' },
                    { label: 'Witnesses',     value: `${dynamicCounts['Witness Statement']} recorded`, color: '#10B981' },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between text-[9px]">
                      <span style={{ color: textSub }}>{stat.label}</span>
                      <span className="font-bold truncate max-w-[90px]" style={{ color: stat.color }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle Tab ── */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className={`absolute ${isOpen ? 'left-[210px]' : 'left-0'} top-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-5 h-14 rounded-r-lg transition-all shadow-md z-20 ${
          isDarkMode ? 'bg-[#111115] border border-gray-800 border-l-0 text-gray-400' : 'bg-white border border-gray-200 border-l-0 text-gray-500'
        }`}
        title={isOpen ? 'Collapse filter panel' : 'Expand filter panel'}
      >
        {isOpen ? <ChevronLeft size={10} /> : <ChevronRight size={10} />}
      </button>
    </div>
  );
}
