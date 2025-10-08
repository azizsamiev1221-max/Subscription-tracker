import React from 'react';
import { Reservation } from '../types';
import { Card } from './Card';
import ReservationCard from './ReservationCard';

interface ReservationsViewProps {
  reservations: Reservation[];
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
}

const ReservationsView: React.FC<ReservationsViewProps> = ({ reservations, onEdit, onDelete }) => {
  if (reservations.length === 0) {
    return (
      <Card className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">No Bookings Yet</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Click the '+' button to plan your first trip or event.</p>
      </Card>
    );
  }
  
  const sortedReservations = [...reservations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      {sortedReservations.map((res, index) => (
        <ReservationCard 
          key={res.id} 
          reservation={res}
          index={index}
          onEdit={() => onEdit(res)}
          onDelete={() => onDelete(res.id)}
        />
      ))}
    </div>
  );
};

export default ReservationsView;
