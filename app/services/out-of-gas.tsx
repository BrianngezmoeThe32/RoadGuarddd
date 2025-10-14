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

interface Garage {
  id: string;
  name: string;
  distance: number;
  price: number;
  rating: number;
  deliveryTime: number;
  fuelTypes: string[];
}

export default function OutOfGasService() {
  const [fuelAmount, setFuelAmount] = useState(5);
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel'>('petrol');
  const [selectedGarage, setSelectedGarage] = useState<string | null>(null);
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [location, setLocation] = useState('');

  const garages: Garage[] = [
    {
      id: '1',
      name: 'City Gas Station',
      distance: 1.2,
      price: 3.50,
      rating: 4.5,
      deliveryTime: 15,
      fuelTypes: ['petrol', 'diesel'],
    },
    {
      id: '2',
      name: 'Quick Fuel Center',
      distance: 2.1,
      price: 3.45,
      rating: 4.2,
      deliveryTime: 20,
      fuelTypes: ['petrol', 'diesel'],
    },
    {
      id: '3',
      name: 'Premium Fuels',
      distance: 0.8,
      price: 3.75,
      rating: 4.8,
      deliveryTime: 10,
      fuelTypes: ['petrol', 'diesel'],
    },
  ];

  const calculateTotal = () => {
    if (!selectedGarage) return 0;
    const garage = garages.find(g => g.id === selectedGarage);
    if (!garage) return 0;
    return (garage.price * fuelAmount) + 15; // $15 delivery fee
  };

  const handleRequestService = () => {
    if (!selectedGarage || !vehicleDetails || !location) {
      Alert.alert('Missing Information', 'Please fill in all required fields and select a garage.');
      return;
    }

    const garage = garages.find(g => g.id === selectedGarage);
    if (!garage) return;

    const serviceRequest = {
      serviceType: 'Out of Gas',
      fuelAmount,
      fuelType,
      garage: garage.name,
      totalPrice: calculateTotal(),
      vehicleDetails,
      location,
    };

    // Simulate finding available providers
    Alert.alert(
      'Service Requested',
      `Your request has been sent to nearby providers. Total: $${calculateTotal()}`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Redirect to waiting screen
            router.push({
              pathname: '/services/waiting',
              params: { 
                service: JSON.stringify(serviceRequest),
                type: 'out-of-gas'
              }
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Out of Gas Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Fuel Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fuel Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fuel Type</Text>
            <View style={styles.fuelTypeButtons}>
              <TouchableOpacity
                style={[
                  styles.fuelButton,
                  fuelType === 'petrol' && styles.fuelButtonActive,
                ]}
                onPress={() => setFuelType('petrol')}
              >
                <Text style={[
                  styles.fuelButtonText,
                  fuelType === 'petrol' && styles.fuelButtonTextActive,
                ]}>Petrol</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.fuelButton,
                  fuelType === 'diesel' && styles.fuelButtonActive,
                ]}
                onPress={() => setFuelType('diesel')}
              >
                <Text style={[
                  styles.fuelButtonText,
                  fuelType === 'diesel' && styles.fuelButtonTextActive,
                ]}>Diesel</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount (Gallons)</Text>
            <View style={styles.amountSelector}>
              <TouchableOpacity
                style={styles.amountButton}
                onPress={() => setFuelAmount(Math.max(1, fuelAmount - 1))}
              >
                <Icon name="remove" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.amountText}>{fuelAmount} gallons</Text>
              <TouchableOpacity
                style={styles.amountButton}
                onPress={() => setFuelAmount(fuelAmount + 1)}
              >
                <Icon name="add" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Vehicle & Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle & Location</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Details *</Text>
            <View style={styles.textInput}>
              <Text style={styles.inputText}>
                {vehicleDetails || 'Make, model, color, license plate'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push('/modal?type=vehicle-details')}
            >
              <Text style={styles.editButtonText}>Add Details</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Location *</Text>
            <View style={styles.textInput}>
              <Icon name="location-on" size={16} color={COLORS.gray} />
              <Text style={styles.inputText}>
                {location || 'Tap to set your location'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push('/modal?type=location')}
            >
              <Text style={styles.editButtonText}>Set Location</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Nearby Garages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Garage</Text>
          <Text style={styles.sectionSubtitle}>
            Choose your preferred fuel station
          </Text>
          
          <View style={styles.garagesList}>
            {garages.map(garage => (
              <TouchableOpacity
                key={garage.id}
                style={[
                  styles.garageCard,
                  selectedGarage === garage.id && styles.garageCardSelected,
                ]}
                onPress={() => setSelectedGarage(garage.id)}
              >
                <View style={styles.garageHeader}>
                  <Text style={styles.garageName}>{garage.name}</Text>
                  <View style={styles.rating}>
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{garage.rating}</Text>
                  </View>
                </View>
                
                <View style={styles.garageDetails}>
                  <View style={styles.detailItem}>
                    <Icon name="location-on" size={14} color={COLORS.gray} />
                    <Text style={styles.detailText}>{garage.distance} miles</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Icon name="schedule" size={14} color={COLORS.gray} />
                    <Text style={styles.detailText}>{garage.deliveryTime} min</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Icon name="local-gas-station" size={14} color={COLORS.gray} />
                    <Text style={styles.detailText}>${garage.price}/gal</Text>
                  </View>
                </View>
                
                <View style={styles.garageFooter}>
                  <Text style={styles.fuelTypes}>
                    {garage.fuelTypes.join(', ')}
                  </Text>
                  <Text style={styles.deliveryFee}>+ $15 delivery</Text>
                </View>
                
                {selectedGarage === garage.id && (
                  <View style={styles.selectedIndicator}>
                    <Icon name="check-circle" size={20} color={COLORS.success} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Total & Request */}
        {selectedGarage && (
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Fuel Cost:</Text>
              <Text style={styles.totalValue}>
                ${(garages.find(g => g.id === selectedGarage)?.price || 0) * fuelAmount}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Delivery Fee:</Text>
              <Text style={styles.totalValue}>$15.00</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Service Fee:</Text>
              <Text style={styles.totalValue}>$5.00</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotal]}>
              <Text style={styles.grandTotalLabel}>Total:</Text>
              <Text style={styles.grandTotalValue}>${calculateTotal()}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.requestButton}
              onPress={handleRequestService}
            >
              <Text style={styles.requestButtonText}>Request Service</Text>
            </TouchableOpacity>
          </View>
        )}
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  fuelTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  fuelButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    alignItems: 'center',
  },
  fuelButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  fuelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
  },
  fuelButtonTextActive: {
    color: COLORS.white,
  },
  amountSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
  },
  amountButton: {
    padding: 8,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  textInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 8,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  garagesList: {
    gap: 12,
  },
  garageCard: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  garageCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F9FF',
  },
  garageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  garageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 4,
  },
  garageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 4,
  },
  garageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fuelTypes: {
    fontSize: 12,
    color: COLORS.gray,
  },
  deliveryFee: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  totalSection: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 12,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  requestButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  requestButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});