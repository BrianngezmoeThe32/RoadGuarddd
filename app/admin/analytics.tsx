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

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const analyticsData = {
    revenue: {
      total: 12560,
      change: '+12%',
      trend: 'up',
    },
    services: {
      total: 347,
      change: '+8%',
      trend: 'up',
    },
    users: {
      total: 1250,
      change: '+15%',
      trend: 'up',
    },
    providers: {
      total: 85,
      change: '+5%',
      trend: 'up',
    },
  };

  const serviceDistribution = [
    { type: 'Out of Gas', count: 124, percentage: 35.7 },
    { type: 'Tire Change', count: 89, percentage: 25.6 },
    { type: 'Jump Start', count: 67, percentage: 19.3 },
    { type: 'Lockout Service', count: 45, percentage: 13.0 },
    { type: 'Towing', count: 22, percentage: 6.3 },
  ];

  const topProviders = [
    { name: 'City Gas Delivery', services: 47, rating: 4.8 },
    { name: 'Mike Tow Services', services: 42, rating: 4.7 },
    { name: 'Quick Battery Help', services: 38, rating: 4.9 },
    { name: 'Emergency Lockout', services: 35, rating: 4.6 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics & Reports</Text>
        <View style={styles.placeholder} />
      </View>

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

      <ScrollView style={styles.content}>
        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricTitle}>Revenue</Text>
              <View style={[styles.changeBadge, analyticsData.revenue.trend === 'up' ? styles.positiveChange : styles.negativeChange]}>
                <Icon 
                  name={analyticsData.revenue.trend === 'up' ? 'trending-up' : 'trending-down'} 
                  size={12} 
                  color={COLORS.white} 
                />
                <Text style={styles.changeText}>{analyticsData.revenue.change}</Text>
              </View>
            </View>
            <Text style={styles.metricValue}>${analyticsData.revenue.total}</Text>
            <Text style={styles.metricLabel}>Total {timeRange} revenue</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricTitle}>Services</Text>
              <View style={[styles.changeBadge, analyticsData.services.trend === 'up' ? styles.positiveChange : styles.negativeChange]}>
                <Icon 
                  name={analyticsData.services.trend === 'up' ? 'trending-up' : 'trending-down'} 
                  size={12} 
                  color={COLORS.white} 
                />
                <Text style={styles.changeText}>{analyticsData.services.change}</Text>
              </View>
            </View>
            <Text style={styles.metricValue}>{analyticsData.services.total}</Text>
            <Text style={styles.metricLabel}>Services completed</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricTitle}>Users</Text>
              <View style={[styles.changeBadge, analyticsData.users.trend === 'up' ? styles.positiveChange : styles.negativeChange]}>
                <Icon 
                  name={analyticsData.users.trend === 'up' ? 'trending-up' : 'trending-down'} 
                  size={12} 
                  color={COLORS.white} 
                />
                <Text style={styles.changeText}>{analyticsData.users.change}</Text>
              </View>
            </View>
            <Text style={styles.metricValue}>{analyticsData.users.total}</Text>
            <Text style={styles.metricLabel}>Active users</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricTitle}>Providers</Text>
              <View style={[styles.changeBadge, analyticsData.providers.trend === 'up' ? styles.positiveChange : styles.negativeChange]}>
                <Icon 
                  name={analyticsData.providers.trend === 'up' ? 'trending-up' : 'trending-down'} 
                  size={12} 
                  color={COLORS.white} 
                />
                <Text style={styles.changeText}>{analyticsData.providers.change}</Text>
              </View>
            </View>
            <Text style={styles.metricValue}>{analyticsData.providers.total}</Text>
            <Text style={styles.metricLabel}>Active providers</Text>
          </View>
        </View>

        {/* Service Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Distribution</Text>
          <View style={styles.distributionCard}>
            {serviceDistribution.map((service, index) => (
              <View key={index} style={styles.distributionItem}>
                <View style={styles.distributionHeader}>
                  <Text style={styles.serviceType}>{service.type}</Text>
                  <Text style={styles.serviceCount}>{service.count}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${service.percentage}%` },
                      index === 0 && { backgroundColor: '#3182CE' },
                      index === 1 && { backgroundColor: '#38A169' },
                      index === 2 && { backgroundColor: '#DD6B20' },
                      index === 3 && { backgroundColor: '#805AD5' },
                      index === 4 && { backgroundColor: '#E53E3E' },
                    ]}
                  />
                </View>
                <Text style={styles.percentage}>{service.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Providers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing Providers</Text>
          <View style={styles.providersCard}>
            {topProviders.map((provider, index) => (
              <View key={index} style={styles.providerItem}>
                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <View style={styles.providerStats}>
                    <Text style={styles.servicesCount}>{provider.services} services</Text>
                    <View style={styles.rating}>
                      <Icon name="star" size={14} color="#FFD700" />
                      <Text style={styles.ratingText}>{provider.rating}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Reports */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Reports</Text>
          <View style={styles.reportsGrid}>
            <TouchableOpacity style={styles.reportCard}>
              <Icon name="receipt" size={24} color={COLORS.primary} />
              <Text style={styles.reportText}>Revenue Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportCard}>
              <Icon name="people" size={24} color={COLORS.primary} />
              <Text style={styles.reportText}>User Growth</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportCard}>
              <Icon name="engineering" size={24} color={COLORS.primary} />
              <Text style={styles.reportText}>Provider Performance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportCard}>
              <Icon name="analytics" size={24} color={COLORS.primary} />
              <Text style={styles.reportText}>Service Analytics</Text>
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
  timeRangeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  timeButtonActive: {
    borderBottomColor: COLORS.primary,
  },
  timeText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '600',
  },
  timeTextActive: {
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  positiveChange: {
    backgroundColor: COLORS.success,
  },
  negativeChange: {
    backgroundColor: COLORS.danger,
  },
  changeText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.gray,
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
  distributionCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  distributionItem: {
    marginBottom: 16,
  },
  distributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceType: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  serviceCount: {
    fontSize: 14,
    color: COLORS.gray,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  percentage: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'right',
  },
  providersCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  providerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  providerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  servicesCount: {
    fontSize: 12,
    color: COLORS.gray,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 2,
  },
  rankBadge: {
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  reportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reportCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  reportText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 8,
    textAlign: 'center',
  },
});