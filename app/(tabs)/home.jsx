import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons";

import Button from "../../components/common/Button";
import ServiceCard from "../../components/screens/ServiceCard";
import { useLocation } from "../../context/LocationContext";
import { useAuth } from "../../hooks/useAuth";
import { useServices } from "../../hooks/useServices";

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { services, requestService, isLoading } = useServices();
  const {
    currentLocation,
    locationError,
    isLoading: locationLoading,
    refreshLocation,
  } = useLocation();

  const [nearbyProviders, setNearbyProviders] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(30);

  React.useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withDelay(200, withTiming(0, { duration: 600 }));
  }, []);

  // Load nearby providers when location changes
  useEffect(() => {
    const loadNearbyProviders = async () => {
      if (currentLocation) {
        try {
          setServicesLoading(true);
          // For now, use mock data - you can replace this with your actual provider service later
          const mockProviders = [
            {
              id: "1",
              name: "Quick Assist Roadside",
              rating: 4.8,
              estimatedArrival: "15-20 min",
              distance: "2.3 km",
            },
            {
              id: "2",
              name: "Emergency Road Help",
              rating: 4.6,
              estimatedArrival: "10-15 min",
              distance: "1.8 km",
            },
          ];
          setNearbyProviders(mockProviders);
        } catch (error) {
          console.error("Error loading providers:", error);
        } finally {
          setServicesLoading(false);
        }
      }
    };

    loadNearbyProviders();
  }, [currentLocation]);

  const animatedContent = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const handleServiceSelect = (service) => {
    router.push({
      pathname: "/modal",
      params: {
        service: JSON.stringify(service),
        type: "service-request",
      },
    });
  };

  const handleRefresh = async () => {
    await refreshLocation();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent
      />

      {/* Header - Simplified without Settings/Logout */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoCircle}>
            <Icon name="security" size={24} color="#1a237e" />
          </View>
          <View>
            <Text style={styles.headerTitle}>ROADGUARD</Text>
            <Text style={styles.headerSubtitle}>Premium Assistance</Text>
          </View>
        </View>
        <View style={styles.userBadge}>
          <Text style={styles.userInitial}>
            {user?.displayName?.[0]?.toUpperCase() || "U"}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={locationLoading || servicesLoading}
            onRefresh={handleRefresh}
            colors={["#1a237e"]}
            tintColor="#1a237e"
          />
        }
      >
        <Animated.View style={[styles.contentContainer, animatedContent]}>
          {/* Welcome Section */}
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeHeader}>
              <Text style={styles.welcomeTitle}>Welcome back,</Text>
              <Text style={styles.userName}>
                {user?.displayName || "User"}!
              </Text>
            </View>
            <Text style={styles.welcomeSubtitle}>
              How can we assist you today?
            </Text>

            {/* Location Status */}
            <View style={styles.locationStatus}>
              <View
                style={[
                  styles.statusIndicator,
                  locationLoading
                    ? styles.statusLoading
                    : locationError
                    ? styles.statusError
                    : currentLocation
                    ? styles.statusActive
                    : styles.statusInactive,
                ]}
              />
              <Text style={styles.locationStatusText}>
                {locationLoading
                  ? "Updating location..."
                  : locationError
                  ? "Location disabled"
                  : currentLocation
                  ? "Location active"
                  : "Location unavailable"}
              </Text>
            </View>
          </View>

          {/* Location Card */}
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <Icon
                name="location-on"
                size={20}
                color={locationError ? "#d32f2f" : "#1a237e"}
              />
              <Text
                style={[
                  styles.locationTitle,
                  locationError && styles.locationTitleError,
                ]}
              >
                CURRENT LOCATION
              </Text>
              {locationLoading && (
                <View style={styles.loadingSpinner}>
                  <ActivityIndicator size="small" color="#1a237e" />
                </View>
              )}
            </View>

            <Text
              style={[
                styles.locationText,
                locationError && styles.locationTextError,
              ]}
            >
              {locationError
                ? "Location permission required - Tap to enable"
                : locationLoading
                ? "Getting your location..."
                : currentLocation
                ? currentLocation.address ||
                  `Lat: ${currentLocation.latitude?.toFixed(
                    4
                  )}, Lng: ${currentLocation.longitude?.toFixed(4)}`
                : "Unable to get location"}
            </Text>

            <Button
              title="UPDATE LOCATION"
              onPress={handleRefresh}
              variant="outline"
              style={styles.locationButton}
              textStyle={styles.locationButtonText}
              icon={<Icon name="refresh" size={16} color="#1a237e" />}
              loading={locationLoading}
            />
          </View>

          {/* Nearby Providers */}
          {currentLocation && (
            <View style={styles.providersCard}>
              <View style={styles.providersHeader}>
                <Icon name="local-shipping" size={20} color="#1a237e" />
                <Text style={styles.providersTitle}>NEARBY PROVIDERS</Text>
                <View style={styles.providerCount}>
                  <Text style={styles.providerCountText}>
                    {nearbyProviders.length}
                  </Text>
                </View>
              </View>
              {nearbyProviders.length > 0 ? (
                <View style={styles.providersList}>
                  {nearbyProviders.slice(0, 3).map((provider) => (
                    <View key={provider.id} style={styles.providerItem}>
                      <Text style={styles.providerName}>{provider.name}</Text>
                      <View style={styles.providerDetails}>
                        <Text style={styles.providerRating}>
                          ⭐ {provider.rating}
                        </Text>
                        <Text style={styles.providerArrival}>
                          {provider.estimatedArrival}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noProvidersText}>
                  {servicesLoading
                    ? "Searching for providers..."
                    : "No providers nearby"}
                </Text>
              )}
            </View>
          )}

          {/* Services Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PREMIUM SERVICES</Text>
            <Text style={styles.sectionSubtitle}>
              Select your required assistance
            </Text>

            <View style={styles.servicesGrid}>
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onPress={() => handleServiceSelect(service)}
                  disabled={!currentLocation || locationError}
                />
              ))}
            </View>

            {(locationError || !currentLocation) && (
              <Text style={styles.locationWarning}>
                ⚠️ Enable location to request services
              </Text>
            )}
          </View>

          {/* Emergency Contact */}
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyIcon}>
              <Icon name="warning" size={30} color="#FFFFFF" />
            </View>
            <Text style={styles.emergencyTitle}>EMERGENCY CONTACT</Text>
            <Text style={styles.emergencyNumber}>1-800-ROAD-HELP</Text>
            <Text style={styles.emergencyText}>
              24/7 Immediate Assistance • Premium Support
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
            <View style={styles.actionButtons}>
              <Button
                title="Service History"
                onPress={() => router.push("/history")}
                variant="outline"
                style={styles.actionButton}
                textStyle={styles.actionButtonText}
                icon={<Icon name="history" size={20} color="#1a237e" />}
              />
              <Button
                title="Contact Support"
                onPress={() => router.push("/contact")}
                variant="outline"
                style={styles.actionButton}
                textStyle={styles.actionButtonText}
                icon={<Icon name="support" size={20} color="#1a237e" />}
              />
            </View>
          </View>
        </Animated.View>
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
  userBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a237e",
    justifyContent: "center",
    alignItems: "center",
  },
  userInitial: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1a237e",
    marginRight: 12,
    shadowColor: "#1a237e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    color: "#1a237e",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 2,
  },
  headerSubtitle: {
    color: "#666",
    fontSize: 12,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    padding: 24,
  },
  welcomeCard: {
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
  welcomeHeader: {
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a237e",
    letterSpacing: 0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#666",
    fontWeight: "400",
    marginBottom: 12,
  },
  locationStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusActive: {
    backgroundColor: "#4CAF50",
  },
  statusLoading: {
    backgroundColor: "#FFC107",
  },
  statusError: {
    backgroundColor: "#d32f2f",
  },
  statusInactive: {
    backgroundColor: "#666",
  },
  locationStatusText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  locationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1a237e",
    letterSpacing: 1,
    marginLeft: 8,
  },
  locationTitleError: {
    color: "#d32f2f",
  },
  locationText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginBottom: 16,
  },
  locationTextError: {
    color: "#d32f2f",
  },
  locationButton: {
    paddingVertical: 8,
    borderColor: "#1a237e",
  },
  locationButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1a237e",
    letterSpacing: 1,
  },
  loadingSpinner: {
    marginLeft: 8,
  },
  providersCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  providersHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  providersTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1a237e",
    letterSpacing: 1,
    marginLeft: 8,
    flex: 1,
  },
  providerCount: {
    backgroundColor: "#1a237e",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  providerCountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  providersList: {
    gap: 12,
  },
  providerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  providerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  providerDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  providerRating: {
    fontSize: 12,
    color: "#666",
  },
  providerArrival: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  noProvidersText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a237e",
    letterSpacing: 2,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    fontWeight: "400",
  },
  locationWarning: {
    textAlign: "center",
    color: "#d32f2f",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12,
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emergencyCard: {
    backgroundColor: "#FFF3CD",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#FFEEBA",
  },
  emergencyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF9800",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emergencyTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#856404",
    letterSpacing: 2,
    marginBottom: 8,
  },
  emergencyNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#856404",
    marginBottom: 8,
    letterSpacing: 1,
  },
  emergencyText: {
    fontSize: 14,
    color: "#856404",
    textAlign: "center",
    fontWeight: "500",
  },
  quickActions: {
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E5E5",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a237e",
    letterSpacing: 0.5,
  },
});
