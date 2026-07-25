import { create } from 'zustand';
import { createCaseSlice, CaseSlice } from './slices/caseSlice';
import { createSelectionSlice, SelectionSlice } from './slices/selectionSlice';

export type InvestigationState = CaseSlice & SelectionSlice;

export const useInvestigationStore = create<InvestigationState>()((...a) => ({
  ...createCaseSlice(...a),
  ...createSelectionSlice(...a)
}));
