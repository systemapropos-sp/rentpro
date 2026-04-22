import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Map, List } from 'lucide-react';
import { useProperties } from '@/hooks/useProperties';
import { useApp } from '@/context/AppContext';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertyMap } from '@/components/property/PropertyMap';
import { Loader } from '@/components/common/Loader';
import { Modal } from '@/components/common/Modal';
import { PROPERTY_TYPES, AMENITIES, BEDROOM_OPTIONS, BATHROOM_OPTIONS } from '@/utils/constants';
import type { SearchFilters, PropertyType, Amenity } from '@/types';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { isMapView, setIsMapView } = useApp();
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilters>({});

  const location = searchParams.get('location') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = parseInt(searchParams.get('guests') || '1');
  const category = searchParams.get('category') || '';

  const filters: SearchFilters = {
    location: location || undefined,
    checkIn: checkIn || undefined,
    checkOut: checkOut || undefined,
    guests,
    category: category as SearchFilters['category'],
    ...localFilters,
  };

  const { properties, loading } = useProperties(filters);

  const updateLocalFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const togglePropertyType = (type: PropertyType) => {
    setLocalFilters((prev) => {
      const current = prev.propertyType || [];
      const updated = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type];
      return { ...prev, propertyType: updated.length > 0 ? updated : undefined };
    });
  };

  const toggleAmenity = (amenity: Amenity) => {
    setLocalFilters((prev) => {
      const current = prev.amenities || [];
      const updated = current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity];
      return { ...prev, amenities: updated.length > 0 ? updated : undefined };
    });
  };

  const clearFilters = () => {
    setLocalFilters({});
  };

  // Calculate map center from properties
  const mapCenter = properties.length > 0
    ? {
        lat: properties.reduce((sum, p) => sum + p.latitude, 0) / properties.length,
        lng: properties.reduce((sum, p) => sum + p.longitude, 0) / properties.length,
      }
    : undefined;

  return (
    <div className="pt-20 lg:pt-24 h-screen flex flex-col">
      {/* Top Bar */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold truncate">
                {location ? `Resultados para "${location}"` : 'Todos los alojamientos'}
              </h1>
              <p className="text-sm text-gray-500">
                {loading ? 'Cargando...' : `${properties.length} alojamientos encontrados`}
                {checkIn && checkOut && ` · ${checkIn} - ${checkOut}`}
                {guests > 1 && ` · ${guests} huéspedes`}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal size={18} />
                <span className="hidden sm:inline text-sm font-medium">Filtros</span>
              </button>
              <button
                onClick={() => setIsMapView(!isMapView)}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isMapView ? <List size={18} /> : <Map size={18} />}
                <span className="hidden sm:inline text-sm font-medium">
                  {isMapView ? 'Lista' : 'Mapa'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Property List */}
        <div
          className={`flex-1 overflow-y-auto ${isMapView ? 'hidden lg:block lg:w-1/2' : 'w-full'}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader size="lg" />
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-gray-500">No se encontraron alojamientos</p>
                <p className="text-sm text-gray-400 mt-2">
                  Intenta cambiar tus filtros de búsqueda
                </p>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  isMapView
                    ? 'grid-cols-1'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}
              >
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map View */}
        {isMapView && (
          <div className="flex-1 lg:w-1/2">
            <PropertyMap
              properties={properties}
              center={mapCenter}
              zoom={12}
            />
          </div>
        )}
      </div>

      {/* Filters Modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-8">
          {/* Price Range */}
          <div>
            <h3 className="font-semibold mb-4">Rango de precio</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-500">Mínimo</label>
                <input
                  type="number"
                  value={localFilters.minPrice || ''}
                  onChange={(e) =>
                    updateLocalFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="$0"
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-500">Máximo</label>
                <input
                  type="number"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) =>
                    updateLocalFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="$1000+"
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <h3 className="font-semibold mb-4">Tipo de propiedad</h3>
            <div className="grid grid-cols-2 gap-2">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => togglePropertyType(type.value)}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    localFilters.propertyType?.includes(type.value)
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rooms & Beds */}
          <div>
            <h3 className="font-semibold mb-4">Habitaciones y camas</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Habitaciones</label>
                <select
                  value={localFilters.bedrooms || ''}
                  onChange={(e) =>
                    updateLocalFilter('bedrooms', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                >
                  <option value="">Cualquiera</option>
                  {BEDROOM_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}+ habitaciones
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500">Baños</label>
                <select
                  value={localFilters.bathrooms || ''}
                  onChange={(e) =>
                    updateLocalFilter('bathrooms', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                >
                  <option value="">Cualquiera</option>
                  {BATHROOM_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}+ baños
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="font-semibold mb-4">Servicios</h3>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES.filter((a) => a.category === 'basic' || a.category === 'features').map(
                (amenity) => (
                  <button
                    key={amenity.value}
                    onClick={() => toggleAmenity(amenity.value)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm transition-colors ${
                      localFilters.amenities?.includes(amenity.value)
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {amenity.label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Additional Filters */}
          <div>
            <h3 className="font-semibold mb-4">Opciones adicionales</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.superhost || false}
                  onChange={(e) => updateLocalFilter('superhost', e.target.checked || undefined)}
                  className="w-5 h-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                />
                <span className="text-sm">Solo superanfitriones</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.instantBook || false}
                  onChange={(e) => updateLocalFilter('instantBook', e.target.checked || undefined)}
                  className="w-5 h-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                />
                <span className="text-sm">Reserva inmediata</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.petsAllowed || false}
                  onChange={(e) => updateLocalFilter('petsAllowed', e.target.checked || undefined)}
                  className="w-5 h-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                />
                <span className="text-sm">Permite mascotas</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t">
          <button
            onClick={clearFilters}
            className="text-sm font-medium underline hover:text-gray-600"
          >
            Limpiar todo
          </button>
          <button
            onClick={() => setShowFilters(false)}
            className="px-6 py-3 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
          >
            Mostrar {properties.length} resultados
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SearchPage;
