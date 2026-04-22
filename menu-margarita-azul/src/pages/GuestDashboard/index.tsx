import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle, MapPin, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGuestBookings } from '@/hooks/useBookings';
import { Loader } from '@/components/common/Loader';
import { formatDate, formatPrice } from '@/utils/formatters';

type TabType = 'upcoming' | 'past' | 'cancelled';

const GuestDashboard: React.FC = () => {
  const { user } = useAuth();
  const { bookings, loading } = useGuestBookings(user?.id || '');
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') return b.status === 'confirmed' || b.status === 'pending';
    if (activeTab === 'past') return b.status === 'completed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
    { key: 'upcoming', label: 'Próximos', icon: Calendar },
    { key: 'past', label: 'Completados', icon: CheckCircle },
    { key: 'cancelled', label: 'Cancelados', icon: XCircle },
  ];

  if (loading) {
    return (
      <div className="pt-24 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl lg:text-3xl font-bold mb-6">Mis viajes</h1>

        {/* Tabs */}
        <div className="flex gap-1 border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-lg text-gray-500 mb-2">No tienes viajes {activeTab}</p>
            <p className="text-sm text-gray-400 mb-6">
              {activeTab === 'upcoming' && 'Cuando reserves un alojamiento, aparecerá aquí.'}
              {activeTab === 'past' && 'Los viajes completados aparecerán aquí.'}
              {activeTab === 'cancelled' && 'Las reservas canceladas aparecerán aquí.'}
            </p>
            <Link
              to="/search"
              className="inline-block px-6 py-3 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
            >
              Explorar alojamientos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row">
                  <img
                    src={booking.property?.images?.[0] || '/images/placeholder.jpg'}
                    alt={booking.property?.title}
                    className="w-full sm:w-48 h-48 sm:h-40 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          {booking.property?.city}, {booking.property?.state}
                        </p>
                        <h3 className="font-semibold text-lg mb-1">
                          {booking.property?.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock size={14} />
                          <span>
                            {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {booking.status === 'confirmed'
                            ? 'Confirmado'
                            : booking.status === 'pending'
                            ? 'Pendiente'
                            : booking.status === 'cancelled'
                            ? 'Cancelado'
                            : 'Completado'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin size={14} />
                          <span>{booking.total_nights} noches</span>
                        </div>
                        <div className="text-sm font-medium">
                          {formatPrice(booking.total_price, booking.currency)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {booking.status === 'confirmed' && (
                          <Link
                            to={`/messages?property=${booking.property_id}&host=${booking.host_id}`}
                            className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
                          >
                            <MessageSquare size={14} />
                            Mensaje
                          </Link>
                        )}
                        <Link
                          to={`/property/${booking.property_id}`}
                          className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-sm hover:bg-rose-600 transition-colors"
                        >
                          Ver detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestDashboard;
