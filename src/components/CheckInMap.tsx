import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Loader2 } from 'lucide-react';

mapboxgl.accessToken = 'pk.eyJ1IjoiZG9uZ3RpbyIsImEiOiJjbWlqcXkxN3gxMTVjM2pzZnphNmxtZWp6In0.tQ44RSp51q9aX3RoP8ujIg';

interface CheckInMapProps {
  onLocationUpdate: (lat: number, lng: number, address: string) => void;
}

const CheckInMap: React.FC<CheckInMapProps> = ({ onLocationUpdate }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMap = async (latitude: number, longitude: number) => {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [longitude, latitude],
        zoom: 15,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: false }),
        'top-right'
      );

      // Add marker at current location
      marker.current = new mapboxgl.Marker({ color: '#22c55e' })
        .setLngLat([longitude, latitude])
        .addTo(map.current);

      // Reverse geocode to get address
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}&language=fr`
        );
        const data = await response.json();
        const address = data.features?.[0]?.place_name || 'Adresse inconnue';
        onLocationUpdate(latitude, longitude, address);
      } catch {
        onLocationUpdate(latitude, longitude, 'Adresse non disponible');
      }

      map.current.on('load', () => {
        setLoading(false);
      });
    };

    // Get user's current location with mobile-friendly options
    if (navigator.geolocation) {
      const geoOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          initializeMap(latitude, longitude);
        },
        (err) => {
          console.error('Geolocation error:', err.code, err.message);
          let errorMessage = 'Impossible d\'accéder à votre position.';
          
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = 'Accès à la localisation refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.';
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = 'Position indisponible. Vérifiez que le GPS est activé.';
              break;
            case err.TIMEOUT:
              errorMessage = 'Délai d\'attente dépassé. Réessayez dans un endroit avec meilleur signal.';
              break;
          }
          
          setError(errorMessage);
          setLoading(false);
        },
        geoOptions
      );
    } else {
      setError('La géolocalisation n\'est pas supportée par votre navigateur.');
      setLoading(false);
    }

    return () => {
      map.current?.remove();
    };
  }, [onLocationUpdate]);

  if (error) {
    return (
      <div className="w-full h-32 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center p-4">
        <p className="text-sm text-destructive text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-border">
      {loading && (
        <div className="absolute inset-0 bg-card z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Localisation en cours...</span>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="absolute inset-0" />
      {currentLocation && !loading && (
        <div className="absolute bottom-2 left-2 right-2 bg-card/90 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2 z-10">
          <MapPin className="h-4 w-4 text-green-500 shrink-0" />
          <span className="text-xs text-muted-foreground truncate">
            {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
          </span>
        </div>
      )}
    </div>
  );
};

export default CheckInMap;
