import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colors';

// Define proper types
interface ProviderStats {
  businessName: string;
  status: 'approved' | 'pending' | 'rejected';
  availability: 'available' | 'busy' | 'offline';
  rating: number;
  totalJobs: number;
  earnings: number;
  currentJob: string | null;
}


interface Job {
  id: string;
  serviceType: string;
  distance: number;
  price: number;
  user: string;
  vehicle: string;
  fuelAmount?: number;
  tireSize?: string;
  createdAt: string;
}

export default function ProviderDashboard() {
  const [provider, setProvider] = useState<{
    businessName: string;
    status: 'approved';
    availability: 'available' | 'busy';
    rating: number;
    totalJobs: number;
    earnings: number;
    currentJob: string | null;
  }>({
    businessName: 'City Tow Services',
    status: 'approved',
    availability: 'available',
    rating: 4.8,
    totalJobs: 147,
    earnings: 12560,
    currentJob: null,
  });

  const [availableJobs, setAvailableJobs] = useState<Job[]>([
    {
      id: '1',
      serviceType: 'Out of Gas',
      distance: 2.5,
      price: 35,
      user: 'John Doe',
      vehicle: 'Toyota Camry',
      fuelAmount: 5,
      createdAt: '5 min ago',
    },
    {
      id: '2',
      serviceType: 'Tire Change',
      distance: 1.2,
      price: 50,
      user: 'Sarah Smith',
      vehicle: 'Honda Civic',
      tireSize: '195/65R15',
      createdAt: '8 min ago',
    },
  ]);

  const toggleAvailability = () => {
    const newStatus = provider.availability === 'available' ? 'busy' : 'available';
    setProvider(prev => ({ ...prev, availability: newStatus }));
    Alert.alert('Status Updated', `You are now ${newStatus}`);
  };

  const acceptJob = (jobId: string) => {
    Alert.alert(
      'Accept Job',
      'Are you sure you want to accept this service request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            setAvailableJobs(prev => prev.filter(job => job.id !== jobId));
            setProvider(prev => ({ ...prev, currentJob: jobId }));
            router.push(`/provider/jobs/${jobId}`);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="local-shipping" size={28} color={COLORS.white} />
          <Text style={styles.headerTitle}>Provider Dashboard</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
        >
          <Icon name="person" size={20} color={COLORS.primaryLight} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Provider Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.businessName}>{provider.businessName}</Text>
            <View style={[styles.statusBadge, 
              provider.availability === 'available' ? styles.availableBadge : styles.busyBadge
            ]}>
              <Text style={styles.statusText}>
                {provider.availability.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{provider.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{provider.totalJobs}</Text>
              <Text style={styles.statLabel}>Jobs</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>${provider.earnings}</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.availabilityButton,
              provider.availability === 'available' ? styles.availableButton : styles.busyButton
            ]}
            onPress={toggleAvailability}
          >
            <Icon 
              name={provider.availability === 'available' ? 'pause' : 'play-arrow'} 
              size={20} 
              color={COLORS.white} 
            />
            <Text style={styles.availabilityText}>
              {provider.availability === 'available' ? 'Go Offline' : 'Go Online'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Available Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Jobs</Text>
            <Text style={styles.jobCount}>{availableJobs.length} available</Text>
          </View>
          
          {availableJobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="miscellaneous-services" size={48} color={COLORS.gray} />
              <Text style={styles.emptyText}>No available jobs</Text>
              <Text style={styles.emptySubtext}>New requests will appear here</Text>
            </View>
          ) : (
            <View style={styles.jobsList}>
              {availableJobs.map(job => (
                <TouchableOpacity
                  key={job.id}
                  style={styles.jobCard}
                  onPress={() => acceptJob(job.id)}
                >
                  <View style={styles.jobHeader}>
                    <View style={styles.serviceType}>
                      <Icon name="local-gas-station" size={20} color={COLORS.primary} />
                      <Text style={styles.serviceText}>{job.serviceType}</Text>
                    </View>
                    <Text style={styles.jobPrice}>${job.price}</Text>
                  </View>
                  
                  <View style={styles.jobDetails}>
                    <View style={styles.detailRow}>
                      <Icon name="person" size={16} color={COLORS.gray} />
                      <Text style={styles.detailText}>{job.user}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Icon name="directions-car" size={16} color={COLORS.gray} />
                      <Text style={styles.detailText}>{job.vehicle}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Icon name="location-on" size={16} color={COLORS.gray} />
                      <Text style={styles.detailText}>{job.distance} miles away</Text>
                    </View>
                    {job.fuelAmount && (
                      <View style={styles.detailRow}>
                        <Icon name="local-gas-station" size={16} color={COLORS.gray} />
                        <Text style={styles.detailText}>{job.fuelAmount} gallons</Text>
                      </View>
                    )}
                    {job.tireSize && (
                      <View style={styles.detailRow}>
                        <Icon name="build" size={16} color={COLORS.gray} />
                        <Text style={styles.detailText}>Tire: {job.tireSize}</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.jobFooter}>
                    <Text style={styles.jobTime}>{job.createdAt}</Text>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => acceptJob(job.id)}
                    >
                      <Text style={styles.acceptButtonText}>Accept Job</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/provider/jobs')}
            >
              <Icon name="history" size={24} color={COLORS.primary} />
              <Text style={styles.actionText}>Job History</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/provider/earnings')}
            >
              <Icon name="attach-money" size={24} color={COLORS.primary} />
              <Text style={styles.actionText}>Earnings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Icon name="schedule" size={24} color={COLORS.primary} />
              <Text style={styles.actionText}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Icon name="support" size={24} color={COLORS.primary} />
              <Text style={styles.actionText}>Support</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: COLORS.primary,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  profileButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: '#C6F6D5',
  },
  busyBadge: {
    backgroundColor: '#FED7D7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
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
  availabilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  availableButton: {
    backgroundColor: COLORS.success,
  },
  busyButton: {
    backgroundColor: COLORS.danger,
  },
  availabilityText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  jobCount: {
    fontSize: 14,
    color: COLORS.gray,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 8,
    textAlign: 'center',
  },
  jobsList: {
    gap: 12,
  },
  jobCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 8,
  },
  jobPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  jobDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 8,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  acceptButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 8,
  },
});