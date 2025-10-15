import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { User } from '../types/admin';
import { AdminService } from '../services/adminService';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await AdminService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: User['status']) => {
    try {
      await AdminService.updateUserStatus(userId, newStatus);
      Alert.alert('Success', 'User status updated');
      loadUsers(); // Refresh the list
    } catch (error) {
      Alert.alert('Error', 'Failed to update user status');
    }
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userRole}>Role: {item.role}</Text>
        <Text style={styles.userStatus}>Status: {item.status}</Text>
        <Text style={styles.lastLogin}>
          Last Login: {item.lastLogin.toLocaleDateString()}
        </Text>
      </View>
      
      <View style={styles.actions}>
        {item.status === 'active' && (
          <>
            <TouchableOpacity 
              style={[styles.button, styles.suspendButton]}
              onPress={() => handleStatusChange(item.id, 'suspended')}
            >
              <Text style={styles.buttonText}>Suspend</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.banButton]}
              onPress={() => handleStatusChange(item.id, 'banned')}
            >
              <Text style={styles.buttonText}>Ban</Text>
            </TouchableOpacity>
          </>
        )}
        {(item.status === 'suspended' || item.status === 'banned') && (
          <TouchableOpacity 
            style={[styles.button, styles.activateButton]}
            onPress={() => handleStatusChange(item.id, 'active')}
          >
            <Text style={styles.buttonText}>Activate</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return <Text>Loading users...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Management</Text>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  lastLogin: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  suspendButton: {
    backgroundColor: '#ffa500',
  },
  banButton: {
    backgroundColor: '#ff4444',
  },
  activateButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});