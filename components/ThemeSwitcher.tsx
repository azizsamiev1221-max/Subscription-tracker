import React, { useState, useRef, useEffect } from 'react';
import { SunIcon, MoonIcon, DesktopIcon } from './icons/AppIcons';
import { Theme } from '../hooks/useTheme';

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const themeOptions: { value: Theme; label: string; icon: React.ReactElement }[] = [
  { value: 'light', label: 'Light', icon: <SunIcon className="w-5 h-5" /> },
  { value: 'dark', label: 'Dark', icon: <MoonIcon className="w-5 h-5" /> },
  { value: 'system', label: 'System', icon: <DesktopIcon className="w-5 h-5" /> },
];

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentThemeIcon = themeOptions.find(opt => opt.value === theme)?.icon || <DesktopIcon className="w-5 h-5" />;
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Change theme"
      >
        {React.cloneElement(currentThemeIcon, { className: "w-6 h-6" })}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
          <div className="py-1">
            {themeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 ${
                  theme === option.value
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
