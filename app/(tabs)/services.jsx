import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import Button from "../../components/common/Button";
import ServiceCard from "../../components/screens/ServiceCard";
import { COLORS } from "../../constants/colors";
import { useServices } from "../../hooks/useServices";

export default function ServicesScreen() {
  const { services } = useServices();

  const handleServiceSelect = (service) => {
    router.push({
      pathname: "/modal",
      params: {
        service: JSON.stringify(service),
        type: "service-request",
      },
    });
  };

  const pricingPlans = [
    {
      title: "Basic Assistance",
      price: "$49.99",
      description: "For services like jump starts and lockout assistance",
      features: [
        "Jump Start",
        "Lockout Service",
        "Tire Change",
        "Fuel Delivery",
      ],
    },
    {
      title: "Premium Plan",
      price: "$99.99/month",
      description: "Complete roadside protection",
      features: [
        "All Basic Services",
        "Towing (up to 10 miles)",
        "Trip Interruption",
        "Rental Car Discount",
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="miscellaneous-services" size={28} color="#1a237e" />
          <Text style={styles.headerTitle}>Our Services</Text>
        </View>
        {/* Home button removed since it's in bottom tabs */}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Comprehensive Roadside Assistance
          </Text>
          <Text style={styles.heroSubtitle}>
            RoadGuard offers a wide range of services to get you back on the
            road quickly and safely.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Services</Text>
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={() => handleServiceSelect(service)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Pricing</Text>
          <View style={styles.pricingContainer}>
            {pricingPlans.map((plan, index) => (
              <View key={index} style={styles.pricingCard}>
                <Text style={styles.pricingTitle}>{plan.title}</Text>
                <Text style={styles.pricingPrice}>{plan.price}</Text>
                <Text style={styles.pricingDescription}>
                  {plan.description}
                </Text>

                <View style={styles.featuresList}>
                  {plan.features.map((feature, featureIndex) => (
                    <View key={featureIndex} style={styles.featureItem}>
                      <Icon name="check-circle" size={16} color="#1a237e" />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <Button
                  title="Choose Plan"
                  onPress={() => {}}
                  variant="outline"
                  style={styles.planButton}
                  textStyle={styles.planButtonText}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoSection}>
          <Icon name="info" size={40} color="#1a237e" />
          <Text style={styles.infoTitle}>Why Choose RoadGuard?</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Icon name="flash-on" size={24} color="#1a237e" />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Rapid Response</Text>
                <Text style={styles.benefitText}>
                  Average response time under 30 minutes
                </Text>
              </View>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="security" size={24} color="#1a237e" />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>24/7 Availability</Text>
                <Text style={styles.benefitText}>
                  Round-the-clock service, 365 days a year
                </Text>
              </View>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="star" size={24} color="#1a237e" />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Certified Technicians</Text>
                <Text style={styles.benefitText}>
                  All our technicians are certified and experienced
                </Text>
              </View>
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
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF", // Changed to white
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#1a237e", // Changed to blue
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
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a237e",
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a237e",
    letterSpacing: 2,
    marginBottom: 12,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  pricingContainer: {
    gap: 16,
  },
  pricingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a237e",
    marginBottom: 8,
  },
  pricingPrice: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a237e", 
    marginBottom: 8,
  },
  pricingDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  featuresList: {
    gap: 8,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureText: {
    fontSize: 14,
    color: "#1a237e",
    marginLeft: 8,
  },
  planButton: {
    marginTop: 8,
  },
  planButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a237e",
  },
  infoSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    alignItems: "center",
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a237e",
    marginTop: 12,
    marginBottom: 16,
  },
  benefitsList: {
    width: "100%",
    gap: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  benefitContent: {
    flex: 1,
    marginLeft: 12,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a237e",
    marginBottom: 2,
  },
  benefitText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
});