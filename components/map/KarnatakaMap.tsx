'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  MapPin, 
  AlertTriangle, 
  UserCheck, 
  FileText, 
  ExternalLink,
  X,
  Compass,
  Radio,
  Building2,
  Loader2
} from 'lucide-react';

import { DistrictData, IncidentMarker, CrimeCategory, MapViewMode } from './types';
import { KARNATAKA_DISTRICTS, INITIAL_INCIDENTS } from './data';
import MapToolbar from './MapToolbar';
import TimelineScrubber from './TimelineScrubber';

// Dynamically import LeafletMapInner with SSR disabled to prevent Leaflet window errors
const LeafletMapInner = dynamic(() => import('./LeafletMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[520px] flex flex-col items-center justify-center bg-[#0B0F19] text-white gap-3 rounded-2xl border border-gray-800">
      <Loader2 size={28} className="animate-spin text-[#FF5A1F]" />
      <div className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
        Loading Karnataka State Leaflet Command Map...
      </div>
    </div>
  )
});

interface KarnatakaMapProps {
  isDarkMode: boolean;
  onSelectDistrict?: (district: DistrictData | null) => void;
  onSelectIncident?: (incident: IncidentMarker) => void;
  onShowToast?: (msg: string) => void;
}

export default function KarnatakaMap({
  isDarkMode,
  onSelectDistrict,
  onSelectIncident,
  onShowToast
}: KarnatakaMapProps) {
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<MapViewMode>('dark');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showDistricts, setShowDistricts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CrimeCategory>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IncidentMarker | null>(null);

  const handleDistrictSelect = (district: DistrictData) => {
    if (selectedDistrict?.id === district.id) {
      setSelectedDistrict(null);
      if (onSelectDistrict) onSelectDistrict(null);
      if (onShowToast) onShowToast('Cleared District Selection');
    } else {
      setSelectedDistrict(district);
      if (onSelectDistrict) onSelectDistrict(district);
      if (onShowToast) onShowToast(`Focused District Command: ${district.name}`);
    }
  };

  const handleIncidentSelect = (incident: IncidentMarker) => {
    setSelectedIncident(incident);
    if (onSelectIncident) onSelectIncident(incident);
    if (onShowToast) onShowToast(`Focused Incident: ${incident.firNumber}`);
  };

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden border transition-all flex flex-col ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-[#0B0F19]' : ''
    } ${
      isDarkMode 
        ? 'bg-[#0B0F19] border-gray-800 text-white shadow-2xl' 
        : 'bg-[#F1F5F9] border-slate-300 text-slate-900 shadow-xl'
    }`}>

      {/* Top Map Toolbar */}
      <div className="p-3 z-20">
        <MapToolbar
          zoom={zoom}
          onZoomIn={() => setZoom((z) => Math.min(z + 0.2, 2))}
          onZoomOut={() => setZoom((z) => Math.max(z - 0.2, 0.8))}
          onResetZoom={() => { setZoom(1); setSelectedDistrict(null); setSelectedIncident(null); }}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          showHeatmap={showHeatmap}
          onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
          showDistricts={showDistricts}
          onToggleDistricts={() => setShowDistricts(!showDistricts)}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Hero Interactive Leaflet Map Container */}
      <div className="relative h-[560px] sm:h-[620px] w-full p-3 overflow-hidden select-none">
        
        {/* Live Status Overlay Pill */}
        <div className="absolute top-6 left-6 z-10 flex items-center gap-3 bg-[#0F172A]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-gray-800 pointer-events-auto shadow-xl">
          <div className="relative">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F] block" />
            <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#FF5A1F] animate-ping opacity-75" />
          </div>
          <div>
            <div className="text-[11px] font-black tracking-wide text-white font-mono uppercase flex items-center gap-1.5">
              <span>OpenStreetMap GIS</span>
              <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded-full font-mono">
                OSM RELATION 2019939
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono">Karnataka Border • ISO3166-2: IN-KA • Admin Level 4</p>
          </div>
        </div>

        {/* Real Leaflet Map Render */}
        <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-800/80 shadow-inner">
          <LeafletMapInner
            viewMode={viewMode}
            showHeatmap={showHeatmap}
            showDistricts={showDistricts}
            selectedCategory={selectedCategory}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={handleDistrictSelect}
            selectedIncident={selectedIncident}
            onSelectIncident={handleIncidentSelect}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Selected District Floating Quick Info */}
        <AnimatePresence>
          {selectedDistrict && !selectedIncident && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="absolute bottom-6 left-6 z-20 bg-[#0F172A]/95 backdrop-blur-2xl border border-gray-700/90 p-4 rounded-2xl shadow-2xl w-72 text-white border-l-4 border-l-[#FF5A1F]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black tracking-wide text-white font-mono flex items-center gap-1.5">
                  <Building2 size={14} className="text-[#FF5A1F]" />
                  {selectedDistrict.name} HQ
                </span>
                <button
                  onClick={() => setSelectedDistrict(null)}
                  className="p-1 hover:bg-gray-800 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-300 font-medium mb-2">
                <div>
                  <span className="text-gray-500 block text-[9px] uppercase font-mono">Commanding IO</span>
                  <span className="font-extrabold text-white">{selectedDistrict.commandingOfficer}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[9px] uppercase font-mono">Risk Index</span>
                  <span className="font-bold text-amber-400">{selectedDistrict.riskScore}/100</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-800 text-[10px] text-gray-400 flex items-center justify-between font-mono">
                <span>{selectedDistrict.activeCasesCount} Active Cases</span>
                <span className="text-emerald-400 font-bold">{selectedDistrict.policeStations} PS Units</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Incident Detail Floating Card */}
        <AnimatePresence>
          {selectedIncident && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="absolute bottom-6 right-6 z-30 bg-[#0F172A]/98 backdrop-blur-2xl border border-gray-700 shadow-2xl p-5 rounded-3xl w-full max-w-md text-white border-l-4 border-l-[#FF5A1F]"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-mono tracking-wider text-[#FF5A1F]">
                      {selectedIncident.firNumber}
                    </span>
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full uppercase border ${
                      selectedIncident.severity === 'CRITICAL' 
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {selectedIncident.severity}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                    {selectedIncident.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedIncident(null)}
                  className="p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed mb-4 bg-gray-900/60 p-3 rounded-xl border border-gray-800">
                {selectedIncident.summary}
              </p>

              <div className="grid grid-cols-2 gap-3 text-[11px] mb-4 font-mono">
                <div className="bg-gray-900/40 p-2.5 rounded-xl border border-gray-800">
                  <span className="text-gray-500 block text-[9px] uppercase">Investigating Officer</span>
                  <span className="font-bold text-gray-200">{selectedIncident.ioName}</span>
                </div>
                <div className="bg-gray-900/40 p-2.5 rounded-xl border border-gray-800">
                  <span className="text-gray-500 block text-[9px] uppercase">Live AI Status</span>
                  <span className="font-bold text-emerald-400">{selectedIncident.status}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                  <MapPin size={12} className="text-[#FF5A1F]" /> {selectedIncident.districtName}
                </span>

                <button
                  onClick={() => {
                    if (onShowToast) onShowToast(`Opening full investigation dossier for ${selectedIncident.firNumber}`);
                    setSelectedIncident(null);
                  }}
                  className="px-3.5 py-2 bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-[#FF5A1F]/20 cursor-pointer transition-transform hover:scale-105"
                >
                  <span>Open Dossier</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Bottom Floating Timeline Scrubber */}
      <div className="p-3 z-20">
        <TimelineScrubber
          isDarkMode={isDarkMode}
          onTimeframeChange={(timeframe) => {
            if (onShowToast) onShowToast(`Filtered Timeline: ${timeframe.toUpperCase()}`);
          }}
        />
      </div>

    </div>
  );
}
