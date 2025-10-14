export interface ServiceProvider {
  id: string;
  userId: string;
  businessName: string;
  serviceTypes: ServiceType[];
  documents: ProviderDocuments;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  rating: number;
  totalJobs: number;
  earnings: number;
  location: Location;
  availability: 'available' | 'busy' | 'offline';
  currentJob?: string;
}

export interface ProviderDocuments {
  license: string;
  insurance: string;
  vehicleRegistration: string;
  profilePhoto: string;
}

export interface ServiceType {
  id: string;
  name: string;
  basePrice: number;
  perMileRate?: number;
  equipment?: string[];
}

export interface ServiceRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  serviceType: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  location: Location;
  destination?: Location;
  details: ServiceDetails;
  price: number;
  distance: number;
  createdAt: string;
}

export interface ServiceDetails {
  vehicle: string;
  notes?: string;
  fuelAmount?: number;
  fuelType?: 'petrol' | 'diesel';
  tireSize?: string;
  batteryType?: string;
  lockType?: string;
  towDistance?: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}