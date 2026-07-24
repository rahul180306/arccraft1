'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { 
  User, 
  Phone, 
  CreditCard, 
  Car, 
  MapPin, 
  Cpu, 
  FileText, 
  HelpCircle, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Activity, 
  Clock, 
  X,
  Fingerprint,
  ChevronRight
} from 'lucide-react';

interface Node {
  id: string;
  label: string;
  type: 'person' | 'phone' | 'bank' | 'vehicle' | 'address' | 'device' | 'evidence' | 'unknown';
  importance: 'large' | 'medium' | 'small';
  priority: 'primary' | 'high' | 'medium' | 'peripheral' | 'unknown';
  ip?: string;
  phone?: string;
  account?: string;
  status: string;
  matchRate?: string;
  lastActive?: string;
  notes?: string;
}

interface LinkType {
  source: string;
  target: string;
  type: 'solid' | 'dashed' | 'dotted';
  strength: 'strong' | 'medium' | 'weak';
  label: string;
}

const initialNodes: Node[] = [
  {
    id: 'varadhan',
    label: 'K. Varadhan',
    type: 'person',
    importance: 'large',
    priority: 'primary',
    matchRate: '100%',
    status: 'ACTIVE TARGET',
    lastActive: '2 mins ago',
    notes: 'Key orchestrator of distribution network. High-frequency communication with several offshore assets.'
  },
  {
    id: 'phone_1',
    label: 'Burner Phone',
    type: 'phone',
    importance: 'medium',
    priority: 'high',
    phone: '+91 98450 12041',
    matchRate: '94%',
    status: 'MONITORED',
    lastActive: '12 mins ago',
    notes: 'Activated near transport hub 12 days ago. Relays encrypted SMS payload every midnight.'
  },
  {
    id: 'bank_1',
    label: 'Apex Holdings',
    type: 'bank',
    importance: 'medium',
    priority: 'high',
    account: 'AX-90214-991',
    matchRate: '88%',
    status: 'FLAGGED',
    lastActive: '1 hr ago',
    notes: 'Shell corporation bank account with inbound international transfers below auditing threshold.'
  },
  {
    id: 'vehicle_1',
    label: 'Black Sedan',
    type: 'vehicle',
    importance: 'medium',
    priority: 'medium',
    matchRate: '82%',
    status: 'SPOTTED',
    lastActive: '4 hrs ago',
    notes: 'Registered to Apex Holdings. Logged by multiple traffic cameras near secondary distribution drop.'
  },
  {
    id: 'address_1',
    label: 'Safehouse',
    type: 'address',
    importance: 'medium',
    priority: 'medium',
    matchRate: '79%',
    status: 'SURVEILLANCE',
    lastActive: 'Ongoing',
    notes: 'Industrial warehouse facility in south district. Night shift vehicle visits highly coordinated.'
  },
  {
    id: 'device_1',
    label: 'Known IP',
    type: 'device',
    importance: 'medium',
    priority: 'medium',
    ip: '192.168.4.15',
    matchRate: '91%',
    status: 'TRACE IN PROGRESS',
    lastActive: '45 mins ago',
    notes: 'Virtual private network exit point logged on admin servers. Host fingerprint matches known suspect terminal.'
  },
  {
    id: 'unknown_1',
    label: 'Satellite Uplink',
    type: 'unknown',
    importance: 'small',
    priority: 'unknown',
    matchRate: '45%',
    status: 'UNRESOLVED',
    lastActive: '1 day ago',
    notes: 'Encrypted uplink metadata captured by maritime signals intelligence. Intermittent bursts.'
  },
  {
    id: 'device_2',
    label: 'Chat Client',
    type: 'device',
    importance: 'small',
    priority: 'medium',
    matchRate: '85%',
    status: 'MONITORED',
    lastActive: '10 mins ago',
    notes: 'Signal protocol client with rotating ephemeral key structure. Transmitting coordinates.'
  },
  {
    id: 'bank_2',
    label: 'Cayman Trust',
    type: 'bank',
    importance: 'small',
    priority: 'peripheral',
    account: 'CY-8802-14',
    matchRate: '72%',
    status: 'MONITORED',
    lastActive: '1 day ago',
    notes: 'Ultimate beneficiary trust hiding downstream wire operations. Flowing back to Apex Holdings.'
  },
  {
    id: 'person_2',
    label: 'A. Shinde',
    type: 'person',
    importance: 'medium',
    priority: 'high',
    matchRate: '96%',
    status: 'WARRANT ISSUED',
    lastActive: '18 mins ago',
    notes: 'Chief financial facilitator. Manages shell registrations and coordinates cash flows.'
  },
  {
    id: 'evidence_1',
    label: 'Car Registry',
    type: 'evidence',
    importance: 'small',
    priority: 'peripheral',
    matchRate: '100%',
    status: 'VERIFIED',
    lastActive: 'Static',
    notes: 'Official registry certificate linking vehicle to front company and Shinde\'s home address.'
  },
  {
    id: 'evidence_2',
    label: 'Tower Logs',
    type: 'evidence',
    importance: 'small',
    priority: 'peripheral',
    matchRate: '100%',
    status: 'VERIFIED',
    lastActive: 'Static',
    notes: 'Triangulated cell logs proving Burner Phone co-located with K. Varadhan on multiple key dates.'
  },
  {
    id: 'person_3',
    label: 'Suspect C',
    type: 'person',
    importance: 'medium',
    priority: 'unknown',
    matchRate: '58%',
    status: 'IDENTIFYING',
    lastActive: '3 days ago',
    notes: 'Unidentified male contact photographed in private dining meetings with Shinde.'
  }
];

const initialLinks: LinkType[] = [
  { source: 'varadhan', target: 'phone_1', type: 'solid', strength: 'strong', label: 'Primary Owner' },
  { source: 'varadhan', target: 'bank_1', type: 'solid', strength: 'strong', label: 'Owner / Signatory' },
  { source: 'varadhan', target: 'vehicle_1', type: 'solid', strength: 'medium', label: 'Frequent User' },
  { source: 'varadhan', target: 'address_1', type: 'solid', strength: 'medium', label: 'Frequent Visitor' },
  { source: 'varadhan', target: 'device_1', type: 'solid', strength: 'medium', label: 'Authenticated session' },
  { source: 'varadhan', target: 'person_2', type: 'solid', strength: 'strong', label: 'Primary Associate' },
  { source: 'phone_1', target: 'unknown_1', type: 'dashed', strength: 'weak', label: 'Indirect Link' },
  { source: 'phone_1', target: 'device_2', type: 'dotted', strength: 'medium', label: 'App Install' },
  { source: 'phone_1', target: 'evidence_2', type: 'solid', strength: 'medium', label: 'Co-location' },
  { source: 'bank_1', target: 'bank_2', type: 'dashed', strength: 'weak', label: 'Layering Wire' },
  { source: 'bank_1', target: 'person_2', type: 'solid', strength: 'medium', label: 'Co-signer' },
  { source: 'vehicle_1', target: 'evidence_1', type: 'solid', strength: 'medium', label: 'Registry Match' },
  { source: 'person_2', target: 'person_3', type: 'dotted', strength: 'weak', label: 'Frequent Meeting' }
];

const K_REPEL = 2400;
const K_ATTRACT = 0.08;
const REST_LENGTH = 110;
const K_GRAVITY = 0.03;
const FRICTION = 0.81;

const getIcon = (type: string) => {
  switch (type) {
    case 'person': return User;
    case 'phone': return Phone;
    case 'bank': return CreditCard;
    case 'vehicle': return Car;
    case 'address': return MapPin;
    case 'device': return Cpu;
    case 'evidence': return FileText;
    default: return HelpCircle;
  }
};

export default function NetworkGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggedNodeIdRef = useRef<string | null>(null);
  const isPanningRef = useRef<boolean>(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Physics simulation data stored in ref for high-frequency 60fps calculation
  const nodePositionsRef = useRef<Record<string, { x: number; y: number; vx: number; vy: number }>>({});
  
  // React render states (safe for UI drawing)
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const initialPositions: Record<string, { x: number; y: number }> = {};
    initialNodes.forEach((node, i) => {
      if (node.id === 'varadhan') {
        initialPositions[node.id] = { x: 250, y: 185 };
      } else {
        const angle = (i * 2 * Math.PI) / (initialNodes.length - 1);
        const r = node.importance === 'medium' ? 100 : 180;
        initialPositions[node.id] = {
          x: 250 + Math.cos(angle) * r,
          y: 185 + Math.sin(angle) * r
        };
      }
    });
    return initialPositions;
  });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanY, setScanY] = useState(-50);
  const [viewState, setViewState] = useState({ scale: 2.0, translateX: -250, translateY: -185 });
  const [mounted, setMounted] = useState(false);

  // Setup initial node positions in ref on mount (no state update)
  useEffect(() => {
    const rAF = requestAnimationFrame(() => {
      setMounted(true);
    });
    const initialPositions: Record<string, { x: number; y: number; vx: number; vy: number }> = {};
    initialNodes.forEach((node, i) => {
      if (node.id === 'varadhan') {
        initialPositions[node.id] = { x: 250, y: 185, vx: 0, vy: 0 };
      } else {
        const angle = (i * 2 * Math.PI) / (initialNodes.length - 1);
        const r = node.importance === 'medium' ? 100 : 180;
        initialPositions[node.id] = {
          x: 250 + Math.cos(angle) * r,
          y: 185 + Math.sin(angle) * r,
          vx: 0,
          vy: 0
        };
      }
    });
    nodePositionsRef.current = initialPositions;
    return () => cancelAnimationFrame(rAF);
  }, []);

  // Physics Simulation requestAnimationFrame loop
  useEffect(() => {
    let animationFrameId: number;
    let isActive = true;

    const runSimulation = () => {
      if (!isActive) return;
      const pos = nodePositionsRef.current;
      if (Object.keys(pos).length === 0) {
        animationFrameId = requestAnimationFrame(runSimulation);
        return;
      }

      // 1. Repulsion force between all nodes
      const nodeIds = Object.keys(pos);
      for (let i = 0; i < nodeIds.length; i++) {
        const uId = nodeIds[i];
        const u = pos[uId];

        for (let j = i + 1; j < nodeIds.length; j++) {
          const vId = nodeIds[j];
          const v = pos[vId];

          const dx = v.x - u.x;
          const dy = v.y - u.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist === 0) dist = 1;

          const repelForce = Math.min(K_REPEL / (dist * dist), 10);
          const ax = (dx / dist) * repelForce;
          const ay = (dy / dist) * repelForce;

          if (uId !== 'varadhan') {
            u.vx -= ax;
            u.vy -= ay;
          }
          if (vId !== 'varadhan') {
            v.vx += ax;
            v.vy += ay;
          }
        }
      }

      // 2. Attraction force along links
      initialLinks.forEach(link => {
        const u = pos[link.source];
        const v = pos[link.target];
        if (!u || !v) return;

        const dx = v.x - u.x;
        const dy = v.y - u.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) dist = 1;

        const springForce = K_ATTRACT * (dist - REST_LENGTH);
        const ax = (dx / dist) * springForce;
        const ay = (dy / dist) * springForce;

        if (link.source !== 'varadhan') {
          u.vx += ax;
          u.vy += ay;
        }
        if (link.target !== 'varadhan') {
          v.vx -= ax;
          v.vy -= ay;
        }
      });

      // 3. Gravity pulling nodes back to general center (250, 185)
      nodeIds.forEach(id => {
        if (id === 'varadhan') return;
        const u = pos[id];
        const dx = 250 - u.x;
        const dy = 185 - u.y;
        u.vx += dx * K_GRAVITY;
        u.vy += dy * K_GRAVITY;
      });

      // 4. Update positions with damping
      nodeIds.forEach(id => {
        const u = pos[id];
        if (id === 'varadhan') {
          u.x = 250;
          u.y = 185;
          u.vx = 0;
          u.vy = 0;
          return;
        }

        if (draggedNodeIdRef.current === id) {
          u.vx = 0;
          u.vy = 0;
          return;
        }

        u.vx *= FRICTION;
        u.vy *= FRICTION;

        // Velocity limit to prevent explosion
        const speed = Math.sqrt(u.vx * u.vx + u.vy * u.vy);
        if (speed > 10) {
          u.vx = (u.vx / speed) * 10;
          u.vy = (u.vy / speed) * 10;
        }

        u.x += u.vx;
        u.y += u.vy;

        // Prevent floating too far outside of visual bounds
        u.x = Math.max(-100, Math.min(600, u.x));
        u.y = Math.max(-100, Math.min(480, u.y));
      });

      // Sync positions into React state for clean rendering
      const statePositions: Record<string, { x: number; y: number }> = {};
      nodeIds.forEach(id => {
        statePositions[id] = { x: pos[id].x, y: pos[id].y };
      });
      setNodePositions(statePositions);

      animationFrameId = requestAnimationFrame(runSimulation);
    };

    animationFrameId = requestAnimationFrame(runSimulation);
    return () => {
      isActive = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Map client coordinate to zoomed/panned SVG space
  const getGraphCoordinates = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 250, y: 185 };
    const rect = svgRef.current.getBoundingClientRect();
    const containerX = clientX - rect.left;
    const containerY = clientY - rect.top;
    return {
      x: (containerX - viewState.translateX) / viewState.scale,
      y: (containerY - viewState.translateY) / viewState.scale
    };
  };

  // Node Drag and View Panning Handlers
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    draggedNodeIdRef.current = nodeId;
    const pos = getGraphCoordinates(e.clientX, e.clientY);
    if (nodePositionsRef.current[nodeId]) {
      nodePositionsRef.current[nodeId].x = pos.x;
      nodePositionsRef.current[nodeId].y = pos.y;
    }
    setSelectedNodeId(nodeId);
  };

  const handleBgMouseDown = (e: React.MouseEvent) => {
    isPanningRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeIdRef.current) {
      const pos = getGraphCoordinates(e.clientX, e.clientY);
      const nodeId = draggedNodeIdRef.current;
      if (nodeId !== 'varadhan' && nodePositionsRef.current[nodeId]) {
        nodePositionsRef.current[nodeId].x = pos.x;
        nodePositionsRef.current[nodeId].y = pos.y;
      }
    } else if (isPanningRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      setViewState(prev => ({
        ...prev,
        translateX: prev.translateX + dx,
        translateY: prev.translateY + dy
      }));
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUpOrLeave = () => {
    draggedNodeIdRef.current = null;
    isPanningRef.current = false;
  };

  // Zooming Handler
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const zoomFactor = 1.08;
    const scaleChange = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
    
    setViewState(prev => {
      const nextScale = Math.max(0.4, Math.min(8, prev.scale * scaleChange));
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return prev;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const nextTranslateX = mouseX - (mouseX - prev.translateX) * (nextScale / prev.scale);
      const nextTranslateY = mouseY - (mouseY - prev.translateY) * (nextScale / prev.scale);
      
      return {
        scale: nextScale,
        translateX: nextTranslateX,
        translateY: nextTranslateY
      };
    });
  };

  const handleZoom = (type: 'in' | 'out' | 'reset') => {
    if (type === 'reset') {
      setViewState({ scale: 2.0, translateX: -250, translateY: -185 });
      return;
    }

    const factor = type === 'in' ? 1.25 : 0.8;
    setViewState(prev => {
      const nextScale = Math.max(0.4, Math.min(8, prev.scale * factor));
      const centerX = 250;
      const centerY = 185;
      const nextTranslateX = centerX - (centerX - prev.translateX) * (nextScale / prev.scale);
      const nextTranslateY = centerY - (centerY - prev.translateY) * (nextScale / prev.scale);

      return {
        scale: nextScale,
        translateX: nextTranslateX,
        translateY: nextTranslateY
      };
    });
  };

  // Center view on a specific Node
  const focusOnNode = (nodeId: string) => {
    const pos = nodePositionsRef.current[nodeId];
    if (!pos) return;

    const animObj = { scale: viewState.scale, tx: viewState.translateX, ty: viewState.translateY };
    gsap.to(animObj, {
      scale: 2.0,
      tx: 250 - pos.x * 2.0,
      ty: 185 - pos.y * 2.0,
      duration: 0.8,
      ease: 'power3.out',
      onUpdate: () => {
        setViewState({
          scale: animObj.scale,
          translateX: animObj.tx,
          translateY: animObj.ty
        });
      }
    });

    setSelectedNodeId(nodeId);
  };

  // Simulated cyber scanning sweeping laser animation
  const triggerScan = () => {
    setScanY(-50);
    setIsScanning(true);
    const anim = { y: -50 };
    gsap.to(anim, {
      y: 430,
      duration: 2.0,
      ease: 'power1.inOut',
      onUpdate: () => {
        setScanY(anim.y);
      },
      onComplete: () => {
        setIsScanning(false);
      }
    });
  };

  const selectedNode = initialNodes.find(n => n.id === selectedNodeId);

  // Derive neighbor node ids and connected link ids for hovering highlight state
  const neighboringNodeIds = useMemo(() => {
    const set = new Set<string>();
    if (hoveredNodeId) {
      set.add(hoveredNodeId);
      initialLinks.forEach(link => {
        if (link.source === hoveredNodeId) {
          set.add(link.target);
        } else if (link.target === hoveredNodeId) {
          set.add(link.source);
        }
      });
    }
    return set;
  }, [hoveredNodeId]);

  const connectedLinkIds = useMemo(() => {
    const set = new Set<string>();
    if (hoveredNodeId) {
      initialLinks.forEach((link, i) => {
        if (link.source === hoveredNodeId || link.target === hoveredNodeId) {
          set.add(`link-${i}`);
        }
      });
    }
    return set;
  }, [hoveredNodeId]);

  if (!mounted) {
    return (
      <div 
        ref={containerRef}
        className="relative w-full h-[370px] select-none overflow-hidden rounded-[24px] bg-[#FCFCFC] border border-[#EAEAEA] flex flex-col justify-between"
      >
        {/* Cyber HUD Metadata Header Overlay */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-1">
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-[#EAEAEA] rounded-full px-2.5 py-1 shadow-sm">
            <Activity size={10} className="text-[#FF5A1F] animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#111111]">INTEL GRAPH COGNITIVE LIVE</span>
          </div>
          <div className="text-[10px] text-[#9CA3AF] font-mono tracking-tight ml-1">
            NODES: {initialNodes.length} • SECURE ENCRYPTED
          </div>
        </div>
        <div className="w-full h-full flex items-center justify-center bg-[#FAFAFA]">
          <div className="flex flex-col items-center gap-2">
            <Activity size={24} className="text-[#FF5A1F] animate-pulse" />
            <span className="text-[10px] font-mono text-[#9CA3AF] tracking-widest uppercase animate-pulse">DECRYPTING GRAPH...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[370px] select-none overflow-hidden rounded-[24px] bg-[#FCFCFC] border border-[#EAEAEA] flex flex-col justify-between"
    >
      {/* Inline styles for node and scanner animations */}
      <style>{`
        @keyframes float-node {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(0.4deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.15; }
          100% { transform: scale(0.95); opacity: 0.3; }
        }
        .pulse-layer {
          transform-origin: 250px 185px;
          animation: pulse-ring 8s ease-in-out infinite;
        }
      `}</style>

      {/* Cyber HUD Metadata Header Overlay */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-1">
        <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-[#EAEAEA] rounded-full px-2.5 py-1 shadow-sm">
          <Activity size={10} className="text-[#FF5A1F] animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#111111]">INTEL GRAPH COGNITIVE LIVE</span>
        </div>
        <div className="text-[10px] text-[#9CA3AF] font-mono tracking-tight ml-1">
          NODES: {initialNodes.length} • SECURE ENCRYPTED
        </div>
      </div>

      {/* Physics interactive graph visualization stage */}
      <svg
        ref={svgRef}
        viewBox="0 0 500 370"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onMouseDown={handleBgMouseDown}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none overflow-visible touch-none bg-[#FAFAFA]"
      >
        <defs>
          <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF5F2" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FAFAFA" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Faint subtle radial depth bg glow */}
        <rect width="1000" height="800" x="-250" y="-215" fill="url(#bgGlow)" pointerEvents="none" />

        <g transform={`translate(${viewState.translateX}, ${viewState.translateY}) scale(${viewState.scale})`}>
          {/* Subtle concentric physics influence target rings */}
          <g pointerEvents="none" className="pulse-layer opacity-45">
            <circle cx="250" cy="185" r="70" fill="none" stroke="#EAEAEA" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="250" cy="185" r="140" fill="none" stroke="#EAEAEA" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="250" cy="185" r="210" fill="none" stroke="#EAEAEA" strokeWidth="1" strokeDasharray="3 3" />
            
            {/* Concentric helper legends */}
            <text x="250" y="110" fill="#9CA3AF" fontSize="7" fontWeight="bold" textAnchor="middle" letterSpacing="0.1em" className="uppercase">Core Focus Layer</text>
            <text x="250" y="40" fill="#9CA3AF" fontSize="7" fontWeight="bold" textAnchor="middle" letterSpacing="0.1em" className="uppercase">Close Associates Layer</text>
          </g>

          {/* Curved Bezier Paths representing relationships */}
          <g>
            {initialLinks.map((link, i) => {
              const u = nodePositions[link.source];
              const v = nodePositions[link.target];
              if (!u || !v) return null;

              // Compute Bezier Curve points
              const dx = v.x - u.x;
              const dy = v.y - u.y;
              let dist = Math.sqrt(dx * dx + dy * dy);
              if (dist === 0) dist = 1;

              const mx = (u.x + v.x) / 2;
              const my = (u.y + v.y) / 2;
              const nx = -dy / dist;
              const ny = dx / dist;

              const curveOffset = dist * 0.12;
              const cx = mx + nx * curveOffset;
              const cy = my + ny * curveOffset;

              const pathD = `M ${u.x} ${u.y} Q ${cx} ${cy} ${v.x} ${v.y}`;
              const pathId = `link-path-${i}`;

              // Determine visual highlighting state
              const isLinkHovered = hoveredNodeId ? connectedLinkIds.has(`link-${i}`) : true;
              const linkOpacity = hoveredNodeId ? (isLinkHovered ? 0.95 : 0.15) : 0.6;
              const isSelectedLink = selectedNodeId === link.source || selectedNodeId === link.target;

              // Style based on relationship strength & priority
              let strokeColor = '#EAEAEA';
              let strokeWidth = '1.5';
              let dashArray = '';

              if (link.strength === 'strong') {
                strokeColor = isLinkHovered ? '#111111' : '#D1D5DB';
                strokeWidth = '2';
              } else if (link.strength === 'medium') {
                strokeColor = '#9CA3AF';
                strokeWidth = '1.5';
              } else {
                strokeColor = '#D1D5DB';
                strokeWidth = '1';
              }

              if (link.type === 'dashed') {
                dashArray = '4 4';
              } else if (link.type === 'dotted') {
                dashArray = '1.5 3';
              }

              if (isSelectedLink && !hoveredNodeId) {
                strokeColor = '#FF5A1F';
                strokeWidth = '2.5';
              }

              return (
                <g key={i} className="transition-opacity duration-300" style={{ opacity: linkOpacity }}>
                  {/* Glowing background path for hover / selected lines */}
                  {(isLinkHovered && hoveredNodeId) || isSelectedLink ? (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#FF5A1F"
                      strokeWidth={parseFloat(strokeWidth) + 3}
                      className="opacity-20 filter blur-[2px]"
                    />
                  ) : null}

                  {/* Base Core Bezier Link Line */}
                  <path
                    id={pathId}
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={dashArray}
                    className="transition-all duration-300"
                  />

                  {/* Flowing relationship signal particles */}
                  {isLinkHovered && (
                    <circle r="3" fill="#FF5A1F" className="filter drop-shadow-[0_0_4px_#FF5A1F]">
                      <animateMotion dur={link.strength === 'strong' ? '2.5s' : '4s'} repeatCount="indefinite" path={pathD} />
                    </circle>
                  )}
                </g>
              );
            })}
          </g>

          {/* Interactive foreignObject HTML Nodes for complete custom Styling flexibility */}
          <g>
            {initialNodes.map((node, index) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;

              const IconComponent = getIcon(node.type);
              const size = node.importance === 'large' ? 44 : node.importance === 'medium' ? 34 : 26;
              const foWidth = 110;
              const foHeight = 80;

              // Hover focus transparency
              const isNodeHighlighted = hoveredNodeId ? neighboringNodeIds.has(node.id) : true;
              const nodeOpacity = hoveredNodeId ? (isNodeHighlighted ? 1 : 0.25) : 1;
              const isSelected = selectedNodeId === node.id;

              return (
                <g 
                  key={node.id} 
                  className="transition-opacity duration-300" 
                  style={{ opacity: nodeOpacity }}
                >
                  <foreignObject
                    x={pos.x - foWidth / 2}
                    y={pos.y - size / 2}
                    width={foWidth}
                    height={foHeight}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    className="overflow-visible select-none pointer-events-none"
                  >
                    <div 
                      className="flex flex-col items-center justify-start w-full h-full pointer-events-auto cursor-pointer group"
                      style={{
                        animation: `float-node 4.5s ease-in-out infinite`,
                        animationDelay: `${index * 0.35}s`
                      }}
                    >
                      {/* Premium Node Circle Outer Layout */}
                      <div
                        className={`rounded-full flex items-center justify-center border-2 shadow-lg transition-all duration-300 relative
                          ${node.priority === 'primary' ? 'bg-[#FF5A1F] border-white text-white drop-shadow-[0_0_8px_rgba(255,90,31,0.5)]' : 
                            node.priority === 'high' ? 'bg-[#111111] border-white text-white group-hover:bg-[#FF5A1F]' : 
                            node.priority === 'medium' ? 'bg-[#4B5563] border-white text-white group-hover:bg-[#FF5A1F]' : 
                            node.priority === 'unknown' ? 'bg-white border-dashed border-[#FF5A1F] text-[#FF5A1F] group-hover:bg-[#FFF5F2]' : 
                            'bg-[#E5E7EB] border-white text-[#4B5563] group-hover:bg-[#FF5A1F] group-hover:text-white'}`}
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          transform: isSelected ? 'scale(1.15)' : 'none',
                          borderColor: isSelected ? '#FF5A1F' : 'white',
                          boxShadow: isSelected 
                            ? '0 0 15px rgba(255,90,31,0.4), 0 8px 20px rgba(0,0,0,0.15)' 
                            : '0 4px 10px rgba(0,0,0,0.08)'
                        }}
                      >
                        <IconComponent size={size * 0.5} strokeWidth={2.2} />
                        
                        {/* Interactive floating state marker indicators */}
                        {node.priority === 'primary' && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5A1F] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white text-[7px] text-[#FF5A1F] font-black items-center justify-center">!</span>
                          </span>
                        )}
                      </div>

                      {/* Crisp intelligence text tag labels */}
                      <span 
                        className={`text-[8.5px] font-bold text-center mt-1 px-1.5 py-0.5 rounded border leading-tight max-w-full truncate shadow-[0_2px_4px_rgba(0,0,0,0.01)] uppercase tracking-wider transition-all duration-200
                          ${isSelected 
                            ? 'bg-[#111111] text-white border-[#111111] opacity-100 pointer-events-auto scale-100' 
                            : 'bg-white/95 text-[#111111] border-[#EAEAEA]/80 group-hover:border-[#FF5A1F]/40 group-hover:text-[#FF5A1F] opacity-0 pointer-events-none scale-95 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-100'}`}
                      >
                        {node.label}
                      </span>
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </g>

          {/* Glowing Animated sweeping cyber scanning radar line */}
          {isScanning && (
            <g pointerEvents="none">
              <line 
                x1="-100" 
                y1={scanY} 
                x2="600" 
                y2={scanY} 
                stroke="#FF5A1F" 
                strokeWidth="2.5" 
                className="filter drop-shadow-[0_0_8px_#FF5A1F]" 
                opacity="0.85"
              />
              <rect
                x="-100"
                y={scanY - 60}
                width="700"
                height="60"
                fill="url(#scanGlow)"
                opacity="0.15"
              />
              <defs>
                <linearGradient id="scanGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF5A1F" stopOpacity="0" />
                  <stop offset="100%" stopColor="#FF5A1F" stopOpacity="1" />
                </linearGradient>
              </defs>
            </g>
          )}
        </g>
      </svg>

      {/* Slide-out Dossier Dossier intelligence detail file panel */}
      {selectedNode && (
        <div 
          className="absolute top-3 right-3 bottom-3 w-[215px] bg-white/95 backdrop-blur-md border border-[#EAEAEA] rounded-[16px] shadow-xl p-3.5 flex flex-col justify-between overflow-y-auto z-40 transition-all duration-300 transform translate-x-0 select-text animate-fade-in"
          style={{ boxShadow: '0 12px 36px rgba(0,0,0,0.06)' }}
        >
          {/* Header */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded bg-[#FF5A1F] flex items-center justify-center text-white text-[7px] font-black">
                  C
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#9CA3AF]">INTELLIGENCE FILE</span>
              </div>
              <button 
                onClick={() => setSelectedNodeId(null)}
                className="p-1 rounded-full hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#111111] transition-colors cursor-pointer"
              >
                <X size={11} />
              </button>
            </div>

            <div className="border-t border-[#EAEAEA]/80 pt-2 flex items-start gap-2">
              <div className="w-7 h-7 rounded bg-[#FFF5F2] border border-[#FFE4DC] flex items-center justify-center text-[#FF5A1F] shrink-0 mt-0.5">
                {(() => {
                  const NodeIcon = getIcon(selectedNode.type);
                  return <NodeIcon size={14} />;
                })()}
              </div>
              <div className="min-w-0">
                <h4 className="text-[11px] font-black text-[#111111] uppercase tracking-wide truncate">{selectedNode.label}</h4>
                <p className="text-[8px] font-bold text-[#FF5A1F] uppercase tracking-widest mt-0.5 bg-[#FFF5F2] inline-block px-1 rounded">
                  {selectedNode.status}
                </p>
              </div>
            </div>
          </div>

          {/* Dossier Body Records */}
          <div className="flex-1 my-3 space-y-2.5 overflow-y-auto text-[10px] font-semibold text-[#6B7280]">
            {selectedNode.matchRate && (
              <div className="flex justify-between items-center bg-[#FAFAFA] px-2 py-1 rounded">
                <span className="text-[#9CA3AF] text-[8px] uppercase tracking-wider">CONFIDENCE MATCH</span>
                <span className="text-[#111111] font-bold">{selectedNode.matchRate}</span>
              </div>
            )}
            
            {selectedNode.phone && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[#9CA3AF] text-[8px] uppercase tracking-wider">PHONE NUMBER</span>
                <span className="text-[#111111] font-mono">{selectedNode.phone}</span>
              </div>
            )}

            {selectedNode.account && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[#9CA3AF] text-[8px] uppercase tracking-wider">ACCOUNT ID</span>
                <span className="text-[#111111] font-mono">{selectedNode.account}</span>
              </div>
            )}

            {selectedNode.ip && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[#9CA3AF] text-[8px] uppercase tracking-wider">IP ROUTE</span>
                <span className="text-[#111111] font-mono">{selectedNode.ip}</span>
              </div>
            )}

            <div className="flex flex-col gap-0.5">
              <span className="text-[#9CA3AF] text-[8px] uppercase tracking-wider">LAST EVENT ACTIVITY</span>
              <div className="flex items-center gap-1 text-[#111111]">
                <Clock size={10} className="text-[#9CA3AF]" />
                <span>{selectedNode.lastActive}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 border-t border-[#EAEAEA]/80 pt-2">
              <span className="text-[#9CA3AF] text-[8px] uppercase tracking-wider">ANALYST BRIEFING NOTES</span>
              <p className="text-[9.5px] text-[#4B5563] leading-relaxed select-text font-medium">{selectedNode.notes}</p>
            </div>
          </div>

          {/* Dossier Footer Action button */}
          <button 
            onClick={triggerScan}
            className="w-full bg-[#111111] text-white font-bold text-[8.5px] uppercase tracking-widest py-2 rounded-lg hover:bg-[#FF5A1F] transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm mt-auto"
          >
            <span>Scan Connections</span>
            <ChevronRight size={10} />
          </button>
        </div>
      )}

      {/* Cyber Controls Toolbar Overlay (Zoom & Sweep Laser buttons) */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 pointer-events-auto bg-white/95 backdrop-blur-sm border border-[#EAEAEA] rounded-xl p-1 shadow-sm">
        <button
          onClick={() => handleZoom('in')}
          title="Zoom In"
          className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111111] transition-all cursor-pointer"
        >
          <ZoomIn size={12} />
        </button>
        <button
          onClick={() => handleZoom('out')}
          title="Zoom Out"
          className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111111] transition-all cursor-pointer"
        >
          <ZoomOut size={12} />
        </button>
        <button
          onClick={() => handleZoom('reset')}
          title="Recenter View"
          className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111111] transition-all cursor-pointer"
        >
          <Maximize2 size={12} />
        </button>
        
        <div className="w-[1px] h-3.5 bg-[#EAEAEA]" />

        <button
          onClick={triggerScan}
          disabled={isScanning}
          title="Scan Network Radar"
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[8.5px] font-black uppercase tracking-wider transition-all cursor-pointer
            ${isScanning 
              ? 'bg-[#FFF5F2] text-[#FF5A1F] border border-[#FFE4DC]' 
              : 'hover:bg-[#F9FAFB] text-[#111111]'}`}
        >
          <Fingerprint size={10} className={isScanning ? 'animate-pulse' : ''} />
          <span>Scan</span>
        </button>
      </div>

      {/* Cyber Network Details Legend overlay */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none hidden md:flex items-center gap-2 text-[8px] font-bold text-[#9CA3AF] uppercase tracking-widest bg-white/60 backdrop-blur-[2px] border border-[#EAEAEA]/30 rounded-full px-2.5 py-1">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]"></span>
          <span>Target</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#111111]"></span>
          <span>High Priority</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white border border-dashed border-[#FF5A1F]"></span>
          <span>Unresolved</span>
        </div>
      </div>
    </div>
  );
}
