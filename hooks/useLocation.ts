import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate location fetching
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockLocation: Location = {
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Main St, New York, NY 10001'
      };
      
      setLocation(mockLocation);
      return mockLocation;
    } catch (err) {
      const errorMessage = 'Failed to get location';
      setError(errorMessage);
      Alert.alert('Location Error', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocationAddress = async (latitude: number, longitude: number) => {
    try {
      // Simulate reverse geocoding
      await new Promise(resolve => setTimeout(resolve, 500));
      return `Address near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch (err) {
      throw new Error('Failed to get address');
    }
  };

  useEffect(() => {
    // Get initial location when hook is used
    getCurrentLocation();
  }, []);

  return {
    location,
    isLoading,
    error,
    getCurrentLocation,
    updateLocationAddress,
  };
}