import { useState, useEffect, useCallback } from 'react';
import { getGuestBookings, getHostBookings, getBookingById, createBooking, cancelBooking } from '@/services/bookingApi';
import type { Booking } from '@/types';

export function useGuestBookings(guestId: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!guestId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getGuestBookings(guestId);
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching bookings'));
    } finally {
      setLoading(false);
    }
  }, [guestId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
}

export function useHostBookings(hostId: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!hostId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getHostBookings(hostId);
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching host bookings'));
    } finally {
      setLoading(false);
    }
  }, [hostId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
}

export function useBooking(id: string) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBooking = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getBookingById(id);
      setBooking(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching booking'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  return { booking, loading, error, refetch: fetchBooking };
}

export function useCreateBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async (bookingData: Partial<Booking>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createBooking(bookingData);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error creating booking'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useCancelBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cancel = useCallback(async (bookingId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await cancelBooking(bookingId);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error cancelling booking'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { cancel, loading, error };
}
