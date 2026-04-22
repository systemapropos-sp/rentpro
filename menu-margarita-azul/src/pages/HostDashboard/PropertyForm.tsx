import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useHost } from '@/hooks/useHost';
import { useProperty } from '@/hooks/useProperties';
import {
  PROPERTY_TYPES,
  PROPERTY_CATEGORIES,
  AMENITIES,
  CANCELLATION_POLICIES,
} from '@/utils/constants';
import { validatePropertyForm } from '@/utils/validators';
import type { PropertyType, Amenity, PropertyCategory, CancellationPolicy } from '@/types';

const PropertyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createNewProperty, updateExistingProperty, loading: saving } = useHost();
  const { property: existingProperty } = useProperty(id || '');

  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: existingProperty?.title || '',
    description: existingProperty?.description || '',
    location: existingProperty?.location || '',
    city: existingProperty?.city || '',
    state: existingProperty?.state || '',
    country: existingProperty?.country || 'EE.UU.',
    price_per_night: existingProperty?.price_per_night || 100,
    max_guests: existingProperty?.max_guests || 4,
    bedrooms: existingProperty?.bedrooms || 1,
    beds: existingProperty?.beds || 1,
    bathrooms: existingProperty?.bathrooms || 1,
    property_type: existingProperty?.property_type || ('house' as PropertyType),
    category: existingProperty?.category || ('city' as PropertyCategory),
    amenities: existingProperty?.amenities || ([] as Amenity[]),
    cancellation_policy: existingProperty?.cancellation_policy || ('flexible' as CancellationPolicy),
    instant_book: existingProperty?.instant_book || false,
    house_rules: existingProperty?.house_rules || {
      pets_allowed: false,
      smoking_allowed: false,
      events_allowed: false,
      check_in_time: '15:00',
      check_out_time: '11:00',
      min_age: 18,
    },
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>(
    existingProperty?.images || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleAmenityToggle = (amenity: Amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files);
    setImages((prev) => [...prev, ...newImages]);

    const newUrls = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls((prev) => [...prev, ...newUrls]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = validatePropertyForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    if (imagePreviewUrls.length === 0) {
      setErrors({ images: 'Sube al menos una imagen' });
      return;
    }

    try {
      if (isEditing && id) {
        await updateExistingProperty(id, {
          ...formData,
          host_id: user!.id,
          latitude: 25.7617,
          longitude: -80.1918,
          currency: 'USD',
          images: imagePreviewUrls,
        });
      } else {
        await createNewProperty(
          {
            ...formData,
            host_id: user!.id,
            latitude: 25.7617,
            longitude: -80.1918,
            currency: 'USD',
            rating: 0,
            review_count: 0,
          },
          images
        );
      }
      navigate('/host/dashboard');
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  return (
    <div className="pt-20 lg:pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl lg:text-3xl font-bold mb-6">
          {isEditing ? 'Editar propiedad' : 'Nueva propiedad'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Información básica</h2>

            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ej: Villa de lujo con vista al mar"
                className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe tu propiedad..."
                rows={4}
                className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none resize-none"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ciudad</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Detalles de la propiedad</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de propiedad</label>
                <select
                  value={formData.property_type}
                  onChange={(e) => handleChange('property_type', e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  {PROPERTY_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Precio/noche</label>
                <input
                  type="number"
                  value={formData.price_per_night}
                  onChange={(e) => handleChange('price_per_night', Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Huéspedes</label>
                <input
                  type="number"
                  value={formData.max_guests}
                  onChange={(e) => handleChange('max_guests', Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Habitaciones</label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleChange('bedrooms', Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Baños</label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleChange('bathrooms', Number(e.target.value))}
                  min={0.5}
                  step={0.5}
                  className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Servicios</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITIES.map((amenity) => (
                <button
                  key={amenity.value}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity.value)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm transition-colors ${
                    formData.amenities.includes(amenity.value)
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {amenity.label}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Fotos</h2>
            {errors.images && <p className="text-red-500 text-xs">{errors.images}</p>}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">Subir foto</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Cancellation & Rules */}
          <div className="border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Políticas</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Política de cancelación</label>
              <div className="space-y-2">
                {CANCELLATION_POLICIES.map((policy) => (
                  <label key={policy.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="cancellation"
                      value={policy.value}
                      checked={formData.cancellation_policy === policy.value}
                      onChange={() => handleChange('cancellation_policy', policy.value)}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="font-medium text-sm">{policy.label}</p>
                      <p className="text-xs text-gray-500">{policy.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.instant_book}
                onChange={(e) => handleChange('instant_book', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-rose-500"
              />
              <label className="text-sm">Permitir reserva inmediata</label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/host/dashboard')}
              className="flex-1 py-3 border rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear propiedad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyFormPage;
