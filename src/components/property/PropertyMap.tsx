import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatPrice } from '@/utils/formatters';
import type { Property } from '@/types';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom price marker
const createPriceMarker = (price: number, currency: string) => {
  return L.divIcon({
    className: 'custom-price-marker',
    html: `<div style="
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      white-space: nowrap;
    ">${formatPrice(price, currency)}</div>`,
    iconSize: [80, 30],
    iconAnchor: [40, 30],
  });
};

interface PropertyMapProps {
  properties: Property[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (property: Property) => void;
  height?: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  center = { lat: 25.7617, lng: -80.1918 },
  zoom = 10,
  height = '100%',
}) => {
  return (
    <div style={{ height, width: '100%' }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            icon={createPriceMarker(property.price_per_night, property.currency)}
          >
            <Popup>
              <Link to={`/property/${property.id}`} className="block min-w-[200px]">
                <img
                  src={property.images?.[0] || '/images/placeholder.jpg'}
                  alt={property.title}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <h3 className="font-semibold text-sm">{property.title}</h3>
                <p className="text-sm text-gray-600">
                  {property.bedrooms} hab · {property.max_guests} huéspedes
                </p>
                <p className="font-semibold text-sm mt-1">
                  {formatPrice(property.price_per_night, property.currency)} / noche
                </p>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
