import { GeoPoint, Timestamp, FieldValue } from 'firebase/firestore';
import { ServiceType } from './provider';

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  formattedAddress: string;
  placeId?: string;
}

export interface Location {
  coordinates: GeoPoint;
  address: Address;
  timestamp: Timestamp;
  type?: 'current' | 'pickup' | 'destination' | 'service';
  metadata?: {
    isAccurate?: boolean;
    source?: 'gps' | 'network' | 'manual';
    batteryLevel?: number;
    activity?: 'still' | 'walking' | 'running' | 'driving';
  };
}

export interface LocationWrite extends Omit<Location, 'timestamp'> {
  timestamp: Timestamp | FieldValue;
}

export interface GeoFence {
  id: string;
  name: string;
  center: GeoPoint;
  radius: number; // in meters
  type: 'service_area' | 'restricted_area' | 'promotion_zone';
  metadata?: {
    description?: string;
    active: boolean;
    priority?: number;
  };
}

export interface Route {
  origin: Coordinates;
  destination: Coordinates;
  distance: number; // in meters
  duration: number; // in seconds
  polyline: string; // encoded polyline
  bounds: {
    northeast: Coordinates;
    southwest: Coordinates;
  };
  steps: RouteStep[];
  summary: string;
}

export interface RouteStep {
  distance: number; // in meters
  duration: number; // in seconds
  instruction: string;
  polyline: string;
  maneuver?: string;
  startLocation: Coordinates;
  endLocation: Coordinates;
}

export interface ServiceArea {
  id: string;
  name: string;
  description?: string;
  region: GeoFence;
  providers: string[]; // provider IDs
  garages: string[]; // garage IDs
  services: ServiceType[];
  pricing: {
    baseMultiplier: number;
    distanceRate: number;
    minimumFee: number;
  };
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface LocationTracking {
  userId: string;
  providerId?: string;
  location: Location;
  sessionId?: string;
  isActive: boolean;
  batteryLevel?: number;
  networkType?: 'wifi' | 'cellular' | 'offline';
  accuracy: 'high' | 'medium' | 'low';
  lastUpdated: Timestamp;
}

export interface DistanceMatrix {
  origin: Coordinates;
  destination: Coordinates;
  distance: number; // in meters
  duration: number; // in seconds
  status: 'OK' | 'NOT_FOUND' | 'ZERO_RESULTS' | 'MAX_ROUTE_LENGTH_EXCEEDED';
}

export interface Place {
  id: string;
  placeId: string;
  name: string;
  address: Address;
  coordinates: Coordinates;
  types: string[];
  rating?: number;
  userRatingsTotal?: number;
  openingHours?: {
    openNow: boolean;
    periods?: Array<{
      open: { day: number; time: string };
      close: { day: number; time: string };
    }>;
    weekdayText?: string[];
  };
  phoneNumber?: string;
  website?: string;
  photos?: string[];
}

export interface LocationPermission {
  granted: boolean;
  canAskAgain: boolean;
  status: 'granted' | 'denied' | 'limited' | 'never_ask_again';
  accuracy: 'fine' | 'coarse' | 'none';
}

export interface LocationSettings {
  trackingEnabled: boolean;
  accuracy: 'high' | 'balanced' | 'low' | 'passive';
  updateInterval: number; // in milliseconds
  distanceFilter: number; // in meters
  backgroundUpdates: boolean;
  significantLocationChanges: boolean;
}

export interface LocationHistory {
  userId: string;
  locations: Array<{
    coordinates: Coordinates;
    timestamp: Timestamp;
    activity?: string;
    batteryLevel?: number;
  }>;
  sessionStart: Timestamp;
  sessionEnd?: Timestamp;
  totalDistance?: number; // in meters
}

export interface ReverseGeocodeResult {
  address: Address;
  placeId: string;
  plusCode?: string;
  types: string[];
  areaOfInterest?: string[];
}

export interface AutocompletePrediction {
  placeId: string;
  description: string;
  structuredFormatting: {
    mainText: string;
    secondaryText: string;
  };
  types: string[];
  distanceMeters?: number;
}

// For real-time location sharing between user and provider
export interface LocationShare {
  serviceRequestId: string;
  userId: string;
  providerId: string;
  userLocation?: Location;
  providerLocation?: Location;
  sharingEnabled: boolean;
  lastUserUpdate?: Timestamp;
  lastProviderUpdate?: Timestamp;
  expiresAt: Timestamp;
}

// For geospatial queries
export interface BoundingBox {
  northeast: Coordinates;
  southwest: Coordinates;
}

export interface CircularRegion {
  center: Coordinates;
  radius: number; // in meters
  identifier: string;
}

// For location-based notifications
export interface LocationTrigger {
  id: string;
  type: 'enter' | 'exit' | 'dwell';
  region: CircularRegion;
  notification: {
    title: string;
    body: string;
    data?: any;
  };
  active: boolean;
}