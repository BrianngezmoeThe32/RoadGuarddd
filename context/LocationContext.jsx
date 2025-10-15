import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import LocationService from '../services/locationService';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getLocation = useCallback(async () => {
    try {
      console.log('🔄 Location: Starting location request...');
      setIsLoading(true);
      setLocationError(null);
      
      const position = await LocationService.getLocationOnce();
      console.log('✅ Location: Success!', position);
      setCurrentLocation(position);
      
    } catch (error) {
      console.log('❌ Location: Error:', error);
      setLocationError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const refreshLocation = useCallback(async () => {
    await getLocation();
  }, [getLocation]);

  const value = {
    currentLocation,
    locationError,
    isLoading,
    refreshLocation,
    isWatching: false, // Simplified for now
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};