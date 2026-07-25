import { StateCreator } from 'zustand';

export interface SelectionSlice {
  selectedDistrict: string | null;
  setSelectedDistrict: (district: string | null) => void;
}

export const createSelectionSlice: StateCreator<SelectionSlice, [], [], SelectionSlice> = (set) => ({
  selectedDistrict: null,
  setSelectedDistrict: (district) => {
    set({ selectedDistrict: district });
  }
});
