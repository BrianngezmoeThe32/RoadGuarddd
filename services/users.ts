import { Timestamp, FieldValue } from 'firebase/firestore';

export type UserRole = 'user' | 'provider' | 'admin' | 'garage_owner';

export interface User {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
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

export interface UserWrite extends Omit<User, 'id'> {
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
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