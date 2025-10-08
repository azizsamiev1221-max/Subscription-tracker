
import React from 'react';
import { SortOption } from '../types';

interface SortSelectorProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'nextPaymentDate', label: 'Next Payment' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'amount', label: 'Amount (High-Low)' },
  { value: 'category', label: 'Category' },
];

const SortSelector: React.FC<SortSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="appearance-none bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/50 rounded-md py-2 pl-3 pr-8 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-100 dark:focus:ring-offset-gray-900"
        aria-label="Sort subscriptions by"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-200">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.516 7.548c.436-.446 1.043-.481 1.576 0L10 10.405l2.908-2.857c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.642l-3.417 3.356c-.27.267-.62.398-.97.398s-.701-.131-.97-.398l-3.417-3.356c-.408-.445-.436-1.197 0-1.642z" />
        </svg>
      </div>
    </div>
  );
};

export default SortSelector;
