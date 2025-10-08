
import React, { useState, useMemo } from 'react';
import { useSubscriptions } from './hooks/useSubscriptions';
import { Subscription, View, Reservation, Currency, SortOption } from './types';
import { getNextPaymentDate } from './utils/dateUtils';
import Dashboard from './components/Dashboard';
import SubscriptionList from './components/SubscriptionList';
import CalendarView from './components/CalendarView';
import SubscriptionForm from './components/SubscriptionForm';
import Modal from './components/Modal';
import { Header } from './components/Header';
import { PlusIcon } from './components/icons/AppIcons';
import { useTheme } from './hooks/useTheme';
import LoginScreen from './components/LoginScreen';
import BottomNav from './components/BottomNav';
import Profile from './components/Profile';
import PaymentModal from './components/PaymentModal';
import { useReservations } from './hooks/useReservations';
import ReservationsView from './components/ReservationsView';
import ReservationForm from './components/ReservationForm';
import { useAppSettings } from './hooks/useAppSettings';
import { convertCurrency } from './constants';

export interface UserProfile {
  name: string;
  email: string;
  address: string;
  phone: string;
}

const App: React.FC = () => {
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription, isLoading, markAsPaid } = useSubscriptions();
  const { reservations, addReservation, updateReservation, deleteReservation } = useReservations();
  const { displayCurrency, setDisplayCurrency } = useAppSettings();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [theme, setTheme] = useTheme();
  const [sortOrder, setSortOrder] = useState<SortOption>('nextPaymentDate');

  // State for reservation flow
  const [isReservationFormOpen, setIsReservationFormOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  // State for payment flow
  const [payingSubscription, setPayingSubscription] = useState<Subscription | null>(null);
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set());

  // State for user profile
  const [user, setUser] = useState<UserProfile | null>(null);


  const sortedSubscriptions = useMemo(() => {
    return [...subscriptions].sort((a, b) => {
      switch (sortOrder) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'amount':
          const amountA = convertCurrency(a.amount, a.currency, Currency.USD);
          const amountB = convertCurrency(b.amount, b.currency, Currency.USD);
          return amountB - amountA; // High to low
        case 'category':
          return a.category.localeCompare(b.category);
        case 'nextPaymentDate':
        default:
          const nextDateA = getNextPaymentDate(a);
          const nextDateB = getNextPaymentDate(b);
          return nextDateA.getTime() - nextDateB.getTime();
      }
    });
  }, [subscriptions, sortOrder]);

  const handleAddClick = () => {
    if (currentView === 'reservations') {
      setEditingReservation(null);
      setIsReservationFormOpen(true);
    } else {
      setEditingSubscription(null);
      setIsFormModalOpen(true);
    }
  };

  const handleEditSubscriptionClick = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsFormModalOpen(true);
  };
  
  const handleSaveSubscription = (subscription: Omit<Subscription, 'id'> | Subscription) => {
    if ('id' in subscription) {
      updateSubscription(subscription);
    } else {
      addSubscription(subscription);
    }
    setIsFormModalOpen(false);
  };

  const handleEditReservationClick = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setIsReservationFormOpen(true);
  };

  const handleSaveReservation = (reservation: Omit<Reservation, 'id'> | Reservation) => {
    if ('id' in reservation) {
        updateReservation(reservation);
    } else {
        addReservation(reservation);
    }
    setIsReservationFormOpen(false);
  };

  const handleInitiatePayment = (subscription: Subscription) => {
    setPayingSubscription(subscription);
  };

  const handleConfirmPayment = (id: string) => {
    markAsPaid(id);
    setPaidIds(prev => new Set(prev).add(id));
    setPayingSubscription(null);
  };
  
  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // We don't clear localStorage here to simulate the user still being "registered"
    setIsAuthenticated(false);
    setUser(null);
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-gray-900 text-slate-500">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch(currentView) {
      case 'dashboard':
        return <Dashboard subscriptions={sortedSubscriptions} onEdit={handleEditSubscriptionClick} onPay={handleInitiatePayment} paidIds={paidIds} displayCurrency={displayCurrency} setDisplayCurrency={setDisplayCurrency} sortOrder={sortOrder} setSortOrder={setSortOrder} />;
      case 'list':
        return <SubscriptionList subscriptions={sortedSubscriptions} onEdit={handleEditSubscriptionClick} onDelete={deleteSubscription} onPay={handleInitiatePayment} paidIds={paidIds} displayCurrency={displayCurrency} sortOrder={sortOrder} setSortOrder={setSortOrder} />;
      case 'calendar':
        return <CalendarView subscriptions={subscriptions} />;
      case 'reservations':
        return <ReservationsView reservations={reservations} onEdit={handleEditReservationClick} onDelete={deleteReservation} />;
      case 'profile':
        return user && <Profile user={user} onUserChange={setUser} onLogout={handleLogout} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-200 font-sans">
      <Header 
        theme={theme}
        setTheme={setTheme}
        user={user!}
        setCurrentView={setCurrentView}
      />
      <main key={currentView} className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 fade-in">
        {renderView()}
      </main>
      
      {['dashboard', 'list', 'reservations'].includes(currentView) && (
        <button
          onClick={handleAddClick}
          className="fixed bottom-24 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 z-20"
          aria-label={currentView === 'reservations' ? "Add new booking" : "Add new subscription"}
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      )}

      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)}>
        <SubscriptionForm
          onSave={handleSaveSubscription}
          onCancel={() => setIsFormModalOpen(false)}
          subscription={editingSubscription}
        />
      </Modal>
      
      <Modal isOpen={isReservationFormOpen} onClose={() => setIsReservationFormOpen(false)}>
        <ReservationForm
          onSave={handleSaveReservation}
          onCancel={() => setIsReservationFormOpen(false)}
          reservation={editingReservation}
        />
      </Modal>

      {payingSubscription && (
        <PaymentModal
          isOpen={!!payingSubscription}
          onClose={() => setPayingSubscription(null)}
          subscription={payingSubscription}
          onConfirmPayment={handleConfirmPayment}
        />
      )}

      <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
};

export default App;
