import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
  const router = useRouter();
  const { user, userRole, logout } = useAuth();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: 'speedometer',
      route: '/admin-panel/dashboard',
      roles: ['admin', 'super_admin'],
    },
    {
      title: 'User Management',
      icon: 'people',
      route: '/admin-panel/users',
      roles: ['admin', 'super_admin'],
    },
    {
      title: 'Analytics',
      icon: 'analytics',
      route: '/admin-panel/analytics',
      roles: ['admin', 'super_admin'],
    },
    {
      title: 'System Logs',
      icon: 'list',
      route: '/admin-panel/logs',
      roles: ['admin', 'super_admin'],
    },
    {
      title: 'Settings',
      icon: 'settings',
      route: '/admin-panel/settings',
      roles: ['super_admin'],
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route as any);
    onClose();
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/home');
          }
        },
      ]
    );
  };

  const handleBackToApp = () => {
    router.push('/home');
    onClose();
  };

  if (!isVisible) return null;

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(userRole || 'user')
  );

  return (
    <View style={styles.container}>
      {/* Overlay */}
      <TouchableOpacity style={styles.overlay} onPress={onClose} />
      
      {/* Sidebar Content */}
      <View style={styles.sidebar}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#fff" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {user?.displayName || 'Admin User'}
              </Text>
              <Text style={styles.userEmail}>
                {user?.email}
              </Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>
                  {userRole === 'super_admin' ? 'Super Admin' : 'Admin'}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
          {filteredMenuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleNavigation(item.route)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={20} color="#007AFF" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={handleBackToApp}
          >
            <Ionicons name="arrow-back" size={20} color="#666" />
            <Text style={styles.footerButtonText}>Back to App</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.footerButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color="#FF3B30" />
            <Text style={[styles.footerButtonText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: 300,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 10,
    color: '#1976D2',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  closeButton: {
    padding: 4,
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 8,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  logoutButton: {
    marginTop: 8,
  },
  footerButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  logoutText: {
    color: '#FF3B30',
  },
});