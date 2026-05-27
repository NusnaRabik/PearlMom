import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Search, MapPin, Navigation, Phone, Heart, Plus, Minus, Target, Clock, Star, X, Loader, AlertCircle, Compass, Info, Clock as ClockIcon, Route, Car } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGeolocation } from '../../hooks/useGeolocation';
import api from '../../services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom clinic marker icons
const createClinicMarker = (type, isFavorite = false) => {
  const color = type === 'antenatal' ? '#ec4899' : '#3b82f6';
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2); ${isFavorite ? 'box-shadow: 0 0 0 3px #fbbf24;' : ''}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
          </div>`,
    iconSize: [32, 32],
    popupAnchor: [0, -16]
  });
};

const ClinicLocatorPage = () => {
  const { user } = useAuth();
  const { 
    location, 
    loading: geoLoading, 
    error: geoError,
    getCurrentPosition,
    getCoordsFromAddress,
    calculateDistance
  } = useGeolocation();
  
  const [clinics, setClinics] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [requestingLocation, setRequestingLocation] = useState(false);
  const [calculatingRoute, setCalculatingRoute] = useState(false);
  const [directionLoadingMessage, setDirectionLoadingMessage] = useState('');
  
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef({});
  const userMarkerRef = useRef(null);
  const listContainerRef = useRef(null);
  const currentRouteLayerRef = useRef(null);
  const routeMarkersRef = useRef([]);

  // Fetch clinics from database
  const fetchClinics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clinics');
      if (response.data.success) {
        const clinicsData = response.data.data?.clinics || [];
        setClinics(clinicsData);
        setFilteredClinics(clinicsData);
      }
    } catch (error) {
      console.error('Error fetching clinics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    setIsSearching(true);
    if (tempSearchTerm) {
      const filtered = clinics.filter(clinic => 
        clinic.name.toLowerCase().includes(tempSearchTerm.toLowerCase()) ||
        clinic.address?.toLowerCase().includes(tempSearchTerm.toLowerCase()) ||
        clinic.district?.toLowerCase().includes(tempSearchTerm.toLowerCase())
      );
      setFilteredClinics(filtered);
      setSearchTerm(tempSearchTerm);
      
      if (filtered.length > 0 && filtered[0].latitude && filtered[0].longitude) {
        centerOnClinic(filtered[0]);
      }
    } else {
      setFilteredClinics(clinics);
      setSearchTerm('');
    }
    setIsSearching(false);
  };

  const handleClearSearch = () => {
    setTempSearchTerm('');
    setSearchTerm('');
    setFilteredClinics(clinics);
  };

  // Initialize map
  const initializeMap = () => {
    // IMPORTANT: Check if map already exists or container is missing
    if (!mapContainerRef.current || mapRef.current || mapInitialized) {
      console.log('Map already initialized or container missing');
      return;
    }
    
    const defaultCenter = { lat: 6.9271, lng: 79.8612 };
    
    try {
      mapRef.current = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
        doubleClickZoom: true,
        touchZoom: false,
        zoomControl: false
      }).setView(
        location ? [location.latitude, location.longitude] : [defaultCenter.lat, defaultCenter.lng],
        13
      );
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 3
      }).addTo(mapRef.current);
      
      // Enable scroll zoom only when user clicks INTO the map
      const handleMapClick = () => {
        if (mapRef.current) {
          mapRef.current.scrollWheelZoom.enable();
          mapRef.current.touchZoom.enable();
          const hint = document.getElementById('map-hint');
          if (hint) hint.style.opacity = '0';
        }
      };
      
      const handleMapMouseLeave = () => {
        if (mapRef.current) {
          mapRef.current.scrollWheelZoom.disable();
          mapRef.current.touchZoom.disable();
          const hint = document.getElementById('map-hint');
          if (hint) hint.style.opacity = '1';
        }
      };
      
      mapContainerRef.current.addEventListener('click', handleMapClick);
      mapContainerRef.current.addEventListener('mouseleave', handleMapMouseLeave);
      
      // Store event handlers for cleanup
      mapContainerRef.current._mapClickHandler = handleMapClick;
      mapContainerRef.current._mapMouseLeaveHandler = handleMapMouseLeave;
      
      setMapInitialized(true);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  // Cleanup effect
  useEffect(() => {
    fetchClinics();
    
    const timer = setTimeout(() => {
      if (!mapRef.current && !mapInitialized) {
        initializeMap();
      }
    }, 100);
    
    return () => {
      clearTimeout(timer);
      // Clean up map and event listeners
      if (mapContainerRef.current) {
        if (mapContainerRef.current._mapClickHandler) {
          mapContainerRef.current.removeEventListener('click', mapContainerRef.current._mapClickHandler);
        }
        if (mapContainerRef.current._mapMouseLeaveHandler) {
          mapContainerRef.current.removeEventListener('mouseleave', mapContainerRef.current._mapMouseLeaveHandler);
        }
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setMapInitialized(false);
    };
  }, []); // Empty dependency array - only run once on mount

  // Add user location marker
  const addUserMarker = () => {
    if (!mapRef.current || !location) return;
    
    if (userMarkerRef.current) {
      mapRef.current.removeLayer(userMarkerRef.current);
    }
    
    const userIcon = L.divIcon({
      className: 'user-marker',
      html: `<div style="background-color: #ec4899; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 3px #ec4899; animation: pulse 1.5s infinite;"></div>`,
      iconSize: [20, 20],
      popupAnchor: [0, -10]
    });
    
    userMarkerRef.current = L.marker([location.latitude, location.longitude], { icon: userIcon })
      .addTo(mapRef.current)
      .bindPopup('<b>Your Location</b><br>You are here!')
      .openPopup();
    
    if (!document.getElementById('pulse-animation')) {
      const style = document.createElement('style');
      style.id = 'pulse-animation';
      style.textContent = `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(236, 72, 153, 0); }
          100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
        }
      `;
      document.head.appendChild(style);
    }
  };

  // Update clinic markers on map
  const updateClinicMarkers = () => {
    if (!mapRef.current) return;
    
    Object.values(markersRef.current).forEach(marker => {
      if (marker && mapRef.current) {
        mapRef.current.removeLayer(marker);
      }
    });
    markersRef.current = {};
    
    filteredClinics.forEach(clinic => {
      if (clinic.latitude && clinic.longitude) {
        const isFavorite = favorites.includes(clinic.clinic_id);
        const marker = L.marker(
          [parseFloat(clinic.latitude), parseFloat(clinic.longitude)],
          { icon: createClinicMarker(clinic.clinic_type, isFavorite) }
        ).addTo(mapRef.current);
        
        const popupDiv = document.createElement('div');
        popupDiv.className = 'p-3 min-w-[220px]';
        popupDiv.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        popupDiv.innerHTML = `
          <h3 class="font-bold text-gray-900 text-sm mb-1">${clinic.name}</h3>
          <p class="text-xs text-gray-600">${clinic.address || 'Address not available'}</p>
          ${clinic.distance ? `<p class="text-xs text-gray-500 mt-1">📍 ${clinic.distance}</p>` : ''}
          ${clinic.contact_number ? `<p class="text-xs text-gray-600 mt-1">📞 ${clinic.contact_number}</p>` : ''}
          <button data-clinic-id="${clinic.clinic_id}" class="view-details-btn mt-2 bg-pink-600 text-white px-3 py-1 rounded-lg text-xs w-full hover:bg-pink-700 transition-colors">
            View Details
          </button>
        `;
        
        marker.bindPopup(popupDiv);
        
        marker.on('popupopen', () => {
          const btn = document.querySelector(`.view-details-btn[data-clinic-id="${clinic.clinic_id}"]`);
          if (btn) {
            btn.onclick = (e) => {
              e.stopPropagation();
              setSelectedClinic(clinic);
              marker.closePopup();
            };
          }
        });
        
        markersRef.current[clinic.clinic_id] = marker;
      }
    });
  };

  // Update clinic distances
  const updateClinicDistances = () => {
    if (!location) return;
    
    const clinicsWithDistance = clinics.map(clinic => {
      if (clinic.latitude && clinic.longitude) {
        const dist = calculateDistance(
          location.latitude,
          location.longitude,
          parseFloat(clinic.latitude),
          parseFloat(clinic.longitude)
        );
        const distanceKm = parseFloat(dist.kilometers);
        return { 
          ...clinic, 
          distance: distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m away` : `${distanceKm.toFixed(1)} km away`,
          distanceKm: distanceKm 
        };
      }
      return { ...clinic, distance: 'Distance unknown', distanceKm: Infinity };
    });
    
    const sortedClinics = [...clinicsWithDistance].sort((a, b) => (a.distanceKm || Infinity) - (b.distanceKm || Infinity));
    setClinics(sortedClinics);
    setFilteredClinics(
      searchTerm 
        ? sortedClinics.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.address?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : sortedClinics
    );
  };

  // Clear route from map
  const clearRoute = () => {
    if (currentRouteLayerRef.current) {
      try {
        mapRef.current.removeLayer(currentRouteLayerRef.current);
      } catch(e) {}
      currentRouteLayerRef.current = null;
    }
    
    routeMarkersRef.current.forEach(marker => {
      try {
        mapRef.current.removeLayer(marker);
      } catch(e) {}
    });
    routeMarkersRef.current = [];
    
    setRouteInfo(null);
    setShowRoutePanel(false);
  };

  // Calculate and show route
  const calculateAndShowRoute = async (clinic, startLocation = null, locationName = null) => {
    if (!mapRef.current) {
      alert('Map is not ready. Please wait a moment.');
      return;
    }
    
    let startPoint;
    let startName;
    
    if (startLocation) {
      startPoint = L.latLng(startLocation.latitude, startLocation.longitude);
      startName = locationName;
    } else {
      if (!location || !location.latitude || !location.longitude) {
        alert('Unable to get your location. Please try again.');
        return;
      }
      startPoint = L.latLng(location.latitude, location.longitude);
      startName = 'Your Location';
    }
    
    const endPoint = L.latLng(parseFloat(clinic.latitude), parseFloat(clinic.longitude));
    
    setCalculatingRoute(true);
    
    try {
      // Call OSRM API
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson&steps=true`
      );
      
      const data = await response.json();
      
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        // Clear previous route
        clearRoute();
        
        const route = data.routes[0];
        const totalDistance = (route.distance / 1000).toFixed(1);
        const totalTime = Math.round(route.duration / 60);
        
        // Parse instructions
        const instructions = [];
        route.legs.forEach(leg => {
          leg.steps.forEach((step) => {
            if (step.distance > 0) {
              const type = step.maneuver?.type?.replace(/_/g, ' ') || '';
              const modifier = step.maneuver?.modifier || '';
              const streetName = step.name && step.name !== '' ? ` onto ${step.name}` : '';
              const text = `${type}${modifier ? ' ' + modifier : ''}${streetName}`.trim() || 'Continue';

              instructions.push({
                step: instructions.length + 1,
                text: text.charAt(0).toUpperCase() + text.slice(1),
                distance: (step.distance / 1000).toFixed(1),
                time: Math.round(step.duration / 60)
              });
            }
          });
        });
        
        // Draw route on map
        const routeGeometry = route.geometry;
        const routeLayer = L.geoJSON(routeGeometry, {
          style: {
            color: '#ec4899',
            weight: 5,
            opacity: 0.9
          }
        }).addTo(mapRef.current);
        
        currentRouteLayerRef.current = routeLayer;
        
        // Add start and end markers
        const startIcon = L.divIcon({
          html: `<div style="background-color: ${startLocation ? '#f59e0b' : '#10b981'}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; font-size: 12px;">S</div>`,
          iconSize: [24, 24],
          className: 'start-marker'
        });
        
        const endIcon = L.divIcon({
          html: `<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; font-size: 12px;">D</div>`,
          iconSize: [24, 24],
          className: 'end-marker'
        });
        
        const startMarker = L.marker(startPoint, { icon: startIcon })
          .addTo(mapRef.current)
          .bindPopup(`<b>${startName}</b>`);
        
        const endMarker = L.marker(endPoint, { icon: endIcon })
          .addTo(mapRef.current)
          .bindPopup(`<b>${clinic.name}</b><br>${clinic.address || ''}`);
        
        routeMarkersRef.current = [startMarker, endMarker];
        
        // Fit map to show the entire route
        const bounds = L.latLngBounds([startPoint, endPoint]);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        
        // Set route info
        const estimatedArrival = new Date(Date.now() + totalTime * 60000);
        
        setRouteInfo({
          distance: `${totalDistance} km`,
          duration: `${totalTime} minutes`,
          estimatedArrival: estimatedArrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          startPoint: startName,
          destination: clinic.name,
          isManualLocation: !!startLocation,
          instructions: instructions.slice(0, 15)
        });
        setShowRoutePanel(true);
        
      } else {
        alert('Unable to calculate route. Please try again.');
      }
    } catch (error) {
      console.error('Routing error:', error);
      alert('Unable to calculate route. Please check your connection.');
    } finally {
      setCalculatingRoute(false);
    }
  };

  // Get directions with location permission
  const getDirections = async (clinic) => {
    setRequestingLocation(true);

    try {
      // If we already have location, use it directly
      if (location && location.latitude && location.longitude) {
        setRequestingLocation(false);
        await calculateAndShowRoute(clinic);
        return;
      }

      // No location yet — request it using the browser API directly
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        setRequestingLocation(false);
        return;
      }

      const userConfirmed = window.confirm(
        '📍 Location Permission Required\n\n' +
        'To get directions to this clinic, we need access to your current location.\n\n' +
        'This helps us calculate:\n' +
        '• The best route to the clinic\n' +
        '• Estimated travel time\n' +
        '• Distance to destination\n\n' +
        'Click OK to allow location access.'
      );

      if (!userConfirmed) {
        const useManual = window.confirm(
          'You declined location access.\n\n' +
          'Would you like to enter your location manually?'
        );

        if (useManual) {
          const manualLocation = prompt(
            'Enter your current location (city or area):\n\nExample: "Colombo 07" or "Nugegoda"'
          );

          if (manualLocation && manualLocation.trim()) {
            setRequestingLocation(false);
            setCalculatingRoute(true);
            const coords = await getCoordsFromAddress(manualLocation.trim());
            if (coords) {
              await calculateAndShowRoute(clinic, coords, manualLocation.trim());
            } else {
              alert(`Could not find "${manualLocation}". Please try a different location.`);
            }
            setCalculatingRoute(false);
          }
        }
        setRequestingLocation(false);
        return;
      }

      // Get position directly via Promise wrapper — avoids the stale closure problem
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const freshLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };

      setRequestingLocation(false);
      await calculateAndShowRoute(clinic, freshLocation, 'Your Location');

    } catch (err) {
      setRequestingLocation(false);
      setCalculatingRoute(false);

      if (err.code === 1) {
        // User denied permission — offer manual input
        const useManual = window.confirm(
          'Location access was denied.\n\nWould you like to enter your location manually?'
        );
        if (useManual) {
          const manualLocation = prompt('Enter your current location (city or area):');
          if (manualLocation && manualLocation.trim()) {
            setCalculatingRoute(true);
            const coords = await getCoordsFromAddress(manualLocation.trim());
            if (coords) {
              await calculateAndShowRoute(clinic, coords, manualLocation.trim());
            } else {
              alert(`Could not find "${manualLocation}". Please try a different location.`);
            }
            setCalculatingRoute(false);
          }
        }
      } else if (err.code === 2) {
        alert('Your position could not be determined. Please try entering your location manually.');
      } else if (err.code === 3) {
        alert('Location request timed out. Please try again or enter your location manually.');
      } else {
        console.error('getDirections error:', err);
        alert('Unable to get directions. Please try again.');
      }
    }
  };

  const centerOnClinic = (clinic) => {
    if (!mapRef.current || !clinic.latitude || !clinic.longitude) return;
    
    mapRef.current.setView(
      [parseFloat(clinic.latitude), parseFloat(clinic.longitude)],
      15
    );
    setSelectedClinic(clinic);
    
    if (markersRef.current[clinic.clinic_id]) {
      markersRef.current[clinic.clinic_id].openPopup();
    }
  };

  const centerOnUser = () => {
    if (!mapRef.current) return;
    
    if (location && location.latitude && location.longitude) {
      mapRef.current.setView([location.latitude, location.longitude], 14);
      clearRoute();
      if (userMarkerRef.current) {
        userMarkerRef.current.openPopup();
      }
    } else {
      getCurrentPosition();
      setTimeout(() => {
        if (location) {
          mapRef.current.setView([location.latitude, location.longitude], 14);
        }
      }, 1000);
    }
  };

  const zoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const toggleFavorite = async (clinicId) => {
    try {
      const response = await api.post(`/clinics/favorite/${clinicId}`);
      if (response.data.success) {
        if (favorites.includes(clinicId)) {
          setFavorites(favorites.filter(id => id !== clinicId));
        } else {
          setFavorites([...favorites, clinicId]);
        }
        setTimeout(() => updateClinicMarkers(), 100);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-3 w-3 text-yellow-400 fill-yellow-400" />);
    }
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />);
    }
    return stars;
  };

  // Expose function for popup button
  useEffect(() => {
    window.viewClinicDetails = (clinicId) => {
      const clinic = clinics.find(c => c.clinic_id === clinicId);
      if (clinic) {
        setSelectedClinic(clinic);
      }
    };
    
    return () => {
      delete window.viewClinicDetails;
    };
  }, [clinics]);

  // Initialize map and fetch data
  useEffect(() => {
    fetchClinics();
    setTimeout(() => {
      initializeMap();
    }, 100);
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  // Add user marker when location is available
  useEffect(() => {
    if (mapInitialized && location) {
      addUserMarker();
      updateClinicDistances();
    }
  }, [mapInitialized, location]);

  // Update markers when clinics or filters change
  useEffect(() => {
    if (mapInitialized && filteredClinics.length > 0) {
      setTimeout(() => updateClinicMarkers(), 200);
    }
  }, [mapInitialized, filteredClinics, favorites]);

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading clinics near you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-screen pb-8">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Clinic Locator</h2>
        <p className="text-gray-500">Find nearby clinics and healthcare facilities for your maternal care needs.</p>
      </div>

      {/* Search Bar with Button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex gap-3 max-w-3xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search clinic names or locations..." 
              value={tempSearchTerm}
              onChange={(e) => setTempSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-sm outline-none"
            />
            {(searchTerm || tempSearchTerm) && (
              <button 
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <Button 
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            {isSearching ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Search
          </Button>
        </div>
        {searchTerm && filteredClinics.length === 0 && (
          <p className="text-sm text-gray-500 mt-3">No clinics found for "{searchTerm}". Try a different search term.</p>
        )}
        {searchTerm && filteredClinics.length > 0 && (
          <p className="text-sm text-gray-500 mt-3">Found {filteredClinics.length} clinic(s) matching "{searchTerm}"</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Nearby Facilities List */}
        <div className="lg:w-[420px] flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-pink-500" />
                Nearby Facilities
                <span className="ml-2 text-xs text-gray-400">({filteredClinics.length})</span>
              </h3>
              {currentRouteLayerRef.current && (
                <button 
                  onClick={clearRoute}
                  className="text-xs text-pink-600 hover:text-pink-700"
                >
                  Clear Route
                </button>
              )}
            </div>
            
            <div 
              ref={listContainerRef}
              className="p-4 space-y-3 max-h-[600px] overflow-y-auto"
              style={{ scrollBehavior: 'smooth' }}
            >
              {filteredClinics.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No clinics found</p>
                  <p className="text-xs mt-1">Try adjusting your search</p>
                </div>
              ) : (
                filteredClinics.map((clinic) => (
                  <Card 
                    key={clinic.clinic_id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-md ${selectedClinic?.clinic_id === clinic.clinic_id ? 'border-pink-300 ring-1 ring-pink-200 bg-pink-50/30' : 'hover:border-pink-200'}`}
                    onClick={() => centerOnClinic(clinic)}
                    id={`clinic-card-${clinic.clinic_id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-gray-900">{clinic.name}</h4>
                            {clinic.is_verified && (
                              <Badge variant="success" className="text-[10px]">VERIFIED</Badge>
                            )}
                          </div>
                          <div className="flex items-center mt-1 space-x-1">
                            {getRatingStars(clinic.rating || 4.5)}
                            <span className="text-xs text-gray-400 ml-1">({clinic.review_count || 0})</span>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(clinic.clinic_id);
                          }}
                          className="flex-shrink-0"
                        >
                          <Heart className={`h-5 w-5 transition-all ${favorites.includes(clinic.clinic_id) ? 'text-pink-500 fill-pink-500' : 'text-gray-300 hover:text-pink-500'}`} />
                        </button>
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-2 flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        {clinic.distance || 'Distance unknown'}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {clinic.operating_hours && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-pink-50 text-pink-700 text-xs font-medium">
                            <Clock className="h-3 w-3 mr-1" /> 
                            {clinic.operating_hours.includes('24/7') ? '24/7 Open' : clinic.operating_hours.substring(0, 20)}
                          </span>
                        )}
                        {clinic.services && typeof clinic.services === 'string' && clinic.services.split(',').slice(0, 2).map((service, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                            {service.trim()}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        {clinic.contact_number && (
                          <a href={`tel:${clinic.contact_number}`} className="text-sm font-medium text-pink-600 flex items-center hover:text-pink-700">
                            <Phone className="h-4 w-4 mr-1" /> {clinic.contact_number}
                          </a>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            getDirections(clinic);
                          }}
                          disabled={requestingLocation || calculatingRoute}
                          className="bg-pink-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {(requestingLocation || calculatingRoute) ? (
                            <Loader className="h-3.5 w-3.5 mr-1 animate-spin" />
                          ) : (
                            <Navigation className="h-3.5 w-3.5 mr-1" />
                          )}
                          Directions
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Leaflet Map View */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 relative min-h-[500px] lg:min-h-0">
          <div 
            ref={mapContainerRef} 
            className="w-full h-full min-h-[500px]"
            style={{ height: '100%', minHeight: '500px' }}
          />
          
          {/* Click-to-interact hint */}
          <div 
            id="map-hint"
            className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full pointer-events-none z-[500] transition-opacity duration-300"
          >
            Click map to enable scroll zoom
          </div>
          
          {/* Map Controls */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-10">
            <button 
              onClick={zoomIn}
              className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-700 hover:text-pink-600 hover:bg-gray-50 transition-colors"
              title="Zoom In"
            >
              <Plus className="h-5 w-5" />
            </button>
            <button 
              onClick={zoomOut}
              className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-700 hover:text-pink-600 hover:bg-gray-50 transition-colors"
              title="Zoom Out"
            >
              <Minus className="h-5 w-5" />
            </button>
            <button 
              onClick={centerOnUser}
              className="h-10 w-10 mt-4 bg-pink-600 rounded-full flex items-center justify-center shadow-lg text-white hover:bg-pink-700 transition-colors"
              title="My Location"
            >
              <Compass className="h-5 w-5" />
            </button>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-lg z-10">
            <p className="text-xs font-semibold text-gray-500 mb-2">Map Legend</p>
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                <span className="text-xs text-gray-600">Maternity Hospital</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">Clinic</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse"></div>
                <span className="text-xs text-gray-600">Your Location</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full border-2 border-yellow-400"></div>
                <span className="text-xs text-gray-600">Favorite</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1.5 rounded-full bg-pink-600"></div>
                <span className="text-xs text-gray-600">Route</span>
              </div>
            </div>
          </div>

          {/* OpenStreetMap Attribution */}
          <div className="absolute bottom-0 right-0 bg-white/80 text-[10px] text-gray-400 px-2 py-1 rounded-tl-lg z-10">
            © OpenStreetMap contributors
          </div>
        </div>

      </div>

      {/* Direction Loading Overlay */}
      {(requestingLocation || calculatingRoute) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[2000]">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-4 border-pink-100"></div>
              {/* Spinning ring */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-600 border-r-pink-400 animate-spin"></div>
              {/* Icon in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                {requestingLocation ? (
                  <MapPin className="h-7 w-7 text-pink-600" />
                ) : (
                  <Navigation className="h-7 w-7 text-pink-600" />
                )}
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {requestingLocation ? 'Getting Your Location' : 'Calculating Route'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {requestingLocation
                ? 'Please allow location access when prompted by your browser...'
                : 'Finding the best route to the clinic...'}
            </p>

            {/* Animated dots */}
            <div className="flex justify-center gap-1.5">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>

            {calculatingRoute && (
              <p className="text-xs text-gray-400 mt-4">
                Connecting to routing service...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Route Information Panel */}
      {showRoutePanel && routeInfo && (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-[1000] animate-slideInUp">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Route className="h-5 w-5 text-pink-600" />
                <h3 className="font-bold text-gray-900">Route Details</h3>
              </div>
              <button 
                onClick={() => setShowRoutePanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <Car className="h-5 w-5 text-pink-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Distance</p>
                <p className="font-bold text-gray-900">{routeInfo.distance}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <ClockIcon className="h-5 w-5 text-pink-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Est. Time</p>
                <p className="font-bold text-gray-900">{routeInfo.duration}</p>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Estimated Arrival</p>
              <p className="font-semibold text-gray-900">{routeInfo.estimatedArrival}</p>
            </div>
            
            {routeInfo.instructions && routeInfo.instructions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                  <Info className="h-3 w-3 mr-1" /> Turn-by-Turn Directions
                </p>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {routeInfo.instructions.map((instruction, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs">
                      <span className="w-5 h-5 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {instruction.step}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-700">{instruction.text}</p>
                        <p className="text-gray-400 text-[10px]">{instruction.distance} km · {instruction.time} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <button 
              onClick={() => {
                setShowRoutePanel(false);
                clearRoute();
              }}
              className="w-full text-center text-sm text-pink-600 hover:text-pink-700 font-medium"
            >
              Close Directions
            </button>
          </div>
        </div>
      )}

      {/* Selected Clinic Details Modal */}
      {selectedClinic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-[10000]">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedClinic.name}</h2>
                <p className="text-xs text-gray-500 mt-1">{selectedClinic.distance || 'Distance unknown'}</p>
              </div>
              <button 
                onClick={() => setSelectedClinic(null)} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-2">
                {getRatingStars(selectedClinic.rating || 4.5)}
                <span className="text-sm text-gray-600">({selectedClinic.review_count || 0} reviews)</span>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="text-sm text-gray-900">{selectedClinic.address || 'Address not available'}</p>
              </div>
              
              {selectedClinic.contact_number && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Contact</p>
                  <a href={`tel:${selectedClinic.contact_number}`} className="text-sm text-pink-600 font-medium">
                    {selectedClinic.contact_number}
                  </a>
                </div>
              )}
              
              {selectedClinic.operating_hours && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Operating Hours</p>
                  <p className="text-sm text-gray-900">{selectedClinic.operating_hours}</p>
                </div>
              )}
              
              {selectedClinic.services && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Services Offered</p>
                  <div className="flex flex-wrap gap-2">
                    {typeof selectedClinic.services === 'string' && selectedClinic.services.split(',').map((service, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                        {service.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button 
                onClick={() => {
                  getDirections(selectedClinic);
                  setSelectedClinic(null);
                }}
                disabled={requestingLocation || calculatingRoute}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 disabled:opacity-50"
              >
                {(requestingLocation || calculatingRoute) ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  'Get Directions'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideInUp {
          animation: slideInUp 0.3s ease-out;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        html {
          scroll-behavior: smooth;
        }
        .overflow-y-auto {
          scroll-behavior: smooth;
        }
        .leaflet-container {
          cursor: grab;
        }
        .leaflet-container:active {
          cursor: grabbing;
        }
      `}</style>

    </div>
  );
};

export default ClinicLocatorPage;