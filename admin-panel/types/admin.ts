export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'super_admin';
  status: 'active' | 'suspended' | 'banned';
  createdAt: Date;
  lastLogin: Date;
  usageStats: {
    loginCount: number;
    serviceRequests: number;
    lastActive: Date;
  };
}

export interface SystemLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: Date;
  details: any;
  ipAddress?: string;
}

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newUsersThisWeek: number;
  serviceUsage: {
    serviceType: string;
    count: number;
  }[];
  userActivity: {
    date: string;
    activeUsers: number;
    requests: number;
  }[];
}