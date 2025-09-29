import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colors';

interface EarningsData {
  totalEarnings: number;
  weeklyEarnings: number;
  completedJobs: number;
  averageRating: number;
  payoutSchedule: string;
  nextPayout: string;
  earningsHistory: {
    week: string;
    amount: number;
    jobs: number;
    trend: 'up' | 'down';
  }[];
  recentPayouts: {
    id: string;
    date: string;
    amount: number;
    status: 'completed' | 'pending';
    method: string;
  }[];
}

export default function ProviderEarnings() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [earningsData, setEarningsData] = useState<EarningsData>({
    totalEarnings: 12560,
    weeklyEarnings: 845,
    completedJobs: 147,
    averageRating: 4.8,
    payoutSchedule: 'Weekly on Fridays',
    nextPayout: '2023-09-29',
    earningsHistory: [
      { week: 'Sep 18-24', amount: 845, jobs: 12, trend: 'up' },
      { week: 'Sep 11-17', amount: 720, jobs: 10, trend: 'up' },
      { week: 'Sep 4-10', amount: 680, jobs: 9, trend: 'down' },
      { week: 'Aug 28-Sep 3', amount: 710, jobs: 11, trend: 'up' },
      { week: 'Aug 21-27', amount: 650, jobs: 8, trend: 'up' },
    ],
    recentPayouts: [
      { id: '1', date: '2023-09-22', amount: 845, status: 'completed', method: 'Bank Transfer' },
      { id: '2', date: '2023-09-15', amount: 720, status: 'completed', method: 'Bank Transfer' },
      { id: '3', date: '2023-09-08', amount: 680, status: 'completed', method: 'Bank Transfer' },
      { id: '4', date: '2023-09-29', amount: 890, status: 'pending', method: 'Bank Transfer' },
    ],
  });

  const getTotalPending = () => {
    return earningsData.recentPayouts
      .filter(payout => payout.status === 'pending')
      .reduce((total, payout) => total + payout.amount, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
        <Text style={styles.headerTitle}>Earnings</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Icon name="help" size={20} color={COLORS.primaryLight} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Earnings Overview */}
        <View style={styles.overviewSection}>
          <View style={styles.earningsCard}>
            <Text style={styles.earningsLabel}>Total Earnings</Text>
            <Text style={styles.earningsAmount}>{formatCurrency(earningsData.totalEarnings)}</Text>
            <View style={styles.earningsStats}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{earningsData.completedJobs}</Text>
                <Text style={styles.statLabel}>Jobs</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{earningsData.averageRating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{formatCurrency(earningsData.weeklyEarnings)}</Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
            </View>
          </View>

          <View style={styles.payoutCard}>
            <View style={styles.payoutHeader}>
              <Icon name="account-balance-wallet" size={24} color={COLORS.primary} />
              <Text style={styles.payoutTitle}>Next Payout</Text>
            </View>
            <Text style={styles.payoutAmount}>{formatCurrency(getTotalPending())}</Text>
            <Text style={styles.payoutDate}>
              {formatDate(earningsData.nextPayout)} • {earningsData.payoutSchedule}
            </Text>
            <TouchableOpacity style={styles.payoutButton}>
              <Text style={styles.payoutButtonText}>View Payout Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          <TouchableOpacity
            style={[styles.timeButton, timeRange === 'week' && styles.timeButtonActive]}
            onPress={() => setTimeRange('week')}
          >
            <Text style={[styles.timeText, timeRange === 'week' && styles.timeTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeButton, timeRange === 'month' && styles.timeButtonActive]}
            onPress={() => setTimeRange('month')}
          >
            <Text style={[styles.timeText, timeRange === 'month' && styles.timeTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeButton, timeRange === 'year' && styles.timeButtonActive]}
            onPress={() => setTimeRange('year')}
          >
            <Text style={[styles.timeText, timeRange === 'year' && styles.timeTextActive]}>
              Year
            </Text>
          </TouchableOpacity>
        </View>

        {/* Earnings History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings History</Text>
          <View style={styles.historyCard}>
            {earningsData.earningsHistory.map((week, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyInfo}>
                  <Text style={styles.weekLabel}>{week.week}</Text>
                  <Text style={styles.jobsCount}>{week.jobs} jobs</Text>
                </View>
                <View style={styles.earningsInfo}>
                  <Text style={styles.weekAmount}>{formatCurrency(week.amount)}</Text>
                  <View style={styles.trend}>
                    <Icon 
                      name={week.trend === 'up' ? 'trending-up' : 'trending-down'} 
                      size={16} 
                      color={week.trend === 'up' ? COLORS.success : COLORS.danger} 
                    />
                    <Text style={[
                      styles.trendText,
                      { color: week.trend === 'up' ? COLORS.success : COLORS.danger }
                    ]}>
                      {week.trend === 'up' ? '+12%' : '-5%'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Payouts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Payouts</Text>
          <View style={styles.payoutsCard}>
            {earningsData.recentPayouts.map(payout => (
              <View key={payout.id} style={styles.payoutItem}>
                <View style={styles.payoutInfo}>
                  <Text style={styles.payoutDateText}>{formatDate(payout.date)}</Text>
                  <Text style={styles.payoutMethod}>{payout.method}</Text>
                </View>
                <View style={styles.payoutAmountInfo}>
                  <Text style={styles.payoutAmountText}>{formatCurrency(payout.amount)}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: payout.status === 'completed' ? '#C6F6D5' : '#FEF5E7' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: payout.status === 'completed' ? COLORS.success : COLORS.warning }
                    ]}>
                      {payout.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Earnings Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Maximize Your Earnings</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Icon name="star" size={20} color={COLORS.primary} />
              <Text style={styles.tipText}>Maintain high ratings for better job opportunities</Text>
            </View>
            <View style={styles.tipItem}>
              <Icon name="schedule" size={20} color={COLORS.primary} />
              <Text style={styles.tipText}>Stay online during peak hours (7-9 AM, 4-7 PM)</Text>
            </View>
            <View style={styles.tipItem}>
              <Icon name="location-on" size={20} color={COLORS.primary} />
              <Text style={styles.tipText}>Work in high-demand areas for more requests</Text>
            </View>
            <View style={styles.tipItem}>
              <Icon name="thumb-up" size={20} color={COLORS.primary} />
              <Text style={styles.tipText}>Provide excellent service to get repeat customers</Text>
            </View>
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
  helpButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  overviewSection: {
    marginBottom: 24,
  },
  earningsCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  earningsLabel: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 8,
  },
  earningsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  earningsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  payoutCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  payoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  payoutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 8,
  },
  payoutAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 4,
  },
  payoutDate: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
  },
  payoutButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  payoutButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    elevation: 2,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
  },
  timeTextActive: {
    color: COLORS.white,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  historyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  historyInfo: {
    flex: 1,
  },
  weekLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  jobsCount: {
    fontSize: 14,
    color: COLORS.gray,
  },
  earningsInfo: {
    alignItems: 'flex-end',
  },
  weekAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 4,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  payoutsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  payoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  payoutInfo: {
    flex: 1,
  },
  payoutDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  payoutMethod: {
    fontSize: 14,
    color: COLORS.gray,
  },
  payoutAmountInfo: {
    alignItems: 'flex-end',
  },
  payoutAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 4,
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
  tipsSection: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 12,
    lineHeight: 20,
  },
});