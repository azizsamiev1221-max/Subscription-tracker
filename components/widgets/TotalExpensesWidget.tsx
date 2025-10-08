import React, { useMemo } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { Subscription, BillingCycle, Currency } from '../../types';
import { EXCHANGE_RATES, CURRENCY_SYMBOLS, convertCurrency } from '../../constants';
import { Card } from '../Card';

interface TotalExpensesWidgetProps {
  subscriptions: Subscription[];
  displayCurrency: Currency;
}

const getMonthlyCostInUSD = (sub: Subscription): number => {
  const baseAmount = sub.amount * EXCHANGE_RATES[sub.currency];
  switch (sub.billingCycle) {
    case BillingCycle.Weekly:
      return baseAmount * 4.33;
    case BillingCycle.Monthly:
      return baseAmount;
    case BillingCycle.Quarterly:
      return baseAmount / 3;
    case BillingCycle.SemiAnnually:
      return baseAmount / 6;
    case BillingCycle.Annually:
      return baseAmount / 12;
    default:
      return 0;
  }
};

const TotalExpensesWidget: React.FC<TotalExpensesWidgetProps> = ({ subscriptions, displayCurrency }) => {
  const MOCK_BUDGET = 300; // Mock monthly budget in USD

  const { totalMonthlyCost, budget, percentage } = useMemo(() => {
    const costInUSD = subscriptions.reduce((total, sub) => total + getMonthlyCostInUSD(sub), 0);
    const totalInDisplayCurrency = convertCurrency(costInUSD, Currency.USD, displayCurrency);
    const budgetInDisplayCurrency = convertCurrency(MOCK_BUDGET, Currency.USD, displayCurrency);
    const perc = MOCK_BUDGET > 0 ? Math.min((costInUSD / MOCK_BUDGET) * 100, 100) : 0;
    return { totalMonthlyCost: totalInDisplayCurrency, budget: budgetInDisplayCurrency, percentage: perc };
  }, [subscriptions, displayCurrency]);

  const chartData = [{ name: 'Monthly Cost', value: percentage }];

  return (
    <Card className="md:col-span-1 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">Total Monthly Cost</h3>
        <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
          {CURRENCY_SYMBOLS[displayCurrency]}{totalMonthlyCost.toFixed(2)}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          out of {CURRENCY_SYMBOLS[displayCurrency]}{budget.toFixed(2)} budget
        </p>
      </div>
      <div className="h-24 -mb-4 -mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="70%"
            innerRadius="90%"
            outerRadius="110%"
            barSize={10}
            data={chartData}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
            />
            <RadialBar
              background
              dataKey="value"
              cornerRadius={10}
              className="fill-indigo-600"
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TotalExpensesWidget;
