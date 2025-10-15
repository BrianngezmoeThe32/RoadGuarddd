import { Timestamp, GeoPoint, FieldValue } from 'firebase/firestore';

export type ServiceType = 
  | 'fuel_delivery'
  | 'tire_change'
  | 'jump_start'
  | 'lockout'
  | 'towing'
  | 'other';

export type ServiceStatus = 
  | 'pending'
  | 'accepted'
  | 'en_route'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type ServicePriority = 'normal' | 'emergency';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

export type PaymentMethod = 'card' | 'cash' | 'wallet';

export type BiometricMethod = 'fingerprint' | 'facial' | 'none';

export interface ServiceRequest {
  id: string;
  userId: string;
  providerId?: string;
  garageId?: string;
  
  // Service Details
  serviceType: ServiceType;
  priority: ServicePriority;
  description: string;
  
  // Vehicle Information
  vehicle: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
    type?: 'car' | 'motorcycle' | 'truck' | 'suv' | 'van';
    vin?: string;
  };
  
  // Location Details
  location: {
    coordinates: GeoPoint;
    address: string;
    notes?: string;
    landmark?: string;
  };
  
  // Destination (for towing services)
  destination?: {
    coordinates: GeoPoint;
    address: string;
    name?: string; // e.g., "Auto Repair Shop", "Home"
  };
  
  // Status & Timeline
  status: ServiceStatus;
  timeline: {
    requested: Timestamp;
    accepted?: Timestamp;
    enRoute?: Timestamp;
    arrived?: Timestamp;
    started?: Timestamp;
    completed?: Timestamp;
    cancelled?: Timestamp;
  };
  
  // Pricing
  pricing: {
    baseFee: number;
    distanceFee: number;
    emergencyFee: number;
    additionalCharges?: number;
    discount?: number;
    total: number;
    currency: string;
    estimated?: boolean;
  };
  
  // Provider Tracking
  providerLocationUpdates?: Array<{
    coordinates: GeoPoint;
    timestamp: Timestamp;
    eta?: number; // in minutes
    speed?: number; // in km/h
  }>;
  
  // Security & Verification
  biometricVerification: {
    isVerified: boolean;
    method?: BiometricMethod;
    verifiedAt?: Timestamp;
    attempts?: number;
  };
  
  // Payment Information
  payment: {
    status: PaymentStatus;
    method?: PaymentMethod;
    transactionId?: string;
    paidAt?: Timestamp;
    refundedAt?: Timestamp;
    refundReason?: string;
  };
  
  // Rating & Feedback
  rating?: {
    score: number; // 1-5
    comment?: string;
    ratedAt: Timestamp;
    providerRating?: number;
    serviceRating?: number;
    timelinessRating?: number;
  };
  
  // Additional Details
  emergencyContactNotified: boolean;
  cancellationReason?: string;
  providerNotes?: string;
  customerNotes?: string;
  
  // Metadata
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

export interface ServiceRequestWrite extends Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'> {
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

export interface ServiceStats {
  totalServices: number;
  completedServices: number;
  cancelledServices: number;
  averageRating: number;
  totalEarnings: number;
  responseTime: number; // average response time in minutes
  completionRate: number; // percentage
}

export interface ServiceCategory {
  id: ServiceType;
  name: string;
  description: string;
  icon: string;
  basePrice: number;
  available: boolean;
  emergencyAvailable: boolean;
  estimatedTime: number; // in minutes
  requirements?: string[];
}

export interface ServiceRating {
  id: string;
  serviceRequestId: string;
  userId: string;
  providerId: string;
  rating: number;
  comments?: string;
  categories: {
    professionalism: number;
    timeliness: number;
    quality: number;
    communication: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ServiceProviderAssignment {
  providerId: string;
  assignedAt: Timestamp;
  acceptedAt?: Timestamp;
  rejectedAt?: Timestamp;
  rejectionReason?: string;
  estimatedArrival?: number; // in minutes
  distance?: number; // in km
}

export interface ServiceCancellation {
  cancelledBy: 'user' | 'provider' | 'system';
  reason: string;
  reasonCode?: string;
  refundAmount?: number;
  cancelledAt: Timestamp;
  notes?: string;
}

// For real-time service tracking
export interface ServiceTrackingData {
  serviceRequestId: string;
  providerId: string;
  currentLocation: GeoPoint;
  destination: GeoPoint;
  eta: number; // in minutes
  distance: number; // in km
  polyline?: string; // for map route
  lastUpdated: Timestamp;
}

// For service matching algorithm
export interface ProviderMatch {
  providerId: string;
  distance: number; // in km
  eta: number; // in minutes
  rating: number;
  completionRate: number;
  responseTime: number;
  matchScore: number;
  services: ServiceType[];
  currentLoad?: number; // number of active services
}