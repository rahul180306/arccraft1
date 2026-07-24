'use client';

import React from 'react';
import { LayoutDashboard, Briefcase, Sparkles, FileText, Settings } from 'lucide-react';
import { useUIStore } from '@/lib/stores/uiStore';

export default function MobileNav() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const openCopilot = useUIStore((s) => s.openCopilot);

  const items = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Investigations', icon: Briefcase },
    { name: 'AI Copilot ⭐', icon: Sparkles },
    { name: 'Evidence Locker', icon: FileText },
    { name: 'Settings', icon: Settings }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 px-4 py-2 flex items-center justify-around">
      {items.map((item) => {
        const IconComp = item.icon;
        const isActive = activeTab === item.name;
        return (
          <button
            key={item.name}
            onClick={() => {
              if (item.name === 'AI Copilot ⭐') {
                openCopilot();
              } else {
                setActiveTab(item.name);
              }
            }}
            className={`flex flex-col items-center gap-1 text-[9px] font-bold uppercase transition-colors ${
              isActive ? 'text-[#FF5A1F]' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <IconComp size={18} />
            <span>{item.name.replace(' ⭐', '')}</span>
          </button>
        );
      })}
    </div>
  );
}
