import { supabase } from './supabaseClient';
import type { Booking } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asAny(value: unknown): any {
  return value as any;
}

export async function createBooking(booking: Partial<Booking>): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert(asAny(booking))
    .select(`
      *,
      property:properties(*),
      guest:profiles(*)
    `)
    .single();

  if (error) throw error;
  return data as unknown as Booking;
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      property:properties(*),
      guest:profiles(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as unknown as Booking | null;
}

export async function getGuestBookings(guestId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      property:properties(*),
      guest:profiles(*)
    `)
    .eq('guest_id', guestId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as unknown as Booking[];
}

export async function getHostBookings(hostId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      property:properties(*),
      guest:profiles(*)
    `)
    .eq('host_id', hostId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as unknown as Booking[];
}

export async function updateBookingStatus(
  id: string,
  status: Booking['status']
): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    // @ts-expect-error Supabase typing
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as Booking;
}

export async function cancelBooking(id: string): Promise<Booking> {
  return updateBookingStatus(id, 'cancelled');
}

export async function confirmBooking(id: string): Promise<Booking> {
  return updateBookingStatus(id, 'confirmed');
}

export async function getPropertyAvailability(propertyId: string, startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('property_id', propertyId)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) throw error;
  return data || [];
}

export async function setAvailability(
  propertyId: string,
  dates: { date: string; is_available: boolean; price_override?: number }[]
) {
  const { error } = await supabase
    .from('availability')
    .upsert(
      asAny(dates.map(d => ({ property_id: propertyId, ...d }))),
      { onConflict: 'property_id,date' }
    );

  if (error) throw error;
}

export async function checkAvailability(propertyId: string, checkIn: string, checkOut: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('availability')
    .select('is_available')
    .eq('property_id', propertyId)
    .gte('date', checkIn)
    .lt('date', checkOut)
    .eq('is_available', false)
    .limit(1);

  if (error) throw error;
  return !data || data.length === 0;
}
