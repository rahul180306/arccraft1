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
      const res = await fetch('/api/dataset');
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

      const data = await res.json();
      const allCases: KSPCase[] = data.allCases ?? [];
      const firstCase = allCases[0] ?? null;

      set({
        cases: allCases,
        activeCase: firstCase,
        isLoading: false,
      });
    } catch (err: any) {
      set({ isLoading: false, loadError: err.message });
    }
  }
});
