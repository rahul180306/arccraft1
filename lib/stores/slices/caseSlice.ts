import { StateCreator } from 'zustand';
import { KSPCase } from '@/lib/data/realCases';
import rawDataset from '@/ksp_dataset_extracted.json';

export interface CaseSlice {
  activeCase: KSPCase | null;
  cases: KSPCase[];
  isLoading: boolean;
  loadError: string | null;
  setActiveCase: (crimeNo: string) => void;
  fetchDataset: () => Promise<void>;
}

// Pre-parse the bundled dataset at module load time
const bundledCases: KSPCase[] = (rawDataset as any).allCases ?? (rawDataset as any).representativeCases ?? [];
console.log(`[ArcCraft v5] Dataset bundled: ${bundledCases.length} cases loaded from embedded JSON`);

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
      if (bundledCases.length === 0) {
        throw new Error('Bundled dataset is empty. Build may have failed to include ksp_dataset_extracted.json.');
      }
      const firstCase = bundledCases[0] ?? null;
      set({
        cases: bundledCases,
        activeCase: firstCase,
        isLoading: false,
      });
    } catch (err: any) {
      set({ isLoading: false, loadError: err.message });
    }
  }
});
