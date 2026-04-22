import type { PropertyCategory, PropertyType, Amenity } from '@/types';

export const PROPERTY_CATEGORIES: { value: PropertyCategory; label: string; icon: string }[] = [
  { value: 'beach', label: 'Playa', icon: 'Waves' },
  { value: 'mountain', label: 'Montaña', icon: 'Mountain' },
  { value: 'countryside', label: 'Campo', icon: 'TreePine' },
  { value: 'city', label: 'Ciudad', icon: 'Building2' },
  { value: 'camping', label: 'Camping', icon: 'Tent' },
  { value: 'cabin', label: 'Cabañas', icon: 'Home' },
  { value: 'luxury', label: 'Lujo', icon: 'Crown' },
  { value: 'tiny_home', label: 'Tiny Homes', icon: 'Warehouse' },
  { value: 'lakefront', label: 'Frente al lago', icon: 'Fish' },
];

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Apartamento' },
  { value: 'room', label: 'Habitación' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'cabin', label: 'Cabaña' },
  { value: 'villa', label: 'Villa' },
  { value: 'tiny_home', label: 'Tiny Home' },
];

export const AMENITIES: { value: Amenity; label: string; icon: string; category: 'basic' | 'features' | 'safety' | 'rules' }[] = [
  { value: 'wifi', label: 'WiFi', icon: 'Wifi', category: 'basic' },
  { value: 'kitchen', label: 'Cocina', icon: 'ChefHat', category: 'basic' },
  { value: 'pool', label: 'Piscina', icon: 'Waves', category: 'features' },
  { value: 'ac', label: 'Aire acondicionado', icon: 'Wind', category: 'basic' },
  { value: 'parking', label: 'Estacionamiento', icon: 'Car', category: 'basic' },
  { value: 'washer', label: 'Lavadora', icon: 'Droplets', category: 'basic' },
  { value: 'dryer', label: 'Secadora', icon: 'Shirt', category: 'basic' },
  { value: 'tv', label: 'TV', icon: 'Tv', category: 'basic' },
  { value: 'gym', label: 'Gimnasio', icon: 'Dumbbell', category: 'features' },
  { value: 'hot_tub', label: 'Jacuzzi', icon: 'Bath', category: 'features' },
  { value: 'fireplace', label: 'Chimenea', icon: 'Flame', category: 'features' },
  { value: 'grill', label: 'Parrilla', icon: 'CookingPot', category: 'features' },
  { value: 'workspace', label: 'Espacio de trabajo', icon: 'Briefcase', category: 'basic' },
  { value: 'pets_allowed', label: 'Mascotas permitidas', icon: 'Dog', category: 'rules' },
  { value: 'smoking_allowed', label: 'Permitido fumar', icon: 'Cigarette', category: 'rules' },
  { value: 'events_allowed', label: 'Eventos permitidos', icon: 'PartyPopper', category: 'rules' },
];

export const CANCELLATION_POLICIES = [
  { value: 'flexible' as const, label: 'Flexible', description: 'Reembolso completo hasta 24h antes del check-in' },
  { value: 'moderate' as const, label: 'Moderada', description: 'Reembolso completo hasta 5 días antes del check-in' },
  { value: 'strict' as const, label: 'Estricta', description: 'Reembolso del 50% hasta 7 días antes del check-in' },
];

export const DEFAULT_CURRENCY = 'USD';

export const SERVICE_FEE_PERCENTAGE = 12;

export const CLEANING_FEE_DEFAULT = 50;

export const MAX_GUESTS_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

export const BED_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const BATHROOM_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];

export const SUPABASE_BUCKET_NAME = 'rentpro';

export const APP_NAME = 'RentPro';

export const MAP_CENTER_DEFAULT = { lat: 25.7617, lng: -80.1918 }; // Miami
