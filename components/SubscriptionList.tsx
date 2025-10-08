
import React from 'react';
import { Subscription, Currency, SortOption } from '../types';
import SubscriptionCard from './SubscriptionCard';
import { Card } from './Card';
import SortSelector from './SortSelector';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  onPay: (subscription: Subscription) => void;
  paidIds: Set<string>;
  displayCurrency: Currency;
  sortOrder: SortOption;
  setSortOrder: (option: SortOption) => void;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions, onEdit, onDelete, onPay, paidIds, displayCurrency, sortOrder, setSortOrder }) => {
  if (subscriptions.length === 0) {
    return (
      <Card className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">No Subscriptions Yet</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Click the '+' button to add your first subscription.</p>
      </Card>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">All Subscriptions</h2>
        <SortSelector value={sortOrder} onChange={setSortOrder} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subscriptions.map((sub, index) => (
          <SubscriptionCard 
            key={sub.id} 
            subscription={sub}
            index={index}
            onEdit={() => onEdit(sub)}
            onDelete={() => onDelete(sub.id)}
            onPay={() => onPay(sub)}
            isPaid={paidIds.has(sub.id)}
            displayCurrency={displayCurrency}
          />
        ))}
      </div>
    </>
  );
};

export default SubscriptionList;
