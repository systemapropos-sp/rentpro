import { supabase } from './supabaseClient';
import { demoPropertyApi } from './demoApi';
import type { Property, SearchFilters } from '@/types';

const USE_DEMO = true;

function isSupabaseReady() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && url.length > 0 && !url.includes('your-project');
}

export async function getProperties(filters?: SearchFilters): Promise<Property[]> {
  if (USE_DEMO || !isSupabaseReady()) {
    return demoPropertyApi.getProperties(filters);
  }

  let query = supabase
    .from('properties')
    .select(`*, host:profiles(*)`);

  if (filters?.location) {
    query = query.or(`city.ilike.%${filters.location}%,state.ilike.%${filters.location}%`);
  }
  if (filters?.minPrice) query = query.gte('price_per_night', filters.minPrice);
  if (filters?.maxPrice) query = query.lte('price_per_night', filters.maxPrice);
  if (filters?.propertyType?.length) query = query.in('property_type', filters.propertyType);
  if (filters?.bedrooms) query = query.gte('bedrooms', filters.bedrooms);
  if (filters?.bathrooms) query = query.gte('bathrooms', filters.bathrooms);
  if (filters?.category) query = query.eq('category', filters.category);
  if (filters?.superhost) query = query.eq('is_superhost', true);
  if (filters?.instantBook) query = query.eq('instant_book', true);

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Property[];
}

export async function getPropertyById(id: string): Promise<Property | null> {
  if (USE_DEMO || !isSupabaseReady()) return demoPropertyApi.getPropertyById(id);
  const { data, error } = await supabase.from('properties').select(`*, host:profiles(*)`).eq('id', id).single();
  if (error) throw error;
  return data as unknown as Property | null;
}

export async function getFeaturedProperties(limit?: number): Promise<Property[]> {
  if (USE_DEMO || !isSupabaseReady()) return demoPropertyApi.getFeaturedProperties();
  const { data, error } = await supabase.from('properties').select(`*, host:profiles(*)`).order('rating', { ascending: false }).limit(limit || 12);
  if (error) throw error;
  return (data || []) as unknown as Property[];
}

export async function getPropertiesByHost(_hostId: string): Promise<Property[]> {
  if (USE_DEMO || !isSupabaseReady()) return demoPropertyApi.getPropertiesByHost();
  const { data, error } = await supabase.from('properties').select(`*, host:profiles(*)`).eq('host_id', _hostId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Property[];
}

export async function createProperty(property: Partial<Property>): Promise<Property> {
  // @ts-expect-error - Supabase typing
  const { data, error } = await supabase.from('properties').insert(property).select().single();
  if (error) throw error;
  return data as unknown as Property;
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
  // @ts-expect-error - Supabase typing
  const { data, error } = await supabase.from('properties').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as unknown as Property;
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw error;
}

export async function toggleWishlist(_userId: string, _propertyId: string): Promise<boolean> {
  return true;
}

export async function getWishlist(_userId: string): Promise<string[]> {
  return [];
}

export async function getPropertyReviews(_propertyId: string) {
  const { demoReviewApi } = await import('./demoApi');
  return demoReviewApi.getPropertyReviews();
}

export async function createReview(review: Record<string, unknown>) {
  // @ts-expect-error - Supabase typing
  const { data, error } = await supabase.from('reviews').insert(review).select().single();
  if (error) throw error;
  return data;
}
