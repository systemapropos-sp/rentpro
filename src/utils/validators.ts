import type { SearchFilters } from '@/types';

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Mínimo 8 caracteres');
  if (!/[A-Z]/.test(password)) errors.push('Al menos una mayúscula');
  if (!/[a-z]/.test(password)) errors.push('Al menos una minúscula');
  if (!/[0-9]/.test(password)) errors.push('Al menos un número');
  return { valid: errors.length === 0, errors };
}

export function validateRequired(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !isNaN(value);
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined;
}

export function validateDateRange(checkIn: string, checkOut: string): { valid: boolean; error?: string } {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (!checkIn || !checkOut) {
    return { valid: false, error: 'Selecciona fechas de entrada y salida' };
  }
  if (start < now) {
    return { valid: false, error: 'La fecha de entrada no puede ser en el pasado' };
  }
  if (end <= start) {
    return { valid: false, error: 'La fecha de salida debe ser después de la entrada' };
  }
  return { valid: true };
}

export function validateGuests(guests: number, maxGuests: number): { valid: boolean; error?: string } {
  if (!guests || guests < 1) {
    return { valid: false, error: 'Selecciona al menos 1 huésped' };
  }
  if (guests > maxGuests) {
    return { valid: false, error: `Máximo ${maxGuests} huéspedes permitidos` };
  }
  return { valid: true };
}

export function validateSearchFilters(filters: SearchFilters): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!filters.location?.trim()) {
    errors.push('Ingresa una ubicación');
  }
  if (filters.checkIn && filters.checkOut) {
    const dateValidation = validateDateRange(filters.checkIn, filters.checkOut);
    if (!dateValidation.valid) {
      errors.push(dateValidation.error || 'Rango de fechas inválido');
    }
  }
  if (filters.minPrice && filters.maxPrice && filters.minPrice > filters.maxPrice) {
    errors.push('El precio mínimo no puede ser mayor al máximo');
  }
  
  return { valid: errors.length === 0, errors };
}

export function validatePropertyForm(data: {
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.title?.trim()) errors.title = 'El título es requerido';
  if (!data.description?.trim()) errors.description = 'La descripción es requerida';
  if (!data.location?.trim()) errors.location = 'La ubicación es requerida';
  if (!data.price_per_night || data.price_per_night <= 0) errors.price = 'El precio debe ser mayor a 0';
  if (!data.max_guests || data.max_guests < 1) errors.max_guests = 'Mínimo 1 huésped';
  if (!data.bedrooms || data.bedrooms < 1) errors.bedrooms = 'Mínimo 1 habitación';
  if (!data.beds || data.beds < 1) errors.beds = 'Mínimo 1 cama';
  if (!data.bathrooms || data.bathrooms < 0.5) errors.bathrooms = 'Mínimo 0.5 baños';

  return { valid: Object.keys(errors).length === 0, errors };
}
