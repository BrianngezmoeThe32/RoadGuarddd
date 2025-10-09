import { Timestamp, FieldValue } from 'firebase/firestore';

// Base User interface for app usage
export interface User {
  id: string;
  email: string;
  phone: string;
  profile: {
    firstName: string;
    lastName: string;
    photoURL?: string | null;
    dateOfBirth?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  vehicles: Vehicle[];
  familyMembers: FamilyMember[];
  location?: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    address: string;
    timestamp: Date;
  };
  settings: {
    notifications: boolean;
    emergencyAlerts: boolean;
    biometricAuth: boolean;
    language: string;
  };
  stats: {
    totalServices: number;
    completedServices: number;
    cancelledServices: number;
    averageRating?: number;
  };
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  lastLoginAt?: Timestamp | Date;
}

// User interface for Firestore writes (allows FieldValue)
export interface UserWrite {
  id: string;
  email: string;
  phone: string;
  profile: {
    firstName: string;
    lastName: string;
    photoURL?: string | null;
    dateOfBirth?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  vehicles: Vehicle[];
  familyMembers: FamilyMember[];
  location?: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    address: string;
    timestamp: Date;
  };
  settings: {
    notifications: boolean;
    emergencyAlerts: boolean;
    biometricAuth: boolean;
    language: string;
  };
  stats: {
    totalServices: number;
    completedServices: number;
    cancelledServices: number;
    averageRating?: number;
  };
  createdAt: Timestamp | Date | FieldValue;
  updatedAt: Timestamp | Date | FieldValue;
  lastLoginAt?: Timestamp | Date | FieldValue;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  type: 'car' | 'motorcycle' | 'truck' | 'suv';
  isPrimary: boolean;
}

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phone: string;
  isVerified: boolean;
  biometricEnabled: boolean;
  addedAt: Timestamp | Date;
}