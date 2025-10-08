import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Subscription, BillingCycle, Currency } from '../../types';
import { EXCHANGE_RATES, CURRENCY_SYMBOLS, convertCurrency } from '../../constants';
import { Card } from '../Card';

interface MonthlyTrendChartWidgetProps {
  subscriptions: Subscription[];
  displayCurrency: Currency;
}

const MonthlyTrendChartWidget: React.FC<MonthlyTrendChartWidgetProps> = ({ subscriptions, displayCurrency }) => {
    const chartData = useMemo(() => {
        const data: { name: string; cost: number }[] = [];
        const today = new Date();

        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = date.toLocaleString('default', { month: 'short' });
            let monthCostInUSD = 0;

            subscriptions.forEach(sub => {
                const firstPayment = new Date(sub.firstPaymentDate);
                let paymentDate = new Date(firstPayment);
                const costInUSD = sub.amount * EXCHANGE_RATES[sub.currency];

                while (paymentDate <= new Date(date.getFullYear(), date.getMonth() + 1, 0)) {
                    if (paymentDate.getFullYear() === date.getFullYear() && paymentDate.getMonth() === date.getMonth()) {
                        monthCostInUSD += costInUSD;
                    }
                    if (paymentDate > today) break;

                    switch (sub.billingCycle) {
                        case BillingCycle.Weekly: paymentDate.setDate(paymentDate.getDate() + 7); break;
                        case BillingCycle.Monthly: paymentDate.setMonth(paymentDate.getMonth() + 1); break;
                        case BillingCycle.Quarterly: paymentDate.setMonth(paymentDate.getMonth() + 3); break;
                        case BillingCycle.SemiAnnually: paymentDate.setMonth(paymentDate.getMonth() + 6); break;
                        case BillingCycle.Annually: paymentDate.setFullYear(paymentDate.getFullYear() + 1); break;
                    }
                }
            });
            const costInDisplayCurrency = convertCurrency(monthCostInUSD, Currency.USD, displayCurrency);
            data.push({ name: monthName, cost: parseFloat(costInDisplayCurrency.toFixed(2)) });
        }
        return data;
    }, [subscriptions, displayCurrency]);

    return (
        <Card className="h-full">
            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-4">Spending Last 6 Months</h3>
            {subscriptions.length === 0 ? (
                 <div className="flex h-64 items-center justify-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Add subscriptions to see your spending trend.</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
                        <XAxis dataKey="name" stroke="currentColor" tick={{ fill: 'currentColor', fontSize: 12 }} />
                        <YAxis stroke="currentColor" tick={{ fill: 'currentColor', fontSize: 12 }} tickFormatter={(value) => `${CURRENCY_SYMBOLS[displayCurrency]}${value}`}/>
                        <Tooltip
                            contentStyle={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(4px)',
                                border: '1px solid #e2e8f0',
                                borderRadius: '0.5rem',
                                color: '#334155'
                            }}
                            formatter={(value: number) => [`${CURRENCY_SYMBOLS[displayCurrency]}${value.toFixed(2)}`, 'Cost']}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="cost" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </Card>
    );
};

export default MonthlyTrendChartWidget;
