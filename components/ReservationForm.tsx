import React, { useState, useEffect } from 'react';
import { Reservation, ReservationType, ReservationStatus } from '../types';

interface ReservationFormProps {
  onSave: (reservation: Omit<Reservation, 'id'> | Reservation) => void;
  onCancel: () => void;
  reservation: Reservation | null;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ onSave, onCancel, reservation }) => {
  const [type, setType] = useState<ReservationType>(ReservationType.Hotel);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [details, setDetails] = useState('');
  const [bookingURL, setBookingURL] = useState('');

  useEffect(() => {
    if (reservation) {
      setType(reservation.type);
      setName(reservation.name);
      setLocation(reservation.location);
      setDate(new Date(reservation.date).toISOString().slice(0, 16));
      setDetails(reservation.details || '');
      setBookingURL(reservation.bookingURL || '');
    }
  }, [reservation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !date) return;
    
    const data = {
      type,
      name,
      location,
      date,
      details,
      bookingURL,
      status: reservation?.status || ReservationStatus.Confirmed, // Default to confirmed for new, keep old for edits
    };
    
    if (reservation) {
      onSave({ ...reservation, ...data });
    } else {
      onSave(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-1">
      <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">{reservation ? 'Edit Booking' : 'Add New Booking'}</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Booking Type</label>
          <select id="type" value={type} onChange={e => setType(e.target.value as ReservationType)} className="mt-1 block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            {Object.values(ReservationType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Name</label>
          <input type="text" id="name" placeholder={type === ReservationType.Hotel ? 'e.g., Grand Hyatt' : 'e.g., City Tour'} value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Location</label>
          <input type="text" id="location" placeholder="e.g., Tashkent, Uzbekistan" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Date and Time</label>
          <input type="datetime-local" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
        </div>
        
        <div>
           <label htmlFor="bookingURL" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Website URL (Optional)</label>
           <input type="url" id="bookingURL" placeholder="https://example.com/booking" value={bookingURL} onChange={e => setBookingURL(e.target.value)} className="mt-1 block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        <div>
           <label htmlFor="details" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Details (Optional)</label>
           <textarea id="details" value={details} placeholder="e.g., Table for 2, Window seat" onChange={e => setDetails(e.target.value)} rows={2} className="mt-1 block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="bg-white dark:bg-slate-700 py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Cancel
        </button>
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Save Booking
        </button>
      </div>
    </form>
  );
};

export default ReservationForm;