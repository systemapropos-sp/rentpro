import { supabase } from './supabaseClient';
import { demoBookingApi } from './demoApi';
import type { Booking } from '@/types';

const USE_DEMO = true;

function isSupabaseReady() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && url.length > 0 && !url.includes('your-project');
}

export async function createBooking(booking: Partial<Booking>): Promise<Booking> {
  if (USE_DEMO || !isSupabaseReady()) return demoBookingApi.createBooking(booking) as Promise<Booking>;
  // @ts-expect-error - Supabase typing
  const { data, error } = await supabase.from('bookings').insert(booking).select(`*, property:properties(*), guest:profiles(*)`).single();
  if (error) throw error;
  return data as unknown as Booking;
}

export async function getBookingById(id: string): Promise<Booking | null> {
  if (USE_DEMO || !isSupabaseReady()) return demoBookingApi.getBookingById(id);
  const { data, error } = await supabase.from('bookings').select(`*, property:properties(*), guest:profiles(*)`).eq('id', id).single();
  if (error) throw error;
  return data as unknown as Booking | null;
}

export async function getGuestBookings(_guestId: string): Promise<Booking[]> {
  if (USE_DEMO || !isSupabaseReady()) return demoBookingApi.getGuestBookings();
  const { data, error } = await supabase.from('bookings').select(`*, property:properties(*), guest:profiles(*)`).eq('guest_id', _guestId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Booking[];
}

export async function getHostBookings(_hostId: string): Promise<Booking[]> {
  if (USE_DEMO || !isSupabaseReady()) return demoBookingApi.getHostBookings();
  const { data, error } = await supabase.from('bookings').select(`*, property:properties(*), guest:profiles(*)`).eq('host_id', _hostId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Booking[];
}

export async function updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
  // @ts-expect-error - Supabase typing
  const { data, error } = await supabase.from('bookings').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data as unknown as Booking;
}

export async function cancelBooking(id: string): Promise<Booking> {
  if (USE_DEMO || !isSupabaseReady()) return demoBookingApi.cancelBooking(id) as Promise<Booking>;
  return updateBookingStatus(id, 'cancelled');
}

export async function confirmBooking(id: string): Promise<Booking> {
  return updateBookingStatus(id, 'confirmed');
}

export async function getPropertyAvailability(_propertyId: string, _startDate: string, _endDate: string) {
  return [];
}

export async function setAvailability(_propertyId: string, _dates: Array<Record<string, unknown>>) {
  return;
}

export async function checkAvailability(_propertyId: string, _checkIn: string, _checkOut: string): Promise<boolean> {
  return true;
}
