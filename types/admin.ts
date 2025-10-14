export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'support_agent';
  permissions: string[];
  createdAt: string;
}

export interface SystemMetrics {
  totalUsers: number;
  totalServiceProviders: number;
  activeServices: number;
  completedServicesToday: number;
  revenueToday: number;
  systemHealth: 'healthy' | 'degraded' | 'down';
}

export interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string[];
  status: 'active' | 'inactive' | 'suspended';
  rating: number;
  totalServices: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  documents: {
    license: string;
    insurance: string;
    vehicleRegistration: string;
  };
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  userId: string;
  serviceType: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  providerId?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  details: any;
  createdAt: string;
  updatedAt: string;
}