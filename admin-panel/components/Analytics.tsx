import { View, Text, StyleSheet, ScrollView } from "react-native";
import { COLORS } from "../../constants/colors";

interface AnalyticsData {
  totalUsers: number;
  totalProviders: number;
  activeServices: number;
  completedServices: number;
  revenue: number;
  userGrowth: number;
  serviceGrowth: number;
  // Remove totalServiceRequests if it doesn't exist
}

interface AnalyticsProps {
  data: AnalyticsData;
}

export default function Analytics({ data }: AnalyticsProps) {
  const {
    totalUsers,
    totalProviders,
    activeServices,
    completedServices,
    revenue,
    userGrowth,
    serviceGrowth
  } = data;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Analytics Overview</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalUsers.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
          <Text style={styles.growthText}>
            {userGrowth > 0 ? '+' : ''}{userGrowth}% this month
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalProviders.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Providers</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{activeServices}</Text>
          <Text style={styles.statLabel}>Active Services</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedServices.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Completed Services</Text>
          <Text style={styles.growthText}>
            {serviceGrowth > 0 ? '+' : ''}{serviceGrowth}% this month
          </Text>
        </View>

        <View style={[styles.statCard, styles.revenueCard]}>
          <Text style={styles.revenueNumber}>${revenue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
      </View>

      <View style={styles.placeholderSection}>
        <Text style={styles.placeholderText}>
          Advanced charts and analytics will be implemented here
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  revenueCard: {
    backgroundColor: COLORS.primary + '10',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  revenueNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  growthText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '500',
  },
  placeholderSection: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
});