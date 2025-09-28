// hooks/useAuth.tsx
import { useState, createContext, useContext, ReactNode } from "react"; 
import { User, AuthState } from "../types";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const user: User = {
      id: "1",
      name: "John Doe",
      email,
      phone: "(555) 123-4567",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?...",
    };
    setAuthState({ user, isAuthenticated: true, isLoading: false });
  };

  const register = async (userData: Partial<User>) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const user: User = {
      id: "1",
      name: userData.name ?? "",
      email: userData.email ?? "",
      phone: userData.phone ?? "",
      avatar: userData.avatar ?? "",
    };
    setAuthState({ user, isAuthenticated: true, isLoading: false });
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  };

  const updateProfile = (userData: Partial<User>) => {
    if (authState.user) {
      setAuthState((prev) => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...userData } : null,
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{ ...authState, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
