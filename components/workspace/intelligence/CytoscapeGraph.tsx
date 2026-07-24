'use client';

import React, { useEffect, useRef, useCallback } from 'react';

export interface CyNode {
  id: string;
  label: string;
  type: 'person' | 'vehicle' | 'location' | 'evidence' | 'organization' | 'event' | 'phone' | 'bank';
  risk?: 'critical' | 'high' | 'medium' | 'low' | 'none';
  subtitle?: string;
  details?: Record<string, any>;
  isFocal?: boolean;
}

export interface CyEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  weight?: number;
  isHighRisk?: boolean;
}

export interface GraphData {
  nodes: CyNode[];
  edges: CyEdge[];
}

export type LayoutOption = 'cose' | 'concentric' | 'circle' | 'breadthfirst' | 'grid';

interface CytoscapeGraphProps {
  graphData: GraphData;
  layout: LayoutOption;
  isDarkMode: boolean;
  highlightNodeId?: string | null;
  hiddenTypes?: string[];
  onNodeClick?: (node: CyNode) => void;
  onEdgeClick?: (edge: CyEdge, sourceNode: CyNode, targetNode: CyNode) => void;
  onExpandNode?: (node: CyNode) => void;
  onReady?: (cy: any) => void;
}

declare global {
  interface Window {
    cytoscape: any;
    __cytoscapeLoading?: boolean;
    __cytoscapeCallbacks?: Array<() => void>;
  }
}

const NODE_COLORS: Record<string, { bg: string; border: string }> = {
  person:       { bg: '#7C3AED', border: '#A855F7' },
  vehicle:      { bg: '#059669', border: '#10B981' },
  location:     { bg: '#2563EB', border: '#3B82F6' },
  evidence:     { bg: '#DC2626', border: '#EF4444' },
  organization: { bg: '#D97706', border: '#F59E0B' },
  event:        { bg: '#7C3AED', border: '#8B5CF6' },
  phone:        { bg: '#0891B2', border: '#06B6D4' },
  bank:         { bg: '#BE185D', border: '#EC4899' },
};

const RISK_COLOR: Record<string, string> = {
  critical: '#EF4444',
  high:     '#F97316',
  medium:   '#EAB308',
  low:      '#22C55E',
  none:     '',
};

function loadCytoscape(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') { resolve(); return; }
    if (window.cytoscape) { resolve(); return; }

    if (window.__cytoscapeCallbacks) {
      window.__cytoscapeCallbacks.push(resolve);
      return;
    }
    if (window.__cytoscapeLoading) {
      window.__cytoscapeCallbacks = [resolve];
      return;
    }

    window.__cytoscapeLoading = true;
    window.__cytoscapeCallbacks = [resolve];

    const onLoad = () => {
      (window.__cytoscapeCallbacks || []).forEach(cb => cb());
      window.__cytoscapeCallbacks = [];
      window.__cytoscapeLoading = false;
    };

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/cytoscape@3.30.2/dist/cytoscape.min.js';
    script.async = true;
    script.onload = onLoad;
    script.onerror = () => {
      const s2 = document.createElement('script');
      s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.30.2/cytoscape.min.js';
      s2.async = true;
      s2.onload = onLoad;
      document.head.appendChild(s2);
    };
    document.head.appendChild(script);
  });
}

export default function CytoscapeGraph({
  graphData, layout, isDarkMode, highlightNodeId,
  hiddenTypes = [], onNodeClick, onEdgeClick, onExpandNode, onReady,
}: CytoscapeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<any>(null);
  const initialized = useRef(false);
  const [isReady, setIsReady] = React.useState(false);
  
  // Context Menu State
  const [contextMenu, setContextMenu] = React.useState<{node: CyNode; x: number; y: number} | null>(null);

  const buildStyle = useCallback((dark: boolean) => {
    const labelColor = dark ? '#E5E7EB' : '#1F2937';
    const edgeColor  = dark ? '#374151' : '#9CA3AF';
    const textBg     = dark ? '#111111' : '#FFFFFF';
    return [
      {
        selector: 'node',
        style: {
          'shape': 'ellipse',
          'width': (ele: any) => ele.data('isFocal') ? 66 : 48,
          'height': (ele: any) => ele.data('isFocal') ? 66 : 48,
          'background-color': (ele: any) => NODE_COLORS[ele.data('type')]?.bg || '#6B7280',
          'border-width': 2.5,
          'border-color': (ele: any) => {
            const risk = ele.data('risk') || 'none';
            return RISK_COLOR[risk] || NODE_COLORS[ele.data('type')]?.border || '#9CA3AF';
          },
          'label': 'data(label)',
          'color': labelColor,
          'font-size': 10,
          'font-family': '"Inter","SF Pro Display",system-ui,sans-serif',
          'font-weight': '700',
          'text-valign': 'bottom',
          'text-halign': 'center',
          'text-margin-y': 7,
          'text-background-color': textBg,
          'text-background-opacity': 0.88,
          'text-background-padding': '3px',
          'text-background-shape': 'roundrectangle',
          'text-max-width': '84px',
          'text-wrap': 'ellipsis',
          'overlay-opacity': 0,
        }
      },
      { selector: 'node[type = "vehicle"]',      style: { shape: 'roundrectangle' } },
      { selector: 'node[type = "location"]',     style: { shape: 'diamond' } },
      { selector: 'node[type = "evidence"]',     style: { shape: 'triangle' } },
      { selector: 'node[type = "organization"]', style: { shape: 'hexagon' } },
      { selector: 'node[type = "phone"]',        style: { shape: 'pentagon' } },
      { selector: 'node[type = "bank"]',         style: { shape: 'tag' } },
      { selector: 'node.highlighted', style: { 'border-width': 4, 'border-color': '#FF5A1F', width: 76, height: 76 } },
      { selector: 'node.dimmed',      style: { opacity: 0.2 } },
      { selector: 'node.hidden',      style: { display: 'none' } },
      {
        selector: 'edge',
        style: {
          'width': (ele: any) => ele.data('isHighRisk') ? 2.5 : 1.5,
          'line-color': (ele: any) => ele.data('isHighRisk') ? '#EF4444' : edgeColor,
          'target-arrow-shape': 'triangle',
          'target-arrow-color': (ele: any) => ele.data('isHighRisk') ? '#EF4444' : edgeColor,
          'curve-style': 'bezier',
          'label': 'data(label)',
          'font-size': 8,
          'color': dark ? '#9CA3AF' : '#6B7280',
          'font-family': '"Inter",monospace',
          'font-weight': '600',
          'text-rotation': 'autorotate',
          'text-margin-y': -7,
          'text-background-color': textBg,
          'text-background-opacity': 0.8,
          'text-background-padding': '2px',
          'text-background-shape': 'roundrectangle',
          'overlay-opacity': 0,
        }
      },
      { selector: 'edge.highlighted', style: { 'line-color': '#FF5A1F', 'target-arrow-color': '#FF5A1F', width: 3 } },
      { selector: 'edge.dimmed',      style: { opacity: 0.08 } },
    ];
  }, []);

  const buildLayout = useCallback((name: string) => {
    const base = { animate: true, animationDuration: 700 };
    switch (name) {
      case 'concentric':   return { ...base, name: 'concentric', minNodeSpacing: 80, padding: 60 };
      case 'circle':       return { ...base, name: 'circle', padding: 60, spacingFactor: 1.3 };
      case 'breadthfirst': return { ...base, name: 'breadthfirst', directed: true, padding: 40, spacingFactor: 1.5 };
      case 'grid':         return { ...base, name: 'grid', padding: 50, spacingFactor: 1.5 };
      case 'cose':
      default:
        return {
          ...base, name: 'cose',
          idealEdgeLength: 120, nodeOverlap: 20, refresh: 20, fit: true, padding: 60,
          randomize: false, componentSpacing: 100,
          nodeRepulsion: () => 5000, edgeElasticity: () => 100,
          nestingFactor: 5, gravity: 80, numIter: 1000, coolingFactor: 0.99, minTemp: 1.0,
        };
    }
  }, []);

  // ── Initialize once ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || initialized.current) return;
    loadCytoscape().then(() => {
      if (!containerRef.current || initialized.current) return;
      if (!window.cytoscape) { console.warn('Cytoscape.js failed to load'); return; }
      initialized.current = true;

      const cy = window.cytoscape({
        container: containerRef.current,
        elements: [],
        style: buildStyle(isDarkMode),
        layout: { name: 'preset' },
        minZoom: 0.08, maxZoom: 5, wheelSensitivity: 0.25,
        userPanningEnabled: true, userZoomingEnabled: true, boxSelectionEnabled: false,
      });

      cy.on('tap', 'node', (evt: any) => {
        if (onNodeClick) onNodeClick(evt.target.data() as CyNode);
        cy.elements().removeClass('highlighted dimmed');
        const nbhd = evt.target.closedNeighborhood();
        cy.elements().not(nbhd).addClass('dimmed');
        nbhd.addClass('highlighted');
        evt.target.removeClass('dimmed');
      });

      cy.on('tap', 'edge', (evt: any) => {
        const ed = evt.target.data() as CyEdge;
        if (onEdgeClick) onEdgeClick(ed, cy.getElementById(ed.source).data(), cy.getElementById(ed.target).data());
      });

      cy.on('cxttap', 'node', (evt: any) => {
        evt.preventDefault();
        const pos = evt.renderedPosition;
        setContextMenu({ node: evt.target.data() as CyNode, x: pos.x, y: pos.y });
      });

      cy.on('tap', (evt: any) => {
        setContextMenu(null);
        if (evt.target === cy) cy.elements().removeClass('highlighted dimmed');
      });

      cy.on('zoom pan', () => {
        setContextMenu(null);
      });

      cy.on('mouseover', 'node', () => { if (containerRef.current) containerRef.current.style.cursor = 'pointer'; });
      cy.on('mouseout',  'node', () => { if (containerRef.current) containerRef.current.style.cursor = 'default'; });

      cyRef.current = cy;
      setIsReady(true);
      if (onReady) onReady(cy);
    });

    return () => {
      if (cyRef.current) { cyRef.current.destroy(); cyRef.current = null; initialized.current = false; }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync graph data ──────────────────────────────────────────────────────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.elements().remove();
    cy.add([
      ...graphData.nodes.map(n => ({
        group: 'nodes' as const,
        data: { ...n, risk: n.risk || 'none', isFocal: n.isFocal || false }
      })),
      ...graphData.edges.map(e => ({
        group: 'edges' as const,
        data: { ...e, label: e.label.toUpperCase() }
      }))
    ]);
    cy.nodes().forEach((n: any) => {
      if (hiddenTypes.includes(n.data('type'))) n.addClass('hidden'); else n.removeClass('hidden');
    });
    try { 
      const activeLayout = cy.layout(buildLayout(layout));
      activeLayout.run(); 
      activeLayout.promiseOn('layoutstop').then(() => {
        cy.resize();
        cy.fit(undefined, 80);
        cy.center();
      });
    }
    catch { cy.layout({ name: 'preset' }).run(); }
  }, [graphData, layout, hiddenTypes, buildLayout, isReady]);

  // ── Handle resizing ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isReady || !cyRef.current) return;
    
    const handleResize = () => {
      const cy = cyRef.current;
      if (cy) {
        cy.resize();
        cy.fit(undefined, 80);
        cy.center();
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Also listen for container size changes (e.g. sidebars opening)
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [isReady]);

  // ── Dark mode stylesheet update ──────────────────────────────────────────────
  useEffect(() => {
    if (cyRef.current) cyRef.current.style(buildStyle(isDarkMode));
  }, [isDarkMode, buildStyle]);

  // ── Node highlight ───────────────────────────────────────────────────────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.elements().removeClass('highlighted dimmed');
    if (highlightNodeId) {
      const n = cy.getElementById(highlightNodeId);
      if (n.length) {
        const nbhd = n.closedNeighborhood();
        cy.elements().not(nbhd).addClass('dimmed');
        nbhd.addClass('highlighted');
        cy.animate({ fit: { eles: n, padding: 120 }, duration: 500 });
      }
    }
  }, [highlightNodeId]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="absolute inset-0 z-0"
        style={{ background: isDarkMode ? '#0E0E10' : '#F1F5F9' }}
      />
      
      {/* CONTEXT MENU */}
      {contextMenu && (
        <div 
          className={`absolute z-50 p-1.5 rounded-xl border shadow-2xl flex flex-col min-w-[180px] text-xs font-bold ${
            isDarkMode ? 'bg-[#1C1C21] border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-slate-800'
          }`}
          style={{ top: contextMenu.y + 10, left: contextMenu.x + 10 }}
        >
          <div className="px-3 pt-2 pb-1.5 mb-1 border-b border-gray-200 dark:border-gray-800">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{contextMenu.node.type}</span>
            <div className="font-black truncate max-w-[180px]">{contextMenu.node.label}</div>
          </div>
          <button 
            onClick={() => {
              if (onExpandNode) onExpandNode(contextMenu.node);
              setContextMenu(null);
            }}
            className="group flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[#FF5A1F] hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <span className="text-[#FF5A1F] group-hover:text-white">⛶</span> Expand Network
          </button>
          <button 
            onClick={() => {
              if (onNodeClick) onNodeClick(contextMenu.node);
              setContextMenu(null);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          >
            <span className="text-gray-400">ℹ</span> View Details
          </button>
        </div>
      )}
    </div>
  );
}
