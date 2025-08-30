import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  latitude: number;
  longitude: number;
  deviceName?: string;
  address?: string;
}

const Map = ({ latitude, longitude, deviceName, address }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // You'll need to add your Mapbox token here
    // For now, using a placeholder - user needs to add their token
    const accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
    
    if (accessToken === 'YOUR_MAPBOX_ACCESS_TOKEN') {
      // Show message if no token is provided
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `
          <div class="flex items-center justify-center h-full bg-muted rounded-lg">
            <div class="text-center p-6">
              <p class="text-lg font-medium text-foreground mb-2">Mapbox Token Required</p>
              <p class="text-muted-foreground text-sm">Please add your Mapbox access token to display the map.</p>
              <p class="text-muted-foreground text-sm mt-2">Get your token from <a href="https://mapbox.com" target="_blank" class="text-primary underline">mapbox.com</a></p>
            </div>
          </div>
        `;
      }
      return;
    }

    mapboxgl.accessToken = accessToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitude, latitude],
      zoom: 15,
    });

    // Add marker
    marker.current = new mapboxgl.Marker({
      color: '#3b82f6',
    })
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    // Add popup with device info
    if (deviceName || address) {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            ${deviceName ? `<h3 class="font-semibold">${deviceName}</h3>` : ''}
            ${address ? `<p class="text-sm text-gray-600">${address}</p>` : ''}
          </div>
        `);
      
      marker.current.setPopup(popup);
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, deviceName, address]);

  return (
    <div ref={mapContainer} className="w-full h-full rounded-lg" />
  );
};

export default Map;