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

// ─── Seed Graph Data (KSP KRP/2026/0456 Case) ─────────────────────────────────
const SEED_GRAPH: GraphData = {
  nodes: [
    { id: 'SK', label: 'Suresh Kumar', type: 'person', risk: 'critical', subtitle: 'Prime Suspect', isFocal: true,
      details: { DOB: '12 Mar 1992', Phone: '+91 98765 43210', Address: 'KR Puram, Bengaluru', casesLinked: 3,
        notes: 'Prior history in house burglary. Flagged in 2 other open FIRs in Whitefield precinct.' }},
    { id: 'HK', label: 'Harish K.', type: 'person', risk: 'medium', subtitle: 'Key Witness',
      details: { Phone: '+91 98123 45678', Address: 'Hoodi Village, Bengaluru', casesLinked: 1,
        notes: 'Gave recorded statement under Sec 161 CrPC. Confirmed meeting Sandeep at 08:45 PM.' }},
    { id: 'RB', label: 'Ramesh B.', type: 'person', risk: 'high', subtitle: 'Linked in 2 FIRs (15-Jul-2026)',
      details: { phone: '+91 9876543210', location: 'Whitefield', lastSeen: '11 Feb 2026', casesLinked: 2,
        notes: 'Frequent co-accused in commercial thefts.' }},
    { id: 'NJ', label: 'Naveen J.', type: 'person', risk: 'high', subtitle: 'Co-Accused',
      details: { Phone: '+91 96111 22334', Address: 'TC Palya, Bengaluru', casesLinked: 2,
        notes: 'Arrested under Non-Bailable Warrant on 17 Jul. Confessed to driving vehicle.' }},
    { id: 'VEH1', label: 'KA03MN4481', type: 'vehicle', risk: 'high', subtitle: 'Toyota Innova – White',
      details: { regNo: 'KA03MN4481', model: 'Toyota Innova (White)', owner: 'Suresh Kumar', casesLinked: 2,
        notes: 'Captured on ANPR camera at Outer Ring Road at 02:15 AM on incident night.' }},
    { id: 'EVD1', label: 'CCTV_01.mp4', type: 'evidence', risk: 'high', subtitle: 'Video Evidence',
      details: { evidenceType: 'MP4 CCTV Footage (HD)', hash: 'e3b0c44298fc1c149...b855',
        notes: 'Front Gate Camera #1. Shows suspect vehicle entering restricted zone.' }},
    { id: 'EVD2', label: 'AFIS-FP-01', type: 'evidence', risk: 'critical', subtitle: 'Biometric Sample',
      details: { evidenceType: 'Latent Fingerprint', matchScore: '94.2%', casesLinked: 1,
        notes: 'Latent fingerprint lifted from safe handle. AFIS match: Suresh Kumar (94.2%).' }},
    { id: 'LOC1', label: 'Hoodi Circle', type: 'location', risk: 'medium', subtitle: 'Last Seen Location',
      details: { address: 'Hoodi Junction, ITPL Main Rd, Bengaluru',
        notes: 'Mobile tower dump confirms suspect handset on BTS tower #402 at 03:12 AM.' }},
    { id: 'LOC2', label: 'Anekal Main Rd', type: 'location', risk: 'critical', subtitle: 'Scene of Crime',
      details: { address: 'Plot #42, Anekal Main Road, KR Puram',
        notes: 'Location of armed house burglary. High-resolution scene photographs generated.' }},
    { id: 'ORG1', label: 'City Robbery Gang', type: 'organization', risk: 'critical', subtitle: 'Criminal Syndicate',
      details: { casesLinked: 5, notes: 'Under KSP State Intelligence monitoring for illegal arms & burglary.' }},
    { id: 'PH1', label: '+91 98765 43210', type: 'phone', risk: 'high', subtitle: 'Suspect Phone',
      details: { IMEI: '354823091234567', Carrier: 'Airtel', casesLinked: 1,
        notes: 'CDR analysis shows 14 calls with Ramesh B. in 48 hrs before incident.' }},
    { id: 'PH2', label: 'BTS Tower #402', type: 'phone', risk: 'medium', subtitle: 'Tower Dump',
      details: { location: 'Hoodi Junction', registeredDevices: '47',
        notes: 'IMSI dump identified 47 devices at 03:12 AM. Suspect IMEI confirmed.' }},
  ],
  edges: [
    { id: 'e1', source: 'SK', target: 'HK', label: 'Met 15 Jul', weight: 2 },
    { id: 'e2', source: 'SK', target: 'RB', label: 'Known Assoc.', isHighRisk: true, weight: 3 },
    { id: 'e3', source: 'SK', target: 'VEH1', label: 'Used Vehicle', isHighRisk: true, weight: 3 },
    { id: 'e4', source: 'SK', target: 'EVD1', label: 'Captured On', isHighRisk: true, weight: 3 },
    { id: 'e5', source: 'SK', target: 'EVD2', label: 'Biometric', isHighRisk: true, weight: 3 },
    { id: 'e6', source: 'SK', target: 'LOC1', label: 'Last Seen', weight: 2 },
    { id: 'e7', source: 'SK', target: 'ORG1', label: 'Member Of', isHighRisk: true, weight: 3 },
    { id: 'e8', source: 'SK', target: 'NJ', label: 'Co-Accused', isHighRisk: true, weight: 3 },
    { id: 'e9', source: 'SK', target: 'LOC2', label: 'Present At', isHighRisk: true, weight: 3 },
    { id: 'e10', source: 'SK', target: 'PH1', label: 'Uses', weight: 2 },
    { id: 'e11', source: 'PH1', target: 'RB', label: '14 Calls', isHighRisk: true },
    { id: 'e12', source: 'PH1', target: 'PH2', label: 'Pinged', weight: 2 },
    { id: 'e13', source: 'NJ', target: 'VEH1', label: 'Drove', isHighRisk: true },
    { id: 'e14', source: 'LOC2', target: 'LOC1', label: '1.8 km', weight: 1 },
    { id: 'e15', source: 'RB', target: 'ORG1', label: 'Member Of', isHighRisk: true },
    { id: 'e16', source: 'VEH1', target: 'LOC2', label: 'At Scene', isHighRisk: true },
  ]
};

// ─── AI Suggestions ─────────────────────────────────────────────────────────────
const AI_SUGGESTIONS = [
  { id: 's1', confidence: 97, text: 'Financial transaction links between Suresh Kumar & City Robbery Gang detected via cross-FIR analysis.' },
  { id: 's2', confidence: 85, text: 'Harish K. visited crime location 2 days before incident. Possible prior knowledge.', action: 'Expand Harish K.' },
  { id: 's3', confidence: 78, text: 'Additional unknown associate (UNK-01) near Hoodi Circle identified via tower dump. Expand?', action: 'Add Unknown Node' },
];

// ─── Recent Activity ─────────────────────────────────────────────────────────────
const RECENT_LINKS = [
  { source: 'Suresh Kumar', relation: 'USED', target: 'KA03MN4481', evidence: 'CCTV_01.mp4', by: 'ASI Ramesh', time: '10:24 AM' },
  { source: 'Naveen J.', relation: 'CO-ACCUSED WITH', target: 'Suresh Kumar', evidence: 'Charge_Sheet.pdf', by: 'HC Kavya', time: '11:05 AM' },
  { source: 'AFIS-FP-01', relation: 'MATCHED', target: 'Suresh Kumar', evidence: 'AFIS DB Match', by: 'Forensic Unit', time: '11:30 AM' },
];

export default function IntelligenceWorkspace() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const showToast = useUIStore((s) => s.showToast);

  const cyRef = useRef<any>(null);

  const [graphData, setGraphData] = useState<GraphData>(SEED_GRAPH);
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
              {AI_SUGGESTIONS.map(s => (
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
              {RECENT_LINKS.map((link, i) => (
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
