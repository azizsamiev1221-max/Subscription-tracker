import React, { useState } from 'react';
import { Subscription } from '../types';
import Modal from './Modal';
import { formatCurrency } from '../utils/dateUtils';
import { SpinnerIcon, CheckCircleSolidIcon } from './icons/AppIcons';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription;
  onConfirmPayment: (id: string) => void;
}

type PaymentStatus = 'idle' | 'processing' | 'success';

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, subscription, onConfirmPayment }) => {
  const [status, setStatus] = useState<PaymentStatus>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onConfirmPayment(subscription.id);
      }, 1500);
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-2">
            <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">Confirm Payment</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">You are paying for your subscription to <span className="font-semibold text-slate-700 dark:text-slate-200">{subscription.name}</span>.</p>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">Amount Due</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(subscription.amount, subscription.currency)}</p>
            </div>
            
            {status !== 'success' && (
                <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Name on Card</label>
                        <input type="text" id="cardName" defaultValue="Alex Doe" className="mt-1 block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Card Number</label>
                        <input type="text" id="cardNumber" defaultValue="**** **** **** 1234" className="mt-1 block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Expiry Date</label>
                            <input type="text" id="expiryDate" defaultValue="12 / 26" className="mt-1 block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="cvc" className="block text-sm font-medium text-slate-600 dark:text-slate-300">CVC</label>
                            <input type="text" id="cvc" defaultValue="***" className="mt-1 block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} disabled={status === 'processing'} className="bg-white dark:bg-slate-700 py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                    Cancel
                    </button>
                    <button type="submit" disabled={status === 'processing'} className="w-32 inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                        {status === 'processing' ? <SpinnerIcon className="animate-spin w-5 h-5" /> : `Pay ${formatCurrency(subscription.amount, subscription.currency)}`}
                    </button>
                </div>
                </form>
            )}

            {status === 'success' && (
                <div className="text-center py-10 transition-opacity duration-500">
                    <CheckCircleSolidIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Payment Successful!</h3>
                    <p className="text-slate-500 dark:text-slate-400">Your subscription is now up to date.</p>
                </div>
            )}
        </div>
    </Modal>
  );
};

export default PaymentModal;
