'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ShieldAlert, X, DollarSign, Package, AlertTriangle, Users } from 'lucide-react';
import { CyNode } from './CytoscapeGraph';

// Dynamically import Plotly with SSR disabled for Next.js App Router compatibility
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface PlotlyCompactDockProps {
  isDarkMode: boolean;
  selectedNode: CyNode | null;
  onClose: () => void;
}

export default function PlotlyCompactDock({ isDarkMode, selectedNode, onClose }: PlotlyCompactDockProps) {
  const panelBg = isDarkMode ? 'bg-[#111115]/95 border-gray-800' : 'bg-white/95 border-gray-200';
  const textColor = isDarkMode ? '#F3F4F6' : '#111827';
  const textSub = isDarkMode ? '#9CA3AF' : '#6B7280';
  const bgPlot = isDarkMode ? '#18181C' : '#F8FAFC';

  // Target culprit name
  const focalName = selectedNode ? selectedNode.label : 'Suresh Kumar (Prime Culprit)';

  // Financial & Evidence Data for active culprit
  const monetaryBreakdown = [
    { item: 'Stolen Gold (420g)', amount: 3150000, color: '#3B82F6', type: 'Evidence' },
    { item: 'Seized Cash Loot', amount: 480000, color: '#60A5FA', type: 'Evidence' },
    { item: 'Vault Door Damage', amount: 150000, color: '#EC4899', type: 'Damage' },
    { item: 'Gate Rammed', amount: 85000, color: '#F43F5E', type: 'Damage' },
    { item: 'CCTV Wire Cut', amount: 45000, color: '#FB7185', type: 'Damage' },
  ];

  return (
    <div className={`w-full p-3 rounded-2xl border shadow-2xl backdrop-blur-md transition-all flex flex-col gap-2 ${panelBg}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b pb-2" style={{ borderColor: isDarkMode ? '#1F2937' : '#E5E7EB' }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-xs font-black uppercase tracking-wider text-[#FF5A1F]">
            📊 Plotly Analytics Dock · {focalName}
          </span>
          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${isDarkMode ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-red-50 text-red-700 border-red-200'}`}>
            FIR KRP/2026/0456
          </span>
        </div>

        <button onClick={onClose} className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
          <X size={14} />
        </button>
      </div>

      {/* Main Dock Body */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Metric Badges */}
        <div className="md:col-span-4 grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className={`p-2 rounded-xl border flex flex-col justify-between ${isDarkMode ? 'bg-[#18181C] border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-blue-400 font-bold flex items-center justify-between">
              <span>Seized Loot</span>
              <Package size={12} />
            </div>
            <div className="text-xs font-black mt-1 text-blue-500">₹36,30,000</div>
            <div className={textSub}>420g Gold + Cash</div>
          </div>

          <div className={`p-2 rounded-xl border flex flex-col justify-between ${isDarkMode ? 'bg-[#18181C] border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-pink-400 font-bold flex items-center justify-between">
              <span>Property Damage</span>
              <AlertTriangle size={12} />
            </div>
            <div className="text-xs font-black mt-1 text-pink-500">₹2,80,000</div>
            <div className={textSub}>Vault, Gate & Wiring</div>
          </div>

          <div className={`p-2 rounded-xl border flex flex-col justify-between ${isDarkMode ? 'bg-[#18181C] border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-amber-400 font-bold flex items-center justify-between">
              <span>Affected Victims</span>
              <Users size={12} />
            </div>
            <div className="text-xs font-black mt-1 text-amber-500">4 Groups</div>
            <div className={textSub}>Anekal Family & Sandeep</div>
          </div>

          <div className={`p-2 rounded-xl border flex flex-col justify-between ${isDarkMode ? 'bg-[#18181C] border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-emerald-400 font-bold flex items-center justify-between">
              <span>Key Witnesses</span>
              <ShieldAlert size={12} />
            </div>
            <div className="text-xs font-black mt-1 text-emerald-500">4 Recorded</div>
            <div className={textSub}>Sec 161 Statements</div>
          </div>
        </div>

        {/* Minimalist Compact Plotly Chart */}
        <div className="md:col-span-8 h-[140px] w-full rounded-xl overflow-hidden border" style={{ borderColor: isDarkMode ? '#1F2937' : '#E5E7EB' }}>
          <Plot
            data={[{
              y: monetaryBreakdown.map(m => m.item),
              x: monetaryBreakdown.map(m => m.amount),
              type: 'bar' as const,
              orientation: 'h' as const,
              marker: { color: monetaryBreakdown.map(m => m.color) },
              text: monetaryBreakdown.map(m => `₹${(m.amount / 1000).toFixed(0)}K`),
              textposition: 'auto' as const,
              hoverinfo: 'y+x' as const,
            }]}
            layout={{
              autosize: true,
              margin: { l: 110, r: 25, b: 20, t: 10 },
              plot_bgcolor: bgPlot,
              paper_bgcolor: bgPlot,
              font: { color: textColor, size: 9, family: 'sans-serif' },
              xaxis: { showgrid: true, gridcolor: isDarkMode ? '#27272A' : '#E2E8F0' },
              yaxis: { automargin: true },
            }}
            style={{ width: '100%', height: '100%' }}
            config={{ responsive: true, displayModeBar: false }}
          />
        </div>
      </div>
    </div>
  );
}
