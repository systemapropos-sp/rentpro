import React, { createContext, useContext, useState, useCallback } from 'react';
import type { SearchFilters, PropertyCategory } from '@/types';

interface AppContextType {
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
  updateSearchFilters: (updates: Partial<SearchFilters>) => void;
  selectedCategory: PropertyCategory | null;
  setSelectedCategory: (category: PropertyCategory | null) => void;
  isMapView: boolean;
  setIsMapView: (show: boolean) => void;
  wishlist: string[];
  setWishlist: (ids: string[]) => void;
  toggleWishlistItem: (propertyId: string) => void;
  isPropertyInWishlist: (propertyId: string) => boolean;
}

const defaultSearchFilters: SearchFilters = {
  location: '',
  checkIn: '',
  checkOut: '',
  guests: 1,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(defaultSearchFilters);
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory | null>(null);
  const [isMapView, setIsMapView] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const updateSearchFilters = useCallback((updates: Partial<SearchFilters>) => {
    setSearchFilters(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleWishlistItem = useCallback((propertyId: string) => {
    setWishlist(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  }, []);

  const isPropertyInWishlist = useCallback(
    (propertyId: string) => wishlist.includes(propertyId),
    [wishlist]
  );

  const value: AppContextType = {
    searchFilters,
    setSearchFilters,
    updateSearchFilters,
    selectedCategory,
    setSelectedCategory,
    isMapView,
    setIsMapView,
    wishlist,
    setWishlist,
    toggleWishlistItem,
    isPropertyInWishlist,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
