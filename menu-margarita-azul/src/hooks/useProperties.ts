import { useState, useEffect, useCallback } from 'react';
import { getProperties, getPropertyById, getFeaturedProperties, getPropertiesByHost } from '@/services/propertyApi';
import type { Property, SearchFilters } from '@/types';

export function useProperties(filters?: SearchFilters) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProperties(filters);
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching properties'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, error, refetch: fetchProperties };
}

export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProperty = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPropertyById(id);
      setProperty(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching property'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  return { property, loading, error, refetch: fetchProperty };
}

export function useFeaturedProperties(limit?: number) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeaturedProperties(limit);
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching featured properties'));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, error, refetch: fetchProperties };
}

export function useHostProperties(hostId: string) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProperties = useCallback(async () => {
    if (!hostId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPropertiesByHost(hostId);
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching host properties'));
    } finally {
      setLoading(false);
    }
  }, [hostId]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, error, refetch: fetchProperties };
}
