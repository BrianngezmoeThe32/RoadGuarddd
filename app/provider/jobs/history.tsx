import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../constants/colors';

interface JobHistory {
  id: string;
  serviceType: string;
  status: 'completed' | 'cancelled';
  user: {
    name: string;
  };
  vehicle: string;
  location: string;
  price: number;
  date: string;
  rating?: number;
  feedback?: string;
}

export default function JobHistory() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');

  const [jobHistory, setJobHistory] = useState<JobHistory[]>([
    {
      id: '1',
      serviceType: 'Out of Gas',
      status: 'completed',
      user: {
        name: 'John Doe',
      },
      vehicle: 'Toyota Camry',
      location: '123 Main St',
      price: 45,
      date: '2023-09-22',
      rating: 5,
      feedback: 'Great service, arrived quickly!',
    },
    {
      id: '2',
      serviceType: 'Tire Change',
      status: 'completed',
      user: {
        name: 'Sarah Smith',
      },
      vehicle: 'Honda Civic',
      location: '456 Oak Ave',
      price: 60,
      date: '2023-09-21',
      rating: 4,
    },
    {
      id: '3',
      serviceType: 'Jump Start',
      status: 'completed',
      user: {
        name: 'Mike Johnson',
      },
      vehicle: 'Ford F-150',
      location: '789 Pine Rd',
      price: 35,
      date: '2023-09-20',
      rating: 5,
      feedback: 'Very professional and efficient',
    },
    {
      id: '4',
      serviceType: 'Lockout Service',
      status: 'cancelled',
      user: {
        name: 'Emily Davis',
      },
      vehicle: 'BMW 3 Series',
      location: '321 Elm St',
      price: 0,
      date: '2023-09-19',
    },
    {
      id: '5',
      serviceType: 'Towing',
      status: 'completed',
      user: {
        name: 'Robert Wilson',
      },
      vehicle: 'Chevrolet Silverado',
      location: '654 Maple Dr',
      price: 120,
      date: '2023-09-18',
      rating: 5,
      feedback: 'Saved me in a tough situation, thank you!',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const filteredHistory = jobHistory.filter(job => {
    const matchesSearch = job.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && job.status === filter;
  });

  const getStatusColor = (status: string) => {
    return status === 'completed' ? COLORS.success : COLORS.danger;
  };

  const getTotalEarnings = () => {
    return jobHistory
      .filter(job => job.status === 'completed')
      .reduce((total, job) => total + job.price, 0);
  };

  const getAverageRating = () => {
    const ratedJobs = jobHistory.filter(job => job.rating);
    if (ratedJobs.length === 0) return 0;
    return ratedJobs.reduce((sum, job) => sum + (job.rating || 0), 0) / ratedJobs.length;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job History</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{jobHistory.length}</Text>
          <Text style={styles.statLabel}>Total Jobs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>${getTotalEarnings()}</Text>
          <Text style={styles.statLabel}>Earnings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{getAverageRating().toFixed(1)}</Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
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
        <TouchableOpacity
          style={[styles.filterButton, filter === 'cancelled' && styles.filterButtonActive]}
          onPress={() => setFilter('cancelled')}
        >
          <Text style={[styles.filterText, filter === 'cancelled' && styles.filterTextActive]}>
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="history" size={64} color={COLORS.gray} />
            <Text style={styles.emptyTitle}>No Jobs Found</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Try adjusting your search terms' : 'Your job history will appear here'}
            </Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {filteredHistory.map(job => (
              <TouchableOpacity
                key={job.id}
                style={styles.historyCard}
                onPress={() => router.push(`/provider/jobs/${job.id}`)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceType}>{job.serviceType}</Text>
                    <Text style={styles.customerName}>{job.user.name}</Text>
                  </View>
                  <View style={styles.statusPrice}>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(job.status)}20` }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(job.status) }]}>
                        {job.status.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.price}>${job.price}</Text>
                  </View>
                </View>

                <View style={styles.cardDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="directions-car" size={14} color={COLORS.gray} />
                    <Text style={styles.detailText}>{job.vehicle}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="location-on" size={14} color={COLORS.gray} />
                    <Text style={styles.detailText}>{job.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="calendar-today" size={14} color={COLORS.gray} />
                    <Text style={styles.detailText}>{formatDate(job.date)}</Text>
                  </View>
                </View>

                {job.rating && (
                  <View style={styles.ratingSection}>
                    <View style={styles.rating}>
                      <Icon name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>{job.rating}/5</Text>
                    </View>
                    {job.feedback && (
                      <Text style={styles.feedbackText} numberOfLines={2}>
                        "{job.feedback}"
                      </Text>
                    )}
                  </View>
                )}

                {job.status === 'cancelled' && (
                  <View style={styles.cancelledSection}>
                    <Icon name="cancel" size={16} color={COLORS.danger} />
                    <Text style={styles.cancelledText}>Service was cancelled</Text>
                  </View>
                )}
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
  placeholder: {
    width: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    elevation: 2,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
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
    paddingBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.white,
    elevation: 1,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
  },
  filterTextActive: {
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
  historyList: {
    padding: 16,
    gap: 12,
  },
  historyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
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
  customerName: {
    fontSize: 14,
    color: COLORS.gray,
  },
  statusPrice: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  cardDetails: {
    padding: 16,
    gap: 8,
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
  ratingSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: '#F8F9FA',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 4,
  },
  feedbackText: {
    fontSize: 14,
    color: COLORS.gray,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  cancelledSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: '#FFF5F5',
  },
  cancelledText: {
    fontSize: 14,
    color: COLORS.danger,
    marginLeft: 8,
    fontWeight: '500',
  },
});