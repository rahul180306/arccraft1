'use client';

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  ShieldAlert, Package, Users, MapPin, AlertTriangle,
  DollarSign, X, Filter, Eye
} from 'lucide-react';
import { useInvestigationStore } from '@/lib/stores/investigationStore';
import { type KSPCase } from '@/lib/data/realCases';

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
  activeCase?: KSPCase | null;
  /** Called whenever the node set changes so parent can sync FilterPanel badge counts */
  onCategoryCountsChange?: (counts: Partial<Record<Category, number>>) => void;
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

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG).filter(c => c !== 'Culprit') as Category[];

// Helper to construct dynamic node graph from KSP Case
function buildDynamicNodes(activeCase: KSPCase | null, focalPersonId?: string | null) {
  if (!activeCase) {
    // Default fallback case
    const defaultNodes: CulpritNode[] = [
      {
        id: 'SK', label: 'Suresh Kumar\n(Main Culprit)', category: 'Culprit',
        x: 0, y: 0, size: 52, color: '#EF4444',
        desc: 'Prime Accused — FIR KRP/2026/0456. Recidivist with prior FIRs.',
        tags: ['Gang Leader', 'Burglary', 'Recidivist'],
      },
      {
        id: 'VIC1', label: 'Anekal Resident\nFamily', category: 'Affected Victim',
        x: -3.0, y: 3.6, size: 28, color: '#F59E0B',
        desc: 'Primary Burglary Victim. Total stolen assets: ₹36.3L.',
        tags: ['Primary Victim', '₹36.3L Lost'],
      },
      {
        id: 'EVD1', label: 'AFIS Print #01\n(94.2% Match)', category: 'Confiscated Evidence',
        x: 4.6, y: 1.8, size: 28, color: '#3B82F6',
        desc: 'Biometric latent fingerprint lifted from vault door.',
        tags: ['Biometric', 'Court Admissible'],
      },
      {
        id: 'LOC1', label: 'Plot #42 Anekal\nCrime Scene', category: 'Crime Location',
        x: -5.2, y: -0.2, size: 30, color: '#8B5CF6',
        desc: 'Primary crime site. GPS: 12.7109°N, 77.6938°E.',
        tags: ['SOC', 'Anekal'],
      },
    ];

    return {
      nodes: defaultNodes,
      headerTitle: 'Suresh Kumar',
      headerSub: 'FIR KRP/2026/0456 · 4 connected entities',
      monetaryItems: [
        { item: 'Stolen Gold', amount: 3150000, color: '#3B82F6' },
        { item: 'Seized Cash', amount: 480000, color: '#60A5FA' },
        { item: 'Vault Damage', amount: 150000, color: '#EC4899' },
      ],
      seizures: [
        { label: 'AFIS Print #01', sub: '94.2% biometric match' },
        { label: 'CCTV_01.mp4', sub: 'Vehicle footage' },
      ],
      damages: ['Vault door damaged', 'Security gate rammed'],
      witnesses: ['Harish K. — Timeline Witness', 'Dr. V. Rao — FSL Expert'],
    };
  }

  const primaryAccusedName = activeCase.accused[0]?.name || activeCase.complainant || 'Unidentified Suspect';
  const focalName = focalPersonId || primaryAccusedName;

  const centerNode: CulpritNode = {
    id: 'SK',
    label: `${focalName}\n(${activeCase.crimeNo.slice(-6)})`,
    category: 'Culprit',
    x: 0, y: 0, size: 52, color: '#EF4444',
    desc: `Focus Entity — FIR ${activeCase.crimeNo} (${activeCase.crimeSubHead}). Police Station: ${activeCase.policeStation}. Status: ${activeCase.caseStatus}. Arrested: ${activeCase.hasArrest ? 'Yes (' + activeCase.arrestDate + ')' : 'No'}. IO: ${activeCase.ioName}.`,
    tags: [activeCase.crimeHead, activeCase.gravity, activeCase.caseStatus],
  };

  const nodes: CulpritNode[] = [centerNode];

  // Co-accused nodes
  activeCase.accused.forEach((acc, i) => {
    if (acc.name === focalName && i === 0) return;
    const angle = (i * 1.3) + 0.4;
    const radius = 3.6;
    nodes.push({
      id: `ACC_${i}`,
      label: `${acc.name}\n(Accused)`,
      category: 'Culprit',
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      size: 28, color: '#F43F5E',
      desc: `Accused in FIR ${activeCase.crimeNo}. Age: ${acc.age}, Gender: ${acc.gender}. Person ID: ${acc.personId}.`,
      tags: ['Accused', acc.gender, `Age ${acc.age}`],
    });
  });

  // Victims
  activeCase.victims.forEach((vic, i) => {
    const angle = (i * 1.4) + 2.2;
    const radius = 4.2;
    nodes.push({
      id: `VIC_${i}`,
      label: `${vic.name}\n(Victim)`,
      category: 'Affected Victim',
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      size: 26, color: '#F59E0B',
      desc: `Victim in FIR ${activeCase.crimeNo}. Age: ${vic.age}, Gender: ${vic.gender}.`,
      tags: ['Victim', vic.gender],
    });
  });

  // Complainant
  if (activeCase.complainant && activeCase.complainant !== 'Unknown') {
    nodes.push({
      id: 'COMP_1',
      label: `${activeCase.complainant}\n(Complainant)`,
      category: 'Affected Victim',
      x: -3.4, y: 3.8, size: 24, color: '#F59E0B',
      desc: `Complainant who reported FIR ${activeCase.crimeNo} at ${activeCase.policeStation}.`,
      tags: ['Complainant', 'Sec 154 CrPC'],
    });
  }

  // Evidence & Legal Sections
  if (activeCase.sections && activeCase.sections.length > 0) {
    activeCase.sections.slice(0, 4).forEach((sec, i) => {
      nodes.push({
        id: `SEC_${i}`,
        label: sec.length > 18 ? `${sec.slice(0, 16)}...` : sec,
        category: 'Confiscated Evidence',
        x: 4.8, y: (i * 1.8) - 2.2, size: 24, color: '#3B82F6',
        desc: `Legal section charged in FIR ${activeCase.crimeNo}: ${sec}.`,
        tags: ['Legal Charge', activeCase.category],
      });
    });
  } else {
    nodes.push({
      id: 'EVD_FIR',
      label: `FIR File\n#${activeCase.crimeNo.slice(-6)}`,
      category: 'Confiscated Evidence',
      x: 4.6, y: 1.8, size: 26, color: '#3B82F6',
      desc: `Documentary evidence for FIR ${activeCase.crimeNo}.`,
      tags: ['FIR File', activeCase.caseStatus],
    });
  }

  // Seizures / Arrest
  if (activeCase.hasArrest) {
    nodes.push({
      id: 'ARR_1',
      label: `Arrest Record\n(${activeCase.arrestDate})`,
      category: 'Confiscated Evidence',
      x: 3.8, y: -4.2, size: 24, color: '#3B82F6',
      desc: `Custody Arrest recorded on ${activeCase.arrestDate} by IO ${activeCase.ioName}.`,
      tags: ['Arrest Memo', 'In Custody'],
    });
  }

  // Locations — positioned to avoid label clipping at edges
  nodes.push({
    id: 'LOC_PS',
    label: `${activeCase.policeStation}\n(${activeCase.district})`,
    category: 'Crime Location',
    x: -3.8, y: -3.8, size: 30, color: '#8B5CF6',
    desc: `Jurisdictional Police Station: ${activeCase.policeStation}, ${activeCase.district}. GPS: ${activeCase.lat.toFixed(4)}°N, ${activeCase.lng.toFixed(4)}°E.`,
    tags: ['Police Station', activeCase.district],
  });

  // Witness Statement nodes — IO Officer always first
  nodes.push({
    id: 'IO_1',
    label: `${activeCase.ioName}\n(Investigating Officer)`,
    category: 'Witness Statement',
    x: 1.4, y: 4.8, size: 24, color: '#10B981',
    desc: `Investigating Officer (KGID: ${activeCase.ioKgid}) leading investigation at ${activeCase.policeStation}.`,
    tags: ['IO Officer', activeCase.ioKgid],
  });

  // Complainant as second witness node
  if (activeCase.complainant && activeCase.complainant !== 'Unknown') {
    nodes.push({
      id: 'WIT_COMP',
      label: `${activeCase.complainant}\n(Complainant Witness)`,
      category: 'Witness Statement',
      x: -1.2, y: 4.6, size: 22, color: '#10B981',
      desc: `Complainant witness for FIR ${activeCase.crimeNo}. Filed report at ${activeCase.policeStation}.`,
      tags: ['Complainant', 'Eye Witness'],
    });
  }

  // Victim witnesses
  activeCase.victims.forEach((vic, i) => {
    nodes.push({
      id: `WIT_VIC_${i}`,
      label: `${vic.name}\n(Victim Witness)`,
      category: 'Witness Statement',
      x: Math.cos((i * 1.2) + 1.8) * 4.0,
      y: Math.sin((i * 1.2) + 1.8) * 4.0 + 3.2,
      size: 20, color: '#10B981',
      desc: `Victim witness — ${vic.name}, Age: ${vic.age}, Gender: ${vic.gender}. FIR ${activeCase.crimeNo}.`,
      tags: ['Victim Witness', vic.gender],
    });
  });

  // Property Damage nodes — count matches FilterPanel badge
  const damageCount = activeCase.gravity === 'Heinous' ? 2 : 1;
  const damageLabels = [
    `Structural Damage\n(${activeCase.crimeSubHead})`,
    `Asset Loss\n(${activeCase.crimeHead})`,
  ];
  const damageDescs = [
    `Physical structural damage reported under FIR ${activeCase.crimeNo} — ${activeCase.crimeSubHead} at ${activeCase.policeStation}.`,
    `Financial/asset damage under ${activeCase.crimeHead}. Gravity: ${activeCase.gravity}. District: ${activeCase.district}.`,
  ];
  for (let d = 0; d < damageCount; d++) {
    const angle = (d * 1.4) - 0.8;
    nodes.push({
      id: `DMG_${d}`,
      label: damageLabels[d] || `Damage #${d + 1}\n(${activeCase.gravity})`,
      category: 'Property Damage',
      x: Math.cos(angle) * 4.2 - 1.5,
      y: Math.sin(angle) * 3.0 - 3.5,
      size: 24, color: '#EC4899',
      desc: damageDescs[d] || `Property damage #${d + 1} recorded in FIR ${activeCase.crimeNo}.`,
      tags: ['Property Damage', activeCase.gravity, activeCase.district],
    });
  }

  const isProperty = activeCase.crimeHead.toLowerCase().includes('property');
  const isCyber = activeCase.crimeHead.toLowerCase().includes('cyber') || activeCase.crimeHead.toLowerCase().includes('economic');
  const stolenVal = isProperty ? 3630000 : isCyber ? 1850000 : 450000;
  const damageVal = activeCase.gravity === 'Heinous' ? 280000 : 75000;

  const monetaryItems = [
    { item: 'Stolen / Fraud Assets', amount: stolenVal, color: '#3B82F6' },
    { item: 'Recovered Seizures', amount: Math.round(stolenVal * 0.75), color: '#60A5FA' },
    { item: 'Property Damage', amount: damageVal, color: '#EC4899' },
  ];

  const seizures = [
    { label: `FIR #${activeCase.crimeNo.slice(-8)} Registered`, sub: `Date: ${activeCase.registrationDate} at ${activeCase.policeStation}` },
    { label: `Arrest Memo (${activeCase.hasArrest ? activeCase.arrestDate : 'No Arrest Recorded'})`, sub: `Investigating Officer: ${activeCase.ioName}` },
    ...(activeCase.sections.slice(0, 3).map(s => ({ label: s, sub: `Charged under ${activeCase.crimeHead}` }))),
  ];

  const damages = [
    `Structural Damage — ${activeCase.crimeSubHead} at ${activeCase.policeStation}, ${activeCase.district}`,
    ...(damageCount >= 2
      ? [`Asset Loss — ${activeCase.crimeHead} (${activeCase.gravity}) · District: ${activeCase.district}`]
      : []),
    `Case Status: ${activeCase.caseStatus}`,
  ];

  const witnesses = [
    `IO ${activeCase.ioName} (${activeCase.ioKgid}) — Investigating Officer at ${activeCase.policeStation}`,
    ...(activeCase.complainant && activeCase.complainant !== 'Unknown'
      ? [`Complainant: ${activeCase.complainant} — Filed FIR ${activeCase.crimeNo}`]
      : []),
    ...(activeCase.victims.map(v => `Victim Witness: ${v.name} (${v.age}y, ${v.gender}) · ${activeCase.policeStation}`)),
  ];

  return {
    nodes,
    headerTitle: focalName,
    headerSub: `FIR ${activeCase.crimeNo} · ${activeCase.policeStation} · ${nodes.length - 1} connected entities`,
    monetaryItems,
    seizures,
    damages,
    witnesses,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PlotlyCulpritAnalytics({
  isDarkMode,
  searchQuery = '',
  activeFilters: propActiveFilters,
  onToggleFilter: propToggleFilter,
  activeCase: propActiveCase,
  onCategoryCountsChange,
}: PlotlyCulpritAnalyticsProps) {

  // Read activeCase from store if not explicitly passed
  const storeActiveCase = useInvestigationStore(s => s.activeCase);
  const activeCase = propActiveCase !== undefined ? propActiveCase : storeActiveCase;

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [focalPersonName, setFocalPersonName] = useState<string | null>(null);
  const [internalActiveFilters, setInternalActiveFilters] = useState<Set<Category>>(new Set(ALL_CATEGORIES));

  // ── Reset focal person & selected node whenever the active case changes ──
  // Without this, clicking a node in case A would keep that person as center
  // node when switching to case B, overriding the new case's accused name.
  const activeCaseId = activeCase?.caseId ?? null;
  React.useEffect(() => {
    setFocalPersonName(null);
    setSelectedNodeId(null);
  }, [activeCaseId]);

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

  // Dynamically compute dataset nodes & metrics when activeCase or focalPersonName changes
  const dynamicData = useMemo(() => {
    return buildDynamicNodes(activeCase, focalPersonName);
  }, [activeCase, focalPersonName]);

  const allNodes = dynamicData.nodes;

  // Compute exact category counts from actual node array and notify parent
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<Category, number>> = {};
    for (const node of allNodes) {
      if (node.id === 'SK') continue; // skip center culprit node
      counts[node.category] = (counts[node.category] ?? 0) + 1;
    }
    return counts;
  }, [allNodes]);

  // Sync counts to parent whenever they change
  React.useEffect(() => {
    onCategoryCountsChange?.(categoryCounts);
  }, [categoryCounts, onCategoryCountsChange]);

  // Filtered nodes (always keep center node)
  const visibleNodes = useMemo(() =>
    allNodes.filter(n => n.id === 'SK' || activeFilters.has(n.category)).filter(n => n.size > 0),
    [allNodes, activeFilters]
  );

  // Matched node IDs from search
  const matchedIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>();
    const q = searchQuery.toLowerCase();
    return new Set(
      allNodes
        .filter(n => n.label.toLowerCase().includes(q) || n.desc.toLowerCase().includes(q) || n.category.toLowerCase().includes(q))
        .map(n => n.id)
    );
  }, [allNodes, searchQuery]);

  const hasSearch = matchedIds.size > 0;

  // Selected node detail
  const selectedNode = useMemo(() =>
    selectedNodeId ? allNodes.find(n => n.id === selectedNodeId) ?? null : null,
    [allNodes, selectedNodeId]
  );

  // Edges: one trace per visible non-culprit node with category styling
  const edgeTraces = useMemo(() =>
    visibleNodes
      .filter(n => n.id !== 'SK')
      .map(target => {
        const cfg = CATEGORY_CONFIG[target.category] || CATEGORY_CONFIG['Culprit'];
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

    // If node is a person, set focal person
    const clickedNode = allNodes.find(n => n.id === id);
    if (clickedNode && (clickedNode.category === 'Culprit' || clickedNode.category === 'Affected Victim')) {
      const cleanName = clickedNode.label.split('\n')[0];
      setFocalPersonName(cleanName);
    }
  }, [allNodes]);

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
                  {dynamicData.headerTitle}
                </span>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/25">
                  FIR {activeCase ? activeCase.crimeNo.slice(-8) : 'N/A'}
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/25 uppercase">
                  {activeCase ? activeCase.gravity : 'CRITICAL RISK'}
                </span>
              </div>
              <p className="text-[10px] font-mono mt-0.5" style={{ color: textSub }}>
                {dynamicData.headerSub}
              </p>
            </div>
          </div>

          {/* Active Status Badge */}
          <div className="flex items-center gap-2">
            {focalPersonName && (
              <button
                onClick={() => setFocalPersonName(null)}
                className="text-[10px] font-mono px-2 py-1 rounded-xl bg-gray-800 text-gray-300 hover:text-white border border-gray-700 transition-colors"
              >
                Reset Focus
              </button>
            )}
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
                range: [-7.2, 7.2],
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
                filename: 'ksp_intel_network',
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
              Click any person or node on the graph to focus details
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
                  {(CATEGORY_CONFIG[selectedNode.category] || CATEGORY_CONFIG['Culprit']).icon}
                </div>
                <div>
                  <div className="text-[11px] font-black tracking-wide" style={{ color: selectedNode.color }}>
                    {(CATEGORY_CONFIG[selectedNode.category] || CATEGORY_CONFIG['Culprit']).label.toUpperCase()}
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
                  height: `${(CATEGORY_CONFIG[selectedNode.category] || CATEGORY_CONFIG['Culprit']).edgeWidth}px`,
                  borderStyle: (CATEGORY_CONFIG[selectedNode.category] || CATEGORY_CONFIG['Culprit']).edgeDash === 'solid' ? 'solid' : 'dashed',
                }}
              />
              <span className="text-[10px] font-mono font-medium" style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
                → {dynamicData.headerTitle}
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
              Click any node on the graph<br />to view its details here
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
              Financial &amp; Case Impact
            </span>
            <DollarSign size={13} className="text-orange-400" />
          </div>
          <div className="grid grid-cols-2 gap-1.5 mb-2.5">
            <div className="rounded-xl border p-2.5" style={{ borderColor: borderCol, background: bgCardAlt }}>
              <div className="text-[11px] font-medium mb-0.5" style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>Stolen / Loss</div>
              <div className="text-base font-black text-blue-400">₹{(dynamicData.monetaryItems[0].amount / 100000).toFixed(1)}L</div>
            </div>
            <div className="rounded-xl border p-2.5" style={{ borderColor: borderCol, background: bgCardAlt }}>
              <div className="text-[11px] font-medium mb-0.5" style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>Property Damage</div>
              <div className="text-base font-black text-pink-400">₹{(dynamicData.monetaryItems[2].amount / 100000).toFixed(1)}L</div>
            </div>
          </div>
          {/* Mini bar chart */}
          <div className="h-[140px] w-full rounded-xl overflow-hidden" style={{ background: bgCardAlt }}>
            <Plot
              data={[{
                y: dynamicData.monetaryItems.map(m => m.item),
                x: dynamicData.monetaryItems.map(m => m.amount),
                type: 'bar' as const,
                orientation: 'h' as const,
                marker: {
                  color: dynamicData.monetaryItems.map(m => m.color),
                  opacity: 0.88,
                  line: { color: 'transparent', width: 0 },
                },
                text: dynamicData.monetaryItems.map(m => `₹${(m.amount / 1000).toFixed(0)}K`),
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

        {/* ── Case Seizures & Records List ── */}
        <div
          className="shrink-0 rounded-2xl border p-3"
          style={{ background: bgCard, borderColor: borderCol }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
              Case Evidence &amp; Records
            </span>
            <Package size={13} className="text-blue-400" />
          </div>
          <ul className="flex flex-col gap-1.5">
            {dynamicData.seizures.map((item, i) => (
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

        {/* ── Case Details & Witnesses ── */}
        <div
          className="shrink-0 rounded-2xl border p-3"
          style={{ background: bgCard, borderColor: borderCol }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-pink-400">
              Case Overview &amp; Key People
            </span>
            <AlertTriangle size={13} className="text-pink-400" />
          </div>

          <div
            className="rounded-xl p-2 mb-2 border"
            style={{ background: bgCardAlt, borderColor: `#EC489928` }}
          >
            <div className="text-[11px] font-bold text-pink-400 mb-1.5">Incident Details</div>
            <div className="flex flex-col gap-1">
              {dynamicData.damages.map((d, i) => (
                <div key={i} className="text-[11px] flex items-center gap-1.5" style={{ color: isDarkMode ? '#C4C8D4' : '#4B5563' }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-pink-500" />
                  {d}
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-xl p-2 border"
            style={{ background: bgCardAlt, borderColor: `#10B98128` }}
          >
            <div className="text-[11px] font-bold text-emerald-400 mb-1.5">Key Personnel &amp; Witnesses ({dynamicData.witnesses.length})</div>
            <div className="flex flex-col gap-1">
              {dynamicData.witnesses.map((w, i) => (
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
