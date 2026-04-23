import {
  DEMO_USER,
  DEMO_PROPERTIES,
  DEMO_BOOKINGS,
  DEMO_CONVERSATIONS,
  DEMO_MESSAGES,
  DEMO_REVIEWS,
} from './demoData';
import type { Property, SearchFilters } from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const demoPropertyApi = {
  async getProperties(filters?: SearchFilters): Promise<Property[]> {
    await delay(300);
    let results = [...DEMO_PROPERTIES];

    if (filters?.location) {
      const loc = filters.location.toLowerCase();
      results = results.filter(
        (p) =>
          p.city.toLowerCase().includes(loc) ||
          p.state.toLowerCase().includes(loc) ||
          p.title.toLowerCase().includes(loc)
      );
    }
    if (filters?.minPrice) {
      results = results.filter((p) => p.price_per_night >= filters.minPrice!);
    }
    if (filters?.maxPrice) {
      results = results.filter((p) => p.price_per_night <= filters.maxPrice!);
    }
    if (filters?.category) {
      results = results.filter((p) => p.category === filters.category);
    }
    if (filters?.superhost) {
      results = results.filter((p) => p.is_superhost);
    }
    if (filters?.instantBook) {
      results = results.filter((p) => p.instant_book);
    }
    if (filters?.bedrooms) {
      results = results.filter((p) => p.bedrooms >= filters.bedrooms!);
    }
    if (filters?.amenities?.length) {
      results = results.filter((p) =>
        filters.amenities!.every((a) => p.amenities.includes(a))
      );
    }
    if (filters?.propertyType?.length) {
      results = results.filter((p) => filters.propertyType!.includes(p.property_type));
    }

    return results;
  },

  async getPropertyById(id: string): Promise<Property | null> {
    await delay(200);
    return DEMO_PROPERTIES.find((p) => p.id === id) || null;
  },

  async getFeaturedProperties(): Promise<Property[]> {
    await delay(200);
    return DEMO_PROPERTIES;
  },

  async getPropertiesByHost(): Promise<Property[]> {
    await delay(200);
    return DEMO_PROPERTIES;
  },
};

export const demoBookingApi = {
  async getGuestBookings(): Promise<typeof DEMO_BOOKINGS> {
    await delay(200);
    return DEMO_BOOKINGS;
  },
  async getHostBookings(): Promise<typeof DEMO_BOOKINGS> {
    await delay(200);
    return DEMO_BOOKINGS;
  },
  async getBookingById(id: string) {
    await delay(100);
    return DEMO_BOOKINGS.find((b) => b.id === id) || null;
  },
  async createBooking(bookingData: Record<string, unknown>) {
    await delay(500);
    return { ...bookingData, id: 'book-new-' + Date.now() };
  },
  async cancelBooking(id: string) {
    await delay(200);
    return DEMO_BOOKINGS.find((b) => b.id === id);
  },
};

export const demoMessageApi = {
  async getConversations() {
    await delay(200);
    return DEMO_CONVERSATIONS.map((c) => ({
      ...c,
      last_message: DEMO_MESSAGES[DEMO_MESSAGES.length - 1],
    }));
  },
  async getMessages() {
    await delay(200);
    return DEMO_MESSAGES;
  },
  async sendMessage(_convId: string, _senderId: string, content: string) {
    await delay(100);
    return {
      id: 'msg-' + Date.now(),
      conversation_id: 'conv-1',
      sender_id: DEMO_USER.id,
      content,
      created_at: new Date().toISOString(),
      sender: DEMO_USER,
    };
  },
};

export const demoReviewApi = {
  async getPropertyReviews() {
    await delay(200);
    return DEMO_REVIEWS;
  },
};
