'use client';

import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Flame, 
  Maximize2, 
  Filter,
  Eye,
  Globe
} from 'lucide-react';
import { CrimeCategory, MapViewMode } from './types';

interface MapToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  viewMode: MapViewMode;
  onChangeViewMode: (mode: MapViewMode) => void;
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
  showDistricts: boolean;
  onToggleDistricts: () => void;
  selectedCategory: CrimeCategory;
  onSelectCategory: (cat: CrimeCategory) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isDarkMode: boolean;
}

export default function MapToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  viewMode,
  onChangeViewMode,
  showHeatmap,
  onToggleHeatmap,
  showDistricts,
  onToggleDistricts,
  selectedCategory,
  onSelectCategory,
  isFullscreen,
  onToggleFullscreen,
  isDarkMode
}: MapToolbarProps) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl backdrop-blur-xl border transition-all ${
      isDarkMode 
        ? 'bg-[#0F172A]/90 border-gray-800 text-white shadow-2xl' 
        : 'bg-white/90 border-slate-200 text-slate-800 shadow-lg'
    }`}>
      {/* Crime Category Filter Chips */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
          <Filter size={12} className="text-[#FF5A1F]" />
          <span>Filter:</span>
        </div>

        {(['all', 'active', 'cyber', 'organized', 'critical', 'closed'] as CrimeCategory[]).map((cat) => {
          const isActive = selectedCategory === cat;
          const labels: Record<CrimeCategory, string> = {
            all: 'All (9)',
            active: 'Active',
            cyber: 'Cyber',
            organized: 'Organized',
            critical: 'Critical',
            closed: 'Closed'
          };
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold tracking-wide uppercase transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#FF5A1F] text-white shadow-md shadow-[#FF5A1F]/30 scale-105'
                  : isDarkMode
                  ? 'bg-gray-800/80 hover:bg-gray-700 text-gray-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {labels[cat]}
            </button>
          );
        })}
      </div>

      {/* Right Control Actions */}
      <div className="flex items-center gap-1.5 shrink-0 ml-auto">
        {/* Heatmap Toggle Button */}
        <button
          onClick={onToggleHeatmap}
          title="Toggle Crime Density Heatmap"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold uppercase transition-all cursor-pointer border ${
            showHeatmap
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-sm'
              : isDarkMode
              ? 'bg-gray-800/70 border-gray-700/60 hover:bg-gray-700 text-gray-300'
              : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Flame size={13} className={showHeatmap ? 'text-amber-400 animate-pulse' : 'text-gray-400'} />
          <span className="hidden sm:inline">Heatmap</span>
        </button>

        {/* District Boundaries Toggle */}
        <button
          onClick={onToggleDistricts}
          title="Toggle District Boundaries"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold uppercase transition-all cursor-pointer border ${
            showDistricts
              ? 'bg-[#FF5A1F]/20 border-[#FF5A1F]/50 text-[#FF5A1F]'
              : isDarkMode
              ? 'bg-gray-800/70 border-gray-700/60 text-gray-400 hover:bg-gray-700'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Eye size={13} />
          <span className="hidden sm:inline">Districts</span>
        </button>

        {/* View Layer Selector (Dark, Tactical, Light) */}
        <div className="flex items-center bg-gray-800/50 p-0.5 rounded-xl border border-gray-700/60">
          {(['dark', 'tactical', 'light'] as MapViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onChangeViewMode(mode)}
              title={`${mode.toUpperCase()} Map Mode`}
              className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer ${
                viewMode === mode
                  ? 'bg-[#FF5A1F] text-white shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-0.5 bg-gray-800/50 p-0.5 rounded-xl border border-gray-700/60">
          <button
            onClick={onZoomIn}
            title="Zoom In"
            className="p-1.5 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <ZoomIn size={13} />
          </button>
          <span className="text-[9px] font-mono font-bold text-gray-400 px-1">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomOut}
            title="Zoom Out"
            className="p-1.5 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <ZoomOut size={13} />
          </button>
          <button
            onClick={onResetZoom}
            title="Reset Zoom"
            className="p-1.5 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
          </button>
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          title="Toggle Fullscreen Map View"
          className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
            isFullscreen
              ? 'bg-[#FF5A1F] text-white border-[#FF5A1F]'
              : isDarkMode
              ? 'bg-gray-800/70 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Maximize2 size={13} />
        </button>
      </div>
    </div>
  );
}
