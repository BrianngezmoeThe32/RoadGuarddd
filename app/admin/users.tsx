import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colors';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalServices: number;
  status: 'active' | 'suspended';
}

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      joinDate: '2023-01-15',
      totalServices: 12,
      status: 'active',
    },
    {
      id: '2',
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      phone: '(555) 987-6543',
      joinDate: '2023-02-20',
      totalServices: 8,
      status: 'active',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '(555) 456-7890',
      joinDate: '2023-03-10',
      totalServices: 3,
      status: 'suspended',
    },
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, status: newStatus as any } : user
    ));
    
    Alert.alert('Success', `User ${newStatus === 'active' ? 'activated' : 'suspended'}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Management</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{users.length}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {users.filter(u => u.status === 'active').length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {users.filter(u => u.status === 'suspended').length}
            </Text>
            <Text style={styles.statLabel}>Suspended</Text>
          </View>
        </View>

        <View style={styles.usersList}>
          {filteredUsers.map(user => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  user.status === 'active' ? styles.activeBadge : styles.suspendedBadge
                ]}>
                  <Text style={styles.statusText}>
                    {user.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.userDetails}>
                <View style={styles.detailRow}>
                  <Icon name="phone" size={16} color={COLORS.gray} />
                  <Text style={styles.detailText}>{user.phone}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="calendar-today" size={16} color={COLORS.gray} />
                  <Text style={styles.detailText}>Joined {user.joinDate}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="miscellaneous-services" size={16} color={COLORS.gray} />
                  <Text style={styles.detailText}>{user.totalServices} services</Text>
                </View>
              </View>

              <View style={styles.userActions}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    user.status === 'active' ? styles.suspendButton : styles.activateButton
                  ]}
                  onPress={() => toggleUserStatus(user.id, user.status)}
                >
                  <Text style={styles.actionButtonText}>
                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a365d',
    elevation: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  usersList: {
    gap: 12,
    paddingBottom: 24,
  },
  userCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.gray,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#C6F6D5',
  },
  suspendedBadge: {
    backgroundColor: '#FED7D7',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  userDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 8,
  },
  userActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  suspendButton: {
    backgroundColor: '#FED7D7',
  },
  activateButton: {
    backgroundColor: '#C6F6D5',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray,
  },
});