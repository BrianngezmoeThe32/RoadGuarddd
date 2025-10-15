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

  // Register new user
  async registerUser(
    email: string, 
    password: string, 
    userData: {
      firstName: string;
      lastName: string;
      phone: string;
    }
  ): Promise<FirebaseUser> {
    try {
      console.log('👤 Registering new user:', email);
      
      // Create auth user
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('✅ Auth user created:', user.uid);

      // Create user document in Firestore using UserWrite type
      const userDoc: UserWrite = {
        id: user.uid,
        email,
        phone: userData.phone,
        profile: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          photoURL: null,
        },
        vehicles: [],
        familyMembers: [],
        settings: {
          notifications: true,
          emergencyAlerts: true,
          biometricAuth: false,
          language: 'en',
        },
        stats: {
          totalServices: 0,
          completedServices: 0,
          cancelledServices: 0,
          averageRating: 0,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', user.uid), userDoc);
      console.log('✅ User document created in Firestore');

      // Update Firebase auth profile
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`,
      });

      console.log('✅ User profile updated');
      return user;
    } catch (error: any) {
      console.error('❌ Registration error details:', {
        code: error.code,
        message: error.message,
        fullError: error
      });
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('An account with this email already exists');
        case 'auth/invalid-email':
          throw new Error('Invalid email address');
        case 'auth/weak-password':
          throw new Error('Password should be at least 6 characters');
        case 'auth/operation-not-allowed':
          throw new Error('Email/password accounts are not enabled');
        case 'auth/network-request-failed':
          throw new Error('Network error. Please check your connection');
        default:
          throw new Error(`Registration failed: ${error.message}`);
      }
    }
  },

  // Get user profile data
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      console.log('📖 Getting user profile for:', userId);
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log('✅ User profile found');
        
        // Convert Firestore Timestamp to Date if needed
        const user: User = {
          id: userDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
          lastLoginAt: data.lastLoginAt?.toDate?.() || data.lastLoginAt,
        } as User;
        
        return user;
      }
      
      console.log('❌ User profile not found');
      return null;
    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      throw new Error('Failed to load user profile');
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      console.log('📝 Updating user profile for:', userId);
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      console.log('✅ User profile updated successfully');
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  },

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      console.log('📧 Sending password reset email to:', email);
      await sendPasswordResetEmail(auth, email);
      console.log('✅ Password reset email sent');
    } catch (error: any) {
      console.error('❌ Password reset error:', error);
      
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('No account found with this email');
        case 'auth/invalid-email':
          throw new Error('Invalid email address');
        case 'auth/network-request-failed':
          throw new Error('Network error. Please check your connection');
        default:
          throw new Error('Failed to send reset email. Please try again');
      }
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      console.log('🚪 Logging out user');
      await signOut(auth);
      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw new Error('Failed to logout');
    }
  },

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    const user = auth.currentUser;
    console.log('👤 Current user:', user?.uid || 'No user logged in');
    return user;
  },
};