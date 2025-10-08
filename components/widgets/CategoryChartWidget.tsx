import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Subscription, BillingCycle, Category } from '../../types';
import { EXCHANGE_RATES, CATEGORY_COLORS, CURRENCY_SYMBOLS, convertCurrency } from '../../constants';
import { Card } from '../Card';
import { Currency } from '../../types';

interface CategoryChartWidgetProps {
    subscriptions: Subscription[];
    displayCurrency: Currency;
}

const getMonthlyCostInUSD = (sub: Subscription): number => {
    const baseAmount = sub.amount * EXCHANGE_RATES[sub.currency];
    switch (sub.billingCycle) {
        case BillingCycle.Weekly: return baseAmount * 4.33;
        case BillingCycle.Monthly: return baseAmount;
        case BillingCycle.Quarterly: return baseAmount / 3;
        case BillingCycle.SemiAnnually: return baseAmount / 6;
        case BillingCycle.Annually: return baseAmount / 12;
        default: return 0;
    }
};

const CategoryChartWidget: React.FC<CategoryChartWidgetProps> = ({ subscriptions, displayCurrency }) => {
    const { data, total } = useMemo(() => {
        // FIX: The initial value for reduce was not typed, causing `categoryTotalsUSD` to have `unknown` values.
        // Casting the initial value to `Record<Category, number>` ensures correct type inference for the accumulator
        // and resolves downstream type errors.
        const categoryTotalsUSD = subscriptions.reduce((acc, sub) => {
            const monthlyCostUSD = getMonthlyCostInUSD(sub);
            if (acc[sub.category] === undefined) {
                acc[sub.category] = 0;
            }
            acc[sub.category] += monthlyCostUSD;
            return acc;
        }, {} as Record<Category, number>);

        const totalUSD = Object.values(categoryTotalsUSD).reduce((sum, val) => sum + val, 0);

        const chartData = Object.entries(categoryTotalsUSD).map(([name, value]) => ({
            name,
            value: parseFloat(convertCurrency(value, Currency.USD, displayCurrency).toFixed(2)),
        }));
        
        const totalInDisplay = convertCurrency(totalUSD, Currency.USD, displayCurrency);

        return { data: chartData, total: totalInDisplay };
    }, [subscriptions, displayCurrency]);

    if (subscriptions.length === 0) {
        return (
            <Card className="md:col-span-2 flex items-center justify-center">
                 <div className="text-center">
                    <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">Expenses by Category</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Add a subscription to see your spending breakdown.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="md:col-span-2 relative">
            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-4">Expenses by Category</h3>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-4">
                 <span className="text-sm text-slate-500 dark:text-slate-400">Monthly</span>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{CURRENCY_SYMBOLS[displayCurrency]}{total.toFixed(2)}</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        innerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        paddingAngle={5}
                        cornerRadius={8}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as Category]} />
                        ))}
                    </Pie>
                    <Tooltip
                         contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.5rem',
                            color: '#334155'
                        }}
                        formatter={(value: unknown) => {
                            if (typeof value === 'number') {
                                return `${CURRENCY_SYMBOLS[displayCurrency]}${value.toFixed(2)}`;
                            }
                            return null;
                        }} />
                    <Legend iconSize={10} wrapperStyle={{fontSize: '0.875rem'}}/>
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default CategoryChartWidget;