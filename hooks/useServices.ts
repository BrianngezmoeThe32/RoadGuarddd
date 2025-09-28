import { useState } from 'react';
import { Service, ServiceRequest } from '../types';
import { SERVICES } from '../constants/services';

export function useServices() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const requestService = async (service: Service, details: any) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newRequest: ServiceRequest = {
      id: Date.now(),
      service,
      date: new Date().toISOString(),
      status: 'Pending',
      details,
    };
    
    setServiceRequests(prev => [newRequest, ...prev]);
    setIsLoading(false);
    
    return newRequest;
  };

  const getServiceHistory = () => {
    // Return mock data for demonstration
    return [
      {
        id: 1,
        service: SERVICES[0],
        date: '2023-10-15 14:30',
        status: 'Completed',
        details: { vehicle: 'Toyota Camry' }
      },
      {
        id: 2,
        service: SERVICES[1],
        date: '2023-09-22 09:15',
        status: 'Completed',
        details: { vehicle: 'Honda Civic' }
      },
    ];
  };

  return {
    services: SERVICES,
    serviceRequests,
    isLoading,
    requestService,
    getServiceHistory,
  };
}