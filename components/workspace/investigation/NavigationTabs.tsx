import React from 'react';
import { motion } from 'motion/react';
import { pageItemVariants } from '@/lib/motion';

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabsList: string[];
  isDarkMode: boolean;
  showToast: (msg: string) => void;
}

export default function NavigationTabs({ activeTab, setActiveTab, tabsList, isDarkMode, showToast }: NavigationTabsProps) {
  return (
    <motion.div variants={pageItemVariants} className={`border-b ${isDarkMode ? 'border-[#1F2937]' : 'border-[#E2E8F0]'}`}>
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
        {tabsList.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                showToast(`Switched to tab: ${tab}`);
              }}
              className={`px-4 py-2 text-xs font-bold transition-all relative shrink-0 cursor-pointer ${
                isActive
                  ? 'text-[#FF5A1F]'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5A1F] rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
