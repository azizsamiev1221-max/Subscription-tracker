import React from 'react';
import { Subscription, Currency } from '../types';
import { getNextPaymentDate, daysUntil, formatCurrency } from '../../utils/dateUtils';
import { Card } from '../Card';
import { getServiceIcon } from '../icons/ServiceIcons';
import { EditIcon, CheckCircleIcon, CheckCircleSolidIcon } from '../icons/AppIcons';
import { convertCurrency } from '../../constants';

interface UpcomingPaymentsWidgetProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onPay: (subscription: Subscription) => void;
  paidIds: Set<string>;
  displayCurrency: Currency;
}

const UpcomingPaymentsWidget: React.FC<UpcomingPaymentsWidgetProps> = ({ subscriptions, onEdit, onPay, paidIds, displayCurrency }) => {
  const upcoming = subscriptions.slice(0, 5);

  return (
    <Card>
      <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">Upcoming Payments</h3>
      <div className="mt-4 space-y-4">
        {upcoming.length > 0 ? (
          upcoming.map(sub => {
            const nextDate = getNextPaymentDate(sub);
            const daysLeft = daysUntil(nextDate);
            const isPaid = paidIds.has(sub.id);
            const convertedAmount = convertCurrency(sub.amount, sub.currency, displayCurrency);
            return (
              <div key={sub.id} className={`flex items-center justify-between ${isPaid ? 'opacity-60' : ''}`}>
                <div className="flex items-center">
                    <div className="w-8 h-8 flex-shrink-0 mr-3">{getServiceIcon(sub.name)}</div>
                    <div>
                        <p className="font-medium text-slate-800 dark:text-slate-100">{sub.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{nextDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                    </div>
                </div>
                <div className="text-right flex items-center space-x-1">
                    <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{formatCurrency(convertedAmount, displayCurrency)}</p>
                        <p className={`text-xs ${daysLeft <= 3 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                            {daysLeft === 0 ? 'Today' : `in ${daysLeft}d`}
                        </p>
                    </div>
                     <button 
                        onClick={() => onPay(sub)} 
                        title={isPaid ? "Paid" : "Pay Now"} 
                        disabled={isPaid}
                        className="p-1 text-slate-400 disabled:cursor-not-allowed disabled:text-green-500 hover:text-green-600 dark:hover:text-green-400 transition"
                      >
                       {isPaid ? <CheckCircleSolidIcon className="w-5 h-5" /> : <CheckCircleIcon className="w-5 h-5" />}
                    </button>
                     <button onClick={() => onEdit(sub)} title="Edit" className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                       <EditIcon className="w-5 h-5" />
                    </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming payments. Add a subscription!</p>
        )}
      </div>
    </Card>
  );
};

export default UpcomingPaymentsWidget;
