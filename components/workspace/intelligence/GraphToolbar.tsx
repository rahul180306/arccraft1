'use client';

import React, { useState } from 'react';
import { Search, Send, X, Sparkles } from 'lucide-react';

interface GraphToolbarProps {
  isDarkMode: boolean;
  onSearch: (query: string) => void;
  onAIQuery: (query: string) => void;
  nodeCount?: number;
  edgeCount?: number;
  // Legacy props kept for backward compatibility (no-op)
  currentLayout?: string;
  onLayoutChange?: (layout: string) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFit?: () => void;
  onExportPNG?: () => void;
  showPlotlyDock?: boolean;
  onTogglePlotlyDock?: () => void;
}

export default function GraphToolbar({
  isDarkMode, onSearch, onAIQuery, nodeCount = 0, edgeCount = 0,
}: GraphToolbarProps) {
  const [searchValue, setSearchValue] = useState('');
  const [aiQuery, setAIQuery] = useState('');
  const [showAIBar, setShowAIBar] = useState(false);

  const toolbarBg = isDarkMode ? 'bg-[#111115] border-gray-800' : 'bg-white border-gray-200';
  const inputBg   = isDarkMode ? 'bg-[#18181C] border-gray-800 text-gray-200' : 'bg-white border-gray-300 text-gray-800';

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
    <div className={`flex flex-col border-b shadow-sm ${toolbarBg}`}>
      {/* Main Toolbar Row */}
      <div className="flex items-center gap-2 px-3 py-2 h-[44px]">

        {/* Brand / Context label */}
        <div className={`flex items-center gap-1.5 text-[10px] font-mono font-black ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span className="hidden sm:inline uppercase tracking-widest">Intel Graph</span>
          <span className={`px-1.5 py-0.5 rounded text-[8px] border font-black ${isDarkMode ? 'border-gray-800 bg-[#18181C]' : 'border-gray-200 bg-gray-50'}`}>
            {nodeCount}N · {edgeCount}E
          </span>
        </div>

        <div className={`w-px h-5 mx-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />

        {/* Search */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs flex-1 max-w-[240px] ${inputBg}`}>
          <Search size={11} className={isDarkMode ? 'text-gray-500 shrink-0' : 'text-gray-400 shrink-0'} />
          <input
            type="text"
            placeholder="Search entity, category…"
            value={searchValue}
            onChange={e => handleSearch(e.target.value)}
            className="w-full bg-transparent text-xs font-medium outline-none placeholder-gray-500"
          />
          {searchValue && (
            <button onClick={() => handleSearch('')} className="shrink-0">
              <X size={10} className="text-gray-400 hover:text-red-400 transition-colors" />
            </button>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* AI Query Button */}
        <button
          onClick={() => setShowAIBar(v => !v)}
          title="AI Intelligence Query"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all border ${
            showAIBar
              ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-md shadow-orange-500/20'
              : `bg-[#FF5A1F]/10 text-[#FF5A1F] border-[#FF5A1F]/30 hover:bg-[#FF5A1F]/20`
          }`}
        >
          <Sparkles size={11} />
          <span className="hidden sm:inline">AI Query</span>
        </button>
      </div>

      {/* AI Query Bar (expandable) */}
      {showAIBar && (
        <form
          onSubmit={handleAISubmit}
          className={`flex items-center gap-2 px-3 py-2 border-t ${isDarkMode ? 'border-gray-800 bg-[#0E0E10]' : 'border-gray-100 bg-orange-50/60'}`}
        >
          <Sparkles size={12} className="text-[#FF5A1F] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder='e.g. "Show all witnesses" · "Highlight evidence" · "Show locations only"'
            value={aiQuery}
            onChange={e => setAIQuery(e.target.value)}
            className={`flex-1 bg-transparent text-xs font-medium outline-none placeholder-gray-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
          />
          <button
            type="submit"
            className="p-1.5 rounded-lg bg-[#FF5A1F] text-white hover:bg-[#e04e18] transition-colors"
          >
            <Send size={12} />
          </button>
          <button
            type="button"
            onClick={() => setShowAIBar(false)}
            className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
          >
            <X size={12} />
          </button>
        </form>
      )}
    </div>
  );
}
