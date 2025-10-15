import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { User, SystemLog, AnalyticsData } from '../types/admin';

export class AdminService {
  // Get all users
  static async getAllUsers(): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLogin: data.lastLogin?.toDate() || new Date(),
        } as User;
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Update user status
  static async updateUserStatus(userId: string, status: User['status']): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { 
        status,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  // Update user role
  static async updateUserRole(userId: string, role: User['role']): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { 
        role,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  // Get system logs
  static async getSystemLogs(limitCount: number = 100): Promise<SystemLog[]> {
    try {
      const logsRef = collection(db, 'systemLogs');
      const q = query(logsRef, orderBy('timestamp', 'desc'), limit(limitCount));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
        } as SystemLog;
      });
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  }

  // Get analytics data
  static async getAnalyticsData(): Promise<AnalyticsData> {
    try {
      const users = await this.getAllUsers();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const newUsersThisWeek = users.filter(user => 
        new Date(user.createdAt) > oneWeekAgo
      ).length;

      const serviceUsage = await this.getServiceUsageStats();
      const userActivity = await this.getUserActivity();

      return {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        newUsersThisWeek,
        /*totalServiceRequests: serviceUsage.reduce((total, service) => total + service.count, 0),*/
        serviceUsage,
        userActivity
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  private static async getServiceUsageStats() {
    // Implement based on your service tracking
    return [
      { serviceType: 'Emergency', count: 45 },
      { serviceType: 'Towing', count: 23 },
      { serviceType: 'Mechanic', count: 67 },
      { serviceType: 'Fuel', count: 12 },
    ];
  }

  private static async getUserActivity() {
    // Implement based on your activity tracking
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      date: day,
      activeUsers: Math.floor(Math.random() * 50) + 10,
      requests: Math.floor(Math.random() * 30) + 5,
    }));
  }
}