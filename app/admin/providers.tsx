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

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string[];
  status: 'pending' | 'approved' | 'rejected';
  rating: number;
  totalServices: number;
  joinDate: string;
}

export default function AdminProviders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [providers, setProviders] = useState<Provider[]>([
    {
      id: '1',
      name: 'Mike Tow Services',
      email: 'mike@tow.com',
      phone: '(555) 111-2233',
      serviceType: ['Towing', 'Tire Change'],
      status: 'approved',
      rating: 4.8,
      totalServices: 47,
      joinDate: '2023-01-10',
    },
    {
      id: '2',
      name: 'City Gas Delivery',
      email: 'contact@citygas.com',
      phone: '(555) 222-3344',
      serviceType: ['Out of Gas'],
      status: 'approved',
      rating: 4.5,
      totalServices: 32,
      joinDate: '2023-02-15',
    },
    {
      id: '3',
      name: 'Quick Lockout Help',
      email: 'help@quicklock.com',
      phone: '(555) 333-4455',
      serviceType: ['Lockout Service'],
      status: 'pending',
      rating: 0,
      totalServices: 0,
      joinDate: '2023-09-20',
    },
  ]);

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateProviderStatus = (providerId: string, newStatus: 'approved' | 'rejected') => {
    setProviders(prev => prev.map(provider =>
      provider.id === providerId ? { ...provider, status: newStatus } : provider
    ));
    
    Alert.alert('Success', `Provider ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return COLORS.success;
      case 'pending': return COLORS.warning;
      case 'rejected': return COLORS.danger;
      default: return COLORS.gray;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Provider Management</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search providers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{providers.length}</Text>
            <Text style={styles.statLabel}>Total Providers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {providers.filter(p => p.status === 'approved').length}
            </Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {providers.filter(p => p.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        <View style={styles.providersList}>
          {filteredProviders.map(provider => (
            <View key={provider.id} style={styles.providerCard}>
              <View style={styles.providerHeader}>
                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <Text style={styles.providerEmail}>{provider.email}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(provider.status)}20` }
                ]}>
                  <Text style={[styles.statusText, { color: getStatusColor(provider.status) }]}>
                    {provider.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.providerDetails}>
                <View style={styles.detailRow}>
                  <Icon name="phone" size={16} color={COLORS.gray} />
                  <Text style={styles.detailText}>{provider.phone}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="calendar-today" size={16} color={COLORS.gray} />
                  <Text style={styles.detailText}>Joined {provider.joinDate}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="star" size={16} color="#FFD700" />
                  <Text style={styles.detailText}>
                    {provider.rating > 0 ? provider.rating : 'No rating'} • {provider.totalServices} services
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="miscellaneous-services" size={16} color={COLORS.gray} />
                  <Text style={styles.detailText}>
                    {provider.serviceType.join(', ')}
                  </Text>
                </View>
              </View>

              {provider.status === 'pending' && (
                <View style={styles.pendingActions}>
                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => updateProviderStatus(provider.id, 'approved')}
                  >
                    <Icon name="check" size={16} color={COLORS.white} />
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => updateProviderStatus(provider.id, 'rejected')}
                  >
                    <Icon name="close" size={16} color={COLORS.white} />
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}

              {provider.status !== 'pending' && (
                <View style={styles.providerActions}>
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.servicesButton}>
                    <Text style={styles.servicesButtonText}>Services</Text>
                  </TouchableOpacity>
                </View>
              )}
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
  providersList: {
    gap: 12,
    paddingBottom: 24,
  },
  providerCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  providerEmail: {
    fontSize: 14,
    color: COLORS.gray,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  providerDetails: {
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
  pendingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 8,
  },
  approveButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.danger,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 8,
  },
  rejectButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  providerActions: {
    flexDirection: 'row',
    gap: 12,
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
  servicesButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  servicesButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
});