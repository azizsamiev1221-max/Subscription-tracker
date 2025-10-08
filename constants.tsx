import { Currency, BillingCycle, Category } from './types';

export const CURRENCY_SYMBOLS: { [key in Currency]: string } = {
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.RUB]: '₽',
  [Currency.UZS]: 'soʻm',
};

export const EXCHANGE_RATES: { [key in Currency]: number } = {
  [Currency.USD]: 1,
  [Currency.EUR]: 1.08,
  [Currency.RUB]: 0.011,
  [Currency.UZS]: 0.000079,
};

export const BILLING_CYCLE_OPTIONS = Object.values(BillingCycle);
export const CURRENCY_OPTIONS = Object.values(Currency);
export const CATEGORY_OPTIONS = Object.values(Category);

export const CATEGORY_COLORS: { [key in Category]: string } = {
  [Category.Entertainment]: '#8b5cf6', // violet-500
  [Category.Work]: '#3b82f6', // blue-500
  [Category.Education]: '#10b981', // emerald-500
  [Category.Health]: '#ec4899', // pink-500
  [Category.Other]: '#64748b', // slate-500
};

/**
 * Converts an amount from one currency to another using USD as a base.
 * @param amount The amount to convert.
 * @param from The original currency.
 * @param to The target currency.
 * @returns The converted amount.
 */
export const convertCurrency = (amount: number, from: Currency, to: Currency): number => {
  if (from === to) {
    return amount;
  }
  // Convert 'from' currency to USD first
  const amountInUSD = amount * EXCHANGE_RATES[from];
  // Then convert from USD to 'to' currency
  return amountInUSD / EXCHANGE_RATES[to];
};
