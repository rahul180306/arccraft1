'use client';

import React, { useState } from 'react';
import {
  ZoomIn, ZoomOut, Maximize2, Download, RefreshCw, Search,
  GitBranch, Circle, LayoutList, Share2, Layers, Send, X
} from 'lucide-react';

type LayoutOption = 'cose' | 'concentric' | 'circle' | 'breadthfirst' | 'grid';

interface GraphToolbarProps {
  isDarkMode: boolean;
  currentLayout: LayoutOption;
  onLayoutChange: (layout: LayoutOption) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onExportPNG: () => void;
  onSearch: (query: string) => void;
  onAIQuery: (query: string) => void;
  nodeCount: number;
  edgeCount: number;
}

const LAYOUTS: Array<{ id: LayoutOption; label: string; icon: React.ReactNode; desc: string }> = [
  { id: 'cose', label: 'Force', icon: <Share2 size={12} />, desc: 'Force-Directed (CoSE)' },
  { id: 'concentric', label: 'Concentric', icon: <Circle size={12} />, desc: 'Concentric Rings' },
  { id: 'breadthfirst', label: 'BFS', icon: <GitBranch size={12} />, desc: 'Breadth-First Tree' },
  { id: 'circle', label: 'Circle', icon: <LayoutList size={12} />, desc: 'Circular Layout' },
  { id: 'grid', label: 'Grid', icon: <Layers size={12} />, desc: 'Grid Layout' },
];


export default function GraphToolbar({
  isDarkMode, currentLayout, onLayoutChange, onZoomIn, onZoomOut,
  onFit, onExportPNG, onSearch, onAIQuery, nodeCount, edgeCount
}: GraphToolbarProps) {
  const [searchValue, setSearchValue] = useState('');
  const [aiQuery, setAIQuery] = useState('');
  const [showAIBar, setShowAIBar] = useState(false);

  const toolbarBg = isDarkMode ? 'bg-[#111115] border-gray-800' : 'bg-white border-gray-200';
  const btnBase = isDarkMode
    ? 'border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-gray-100'
    : 'border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-gray-900';

  const handleSearch = (val: string) => {
    setSearchValue(val);
    onSearch(val);
  };

  const handleAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    onAIQuery(aiQuery);
    setAIQuery('');
    setShowAIBar(false);
  };

  return (
    <div className={`absolute top-0 left-0 right-0 z-10 flex flex-col border-b ${toolbarBg} shadow-sm`}>
      {/* Main Toolbar Row */}
      <div className="flex items-center gap-2 px-3 py-2">
        
        {/* Layout Selector */}
        <div className={`flex items-center gap-0.5 p-0.5 rounded-lg border ${isDarkMode ? 'bg-[#18181C] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
          {LAYOUTS.map(l => (
            <button
              key={l.id}
              onClick={() => onLayoutChange(l.id)}
              title={l.desc}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-black transition-all ${
                currentLayout === l.id
                  ? 'bg-[#FF5A1F] text-white shadow-sm'
                  : `${isDarkMode ? 'text-gray-400 hover:text-gray-100' : 'text-gray-500 hover:text-gray-900'}`
              }`}
            >
              {l.icon}
              <span className="hidden sm:inline">{l.label}</span>
            </button>
          ))}
        </div>

        <div className={`w-px h-5 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />

        {/* Search */}
        <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs ${isDarkMode ? 'bg-[#18181C] border-gray-800' : 'bg-white border-gray-300'} flex-1 max-w-[200px]`}>
          <Search size={11} className={isDarkMode ? 'text-gray-500 shrink-0' : 'text-gray-400 shrink-0'} />
          <input
            type="text"
            placeholder="Search entity..."
            value={searchValue}
            onChange={e => handleSearch(e.target.value)}
            className={`w-full bg-transparent text-xs font-bold outline-none placeholder-gray-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
          />
          {searchValue && (
            <button onClick={() => handleSearch('')}>
              <X size={10} className="text-gray-500" />
            </button>
          )}
        </div>

        <div className={`w-px h-5 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} hidden sm:block`} />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button onClick={onZoomIn} title="Zoom In" className={`p-1.5 rounded-lg border transition-all ${btnBase}`}>
            <ZoomIn size={13} />
          </button>
          <button onClick={onZoomOut} title="Zoom Out" className={`p-1.5 rounded-lg border transition-all ${btnBase}`}>
            <ZoomOut size={13} />
          </button>
          <button onClick={onFit} title="Fit All" className={`p-1.5 rounded-lg border transition-all ${btnBase}`}>
            <Maximize2 size={13} />
          </button>
        </div>

        <div className={`w-px h-5 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} hidden md:block`} />

        <div className="flex items-center gap-1 ml-auto">
          <button onClick={onExportPNG} title="Export PNG" className={`p-1.5 rounded-lg border transition-all ${btnBase}`}>
            <Download size={13} />
          </button>
          <button
            onClick={() => setShowAIBar(v => !v)}
            title="AI Intelligence Query"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-black transition-all border ${
              showAIBar
                ? 'bg-[#FF5A1F] text-white border-[#FF5A1F]'
                : `bg-[#FF5A1F]/10 text-[#FF5A1F] border-[#FF5A1F]/30 hover:bg-[#FF5A1F]/20`
            }`}
          >
            <i className="fi fi-ss-brain-circuit text-xs flex items-center"></i>
            <span className="hidden sm:inline">AI Query</span>
          </button>
        </div>

        {/* Stats */}
        <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono font-bold ml-1">
          <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>
            {nodeCount}N · {edgeCount}E
          </span>
        </div>
      </div>

      {/* AI Query Bar */}
      {showAIBar && (
        <form
          onSubmit={handleAISubmit}
          className={`flex items-center gap-2 px-3 py-2 border-t ${isDarkMode ? 'border-gray-800 bg-[#0E0E10]' : 'border-gray-100 bg-orange-50/50'}`}
        >
          <i className="fi fi-ss-brain-circuit text-xs text-[#FF5A1F] flex items-center shrink-0"></i>
          <input
            type="text"
            autoFocus
            placeholder='e.g. "Show connections within 2 hops of Suresh K." or "Highlight all vehicles"'
            value={aiQuery}
            onChange={e => setAIQuery(e.target.value)}
            className={`flex-1 bg-transparent text-xs font-bold outline-none placeholder-gray-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
          />
          <button type="submit" className="p-1.5 rounded-lg bg-[#FF5A1F] text-white hover:bg-[#e04e18] transition-colors">
            <Send size={12} />
          </button>
          <button type="button" onClick={() => setShowAIBar(false)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
            <X size={12} />
          </button>
        </form>
      )}
    </div>
  );
}
