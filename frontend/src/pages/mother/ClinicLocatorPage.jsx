import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Search, MapPin, Navigation, Phone, Heart, Plus, Minus, Target, Clock, Star } from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation';

const ClinicLocatorPage = () => {
  const { 
    location, 
    loading: geoLoading, 
    error: geoError,
    getCurrentPosition
  } = useGeolocation();
  
  const [userLocation, setUserLocation] = useState('Colombo 07, Sri Lanka');

  useEffect(() => {
    getCurrentPosition();
  }, []);

  useEffect(() => {
    if (location) {
      setUserLocation(`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`);
    }
  }, [location]);

  return (
    <div className="p-6 space-y-6 min-h-screen pb-8">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Clinic Locator</h2>
        <p className="text-gray-500">Find nearby clinics and healthcare facilities for your maternal care needs.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search clinic names or locations..." 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-sm outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Nearby Facilities */}
        <div className="lg:w-[420px] flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-pink-500" />
                Nearby Facilities
              </h3>
            </div>
            
            <div className="p-4 space-y-3">
              
              {/* Clinic 1 - Favorited & Selected */}
              <Card className="border-pink-300 shadow-sm relative hover:border-pink-400 transition-colors cursor-pointer bg-white ring-1 ring-pink-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">Lanka Maternity Hospital</h4>
                      <div className="flex items-center mt-1 space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        ))}
                        <span className="text-xs text-gray-400 ml-1">(4.8)</span>
                      </div>
                    </div>
                    <Heart className="h-5 w-5 text-pink-500 fill-pink-500 cursor-pointer hover:scale-110 transition-transform flex-shrink-0" />
                  </div>
                  <p className="text-sm text-gray-500 mb-3 flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    2.4 km away - Colombo 07
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-pink-50 text-pink-700 text-xs font-medium">
                      <Clock className="h-3 w-3 mr-1" /> 24/7 Open
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                      BP Check
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                      Ultrasound
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <p className="text-sm font-medium text-pink-600 flex items-center">
                      <Phone className="h-4 w-4 mr-1" /> +94 11 234 5678
                    </p>
                    <button className="bg-pink-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center hover:bg-pink-700 transition-colors">
                      <Navigation className="h-3.5 w-3.5 mr-1" /> Directions
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Clinic 2 */}
              <Card className="hover:border-pink-300 transition-colors cursor-pointer bg-white border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">Serene Care Clinic</h4>
                      <div className="flex items-center mt-1 space-x-1">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        ))}
                        <Star className="h-3 w-3 text-gray-300" />
                        <span className="text-xs text-gray-400 ml-1">(4.2)</span>
                      </div>
                    </div>
                    <Heart className="h-5 w-5 text-gray-300 cursor-pointer hover:text-pink-500 hover:fill-pink-500 transition-all flex-shrink-0" />
                  </div>
                  <p className="text-sm text-gray-500 mb-3 flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    3.8 km away - Dehiwala
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                      <Clock className="h-3 w-3 mr-1" /> 8AM-8PM
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                      Lab Tests
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <p className="text-sm font-medium text-pink-600 flex items-center">
                      <Phone className="h-4 w-4 mr-1" /> +94 11 234 5679
                    </p>
                    <button className="bg-pink-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center hover:bg-pink-700 transition-colors">
                      <Navigation className="h-3.5 w-3.5 mr-1" /> Directions
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Clinic 3 */}
              <Card className="hover:border-pink-300 transition-colors cursor-pointer bg-white border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">City Wellness Hub</h4>
                      <div className="flex items-center mt-1 space-x-1">
                        {[1, 2, 3].map((star) => (
                          <Star key={star} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        ))}
                        {[1, 2].map((star) => (
                          <Star key={`empty-${star}`} className="h-3 w-3 text-gray-300" />
                        ))}
                        <span className="text-xs text-gray-400 ml-1">(3.1)</span>
                      </div>
                    </div>
                    <Heart className="h-5 w-5 text-gray-300 cursor-pointer hover:text-pink-500 hover:fill-pink-500 transition-all flex-shrink-0" />
                  </div>
                  <p className="text-sm text-gray-500 mb-3 flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    5.1 km away - Rajagiriya
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-pink-50 text-pink-700 text-xs font-medium">
                      <Clock className="h-3 w-3 mr-1" /> 24/7 Open
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                      BP Check
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <p className="text-sm font-medium text-pink-600 flex items-center">
                      <Phone className="h-4 w-4 mr-1" /> +94 11 234 5680
                    </p>
                    <button className="bg-pink-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center hover:bg-pink-700 transition-colors">
                      <Navigation className="h-3.5 w-3.5 mr-1" /> Directions
                    </button>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative min-h-[500px] lg:min-h-0">
          {/* Map Background */}
          <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')" }}></div>
          
          {/* Map Center Pin */}
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <div className="h-16 w-16 bg-pink-600 text-white rounded-full flex items-center justify-center shadow-lg animate-bounce relative z-10 pointer-events-auto">
              <MapPin className="h-8 w-8" />
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-white rounded-full flex items-center justify-center text-pink-600 shadow">
                <Target className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-800 drop-shadow-md">Your Location</p>
            <p className="text-sm text-gray-600">{userLocation}</p>
          </div>

          {/* Map Overlays */}
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg">
              <div className="flex items-center mb-1">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Live Traffic Status</p>
              </div>
              <p className="text-xs text-gray-700">Clear routes to most facilities. Estimated travel time to nearest ER: 8 mins.</p>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2">
            <button className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-700 hover:text-pink-600 hover:bg-gray-50 transition-colors pointer-events-auto">
              <Plus className="h-5 w-5" />
            </button>
            <button className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-700 hover:text-pink-600 hover:bg-gray-50 transition-colors pointer-events-auto">
              <Minus className="h-5 w-5" />
            </button>
            <button className="h-10 w-10 mt-4 bg-pink-600 rounded-full flex items-center justify-center shadow-lg text-white hover:bg-pink-700 transition-colors pointer-events-auto">
              <Target className="h-5 w-5" />
            </button>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-lg">
            <p className="text-xs font-semibold text-gray-500 mb-2">Map Legend</p>
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-pink-500"></div>
                <span className="text-xs text-gray-600">Maternity Hospital</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">Clinic</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600">Pharmacy</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClinicLocatorPage;