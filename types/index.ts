export interface Service {
  id: number;
  name: string;
  icon: string;
  description: string;
  color: string;
  iconName: string;
}

export interface ServiceDetails {
  vehicle?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface ServiceRequest {
  id: number;
  service: Service;
  date: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  details: ServiceDetails;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}