
import React, { useMemo } from 'react';
import { Subscription, Currency, SortOption } from '../types';
import TotalExpensesWidget from './widgets/TotalExpensesWidget';
import CategoryChartWidget from './widgets/CategoryChartWidget';
import UpcomingPaymentsWidget from './widgets/UpcomingPaymentsWidget';
import MonthlyTrendChartWidget from './widgets/MonthlyTrendChartWidget';
import OverduePaymentsWidget from './widgets/OverduePaymentsWidget';
import { getNextPaymentDate, daysUntil } from '../utils/dateUtils';
import CurrencySelector from './CurrencySelector';
import SortSelector from './SortSelector';

interface DashboardProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onPay: (subscription: Subscription) => void;
  paidIds: Set<string>;
  displayCurrency: Currency;
  setDisplayCurrency: (currency: Currency) => void;
  sortOrder: SortOption;
  setSortOrder: (option: SortOption) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ subscriptions, onEdit, onPay, paidIds, displayCurrency, setDisplayCurrency, sortOrder, setSortOrder }) => {
  const hasOverdue = useMemo(() => subscriptions.some(sub => daysUntil(getNextPaymentDate(sub)) < 0 && !paidIds.has(sub.id)), [subscriptions, paidIds]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h2>
        <div className="flex items-center gap-4">
          <SortSelector value={sortOrder} onChange={setSortOrder} />
          <CurrencySelector value={displayCurrency} onChange={setDisplayCurrency} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="slide-in" style={{ animationDelay: '100ms' }}>
              <TotalExpensesWidget subscriptions={subscriptions} displayCurrency={displayCurrency} />
          </div>
          <div className="md:col-span-2 slide-in" style={{ animationDelay: '200ms' }}>
              <CategoryChartWidget subscriptions={subscriptions} displayCurrency={displayCurrency} />
          </div>
        </div>
        <div className="lg:col-span-2 slide-in" style={{ animationDelay: '300ms' }}>
          <MonthlyTrendChartWidget subscriptions={subscriptions} displayCurrency={displayCurrency} />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          {hasOverdue && 
              <div className="slide-in" style={{ animationDelay: '400ms' }}>
                  <OverduePaymentsWidget subscriptions={subscriptions} onEdit={onEdit} onPay={onPay} paidIds={paidIds} displayCurrency={displayCurrency} />
              </div>
          }
          <div className="slide-in" style={{ animationDelay: hasOverdue ? '500ms' : '400ms' }}>
              <UpcomingPaymentsWidget subscriptions={subscriptions} onEdit={onEdit} onPay={onPay} paidIds={paidIds} displayCurrency={displayCurrency} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
