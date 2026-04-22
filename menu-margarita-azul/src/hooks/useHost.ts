import { useState, useCallback } from 'react';
import { createProperty, updateProperty, deleteProperty } from '@/services/propertyApi';
import { uploadImage } from '@/services/supabaseClient';
import type { Property } from '@/types';

export function useHost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createNewProperty = useCallback(async (
    propertyData: Partial<Property>,
    images: File[]
  ): Promise<Property> => {
    setLoading(true);
    setError(null);
    try {
      const imageUrls: string[] = [];
      for (const image of images) {
        const url = await uploadImage(image, 'properties');
        if (url) imageUrls.push(url);
      }

      const data = await createProperty({
        ...propertyData,
        images: imageUrls,
      });
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error creating property'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExistingProperty = useCallback(async (
    id: string,
    updates: Partial<Property>,
    newImages?: File[]
  ): Promise<Property> => {
    setLoading(true);
    setError(null);
    try {
      let imageUrls = updates.images || [];
      
      if (newImages && newImages.length > 0) {
        for (const image of newImages) {
          const url = await uploadImage(image, 'properties');
          if (url) imageUrls.push(url);
        }
      }

      const data = await updateProperty(id, {
        ...updates,
        images: imageUrls,
      });
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error updating property'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeProperty = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await deleteProperty(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error deleting property'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createNewProperty,
    updateExistingProperty,
    removeProperty,
    loading,
    error,
  };
}
