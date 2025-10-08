import { useState, useEffect, useCallback } from 'react';
import { Subscription, Currency, BillingCycle, Category } from '../types';

const STORAGE_KEY = 'subscriptions';

const getSampleSubscriptions = (): Subscription[] => {
  const createPastDate = (monthsAgo: number, dayOfMonth: number): string => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    date.setDate(dayOfMonth);
    return date.toISOString().split('T')[0];
  };

  return [
    {
      id: 'sample-1',
      name: 'Netflix',
      amount: 15.49,
      currency: Currency.USD,
      billingCycle: BillingCycle.Monthly,
      firstPaymentDate: createPastDate(2, 5),
      category: Category.Entertainment,
      notes: 'Standard HD plan',
    },
    {
      id: 'sample-2',
      name: 'Spotify',
      amount: 9.99,
      currency: Currency.EUR,
      billingCycle: BillingCycle.Monthly,
      firstPaymentDate: createPastDate(1, 15),
      category: Category.Entertainment,
    },
    {
      id: 'sample-3',
      name: 'Adobe Creative Cloud',
      amount: 59.99,
      currency: Currency.USD,
      billingCycle: BillingCycle.Monthly,
      firstPaymentDate: createPastDate(0, 20), // This month
      category: Category.Work,
      notes: 'All Apps subscription',
    },
    {
      id: 'sample-4',
      name: 'Notion',
      amount: 96,
      currency: Currency.USD,
      billingCycle: BillingCycle.Annually,
      firstPaymentDate: createPastDate(8, 1),
      category: Category.Work,
    },
    {
        id: 'sample-5',
        name: 'Gym Membership',
        amount: 450000,
        currency: Currency.UZS,
        billingCycle: BillingCycle.Quarterly,
        firstPaymentDate: createPastDate(1, 28),
        category: Category.Health,
    }
  ];
};

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedSubscriptions = localStorage.getItem(STORAGE_KEY);
      if (storedSubscriptions) {
        setSubscriptions(JSON.parse(storedSubscriptions));
      } else {
        // If no subscriptions are found in local storage, this is likely
        // the user's first visit. Let's load some sample data for them.
        setSubscriptions(getSampleSubscriptions());
      }
    } catch (error) {
      console.error("Failed to load subscriptions from localStorage", error);
      // Fallback to sample data on error as well
      setSubscriptions(getSampleSubscriptions());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
      } catch (error) {
        console.error("Failed to save subscriptions to localStorage", error);
      }
    }
  }, [subscriptions, isLoading]);

  const addSubscription = useCallback((subscription: Omit<Subscription, 'id'>) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: new Date().toISOString() + Math.random(),
    };
    setSubscriptions(prev => [...prev, newSubscription]);
  }, []);

  const updateSubscription = useCallback((updatedSubscription: Subscription) => {
    setSubscriptions(prev => 
      prev.map(sub => sub.id === updatedSubscription.id ? updatedSubscription : sub)
    );
  }, []);
  
  const markAsPaid = useCallback((id: string) => {
    const subscription = subscriptions.find(sub => sub.id === id);
    if (!subscription) return;

    const updatedSubscription: Subscription = {
        ...subscription,
        // By setting the anchor to today, the next payment will be calculated from today.
        // This might shift the payment day of the month, but it's the most
        // straightforward way to handle "paying" and advancing the cycle.
        firstPaymentDate: new Date().toISOString().split('T')[0],
    };
    
    updateSubscription(updatedSubscription);
  }, [subscriptions, updateSubscription]);

  const deleteSubscription = useCallback((id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  }, []);

  return {
    subscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    isLoading,
    markAsPaid,
  };
};
