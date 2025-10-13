
import { useState, useContext, createContext, useEffect } from 'react'; // Fixed: added useEffect
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (email: string, password: string, fullName: string, phone?: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<UserCredential> => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // In hooks/useAuth.tsx - update the register function
// In hooks/useAuth.tsx - update the register function
const register = async (
  email: string, 
  password: string, 
  fullName: string, 
  phone?: string
): Promise<UserCredential> => {
  setIsLoading(true);
  try {
    console.log('🔄 Firebase: Creating user with email:', email);
    
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ Firebase: User created, UID:', userCredential.user.uid);
    
    // Update user profile with display name
    await updateProfile(userCredential.user, {
      displayName: fullName
    });
    console.log('✅ Firebase: Profile updated');

    // Create user document in Firestore with error handling
    try {
      console.log('🔄 Firestore: Creating user document...');
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email,
        fullName: fullName,
        phone: phone || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log('✅ Firestore: User document created successfully');
    } catch (firestoreError) {
      console.error('❌ Firestore error:', firestoreError);
      // Even if Firestore fails, we still have a registered user
      // So we don't throw the error, just log it
    }

    setUser(userCredential.user);
    return userCredential;
  } catch (error) {
    console.error('❌ Registration error in useAuth:', error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}