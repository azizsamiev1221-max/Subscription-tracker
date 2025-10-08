import { useState, useEffect, useCallback } from 'react';
import { Reservation, ReservationType, ReservationStatus } from '../types';

const STORAGE_KEY = 'reservations';

const getSampleReservations = (): Reservation[] => {
  const createDate = (daysFromNow: number, hour: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(hour, 0, 0, 0);
    return date.toISOString();
  };

  return [
    {
      id: 'res-1',
      type: ReservationType.Hotel,
      name: 'Grand Hyatt Tashkent',
      location: 'Tashkent, Uzbekistan',
      date: createDate(10, 14),
      status: ReservationStatus.Confirmed,
      details: 'King Bed, Non-smoking, Room 1204',
      bookingURL: 'https://www.hyatt.com/en-US/hotel/uzbekistan/hyatt-regency-tashkent/tasrt',
    },
    {
      id: 'res-2',
      type: ReservationType.Restaurant,
      name: 'Caravan',
      location: 'Tashkent, Uzbekistan',
      date: createDate(2, 19),
      status: ReservationStatus.Confirmed,
      details: 'Table for 4 people, outdoor seating',
      bookingURL: 'https://caravan-group.uz/restaurant/caravan/',
    },
    {
      id: 'res-3',
      type: ReservationType.Cinema,
      name: 'Dune: Part Three',
      location: 'Magic Cinema, Blockbuster Mall',
      date: createDate(5, 21),
      status: ReservationStatus.Confirmed,
      details: 'Row G, Seats 11-12, IMAX',
      bookingURL: 'https://magiccinema.uz/',
    },
     {
      id: 'res-4',
      type: ReservationType.Tour,
      name: 'Samarkand Day Trip',
      location: 'Departure from Tashkent',
      date: createDate(25, 8),
      status: ReservationStatus.Pending,
      details: 'Waiting for guide confirmation',
    },
  ];
};

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedReservations = localStorage.getItem(STORAGE_KEY);
      if (storedReservations) {
        setReservations(JSON.parse(storedReservations));
      } else {
        setReservations(getSampleReservations());
      }
    } catch (error) {
      console.error("Failed to load reservations from localStorage", error);
      setReservations(getSampleReservations());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
      } catch (error) {
        console.error("Failed to save reservations to localStorage", error);
      }
    }
  }, [reservations, isLoading]);

  const addReservation = useCallback((reservation: Omit<Reservation, 'id'>) => {
    const newReservation: Reservation = {
      ...reservation,
      id: new Date().toISOString() + Math.random(),
    };
    setReservations(prev => [newReservation, ...prev]);
  }, []);

  const updateReservation = useCallback((updatedReservation: Reservation) => {
    setReservations(prev => 
      prev.map(res => res.id === updatedReservation.id ? updatedReservation : res)
    );
  }, []);

  const deleteReservation = useCallback((id: string) => {
    setReservations(prev => prev.filter(res => res.id !== id));
  }, []);

  return {
    reservations,
    addReservation,
    updateReservation,
    deleteReservation,
    isLoading,
  };
};