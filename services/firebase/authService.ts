
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { User, UserWrite } from '../../types/user';

export const AuthService = {
  // Login user with email and password
  async loginUser(email: string, password: string): Promise<FirebaseUser> {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      
      console.log('✅ Login successful for user:', userCredential.user.uid);
      
      // Update user's last login timestamp
      try {
        await updateDoc(doc(db, 'users', userCredential.user.uid), {
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        console.log('📝 Updated user login timestamp');
      } catch (updateError) {
        console.warn('⚠️ Could not update login timestamp:', updateError);
        // Don't throw error for timestamp update failure
      }

      return userCredential.user;
    } catch (error: any) {
      console.error('❌ Login error details:', {
        code: error.code,
        message: error.message,
        fullError: error
      });
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/invalid-email':
          throw new Error('Invalid email address');
        case 'auth/user-disabled':
          throw new Error('This account has been disabled');
        case 'auth/user-not-found':
          throw new Error('No account found with this email');
        case 'auth/wrong-password':
          throw new Error('Incorrect password');
        case 'auth/too-many-requests':
          throw new Error('Too many failed attempts. Please try again later');
        case 'auth/network-request-failed':
          throw new Error('Network error. Please check your connection');
        case 'auth/internal-error':
          throw new Error('Internal server error. Please try again');
        default:
          console.log('🔍 Unhandled Firebase error code:', error.code);
          throw new Error(`Login failed: ${error.message}`);
      }
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout');
    }
  },

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  },
};