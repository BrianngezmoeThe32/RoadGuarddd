import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { AuthService } from '../services/firebase/authService';
import { User } from '../types/user';

interface AuthState {
  user: FirebaseUser | null;
  userData: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authError: string | null;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: FirebaseUser | null }
  | { type: 'SET_USER_DATA'; payload: User | null }
  | { type: 'SET_AUTH_ERROR'; payload: string | null }
  | { type: 'CLEAR_AUTH_ERROR' }
  | { type: 'LOGOUT' };

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  clearAuthError: () => void;
  refreshUserData: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  userData: null,
  isLoading: true,
  isAuthenticated: false,
  authError: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload,
        isAuthenticated: !!action.payload,
        authError: null,
      };
    case 'SET_USER_DATA':
      return { ...state, userData: action.payload };
    case 'SET_AUTH_ERROR':
      return { ...state, authError: action.payload, isLoading: false };
    case 'CLEAR_AUTH_ERROR':
      return { ...state, authError: null };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await AuthService.loginUser(email, password);
      // User will be set via the auth state listener
    } catch (error: any) {
      dispatch({ type: 'SET_AUTH_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await AuthService.registerUser(email, password, userData);
      // User will be set via the auth state listener
    } catch (error: any) {
      dispatch({ type: 'SET_AUTH_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error: any) {
      dispatch({ type: 'SET_AUTH_ERROR', payload: error.message });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await AuthService.resetPassword(email);
    } catch (error: any) {
      dispatch({ type: 'SET_AUTH_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!state.user) throw new Error('No user logged in');
    
    try {
      await AuthService.updateUserProfile(state.user.uid, updates);
      // User data will be updated via the snapshot listener
    } catch (error: any) {
      dispatch({ type: 'SET_AUTH_ERROR', payload: error.message });
      throw error;
    }
  };

  const clearAuthError = () => {
    dispatch({ type: 'CLEAR_AUTH_ERROR' });
  };

  const refreshUserData = async () => {
    if (state.user) {
      try {
        const userData = await AuthService.getUserProfile(state.user.uid);
        dispatch({ type: 'SET_USER_DATA', payload: userData });
      } catch (error: any) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      dispatch({ type: 'SET_USER', payload: firebaseUser });
      
      if (firebaseUser) {
        // Subscribe to user data updates
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeUser = onSnapshot(userDocRef, 
          (doc) => {
            if (doc.exists()) {
              const userData = { id: doc.id, ...doc.data() } as User;
              dispatch({ type: 'SET_USER_DATA', payload: userData });
            }
            dispatch({ type: 'SET_LOADING', payload: false });
          },
          (error) => {
            console.error('Error listening to user data:', error);
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        );

        return unsubscribeUser;
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
    clearAuthError,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};