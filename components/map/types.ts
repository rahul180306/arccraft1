export type CrimeCategory = 'all' | 'active' | 'cyber' | 'organized' | 'critical' | 'closed';

export type MapViewMode = 'dark' | 'tactical' | 'satellite' | 'light';

export interface DistrictData {
  id: string;
  name: string;
  code: string;
  latLng: [number, number];
  activeCasesCount: number;
  crimeDensity: 'High' | 'Medium' | 'Low';
  riskScore: number;
  primaryCrimeType: string;
  commandingOfficer: string;
  policeStations: number;
}

export interface IncidentMarker {
  id: string;
  firNumber: string;
  title: string;
  category: CrimeCategory;
  districtId: string;
  districtName: string;
  latLng: [number, number];
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  ioName: string;
  status: string;
  summary: string;
}

export interface HeatPoint {
  latLng: [number, number];
  intensity: number; // 0 to 1
  radius: number;
  type: string;
}
