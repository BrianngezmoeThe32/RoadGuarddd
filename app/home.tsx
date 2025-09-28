import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import Button from "../components/common/Button";
import ServiceCard from "../components/screens/ServiceCard";
import { COLORS } from "../constants/colors";
import { useAuth } from "../hooks/useAuth";
import { useServices } from "../hooks/useServices";

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { services, requestService, isLoading } = useServices();
  const [userLocation] = useState("123 Main St, Cityville");

  const handleServiceSelect = (service: any) => {
    router.push({
      pathname: "/modal",
      params: {
        service: JSON.stringify(service),
        type: "service-request",
      },
    });
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="directions-car" size={28} color={COLORS.white} />
          <View>
            <Text style={styles.headerTitle}>RoadGuard Assistance</Text>
            <Text style={styles.headerSubtitle}>24/7 Roadside Help</Text>
          </View>
        </View>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
          textStyle={styles.logoutText}
          icon={<Icon name="logout" size={16} color={COLORS.primaryLight} />}
        />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.welcomeText}>Hello, {user?.name}!</Text>
        <Text style={styles.subtitle}>How can we help you today?</Text>

        <View style={styles.locationContainer}>
          <Icon name="location-on" size={20} color={COLORS.primary} />
          <Text style={styles.locationText}>Your location: {userLocation}</Text>
          <Button
            title="Update"
            onPress={() => {}}
            variant="outline"
            style={styles.locationButton}
          />
        </View>

        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onPress={() => handleServiceSelect(service)}
            />
          ))}
        </View>

        <View style={styles.emergencyContainer}>
          <Icon name="warning" size={30} color={COLORS.warning} />
          <Text style={styles.emergencyTitle}>Emergency Contact</Text>
          <Text style={styles.emergencyNumber}>1-800-ROAD-HELP</Text>
          <Text style={styles.emergencyText}>
            Available 24/7 for immediate assistance
          </Text>
        </View>

        <View style={styles.quickActions}>
          <Button
            title="Service History"
            onPress={() => router.push("/history")}
            variant="outline"
            icon={<Icon name="history" size={20} color={COLORS.primary} />}
          />
          <Button
            title="Contact Support"
            onPress={() => router.push("/contact")}
            variant="outline"
            icon={<Icon name="support" size={20} color={COLORS.primary} />}
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
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginLeft: 12,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  logoutText: {
    fontSize: 14,
    color: COLORS.primaryLight,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  locationText: {
    flex: 1,
    marginLeft: 12,
    color: COLORS.primary,
    fontSize: 16,
  },
  locationButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    minHeight: 32,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  emergencyContainer: {
    backgroundColor: "#FFF3CD",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFEEBA",
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#856404",
    marginTop: 12,
  },
  emergencyNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#856404",
    marginVertical: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: "#856404",
    textAlign: "center",
  },
  quickActions: {
    gap: 12,
    marginBottom: 20,
  },
});
