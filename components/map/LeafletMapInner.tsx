'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, GeoJSON, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { DistrictData, IncidentMarker, CrimeCategory, MapViewMode } from './types';
import { KARNATAKA_DISTRICTS, INITIAL_INCIDENTS, HEATMAP_POINTS } from './data';
import { KARNATAKA_GEOJSON } from './karnatakaGeoJson';

interface LeafletMapInnerProps {
  viewMode: MapViewMode;
  showHeatmap: boolean;
  showDistricts: boolean;
  selectedCategory: CrimeCategory;
  selectedDistrict: DistrictData | null;
  onSelectDistrict: (district: DistrictData) => void;
  selectedIncident: IncidentMarker | null;
  onSelectIncident: (incident: IncidentMarker) => void;
  isDarkMode: boolean;
}

// Center of Karnataka State: Lat ~14.8, Lng ~75.8
const KARNATAKA_CENTER: [number, number] = [14.8, 75.8];
// Karnataka Bounding Box: SW [11.5, 74.0], NE [18.5, 78.6]
const KARNATAKA_BOUNDS: [[number, number], [number, number]] = [
  [11.5, 74.0],
  [18.5, 78.6]
];

// OpenStreetMap Relation 2019939 Details
const KARNATAKA_OSM_RELATION_DETAILS = {
  osm_id: 2019939,
  version: 260,
  iso3166_2: "IN-KA",
  admin_level: 4,
  boundary: "administrative",
  name: "Karnataka (ಕರ್ನಾಟಕ)",
  ref: "KA",
  lgd_code: "29",
  wikidata: "Q1185",
  wikipedia: "en:Karnataka",
  country_code: "IN"
};

// Controller component to invalidate size, set bounds, and navigate smoothly
function MapController({ 
  selectedDistrict, 
  selectedIncident 
}: { 
  selectedDistrict: DistrictData | null; 
  selectedIncident: IncidentMarker | null;
}) {
  const map = useMap();

  useEffect(() => {
    // Invalidate size immediately so Leaflet renders all tiles correctly in flex containers
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (selectedIncident) {
      map.flyTo(selectedIncident.latLng, 10, { duration: 1.2 });
    } else if (selectedDistrict) {
      map.flyTo(selectedDistrict.latLng, 9, { duration: 1.2 });
    } else {
      map.fitBounds(KARNATAKA_BOUNDS, { padding: [30, 30], animate: true });
    }
  }, [selectedDistrict, selectedIncident, map]);

  return null;
}

export default function LeafletMapInner({
  viewMode,
  showHeatmap,
  showDistricts,
  selectedCategory,
  selectedDistrict,
  onSelectDistrict,
  selectedIncident,
  onSelectIncident,
  isDarkMode
}: LeafletMapInnerProps) {
  const [osmStateBoundary, setOsmStateBoundary] = useState<any>(null);

  // Fetch real OpenStreetMap Karnataka State Boundary (Relation 2019939) from Nominatim
  useEffect(() => {
    let isMounted = true;
    fetch('https://nominatim.openstreetmap.org/lookup?osm_ids=R2019939&format=geojson&polygon_geojson=1')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data && data.type === 'FeatureCollection' && data.features.length > 0) {
          setOsmStateBoundary(data);
        }
      })
      .catch(err => {
        console.warn('Could not load OpenStreetMap relation 2019939, using fallback state boundary', err);
      });
    return () => { isMounted = false; };
  }, []);

  // Tile URL selection based on viewMode (Defaults strictly to OpenStreetMap)
  const getTileUrl = () => {
    switch (viewMode) {
      case 'tactical':
        return 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
      case 'dark':
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      case 'light':
        return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      case 'satellite':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const getCategoryColor = (category: CrimeCategory) => {
    switch (category) {
      case 'active': return '#FF5A1F';
      case 'cyber': return '#3B82F6';
      case 'organized': return '#A855F7';
      case 'critical': return '#EF4444';
      case 'closed': return '#10B981';
      default: return '#FF5A1F';
    }
  };

  // GeoJSON style for Karnataka District Boundaries
  const getGeoJsonStyle = (feature?: any) => {
    const isSelected = selectedDistrict?.id === feature?.properties?.id;
    const isHigh = feature?.properties?.riskScore > 80;

    return {
      fillColor: isSelected ? '#FF5A1F' : isHigh ? '#EF4444' : '#3B82F6',
      weight: isSelected ? 2.5 : 1.5,
      opacity: 0.85,
      color: isSelected ? '#FF5A1F' : isDarkMode ? '#475569' : '#64748B',
      dashArray: isSelected ? '' : '3',
      fillOpacity: isSelected ? 0.35 : isDarkMode ? 0.15 : 0.10
    };
  };

  // GeoJSON style for OpenStreetMap Karnataka State Border Relation 2019939
  const osmStateBorderStyle = {
    fillColor: '#FF5A1F',
    fillOpacity: 0.05,
    color: '#FF5A1F',
    weight: 3.5,
    opacity: 0.9,
    dashArray: '6, 4'
  };

  // Bind tooltip and click handlers to GeoJSON District features
  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (feature?.properties?.name) {
      layer.bindTooltip(
        `<div class="px-2 py-1 font-mono text-xs font-bold text-white bg-slate-900 border border-[#FF5A1F] rounded shadow-lg">${feature.properties.name} District</div>`,
        { sticky: true, direction: 'auto' }
      );
    }
    layer.on({
      click: () => {
        const dist = KARNATAKA_DISTRICTS.find(
          (d) => d.id === feature?.properties?.id || d.name === feature?.properties?.name
        );
        if (dist) {
          onSelectDistrict(dist);
        }
      },
      mouseover: (e: any) => {
        const l = e.target;
        l.setStyle({
          weight: 3,
          color: '#FF5A1F',
          fillOpacity: 0.4
        });
      },
      mouseout: (e: any) => {
        const l = e.target;
        l.setStyle(getGeoJsonStyle(feature));
      }
    });
  };

  // Custom HTML DivIcon for Incident Markers - Minimal Small Color Point
  const createIncidentIcon = (incident: IncidentMarker, isSelected: boolean) => {
    const color = getCategoryColor(incident.category);
    const isCritical = incident.severity === 'CRITICAL';

    const html = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 16px; height: 16px; cursor: pointer;">
        ${isCritical ? `<div style="position: absolute; inset: -2px; border-radius: 50%; background-color: ${color}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
        ${isSelected ? `<div style="position: absolute; inset: -4px; border-radius: 50%; border: 1.5px solid ${color}; opacity: 0.8;"></div>` : ''}
        <div style="
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: ${color};
          border: 2px solid #ffffff;
          box-shadow: 0 0 8px ${color}A0, 0 2px 4px rgba(0,0,0,0.5);
          transform: scale(${isSelected ? 1.3 : 1});
          transition: transform 0.15s ease;
        "></div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-incident-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  // Custom HTML DivIcon for District HQ Markers - Minimal Small Color Point
  const createDistrictIcon = (district: DistrictData, isSelected: boolean) => {
    const isHigh = district.riskScore > 80;
    const dotColor = isSelected ? '#FF5A1F' : isHigh ? '#EF4444' : '#3B82F6';

    const html = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; cursor: pointer;">
        ${isSelected ? `<div style="position: absolute; inset: -3px; border-radius: 50%; background-color: ${dotColor}; opacity: 0.35; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
        <div style="
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: ${dotColor};
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px ${dotColor}B0, 0 2px 6px rgba(0,0,0,0.6);
          transform: scale(${isSelected ? 1.35 : 1});
          transition: transform 0.15s ease;
        "></div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-district-marker',
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });
  };

  // Filter incidents
  const filteredIncidents = INITIAL_INCIDENTS.filter((inc) => {
    const catMatch = selectedCategory === 'all' || inc.category === selectedCategory;
    const distMatch = !selectedDistrict || inc.districtId === selectedDistrict.id;
    return catMatch && distMatch;
  });

  return (
    <MapContainer
      center={KARNATAKA_CENTER}
      zoom={7}
      minZoom={6}
      maxZoom={15}
      zoomControl={false}
      scrollWheelZoom={true}
      attributionControl={false}
      className="w-full h-full min-h-[520px] rounded-2xl z-0"
      style={{ background: isDarkMode ? '#0B0F19' : '#E2E8F0', height: '100%', minHeight: '520px', width: '100%' }}
    >
      <MapController 
        selectedDistrict={selectedDistrict} 
        selectedIncident={selectedIncident} 
      />

      {/* OpenStreetMap Base Tile Layer */}
      <TileLayer
        url={getTileUrl()}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* OpenStreetMap Karnataka State Border Feature (Relation 2019939) */}
      {osmStateBoundary && (
        <GeoJSON
          data={osmStateBoundary}
          style={osmStateBorderStyle}
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`
              <div class="p-2 font-sans text-xs bg-slate-900 text-white rounded-xl">
                <div class="font-extrabold text-[#FF5A1F] uppercase font-mono flex items-center gap-1.5">
                  <span>OpenStreetMap Border Feature</span>
                </div>
                <div class="text-[11px] font-bold text-gray-200 mt-1">Relation: Karnataka (2019939)</div>
                <div class="grid grid-cols-2 gap-x-3 gap-y-1 mt-2 text-[10px] font-mono border-t border-gray-800 pt-1.5 text-gray-300">
                  <div>ISO3166-2: <span class="text-amber-400 font-bold">${KARNATAKA_OSM_RELATION_DETAILS.iso3166_2}</span></div>
                  <div>admin_level: <span class="text-emerald-400 font-bold">${KARNATAKA_OSM_RELATION_DETAILS.admin_level}</span></div>
                  <div>boundary: <span class="text-indigo-400 font-bold">${KARNATAKA_OSM_RELATION_DETAILS.boundary}</span></div>
                  <div>ref: <span class="text-blue-400 font-bold">${KARNATAKA_OSM_RELATION_DETAILS.ref}</span></div>
                  <div>wikidata: <span class="text-emerald-400 font-bold">${KARNATAKA_OSM_RELATION_DETAILS.wikidata}</span></div>
                  <div>wikipedia: <span class="text-cyan-400 font-bold">${KARNATAKA_OSM_RELATION_DETAILS.wikipedia}</span></div>
                </div>
              </div>
            `, { className: 'custom-leaflet-popup' });
          }}
        />
      )}

      {/* District Boundaries GeoJSON Layer (Only if explicitly enabled) */}
      {showDistricts && (
        <GeoJSON
          data={KARNATAKA_GEOJSON}
          style={getGeoJsonStyle}
          onEachFeature={onEachFeature}
        />
      )}

      {/* District Headquarters / Markers */}
      {KARNATAKA_DISTRICTS.map((district) => {
        const isSelected = selectedDistrict?.id === district.id;
        return (
          <Marker
            key={`dist-${district.id}`}
            position={district.latLng}
            icon={createDistrictIcon(district, isSelected)}
            eventHandlers={{
              click: () => onSelectDistrict(district)
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <div className="p-2 font-sans text-xs bg-slate-900 text-white rounded-xl shadow-2xl border border-gray-700 min-w-[170px]">
                <div className="font-extrabold text-[#FF5A1F] uppercase font-mono flex items-center justify-between">
                  <span>{district.name} HQ</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${district.riskScore > 80 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                    Risk {district.riskScore}/100
                  </span>
                </div>
                <div className="text-gray-300 text-[11px] mt-1.5 font-medium">
                  Officer: <strong className="text-white">{district.commandingOfficer}</strong>
                </div>
                <div className="flex items-center justify-between text-[10px] mt-2 pt-1.5 border-t border-gray-800 text-gray-400 font-mono">
                  <span>Code: <strong className="text-amber-400">{district.code}</strong></span>
                  <span>Active FIRs: <strong className="text-emerald-400">{district.activeCasesCount}</strong></span>
                </div>
              </div>
            </Tooltip>
            <Popup className="custom-leaflet-popup">
              <div className="p-1 font-sans text-xs">
                <div className="font-extrabold text-[#FF5A1F] uppercase font-mono">{district.name} Command</div>
                <div className="text-gray-600 dark:text-gray-300 text-[11px] mt-0.5">
                  IO: <strong>{district.commandingOfficer}</strong>
                </div>
                <div className="flex items-center justify-between text-[10px] mt-1 pt-1 border-t border-gray-200 dark:border-gray-700">
                  <span>Active FIRs: <strong>{district.activeCasesCount}</strong></span>
                  <span className="text-amber-500 font-bold">Risk {district.riskScore}/100</span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Heatmap Overlay Circles */}
      {showHeatmap && HEATMAP_POINTS.map((hp, idx) => (
        <Circle
          key={`heat-${idx}`}
          center={hp.latLng}
          radius={hp.radius}
          pathOptions={{
            color: hp.intensity > 0.8 ? '#EF4444' : '#F59E0B',
            fillColor: hp.intensity > 0.8 ? '#EF4444' : '#F59E0B',
            fillOpacity: hp.intensity * 0.45,
            weight: 1
          }}
        />
      ))}

      {/* Live Incidents Pins */}
      {filteredIncidents.map((inc) => {
        const isSelected = selectedIncident?.id === inc.id;
        return (
          <Marker
            key={`inc-${inc.id}`}
            position={inc.latLng}
            icon={createIncidentIcon(inc, isSelected)}
            eventHandlers={{
              click: () => onSelectIncident(inc)
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
              <div className="p-2.5 font-sans text-xs bg-slate-900 text-white rounded-xl shadow-2xl border border-gray-700 max-w-xs">
                <div className="flex items-center justify-between gap-2 font-mono text-[10px] font-bold text-[#FF5A1F]">
                  <span>{inc.firNumber}</span>
                  <span className={`px-1.5 py-0.2 rounded border text-[9px] uppercase ${
                    inc.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    inc.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>{inc.severity}</span>
                </div>
                <div className="font-bold text-white mt-1 text-xs leading-snug">
                  {inc.title}
                </div>
                <p className="text-[11px] text-gray-300 mt-1 leading-relaxed line-clamp-2">
                  {inc.summary}
                </p>
                <div className="mt-2 pt-1.5 border-t border-gray-800 text-[10px] text-emerald-400 font-mono font-bold flex items-center justify-between">
                  <span>Status: {inc.status}</span>
                  <span className="text-gray-400 font-sans font-normal text-[9px]">Click for detail</span>
                </div>
              </div>
            </Tooltip>
            <Popup className="custom-leaflet-popup">
              <div className="p-1 font-sans text-xs max-w-xs">
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#FF5A1F]">
                  <span>{inc.firNumber}</span>
                  <span className="bg-red-500/10 text-red-500 px-1.5 py-0.2 rounded">{inc.severity}</span>
                </div>
                <div className="font-bold text-gray-900 dark:text-white mt-1 leading-tight">
                  {inc.title}
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-300 mt-1 leading-snug">
                  {inc.summary}
                </p>
                <div className="mt-2 text-[10px] text-emerald-600 font-mono font-bold">
                  Status: {inc.status}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
