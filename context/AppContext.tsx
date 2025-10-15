import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState as RNAppState, AppStateStatus, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// Rename the interface to avoid conflict
interface AppContextState {
  isOnline: boolean;
  appState: AppStateStatus;
  isLoading: boolean;
  lastUpdate: Date | null;
  errors: string[];
}

type AppAction =
  | { type: 'SET_ONLINE'; payload: boolean }
  | { type: 'SET_APP_STATE'; payload: AppStateStatus }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LAST_UPDATE'; payload: Date }
  | { type: 'ADD_ERROR'; payload: string }
  | { type: 'CLEAR_ERRORS' };

interface AppContextType extends AppContextState {
  setLoading: (loading: boolean) => void;
  addError: (error: string) => void;
  clearErrors: () => void;
  refreshApp: () => void;
}

const initialState: AppContextState = {
  isOnline: true,
  appState: 'active',
  isLoading: false,
  lastUpdate: null,
  errors: [],
};

const appReducer = (state: AppContextState, action: AppAction): AppContextState => {
  switch (action.type) {
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload };
    case 'SET_APP_STATE':
      return { ...state, appState: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_LAST_UPDATE':
      return { ...state, lastUpdate: action.payload };
    case 'ADD_ERROR':
      return { ...state, errors: [...state.errors, action.payload] };
    case 'CLEAR_ERRORS':
      return { ...state, errors: [] };
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const addError = (error: string) => {
    console.error('App Error:', error);
    dispatch({ type: 'ADD_ERROR', payload: error });
  };

  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  const refreshApp = () => {
    dispatch({ type: 'SET_LAST_UPDATE', payload: new Date() });
  };

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((networkState: any) => {
      dispatch({ type: 'SET_ONLINE', payload: networkState.isConnected ?? false });
    });

    return unsubscribe;
  }, []);

  // Monitor app state (active, background, inactive)
  useEffect(() => {
    const subscription = RNAppState.addEventListener('change', nextAppState => {
      dispatch({ type: 'SET_APP_STATE', payload: nextAppState });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Handle app coming to foreground
  useEffect(() => {
    if (state.appState === 'active') {
      refreshApp();
    }
  }, [state.appState]);

  const value: AppContextType = {
    ...state,
    setLoading,
    addError,
    clearErrors,
    refreshApp,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};