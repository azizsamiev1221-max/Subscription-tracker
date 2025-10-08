import { BillingCycle, Subscription } from '../types';

export const getNextPaymentDate = (subscription: Subscription): Date => {
  const { firstPaymentDate, billingCycle } = subscription;
  const firstDate = new Date(firstPaymentDate);
  const today = new Date();
  
  // To prevent time-of-day issues, set hours to noon.
  today.setHours(12, 0, 0, 0);
  firstDate.setHours(12, 0, 0, 0);

  let nextDate = new Date(firstDate);

  // Loop until the nextDate is strictly after today.
  // This correctly handles cases where the anchor date is today or in the past.
  while (nextDate <= today) {
    switch (billingCycle) {
      case BillingCycle.Weekly:
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case BillingCycle.Monthly:
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case BillingCycle.Quarterly:
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case BillingCycle.SemiAnnually:
        nextDate.setMonth(nextDate.getMonth() + 6);
        break;
      case BillingCycle.Annually:
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }
  }
  
  return nextDate;
};

export const daysUntil = (date: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  const diffTime = nextDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};
