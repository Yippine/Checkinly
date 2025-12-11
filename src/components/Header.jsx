import React from 'react';
import { BarChart3, Calendar, Menu } from 'lucide-react';

const Header = ({ fileName, onMenuClick }) => {
  return (
    <header
      className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white border-b border-border-light shadow-sm z-sticky transition-all duration-300"
      role="banner"
    >
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Mobile Menu + Brand + Title */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-text-secondary hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
            <h1 className="text-heading-2 text-text-primary font-semibold">
              工時分析管理系統
            </h1>
            {fileName && (
              <p className="text-caption text-text-tertiary hidden md:block">
                當前檔案: {fileName}
              </p>
            )}
          </div>

          {/* Mobile Title (Abbreviated) */}
          <h1 className="sm:hidden text-base font-semibold text-text-primary">
            工時分析
          </h1>
        </div>

        {/* Right: Date Range Picker */}
        <div className="flex items-center gap-3">
          <button
            className="
              flex items-center gap-2 px-3 sm:px-4 py-2
              bg-white border border-border-default rounded-base
              text-body text-text-secondary
              hover:border-primary-500 hover:text-primary-600 hover:shadow-sm
              active:scale-98
              transition-all duration-150 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            "
            aria-label="選擇日期範圍"
          >
            <Calendar size={16} />
            <span className="hidden sm:inline">選擇日期範圍</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
