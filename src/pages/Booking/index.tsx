import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CreditCard } from 'lucide-react';
import { useProperty } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import { useCreateBooking } from '@/hooks/useBookings';
import { Loader } from '@/components/common/Loader';
import { Avatar } from '@/components/common/Avatar';
import { calculatePricing } from '@/services/paymentApi';
import { formatPrice, formatDate, calculateNights } from '@/utils/formatters';

const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { create, loading: creatingBooking } = useCreateBooking();

  const propertyId = searchParams.get('propertyId') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = parseInt(searchParams.get('guests') || '1');

  const { property, loading } = useProperty(propertyId);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (loading) {
    return (
      <div className="pt-24 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!property || !checkIn || !checkOut) {
    return (
      <div className="pt-24 text-center">
        <p className="text-lg text-gray-500">Información de reserva incompleta</p>
        <button
          onClick={() => navigate('/search')}
          className="mt-4 text-rose-500 underline"
        >
          Volver a búsqueda
        </button>
      </div>
    );
  }

  const nights = calculateNights(checkIn, checkOut);
  const pricing = calculatePricing(property.price_per_night, nights);

  const handleConfirmBooking = async () => {
    if (!agreedToTerms) return;

    try {
      await create({
        property_id: property.id,
        guest_id: user?.id || '',
        host_id: property.host_id,
        check_in: checkIn,
        check_out: checkOut,
        guests_count: guests,
        total_nights: nights,
        nightly_price: property.price_per_night,
        cleaning_fee: pricing.cleaningFee,
        service_fee: pricing.serviceFee,
        total_price: pricing.total,
        currency: property.currency,
        status: 'pending',
        payment_status: 'pending',
      });

      navigate('/dashboard?tab=upcoming');
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  return (
    <div className="pt-20 lg:pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-lg font-semibold mb-6 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft size={24} />
          Solicitud de reserva
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Details */}
          <div className="space-y-8">
            {/* Trip Details */}
            <div className="border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Tu viaje</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Fechas</p>
                    <p className="text-gray-500 text-sm">
                      {formatDate(checkIn)} - {formatDate(checkOut)}
                    </p>
                  </div>
                  <button className="text-sm underline font-medium">Editar</button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Huéspedes</p>
                    <p className="text-gray-500 text-sm">
                      {guests} {guests === 1 ? 'huésped' : 'huéspedes'}
                    </p>
                  </div>
                  <button className="text-sm underline font-medium">Editar</button>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Pagar con</h2>
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                <CreditCard size={24} />
                <div>
                  <p className="font-medium">Tarjeta de crédito o débito</p>
                  <p className="text-sm text-gray-500">Visa, Mastercard, Amex</p>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                />
                <span className="text-sm text-gray-600">
                  Acepto las políticas de cancelación, las reglas de la casa de{' '}
                  {property.host?.full_name || 'el anfitrión'} y los términos de servicio de RentPro.
                </span>
              </label>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmBooking}
              disabled={!agreedToTerms || creatingBooking}
              className="w-full py-4 bg-rose-500 text-white rounded-xl font-semibold text-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {creatingBooking ? 'Procesando...' : 'Confirmar y pagar'}
            </button>

            {/* Security Note */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield size={16} />
              <span>Tu pago está protegido con cifrado SSL</span>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div>
            <div className="border rounded-xl p-6 sticky top-24">
              {/* Property Summary */}
              <div className="flex gap-4 pb-6 border-b">
                <img
                  src={property.images?.[0] || '/images/placeholder.jpg'}
                  alt={property.title}
                  className="w-24 h-20 object-cover rounded-lg"
                />
                <div>
                  <p className="text-sm text-gray-500">{property.property_type}</p>
                  <h3 className="font-semibold">{property.title}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <span>★ {property.rating?.toFixed(2)}</span>
                    <span className="text-gray-500">({property.review_count} reseñas)</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="py-6 border-b space-y-3">
                <h3 className="font-semibold text-lg">Desglose de precios</h3>
                <div className="flex justify-between">
                  <span className="underline">
                    {formatPrice(property.price_per_night, property.currency)} x {nights} noches
                  </span>
                  <span>{formatPrice(pricing.subtotal, property.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Tarifa de limpieza</span>
                  <span>{formatPrice(pricing.cleaningFee, property.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Tarifa de servicio de RentPro</span>
                  <span>{formatPrice(pricing.serviceFee, property.currency)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between pt-6 font-bold text-lg">
                <span>Total ({property.currency})</span>
                <span>{formatPrice(pricing.total, property.currency)}</span>
              </div>

              {/* Host Info */}
              <div className="mt-6 pt-6 border-t flex items-center gap-3">
                <Avatar src={property.host?.avatar_url} size="sm" />
                <div>
                  <p className="text-sm font-medium">{property.host?.full_name || 'Anfitrión'}</p>
                  <p className="text-xs text-gray-500">Tu anfitrión</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
