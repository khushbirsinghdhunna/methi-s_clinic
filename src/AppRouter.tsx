// =============================================================================
// Hash-Based Router — Lightweight SPA routing without external dependencies
// =============================================================================
// Routes:
//   #/              → Homepage (existing portfolio)
//   #/appointment   → Patient appointment booking page
//   #/appointment/:id → Patient appointment status page
//   #/admin         → Admin dashboard (not linked publicly)
// =============================================================================

import { useState, useEffect } from 'react';
import App from './App';

// Lazy-load appointment pages to keep homepage bundle small
import AppointmentPage from './components/AppointmentPage';
import AppointmentStatusPage from './components/AppointmentStatusPage';
import AdminDashboard from './components/AdminDashboard';
import WhatsAppStatusPage from './components/WhatsAppStatusPage';

type Route =
  | { page: 'home' }
  | { page: 'appointment' }
  | { page: 'appointmentStatus'; id: string }
  | { page: 'admin' }
  | { page: 'whatsapp' };

function parseHash(hash: string): Route {
  const cleaned = hash.replace(/^#\/?/, '');

  if (cleaned === '' || cleaned === '/') {
    return { page: 'home' };
  }

  if (cleaned === 'appointment') {
    return { page: 'appointment' };
  }

  // Match appointment/:id
  const statusMatch = cleaned.match(/^appointment\/(.+)$/);
  if (statusMatch) {
    return { page: 'appointmentStatus', id: statusMatch[1] };
  }

  if (cleaned === 'admin') {
    return { page: 'admin' };
  }
  
  if (cleaned === 'whatsapp') {
    return { page: 'whatsapp' };
  }

  // Fallback to home
  return { page: 'home' };
}

export default function AppRouter() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash(window.location.hash));
      // Scroll to top on route change
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  switch (route.page) {
    case 'home':
      return <App />;
    case 'appointment':
      return <AppointmentPage />;
    case 'appointmentStatus':
      return <AppointmentStatusPage appointmentId={route.id} />;
    case 'admin':
      return <AdminDashboard />;
    case 'whatsapp':
      return <WhatsAppStatusPage />;
    default:
      return <App />;
  }
}
