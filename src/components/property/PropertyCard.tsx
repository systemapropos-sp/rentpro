import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/context/AppContext';
import { formatPricePerNight, formatShortAddress } from '@/utils/formatters';
import type { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  showFavorite?: boolean;
  className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  showFavorite = true,
  className = '',
}) => {
  const { isAuthenticated } = useAuth();
  const { isPropertyInWishlist, toggleWishlistItem } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isFavorited = isPropertyInWishlist(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      toggleWishlistItem(property.id);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? (property.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === (property.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  return (
    <Link
      to={`/property/${property.id}`}
      className={`group block ${className}`}
    >
      {/* Image Container */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-200 mb-3">
        <img
          src={property.images?.[currentImageIndex] || '/images/placeholder.jpg'}
          alt={property.title}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Favorite Button */}
        {showFavorite && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full hover:scale-110 transition-transform"
          >
            <Heart
              size={20}
              className={isFavorited ? 'fill-rose-500 text-rose-500' : 'text-white drop-shadow-lg'}
            />
          </button>
        )}

        {/* Image Navigation Dots */}
        {property.images && property.images.length > 1 && (
          <>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white w-3' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
            {/* Prev/Next Buttons */}
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <svg width="10" height="16" viewBox="0 0 10 16" fill="none" className="mr-0.5">
                <path d="M8 2L2 8L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <svg width="10" height="16" viewBox="0 0 10 16" fill="none" className="ml-0.5">
                <path d="M2 2L8 8L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </>
        )}

        {/* Superhost Badge */}
        {property.is_superhost && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 rounded-md text-xs font-semibold">
            Superanfitrión
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={14} className="fill-current" />
            <span className="text-sm">{property.rating?.toFixed(2) || 'Nuevo'}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          {formatShortAddress(property.city, property.state, property.country)}
        </p>
        <p className="text-sm text-gray-500">
          {property.bedrooms} hab · {property.max_guests} huéspedes
        </p>
        <p className="text-sm font-semibold">
          {formatPricePerNight(property.price_per_night, property.currency)}
        </p>
      </div>
    </Link>
  );
};
