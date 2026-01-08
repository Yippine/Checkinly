import React from 'react';
import { BarChart3, Calendar, Menu } from 'lucide-react';
import ThemeToggleButton from './ThemeToggleButton';

const Header = ({ fileName, onMenuClick, darkMode, onToggleDarkMode }) => {
  return (
    <header
      className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white dark:bg-slate-900 border-b border-border-light dark:border-slate-700 shadow-sm z-sticky transition-all duration-300"
      role="banner"
    >
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Mobile Menu + Brand + Title */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="選單"
          >
            <Menu size={24} strokeWidth={2} />
          </button>

          {/* Brand Icon */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-lg text-white shadow-sm transition-transform duration-200 hover:scale-105">
            <BarChart3 size={20} strokeWidth={2} />
          </div>

          {/* Title */}
          <div className="hidden sm:block">
            <h1 className="text-heading-2 text-slate-900 dark:text-slate-100 dark:text-slate-100 font-semibold">
              工時分析管理系統
            </h1>
            {fileName && (
              <p className="text-caption text-slate-500 dark:text-slate-400 dark:text-slate-400 hidden md:block">
                當前檔案: {fileName}
              </p>
            )}
          </div>

          {/* Mobile Title (Abbreviated) */}
          <h1 className="sm:hidden text-base font-semibold text-slate-900 dark:text-slate-100 dark:text-slate-100">
            工時分析
          </h1>
        </div>

        {/* Right: Date Range Picker + Theme Toggle */}
        <div className="flex items-center gap-3">
          <button
            className="
              flex items-center gap-2 px-3 sm:px-4 py-2
              bg-white dark:bg-slate-800 border border-border-default dark:border-slate-600 rounded-base
              text-body text-slate-600 dark:text-slate-300 dark:text-slate-300
              hover:border-primary-500 hover:text-primary-600 dark:hover:border-primary-400 dark:hover:text-primary-400 hover:shadow-sm
              active:scale-98
              transition-all duration-150 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900
            "
            aria-label="選擇日期範圍"
          >
            <Calendar size={16} />
            <span className="hidden sm:inline">選擇日期範圍</span>
          </button>

          {/* Theme Toggle Button */}
          <ThemeToggleButton darkMode={darkMode} onToggle={onToggleDarkMode} />
        </div>
      </div>
    </header>
  );
};

export default Header;
