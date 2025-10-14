import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colors';

interface ProviderProfile {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  serviceTypes: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  serviceRadius: number;
  availability: string[];
  rating: number;
  totalJobs: number;
  joinDate: string;
  status: 'active' | 'suspended';
  documents: {
    license: string;
    insurance: string;
    vehicleRegistration: string;
  };
}

export default function ProviderProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProviderProfile>({
    id: '1',
    businessName: 'City Tow Services',
    email: 'contact@citytow.com',
    phone: '(555) 123-4567',
    serviceTypes: ['Towing', 'Tire Change', 'Jump Start'],
    address: {
      street: '123 Service Road',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
    serviceRadius: 25,
    availability: ['24/7', 'Weekdays', 'Weekends'],
    rating: 4.8,
    totalJobs: 147,
    joinDate: '2023-01-15',
    status: 'active',
    documents: {
      license: 'uploaded',
      insurance: 'uploaded',
      vehicleRegistration: 'uploaded',
    },
  });

  const [formData, setFormData] = useState(profile);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const toggleServiceType = (service: string) => {
    if (!isEditing) return;
    
    setFormData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(service)
        ? prev.serviceTypes.filter(s => s !== service)
        : [...prev.serviceTypes, service]
    }));
  };

  const toggleAvailability = (option: string) => {
    if (!isEditing) return;
    
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter(a => a !== option)
        : [...prev.availability, option]
    }));
  };

  const availabilityOptions = [
    '24/7',
    'Weekdays',
    'Weekends',
    'Morning (6AM-12PM)',
    'Afternoon (12PM-6PM)',
    'Evening (6PM-12AM)',
  ];

  const serviceOptions = [
    'Towing',
    'Tire Change',
    'Jump Start',
    'Lockout Service',
    'Fuel Delivery',
    'Other Assistance',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        {!isEditing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Icon name="edit" size={20} color={COLORS.primaryLight} />
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' }}
              style={styles.avatar}
            />
            {isEditing && (
              <TouchableOpacity style={styles.editAvatarButton}>
                <Icon name="camera-alt" size={16} color={COLORS.white} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.businessName}>{profile.businessName}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{profile.rating}</Text>
            <Text style={styles.jobsText}>• {profile.totalJobs} jobs</Text>
          </View>
          <View style={[styles.statusBadge, profile.status === 'active' ? styles.activeBadge : styles.suspendedBadge]}>
            <Text style={styles.statusText}>{profile.status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business Name</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.businessName}
                onChangeText={(value) => updateFormData('businessName', value)}
                editable={isEditing}
                placeholder="Enter business name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                editable={isEditing}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="business@example.com"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                editable={isEditing}
                keyboardType="phone-pad"
                placeholder="(555) 123-4567"
              />
            </View>
          </View>
        </View>

        {/* Service Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Types</Text>
          <View style={styles.infoCard}>
            <Text style={styles.sectionDescription}>
              Select the services you provide
            </Text>
            <View style={styles.optionsGrid}>
              {serviceOptions.map(service => (
                <TouchableOpacity
                  key={service}
                  style={[
                    styles.optionButton,
                    formData.serviceTypes.includes(service) && styles.optionButtonSelected,
                    !isEditing && styles.optionButtonDisabled,
                  ]}
                  onPress={() => toggleServiceType(service)}
                  disabled={!isEditing}
                >
                  <Text style={[
                    styles.optionText,
                    formData.serviceTypes.includes(service) && styles.optionTextSelected,
                  ]}>
                    {service}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Address & Service Area */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address & Service Area</Text>
          <View style={styles.infoCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Street Address</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.address.street}
                onChangeText={(value) => updateFormData('address', { ...formData.address, street: value })}
                editable={isEditing}
                placeholder="123 Main Street"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={formData.address.city}
                  onChangeText={(value) => updateFormData('address', { ...formData.address, city: value })}
                  editable={isEditing}
                  placeholder="City"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={formData.address.state}
                  onChangeText={(value) => updateFormData('address', { ...formData.address, state: value })}
                  editable={isEditing}
                  placeholder="State"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.address.zipCode}
                onChangeText={(value) => updateFormData('address', { ...formData.address, zipCode: value })}
                editable={isEditing}
                placeholder="12345"
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Service Radius</Text>
              <Text style={styles.sectionDescription}>
                Maximum distance you're willing to travel (miles)
              </Text>
              <View style={[styles.radiusSelector, !isEditing && styles.radiusSelectorDisabled]}>
                <TouchableOpacity
                  style={styles.radiusButton}
                  onPress={() => updateFormData('serviceRadius', Math.max(5, formData.serviceRadius - 5))}
                  disabled={!isEditing}
                >
                  <Icon name="remove" size={20} color={isEditing ? COLORS.primary : COLORS.gray} />
                </TouchableOpacity>
                <Text style={styles.radiusText}>{formData.serviceRadius} miles</Text>
                <TouchableOpacity
                  style={styles.radiusButton}
                  onPress={() => updateFormData('serviceRadius', formData.serviceRadius + 5)}
                  disabled={!isEditing}
                >
                  <Icon name="add" size={20} color={isEditing ? COLORS.primary : COLORS.gray} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.infoCard}>
            <Text style={styles.sectionDescription}>
              Select your typical working hours
            </Text>
            <View style={styles.optionsGrid}>
              {availabilityOptions.map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    formData.availability.includes(option) && styles.optionButtonSelected,
                    !isEditing && styles.optionButtonDisabled,
                  ]}
                  onPress={() => toggleAvailability(option)}
                  disabled={!isEditing}
                >
                  <Text style={[
                    styles.optionText,
                    formData.availability.includes(option) && styles.optionTextSelected,
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Account Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Provider Since</Text>
              <Text style={styles.infoValue}>
                {new Date(profile.joinDate).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Account Status</Text>
              <View style={[
                styles.statusBadgeSmall,
                profile.status === 'active' ? styles.activeBadge : styles.suspendedBadge
              ]}>
                <Text style={styles.statusTextSmall}>{profile.status.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Documents</Text>
              <TouchableOpacity
                style={styles.documentsButton}
                onPress={() => router.push('/provider/documents')}
              >
                <Text style={styles.documentsButtonText}>View Documents</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        {!isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Actions</Text>
            <View style={styles.dangerCard}>
              <TouchableOpacity style={styles.dangerButton}>
                <Icon name="notifications-off" size={20} color={COLORS.warning} />
                <Text style={styles.dangerButtonText}>Pause Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dangerButton}>
                <Icon name="logout" size={20} color={COLORS.danger} />
                <Text style={[styles.dangerButtonText, { color: COLORS.danger }]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
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
  editButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
  },
  cancelButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 6,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 4,
    marginRight: 8,
  },
  jobsText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#C6F6D5',
  },
  suspendedBadge: {
    backgroundColor: '#FED7D7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
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
  sectionDescription: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
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
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.black,
    backgroundColor: COLORS.white,
  },
  inputDisabled: {
    backgroundColor: COLORS.lightGray,
    color: COLORS.gray,
  },
  row: {
    flexDirection: 'row',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionButtonDisabled: {
    opacity: 0.6,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
    optionTextSelected: {
      color: COLORS.white,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    infoLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.primary,
    },
    infoValue: {
      fontSize: 14,
      color: COLORS.gray,
      fontWeight: '500',
    },
    statusBadgeSmall: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statusTextSmall: {
      fontSize: 10,
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    documentsButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: COLORS.primaryLight,
      borderRadius: 6,
    },
    documentsButtonText: {
      color: COLORS.white,
      fontSize: 14,
      fontWeight: '600',
    },
    radiusSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: COLORS.white,
      borderWidth: 1,
      borderColor: COLORS.lightGray,
    },
    radiusButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: COLORS.lightGray,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radiusSelectorDisabled: {
      backgroundColor: COLORS.lightGray,
    },
    radiusText: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.primary,
      marginHorizontal: 12,
    },
    dangerCard: {
      backgroundColor: COLORS.white,
      padding: 20,
      borderRadius: 12,
      elevation: 2,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
    },
    dangerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: COLORS.lightGray,
      marginRight: 8,
    },
    dangerButtonText: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.warning,
    },
  });