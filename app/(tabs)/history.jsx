import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import Button from "../../components/common/Button";
import HistoryItem from "../../components/screens/HistoryItem";
import { useServices } from "../../hooks/useServices";

export default function HistoryScreen() {
  const { getServiceHistory } = useServices();
  const serviceHistory = getServiceHistory();

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#4CAF50";
      case "In Progress":
        return "#2196F3";
      case "Cancelled":
        return "#d32f2f";
      default:
        return "#666";
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
          <Icon name="history" size={28} color="#1a237e" />
          <Text style={styles.headerTitle}>Service History</Text>
        </View>
        {/* Home button removed since it's in bottom tabs */}
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
            <Icon name="history-toggle-off" size={64} color="#666" />
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
              <Text style={styles.sectionTitle}>SERVICE STATISTICS</Text>
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
              <Text style={styles.sectionTitle}>RECENT REQUESTS</Text>
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
          <Icon name="help" size={32} color="#1a237e" />
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
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#1a237e",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginLeft: 12,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  heroSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a237e",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a237e",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyStateButton: {
    minWidth: 200,
    backgroundColor: "#1a237e",
  },
  statsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a237e",
    letterSpacing: 2,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a237e",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
  historySection: {
    marginBottom: 20,
  },
  historyList: {
    gap: 12,
  },
  helpSection: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a237e",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  helpText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  helpButton: {
    minWidth: 200,
    borderColor: "#1a237e",
  },
});