import { useState, useCallback, useMemo } from 'react';
import type { SearchFilters, PropertyCategory } from '@/types';

export function useSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);

  const updateFilter = useCallback((key: keyof SearchFilters, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const setCategory = useCallback((category: PropertyCategory | null) => {
    setFilters(prev => ({ ...prev, category: category || undefined }));
  }, []);

  const applyFilters = useCallback(() => {
    setActiveFilters({ ...filters });
    setIsSearching(true);
  }, [filters]);

  const clearFilters = useCallback(() => {
    setFilters({
      location: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
    });
    setActiveFilters({});
    setIsSearching(false);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(activeFilters).length > 0 && 
      Object.values(activeFilters).some(v => v !== undefined && v !== '' && v !== null);
  }, [activeFilters]);

  return {
    filters,
    activeFilters,
    isSearching,
    updateFilter,
    setCategory,
    applyFilters,
    clearFilters,
    hasActiveFilters,
    setFilters,
  };
}
