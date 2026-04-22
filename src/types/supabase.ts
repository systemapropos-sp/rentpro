export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: 'guest' | 'host' | 'admin';
          phone: string | null;
          is_superhost: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          role?: 'guest' | 'host' | 'admin';
          phone?: string | null;
          is_superhost?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: 'guest' | 'host' | 'admin';
          phone?: string | null;
          is_superhost?: boolean;
          created_at?: string;
        };
      };
      properties: {
        Row: {
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
          property_type: string;
          category: string;
          amenities: string[];
          images: string[];
          rating: number;
          review_count: number;
          is_superhost: boolean;
          instant_book: boolean;
          cancellation_policy: string;
          house_rules: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      bookings: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      reviews: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      conversations: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      messages: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      wishlists: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      availability: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
  };
}
