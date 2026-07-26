import { StateCreator } from 'zustand';
import { KSPCase } from '@/lib/data/realCases';

// Import the dataset at build-time so it's bundled with the app JS.
// No fetch, no filesystem, no runtime dependencies — works in ANY hosting environment.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const rawDataset = require('../../../ksp_dataset_extracted.json');
const bundledCases: KSPCase[] = rawDataset.allCases ?? rawDataset.representativeCases ?? [];

export interface CaseSlice {
  activeCase: KSPCase | null;
  cases: KSPCase[];
  isLoading: boolean;
  loadError: string | null;
  setActiveCase: (crimeNo: string) => void;
  fetchDataset: () => Promise<void>;
}

export const createCaseSlice: StateCreator<CaseSlice, [], [], CaseSlice> = (set, get) => ({
  // Initialize cases immediately — no async loading needed
  activeCase: bundledCases[0] ?? null,
  cases: bundledCases,
  isLoading: false,
  loadError: null,

  setActiveCase: (crimeNo) => {
    const { cases } = get();
    const found = cases.find(c => c.crimeNo === crimeNo);
    if (found) set({ activeCase: found });
  },

  fetchDataset: async () => {
    // Data is already loaded synchronously from the bundled JSON.
    // This is a no-op kept for API compatibility.
    return;
  }
});
