import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import PropertyDetail from '@/pages/PropertyDetail';
import Booking from '@/pages/Booking';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import BecomeHost from '@/pages/Auth/BecomeHost';
import GuestDashboard from '@/pages/GuestDashboard';
import HostDashboard from '@/pages/HostDashboard';
import PropertyForm from '@/pages/HostDashboard/PropertyForm';
import Messages from '@/pages/Messages';
import Profile from '@/pages/Profile';
import Wishlist from '@/pages/Wishlist';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/host/become" element={<BecomeHost />} />
              <Route path="/dashboard" element={<GuestDashboard />} />
              <Route path="/host/dashboard" element={<HostDashboard />} />
              <Route path="/host/properties" element={<HostDashboard />} />
              <Route path="/host/properties/new" element={<PropertyForm />} />
              <Route path="/host/properties/:id/edit" element={<PropertyForm />} />
              <Route path="/host/bookings" element={<HostDashboard />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
