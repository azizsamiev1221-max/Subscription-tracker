import React from 'react';
import { Reservation, ReservationStatus, ReservationType } from '../types';
import { Card } from './Card';
import { EditIcon, TrashIcon, BuildingOffice2Icon, RestaurantIcon, GlobeAltIcon, FilmIcon } from './icons/AppIcons';

interface ReservationCardProps {
  reservation: Reservation;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation, index, onEdit, onDelete }) => {
  const { name, type, location, date, status, details, bookingURL } = reservation;

  const getIconForType = (type: ReservationType) => {
    switch (type) {
      case ReservationType.Hotel:
        return <BuildingOffice2Icon className="w-6 h-6 text-blue-500" />;
      case ReservationType.Restaurant:
        return <RestaurantIcon className="w-6 h-6 text-amber-500" />;
      case ReservationType.Tour:
        return <GlobeAltIcon className="w-6 h-6 text-emerald-500" />;
      case ReservationType.Cinema:
        return <FilmIcon className="w-6 h-6 text-purple-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: ReservationStatus) => {
    const baseClasses = "text-xs font-semibold px-2.5 py-0.5 rounded-full";
    switch (status) {
      case ReservationStatus.Confirmed:
        return `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 ${baseClasses}`;
      case ReservationStatus.Pending:
        return `bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 ${baseClasses}`;
      case ReservationStatus.Cancelled:
        return `bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 ${baseClasses}`;
      default:
        return `bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 ${baseClasses}`;
    }
  };
  
  const formattedDate = new Date(date).toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  const handleCardClick = () => {
    if (bookingURL) {
      window.open(bookingURL, '_blank', 'noopener,noreferrer');
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <Card 
      onClick={handleCardClick}
      className={`transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl slide-in ${bookingURL ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex sm:flex-col items-center sm:items-start sm:border-r sm:pr-4 border-slate-200 dark:border-slate-700">
           <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700/50 rounded-lg mr-4 sm:mr-0 sm:mb-2">
            {getIconForType(type)}
          </div>
          <div className="text-left sm:text-center">
            <p className="font-semibold text-slate-800 dark:text-white">{type}</p>
          </div>
        </div>

        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{location}</p>
            </div>
            <span className={getStatusBadge(status)}>{status}</span>
          </div>
          <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
            <p className="font-semibold text-slate-800 dark:text-white">{formattedDate}</p>
            {details && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{details}</p>}
          </div>
        </div>

        <div className="flex sm:flex-col gap-2 items-center justify-end sm:justify-start pt-4 sm:pt-0 sm:pl-4 sm:border-l border-slate-200 dark:border-slate-700">
          <button onClick={handleEditClick} className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition" aria-label="Edit booking">
            <EditIcon className="w-5 h-5" />
          </button>
          <button onClick={handleDeleteClick} className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition" aria-label="Delete booking">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ReservationCard;