import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Map } from 'lucide-react';
import { useFeaturedProperties } from '@/hooks/useProperties';
import { useApp } from '@/context/AppContext';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Loader } from '@/components/common/Loader';
import { PROPERTY_CATEGORIES } from '@/utils/constants';
import {
  Waves,
  Mountain,
  TreePine,
  Building2,
  Tent,
  Home,
  Crown,
  Warehouse,
  Fish,
} from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  Waves,
  Mountain,
  TreePine,
  Building2,
  Tent,
  Home,
  Crown,
  Warehouse,
  Fish,
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { properties, loading } = useFeaturedProperties(12);
  const { selectedCategory, setSelectedCategory, isMapView, setIsMapView } = useApp();

  return (
    <div className="pt-20 lg:pt-24">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Encuentra tu próximo hogar lejos de casa
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Descubre alojamientos únicos en todo el mundo
          </p>

          {/* Search Bar */}
          <button
            onClick={() => navigate('/search')}
            className="w-full max-w-2xl mx-auto bg-white rounded-full p-2 pl-6 shadow-xl hover:shadow-2xl transition-shadow flex items-center gap-4"
          >
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900">¿A dónde vas?</p>
              <p className="text-xs text-gray-500">Cualquier lugar · Cualquier semana</p>
            </div>
            <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center shrink-0">
              <Search className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="sticky top-16 lg:top-20 bg-white z-30 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 py-4 overflow-x-auto scrollbar-hide">
            {PROPERTY_CATEGORIES.map((cat) => {
              const IconComponent = categoryIcons[cat.icon] || Home;
              return (
                <button
                  key={cat.value}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === cat.value ? null : cat.value
                    )
                  }
                  className={`flex flex-col items-center gap-1 min-w-[60px] pb-2 border-b-2 transition-colors whitespace-nowrap ${
                    selectedCategory === cat.value
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                  }`}
                >
                  <IconComponent size={24} />
                  <span className="text-xs font-medium">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Property Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Alojamientos destacados</h2>
          <button
            onClick={() => setIsMapView(!isMapView)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Map size={18} />
            <span className="text-sm font-medium">{isMapView ? 'Lista' : 'Mapa'}</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
