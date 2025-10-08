import React from 'react';
import { Subscription, Currency } from '../types';
import { getNextPaymentDate, daysUntil, formatCurrency } from '../../utils/dateUtils';
import { Card } from '../Card';
import { getServiceIcon } from '../icons/ServiceIcons';
import { CheckCircleIcon, EditIcon, CheckCircleSolidIcon } from '../icons/AppIcons';
import { convertCurrency } from '../../constants';

interface OverduePaymentsWidgetProps {
  subscriptions: Subscription[];
  onPay: (subscription: Subscription) => void;
  onEdit: (subscription: Subscription) => void;
  paidIds: Set<string>;
  displayCurrency: Currency;
}

const OverduePaymentsWidget: React.FC<OverduePaymentsWidgetProps> = ({ subscriptions, onPay, onEdit, paidIds, displayCurrency }) => {
  const overdueSubscriptions = subscriptions
    .map(sub => ({ sub, nextDate: getNextPaymentDate(sub) }))
    .map(({ sub, nextDate }) => ({ sub, daysLeft: daysUntil(nextDate), nextDate }))
    .filter(({ daysLeft, sub }) => daysLeft < 0 && !paidIds.has(sub.id))
    .sort((a, b) => a.daysLeft - b.daysLeft); // Sort by most overdue

  if (overdueSubscriptions.length === 0) {
    return null;
  }

  return (
    <Card className="border-t-4 border-red-500">
      <h3 className="text-lg font-medium text-red-500">Overdue Payments</h3>
      <div className="mt-4 space-y-4">
        {overdueSubscriptions.map(({ sub, daysLeft }) => {
            const isPaid = paidIds.has(sub.id);
            const convertedAmount = convertCurrency(sub.amount, sub.currency, displayCurrency);
            return (
            <div key={sub.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 flex-shrink-0 mr-3">{getServiceIcon(sub.name)}</div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{sub.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Was due on {getNextPaymentDate(sub).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center space-x-1">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{formatCurrency(convertedAmount, displayCurrency)}</p>
                  <p className="text-xs font-bold text-red-500">
                    {Math.abs(daysLeft)} {Math.abs(daysLeft) === 1 ? 'day' : 'days'} ago
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
        })}
      </div>
    </Card>
  );
};

export default OverduePaymentsWidget;
