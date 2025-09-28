import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import Button from "../components/common/Button";
import HistoryItem from "../components/screens/HistoryItem";
import { COLORS } from "../constants/colors";
import { useServices } from "../hooks/useServices";

export default function HistoryScreen() {
  const { getServiceHistory } = useServices();
  const serviceHistory = getServiceHistory();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return COLORS.success;
      case "In Progress":
        return COLORS.info;
      case "Cancelled":
        return COLORS.danger;
      default:
        return COLORS.gray;
    }
  };

  const stats = {
    total: serviceHistory.length,
    completed: serviceHistory.filter((req) => req.status === "Completed")
      .length,
    inProgress: serviceHistory.filter((req) => req.status === "In Progress")
      .length,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="history" size={28} color={COLORS.white} />
          <Text style={styles.headerTitle}>Service History</Text>
        </View>
        <Button
          title="Home"
          onPress={() => router.back()}
          variant="outline"
          style={styles.backButton}
          textStyle={styles.backButtonText}
          icon={<Icon name="home" size={16} color={COLORS.primaryLight} />}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Your Service Requests</Text>
          <Text style={styles.heroSubtitle}>
            View your past service requests and their status.
          </Text>
        </View>

        {serviceHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="history-toggle-off" size={64} color={COLORS.gray} />
            <Text style={styles.emptyStateTitle}>No service history yet</Text>
            <Text style={styles.emptyStateText}>
              Your service requests will appear here once you request
              assistance.
            </Text>
            <Button
              title="Request Service"
              onPress={() => router.push("/home")}
              style={styles.emptyStateButton}
            />
          </View>
        ) : (
          <>
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Service Statistics</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{stats.total}</Text>
                  <Text style={styles.statLabel}>Total Requests</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{stats.completed}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{stats.inProgress}</Text>
                  <Text style={styles.statLabel}>In Progress</Text>
                </View>
              </View>
            </View>

            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>Recent Requests</Text>
              <View style={styles.historyList}>
                {serviceHistory.map((request) => (
                  <HistoryItem
                    key={request.id}
                    request={request}
                    statusColor={getStatusColor(request.status)}
                  />
                ))}
              </View>
            </View>
          </>
        )}

        <View style={styles.helpSection}>
          <Icon name="help" size={32} color={COLORS.primary} />
          <Text style={styles.helpTitle}>Need help with a past service?</Text>
          <Text style={styles.helpText}>
            If you have any questions about a previous service request, our
            support team is here to help.
          </Text>
          <Button
            title="Contact Support"
            onPress={() => router.push("/contact")}
            variant="outline"
            style={styles.helpButton}
          />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.primary,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  backButtonText: {
    fontSize: 14,
    color: COLORS.primaryLight,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  heroSection: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    lineHeight: 24,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.gray,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyStateButton: {
    minWidth: 200,
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: "center",
  },
  historySection: {
    marginBottom: 24,
  },
  historyList: {
    gap: 12,
  },
  helpSection: {
    alignItems: "center",
    padding: 24,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  helpText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  helpButton: {
    minWidth: 200,
  },
});
