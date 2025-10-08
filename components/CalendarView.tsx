
import React, { useState, useMemo } from 'react';
import { Subscription } from '../types';
import { getNextPaymentDate, formatCurrency } from '../utils/dateUtils';
import { CATEGORY_COLORS } from '../constants';
import Modal from './Modal';
import { getServiceIcon } from './icons/ServiceIcons';

interface CalendarViewProps {
  subscriptions: Subscription[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ subscriptions }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const paymentsByDay = useMemo(() => {
    const map = new Map<string, Subscription[]>();
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    subscriptions.forEach(sub => {
      let nextPayment = getNextPaymentDate(sub);
      if (nextPayment >= monthStart && nextPayment <= monthEnd) {
        const dayKey = nextPayment.toISOString().split('T')[0];
        if (!map.has(dayKey)) {
          map.set(dayKey, []);
        }
        map.get(dayKey)?.push(sub);
      }
    });
    return map;
  }, [subscriptions, currentDate]);

  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const handleDayClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayKey = date.toISOString().split('T')[0];
    if (paymentsByDay.has(dayKey)) {
      setSelectedDay(date);
      setModalOpen(true);
    }
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };
  
  const selectedDayPayments = selectedDay ? paymentsByDay.get(selectedDay.toISOString().split('T')[0]) || [] : [];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700">&lt;</button>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => changeMonth(1)} className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-slate-500 dark:text-slate-400">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">
        {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`}></div>)}
        {Array.from({ length: daysInMonth }).map((_, day) => {
          const dayNumber = day + 1;
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
          const dayKey = date.toISOString().split('T')[0];
          const payments = paymentsByDay.get(dayKey);
          const isToday = new Date().toDateString() === date.toDateString();
          
          return (
            <div 
              key={dayNumber} 
              onClick={() => handleDayClick(dayNumber)}
              className={`p-2 rounded-lg aspect-square flex flex-col items-center justify-start cursor-pointer transition-colors ${payments ? 'bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
            >
              <span className={`w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-200'}`}>{dayNumber}</span>
              <div className="flex flex-wrap justify-center mt-1">
                {payments?.slice(0, 4).map(p => <div key={p.id} className="w-1.5 h-1.5 rounded-full m-0.5" style={{backgroundColor: CATEGORY_COLORS[p.category]}}></div>)}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedDay && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Payments on {selectedDay.toLocaleDateString()}</h3>
            <div className="space-y-3">
              {selectedDayPayments.map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 mr-3">{getServiceIcon(sub.name)}</div>
                    <span className="font-medium text-slate-800 dark:text-slate-100">{sub.name}</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{formatCurrency(sub.amount, sub.currency)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarView;
