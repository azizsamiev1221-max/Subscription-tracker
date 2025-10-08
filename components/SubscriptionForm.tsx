import React, { useState, useEffect } from 'react';
import { Subscription, Currency, BillingCycle, Category } from '../types';
import { CURRENCY_OPTIONS, BILLING_CYCLE_OPTIONS, CATEGORY_OPTIONS } from '../constants';
import { POPULAR_SERVICES } from './icons/ServiceIcons';

interface SubscriptionFormProps {
  onSave: (subscription: Omit<Subscription, 'id'> | Subscription) => void;
  onCancel: () => void;
  subscription: Subscription | null;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ onSave, onCancel, subscription }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>(Currency.USD);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(BillingCycle.Monthly);
  const [firstPaymentDate, setFirstPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category>(Category.Entertainment);
  const [notes, setNotes] = useState('');
  
  // FIX: Explicitly use React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  const [suggestions, setSuggestions] = useState<{name: string, icon: React.ReactElement}[]>([]);

  useEffect(() => {
    if (subscription) {
      setName(subscription.name);
      setAmount(String(subscription.amount));
      setCurrency(subscription.currency);
      setBillingCycle(subscription.billingCycle);
      setFirstPaymentDate(new Date(subscription.firstPaymentDate).toISOString().split('T')[0]);
      setCategory(subscription.category);
      setNotes(subscription.notes || '');
    }
  }, [subscription]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value) {
      setSuggestions(
        POPULAR_SERVICES.filter(service =>
          service.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setSuggestions([]);
    }
  };
  
  const handleSuggestionClick = (serviceName: string) => {
    setName(serviceName);
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || isNaN(parseFloat(amount))) return;
    
    const data = {
      name,
      amount: parseFloat(amount),
      currency,
      billingCycle,
      firstPaymentDate,
      category,
      notes,
    };
    
    if (subscription) {
      onSave({ ...subscription, ...data });
    } else {
      onSave(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-1">
      <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">{subscription ? 'Edit Subscription' : 'Add Subscription'}</h2>
      
      <div className="space-y-4">
        <div className="relative">
          <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Name</label>
          <input type="text" id="name" value={name} onChange={handleNameChange} className="mt-1 block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg mt-1">
              {suggestions.map(service => (
                <li key={service.name} onClick={() => handleSuggestionClick(service.name)} className="cursor-pointer px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center">
                  <span className="w-6 h-6 mr-2">{service.icon}</span>
                  {service.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Amount</label>
              <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required step="0.01" />
            </div>
             <div>
              <label htmlFor="currency" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Currency</label>
              <select id="currency" value={currency} onChange={e => setCurrency(e.target.value as Currency)} className="mt-1 block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                {CURRENCY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
        </div>
        
        <div>
          <label htmlFor="billingCycle" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Billing Cycle</label>
          <select id="billingCycle" value={billingCycle} onChange={e => setBillingCycle(e.target.value as BillingCycle)} className="mt-1 block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            {BILLING_CYCLE_OPTIONS.map(bc => <option key={bc} value={bc}>{bc}</option>)}
          </select>
        </div>
        
        <div>
          <label htmlFor="firstPaymentDate" className="block text-sm font-medium text-slate-600 dark:text-slate-300">First Payment Date</label>
          <input type="date" id="firstPaymentDate" value={firstPaymentDate} onChange={e => setFirstPaymentDate(e.target.value)} className="mt-1 block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Category</label>
          <select id="category" value={category} onChange={e => setCategory(e.target.value as Category)} className="mt-1 block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            {CATEGORY_OPTIONS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
           <label htmlFor="notes" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Notes (Optional)</label>
           <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="mt-1 block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="bg-white dark:bg-slate-700 py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Cancel
        </button>
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Save
        </button>
      </div>
    </form>
  );
};

export default SubscriptionForm;