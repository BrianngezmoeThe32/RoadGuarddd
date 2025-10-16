import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useServices } from '../hooks/useServices';
import ServiceCard from '../components/screens/ServiceCard';
import Button from "../components/common/Button";
import { COLORS } from '../constants/colors';

export default function ServicesScreen() {
  const { services } = useServices();

  const handleServiceSelect = (service: any) => {
    router.push({
      pathname: '/modal',
      params: { 
        service: JSON.stringify(service),
        type: 'service-request'
      }
    });
  };

  const pricingPlans = [
    {
      title: 'Basic Assistance',
      price: '$49.99',
      description: 'For services like jump starts and lockout assistance',
      features: ['Jump Start', 'Lockout Service', 'Tire Change', 'Fuel Delivery'],
    },
    {
      title: 'Premium Plan',
      price: '$99.99/month',
      description: 'Complete roadside protection',
      features: ['All Basic Services', 'Towing (up to 10 miles)', 'Trip Interruption', 'Rental Car Discount'],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="miscellaneous-services" size={28} color={COLORS.white} />
          <Text style={styles.headerTitle}>Our Services</Text>
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
          <Text style={styles.heroTitle}>Comprehensive Roadside Assistance</Text>
          <Text style={styles.heroSubtitle}>
            RoadGuard offers a wide range of services to get you back on the road quickly and safely.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Services</Text>
          <View style={styles.servicesGrid}>
            {services.map(service => (
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
                <Text style={styles.pricingDescription}>{plan.description}</Text>
                <View style={styles.featuresList}>
                  {plan.features.map((feature, featureIndex) => (
                    <View key={featureIndex} style={styles.featureItem}>
                      <Icon name="check-circle" size={16} color={COLORS.success} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                <Button
                  title="Choose Plan"
                  onPress={() => {}}
                  style={styles.planButton}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoSection}>
          <Icon name="info" size={40} color={COLORS.primary} />
          <Text style={styles.infoTitle}>Why Choose RoadGuard?</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Icon name="flash-on" size={24} color={COLORS.success} />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Rapid Response</Text>
                <Text style={styles.benefitText}>Average response time under 30 minutes</Text>
              </View>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="security" size={24} color={COLORS.success} />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>24/7 Availability</Text>
                <Text style={styles.benefitText}>Round-the-clock service, 365 days a year</Text>
              </View>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="star" size={24} color={COLORS.success} />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Certified Technicians</Text>
                <Text style={styles.benefitText}>All our technicians are certified and experienced</Text>
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
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    alignItems: 'center',
    marginBottom: 32,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pricingContainer: {
    gap: 16,
  },
  pricingCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  pricingPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 8,
  },
  pricingDescription: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
    lineHeight: 20,
  },
  featuresList: {
    gap: 8,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 8,
  },
  planButton: {
    marginTop: 8,
  },
  infoSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 24,
  },
  benefitsList: {
    width: '100%',
    gap: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitContent: {
    flex: 1,
    marginLeft: 16,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
});