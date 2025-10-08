
export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  RUB = 'RUB',
  UZS = 'UZS',
}

export enum BillingCycle {
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
  SemiAnnually = 'SemiAnnually',
  Annually = 'Annually',
}

export enum Category {
  Entertainment = 'Entertainment',
  Work = 'Work',
  Education = 'Education',
  Health = 'Health',
  Other = 'Other',
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  billingCycle: BillingCycle;
  firstPaymentDate: string; // ISO string format
  category: Category;
  notes?: string;
}

export enum ReservationType {
  Hotel = 'Hotel',
  Restaurant = 'Restaurant',
  Tour = 'Tour',
  Cinema = 'Cinema',
}

export enum ReservationStatus {
  Confirmed = 'Confirmed',
  Pending = 'Pending',
  Cancelled = 'Cancelled',
}

export interface Reservation {
  id: string;
  type: ReservationType;
  name: string; // e.g., "Grand Hyatt", "Le Bernardin", "City Walking Tour", "Dune: Part Two"
  location: string; // e.g., "New York, NY", "Paris, France"
  date: string; // ISO string for date and time
  status: ReservationStatus;
  details?: string; // e.g., "Room 404, King Bed", "Table for 2 by the window", "Seat J12"
  bookingURL?: string;
}

export type View = 'dashboard' | 'list' | 'calendar' | 'profile' | 'reservations';

export type SortOption = 'nextPaymentDate' | 'name' | 'amount' | 'category';
