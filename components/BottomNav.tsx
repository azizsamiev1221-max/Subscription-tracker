import React from 'react';
import { HomeIcon, ListBulletIcon, CalendarDaysIcon, UserCircleIcon, TicketIcon } from './icons/AppIcons';

type View = 'dashboard' | 'list' | 'calendar' | 'profile' | 'reservations';

interface BottomNavProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const navItems = [
    { view: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { view: 'list', label: 'Subs', icon: <ListBulletIcon /> },
    { view: 'reservations', label: 'Bookings', icon: <TicketIcon /> },
    { view: 'calendar', label: 'Calendar', icon: <CalendarDaysIcon /> },
    { view: 'profile', label: 'Profile', icon: <UserCircleIcon /> },
];

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView }) => {
    const activeIndex = navItems.findIndex(item => item.view === currentView);
    
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-sm mx-auto z-30">
            <nav className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 flex justify-around items-center rounded-full shadow-lg h-16">
                <div
                    className="absolute top-2 left-2 h-12 w-[20%] bg-indigo-500/80 rounded-full transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(${activeIndex * 100}%)` }}
                />

                {navItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => setCurrentView(item.view as View)}
                        className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center transition-colors"
                        aria-label={item.label}
                    >
                        <div className={`transition-colors ${currentView === item.view ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400'}`}>
                            {React.cloneElement(item.icon, { className: 'w-6 h-6' })}
                        </div>
                         <span className={`text-xs mt-1 font-medium transition-opacity duration-300 ${currentView === item.view ? 'opacity-0' : 'opacity-100 text-slate-500 dark:text-slate-400'}`}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default BottomNav;