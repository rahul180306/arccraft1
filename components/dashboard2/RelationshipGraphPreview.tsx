'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, 
  Maximize2, 
  User, 
  UserX, 
  Car, 
  MapPin, 
  Phone, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Filter 
} from 'lucide-react';
import PremiumCard from '@/components/ui/PremiumCard';
import StatusBadge from '@/components/ui/StatusBadge';

interface RelationshipGraphPreviewProps {
  onOpenFullscreen: () => void;
}

export default function RelationshipGraphPreview({ onOpenFullscreen }: RelationshipGraphPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<{ name: string; type: string; role: string; details: string } | null>(null);

  const nodes = [
    { id: 'n1', name: 'Ramesh Kumar', type: 'person', role: 'Victim / Complainant', details: 'House owner, Building #4B, Anekal', color: 'bg-blue-500' },
    { id: 'n2', name: 'Bullet Suresh', type: 'suspect', role: 'Primary Accused', details: 'Repeat offender, 4 prior burglary cases in CCTNS', color: 'bg-red-500' },
    { id: 'n3', name: 'KA-03-MN-4491', type: 'vehicle', role: 'Getaway Vehicle', details: 'Blue SUV spotted on CCTV at Exit Gate', color: 'bg-emerald-500' },
    { id: 'n4', name: 'Anekal Hideout', type: 'location', role: 'Crime Scene / Stash', details: 'Abandoned warehouse near Silk Board', color: 'bg-purple-500' },
    { id: 'n5', name: '+91 98801XXXXX', type: 'phone', role: 'Suspect Mobile CDR', details: 'Active on tower dump during crime timeframe', color: 'bg-amber-500' }
  ];

  const handleNodeClick = (node: typeof nodes[0]) => {
    setSelectedNode(node);
  };

  return (
    <>
      <PremiumCard hoverGlow="blue" padding="p-6">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                <Network size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#111111] dark:text-white tracking-tight">
                    Relationship Link Graph
                  </h3>
                  <StatusBadge label="CCTNS LINK" type="info" />
                </div>
                <p className="text-[10px] text-gray-500 font-medium">Cross-case intelligence node mapping</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsFullscreen(true);
                onOpenFullscreen();
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <Maximize2 size={13} />
              <span>Fullscreen</span>
            </motion.button>
          </div>

          {/* Visual Graph Node Flow Preview */}
          <div className="my-5 p-4 bg-[#0F172A] text-white rounded-2xl relative overflow-hidden min-h-[160px] flex items-center justify-center border border-gray-800 ambient-grid-dark">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />

            {/* Connecting lines with animated glow dash */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-blue-500/50 stroke-2">
              <line x1="15%" y1="50%" x2="38%" y2="50%" strokeDasharray="4 4" className="animate-pulse" />
              <line x1="38%" y1="50%" x2="62%" y2="50%" strokeDasharray="4 4" className="animate-pulse" />
              <line x1="62%" y1="50%" x2="85%" y2="50%" strokeDasharray="4 4" className="animate-pulse" />
            </svg>

            {/* Node Pills */}
            <div className="relative z-10 flex items-center justify-between w-full max-w-lg px-2 pt-3">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                onClick={() => handleNodeClick(nodes[0])}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center border-2 border-white/20 shadow-lg group-hover:bg-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <span className="text-[10px] font-extrabold text-blue-200">Victim</span>
                <span className="text-[9px] text-gray-400 font-mono">Ramesh</span>
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.1 }}
                onClick={() => handleNodeClick(nodes[1])}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center border-2 border-white/20 shadow-lg group-hover:bg-red-500 transition-colors">
                  <UserX size={18} />
                </div>
                <span className="text-[10px] font-extrabold text-red-300">Suspect</span>
                <span className="text-[9px] text-gray-400 font-mono">Bullet Suresh</span>
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.1 }}
                onClick={() => handleNodeClick(nodes[2])}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center border-2 border-white/20 shadow-lg group-hover:bg-emerald-500 transition-colors">
                  <Car size={18} />
                </div>
                <span className="text-[10px] font-extrabold text-emerald-300">Vehicle</span>
                <span className="text-[9px] text-gray-400 font-mono">KA-03-MN</span>
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.1 }}
                onClick={() => handleNodeClick(nodes[3])}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center border-2 border-white/20 shadow-lg group-hover:bg-purple-500 transition-colors">
                  <MapPin size={18} />
                </div>
                <span className="text-[10px] font-extrabold text-purple-300">Location</span>
                <span className="text-[9px] text-gray-400 font-mono">Anekal</span>
              </motion.button>
            </div>
          </div>
        </div>

        <div className="pt-2 text-[10px] text-gray-400 font-medium flex items-center justify-between">
          <span>Discovers hidden co-accused & vehicle overlaps from Karnataka police records.</span>
        </div>
      </PremiumCard>

      {/* Fullscreen Interactive Graph Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#0B0F19]/95 text-white flex flex-col p-6 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              data-lenis-prevent
              className="flex-1 flex flex-col h-full"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF5A1F] text-white flex items-center justify-center font-bold shadow-lg">
                    <Network size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight">Interactive Entity Link Analysis</h2>
                    <p className="text-xs text-gray-400">FIR KRP/2026/0456 • Cross-Station Entity Mapping</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsFullscreen(false)}
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Fullscreen Node Workspace */}
              <div className="flex-1 relative my-4 bg-[#0F172A] rounded-3xl border border-gray-800 overflow-hidden flex items-center justify-center ambient-grid-dark">
                {/* Nodes Map */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 p-8 max-w-4xl w-full">
                  {nodes.map((node) => (
                    <motion.div 
                      key={node.id}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => setSelectedNode(node)}
                      className="bg-gray-900/90 border border-gray-700 hover:border-[#FF5A1F] rounded-2xl p-5 shadow-2xl transition-all cursor-pointer flex flex-col gap-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`w-3 h-3 rounded-full ${node.color}`} />
                        <span className="text-[10px] font-mono text-gray-400 uppercase">{node.type}</span>
                      </div>
                      <h3 className="text-sm font-extrabold text-white group-hover:text-[#FF5A1F]">{node.name}</h3>
                      <p className="text-xs text-[#FF5A1F] font-semibold">{node.role}</p>
                      <p className="text-[10px] text-gray-400 leading-relaxed">{node.details}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Inspector Details Drawer inside Modal */}
                {selectedNode && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute bottom-6 left-6 right-6 bg-gray-900 border border-[#FF5A1F]/50 p-5 rounded-2xl shadow-2xl flex items-center justify-between z-20"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-[#FF5A1F] font-bold uppercase">{selectedNode.role}</span>
                      <h4 className="text-base font-extrabold text-white">{selectedNode.name}</h4>
                      <p className="text-xs text-gray-300">{selectedNode.details}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedNode(null)}
                      className="p-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

