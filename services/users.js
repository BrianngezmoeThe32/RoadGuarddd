import ApiService from './api';
import { getAuth } from 'firebase/auth';

class UserService {
  static async updateUserLocation(location) {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No user logged in');
      }

      await ApiService.updateDocument('users', user.uid, {
        lastKnownLocation: {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          timestamp: new Date()
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error updating user location:', error);
      throw error;
    }
  }

  static async getUserProfile() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No user logged in');
      }

      return await ApiService.getDocument('users', user.uid);
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }
}

export default UserService;