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

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalUsers: 1250,
    totalProviders: 85,
    activeServices: 12,
    completedToday: 47,
    revenueToday: 1250,
    systemHealth: 'healthy' as const,
  });

  const quickActions = [
    {
      title: 'Manage Users',
      icon: 'people',
      screen: '/admin/users',
      color: '#3182CE',
    },
    {
      title: 'Service Providers',
      icon: 'engineering',
      screen: '/admin/providers',
      color: '#38A169',
    },
    {
      title: 'Active Services',
      icon: 'miscellaneous-services',
      screen: '/admin/services',
      color: '#DD6B20',
    },
    {
      title: 'Analytics',
      icon: 'analytics',
      screen: '/admin/analytics',
      color: '#805AD5',
    },
  ];

  const recentActivities = [
    { id: 1, action: 'New service request', user: 'John Doe', time: '2 min ago' },
    { id: 2, action: 'Provider registered', user: 'Mike Tow', time: '5 min ago' },
    { id: 3, action: 'Service completed', user: 'Sarah Mech', time: '10 min ago' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="admin-panel-settings" size={28} color={COLORS.white} />
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
        </View>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => router.back()}
        >
          <Icon name="logout" size={20} color={COLORS.primaryLight} />
          <Text style={styles.logoutText}>Exit Admin</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Metrics Cards */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Icon name="people" size={24} color={COLORS.primary} />
            <Text style={styles.metricNumber}>{metrics.totalUsers}</Text>
            <Text style={styles.metricLabel}>Total Users</Text>
          </View>
          <View style={styles.metricCard}>
            <Icon name="engineering" size={24} color={COLORS.primary} />
            <Text style={styles.metricNumber}>{metrics.totalProviders}</Text>
            <Text style={styles.metricLabel}>Providers</Text>
          </View>
          <View style={styles.metricCard}>
            <Icon name="miscellaneous-services" size={24} color={COLORS.primary} />
            <Text style={styles.metricNumber}>{metrics.activeServices}</Text>
            <Text style={styles.metricLabel}>Active</Text>
          </View>
          <View style={styles.metricCard}>
            <Icon name="attach-money" size={24} color={COLORS.primary} />
            <Text style={styles.metricNumber}>${metrics.revenueToday}</Text>
            <Text style={styles.metricLabel}>Revenue</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={() => router.push(action.screen as any)}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Icon name={action.icon as any} size={24} color={COLORS.white} />
                </View>
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* System Health */}
        <View style={styles.healthCard}>
          <View style={styles.healthHeader}>
            <Icon name="monitor-heart" size={24} color={COLORS.primary} />
            <Text style={styles.healthTitle}>System Health</Text>
          </View>
          <View style={styles.healthStatus}>
            <View style={[styles.statusIndicator, { backgroundColor: COLORS.success }]} />
            <Text style={styles.healthText}>All systems operational</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {recentActivities.map(activity => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Icon name="notifications" size={16} color={COLORS.gray} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityUser}>{activity.user}</Text>
                </View>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            ))}
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  logoutText: {
    color: COLORS.primaryLight,
    marginLeft: 5,
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
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
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  metricNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
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
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  healthCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 8,
  },
  healthStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  healthText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  activityList: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 2,
  },
  activityUser: {
    fontSize: 12,
    color: COLORS.gray,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
});