import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
     TextInput,

    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colors';

export default function ProviderAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    phone: '',
    serviceType: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (isLogin) {
      // Login logic
      if (!formData.email || !formData.password) {
        Alert.alert('Error', 'Please enter both email and password');
        return;
      }
    } else {
      // Register logic
      if (!formData.businessName || !formData.email || !formData.password || !formData.phone || !formData.serviceType) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (isLogin) {
        router.replace('/provider/dashboard');
      } else {
        Alert.alert('Success', 'Provider account created! Please complete your profile.');
        router.replace('/provider/documents');
      }
    }, 2000);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80' }} 
      style={styles.backgroundImage}
    >
      <View style={styles.overlay} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.authContainer}>
            <View style={styles.logoContainer}>
              <Icon name="engineering" size={80} color={COLORS.white} />
              <Text style={styles.logoText}>RoadGuard Provider</Text>
              <Text style={styles.subtitle}>
                {isLogin ? 'Sign in to your provider account' : 'Join our network of service providers'}
              </Text>
            </View>

            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, isLogin && styles.toggleButtonActive]}
                onPress={() => setIsLogin(true)}
              >
                <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, !isLogin && styles.toggleButtonActive]}
                onPress={() => setIsLogin(false)}
              >
                <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              {!isLogin && (
                <>
                  <View style={styles.inputContainer}>
                    <Icon name="business" size={20} color={COLORS.white} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Business Name"
                      placeholderTextColor="rgba(255,255,255,0.7)"
                      value={formData.businessName}
                      onChangeText={(value) => updateFormData('businessName', value)}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Icon name="phone" size={20} color={COLORS.white} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Phone Number"
                      placeholderTextColor="rgba(255,255,255,0.7)"
                      value={formData.phone}
                      onChangeText={(value) => updateFormData('phone', value)}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Icon name="miscellaneous-services" size={20} color={COLORS.white} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Service Type (e.g., Towing, Gas Delivery)"
                      placeholderTextColor="rgba(255,255,255,0.7)"
                      value={formData.serviceType}
                      onChangeText={(value) => updateFormData('serviceType', value)}
                    />
                  </View>
                </>
              )}

              <View style={styles.inputContainer}>
                <Icon name="email" size={20} color={COLORS.white} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color={COLORS.white} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={formData.password}
                  onChangeText={(value) => updateFormData('password', value)}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={[styles.authButton, isLoading && styles.loadingButton]}
                onPress={handleAuth}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Text style={styles.authButtonText}>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </Text>
                ) : (
                  <>
                    <Text style={styles.authButtonText}>
                      {isLogin ? 'Sign In' : 'Create Account'}
                    </Text>
                    <Icon name="arrow-forward" size={20} color={COLORS.white} />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Icon name="arrow-back" size={20} color={COLORS.white} />
                <Text style={styles.backButtonText}>Back to App</Text>
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <View style={styles.benefits}>
                <Text style={styles.benefitsTitle}>Why join as a provider?</Text>
                <View style={styles.benefitItem}>
                  <Icon name="attach-money" size={16} color={COLORS.primaryLight} />
                  <Text style={styles.benefitText}>Earn competitive rates</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Icon name="schedule" size={16} color={COLORS.primaryLight} />
                  <Text style={styles.benefitText}>Flexible working hours</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Icon name="people" size={16} color={COLORS.primaryLight} />
                  <Text style={styles.benefitText}>Grow your customer base</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  authContainer: {
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  toggleTextActive: {
    color: COLORS.white,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.white,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 12,
    marginTop: 20,
  },
  loadingButton: {
    opacity: 0.7,
  },
  authButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 12,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    marginLeft: 8,
  },
  benefits: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 12,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    color: COLORS.white,
    fontSize: 14,
    marginLeft: 8,
  },
});