import { StateCreator } from 'zustand';
import { KSPCase } from '@/lib/data/realCases';

export interface CaseSlice {
  activeCase: KSPCase | null;
  cases: KSPCase[];
  isLoading: boolean;
  loadError: string | null;
  setActiveCase: (crimeNo: string) => void;
  fetchDataset: () => Promise<void>;
}

export const createCaseSlice: StateCreator<CaseSlice, [], [], CaseSlice> = (set, get) => ({
  activeCase: null,
  cases: [],
  isLoading: false,
  loadError: null,

  setActiveCase: (crimeNo) => {
    const { cases } = get();
    const found = cases.find(c => c.crimeNo === crimeNo);
    if (found) {
      set({ activeCase: found });
    }
  },

  fetchDataset: async () => {
    const { cases } = get();
    // Skip if already loaded
    if (cases.length > 0) return;

    set({ isLoading: true, loadError: null });
    try {
      // Fetch from the statically pre-rendered API route.
      // At build time, Next.js calls the route handler and saves the JSON response.
      // At runtime, Catalyst serves the pre-built static JSON file (no serverless function).
      const res = await fetch('/api/dataset');
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status}: ${text || 'Failed to load dataset'}`);
      }

      const data = await res.json();
      const allCases: KSPCase[] = data.allCases ?? data.representativeCases ?? [];
      
      if (allCases.length === 0) {
        throw new Error('Dataset loaded but contains no cases.');
      }

      const firstCase = allCases[0] ?? null;
      set({
        cases: allCases,
        activeCase: firstCase,
        isLoading: false,
      });
    } catch (err: any) {
      console.error('[ArcCraft] Dataset load error:', err);
      set({ isLoading: false, loadError: err.message });
    }
  }
});
