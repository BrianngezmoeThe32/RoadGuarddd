import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../constants/colors';

interface Job {
  id: string;
  serviceType: string;
  status: 'accepted' | 'in_progress' | 'completed';
  user: {
    name: string;
    phone: string;
    email: string;
  };
  vehicle: {
    make: string;
    model: string;
    color: string;
    licensePlate: string;
  };
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  details: {
    fuelAmount?: number;
    fuelType?: string;
    tireSize?: string;
    batteryType?: string;
    lockType?: string;
    towDistance?: number;
  };
  price: {
    base: number;
    additional: number;
    total: number;
  };
  specialInstructions?: string;
  createdAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
}

export default function JobDetails() {
  const { id } = useLocalSearchParams();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch job details
    setTimeout(() => {
      const mockJob: Job = {
        id: id as string,
        serviceType: 'Out of Gas',
        status: 'in_progress',
        user: {
          name: 'John Doe',
          phone: '(555) 123-4567',
          email: 'john.doe@example.com',
        },
        vehicle: {
          make: 'Toyota',
          model: 'Camry',
          color: 'Blue',
          licensePlate: 'ABC123',
        },
        location: {
          address: '123 Main Street, Downtown, City 12345',
          latitude: 40.7128,
          longitude: -74.0060,
        },
        details: {
          fuelAmount: 5,
          fuelType: 'Regular Unleaded',
        },
        price: {
          base: 30,
          additional: 15,
          total: 45,
        },
        specialInstructions: 'Car is on the shoulder near highway exit 5. Please call when 5 minutes away.',
        createdAt: '2023-09-23T14:30:00Z',
        acceptedAt: '2023-09-23T14:35:00Z',
        startedAt: '2023-09-23T14:45:00Z',
      };
      setJob(mockJob);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const updateJobStatus = (newStatus: Job['status']) => {
    if (!job) return;

    const updatedJob = { ...job, status: newStatus };
    
    // Add timestamps based on status change
    const now = new Date().toISOString();
    if (newStatus === 'in_progress' && !job.startedAt) {
      updatedJob.startedAt = now;
    } else if (newStatus === 'completed' && !job.completedAt) {
      updatedJob.completedAt = now;
    }

    setJob(updatedJob);
    
    Alert.alert('Success', `Job status updated to ${newStatus.replace('_', ' ')}`);
  };

  const callUser = () => {
    if (job) {
      Linking.openURL(`tel:${job.user.phone}`);
    }
  };

  const getDirections = () => {
    if (job) {
      const url = `https://maps.google.com/?q=${job.location.latitude},${job.location.longitude}`;
      Linking.openURL(url);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return COLORS.info;
      case 'in_progress': return COLORS.primary;
      case 'completed': return COLORS.success;
      default: return COLORS.gray;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Text>Loading job details...</Text>
        </View>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Not Found</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Icon name="error" size={64} color={COLORS.gray} />
          <Text style={styles.errorText}>Job not found</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Job Status Header */}
        <View style={styles.statusHeader}>
          <View style={styles.serviceType}>
            <Icon name="local-gas-station" size={32} color={COLORS.primary} />
            <Text style={styles.serviceTypeText}>{job.serviceType}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(job.status)}20` }]}>
            <Icon 
              name={job.status === 'in_progress' ? 'play-circle' : 'check-circle'} 
              size={16} 
              color={getStatusColor(job.status)} 
            />
            <Text style={[styles.statusText, { color: getStatusColor(job.status) }]}>
              {job.status.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={callUser}>
            <Icon name="phone" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={getDirections}>
            <Icon name="directions" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>
          {job.status === 'accepted' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.startButton]}
              onPress={() => updateJobStatus('in_progress')}
            >
              <Icon name="play-arrow" size={20} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Start Job</Text>
            </TouchableOpacity>
          )}
          {job.status === 'in_progress' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => updateJobStatus('completed')}
            >
              <Icon name="check" size={20} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Complete</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Icon name="person" size={20} color={COLORS.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{job.user.name}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color={COLORS.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{job.user.phone}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Icon name="email" size={20} color={COLORS.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{job.user.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Vehicle Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.vehicleGrid}>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleLabel}>Make & Model</Text>
                <Text style={styles.vehicleValue}>{job.vehicle.make} {job.vehicle.model}</Text>
              </View>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleLabel}>Color</Text>
                <Text style={styles.vehicleValue}>{job.vehicle.color}</Text>
              </View>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleLabel}>License Plate</Text>
                <Text style={styles.vehicleValue}>{job.vehicle.licensePlate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Icon name="location-on" size={20} color={COLORS.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{job.location.address}</Text>
              </View>
            </View>
            
            {job.details.fuelAmount && (
              <View style={styles.infoRow}>
                <Icon name="local-gas-station" size={20} color={COLORS.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Fuel Requested</Text>
                  <Text style={styles.infoValue}>
                    {job.details.fuelAmount} gallons of {job.details.fuelType}
                  </Text>
                </View>
              </View>
            )}

            {job.details.tireSize && (
              <View style={styles.infoRow}>
                <Icon name="build" size={20} color={COLORS.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Tire Size</Text>
                  <Text style={styles.infoValue}>{job.details.tireSize}</Text>
                </View>
              </View>
            )}

            {job.specialInstructions && (
              <View style={styles.infoRow}>
                <Icon name="info" size={20} color={COLORS.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Special Instructions</Text>
                  <Text style={styles.infoValue}>{job.specialInstructions}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.pricingCard}>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Base Rate</Text>
              <Text style={styles.pricingValue}>${job.price.base}</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Additional Charges</Text>
              <Text style={styles.pricingValue}>${job.price.additional}</Text>
            </View>
            <View style={[styles.pricingRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${job.price.total}</Text>
            </View>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.timelineCard}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.completedDot]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Request Received</Text>
                <Text style={styles.timelineTime}>{new Date(job.createdAt).toLocaleString()}</Text>
              </View>
            </View>
            
            {job.acceptedAt && (
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.completedDot]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Job Accepted</Text>
                  <Text style={styles.timelineTime}>{new Date(job.acceptedAt).toLocaleString()}</Text>
                </View>
              </View>
            )}

            {job.startedAt && (
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.completedDot]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Job Started</Text>
                  <Text style={styles.timelineTime}>{new Date(job.startedAt).toLocaleString()}</Text>
                </View>
              </View>
            )}

            {job.completedAt ? (
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.completedDot]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Job Completed</Text>
                  <Text style={styles.timelineTime}>{new Date(job.completedAt).toLocaleString()}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.pendingDot]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Job Completion</Text>
                  <Text style={styles.timelineTime}>Pending</Text>
                </View>
              </View>
            )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray,
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  serviceType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceTypeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  startButton: {
    backgroundColor: COLORS.success,
  },
  completeButton: {
    backgroundColor: COLORS.success,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.primary,
    lineHeight: 20,
  },
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  vehicleInfo: {
    width: '50%',
    marginBottom: 16,
  },
  vehicleLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  vehicleValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  pricingCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pricingLabel: {
    fontSize: 16,
    color: COLORS.gray,
  },
  pricingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  timelineCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  completedDot: {
    backgroundColor: COLORS.success,
  },
  pendingDot: {
    backgroundColor: COLORS.lightGray,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  timelineTime: {
    fontSize: 14,
    color: COLORS.gray,
  },
});