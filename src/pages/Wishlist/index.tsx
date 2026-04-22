import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/context/AppContext';
import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Loader } from '@/components/common/Loader';

const WishlistPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { wishlist } = useApp();
  const { properties, loading } = useProperties();

  const wishlistProperties = properties.filter((p) => wishlist.includes(p.id));

  if (!isAuthenticated) {
    return (
      <div className="pt-24 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Inicia sesión para ver tus favoritos</h2>
          <p className="text-gray-500 mb-6">Guarda tus alojamientos favoritos para verlos más tarde.</p>
          <Link
            to="/auth/login"
            className="inline-block px-6 py-3 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-24 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl lg:text-3xl font-bold mb-6">Favoritos</h1>

        {wishlistProperties.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-lg text-gray-500 mb-2">No tienes favoritos guardados</p>
            <p className="text-sm text-gray-400 mb-6">
              Haz clic en el corazón de cualquier alojamiento para guardarlo.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
            >
              <Search size={18} />
              Explorar alojamientos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
