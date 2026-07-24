'use client';

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  ShieldAlert, Package, Users, MapPin, AlertTriangle,
  DollarSign, X, Filter, Eye, EyeOff
} from 'lucide-react';

// Dynamically import Plotly with SSR disabled for Next.js App Router compatibility
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

// ─── Types ───────────────────────────────────────────────────────────────────

type Category =
  | 'Culprit'
  | 'Affected Victim'
  | 'Confiscated Evidence'
  | 'Property Damage'
  | 'Crime Location'
  | 'Witness Statement';

interface CulpritNode {
  id: string;
  label: string;
  category: Category;
  x: number;
  y: number;
  size: number;
  color: string;
  desc: string;
  tags?: string[];
}

interface PlotlyCulpritAnalyticsProps {
  isDarkMode: boolean;
  searchQuery?: string;
  activeFilters?: Set<Category>;
  onToggleFilter?: (cat: Category) => void;
}

// ─── Category Config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<Category, { color: string; icon: React.ReactNode; label: string; edgeWidth: number; edgeDash: string }> = {
  'Culprit': { color: '#EF4444', icon: <ShieldAlert size={11} />, label: 'Culprit', edgeWidth: 4, edgeDash: 'solid' },
  'Affected Victim': { color: '#F59E0B', icon: <Users size={11} />, label: 'Victims', edgeWidth: 2.5, edgeDash: 'solid' },
  'Confiscated Evidence': { color: '#3B82F6', icon: <Package size={11} />, label: 'Evidence', edgeWidth: 2.5, edgeDash: 'dot' },
  'Crime Location': { color: '#8B5CF6', icon: <MapPin size={11} />, label: 'Locations', edgeWidth: 2, edgeDash: 'dashdot' },
  'Witness Statement': { color: '#10B981', icon: <Eye size={11} />, label: 'Witnesses', edgeWidth: 1.5, edgeDash: 'dash' },
  'Property Damage': { color: '#EC4899', icon: <AlertTriangle size={11} />, label: 'Damage', edgeWidth: 2, edgeDash: 'solid' },
};

// ─── Network Data ─────────────────────────────────────────────────────────────

const ALL_NODES: CulpritNode[] = [
  // Center
  {
    id: 'SK', label: 'Suresh Kumar\n(Main Culprit)', category: 'Culprit',
    x: 0, y: 0, size: 52, color: '#EF4444',
    desc: 'Prime Accused — FIR KRP/2026/0456. Gang Syndicate Leader. Known recidivist with 3 prior FIRs.',
    tags: ['Gang Leader', 'Armed Burglary', 'Recidivist'],
  },
  // Victims
  {
    id: 'VIC1', label: 'Anekal Resident\nFamily', category: 'Affected Victim',
    x: -3.0, y: 3.6, size: 28, color: '#F59E0B',
    desc: 'Primary Burglary Victim. Total stolen assets: ₹36.3L. Property badly damaged during break-in.',
    tags: ['Primary Victim', '₹36.3L Lost'],
  },
  {
    id: 'VIC2', label: 'Sandeep M.', category: 'Affected Victim',
    x: 0, y: 4.4, size: 22, color: '#F59E0B',
    desc: 'Neighbour robbed at knifepoint during getaway. Suffered minor injuries. Filed complaint separately.',
    tags: ['Assault Victim', 'Sec 154 CrPC'],
  },
  {
    id: 'VIC3', label: 'Hoodi Commercial\nOwners', category: 'Affected Victim',
    x: 3.0, y: 3.6, size: 24, color: '#F59E0B',
    desc: 'Commercial disruption caused during high-speed vehicle chase. 2 shops damaged.',
    tags: ['Commercial Loss', '2 Shops Damaged'],
  },
  // Evidence
  {
    id: 'EVD1', label: 'AFIS Print #01\n(94.2% Match)', category: 'Confiscated Evidence',
    x: 4.6, y: 1.8, size: 28, color: '#3B82F6',
    desc: 'Biometric latent fingerprint lifted from vault safe door handle. AFIS match 94.2% — accepted in court.',
    tags: ['Biometric', 'Court Admissible', '94.2%'],
  },
  {
    id: 'EVD2', label: 'CCTV_01.mp4\nFootage', category: 'Confiscated Evidence',
    x: 5.2, y: -0.2, size: 24, color: '#3B82F6',
    desc: 'CCTV captures Innova KA03MN4481 entering gated compound at 02:17 hrs. Timestamp verified.',
    tags: ['Video Evidence', 'KA03MN4481'],
  },
  {
    id: 'EVD3', label: 'Stolen Gold\n420g (₹31.5L)', category: 'Confiscated Evidence',
    x: 4.6, y: -2.2, size: 30, color: '#3B82F6',
    desc: 'Gold ornaments confiscated from TC Palya hideout stash during police raid. Fully recovered.',
    tags: ['Physical Evidence', '₹31.5L', 'Gold'],
  },
  {
    id: 'EVD4', label: 'Seized Cash\n₹4.8 Lakhs', category: 'Confiscated Evidence',
    x: 3.0, y: -4.0, size: 24, color: '#3B82F6',
    desc: 'Loot currency notes bearing bank markings. Partial serial numbers traceable to victim bank.',
    tags: ['₹4.8L Cash', 'Traceable Notes'],
  },
  {
    id: 'EVD5', label: 'Hydraulic Cutter\n& Crowbar', category: 'Confiscated Evidence',
    x: 1.2, y: -4.8, size: 22, color: '#3B82F6',
    desc: 'Professional housebreaking equipment used to pry open vault. Lab-confirmed contact marks on safe.',
    tags: ['Housebreaking Tool', 'Lab Confirmed'],
  },
  // Damage
  {
    id: 'DMG1', label: 'Vault Door\nDestroyed (₹1.5L)', category: 'Property Damage',
    x: -1.2, y: -4.8, size: 26, color: '#EC4899',
    desc: 'Heavy-duty safe vault door pried & blown open with hydraulic cutter. Replacement cost: ₹1,50,000.',
    tags: ['₹1.5L Damage', 'Vault'],
  },
  {
    id: 'DMG2', label: 'Security Gate\nRammed (₹85K)', category: 'Property Damage',
    x: -3.0, y: -4.0, size: 24, color: '#EC4899',
    desc: 'Entrance gate & perimeter fence rammed during getaway with Innova. Repair cost: ₹85,000.',
    tags: ['₹85K Damage', 'Perimeter'],
  },
  {
    id: 'DMG3', label: 'CCTV Box\nCut (₹45K)', category: 'Property Damage',
    x: -4.6, y: -2.2, size: 22, color: '#EC4899',
    desc: 'Surveillance power & fibre wires deliberately cut. CCTV offline for 38 mins post-incident.',
    tags: ['₹45K Damage', 'Surveillance Sabotage'],
  },
  // Locations
  {
    id: 'LOC1', label: 'Plot #42 Anekal\nCrime Scene', category: 'Crime Location',
    x: -5.2, y: -0.2, size: 30, color: '#8B5CF6',
    desc: 'Primary armed burglary site. Scene of Crime Officer (SOCO) report filed. GPS: 12.7109°N, 77.6938°E.',
    tags: ['SOC', 'GPS Tagged', 'Anekal'],
  },
  {
    id: 'LOC2', label: 'Hoodi BTS\nTower #402', category: 'Crime Location',
    x: -4.6, y: 1.8, size: 24, color: '#8B5CF6',
    desc: 'Cell tower dump confirms suspect mobile ping at 02:11 hrs. CDR used as corroborative evidence.',
    tags: ['CDR Evidence', 'Tower Dump', 'Hoodi'],
  },
  {
    id: 'LOC3', label: 'TC Palya\nHideout', category: 'Crime Location',
    x: -3.0, y: 3.8, size: 0, color: '#8B5CF6',
    desc: 'Suspect safe house raided at 06:45 hrs. Stolen goods & tools recovered on premises.',
    tags: ['Raid Location', 'TC Palya'],
  },
  // Witnesses
  {
    id: 'WIT1', label: 'Harish K.\n(Key Witness)', category: 'Witness Statement',
    x: -2.4, y: 4.4, size: 24, color: '#10B981',
    desc: 'Sec 161 CrPC statement recorded. Confirmed timeline of events and suspect vehicle movement.',
    tags: ['Sec 161 CrPC', 'Timeline Witness'],
  },
  {
    id: 'WIT2', label: 'Mohan Lal\n(Security Guard)', category: 'Witness Statement',
    x: 1.2, y: 4.8, size: 22, color: '#10B981',
    desc: 'Eyewitness. Identified suspect and Innova KA03MN4481. Provided positive ID in TI parade.',
    tags: ['Eyewitness', 'TI Parade'],
  },
  {
    id: 'WIT3', label: 'Dr. V. Rao\n(Forensic Officer)', category: 'Witness Statement',
    x: 3.6, y: 4.0, size: 22, color: '#10B981',
    desc: 'FSL expert. Certified AFIS print analysis, tool marks, and gold purity confirmation for court.',
    tags: ['FSL Expert', 'Court Witness'],
  },
];

// Monetary breakdown for bar chart
const MONETARY_ITEMS = [
  { item: 'Stolen Gold', amount: 3150000, color: '#3B82F6' },
  { item: 'Seized Cash', amount: 480000, color: '#60A5FA' },
  { item: 'Vault Damage', amount: 150000, color: '#EC4899' },
  { item: 'Gate Damage', amount: 85000, color: '#F43F5E' },
  { item: 'CCTV Damage', amount: 45000, color: '#FB7185' },
];

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG).filter(c => c !== 'Culprit') as Category[];

// ─── Component ───────────────────────────────────────────────────────────────

export default function PlotlyCulpritAnalytics({
  isDarkMode,
  searchQuery = '',
  activeFilters: propActiveFilters,
  onToggleFilter: propToggleFilter,
}: PlotlyCulpritAnalyticsProps) {

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [internalActiveFilters, setInternalActiveFilters] = useState<Set<Category>>(new Set(ALL_CATEGORIES));

  const activeFilters = propActiveFilters ?? internalActiveFilters;

  // Toggle a category filter
  const toggleFilter = useCallback((cat: Category) => {
    if (propToggleFilter) {
      propToggleFilter(cat);
    } else {
      setInternalActiveFilters(prev => {
        const next = new Set(prev);
        if (next.has(cat)) { next.delete(cat); } else { next.add(cat); }
        return next;
      });
    }
  }, [propToggleFilter]);

  // Theme tokens
  const bgCanvas = isDarkMode ? '#0A0A0F' : '#F1F5F9';
  const bgCard = isDarkMode ? '#13131A' : '#FFFFFF';
  const bgCardAlt = isDarkMode ? '#1A1A24' : '#F8FAFC';
  const borderCol = isDarkMode ? '#222230' : '#E2E8F0';
  const textMain = isDarkMode ? '#F3F4F6' : '#111827';
  const textSub = isDarkMode ? '#6B7280' : '#9CA3AF';
  const glassBase = isDarkMode
    ? 'backdrop-blur-xl bg-[#13131A]/90 border border-[#222230]'
    : 'backdrop-blur-xl bg-white/90 border border-slate-200';

  // Filtered nodes (always keep SK)
  const visibleNodes = useMemo(() =>
    ALL_NODES.filter(n => n.id === 'SK' || activeFilters.has(n.category)).filter(n => n.size > 0),
    [activeFilters]
  );

  // Matched node IDs from search
  const matchedIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>();
    const q = searchQuery.toLowerCase();
    return new Set(
      ALL_NODES
        .filter(n => n.label.toLowerCase().includes(q) || n.desc.toLowerCase().includes(q) || n.category.toLowerCase().includes(q))
        .map(n => n.id)
    );
  }, [searchQuery]);

  const hasSearch = matchedIds.size > 0;

  // Selected node detail
  const selectedNode = useMemo(() =>
    selectedNodeId ? ALL_NODES.find(n => n.id === selectedNodeId) ?? null : null,
    [selectedNodeId]
  );

  // Category live counts
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<Category, number>> = {};
    for (const cat of ALL_CATEGORIES) {
      counts[cat] = ALL_NODES.filter(n => n.category === cat && n.size > 0).length;
    }
    return counts;
  }, []);

  // Edges: one trace per visible non-culprit node with category styling
  const edgeTraces = useMemo(() =>
    visibleNodes
      .filter(n => n.id !== 'SK')
      .map(target => {
        const cfg = CATEGORY_CONFIG[target.category];
        const dimmed = hasSearch && !matchedIds.has(target.id);
        return {
          x: [0, target.x, null] as (number | null)[],
          y: [0, target.y, null] as (number | null)[],
          mode: 'lines' as const,
          line: {
            color: dimmed ? (isDarkMode ? '#2a2a36' : '#d1d5db') : cfg.color,
            width: cfg.edgeWidth,
            dash: cfg.edgeDash as 'solid' | 'dot' | 'dash' | 'dashdot',
          },
          opacity: dimmed ? 0.2 : 0.55,
          hoverinfo: 'none' as const,
          showlegend: false,
        };
      }),
    [visibleNodes, hasSearch, matchedIds, isDarkMode]
  );

  // Nodes scatter trace
  const nodeTrace = useMemo(() => {
    return {
      x: visibleNodes.map(n => n.x),
      y: visibleNodes.map(n => n.y),
      mode: 'markers+text' as const,
      type: 'scatter' as const,
      customdata: visibleNodes.map(n => n.id),
      text: visibleNodes.map(n => n.label),
      textposition: 'top center' as const,
      textfont: {
        color: visibleNodes.map(n => {
          if (hasSearch) {
            return matchedIds.has(n.id) ? textMain : (isDarkMode ? '#383848' : '#c5ccd6');
          }
          return textMain;
        }),
        size: visibleNodes.map(n => (n.id === 'SK' ? 12 : 10)),
        family: 'Inter, system-ui, sans-serif',
      },
      hovertemplate: visibleNodes.map(n =>
        `<b style="color:${n.color}">${n.label.replace(/\n/g, ' ')}</b><br>` +
        `<span style="color:#888;font-size:10px">${n.category}</span><br><br>` +
        `${n.desc}<br>` +
        (n.tags ? `<br><i>${n.tags.join(' · ')}</i>` : '') +
        '<extra></extra>'
      ),
      marker: {
        size: visibleNodes.map(n => {
          const base = n.size;
          if (hasSearch) return matchedIds.has(n.id) ? base * 1.25 : base * 0.65;
          return selectedNodeId === n.id ? base * 1.15 : base;
        }),
        color: visibleNodes.map(n => {
          if (hasSearch && !matchedIds.has(n.id)) return isDarkMode ? '#1e1e2a' : '#e5e7eb';
          return n.color;
        }),
        opacity: visibleNodes.map(n => {
          if (hasSearch) return matchedIds.has(n.id) ? 1.0 : 0.25;
          return selectedNodeId === n.id ? 1.0 : 0.9;
        }),
        line: {
          color: visibleNodes.map(n =>
            selectedNodeId === n.id ? '#FFFFFF' :
              hasSearch && matchedIds.has(n.id) ? '#FFFFFF' : 'rgba(255,255,255,0.3)'
          ),
          width: visibleNodes.map(n => (selectedNodeId === n.id || (hasSearch && matchedIds.has(n.id))) ? 2.5 : 1),
        },
      },
      showlegend: false,
    };
  }, [visibleNodes, hasSearch, matchedIds, selectedNodeId, textMain, isDarkMode]);

  // Handle plotly click
  const handlePlotClick = useCallback((event: { points: Array<{ customdata?: string }> }) => {
    const pt = event.points?.[0];
    if (!pt?.customdata) { setSelectedNodeId(null); return; }
    const id = pt.customdata as string;
    setSelectedNodeId(prev => prev === id ? null : id);
  }, []);

  return (
    <div
      className="w-full h-full flex overflow-hidden"
      style={{ background: bgCanvas }}
    >
      {/* ── Left: Graph + Header ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden p-3 gap-2">

        {/* ── Minimalist Header Bar ── */}
        <div
          className={`shrink-0 px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-x-4 gap-y-2 ${glassBase}`}
        >
          {/* Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-500/15 flex items-center justify-center">
              <ShieldAlert size={17} className="text-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight" style={{ color: textMain }}>
                  Suresh Kumar
                </span>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/25">
                  FIR KRP/2026/0456
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/25">
                  CRITICAL RISK
                </span>
              </div>
              <p className="text-[10px] font-mono mt-0.5" style={{ color: textSub }}>
                Criminal Intelligence Network · {visibleNodes.length - 1} connected entities active
              </p>
            </div>
          </div>

          {/* Active Status Badge */}
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1.5"
              style={{
                background: activeFilters.size === ALL_CATEGORIES.length ? '#10B98115' : '#F59E0B15',
                borderColor: activeFilters.size === ALL_CATEGORIES.length ? '#10B98140' : '#F59E0B40',
                color: activeFilters.size === ALL_CATEGORIES.length ? '#10B981' : '#F59E0B',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: activeFilters.size === ALL_CATEGORIES.length ? '#10B981' : '#F59E0B' }} />
              {activeFilters.size}/{ALL_CATEGORIES.length} Categories Visible
            </span>
          </div>
        </div>

        {/* ── Plotly Network Graph ── */}
        <div
          className="flex-1 rounded-2xl overflow-hidden relative border"
          style={{ borderColor: borderCol, background: bgCard }}
        >
          <Plot
            data={[...edgeTraces, nodeTrace]}
            layout={{
              autosize: true,
              margin: { l: 20, r: 20, b: 30, t: 30 },
              plot_bgcolor: bgCard,
              paper_bgcolor: bgCard,
              font: { color: textMain, family: 'Inter, system-ui, sans-serif', size: 10 },
              xaxis: {
                showgrid: false, zeroline: false, showticklabels: false,
                range: [-6.5, 6.5],
              },
              yaxis: {
                showgrid: false, zeroline: false, showticklabels: false,
                range: [-6.5, 6.5],
                scaleanchor: 'x',
              },
              hovermode: 'closest' as const,
              hoverlabel: {
                bgcolor: isDarkMode ? '#1a1a28' : '#ffffff',
                bordercolor: isDarkMode ? '#333348' : '#e2e8f0',
                font: { color: textMain, size: 11, family: 'Inter, system-ui, sans-serif' },
                align: 'left' as const,
              },
              dragmode: 'pan' as const,
            }}
            style={{ width: '100%', height: '100%' }}
            config={{
              responsive: true,
              displayModeBar: true,
              modeBarButtonsToRemove: ['select2d', 'lasso2d', 'autoScale2d'],
              displaylogo: false,
              toImageButtonOptions: {
                format: 'png',
                filename: 'suresh_kumar_intel_network',
                scale: 2,
              },
            }}
            onClick={handlePlotClick}
          />

          {/* Search result hint */}
          {hasSearch && (
            <div
              className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold border shadow-lg"
              style={{ background: bgCard, borderColor: borderCol, color: textMain }}
            >
              🔍 {matchedIds.size} match{matchedIds.size !== 1 ? 'es' : ''} for &quot;{searchQuery}&quot;
            </div>
          )}

          {/* Click-to-select hint when no node selected */}
          {!selectedNode && !hasSearch && (
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] font-mono border pointer-events-none"
              style={{ background: bgCanvas, borderColor: borderCol, color: textSub }}
            >
              Click any node for details
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Detail + Stats Panel ──────────────────────────────── */}
      <div
        className="w-[300px] shrink-0 flex flex-col gap-2 p-3 overflow-y-auto border-l"
        style={{ borderColor: borderCol, background: isDarkMode ? '#0E0E15' : '#F8FAFC' }}
      >

        {/* ── Node Detail Card (shows on click) ── */}
        {selectedNode ? (
          <div
            className="shrink-0 rounded-2xl p-3 border relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${selectedNode.color}12 0%, ${bgCard} 60%)`,
              borderColor: `${selectedNode.color}55`,
            }}
          >
            {/* Glow accent */}
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20"
              style={{ background: selectedNode.color, transform: 'translate(30%, -30%)' }}
            />

            <div className="flex items-start justify-between gap-2 mb-2 relative z-10">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${selectedNode.color}25`, color: selectedNode.color }}
                >
                  {CATEGORY_CONFIG[selectedNode.category].icon}
                </div>
                <div>
                  <div className="text-[11px] font-black tracking-wide" style={{ color: selectedNode.color }}>
                    {CATEGORY_CONFIG[selectedNode.category].label.toUpperCase()}
                  </div>
                  <div className="text-sm font-black leading-snug" style={{ color: textMain }}>
                    {selectedNode.label.replace(/\n/g, ' ')}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="p-1 rounded-lg transition-colors hover:bg-red-500/10"
                style={{ color: textSub }}
              >
                <X size={12} />
              </button>
            </div>

            <p className="text-[11px] leading-relaxed mb-2 relative z-10" style={{ color: isDarkMode ? '#C4C8D4' : '#374151' }}>
              {selectedNode.desc}
            </p>

            {selectedNode.tags && (
              <div className="flex flex-wrap gap-1 relative z-10">
                {selectedNode.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md border"
                    style={{
                      background: `${selectedNode.color}15`,
                      borderColor: `${selectedNode.color}35`,
                      color: selectedNode.color,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Connected edge type */}
            <div
              className="mt-2.5 pt-2 flex items-center gap-1.5 relative z-10 border-t"
              style={{ borderColor: borderCol }}
            >
              <div
                className="flex-1 h-0.5 rounded"
                style={{
                  background: `linear-gradient(90deg, ${selectedNode.color}, transparent)`,
                  height: `${CATEGORY_CONFIG[selectedNode.category].edgeWidth}px`,
                  borderStyle: CATEGORY_CONFIG[selectedNode.category].edgeDash === 'solid' ? 'solid' : 'dashed',
                }}
              />
              <span className="text-[10px] font-mono font-medium" style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
                → Suresh Kumar
              </span>
            </div>
          </div>
        ) : (
          /* Placeholder when nothing selected */
          <div
            className="shrink-0 rounded-2xl p-3 border flex flex-col items-center justify-center gap-2 text-center"
            style={{ borderColor: borderCol, borderStyle: 'dashed', background: bgCardAlt, minHeight: 90 }}
          >
            <Filter size={14} style={{ color: textSub }} />
            <p className="text-xs font-medium" style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
              Click a node on the graph<br />to view its details here
            </p>
          </div>
        )}

        {/* ── Financial Breakdown ── */}
        <div
          className="shrink-0 rounded-2xl border p-3"
          style={{ background: bgCard, borderColor: borderCol }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
              Financial Impact
            </span>
            <DollarSign size={13} className="text-orange-400" />
          </div>
          <div className="grid grid-cols-2 gap-1.5 mb-2.5">
            <div className="rounded-xl border p-2.5" style={{ borderColor: borderCol, background: bgCardAlt }}>
              <div className="text-[11px] font-medium mb-0.5" style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>Stolen Loot</div>
              <div className="text-base font-black text-blue-400">₹36.3L</div>
            </div>
            <div className="rounded-xl border p-2.5" style={{ borderColor: borderCol, background: bgCardAlt }}>
              <div className="text-[11px] font-medium mb-0.5" style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>Property Damage</div>
              <div className="text-base font-black text-pink-400">₹2.8L</div>
            </div>
          </div>
          {/* Mini bar chart */}
          <div className="h-[140px] w-full rounded-xl overflow-hidden" style={{ background: bgCardAlt }}>
            <Plot
              data={[{
                y: MONETARY_ITEMS.map(m => m.item),
                x: MONETARY_ITEMS.map(m => m.amount),
                type: 'bar' as const,
                orientation: 'h' as const,
                marker: {
                  color: MONETARY_ITEMS.map(m => m.color),
                  opacity: 0.88,
                  line: { color: 'transparent', width: 0 },
                },
                text: MONETARY_ITEMS.map(m => `₹${(m.amount / 1000).toFixed(0)}K`),
                textposition: 'auto' as const,
                textfont: { size: 8, color: '#fff' },
                hoverinfo: 'y+x' as const,
              }]}
              layout={{
                autosize: true,
                margin: { l: 95, r: 12, b: 10, t: 8 },
                plot_bgcolor: bgCardAlt,
                paper_bgcolor: bgCardAlt,
                font: { color: textMain, size: 10 },
                xaxis: { showgrid: false, zeroline: false, showticklabels: false },
                yaxis: { automargin: false, tickfont: { size: 10, color: isDarkMode ? '#C4C8D4' : '#374151' } },
              }}
              style={{ width: '100%', height: '100%' }}
              config={{ responsive: true, displayModeBar: false }}
            />
          </div>
        </div>

        {/* ── Confiscated Evidence List ── */}
        <div
          className="shrink-0 rounded-2xl border p-3"
          style={{ background: bgCard, borderColor: borderCol }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
              5 Seizures Confiscated
            </span>
            <Package size={13} className="text-blue-400" />
          </div>
          <ul className="flex flex-col gap-1.5">
            {[
              { label: 'AFIS Print #01', sub: '94.2% biometric match (court admitted)' },
              { label: 'CCTV_01.mp4', sub: 'Vehicle KA03MN4481 at 02:17 hrs' },
              { label: 'Stolen Gold 420g', sub: '₹31.5L recovered from hideout' },
              { label: 'Cash Loot', sub: '₹4.8L traceable notes seized' },
              { label: 'Hydraulic Cutter', sub: 'Lab-confirmed tool marks on safe' },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className="shrink-0 mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black text-white"
                  style={{ background: '#3B82F6' }}
                >
                  {i + 1}
                </span>
                <div>
                  <div className="text-[12px] font-bold" style={{ color: textMain }}>{item.label}</div>
                  <div className="text-[11px]" style={{ color: isDarkMode ? '#C4C8D4' : '#4B5563' }}>{item.sub}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Damage & Witnesses ── */}
        <div
          className="shrink-0 rounded-2xl border p-3"
          style={{ background: bgCard, borderColor: borderCol }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-pink-400">
              Damages &amp; Witnesses
            </span>
            <AlertTriangle size={13} className="text-pink-400" />
          </div>

          <div
            className="rounded-xl p-2 mb-2 border"
            style={{ background: bgCardAlt, borderColor: `#EC4899${'28'}` }}
          >
            <div className="text-[11px] font-bold text-pink-400 mb-1.5">Property Damage (₹2,80,000 total)</div>
            <div className="flex flex-col gap-1">
              {['Vault door pried open — ₹1,50,000', 'Security gate rammed — ₹85,000', 'CCTV junction cut — ₹45,000'].map((d, i) => (
                <div key={i} className="text-[11px] flex items-center gap-1.5" style={{ color: isDarkMode ? '#C4C8D4' : '#4B5563' }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-pink-500" />
                  {d}
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-xl p-2 border"
            style={{ background: bgCardAlt, borderColor: `#10B981${'28'}` }}
          >
            <div className="text-[11px] font-bold text-emerald-400 mb-1.5">Witness Statements (3)</div>
            <div className="flex flex-col gap-1">
              {['Harish K. — Sec 161 CrPC timeline', 'Mohan Lal — Eyewitness + TI Parade', 'Dr. V. Rao — FSL fingerprint expert'].map((w, i) => (
                <div key={i} className="text-[11px] flex items-center gap-1.5" style={{ color: isDarkMode ? '#C4C8D4' : '#4B5563' }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-emerald-500" />
                  {w}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
