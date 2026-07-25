import { create } from 'zustand';

export interface UIState {
  // Theme & Navigation
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  activeTab: string;
  
  // Modals & Drawers
  isCommandPaletteOpen: boolean;
  isVoiceModalOpen: boolean;
  isCopilotOpen: boolean;
  copilotInitialPrompt: string;
  isContinueModalOpen: boolean;
  isDockExpanded: boolean;
  isFIRSwitcherOpen: boolean;

  // Toast
  toastMsg: string | null;

  // Actions
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setVoiceModalOpen: (open: boolean) => void;
  openCopilot: (prompt?: string) => void;
  closeCopilot: () => void;
  setContinueModalOpen: (open: boolean) => void;
  setDockExpanded: (expanded: boolean) => void;
  openFIRSwitcher: () => void;
  closeFIRSwitcher: () => void;
  showToast: (msg: string) => void;
}

let toastTimer: NodeJS.Timeout | null = null;

export const useUIStore = create<UIState>((set) => ({
  isDarkMode: false,
  isSidebarOpen: true,
  activeTab: 'Dashboard',

  isCommandPaletteOpen: false,
  isVoiceModalOpen: false,
  isCopilotOpen: false,
  copilotInitialPrompt: '',
  isContinueModalOpen: false,
  isDockExpanded: false,
  isFIRSwitcherOpen: false,

  toastMsg: null,

  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setVoiceModalOpen: (open) => set({ isVoiceModalOpen: open }),
  
  openCopilot: (prompt = '') => set({ isCopilotOpen: true, copilotInitialPrompt: prompt }),
  closeCopilot: () => set({ isCopilotOpen: false }),
  
  setContinueModalOpen: (open) => set({ isContinueModalOpen: open }),
  setDockExpanded: (expanded) => set({ isDockExpanded: expanded }),
  openFIRSwitcher: () => set({ isFIRSwitcherOpen: true }),
  closeFIRSwitcher: () => set({ isFIRSwitcherOpen: false }),

  showToast: (msg) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toastMsg: msg });
    toastTimer = setTimeout(() => {
      set({ toastMsg: null });
    }, 3000);
  }
}));
