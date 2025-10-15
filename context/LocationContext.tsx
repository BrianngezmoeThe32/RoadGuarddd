import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import * as Location from 'expo-location';
import { GeoPoint } from 'firebase/firestore';

interface LocationState {
  currentLocation: {
    latitude: number;
    longitude: number;
    accuracy: number | null;
  } | null;
  lastUpdated: Date | null;
  isTracking: boolean;
  hasPermission: boolean;
  locationError: string | null;
}

type LocationAction =
  | { type: 'SET_LOCATION'; payload: Location.LocationObject }
  | { type: 'SET_PERMISSION'; payload: boolean }
  | { type: 'SET_TRACKING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_LOCATION' };

interface LocationContextType extends LocationState {
  requestPermission: () => Promise<boolean>;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
  getCurrentLocation: () => Promise<Location.LocationObject | null>;
  clearLocationError: () => void;
  getLocationAsGeoPoint: () => GeoPoint | null;
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
}

const initialState: LocationState = {
  currentLocation: null,
  lastUpdated: null,
  isTracking: false,
  hasPermission: false,
  locationError: null,
};

const locationReducer = (state: LocationState, action: LocationAction): LocationState => {
  switch (action.type) {
    case 'SET_LOCATION':
      return {
        ...state,
        currentLocation: {
          latitude: action.payload.coords.latitude,
          longitude: action.payload.coords.longitude,
          accuracy: action.payload.coords.accuracy,
        },
        lastUpdated: new Date(),
        locationError: null,
      };
    case 'SET_PERMISSION':
      return { ...state, hasPermission: action.payload };
    case 'SET_TRACKING':
      return { ...state, isTracking: action.payload };
    case 'SET_ERROR':
      return { ...state, locationError: action.payload };
    case 'CLEAR_LOCATION':
      return {
        ...state,
        currentLocation: null,
        lastUpdated: null,
        isTracking: false,
      };
    default:
      return state;
  }
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(locationReducer, initialState);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  const requestPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'RoadGuard Location Permission',
            message: 'RoadGuard needs access to your location to provide roadside assistance.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        const hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        dispatch({ type: 'SET_PERMISSION', payload: hasPermission });
        return hasPermission;
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        const hasPermission = status === 'granted';
        dispatch({ type: 'SET_PERMISSION', payload: hasPermission });
        return hasPermission;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to request location permission' });
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        dispatch({ type: 'SET_ERROR', payload: 'Location permission denied' });
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      dispatch({ type: 'SET_LOCATION', payload: location });
      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get current location' });
      return null;
    }
  };

  const startTracking = async (): Promise<void> => {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      // Get initial location
      await getCurrentLocation();

      // Start watching position
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 10, // Update every 10 meters
          timeInterval: 5000, // Update every 5 seconds
        },
        (location: Location.LocationObject) => {
          dispatch({ type: 'SET_LOCATION', payload: location });
        }
      );

      dispatch({ type: 'SET_TRACKING', payload: true });
    } catch (error: any) {
      console.error('Error starting location tracking:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const stopTracking = (): void => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    dispatch({ type: 'SET_TRACKING', payload: false });
  };

  const clearLocationError = (): void => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const getLocationAsGeoPoint = (): GeoPoint | null => {
    if (!state.currentLocation) return null;
    return new GeoPoint(state.currentLocation.latitude, state.currentLocation.longitude);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  // Request permission on mount
  useEffect(() => {
    requestPermission();
  }, []);

  const value: LocationContextType = {
    ...state,
    requestPermission,
    startTracking,
    stopTracking,
    getCurrentLocation,
    clearLocationError,
    getLocationAsGeoPoint,
    calculateDistance,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};