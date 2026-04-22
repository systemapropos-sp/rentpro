import { format, differenceInDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPricePerNight(price: number, currency: string = 'USD'): string {
  return `${formatPrice(price, currency)} / noche`;
}

export function formatDate(date: string | Date, pattern: string = 'dd MMM yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern, { locale: es });
}

export function formatDateRange(checkIn: string, checkOut: string): string {
  const start = parseISO(checkIn);
  const end = parseISO(checkOut);
  return `${format(start, 'dd MMM', { locale: es })} - ${format(end, 'dd MMM yyyy', { locale: es })}`;
}

export function calculateNights(checkIn: string, checkOut: string): number {
  return differenceInDays(parseISO(checkOut), parseISO(checkIn));
}

export function formatRating(rating: number): string {
  return rating.toFixed(2);
}

export function formatReviewCount(count: number): string {
  if (count === 1) return '1 reseña';
  return `${count} reseñas`;
}

export function formatShortAddress(city: string, state: string, _country?: string): string {
  void _country;
  return `${city}, ${state}`;
}

export function formatFullAddress(city: string, state: string, _country?: string): string {
  void _country;
  return `${city}, ${state}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50);
}
