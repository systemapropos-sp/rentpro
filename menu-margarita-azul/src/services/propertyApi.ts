import { supabase } from './supabaseClient';
import type { Property, SearchFilters } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asAny(value: unknown): any {
  return value as any;
}

export async function getProperties(filters?: SearchFilters): Promise<Property[]> {
  let query = supabase
    .from('properties')
    .select(`
      *,
      host:profiles(*)
    `);

  if (filters) {
    if (filters.location) {
      query = query.or(`city.ilike.%${filters.location}%,state.ilike.%${filters.location}%,country.ilike.%${filters.location}%`);
    }
    if (filters.minPrice) {
      query = query.gte('price_per_night', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price_per_night', filters.maxPrice);
    }
    if (filters.propertyType?.length) {
      query = query.in('property_type', filters.propertyType);
    }
    if (filters.bedrooms) {
      query = query.gte('bedrooms', filters.bedrooms);
    }
    if (filters.beds) {
      query = query.gte('beds', filters.beds);
    }
    if (filters.bathrooms) {
      query = query.gte('bathrooms', filters.bathrooms);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.superhost) {
      query = query.eq('is_superhost', true);
    }
    if (filters.instantBook) {
      query = query.eq('instant_book', true);
    }
    if (filters.amenities?.length) {
      query = query.contains('amenities', filters.amenities);
    }
    if (filters.petsAllowed) {
      query = query.contains('amenities', ['pets_allowed']);
    }
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as unknown as Property[];
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      host:profiles(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as unknown as Property | null;
}

export async function getFeaturedProperties(limit: number = 8): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      host:profiles(*)
    `)
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as unknown as Property[];
}

export async function getPropertiesByHost(hostId: string): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      host:profiles(*)
    `)
    .eq('host_id', hostId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as unknown as Property[];
}

export async function createProperty(property: Partial<Property>): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .insert(asAny(property))
    .select()
    .single();

  if (error) throw error;
  return data as unknown as Property;
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    // @ts-expect-error Supabase typing
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as Property;
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function toggleWishlist(userId: string, propertyId: string): Promise<boolean> {
  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .eq('property_id', propertyId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('id', (existing as unknown as { id: string }).id);

    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from('wishlists')
      .insert(asAny({ user_id: userId, property_id: propertyId }));

    if (error) throw error;
    return true;
  }
}

export async function getWishlist(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('wishlists')
    .select('property_id')
    .eq('user_id', userId);

  if (error) throw error;
  return ((data || []) as unknown as Array<{ property_id: string }>).map(item => item.property_id);
}

export async function getPropertyReviews(propertyId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:profiles(*)
    `)
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createReview(review: {
  property_id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  cleanliness: number;
  accuracy: number;
  check_in: number;
  communication: number;
  location: number;
  value: number;
  comment: string;
}) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(asAny(review))
    .select()
    .single();

  if (error) throw error;
  return data;
}
