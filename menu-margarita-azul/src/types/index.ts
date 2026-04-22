export type UserRole = 'guest' | 'host' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  phone?: string;
  created_at: string;
  is_superhost?: boolean;
}

export interface Property {
  id: string;
  host_id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  price_per_night: number;
  currency: string;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  property_type: PropertyType;
  category: PropertyCategory;
  amenities: Amenity[];
  images: string[];
  rating: number;
  review_count: number;
  is_superhost: boolean;
  instant_book: boolean;
  cancellation_policy: CancellationPolicy;
  house_rules: HouseRules;
  created_at: string;
  updated_at: string;
  host?: User;
}

export type PropertyType = 'house' | 'apartment' | 'room' | 'hotel' | 'cabin' | 'villa' | 'tiny_home';

export type PropertyCategory =
  | 'beach'
  | 'mountain'
  | 'countryside'
  | 'city'
  | 'camping'
  | 'cabin'
  | 'luxury'
  | 'tiny_home'
  | 'lakefront';

export type Amenity =
  | 'wifi'
  | 'kitchen'
  | 'pool'
  | 'ac'
  | 'parking'
  | 'washer'
  | 'dryer'
  | 'tv'
  | 'gym'
  | 'hot_tub'
  | 'fireplace'
  | 'grill'
  | 'workspace'
  | 'pets_allowed'
  | 'smoking_allowed'
  | 'events_allowed';

export type CancellationPolicy = 'flexible' | 'moderate' | 'strict';

export interface HouseRules {
  pets_allowed: boolean;
  smoking_allowed: boolean;
  events_allowed: boolean;
  check_in_time: string;
  check_out_time: string;
  min_age: number;
}

export interface Booking {
  id: string;
  property_id: string;
  guest_id: string;
  host_id: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_nights: number;
  nightly_price: number;
  cleaning_fee: number;
  service_fee: number;
  total_price: number;
  currency: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  stripe_payment_intent_id?: string;
  created_at: string;
  updated_at: string;
  property?: Property;
  guest?: User;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface Review {
  id: string;
  property_id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  cleanliness: number;
  accuracy: number;
  check_in: number;
  communication: number;
  location: number;
  value: number;
  comment: string;
  created_at: string;
  reviewer?: User;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: User;
}

export interface Conversation {
  id: string;
  property_id: string;
  guest_id: string;
  host_id: string;
  created_at: string;
  updated_at: string;
  last_message?: Message;
  property?: Property;
  guest?: User;
  host?: User;
  unread_count?: number;
}

export interface SearchFilters {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType[];
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  amenities?: Amenity[];
  category?: PropertyCategory;
  superhost?: boolean;
  instantBook?: boolean;
  freeCancellation?: boolean;
  petsAllowed?: boolean;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
  property?: Property;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, unknown>;
  created_at: string;
}

export type NotificationType =
  | 'booking_request'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'new_message'
  | 'review_received'
  | 'payment_received'
  | 'system';

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  order: number;
  created_at: string;
}

export interface Availability {
  id: string;
  property_id: string;
  date: string;
  is_available: boolean;
  price_override?: number;
  created_at: string;
}
