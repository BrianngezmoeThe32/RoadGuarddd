import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

interface Notification {
  id: string;
  title: string;
  body: string;
  data?: any;
  read: boolean;
  timestamp: Date;
  type: 'service_update' | 'payment' | 'promotion' | 'security' | 'system';
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  hasPermission: boolean;
  token: string | null;
  notificationError: string | null;
}

type NotificationAction =
  | { type: 'SET_PERMISSION'; payload: boolean }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'SET_ERROR'; payload: string | null };

interface NotificationContextType extends NotificationState {
  requestPermission: () => Promise<boolean>;
  sendLocalNotification: (title: string, body: string, data?: any) => Promise<void>;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  clearError: () => void;
  getUnreadNotifications: () => Notification[];
  getNotificationsByType: (type: Notification['type']) => Notification[];
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  hasPermission: false,
  token: null,
  notificationError: null,
};

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'SET_PERMISSION':
      return { ...state, hasPermission: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'ADD_NOTIFICATION':
      const newNotification = {
        ...action.payload,
        read: false,
        timestamp: new Date(),
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    case 'MARK_AS_READ':
      const updatedNotifications = state.notifications.map(notification =>
        notification.id === action.payload ? { ...notification, read: true } : notification
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.read).length,
      };
    case 'MARK_ALL_AS_READ':
      const allReadNotifications = state.notifications.map(notification => ({
        ...notification,
        read: true,
      }));
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0,
      };
    case 'REMOVE_NOTIFICATION':
      const filteredNotifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: filteredNotifications.filter(n => !n.read).length,
      };
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };
    case 'SET_ERROR':
      return { ...state, notificationError: action.payload };
    default:
      return state;
  }
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      const hasPermission = status === 'granted';
      dispatch({ type: 'SET_PERMISSION', payload: hasPermission });
      
      if (hasPermission) {
        // Get push token
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        dispatch({ type: 'SET_TOKEN', payload: token });
        console.log('Push token:', token);
      }
      
      return hasPermission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to request notification permission' });
      return false;
    }
  };

  const sendLocalNotification = async (title: string, body: string, data?: any): Promise<void> => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
        },
        trigger: null, // Send immediately
      });

      // Also add to local state
      const notification: Notification = {
        id: Date.now().toString(),
        title,
        body,
        data,
        read: false,
        timestamp: new Date(),
        type: data?.type || 'system',
      };
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    } catch (error) {
      console.error('Error sending local notification:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send notification' });
    }
  };

  const markAsRead = (notificationId: string): void => {
    dispatch({ type: 'MARK_AS_READ', payload: notificationId });
  };

  const markAllAsRead = (): void => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  };

  const removeNotification = (notificationId: string): void => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: notificationId });
  };

  const clearAllNotifications = (): void => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  };

  const clearError = (): void => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const getUnreadNotifications = (): Notification[] => {
    return state.notifications.filter(notification => !notification.read);
  };

  const getNotificationsByType = (type: Notification['type']): Notification[] => {
    return state.notifications.filter(notification => notification.type === type);
  };

  // Set up notification listeners
  useEffect(() => {
    requestPermission();

    // This listener is called whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
      const newNotification: Notification = {
        id: notification.request.identifier,
        title: notification.request.content.title || '',
        body: notification.request.content.body || '',
        data: notification.request.content.data,
        read: false,
        timestamp: new Date(),
        type: notification.request.content.data?.type || 'system',
      };
      dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
    });

    // This listener is called whenever a user taps on or interacts with a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
      const notification = response.notification;
      // Handle notification tap - you can navigate to specific screens based on data
      console.log('Notification tapped:', notification);
      
      // Mark as read when tapped
      if (notification.request.identifier) {
        dispatch({ type: 'MARK_AS_READ', payload: notification.request.identifier });
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const value: NotificationContextType = {
    ...state,
    requestPermission,
    sendLocalNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    clearError,
    getUnreadNotifications,
    getNotificationsByType,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};