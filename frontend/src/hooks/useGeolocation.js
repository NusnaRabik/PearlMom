// frontend/src/hooks/useGeolocation.js
import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for geolocation services
 */
export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [watching, setWatching] = useState(false);
  const [watchId, setWatchId] = useState(null);

  // Get current position
  const getCurrentPosition = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        };
        setLocation(locationData);
        setLoading(false);
      },
      (err) => {
        const errorMessages = {
          1: 'Permission denied - Please allow location access',
          2: 'Position unavailable - Please try again',
          3: 'Request timed out - Please try again'
        };
        setError(errorMessages[err.code] || 'An unknown error occurred');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  // Start watching position
  const startWatching = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        };
        setLocation(locationData);
        setLoading(false);
        setWatching(true);
      },
      (err) => {
        setError('Failed to watch position');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    setWatchId(id);
    return id;
  }, []);

  // Stop watching position
  const stopWatching = useCallback(() => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setWatching(false);
    }
  }, [watchId]);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return {
      kilometers: distance.toFixed(2),
      meters: (distance * 1000).toFixed(0),
      miles: (distance * 0.621371).toFixed(2)
    };
  }, []);

  // Get address from coordinates (reverse geocoding)
  const getAddressFromCoords = useCallback(async (latitude, longitude) => {
    try {
      // Using OpenStreetMap Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      return {
        displayName: data.display_name,
        address: data.address,
        city: data.address?.city || data.address?.town || data.address?.village,
        country: data.address?.country,
        postcode: data.address?.postcode
      };
    } catch (err) {
      console.error('Reverse geocoding failed:', err);
      return null;
    }
  }, []);

  // Get coordinates from address (forward geocoding)
  const getCoordsFromAddress = useCallback(async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          displayName: data[0].display_name
        };
      }
      return null;
    } catch (err) {
      console.error('Forward geocoding failed:', err);
      return null;
    }
  }, []);

  // Get nearby clinics (mock function)
  const getNearbyClinics = useCallback(async (latitude, longitude, radius = 10) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock clinic data
    return [
      { id: 1, name: 'Lanka Maternity Hospital', distance: 2.4, address: 'Colombo 07', phone: '+94 11 234 5678', services: ['ANC', 'Vaccination', 'Lab'] },
      { id: 2, name: 'Serene Care Clinic', distance: 3.8, address: 'Dehiwala', phone: '+94 11 234 5679', services: ['ANC', 'Vaccination'] },
      { id: 3, name: 'City Wellness Hub', distance: 5.1, address: 'Rajagiriya', phone: '+94 11 234 5680', services: ['ANC', 'Lab', 'Ultrasound'] },
      { id: 4, name: 'Pearl Women\'s Center', distance: 6.2, address: 'Nugegoda', phone: '+94 11 234 5681', services: ['ANC', 'Vaccination', 'Lab', 'Ultrasound'] },
      { id: 5, name: 'Central Maternity Hospital', distance: 8.0, address: 'Colombo 08', phone: '+94 11 269 1111', services: ['ANC', 'Emergency', 'Lab', 'Ultrasound', 'C-Section'] }
    ].filter(clinic => clinic.distance <= radius);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    location,
    loading,
    error,
    watching,
    getCurrentPosition,
    startWatching,
    stopWatching,
    calculateDistance,
    getAddressFromCoords,
    getCoordsFromAddress,
    getNearbyClinics
  };
};

export default useGeolocation;