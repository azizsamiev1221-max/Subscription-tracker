import React, { useState } from 'react';
import { Subscription, Category, Currency } from '../types';
import { getNextPaymentDate, daysUntil, formatCurrency } from '../utils/dateUtils';
import { CATEGORY_COLORS, convertCurrency } from '../constants';
import { Card } from './Card';
import { getServiceIcon } from './icons/ServiceIcons';
import { EditIcon, TrashIcon, DotsVerticalIcon, CheckCircleIcon, CheckCircleSolidIcon } from './icons/AppIcons';

interface SubscriptionCardProps {
  subscription: Subscription;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onPay: () => void;
  isPaid: boolean;
  displayCurrency: Currency;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, index, onEdit, onDelete, onPay, isPaid, displayCurrency }) => {
  const { name, amount, currency, category } = subscription;
  const nextPaymentDate = getNextPaymentDate(subscription);
  const daysLeft = daysUntil(nextPaymentDate);
  const [menuOpen, setMenuOpen] = useState(false);
  const convertedAmount = convertCurrency(amount, currency, displayCurrency);

  const categoryColor = CATEGORY_COLORS[category as Category] || '#64748b';
  
  const daysLeftText = daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Today' : `in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}`;
  const daysLeftColor = daysLeft < 0 ? 'text-red-500' : daysLeft <= 3 ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400';

  return (
    <Card 
      className={`flex flex-col justify-between transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl slide-in ${isPaid ? 'opacity-60' : ''}`} 
      style={{ borderTop: `4px solid ${categoryColor}`, animationDelay: `${index * 50}ms` }}
    >
      <div>
        <div className="flex justify-between items-start">
            <div className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-lg mr-4 p-1">
                {getServiceIcon(name)}
            </div>
            <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} onBlur={() => setTimeout(() => setMenuOpen(false), 150)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full">
                    <DotsVerticalIcon className="w-5 h-5" />
                </button>
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                        <button 
                          onClick={onPay} 
                          disabled={isPaid}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 flex items-center disabled:cursor-not-allowed disabled:text-green-500"
                        >
                           {isPaid ? <CheckCircleSolidIcon className="w-4 h-4 mr-2"/> : <CheckCircleIcon className="w-4 h-4 mr-2"/>}
                           {isPaid ? 'Paid' : 'Pay Now'}
                        </button>
                        <button onClick={onEdit} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 flex items-center">
                           <EditIcon className="w-4 h-4 mr-2"/> Edit
                        </button>
                        <button onClick={onDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 flex items-center">
                           <TrashIcon className="w-4 h-4 mr-2"/> Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white truncate">{name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{category}</p>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(convertedAmount, displayCurrency)}</p>
        <div className="mt-1 flex justify-between items-center text-sm">
            <span className={daysLeftColor}>{daysLeftText}</span>
            <span className="text-slate-500 dark:text-slate-400">
              {currency !== displayCurrency 
                ? formatCurrency(amount, currency) 
                : nextPaymentDate.toLocaleDateString()
              }
            </span>
        </div>
      </div>
    </Card>
  );
};

export default SubscriptionCard;
