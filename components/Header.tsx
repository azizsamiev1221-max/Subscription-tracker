import React, { useState, useRef, useEffect } from 'react';
import { Theme } from '../hooks/useTheme';
import ThemeSwitcher from './ThemeSwitcher';
import { UserProfile } from '../App';
import { View } from '../types';
import { ArrowTopRightOnSquareIcon } from './icons/AppIcons';

interface HeaderProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    user: UserProfile;
    setCurrentView: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme, user, setCurrentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (view: View) => {
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  const userInitial = user.name?.[0]?.toUpperCase() ?? 'U';

  const menuItems = [
    { type: 'header', label: 'Navigation' },
    { type: 'button', label: 'Subscriptions', action: () => handleNavigation('list') },
    { type: 'button', label: 'My Bookings', action: () => handleNavigation('reservations') },
    { type: 'button', label: 'Connected Services', action: () => handleNavigation('profile') },
    { type: 'link', label: 'About Us', href: '#' },
    { type: 'link', label: 'Payments', href: '#' },
    { type: 'link', label: 'Connected Accounts', href: '#' },
    { type: 'link', label: 'Connected Cards', href: '#' },
    { type: 'link', label: 'Connected Numbers', href: '#' },
    { type: 'link', label: 'UP Telephony Subscriptions', href: '#' },
    { type: 'divider' },
    { type: 'header', label: 'Payment Systems' },
    { type: 'link', label: 'Payme', href: 'https://payme.uz/', isExternal: true },
    { type: 'link', label: 'Click', href: 'https://click.uz/', isExternal: true },
    { type: 'link', label: 'VTB Bank', href: 'https://www.vtb.com/', isExternal: true },
    { type: 'link', label: 'Anor Bank', href: 'https://anorbank.uz/', isExternal: true },
  ];

  return (
    <header className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl sticky top-0 z-30 border-b border-white/20 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-indigo-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 7L12 12M12 22V12M22 7L12 12M17 4.5L7 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              SubScribe
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
            <div className="relative" ref={menuRef}>
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    aria-label="Open user menu"
                >
                    {userInitial}
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-20 overflow-hidden">
                        <div className="p-2 max-h-96 overflow-y-auto">
                            <div className="px-2 py-2">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as</p>
                                <p className="font-medium text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                            </div>
                            <hr className="my-2 border-slate-200 dark:border-slate-700" />
                            {menuItems.map((item, index) => {
                                if (item.type === 'header') {
                                    return <p key={index} className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
                                }
                                if (item.type === 'divider') {
                                    return <hr key={index} className="my-2 border-slate-200 dark:border-slate-700" />
                                }
                                if (item.type === 'button') {
                                    return (
                                        <button key={index} onClick={item.action} className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
                                            {item.label}
                                        </button>
                                    );
                                }
                                if (item.type === 'link') {
                                    return (
                                        <a key={index} href={item.href} {...(item.isExternal && { target: '_blank', rel: 'noopener noreferrer' })} className="flex items-center justify-between gap-2 px-2 py-2 text-sm text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
                                            {item.label}
                                            {item.isExternal && <ArrowTopRightOnSquareIcon className="w-4 h-4 text-slate-400" />}
                                        </a>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};