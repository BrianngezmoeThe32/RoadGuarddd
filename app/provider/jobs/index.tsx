import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../constants/colors';

interface Job {
  id: string;
  serviceType: string;
  status: 'accepted' | 'in_progress' | 'completed';
  user: {
    name: string;
    phone: string;
  };
  vehicle: string;
  location: string;
  price: number;
  distance: number;
  scheduledTime?: string;
  specialInstructions?: string;
  createdAt: string;
}

export default function ActiveJobs() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'scheduled'>('active');

  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      serviceType: 'Out of Gas',
      status: 'in_progress',
      user: {
        name: 'John Doe',
        phone: '(555) 123-4567',
      },
      vehicle: 'Toyota Camry - Blue - ABC123',
      location: '123 Main St, Downtown',
      price: 45,
      distance: 2.5,
      specialInstructions: 'Car is on the shoulder of highway exit 5',
      createdAt: '30 min ago',
    },
    {
      id: '2',
      serviceType: 'Tire Change',
      status: 'accepted',
      user: {
        name: 'Sarah Smith',
        phone: '(555) 987-6543',
      },
      vehicle: 'Honda Civic - Red - XYZ789',
      location: '456 Oak Avenue',
      price: 60,
      distance: 1.2,
      scheduledTime: '2:00 PM Today',
      createdAt: '15 min ago',
    },
    {
      id: '3',
      serviceType: 'Jump Start',
      status: 'accepted',
      user: {
        name: 'Mike Johnson',
        phone: '(555) 456-7890',
      },
      vehicle: 'Ford F-150 - Black - DEF456',
      location: '789 Parking Garage, Level 3',
      price: 35,
      distance: 3.1,
      createdAt: '5 min ago',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return COLORS.info;
      case 'in_progress': return COLORS.primary;
      case 'completed': return COLORS.success;
      default: return COLORS.gray;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return 'check-circle';
      case 'in_progress': return 'play-circle';
      case 'completed': return 'check-circle';
      default: return 'schedule';
    }
  };

  const updateJobStatus = (jobId: string, newStatus: Job['status']) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: newStatus } : job
    ));
  };

  const filteredJobs = jobs.filter(job => 
    activeTab === 'active' 
      ? job.status !== 'completed'
      : job.scheduledTime
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Jobs</Text>
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={() => router.push('/provider/jobs/history')}
        >
          <Icon name="history" size={20} color={COLORS.primaryLight} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active Jobs
          </Text>
          <View style={[styles.tabBadge, activeTab === 'active' && styles.activeTabBadge]}>
            <Text style={styles.tabBadgeText}>
              {jobs.filter(job => job.status !== 'completed').length}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'scheduled' && styles.activeTab]}
          onPress={() => setActiveTab('scheduled')}
        >
          <Text style={[styles.tabText, activeTab === 'scheduled' && styles.activeTabText]}>
            Scheduled
          </Text>
          <View style={[styles.tabBadge, activeTab === 'scheduled' && styles.activeTabBadge]}>
            <Text style={styles.tabBadgeText}>
              {jobs.filter(job => job.scheduledTime).length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon 
              name={activeTab === 'active' ? 'miscellaneous-services' : 'schedule'} 
              size={64} 
              color={COLORS.gray} 
            />
            <Text style={styles.emptyTitle}>
              {activeTab === 'active' ? 'No Active Jobs' : 'No Scheduled Jobs'}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === 'active' 
                ? 'New job requests will appear here when you\'re online'
                : 'You don\'t have any scheduled jobs'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.jobsList}>
            {filteredJobs.map(job => (
              <TouchableOpacity
                key={job.id}
                style={styles.jobCard}
                onPress={() => router.push(`/provider/jobs/${job.id}`)}
              >
                <View style={styles.jobHeader}>
                  <View style={styles.serviceInfo}>
                    <View style={[
                      styles.statusIndicator,
                      { backgroundColor: getStatusColor(job.status) }
                    ]} />
                    <View>
                      <Text style={styles.serviceType}>{job.serviceType}</Text>
                      <Text style={styles.jobPrice}>${job.price}</Text>
                    </View>
                  </View>
                  <View style={styles.statusBadge}>
                    <Icon 
                      name={getStatusIcon(job.status)} 
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

                <View style={styles.jobDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="person" size={16} color={COLORS.gray} />
                    <Text style={styles.detailText}>{job.user.name}</Text>
                    <Text style={styles.phoneText}>{job.user.phone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="directions-car" size={16} color={COLORS.gray} />
                    <Text style={styles.detailText}>{job.vehicle}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="location-on" size={16} color={COLORS.gray} />
                    <Text style={styles.detailText}>{job.location}</Text>
                    <Text style={styles.distanceText}>{job.distance} mi</Text>
                  </View>
                  {job.scheduledTime && (
                    <View style={styles.detailRow}>
                      <Icon name="schedule" size={16} color={COLORS.gray} />
                      <Text style={styles.detailText}>Scheduled: {job.scheduledTime}</Text>
                    </View>
                  )}
                  {job.specialInstructions && (
                    <View style={styles.detailRow}>
                      <Icon name="info" size={16} color={COLORS.gray} />
                      <Text style={styles.detailText} numberOfLines={1}>
                        {job.specialInstructions}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.jobFooter}>
                  <Text style={styles.timeText}>{job.createdAt}</Text>
                  <View style={styles.actionButtons}>
                    {job.status === 'accepted' && (
                      <TouchableOpacity
                        style={styles.startButton}
                        onPress={() => updateJobStatus(job.id, 'in_progress')}
                      >
                        <Text style={styles.startButtonText}>Start Job</Text>
                      </TouchableOpacity>
                    )}
                    {job.status === 'in_progress' && (
                      <TouchableOpacity
                        style={styles.completeButton}
                        onPress={() => updateJobStatus(job.id, 'completed')}
                      >
                        <Text style={styles.completeButtonText}>Complete</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => router.push(`/provider/jobs/${job.id}`)}
                    >
                      <Text style={styles.detailsButtonText}>Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  historyButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
    marginRight: 8,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  tabBadge: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeTabBadge: {
    backgroundColor: COLORS.primary,
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  jobsList: {
    padding: 16,
    gap: 12,
  },
  jobCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  serviceType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  jobPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  jobDetails: {
    padding: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 8,
  },
  phoneText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  distanceText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  completeButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  detailsButtonText: {
    color: COLORS.gray,
    fontSize: 12,
    fontWeight: '600',
  },
});