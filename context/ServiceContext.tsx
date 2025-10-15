import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { ServiceRequest } from '../types/service';

interface ServiceState {
  activeServices: ServiceRequest[];
  serviceHistory: ServiceRequest[];
  isLoading: boolean;
  serviceError: string | null;
  selectedService: ServiceRequest | null;
}

type ServiceAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ACTIVE_SERVICES'; payload: ServiceRequest[] }
  | { type: 'SET_SERVICE_HISTORY'; payload: ServiceRequest[] }
  | { type: 'SET_SELECTED_SERVICE'; payload: ServiceRequest | null }
  | { type: 'ADD_ACTIVE_SERVICE'; payload: ServiceRequest }
  | { type: 'UPDATE_ACTIVE_SERVICE'; payload: ServiceRequest }
  | { type: 'REMOVE_ACTIVE_SERVICE'; payload: string }
  | { type: 'ADD_SERVICE_TO_HISTORY'; payload: ServiceRequest }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

interface ServiceContextType extends ServiceState {
  setSelectedService: (service: ServiceRequest | null) => void;
  refreshServices: () => void;
  clearError: () => void;
  getServiceById: (serviceId: string) => ServiceRequest | undefined;
  getActiveServiceByType: (serviceType: string) => ServiceRequest | undefined;
  hasActiveService: () => boolean;
}

const initialState: ServiceState = {
  activeServices: [],
  serviceHistory: [],
  isLoading: false,
  serviceError: null,
  selectedService: null,
};

const serviceReducer = (state: ServiceState, action: ServiceAction): ServiceState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ACTIVE_SERVICES':
      return { ...state, activeServices: action.payload };
    case 'SET_SERVICE_HISTORY':
      return { ...state, serviceHistory: action.payload };
    case 'SET_SELECTED_SERVICE':
      return { ...state, selectedService: action.payload };
    case 'ADD_ACTIVE_SERVICE':
      return {
        ...state,
        activeServices: [action.payload, ...state.activeServices],
      };
    case 'UPDATE_ACTIVE_SERVICE':
      const updatedActiveServices = state.activeServices.map(service =>
        service.id === action.payload.id ? action.payload : service
      );
      return { ...state, activeServices: updatedActiveServices };
    case 'REMOVE_ACTIVE_SERVICE':
      const filteredActiveServices = state.activeServices.filter(
        service => service.id !== action.payload
      );
      return { ...state, activeServices: filteredActiveServices };
    case 'ADD_SERVICE_TO_HISTORY':
      return {
        ...state,
        serviceHistory: [action.payload, ...state.serviceHistory],
        activeServices: state.activeServices.filter(service => service.id !== action.payload.id),
      };
    case 'SET_ERROR':
      return { ...state, serviceError: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, serviceError: null };
    default:
      return state;
  }
};

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(serviceReducer, initialState);
  const { user } = useAuth();

  const setSelectedService = (service: ServiceRequest | null): void => {
    dispatch({ type: 'SET_SELECTED_SERVICE', payload: service });
  };

  const refreshServices = (): void => {
    // This will trigger the useEffect to re-fetch services
    dispatch({ type: 'SET_LOADING', payload: true });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const getServiceById = (serviceId: string): ServiceRequest | undefined => {
    return [...state.activeServices, ...state.serviceHistory].find(
      service => service.id === serviceId
    );
  };

  const getActiveServiceByType = (serviceType: string): ServiceRequest | undefined => {
    return state.activeServices.find(service => service.serviceType === serviceType);
  };

  const hasActiveService = (): boolean => {
    return state.activeServices.length > 0;
  };

  // Subscribe to user's service requests
  useEffect(() => {
    if (!user) {
      dispatch({ type: 'SET_ACTIVE_SERVICES', payload: [] });
      dispatch({ type: 'SET_SERVICE_HISTORY', payload: [] });
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    // Subscribe to active services
    const activeQuery = query(
      collection(db, 'serviceRequests'),
      where('userId', '==', user.uid),
      where('status', 'in', ['pending', 'accepted', 'en_route', 'in_progress']),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeActive = onSnapshot(
      activeQuery,
      (snapshot) => {
        const activeServices = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as ServiceRequest));
        dispatch({ type: 'SET_ACTIVE_SERVICES', payload: activeServices });
        dispatch({ type: 'SET_LOADING', payload: false });
      },
      (error) => {
        console.error('Error fetching active services:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load active services' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    );

    // Subscribe to service history
    const historyQuery = query(
      collection(db, 'serviceRequests'),
      where('userId', '==', user.uid),
      where('status', 'in', ['completed', 'cancelled']),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeHistory = onSnapshot(
      historyQuery,
      (snapshot) => {
        const serviceHistory = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as ServiceRequest));
        dispatch({ type: 'SET_SERVICE_HISTORY', payload: serviceHistory });
      },
      (error) => {
        console.error('Error fetching service history:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load service history' });
      }
    );

    return () => {
      unsubscribeActive();
      unsubscribeHistory();
    };
  }, [user]);

  const value: ServiceContextType = {
    ...state,
    setSelectedService,
    refreshServices,
    clearError,
    getServiceById,
    getActiveServiceByType,
    hasActiveService,
  };

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
};