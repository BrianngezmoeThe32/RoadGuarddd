import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

const RegisterScreen = () => {
  return (
    <ImageBackground 
      source={{uri: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'}} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.loginContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.signupLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
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
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
});

export default RegisterScreen;