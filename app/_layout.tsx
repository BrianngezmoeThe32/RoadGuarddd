import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StatusBar,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

// Define TypeScript interfaces
interface Service {
  id: number;
  name: string;
  icon: string;
  description: string;
  color: string;
  iconName: string;
}

interface ServiceDetails {
  vehicle?: string;
  notes?: string;
}

interface User {
  name: string;
  email: string;
  phone: string;
}

interface ServiceRequest {
  id: number;
  service: Service;
  date: string;
  status: string;
  details: ServiceDetails;
}

// Main App Component with Screen Management
const App = () => {
  const [currentScreen, setCurrentScreen] = useState<string>('Login');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const navigateTo = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('Home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('Login');
  };

  // Render the appropriate screen based on currentScreen state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return <LoginScreen navigation={{ navigate: navigateTo }} onLogin={handleLogin} />;
      case 'Register':
        return <RegisterScreen navigation={{ navigate: navigateTo, goBack: () => setCurrentScreen('Login') }} />;
      case 'Home':
        return <HomeScreen navigation={{ navigate: navigateTo }} onLogout={handleLogout} />;
      case 'Services':
        return <ServicesScreen navigation={{ navigate: navigateTo }} />;
      case 'History':
        return <HistoryScreen navigation={{ navigate: navigateTo }} />;
      case 'Profile':
        return <ProfileScreen navigation={{ navigate: navigateTo, navigateToLogin: () => setCurrentScreen('Login') }} />;
      case 'Contact':
        return <ContactScreen navigation={{ navigate: navigateTo }} />;
      default:
        return <LoginScreen navigation={{ navigate: navigateTo }} onLogin={handleLogin} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderScreen()}
    </SafeAreaView>
  );
};

// Login Screen Component
const LoginScreen = ({ navigation, onLogin }: any) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const logoScale = useState(new Animated.Value(0.8))[0];
  const buttonScale = useState(new Animated.Value(1))[0];

  useEffect(() => {
    // Animate on component mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogin = (): void => {
    if (email && password) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        onLogin();
      }, 1500);
    } else {
      shakeAnimation();
      Alert.alert('Error', 'Please enter both email and password');
    }
  };

  const shakeAnimation = () => {
    const shake = new Animated.Value(0);
    
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground 
        source={{uri: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'}} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.loginContainer}>
              {/* Animated Logo */}
              <Animated.View style={[styles.logoContainer, {
                opacity: fadeAnim,
                transform: [{ scale: logoScale }]
              }]}>
                <Icon name="directions-car" size={80} color="#fff" style={styles.logoIcon} />
                <Text style={styles.logoText}>RoadGuard</Text>
              </Animated.View>
              
              {/* Animated Title */}
              <Animated.View style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }}>
                <Text style={styles.subtitle}>24/7 Roadside Assistance</Text>
              </Animated.View>
              
              {/* Animated Form */}
              <Animated.View style={[styles.form, {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }]}>
                <View style={styles.inputContainer}>
                  <View style={styles.inputLabelContainer}>
                    <Icon name="email" size={18} color="#fff" style={styles.inputIcon} />
                    <Text style={styles.inputLabel}>Email</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <View style={styles.inputLabelContainer}>
                    <Icon name="lock" size={18} color="#fff" style={styles.inputIcon} />
                    <Text style={styles.inputLabel}>Password</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#aaa"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  <TouchableOpacity style={styles.forgotPasswordButton}>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
                
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <TouchableOpacity 
                    style={[styles.loginButton, styles.buttonWithIcon]} 
                    onPressIn={animateButtonPress}
                    onPress={handleLogin} 
                    disabled={isLoading}
                    activeOpacity={0.9}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <>
                        <Text style={styles.loginButtonText}>Login</Text>
                        <Icon name="arrow-forward" size={20} color="white" />
                      </>
                    )}
                  </TouchableOpacity>
                </Animated.View>
                
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>Or continue with</Text>
                  <View style={styles.dividerLine} />
                </View>
                
                <View style={styles.socialButtons}>
                  <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
                    <FontAwesome name="google" size={20} color="#DB4437" style={styles.socialIcon} />
                    <Text style={styles.socialButtonText}>Google</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
                    <FontAwesome name="facebook" size={20} color="#4267B2" style={styles.socialIcon} />
                    <Text style={styles.socialButtonText}>Facebook</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.signupContainer}>
                  <Text style={styles.signupPrompt}>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.signupLink}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

// Register Screen Component
const RegisterScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground 
        source={{uri: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'}} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.loginContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <Icon name="directions-car" size={80} color="#fff" style={styles.logoIcon} />
            <Text style={styles.logoText}>RoadGuard</Text>
          </View>
          
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join RoadGuard today</Text>
          
          <ScrollView style={styles.formScroll} contentContainerStyle={styles.formScrollContent}>
            <View style={styles.inputContainer}>
              <View style={styles.inputLabelContainer}>
                <Icon name="person" size={18} color="#fff" style={styles.inputIcon} />
                <Text style={styles.inputLabel}>Full Name</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#aaa"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputLabelContainer}>
                <Icon name="email" size={18} color="#fff" style={styles.inputIcon} />
                <Text style={styles.inputLabel}>Email</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputLabelContainer}>
                <Icon name="phone" size={18} color="#fff" style={styles.inputIcon} />
                <Text style={styles.inputLabel}>Phone Number</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputLabelContainer}>
                <Icon name="lock" size={18} color="#fff" style={styles.inputIcon} />
                <Text style={styles.inputLabel}>Password</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor="#aaa"
                secureTextEntry
              />
            </View>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputLabelContainer}>
                <Icon name="lock-outline" size={18} color="#fff" style={styles.inputIcon} />
                <Text style={styles.inputLabel}>Confirm Password</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#aaa"
                secureTextEntry
              />
            </View>
            
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Create Account</Text>
            </TouchableOpacity>
            
            <View style={styles.signupContainer}>
              <Text style={styles.signupPrompt}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.signupLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

// Home Screen Component
const HomeScreen = ({ navigation, onLogout }: any) => {
  const [userLocation, setUserLocation] = useState<string>('123 Main St, Cityville');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const services: Service[] = [
    { id: 1, name: 'Out of Gas', icon: '⛽', description: 'We\'ll bring fuel to your location', color: '#FF9F1C', iconName: 'local-gas-station' },
    { id: 2, name: 'Tire Change', icon: '🔧', description: 'Flat tire assistance', color: '#E71D36', iconName: 'build' },
    { id: 3, name: 'Jump Start', icon: '🔋', description: 'Battery jump start service', color: '#2EC4B6', iconName: 'battery-charging-full' },
    { id: 4, name: 'Lockout Service', icon: '🔑', description: 'Locked out of your vehicle?', color: '#FF3366', iconName: 'lock' },
    { id: 5, name: 'Towing', icon: '🚛', description: 'Vehicle towing services', color: '#5B6C5D', iconName: 'local-shipping' },
    { id: 6, name: 'Other Assistance', icon: '❓', description: 'Other roadside issues', color: '#6A7B76', iconName: 'help' },
  ];

  const handleServiceSelect = (service: Service): void => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  const confirmServiceRequest = (): void => {
    if (!selectedService) return;
    
    setShowServiceModal(false);
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Service Requested',
        `Help is on the way for ${selectedService.name}! Our assistance team will contact you shortly.`,
        [{ text: 'OK', onPress: () => setSelectedService(null) }]
      );
    }, 2000);
  };

  const renderServiceModal = () => {
    if (!selectedService) return null;
    
    return (
      <Modal
        visible={showServiceModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowServiceModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Icon name={selectedService.iconName} size={30} color={selectedService.color} />
              <Text style={styles.modalTitle}>Request {selectedService.name}</Text>
            </View>
            <Text style={styles.modalDescription}>{selectedService.description}</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputLabelContainer}>
                <Icon name="directions-car" size={18} color="#2D5D3F" style={styles.inputIcon} />
                <Text style={styles.inputLabel}>Vehicle details</Text>
              </View>
              <TextInput
                style={styles.modalInput}
                placeholder="Make, model, color, license plate"
                placeholderTextColor="#aaa"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputLabelContainer}>
                <Icon name="notes" size={18} color="#2D5D3F" style={styles.inputIcon} />
                <Text style={styles.inputLabel}>Additional notes (optional)</Text>
              </View>
              <TextInput
                style={[styles.modalInput, { height: 100 }]}
                placeholder="Any additional information that might help"
                placeholderTextColor="#aaa"
                multiline
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowServiceModal(false)}
              >
                <Icon name="close" size={18} color="#6c757d" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={confirmServiceRequest}
              >
                <Icon name="check" size={18} color="white" />
                <Text style={styles.confirmButtonText}>Request Help</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="directions-car" size={28} color="#fff" />
          <View>
            <Text style={styles.headerTitle}>RoadGuard Assistance</Text>
            <Text style={styles.headerSubtitle}>24/7 Roadside Help</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Icon name="logout" size={20} color="#8FE388" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.servicesContainer}>
        <Text style={styles.welcomeText}>Hello, how can we help you today?</Text>
        
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={20} color="#2D5D3F" />
          <Text style={styles.locationText}>Your location: {userLocation}</Text>
          <TouchableOpacity style={styles.locationButton}>
            <Text style={styles.changeLocation}>Update</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.servicesGrid}>
          {services.map(service => (
            <TouchableOpacity 
              key={service.id} 
              style={[
                styles.serviceCard,
                { borderLeftColor: service.color, borderLeftWidth: 5 }
              ]}
              onPress={() => handleServiceSelect(service)}
              activeOpacity={0.7}
            >
              <Icon name={service.iconName} size={40} color={service.color} />
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.emergencyContainer}>
          <Icon name="warning" size={30} color="#856404" />
          <Text style={styles.emergencyTitle}>Emergency Contact</Text>
          <Text style={styles.emergencyNumber}>1-800-ROAD-HELP</Text>
          <Text style={styles.emergencyText}>Available 24/7 for immediate assistance</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={styles.statusHeader}>
            <Icon name="info" size={24} color="#2D5D3F" />
            <Text style={styles.statusTitle}>Service Status</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={styles.statusIndicator} />
            <Text style={styles.statusText}>No active requests</Text>
          </View>
        </View>
      </ScrollView>
      
      {renderServiceModal()}
    </SafeAreaView>
  );
};

// Services Screen Component
const ServicesScreen = ({ navigation }: any) => {
  const services: Service[] = [
    { id: 1, name: 'Out of Gas', icon: '⛽', description: 'We\'ll bring fuel to your location', color: '#FF9F1C', iconName: 'local-gas-station' },
    { id: 2, name: 'Tire Change', icon: '🔧', description: 'Flat tire assistance', color: '#E71D36', iconName: 'build' },
    { id: 3, name: 'Jump Start', icon: '🔋', description: 'Battery jump start service', color: '#2EC4B6', iconName: 'battery-charging-full' },
    { id: 4, name: 'Lockout Service', icon: '🔑', description: 'Locked out of your vehicle?', color: '#FF3366', iconName: 'lock' },
    { id: 5, name: 'Towing', icon: '🚛', description: 'Vehicle towing services', color: '#5B6C5D', iconName: 'local-shipping' },
    { id: 6, name: 'Other Assistance', icon: '❓', description: 'Other roadside issues', color: '#6A7B76', iconName: 'help' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="miscellaneous-services" size={28} color="#fff" />
          <Text style={styles.headerTitle}>Our Services</Text>
        </View>
      </View>
      
      <ScrollView style={styles.servicesContainer}>
        <Text style={styles.welcomeText}>Comprehensive Roadside Assistance</Text>
        <Text style={styles.sectionDescription}>
          RoadGuard offers a wide range of services to get you back on the road quickly and safely.
        </Text>
        
        <View style={styles.servicesList}>
          {services.map(service => (
            <View key={service.id} style={[styles.serviceListItem, { borderLeftColor: service.color }]}>
              <View style={styles.serviceIconContainer}>
                <Icon name={service.iconName} size={30} color={service.color} />
              </View>
              <View style={styles.serviceDetails}>
                <Text style={styles.serviceListName}>{service.name}</Text>
                <Text style={styles.serviceListDescription}>{service.description}</Text>
              </View>
              <TouchableOpacity style={styles.serviceInfoButton}>
                <Icon name="info" size={20} color="#6c757d" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        
        <View style={styles.pricingContainer}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.pricingCard}>
            <Text style={styles.pricingTitle}>Basic Assistance</Text>
            <Text style={styles.pricingPrice}>$49.99</Text>
            <Text style={styles.pricingDescription}>For services like jump starts and lockout assistance</Text>
          </View>
          <View style={styles.pricingCard}>
            <Text style={styles.pricingTitle}>Towing Service</Text>
            <Text style={styles.pricingPrice}>$3.50/mile</Text>
            <Text style={styles.pricingDescription}>First 5 miles free for members</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// History Screen Component
const HistoryScreen = ({ navigation }: any) => {
  const services: Service[] = [
    { id: 1, name: 'Out of Gas', icon: '⛽', description: 'We\'ll bring fuel to your location', color: '#FF9F1C', iconName: 'local-gas-station' },
    { id: 2, name: 'Tire Change', icon: '🔧', description: 'Flat tire assistance', color: '#E71D36', iconName: 'build' },
    { id: 3, name: 'Jump Start', icon: '🔋', description: 'Battery jump start service', color: '#2EC4B6', iconName: 'battery-charging-full' },
  ];

  const serviceRequests: ServiceRequest[] = [
    { id: 1, service: services[0], date: '2023-10-15 14:30', status: 'Completed', details: { vehicle: 'Toyota Camry' } },
    { id: 2, service: services[1], date: '2023-09-22 09:15', status: 'Completed', details: { vehicle: 'Honda Civic' } },
    { id: 3, service: services[2], date: '2023-08-05 17:45', status: 'Cancelled', details: { vehicle: 'Ford F-150' } },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return '#28a745';
      case 'In Progress': return '#17a2b8';
      case 'Cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="history" size={28} color="#fff" />
          <Text style={styles.headerTitle}>Service History</Text>
        </View>
      </View>
      
      <ScrollView style={styles.servicesContainer}>
        <Text style={styles.welcomeText}>Your Service Requests</Text>
        <Text style={styles.sectionDescription}>
          View your past service requests and their status.
        </Text>
        
        {serviceRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="history-toggle-off" size={50} color="#6c757d" />
            <Text style={styles.emptyStateText}>No service history yet</Text>
            <Text style={styles.emptyStateSubtext}>Your service requests will appear here</Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {serviceRequests.map(request => (
              <View key={request.id} style={styles.historyCard}>
                <View style={[styles.historyStatus, { backgroundColor: getStatusColor(request.status) }]}>
                  <Text style={styles.historyStatusText}>{request.status}</Text>
                </View>
                <View style={styles.historyContent}>
                  <View style={styles.historyService}>
                    <Icon name={request.service.iconName} size={24} color={request.service.color} />
                    <Text style={styles.historyServiceName}>{request.service.name}</Text>
                  </View>
                  <Text style={styles.historyDate}>{request.date}</Text>
                  <Text style={styles.historyVehicle}>{request.details.vehicle}</Text>
                </View>
                <TouchableOpacity style={styles.historyAction}>
                  <Icon name="chevron-right" size={24} color="#6c757d" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Service Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{serviceRequests.length}</Text>
              <Text style={styles.statLabel}>Total Requests</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {serviceRequests.filter(r => r.status === 'Completed').length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Years with us</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Profile Screen Component
const ProfileScreen = ({ navigation }: any) => {
  const user: User = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567'
  };

  const menuItems = [
    { id: 1, title: 'Payment Methods', icon: 'payment', color: '#4CAF50' },
    { id: 2, title: 'Vehicles', icon: 'directions-car', color: '#2196F3' },
    { id: 3, title: 'Notifications', icon: 'notifications', color: '#FF9800' },
    { id: 4, title: 'Settings', icon: 'settings', color: '#9E9E9E' },
    { id: 5, title: 'Help & Support', icon: 'help', color: '#607D8B' },
    { id: 6, title: 'About RoadGuard', icon: 'info', color: '#795548' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="person" size={28} color="#fff" />
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
      </View>
      
      <ScrollView style={styles.servicesContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Icon name="edit" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>
        
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Icon name="email" size={20} color="#2D5D3F" />
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="phone" size={20} color="#2D5D3F" />
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="location-on" size={20} color="#2D5D3F" />
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>123 Main St, Cityville, ST 12345</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuList}>
            {menuItems.map(item => (
              <TouchableOpacity key={item.id} style={styles.menuItem}>
                <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                  <Icon name={item.icon} size={20} color="white" />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
                <Icon name="chevron-right" size={20} color="#6c757d" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButtonLarge} onPress={() => navigation.navigateToLogin()}>
          <Icon name="logout" size={20} color="#dc3545" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Contact Screen Component
const ContactScreen = ({ navigation }: any) => {
  const [message, setMessage] = useState<string>('');
  const [subject, setSubject] = useState<string>('');

  const contactMethods = [
    { id: 1, title: 'Emergency Hotline', value: '1-800-ROAD-HELP', icon: 'local-police', color: '#dc3545' },
    { id: 2, title: 'Customer Service', value: '1-800-HELP-NOW', icon: 'headset-mic', color: '#17a2b8' },
    { id: 3, title: 'Email', value: 'help@roadguard.com', icon: 'email', color: '#6c757d' },
    { id: 4, title: 'Business Hours', value: '24/7', icon: 'access-time', color: '#28a745' },
  ];

  const sendMessage = () => {
    if (!subject || !message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    Alert.alert('Message Sent', 'We will get back to you as soon as possible.');
    setSubject('');
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="contact-support" size={28} color="#fff" />
          <Text style={styles.headerTitle}>Contact Us</Text>
        </View>
      </View>
      
      <ScrollView style={styles.servicesContainer}>
        <Text style={styles.welcomeText}>We're Here to Help</Text>
        <Text style={styles.sectionDescription}>
          Get in touch with our support team for any questions or concerns.
        </Text>
        
        <View style={styles.contactMethods}>
          {contactMethods.map(method => (
            <View key={method.id} style={styles.contactMethod}>
              <View style={[styles.contactIcon, { backgroundColor: method.color }]}>
                <Icon name={method.icon} size={24} color="white" />
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactTitle}>{method.title}</Text>
                <Text style={styles.contactValue}>{method.value}</Text>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.contactForm}>
          <Text style={styles.sectionTitle}>Send us a Message</Text>
          
          <View style={styles.inputContainer}>
            <View style={styles.inputLabelContainer}>
              <Icon name="subject" size={18} color="#2D5D3F" style={styles.inputIcon} />
              <Text style={styles.inputLabel}>Subject</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="What is this regarding?"
              placeholderTextColor="#aaa"
              value={subject}
              onChangeText={setSubject}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <View style={styles.inputLabelContainer}>
              <Icon name="message" size={18} color="#2D5D3F" style={styles.inputIcon} />
              <Text style={styles.inputLabel}>Message</Text>
            </View>
            <TextInput
              style={[styles.input, { height: 120 }]}
              placeholder="Type your message here..."
              placeholderTextColor="#aaa"
              value={message}
              onChangeText={setMessage}
              multiline
              textAlignVertical="top"
            />
          </View>
          
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Icon name="send" size={20} color="white" />
            <Text style={styles.sendButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          <TouchableOpacity style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How quickly can someone reach me?</Text>
            <Icon name="chevron-right" size={20} color="#6c757d" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What areas do you service?</Text>
            <Icon name="chevron-right" size={20} color="#6c757d" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Do you work with my insurance?</Text>
            <Icon name="chevron-right" size={20} color="#6c757d" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How does billing work?</Text>
            <Icon name="chevron-right" size={20} color="#6c757d" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    marginBottom: 10,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 40,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  formScroll: {
    width: '100%',
    maxWidth: 400,
  },
  formScrollContent: {
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputLabel: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    color: '#333',
  },
  forgotPasswordButton: {
    position: 'absolute',
    right: 15,
    top: 50,
  },
  forgotPassword: {
    color: '#8FE388',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#2D5D3F',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonWithIcon: {
    justifyContent: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 10,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    backgroundColor: 'white',
  },
  googleButton: {
    borderWidth: 1,
    borderColor: '#DB4437',
  },
  facebookButton: {
    borderWidth: 1,
    borderColor: '#4267B2',
  },
  socialIcon: {
    marginRight: 10,
  },
  socialButtonText: {
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupPrompt: {
    color: 'white',
  },
  signupLink: {
    color: '#8FE388',
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  backButtonText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#2D5D3F',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  logoutText: {
    color: '#8FE388',
    marginLeft: 5,
    fontWeight: '600',
  },
  servicesContainer: {
    flex: 1,
    padding: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5D3F',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  locationText: {
    flex: 1,
    marginLeft: 10,
    color: '#2D5D3F',
  },
  locationButton: {
    padding: 5,
  },
  changeLocation: {
    color: '#2D5D3F',
    fontWeight: '600',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  serviceCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5D3F',
    marginTop: 10,
    textAlign: 'center',
  },
  serviceDescription: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 5,
    textAlign: 'center',
  },
  emergencyContainer: {
    backgroundColor: '#FFF3CD',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFEEBA',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#856404',
    marginTop: 10,
  },
  emergencyNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#856404',
    marginVertical: 10,
  },
  emergencyText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
  statusContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5D3F',
    marginLeft: 10,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#28a745',
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#2D5D3F',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5D3F',
    marginLeft: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  confirmButton: {
    backgroundColor: '#2D5D3F',
  },
  cancelButtonText: {
    color: '#6c757d',
    fontWeight: '600',
    marginLeft: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 5,
  },
  servicesList: {
    marginBottom: 20,
  },
  serviceListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  serviceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceListName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5D3F',
    marginBottom: 5,
  },
  serviceListDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  serviceInfoButton: {
    padding: 5,
  },
  pricingContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5D3F',
    marginBottom: 15,
  },
  pricingCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5D3F',
    marginBottom: 5,
  },
  pricingPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 10,
  },
  pricingDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c757d',
    marginTop: 15,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 5,
  },
  historyList: {
    marginBottom: 20,
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  historyStatus: {
    padding: 8,
  },
  historyStatusText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  historyContent: {
    padding: 15,
  },
  historyService: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyServiceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5D3F',
    marginLeft: 10,
  },
  historyDate: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
  },
  historyVehicle: {
    fontSize: 14,
    color: '#2D5D3F',
  },
  historyAction: {
    position: 'absolute',
    right: 15,
    top: 50,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5D3F',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#2D5D3F',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5D3F',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#6c757d',
  },
  profileSection: {
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 10,
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    color: '#2D5D3F',
    flex: 1,
  },
  menuList: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#2D5D3F',
    flex: 1,
  },
  logoutButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#dc3545',
    fontWeight: '600',
    marginLeft: 10,
  },
  contactMethods: {
    marginBottom: 20,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactDetails: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5D3F',
    marginBottom: 5,
  },
  contactValue: {
    fontSize: 14,
    color: '#6c757d',
  },
  contactForm: {
    marginBottom: 20,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D5D3F',
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  faqSection: {
    marginBottom: 20,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  faqQuestion: {
    fontSize: 16,
    color: '#2D5D3F',
    flex: 1,
  },
});

export default App;