import React from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggleButton = ({ darkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      aria-label={darkMode ? '切換至淺色模式' : '切換至深色模式'}
      title={darkMode ? '切換至淺色模式' : '切換至深色模式'}
    >
      {darkMode ? (
        <Sun size={20} className="text-yellow-500 transition-transform duration-300 hover:rotate-180" strokeWidth={2} />
      ) : (
        <Moon size={20} className="text-gray-600 transition-transform duration-300 hover:-rotate-12" strokeWidth={2} />
      )}
    </button>
  );
};

export default ThemeToggleButton;
