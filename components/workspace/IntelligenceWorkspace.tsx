'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Network, Plus, RefreshCw, Download, Sparkles, ChevronRight,
  AlertCircle, CheckCircle2, Clock, User, Share2, X, Loader2,
  GitBranch, Activity, Shield, Eye
} from 'lucide-react';
import { useUIStore } from '@/lib/stores/uiStore';
import CytoscapeGraph, { CyNode, CyEdge, GraphData, LayoutOption } from './intelligence/CytoscapeGraph';
import EntityPanel from './intelligence/EntityPanel';
import GraphToolbar from './intelligence/GraphToolbar';
import FilterPanel from './intelligence/FilterPanel';
import { useInvestigationStore } from '@/lib/stores/investigationStore';
import { type KSPCase } from '@/lib/data/realCases';

// ─── Seed Graph Data (built from KSP Real Dataset Cases) ──────────────────────
// Uses primary case (Murder) + property crime accused for cross-case network
// Uses primary case + property crime accused for cross-case network
const buildRealGraph = (activeCase: KSPCase, availableCases: KSPCase[]): GraphData => {
  const pc = activeCase; 
  const propCase = availableCases.find(c => c.crimeHead === 'Crimes Against Property') || availableCases[1];
  const cyberCase = availableCases.find(c => c.crimeHead === 'Cyber Crimes') || availableCases[2];

  const nodes: CyNode[] = [
    // Primary accused from murder case
    { id: 'A1', label: pc.accused[0]?.name || 'Accused-1', type: 'person', risk: 'critical', subtitle: `Prime Suspect — ${pc.crimeSubHead}`, isFocal: true,
      details: { Age: `${pc.accused[0]?.age}`, Gender: pc.accused[0]?.gender, CaseFIR: pc.crimeNo, PersonID: pc.accused[0]?.personId,
        notes: `Primary accused in FIR ${pc.crimeNo} (${pc.crimeSubHead}). Arrested ${pc.arrestDate}. IO: ${pc.ioName} (${pc.ioKgid}).` }},
    // Secondary accused
    ...(pc.accused.slice(1, 3).map((a, i) => ({
      id: `A${i+2}`, label: a.name, type: 'person' as const, risk: (i===0 ? 'high' : 'medium') as any, subtitle: `Co-Accused — ${pc.crimeSubHead}`,
      details: { Age: `${a.age}`, Gender: a.gender, CaseFIR: pc.crimeNo, PersonID: a.personId, notes: `Co-accused in FIR ${pc.crimeNo}.` }
    }))),
    // Victim
    { id: 'V1', label: pc.victims[0]?.name || 'Victim', type: 'person', risk: 'medium', subtitle: `Victim — ${pc.crimeSubHead}`,
      details: { Age: `${pc.victims[0]?.age}`, Gender: pc.victims[0]?.gender, CaseFIR: pc.crimeNo,
        notes: `Victim in FIR ${pc.crimeNo}. Complainant: ${pc.complainant}.` }},
    // Location of crime
    { id: 'LOC1', label: pc.policeStation, type: 'location', risk: 'critical', subtitle: 'Scene of Crime / Registering PS',
      details: { District: pc.district, FIR: pc.crimeNo, IncidentDate: pc.incidentDate,
        notes: `Crime registered at ${pc.policeStation}, ${pc.district}. GPS: ${pc.lat.toFixed(4)}, ${pc.lng.toFixed(4)}.` }},
    // Cross-case accused from property crime
    ...(propCase.accused.slice(0, 1).map(a => ({
      id: 'PA1', label: a.name, type: 'person' as const, risk: 'high' as any, subtitle: `Linked FIR ${propCase.crimeNo}`,
      details: { Age: `${a.age}`, Gender: a.gender, CaseFIR: propCase.crimeNo, notes: `Accused in ${propCase.crimeSubHead} (FIR ${propCase.crimeNo}).` }
    }))),
    // Property crime location
    { id: 'LOC2', label: propCase.policeStation, type: 'location', risk: 'high', subtitle: `${propCase.crimeSubHead} Location`,
      details: { District: propCase.district, FIR: propCase.crimeNo, notes: `${propCase.crimeSubHead} registered at ${propCase.policeStation}.` }},
    // Evidence
    { id: 'EVD1', label: `FIR Evidence — ${pc.crimeNo.slice(-6)}`, type: 'evidence', risk: 'critical', subtitle: `${pc.sections.length} Sections Charged`,
      details: { Sections: pc.sections.slice(0,3).join(', '), CaseStatus: pc.caseStatus, HasArrest: pc.hasArrest ? 'Yes' : 'No',
        notes: `Charge sheet status: ${pc.caseStatus}. Arrest: ${pc.arrestDate}.` }},
    // Cyber crime accused cross-link
    ...(cyberCase.accused.slice(0,1).map(a => ({
      id: 'CA1', label: a.name, type: 'person' as const, risk: 'medium' as any, subtitle: `Cyber FIR ${cyberCase.crimeNo}`,
      details: { Age: `${a.age}`, Gender: a.gender, CaseFIR: cyberCase.crimeNo, notes: `Accused in IT Act ${cyberCase.crimeSubHead}.` }
    }))),
    // IO / Officer
    { id: 'IO1', label: pc.ioName, type: 'person', risk: 'low', subtitle: `Investigating Officer (${pc.ioKgid})`,
      details: { KGID: pc.ioKgid, PoliceStation: pc.policeStation, notes: `IO assigned to FIR ${pc.crimeNo}.` }},
  ];

  const edges: CyEdge[] = [
    { id: 'e1', source: 'A1', target: 'V1', label: 'Accused Of', isHighRisk: true, weight: 3 },
    { id: 'e2', source: 'A1', target: 'A2', label: 'Co-Accused', isHighRisk: true, weight: 3 },
    { id: 'e3', source: 'A1', target: 'LOC1', label: 'Incident At', isHighRisk: true, weight: 3 },
    { id: 'e4', source: 'A1', target: 'EVD1', label: 'Evidence', isHighRisk: true, weight: 3 },
    { id: 'e5', source: 'A2', target: 'LOC1', label: 'Present At', weight: 2 },
    { id: 'e6', source: 'A1', target: 'PA1', label: 'Known Associate', isHighRisk: true, weight: 2 },
    { id: 'e7', source: 'PA1', target: 'LOC2', label: 'Linked Case', weight: 2 },
    { id: 'e8', source: 'LOC1', target: 'LOC2', label: `${Math.round(Math.abs(pc.lat - propCase.lat) * 111)} km`, weight: 1 },
    { id: 'e9', source: 'IO1', target: 'EVD1', label: 'Handling', weight: 2 },
    { id: 'e10', source: 'CA1', target: 'PA1', label: 'Suspected Link', weight: 1 },
    ...(pc.accused[2] ? [{ id: 'e11', source: 'A3', target: 'LOC1', label: 'Co-Accused', weight: 2 } as CyEdge] : []),
  ];

  return { nodes, edges };
};

// We remove SEED_GRAPH from global scope so it can be built inside the component


// ─── AI Suggestions (real cross-case patterns from 1,079 FIRs) ───────────────
// ─── AI Suggestions ───────────────
const getAiSuggestions = (activeCase: KSPCase, availableCases: KSPCase[]) => [
  { id: 's1', confidence: 97, text: `Cross-FIR analysis: ${activeCase.accused[0]?.name} (${activeCase.crimeNo}) has accused profile match with ${availableCases[2]?.accused[0]?.name} in Property Crimes.` },
  { id: 's2', confidence: 85, text: `${availableCases.find(c=>c.crimeHead==='Crimes Against Women')?.accused[0]?.name} linked to Crimes Against Women FIR in same district — check for serial pattern.`, action: 'Expand Network' },
  { id: 's3', confidence: 78, text: `477 Pending Trial cases flagged for urgent chargesheet review. 10 cases Under Investigation require IO escalation.`, action: 'View All Cases' },
];

// ─── Recent Activity — derived dynamically from real case data ───────────────
const getRecentLinks = (activeCase: KSPCase) => [
  { 
    source: activeCase.accused[0]?.name ?? 'Accused', 
    relation: 'ACCUSED IN', 
    target: `FIR ${activeCase.crimeNo.slice(-8)}`, 
    evidence: `${activeCase.crimeSubHead} FIR`, 
    by: activeCase.ioName, 
    time: activeCase.registrationDate 
  },
  ...(activeCase.accused[1] ? [{
    source: activeCase.accused[1].name, 
    relation: 'CO-ACCUSED WITH', 
    target: activeCase.accused[0]?.name ?? 'Accused', 
    evidence: 'Charge_Sheet.pdf', 
    by: activeCase.ioName, 
    time: activeCase.incidentDate 
  }] : []),
  { 
    source: `AFIS-FP-${activeCase.caseId}`, 
    relation: 'EVIDENCE IN', 
    target: activeCase.accused[0]?.name ?? 'Accused', 
    evidence: 'AFIS DB Entry', 
    by: `${activeCase.policeStation} Forensic`, 
    time: activeCase.registrationDate 
  },
];

export default function IntelligenceWorkspace() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const showToast = useUIStore((s) => s.showToast);
  const activeCase = useInvestigationStore(s => s.activeCase)!;
  const availableCases = useInvestigationStore(s => s.cases);

  const cyRef = useRef<any>(null);

  const [graphData, setGraphData] = useState<GraphData>(() => buildRealGraph(activeCase, availableCases));
  
  // Update graph when active case changes
  useEffect(() => {
    setGraphData(buildRealGraph(activeCase, availableCases));
  }, [activeCase, availableCases]);
  const [layout, setLayout] = useState<LayoutOption>('cose');
  const [selectedNode, setSelectedNode] = useState<CyNode | null>(null);
  const [highlightNodeId, setHighlightNodeId] = useState<string | null>(null);
  const [hiddenTypes, setHiddenTypes] = useState<string[]>([]);
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);

  // New Entity form state
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<CyNode['type']>('person');
  const [newRisk, setNewRisk] = useState<CyNode['risk']>('medium');
  const [newRelation, setNewRelation] = useState('CONNECTED TO');
  const [newNotes, setNewNotes] = useState('');

  const containerBg = isDarkMode ? 'bg-[#0E0E10]' : 'bg-gray-100';
  const cardBg = isDarkMode ? 'bg-[#111115] border-gray-800' : 'bg-white border-gray-200';
  const textPrimary = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSub = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  // Apply risk filter to graph data
  const filteredGraphData = React.useMemo(() => {
    if (riskFilter === 'all') return graphData;
    const filteredNodeIds = new Set(graphData.nodes.filter(n => n.risk === riskFilter).map(n => n.id));
    return {
      nodes: graphData.nodes.filter(n => filteredNodeIds.has(n.id)),
      edges: graphData.edges.filter(e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target))
    };
  }, [graphData, riskFilter]);

  const handleNodeClick = useCallback((node: CyNode) => {
    setSelectedNode(node);
  }, []);

  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) { setHighlightNodeId(null); return; }
    const match = graphData.nodes.find(n =>
      n.label.toLowerCase().includes(query.toLowerCase()) ||
      n.id.toLowerCase().includes(query.toLowerCase())
    );
    setHighlightNodeId(match?.id || null);
    if (!match) showToast('No entity found matching that query.');
  }, [graphData.nodes, showToast]);

  const handleAIQuery = useCallback(async (query: string) => {
    setIsAILoading(true);
    showToast(`🧠 AI analyzing: "${query}"`);
    await new Promise(r => setTimeout(r, 1500));

    const lq = query.toLowerCase();

    // Smart filter simulations
    if (lq.includes('vehicle') || lq.includes('car')) {
      setHiddenTypes(['person', 'location', 'evidence', 'organization', 'phone', 'bank', 'event']);
      showToast('✅ Showing only vehicle nodes');
    } else if (lq.includes('person') || lq.includes('suspect') || lq.includes('accused')) {
      setHiddenTypes(['vehicle', 'location', 'evidence', 'organization', 'phone', 'bank', 'event']);
      showToast('✅ Showing only person nodes');
    } else if (lq.includes('evidence') || lq.includes('cctv') || lq.includes('afis')) {
      setHiddenTypes(['person', 'vehicle', 'location', 'organization', 'phone', 'bank', 'event']);
      showToast('✅ Showing only evidence nodes');
    } else if (lq.includes('suresh') || lq.includes('sk')) {
      setHiddenTypes([]);
      setHighlightNodeId('SK');
      showToast('✅ Highlighted Suresh Kumar and connections');
    } else if (lq.includes('all') || lq.includes('reset') || lq.includes('clear')) {
      setHiddenTypes([]);
      setHighlightNodeId(null);
      showToast('✅ Showing all entities');
    } else if (lq.includes('unknown') || lq.includes('expand')) {
      // Simulate adding a new unknown node
      const newNode: CyNode = {
        id: 'UNK01', label: 'Unknown Associate', type: 'person', risk: 'high', subtitle: 'Unidentified (AI Suggested)',
        details: { notes: 'Identified via tower dump analysis near Hoodi Circle at 03:14 AM. Identity unconfirmed.' }
      };
      const newEdge: CyEdge = { id: 'eunk1', source: 'SK', target: 'UNK01', label: 'Linked Via CDR', isHighRisk: true };
      setGraphData(prev => ({
        nodes: prev.nodes.find(n => n.id === 'UNK01') ? prev.nodes : [...prev.nodes, newNode],
        edges: prev.edges.find(e => e.id === 'eunk1') ? prev.edges : [...prev.edges, newEdge]
      }));
      showToast('✅ AI added Unknown Associate node via CDR analysis');
    } else {
      showToast('ℹ️ Try: "show vehicles", "highlight Suresh", "expand unknown", "show all"');
    }

    setIsAILoading(false);
  }, [showToast]);

  const handleExpandNode = useCallback((node: CyNode) => {
    setIsAILoading(true);
    showToast(`🧠 AI expanding network for ${node.label}...`);
    
    setTimeout(() => {
      // Progressive Expansion Simulation
      const newNodes: CyNode[] = [
        { id: `EXP_${Date.now()}_1`, label: `Assoc of ${node.label}`, type: 'person', risk: 'medium', subtitle: 'Discovered Associate' },
        { id: `EXP_${Date.now()}_2`, label: `Vehicle of ${node.label}`, type: 'vehicle', risk: 'high', subtitle: 'Registered Vehicle' }
      ];
      const newEdges: CyEdge[] = newNodes.map((n, i) => ({
        id: `e_EXP_${Date.now()}_${i}`,
        source: node.id,
        target: n.id,
        label: i === 0 ? 'KNOWN ASSOC.' : 'USED VEHICLE',
        isHighRisk: i === 1
      }));
      
      setGraphData(prev => ({
        nodes: [...prev.nodes, ...newNodes],
        edges: [...prev.edges, ...newEdges]
      }));
      setIsAILoading(false);
      showToast(`✅ Expanded network for ${node.label}`);
    }, 1500);
  }, [showToast]);

  const handleToggleType = useCallback((type: string) => {
    setHiddenTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  }, []);

  const handleZoomIn = useCallback(() => { cyRef.current?.zoom(cyRef.current.zoom() * 1.25); }, []);
  const handleZoomOut = useCallback(() => { cyRef.current?.zoom(cyRef.current.zoom() * 0.8); }, []);
  const handleFit = useCallback(() => { cyRef.current?.fit(undefined, 60); }, []);
  const handleExportPNG = useCallback(() => {
    const cy = cyRef.current;
    if (!cy) return;
    const png = cy.png({ output: 'blob', bg: isDarkMode ? '#0E0E10' : '#F1F5F9', full: true, scale: 2 });
    const url = URL.createObjectURL(png);
    const a = document.createElement('a');
    a.href = url; a.download = 'intelligence-graph-KRP2026.png'; a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Graph exported as PNG');
  }, [isDarkMode, showToast]);

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const id = `node-${Date.now()}`;
    const initials = newName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const newNode: CyNode = {
      id, label: newName.trim(), type: newType, risk: newRisk,
      subtitle: newRelation, details: { notes: newNotes || `Added to FIR KRP/2026/0456 by Inspector Arjun.` }
    };
    const newEdge: CyEdge = {
      id: `edge-${Date.now()}`,
      source: selectedNode?.id || 'SK',
      target: id,
      label: newRelation,
      isHighRisk: newRisk === 'critical' || newRisk === 'high'
    };
    setGraphData(prev => ({ nodes: [...prev.nodes, newNode], edges: [...prev.edges, newEdge] }));
    setIsAddNodeOpen(false);
    setNewName(''); setNewNotes('');
    showToast(`✅ Added "${newNode.label}" to the Intelligence Graph`);
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden ${isDarkMode ? 'bg-[#0B0B0F] text-gray-100' : 'bg-gray-100 text-gray-900'}`}>

      {/* ── Page Header ── */}
      <div className={`shrink-0 px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-3 ${isDarkMode ? 'bg-[#111115] border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center shrink-0">
            <Network size={16} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className={`text-sm font-black truncate ${textPrimary}`}>Intelligence Graph</h1>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${isDarkMode ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                Live
              </span>
            </div>
            <p className={`text-[10px] font-mono truncate ${textSub}`}>FIR KRP/2026/0456 · {filteredGraphData.nodes.length} entities · {filteredGraphData.edges.length} links</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isAILoading && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#FF5A1F]">
              <Loader2 size={12} className="animate-spin" />
              <span className="hidden sm:inline">AI Processing...</span>
            </div>
          )}
          <button
            onClick={() => setIsAddNodeOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-black transition-all shadow-sm"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">Add Entity</span>
          </button>
        </div>
      </div>

      {/* ── Main Content: Graph + Sidebars ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: AI Suggestions + Recent Activity (hidden on mobile) ── */}
        <div className={`hidden lg:flex flex-col shrink-0 w-[220px] xl:w-[240px] border-r overflow-y-auto ${isDarkMode ? 'bg-[#111115] border-gray-800' : 'bg-white border-gray-200'}`}>
          
          {/* AI Suggestions */}
          <div className="p-3 border-b" style={{ borderColor: isDarkMode ? '#1F2937' : '#E5E7EB' }}>
            <div className="flex items-center gap-2 mb-2">
              <i className="fi fi-ss-brain-circuit text-xs text-[#FF5A1F] flex items-center"></i>
              <span className={`text-[10px] font-black uppercase tracking-wider ${textSub}`}>AI Suggestions</span>
            </div>
            <div className="flex flex-col gap-2">
              {getAiSuggestions(activeCase, availableCases).map((s) => (
                <motion.div
                  key={s.id}
                  whileHover={{ scale: 1.01 }}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${isDarkMode ? 'bg-[#18181C] border-gray-800 hover:border-[#FF5A1F]/50' : 'bg-orange-50 border-orange-100 hover:border-orange-400'}`}
                  onClick={() => s.action && handleAIQuery(s.action)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-black text-[#FF5A1F] uppercase tracking-wider">
                      {s.confidence}% confidence
                    </span>
                    {s.action && <ChevronRight size={10} className="text-[#FF5A1F]" />}
                  </div>
                  <p className={`text-[10px] font-medium leading-relaxed ${textPrimary}`}>{s.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-3 flex-1">
            <div className={`text-[10px] font-black uppercase tracking-wider mb-2 ${textSub}`}>Recent Links</div>
            <div className="flex flex-col gap-2">
              {getRecentLinks(activeCase).map((link, i) => (
                <div key={i} className={`p-2 rounded-xl border ${isDarkMode ? 'bg-[#18181C] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <div className={`text-[9px] font-bold truncate ${textPrimary}`}>
                    <span className="text-[#FF5A1F]">{link.source}</span>
                    <span className={textSub}> {link.relation} </span>
                    <span className={textPrimary}>{link.target}</span>
                  </div>
                  <div className={`flex items-center justify-between mt-1 text-[9px] font-mono ${textSub}`}>
                    <span>{link.by}</span>
                    <span>{link.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Center: Graph Canvas ── */}
        <div className="flex-1 relative overflow-hidden min-w-0">
          
          {/* Graph Toolbar */}
          <div className="absolute top-0 left-0 right-0 z-10">
            <GraphToolbar
              isDarkMode={isDarkMode}
              currentLayout={layout}
              onLayoutChange={setLayout}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFit={handleFit}
              onExportPNG={handleExportPNG}
              onSearch={handleSearch}
              onAIQuery={handleAIQuery}
              nodeCount={filteredGraphData.nodes.length}
              edgeCount={filteredGraphData.edges.length}
            />
          </div>

          {/* Filter Panel */}
          <div className="absolute left-0 top-[44px] bottom-0 z-10">
            <FilterPanel
              isDarkMode={isDarkMode}
              hiddenTypes={hiddenTypes}
              onToggleType={handleToggleType}
              riskFilter={riskFilter}
              onRiskFilter={setRiskFilter}
            />
          </div>

          {/* Cytoscape Graph */}
          <div className="absolute inset-0 top-[44px]">
            <CytoscapeGraph
              graphData={filteredGraphData}
              layout={layout}
              isDarkMode={isDarkMode}
              highlightNodeId={highlightNodeId}
              hiddenTypes={hiddenTypes}
              onNodeClick={handleNodeClick}
              onExpandNode={handleExpandNode}
              onReady={(cy) => { cyRef.current = cy; }}
            />
          </div>

          {/* Entity Details Panel (slides in from right on node click) */}
          <div className="absolute top-[44px] right-0 bottom-0 pointer-events-none">
            <div className="pointer-events-auto h-full">
              <EntityPanel
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                isDarkMode={isDarkMode}
                onAIExpand={(id) => handleAIQuery(`expand connections of ${id}`)}
              />
            </div>
          </div>

          {/* AI Loading Overlay */}
          <AnimatePresence>
            {isAILoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-end justify-center pb-8 z-30 pointer-events-none"
              >
                <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border ${isDarkMode ? 'bg-[#111115] border-gray-700' : 'bg-white border-gray-200'}`}>
                  <Loader2 size={16} className="animate-spin text-[#FF5A1F]" />
                  <span className={`text-xs font-black ${textPrimary}`}>AI Intelligence Engine Processing...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend (bottom-right corner) */}
          <div className={`absolute bottom-3 right-3 p-2 rounded-xl border text-[9px] font-mono font-bold hidden xl:block z-10 ${isDarkMode ? 'bg-[#111115]/90 border-gray-800' : 'bg-white/90 border-gray-200'} backdrop-blur-sm`}>
            <div className={`mb-1.5 text-[9px] font-black uppercase tracking-wider ${textSub}`}>Edge Legend</div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-[2px] bg-red-500"></div>
                <span className={textSub}>High Risk Link</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-5 h-[1.5px] ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                <span className={textSub}>Standard Link</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Add Entity Modal ── */}
      <AnimatePresence>
        {isAddNodeOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsAddNodeOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#111115] border-gray-800' : 'bg-white border-gray-200'}`}
            >
              <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-800 bg-[#18181C]' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center">
                    <Plus size={14} />
                  </div>
                  <h3 className={`text-sm font-black ${textPrimary}`}>Add Entity to Graph</h3>
                </div>
                <button onClick={() => setIsAddNodeOpen(false)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleAddNode} className="p-4 flex flex-col gap-3">
                <div>
                  <label className={`text-[10px] font-black uppercase tracking-wider mb-1.5 block ${textSub}`}>Entity Name *</label>
                  <input
                    autoFocus
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. Suresh Kumar, KA01AB1234..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-bold outline-none transition-all ${isDarkMode ? 'bg-[#18181C] border-gray-800 text-gray-100 focus:border-[#FF5A1F]/60' : 'bg-white border-gray-300 text-gray-900 focus:border-[#FF5A1F]'}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`text-[10px] font-black uppercase tracking-wider mb-1.5 block ${textSub}`}>Entity Type</label>
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value as CyNode['type'])}
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-bold outline-none ${isDarkMode ? 'bg-[#18181C] border-gray-800 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                    >
                      {['person', 'vehicle', 'location', 'evidence', 'organization', 'phone', 'bank', 'event'].map(t => (
                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`text-[10px] font-black uppercase tracking-wider mb-1.5 block ${textSub}`}>Risk Level</label>
                    <select
                      value={newRisk}
                      onChange={e => setNewRisk(e.target.value as CyNode['risk'])}
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-bold outline-none ${isDarkMode ? 'bg-[#18181C] border-gray-800 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                    >
                      {['critical', 'high', 'medium', 'low', 'none'].map(r => (
                        <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`text-[10px] font-black uppercase tracking-wider mb-1.5 block ${textSub}`}>
                    Relationship to {selectedNode?.label || 'Selected Node'}
                  </label>
                  <input
                    type="text"
                    value={newRelation}
                    onChange={e => setNewRelation(e.target.value)}
                    placeholder="e.g. USED, MET AT, KNOWN ASSOCIATE..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-bold outline-none transition-all ${isDarkMode ? 'bg-[#18181C] border-gray-800 text-gray-100 focus:border-[#FF5A1F]/60' : 'bg-white border-gray-300 text-gray-900 focus:border-[#FF5A1F]'}`}
                  />
                </div>

                <div>
                  <label className={`text-[10px] font-black uppercase tracking-wider mb-1.5 block ${textSub}`}>Intelligence Notes (Optional)</label>
                  <textarea
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                    rows={2}
                    placeholder="Evidence basis, source, chain of custody..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-medium outline-none resize-none transition-all ${isDarkMode ? 'bg-[#18181C] border-gray-800 text-gray-100 focus:border-[#FF5A1F]/60' : 'bg-white border-gray-300 text-gray-900 focus:border-[#FF5A1F]'}`}
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddNodeOpen(false)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-black transition-all ${isDarkMode ? 'border-gray-800 hover:bg-gray-800 text-gray-400' : 'border-gray-200 hover:bg-gray-100 text-gray-600'}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newName.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-black transition-all shadow-sm disabled:opacity-50"
                  >
                    Add to Graph
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
