'use client';

import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, MapControl, ControlPosition } from '@vis.gl/react-google-maps';
import { motion, AnimatePresence } from 'motion/react';
import { useUIStore } from '@/lib/stores/uiStore';
import { Search, MapPin, AlertTriangle, ShieldAlert, Crosshair, Users, Activity, Layers, Filter, Eye, Navigation, BellRing } from 'lucide-react';

// Fake Data for KSP (Karnataka State Police) Crime Hotspots
const CRIME_HOTSPOTS = [
  { id: '1', lat: 13.003, lng: 77.674, title: 'KR Puram Junction', type: 'Robbery', severity: 'High', date: '12-Jul-2025', desc: 'Repeat incidents near outer ring road underpass.', status: 'Active Investigation' },
  { id: '2', lat: 12.971, lng: 77.594, title: 'MG Road Area', type: 'Assault', severity: 'Medium', date: '14-Jul-2025', desc: 'Late night altercation outside Metro station.', status: 'Resolved' },
  { id: '3', lat: 12.927, lng: 77.627, title: 'Koramangala Block 5', type: 'Theft', severity: 'Low', date: '15-Jul-2025', desc: 'Two-wheeler theft reported from residential parking.', status: 'Active Investigation' },
  { id: '4', lat: 12.935, lng: 77.536, title: 'Banashankari', type: 'Narcotics', severity: 'Critical', date: '16-Jul-2025', desc: 'Suspected drug peddling ring operation.', status: 'Under Surveillance' },
  { id: '5', lat: 13.028, lng: 77.540, title: 'Yeshwanthpur', type: 'Assault', severity: 'Medium', date: '17-Jul-2025', desc: 'Gang rivalry incident near APMC yard.', status: 'Arrests Made' },
  { id: '6', lat: 12.991, lng: 77.713, title: 'Whitefield', type: 'Cyber Crime', severity: 'Low', date: '18-Jul-2025', desc: 'Tech park ATM skimming operation.', status: 'Under Surveillance' },
];

const POLICE_STATIONS = [
  { id: 'ps-1', lat: 13.008, lng: 77.682, title: 'KR Puram PS', status: 'Active Dispatch', vehicles: 4 },
  { id: 'ps-2', lat: 12.936, lng: 77.622, title: 'Koramangala PS', status: 'Standby', vehicles: 2 },
  { id: 'ps-3', lat: 12.971, lng: 77.604, title: 'Cubbon Park PS', status: 'Active Dispatch', vehicles: 5 },
  { id: 'ps-4', lat: 13.018, lng: 77.560, title: 'Malleswaram PS', status: 'Standby', vehicles: 3 },
];

export default function GISCrimeHotspotsWorkspace() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const cardBg = isDarkMode ? 'bg-[#111827] border-gray-800' : 'bg-white border-gray-200';
  
  const [selectedHotspot, setSelectedHotspot] = useState<typeof CRIME_HOTSPOTS[0] | null>(null);
  const [activeLayer, setActiveLayer] = useState<'All' | 'Critical' | 'Stations'>('All');

  // Bangalore Coordinates
  const center = { lat: 12.9716, lng: 77.5946 };

  // Advanced dark/light mode maps styles (can use default Map ID if available)
  const mapId = isDarkMode ? "f8df1c3f9b2361ef" : "dbbb6452277d337d"; 

  // We fall back to a placeholder key if not provided (it will show watermark)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSy_dummy_key_for_preview_mode_only";

  const getMarkerColor = (severity: string) => {
    if (severity === 'Critical') return '#EF4444'; // red-500
    if (severity === 'High') return '#F97316'; // orange-500
    if (severity === 'Medium') return '#EAB308'; // yellow-500
    return '#3B82F6'; // blue-500
  };

  const filteredHotspots = CRIME_HOTSPOTS.filter(h => {
    if (activeLayer === 'Critical') return h.severity === 'Critical' || h.severity === 'High';
    return true;
  });

  return (
    <div className={`w-full min-h-[620px] rounded-2xl border grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-xl ${cardBg}`}>
      {/* SIDEBAR: INCIDENT FEED & CONTROLS */}
      <div className={`lg:col-span-3 border-r ${isDarkMode ? 'border-gray-800 bg-[#0B0F19]' : 'border-gray-200 bg-gray-50'} flex flex-col h-[620px]`}>
        <div className="p-4 border-b border-inherit">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#FF5A1F] rounded-lg flex items-center justify-center text-white shadow-lg">
              <Crosshair size={16} />
            </div>
            <div>
              <h2 className="font-bold text-sm">KSP Geo-Spatial</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Live Hotspot Feed</p>
            </div>
          </div>
          <div className="relative w-full">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search region or crime..."
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border outline-none focus:border-[#FF5A1F] ${
                isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Priority Incidents</span>
          {filteredHotspots.map(hotspot => (
            <div 
              key={hotspot.id}
              onClick={() => setSelectedHotspot(hotspot)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedHotspot?.id === hotspot.id 
                  ? (isDarkMode ? 'bg-gray-800 border-[#FF5A1F]/50 shadow-md' : 'bg-white border-[#FF5A1F]/50 shadow-md')
                  : (isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300')
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-xs font-bold">{hotspot.title}</span>
                <span className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: getMarkerColor(hotspot.severity) }} />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono mb-2">
                <span>{hotspot.type}</span> &bull; <span>{hotspot.date}</span>
              </div>
              <p className={`text-[11px] leading-relaxed line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {hotspot.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MAP VIEW */}
      <div className="lg:col-span-9 relative h-[620px]">
        <div className="absolute inset-0 z-0 bg-[#0B0F19]">
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={center}
              defaultZoom={11.5}
              mapId={mapId}
              disableDefaultUI={true}
              gestureHandling={'greedy'}
              className="w-full h-full"
            >
              
              {/* RENDER CRIME HOTSPOTS */}
              {(activeLayer === 'All' || activeLayer === 'Critical') && filteredHotspots.map((hotspot) => (
                <AdvancedMarker
                  key={hotspot.id}
                  position={{ lat: hotspot.lat, lng: hotspot.lng }}
                  onClick={() => setSelectedHotspot(hotspot)}
                >
                  <div className="relative">
                    <div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer shadow-lg transform transition-transform hover:scale-110 ${selectedHotspot?.id === hotspot.id ? 'ring-4 ring-white z-20' : 'z-10'}`} 
                      style={{ backgroundColor: getMarkerColor(hotspot.severity) }}
                    >
                      <AlertTriangle size={12} className="text-white" />
                    </div>
                    {/* Ping effect for critical */}
                    {hotspot.severity === 'Critical' && (
                      <div className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: getMarkerColor(hotspot.severity) }}></div>
                    )}
                  </div>
                </AdvancedMarker>
              ))}

              {/* RENDER POLICE STATIONS */}
              {(activeLayer === 'All' || activeLayer === 'Stations') && POLICE_STATIONS.map((station) => (
                <AdvancedMarker
                  key={station.id}
                  position={{ lat: station.lat, lng: station.lng }}
                >
                  <div className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-110">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white shadow-xl z-20">
                      <ShieldAlert size={16} className="text-white" />
                    </div>
                    <span className="mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-white text-blue-900 shadow-sm border border-blue-100 z-20 whitespace-nowrap">
                      {station.title}
                    </span>
                  </div>
                </AdvancedMarker>
              ))}

              {selectedHotspot && (
                <InfoWindow
                  position={{ lat: selectedHotspot.lat, lng: selectedHotspot.lng }}
                  onCloseClick={() => setSelectedHotspot(null)}
                  pixelOffset={[0, -20]}
                >
                  <div className="p-2 max-w-[220px] text-gray-900">
                    <div className="flex items-start justify-between mb-2 pb-2 border-b border-gray-100">
                      <h3 className="font-bold text-sm leading-tight pr-4">{selectedHotspot.title}</h3>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white bg-gray-900 whitespace-nowrap">
                        {selectedHotspot.type}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5 text-xs">
                      <p className="text-gray-600">{selectedHotspot.desc}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-gray-500 font-mono text-[10px]">Severity</span>
                        <span className="font-bold" style={{ color: getMarkerColor(selectedHotspot.severity) }}>
                          {selectedHotspot.severity}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-mono text-[10px]">Status</span>
                        <span className="font-bold text-blue-600">{selectedHotspot.status}</span>
                      </div>
                      <button className="mt-2 w-full py-1.5 rounded bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold transition-colors">
                        Deploy Unit
                      </button>
                    </div>
                  </div>
                </InfoWindow>
              )}

              {/* CUSTOM MAP CONTROLS */}
              <MapControl position={ControlPosition.TOP_RIGHT}>
                <div className="m-4 p-1.5 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-xl flex flex-col gap-1">
                  <button 
                    onClick={() => setActiveLayer('All')}
                    className={`p-2 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${activeLayer === 'All' ? 'bg-[#FF5A1F] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    title="Comprehensive View"
                  >
                    <Layers size={16} />
                  </button>
                  <button 
                    onClick={() => setActiveLayer('Critical')}
                    className={`p-2 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${activeLayer === 'Critical' ? 'bg-red-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    title="Critical Hotspots"
                  >
                    <Crosshair size={16} />
                  </button>
                  <button 
                    onClick={() => setActiveLayer('Stations')}
                    className={`p-2 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${activeLayer === 'Stations' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    title="Police Units"
                  >
                    <ShieldAlert size={16} />
                  </button>
                </div>
              </MapControl>

            </Map>
          </APIProvider>
        </div>
        
        {/* HUD OVERLAY - MAP FOOTER */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-none w-full max-w-md">
          <div className={`p-3 rounded-2xl backdrop-blur-md shadow-2xl flex items-center justify-between border ${isDarkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/90 border-gray-200'}`}>
             <div className="flex items-center gap-4 px-2">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className={`text-xs font-bold font-mono tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>LIVE KSP FEED</span>
               </div>
               <div className="w-px h-6 bg-gray-500/30" />
               <div className="flex items-center gap-1.5">
                 <Users size={14} className="text-blue-500" />
                 <span className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>14 UNITS ACTIVE</span>
               </div>
             </div>
             
             <div className="pointer-events-auto">
               <button className="p-2 bg-[#FF5A1F] hover:bg-[#e04e18] text-white rounded-xl shadow-lg transition-colors flex items-center justify-center">
                 <BellRing size={16} />
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
