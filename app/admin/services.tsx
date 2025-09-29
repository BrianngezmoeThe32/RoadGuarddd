import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colors';

interface ServiceRequest {
  id: string;
  userId: string;
  userName: string;
  serviceType: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  providerName?: string;
  price: number;
  createdAt: string;
  location: string;
}

export default function AdminServices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const [services, setServices] = useState<ServiceRequest[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      serviceType: 'Out of Gas',
      status: 'in_progress',
      providerName: 'City Gas Delivery',
      price: 45,
      createdAt: '2023-09-23 14:30',
      location: '123 Main St',
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Sarah Smith',
      serviceType: 'Tire Change',
      status: 'pending',
      price: 60,
      createdAt: '2023-09-23 14:25',
      location: '456 Oak Ave',
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Mike Johnson',
      serviceType: 'Jump Start',
      status: 'completed',
      providerName: 'Quick Battery Help',
      price: 35,
      createdAt: '2023-09-23 14:15',
      location: '789 Pine Rd',
    },
  ]);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && service.status !== 'completed';
    if (filter === 'completed') return matchesSearch && service.status === 'completed';
    
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return COLORS.warning;
      case 'accepted': return COLORS.info;
      case 'in_progress': return COLORS.primary;
      case 'completed': return COLORS.success;
      case 'cancelled': return COLORS.danger;
      default: return COLORS.gray;
    }
  };

  const getStatusText = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Management</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All Services
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
          onPress={() => setFilter('active')}
        >
          <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{services.length}</Text>
            <Text style={styles.statLabel}>Total Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {services.filter(s => s.status !== 'completed').length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {services.filter(s => s.status === 'completed').length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.servicesList}>
          {filteredServices.map(service => (
            <View key={service.id} style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceType}>{service.serviceType}</Text>
                  <Text style={styles.userName}>{service.userName}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(service.status)}20` }
                ]}>
                  <Text style={[styles.statusText, { color: getStatusColor(service.status) }]}>
                    {getStatusText(service.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.serviceDetails}>
                <View style={styles.detailRow}>
                  <Icon name="schedule" size={16} color={COLORS.gray} />
                  <Text style={styles.detailText}>{service.createdAt}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="location-on" size={16} color={COLORS.gray} />
                  <Text style={styles.detailText}>{service.location}</Text>
                </View>
                {service.providerName && (
                  <View style={styles.detailRow}>
                    <Icon name="engineering" size={16} color={COLORS.gray} />
                    <Text style={styles.detailText}>{service.providerName}</Text>
                  </View>
                )}
              </View>

              <View style={styles.serviceFooter}>
                <Text style={styles.price}>${service.price}</Text>
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  filterButtonActive: {
    borderBottomColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.primary,
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
  servicesList: {
    gap: 12,
    paddingBottom: 24,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  userName: {
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
  serviceDetails: {
    gap: 8,
    marginBottom: 12,
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
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  viewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  viewButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
});