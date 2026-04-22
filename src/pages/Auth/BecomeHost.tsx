import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Shield, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/common/Loader';

const BecomeHostPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleStartHosting = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { redirect: '/host/become' } });
      return;
    }

    setSubmitting(true);
    // Update user role to host in Supabase
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitting(false);
    navigate('/host/properties/new');
  };

  const benefits = [
    {
      icon: DollarSign,
      title: 'Genera ingresos',
      description: 'Gana dinero extra alquilando tu espacio a viajeros de todo el mundo.',
    },
    {
      icon: Shield,
      title: 'Protección incluida',
      description: 'Cobertura de hasta $1M en daños a la propiedad y seguro de responsabilidad civil.',
    },
    {
      icon: Users,
      title: 'Tú tienes el control',
      description: 'Elige tus precios, disponibilidad y reglas de la casa.',
    },
  ];

  const steps = [
    'Crea tu anuncio gratuito',
    'Establece tu disponibilidad',
    'Recibe reservas',
    'Recibe tus pagos',
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1920&q=80"
            alt="Become a host"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Conviértete en anfitrión
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Comparte tu espacio, genera ingresos y forma parte de una comunidad global de anfitriones.
          </p>
          <button
            onClick={handleStartHosting}
            disabled={submitting}
            className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            {submitting ? (
              <Loader size="sm" />
            ) : (
              <span className="flex items-center gap-2">
                Empezar ahora
                <ArrowRight size={20} />
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-center mb-12">¿Por qué ser anfitrión?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <benefit.icon size={28} className="text-rose-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-500">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Cómo funciona</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s} className="text-center">
                <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  {i + 1}
                </div>
                <p className="font-medium">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">Preguntas frecuentes</h2>
        <div className="space-y-4">
          {[
            {
              q: '¿Cuánto cuesta publicar?',
              a: 'Publicar tu propiedad en RentPro es completamente gratis. Solo cobramos una pequeña comisión cuando recibes una reserva confirmada.',
            },
            {
              q: '¿Quién puede ser anfitrión?',
              a: 'Cualquier persona mayor de edad con un espacio para compartir puede ser anfitrión. Puedes alquilar una habitación, un apartamento completo o una casa.',
            },
            {
              q: '¿Cómo me pagan?',
              a: 'Los pagos se procesan de forma segura a través de Stripe. Recibirás el pago en tu cuenta bancaria dentro de 24-48 horas después del check-in del huésped.',
            },
            {
              q: '¿Qué pasa si hay daños?',
              a: 'Todos los anfitriones están protegidos con nuestra cobertura de hasta $1M en daños a la propiedad. También puedes solicitar un depósito de seguridad.',
            },
          ].map((faq) => (
            <div key={faq.q} className="border rounded-xl p-4">
              <h3 className="font-semibold mb-2">{faq.q}</h3>
              <p className="text-gray-500 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">¿Listo para empezar?</h2>
          <p className="text-gray-500 mb-8">
            Únete a miles de anfitriones que ya están generando ingresos con RentPro.
          </p>
          <button
            onClick={handleStartHosting}
            disabled={submitting}
            className="px-8 py-4 bg-rose-500 text-white rounded-xl font-semibold text-lg hover:bg-rose-600 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Procesando...' : 'Crear mi anuncio'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default BecomeHostPage;
