import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useHostProperties } from '@/hooks/useProperties';
import { useHostBookings } from '@/hooks/useBookings';
import { Loader } from '@/components/common/Loader';
import { Modal } from '@/components/common/Modal';
import { useHost } from '@/hooks/useHost';
import { formatPrice, formatDate } from '@/utils/formatters';

const HostDashboard: React.FC = () => {
  const { user } = useAuth();
  const { properties, loading: propertiesLoading, refetch: refetchProperties } = useHostProperties(user?.id || '');
  const { bookings, loading: bookingsLoading } = useHostBookings(user?.id || '');
  const { removeProperty } = useHost();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'bookings'>('overview');

  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return;
    try {
      await removeProperty(propertyToDelete);
      setDeleteModalOpen(false);
      setPropertyToDelete(null);
      refetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const stats = [
    {
      label: 'Propiedades',
      value: properties.length,
      icon: Home,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Reservas',
      value: bookings.length,
      icon: Calendar,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Ingresos',
      value: formatPrice(
        bookings
          .filter((b) => b.status === 'confirmed' || b.status === 'completed')
          .reduce((sum, b) => sum + b.total_price, 0),
        'USD'
      ),
      icon: DollarSign,
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      label: 'Rating promedio',
      value:
        properties.length > 0
          ? (properties.reduce((sum, p) => sum + (p.rating || 0), 0) / properties.length).toFixed(2)
          : '0.00',
      icon: Star,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  if (propertiesLoading || bookingsLoading) {
    return (
      <div className="pt-24 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold">Panel de anfitrión</h1>
          <Link
            to="/host/properties/new"
            className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Nueva propiedad</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b mb-6">
          {[
            { key: 'overview' as const, label: 'Resumen', icon: TrendingUp },
            { key: 'properties' as const, label: 'Propiedades', icon: Home },
            { key: 'bookings' as const, label: 'Reservas', icon: Calendar },
          ].map((tab) => (
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

        {/* Overview */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => (
                <div key={stat.label} className="border rounded-xl p-4">
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                    <stat.icon size={20} />
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Bookings */}
            <h2 className="text-xl font-semibold mb-4">Reservas recientes</h2>
            {bookings.length === 0 ? (
              <div className="text-center py-12 border rounded-xl">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Aún no tienes reservas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 p-4 border rounded-xl">
                    <img
                      src={booking.property?.images?.[0] || '/images/placeholder.jpg'}
                      alt={booking.property?.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{booking.property?.title}</p>
                      <p className="text-sm text-gray-500">
                        {booking.guest?.full_name} · {formatDate(booking.check_in)} -{' '}
                        {formatDate(booking.check_out)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold">{formatPrice(booking.total_price, booking.currency)}</p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Properties */}
        {activeTab === 'properties' && (
          <div>
            {properties.length === 0 ? (
              <div className="text-center py-16">
                <Home size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-lg text-gray-500 mb-2">No tienes propiedades</p>
                <p className="text-sm text-gray-400 mb-6">Publica tu primera propiedad y empieza a recibir huéspedes.</p>
                <Link
                  to="/host/properties/new"
                  className="inline-block px-6 py-3 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
                >
                  Publicar propiedad
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 border rounded-xl hover:shadow-md transition-shadow"
                  >
                    <img
                      src={property.images?.[0] || '/images/placeholder.jpg'}
                      alt={property.title}
                      className="w-full sm:w-48 h-40 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{property.title}</h3>
                          <p className="text-sm text-gray-500">
                            {property.city}, {property.state}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                              <Star size={14} className="fill-current" />
                              {property.rating?.toFixed(2) || 'Nuevo'}
                            </span>
                            <span>{formatPrice(property.price_per_night, property.currency)}/noche</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Link
                          to={`/property/${property.id}`}
                          className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
                        >
                          <Eye size={14} />
                          Ver
                        </Link>
                        <Link
                          to={`/host/properties/${property.id}/edit`}
                          className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
                        >
                          <Edit size={14} />
                          Editar
                        </Link>
                        <button
                          onClick={() => {
                            setPropertyToDelete(property.id);
                            setDeleteModalOpen(true);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings */}
        {activeTab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Aún no tienes reservas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500">
                      <th className="pb-3 font-medium">Propiedad</th>
                      <th className="pb-3 font-medium">Huésped</th>
                      <th className="pb-3 font-medium">Fechas</th>
                      <th className="pb-3 font-medium">Total</th>
                      <th className="pb-3 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={booking.property?.images?.[0] || '/images/placeholder.jpg'}
                              alt=""
                              className="w-10 h-10 rounded object-cover"
                            />
                            <span className="font-medium text-sm">{booking.property?.title}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm">{booking.guest?.full_name}</td>
                        <td className="py-4 text-sm">
                          {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                        </td>
                        <td className="py-4 font-medium text-sm">
                          {formatPrice(booking.total_price, booking.currency)}
                        </td>
                        <td className="py-4">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Eliminar propiedad"
      >
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <p className="text-gray-600 mb-6">
            ¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteProperty}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HostDashboard;
