import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colors';

export default function ProviderRegistration() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    businessName: '',
    email: '',
    phone: '',
    serviceTypes: [] as string[],
    
    // Step 2: Location & Availability
    address: '',
    city: '',
    state: '',
    zipCode: '',
    serviceRadius: 25,
    availability: [] as string[],
    
    // Step 3: Pricing
    baseRates: {
      towing: 80,
      tireChange: 50,
      jumpStart: 35,
      lockout: 45,
      fuelDelivery: 30,
    },
    
    // Step 4: Documents
    documents: {
      license: '',
      insurance: '',
      vehicleRegistration: '',
    },
  });

  const serviceOptions = [
    'Towing',
    'Tire Change',
    'Jump Start',
    'Lockout Service',
    'Fuel Delivery',
    'Other Assistance',
  ];

  const availabilityOptions = [
    '24/7',
    'Weekdays',
    'Weekends',
    'Morning (6AM-12PM)',
    'Afternoon (12PM-6PM)',
    'Evening (6PM-12AM)',
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleServiceType = (service: string) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(service)
        ? prev.serviceTypes.filter(s => s !== service)
        : [...prev.serviceTypes, service]
    }));
  };

  const toggleAvailability = (option: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter(a => a !== option)
        : [...prev.availability, option]
    }));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.businessName || !formData.email || !formData.phone || formData.serviceTypes.length === 0) {
          Alert.alert('Error', 'Please fill in all required fields and select at least one service type');
          return false;
        }
        break;
      case 2:
        if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
          Alert.alert('Error', 'Please fill in all address fields');
          return false;
        }
        break;
      case 3:
        // Pricing validation can be more flexible
        break;
      case 4:
        if (!formData.documents.license || !formData.documents.insurance || !formData.documents.vehicleRegistration) {
          Alert.alert('Error', 'Please upload all required documents');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    Alert.alert(
      'Registration Submitted',
      'Your provider application has been submitted for review. We will contact you within 24-48 hours.',
      [
        {
          text: 'OK',
          onPress: () => router.replace('//provider/dashboard'),
        },
      ]
    );
  };

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Business Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Business Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your business name"
          value={formData.businessName}
          onChangeText={(value) => updateFormData('businessName', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="business@example.com"
          value={formData.email}
          onChangeText={(value) => updateFormData('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="(555) 123-4567"
          value={formData.phone}
          onChangeText={(value) => updateFormData('phone', value)}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Service Types *</Text>
        <Text style={styles.subLabel}>Select all services you provide</Text>
        <View style={styles.optionsGrid}>
          {serviceOptions.map(service => (
            <TouchableOpacity
              key={service}
              style={[
                styles.optionButton,
                formData.serviceTypes.includes(service) && styles.optionButtonSelected,
              ]}
              onPress={() => toggleServiceType(service)}
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
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Location & Availability</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Street Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="123 Main Street"
          value={formData.address}
          onChangeText={(value) => updateFormData('address', value)}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>City *</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            value={formData.city}
            onChangeText={(value) => updateFormData('city', value)}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>State *</Text>
          <TextInput
            style={styles.input}
            placeholder="State"
            value={formData.state}
            onChangeText={(value) => updateFormData('state', value)}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>ZIP Code *</Text>
        <TextInput
          style={styles.input}
          placeholder="12345"
          value={formData.zipCode}
          onChangeText={(value) => updateFormData('zipCode', value)}
          keyboardType="number-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Service Radius</Text>
        <Text style={styles.subLabel}>Maximum distance you're willing to travel (miles)</Text>
        <View style={styles.radiusSelector}>
          <TouchableOpacity
            style={styles.radiusButton}
            onPress={() => updateFormData('serviceRadius', Math.max(5, formData.serviceRadius - 5))}
          >
            <Icon name="remove" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.radiusText}>{formData.serviceRadius} miles</Text>
          <TouchableOpacity
            style={styles.radiusButton}
            onPress={() => updateFormData('serviceRadius', formData.serviceRadius + 5)}
          >
            <Icon name="add" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Availability</Text>
        <Text style={styles.subLabel}>Select your typical working hours</Text>
        <View style={styles.optionsGrid}>
          {availabilityOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                formData.availability.includes(option) && styles.optionButtonSelected,
              ]}
              onPress={() => toggleAvailability(option)}
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
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>Pricing & Rates</Text>
      <Text style={styles.stepSubtitle}>Set your base rates for different services</Text>
      
      {Object.entries(formData.baseRates).map(([service, rate]) => (
        <View key={service} style={styles.rateRow}>
          <Text style={styles.rateLabel}>
            {service.split(/(?=[A-Z])/).join(' ')}
          </Text>
          <View style={styles.rateInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.rateInput}
              value={rate.toString()}
              onChangeText={(value) => updateFormData('baseRates', {
                ...formData.baseRates,
                [service]: parseInt(value) || 0
              })}
              keyboardType="number-pad"
            />
          </View>
        </View>
      ))}
      
      <View style={styles.note}>
        <Icon name="info" size={16} color={COLORS.info} />
        <Text style={styles.noteText}>
          These are base rates. Additional charges may apply for distance, time, or special requirements.
        </Text>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text style={styles.stepTitle}>Document Upload</Text>
      <Text style={styles.stepSubtitle}>Please upload required documents for verification</Text>
      
      {['license', 'insurance', 'vehicleRegistration'].map((docType) => (
        <TouchableOpacity
          key={docType}
          style={styles.documentButton}
          onPress={() => Alert.alert('Upload', `Upload ${docType}`)}
        >
          <Icon name="cloud-upload" size={24} color={COLORS.primary} />
          <View style={styles.documentInfo}>
            <Text style={styles.documentTitle}>
              {docType.split(/(?=[A-Z])/).join(' ')} *
            </Text>
            <Text style={styles.documentSubtitle}>
              {formData.documents[docType as keyof typeof formData.documents] 
                ? 'Document uploaded' 
                : 'Tap to upload document'}
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={COLORS.gray} />
        </TouchableOpacity>
      ))}
      
      <View style={styles.requirements}>
        <Text style={styles.requirementsTitle}>Document Requirements:</Text>
        <Text style={styles.requirement}>• Valid driver's license</Text>
        <Text style={styles.requirement}>• Business insurance certificate</Text>
        <Text style={styles.requirement}>• Vehicle registration</Text>
        <Text style={styles.requirement}>• All documents must be current and legible</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Provider Registration</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>Step {step} of 4</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {step === 4 ? 'Submit Application' : 'Continue'}
          </Text>
          <Icon name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
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
  progressContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
    elevation: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: COLORS.black,
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
  optionText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: COLORS.white,
  },
  radiusSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 16,
  },
  radiusButton: {
    padding: 8,
  },
  radiusText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  rateLabel: {
    fontSize: 16,
    color: COLORS.primary,
    textTransform: 'capitalize',
  },
  rateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 16,
    color: COLORS.gray,
    marginRight: 4,
  },
  rateInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 4,
    padding: 8,
    width: 60,
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.black,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E6F3FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.info,
    marginLeft: 8,
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'capitalize',
  },
  documentSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  requirements: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    elevation: 1,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  requirement: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.white,
    elevation: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 8,
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});