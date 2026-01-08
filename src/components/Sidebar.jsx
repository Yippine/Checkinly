import React, { useState } from 'react';
import { LayoutDashboard, FileText, Users, Settings, Palette, Activity, X } from 'lucide-react';

const Sidebar = ({ isOpen = true, onClose, activeTab = 'dashboard', setActiveTab }) => {
  // Map activeTab to navItems index
  const tabToIndex = {
    'dashboard': 0,
    'attendance': 1,
    'burnout-assessment': 2,
    'demo-eap': 3,
    'employees': 4,
    'settings': 5,
  };

  const indexToTab = ['dashboard', 'attendance', 'burnout-assessment', 'demo-eap', 'employees', 'settings'];

  const navItems = [
    { icon: LayoutDashboard, label: '儀表板', tab: 'dashboard' },
    { icon: FileText, label: '出勤明細', tab: 'attendance' },
    { icon: Activity, label: '倦怠評估', tab: 'burnout-assessment' },
    { icon: Palette, label: '設計參考 (EAP)', tab: 'demo-eap', badge: 'DEMO' },
    { icon: Users, label: '員工管理', tab: 'employees' },
    { icon: Settings, label: '設定', tab: 'settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-modal-backdrop lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-border-light dark:border-slate-700 z-modal shadow-drawer dark:shadow-slate-900/80
          transition-transform duration-300 ease-ant
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="navigation"
        aria-label="主導航"
      >
        {/* Close Button (Mobile Only) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 hover:bg-neutral-50 rounded-lg transition-all duration-150 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="關閉選單"
        >
          <X size={20} />
        </button>

        {/* Logo Header */}
        <div className="h-16 flex items-center px-6 border-b border-border-light dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="bg-primary-500 p-2 rounded-lg text-white shadow-sm transition-transform duration-200 hover:scale-110">
            <LayoutDashboard size={18} />
          </div>
          <h1 className="ml-3 text-base font-semibold text-slate-900 dark:text-slate-100 dark:text-slate-100">工時分析系統</h1>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 px-3">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (setActiveTab) setActiveTab(item.tab);
                  if (onClose) onClose(); // Close sidebar on mobile after selection
                }}
                className={`
                  w-full px-3 py-2 mb-1 flex items-center gap-3 rounded-lg
                  transition-all duration-150 ease-in-out text-sm font-medium
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900
                  ${isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 dark:text-slate-400 hover:bg-neutral-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:text-slate-100 dark:hover:text-primary-400'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  size={20}
                  className={`transition-colors duration-150 ${isActive ? 'text-primary-500' : 'text-slate-500 dark:text-slate-400'}`}
                />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-warning-500 text-white rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      {/* Bottom Section (Optional) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border-light dark:border-slate-700">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold">
            HR
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 dark:text-slate-100 truncate">HR Manager</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400">系統管理員</p>
          </div>
        </div>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
