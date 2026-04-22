import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  Share,
  Heart,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  ChefHat,
  Wind,
  Waves,
  Droplets,
  Tv,
  Dumbbell,
  Bath as BathIcon,
  Flame,
  CookingPot,
  Briefcase,
  Dog,
  Award,
  MapPin,
  Check,
  XCircle,
} from 'lucide-react';
import { useProperty } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/context/AppContext';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { Loader } from '@/components/common/Loader';
import { Avatar } from '@/components/common/Avatar';
import { AMENITIES } from '@/utils/constants';
import { formatPrice, formatFullAddress, formatRating } from '@/utils/formatters';

const amenityIcons: Record<string, React.ElementType> = {
  Wifi, Car, ChefHat, Wind, Waves, Droplets, Tv, Dumbbell,
  BathIcon, Flame, CookingPot, Briefcase, Dog,
};

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { property, loading } = useProperty(id || '');
  const { isAuthenticated, user } = useAuth();
  const { isPropertyInWishlist, toggleWishlistItem } = useApp();
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  if (loading) {
    return (
      <div className="pt-24 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pt-24 text-center">
        <p className="text-lg text-gray-500">Propiedad no encontrada</p>
      </div>
    );
  }

  const isFavorited = isPropertyInWishlist(property.id);
  const isOwner = user?.id === property.host_id;

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    const params = new URLSearchParams({
      propertyId: property.id,
      checkIn,
      checkOut,
      guests: guests.toString(),
    });
    navigate(`/booking?${params.toString()}`);
  };

  const amenityList = property.amenities
    ?.map((a) => AMENITIES.find((am) => am.value === a))
    .filter(Boolean) || [];

  return (
    <div className="pt-20 lg:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">{property.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-current" />
                <span className="font-medium">{formatRating(property.rating)}</span>
                <span className="text-gray-500">· {property.review_count || 0} reseñas</span>
              </div>
              {property.is_superhost && (
                <>
                  <span>·</span>
                  <span className="font-medium">Superanfitrión</span>
                </>
              )}
              <span>·</span>
              <span className="text-gray-500 underline">
                {formatFullAddress(property.city, property.state, property.country)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlistItem(property.id)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart
                size={20}
                className={isFavorited ? 'fill-rose-500 text-rose-500' : ''}
              />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share size={20} />
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-8">
          <PropertyGallery images={property.images || []} title={property.title} />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <div className="border-b pb-8">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-gray-500" />
                  <span>{property.max_guests} huéspedes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed size={20} className="text-gray-500" />
                  <span>{property.bedrooms} habitaciones</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed size={20} className="text-gray-500" />
                  <span>{property.beds} camas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath size={20} className="text-gray-500" />
                  <span>{property.bathrooms} baños</span>
                </div>
              </div>
            </div>

            {/* Host Info */}
            <div className="border-b pb-8">
              <div className="flex items-center gap-4">
                <Avatar src={property.host?.avatar_url} size="lg" />
                <div>
                  <p className="font-semibold">
                    Anfitrión: {property.host?.full_name || 'Anónimo'}
                  </p>
                  {property.is_superhost && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Award size={14} />
                      Superanfitrión
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-b pb-8">
              <h2 className="text-xl font-semibold mb-4">Descripción</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="border-b pb-8">
              <h2 className="text-xl font-semibold mb-4">Lo que este lugar ofrece</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {amenityList.map((amenity) => {
                  if (!amenity) return null;
                  const IconComponent = amenityIcons[amenity.icon] || Wifi;
                  return (
                    <div key={amenity.value} className="flex items-center gap-3">
                      <IconComponent size={24} className="text-gray-600" />
                      <span>{amenity.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* House Rules */}
            {property.house_rules && (
              <div className="border-b pb-8">
                <h2 className="text-xl font-semibold mb-4">Reglas de la casa</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check size={20} className="text-green-500" />
                    <span>Check-in: {property.house_rules.check_in_time || '15:00'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check size={20} className="text-green-500" />
                    <span>Check-out: {property.house_rules.check_out_time || '11:00'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {property.house_rules.pets_allowed ? (
                      <Check size={20} className="text-green-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                    <span>Mascotas {property.house_rules.pets_allowed ? 'permitidas' : 'no permitidas'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {property.house_rules.smoking_allowed ? (
                      <Check size={20} className="text-green-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                    <span>Fumar {property.house_rules.smoking_allowed ? 'permitido' : 'no permitido'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Ubicación</h2>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin size={20} />
                <span>{formatFullAddress(property.city, property.state, property.country)}</span>
              </div>
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">Mapa de ubicación</p>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border rounded-2xl shadow-lg p-6 bg-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-2xl font-bold">
                    {formatPrice(property.price_per_night, property.currency)}
                  </span>
                  <span className="text-gray-500"> / noche</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-current" />
                  <span className="font-medium">{formatRating(property.rating)}</span>
                </div>
              </div>

              {!isOwner ? (
                <div className="space-y-4">
                  <div className="border rounded-xl overflow-hidden">
                    <div className="grid grid-cols-2 border-b">
                      <div className="p-3 border-r">
                        <label className="text-xs font-bold uppercase">Check-in</label>
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full text-sm mt-1 outline-none"
                        />
                      </div>
                      <div className="p-3">
                        <label className="text-xs font-bold uppercase">Check-out</label>
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full text-sm mt-1 outline-none"
                        />
                      </div>
                    </div>
                    <div className="p-3">
                      <label className="text-xs font-bold uppercase">Huéspedes</label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full text-sm mt-1 outline-none"
                      >
                        {Array.from({ length: property.max_guests }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'huésped' : 'huéspedes'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={!checkIn || !checkOut}
                    className="w-full py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {property.instant_book ? 'Reservar ahora' : 'Solicitar reserva'}
                  </button>

                  {property.instant_book && (
                    <p className="text-center text-sm text-gray-500">
                      Reserva inmediata disponible
                    </p>
                  )}

                  {/* Price Breakdown */}
                  {checkIn && checkOut && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="underline">
                          {formatPrice(property.price_per_night, property.currency)} x{' '}
                          {Math.ceil(
                            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{' '}
                          noches
                        </span>
                        <span>
                          {formatPrice(
                            property.price_per_night *
                              Math.ceil(
                                (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              ),
                            property.currency
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="underline">Tarifa de limpieza</span>
                        <span>{formatPrice(50, property.currency)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="underline">Tarifa de servicio</span>
                        <span>
                          {formatPrice(
                            Math.round(
                              property.price_per_night *
                                Math.ceil(
                                  (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                ) *
                                0.12
                            ),
                            property.currency
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Total</span>
                        <span>
                          {formatPrice(
                            property.price_per_night *
                              Math.ceil(
                                (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              ) +
                              50 +
                              Math.round(
                                property.price_per_night *
                                  Math.ceil(
                                    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
                                      (1000 * 60 * 60 * 24)
                                  ) *
                                  0.12
                              ),
                            property.currency
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">Esta es tu propiedad</p>
                  <button
                    onClick={() => navigate('/host/properties')}
                    className="w-full py-3 border border-black rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Gestionar propiedad
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
