import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
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
  withSpring,
  withTiming,
} from "react-native-reanimated";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Alert } from "react-native";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useAuth } from "../hooks/useAuth";

const RegisterScreen = () => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Animation values
  const fadeAnim = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const contentSlide = useSharedValue(30);
  const formOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // Staggered animation sequence
    fadeAnim.value = withTiming(1, { duration: 800 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    contentSlide.value = withDelay(200, withSpring(0, { damping: 15 }));
    formOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    glowOpacity.value = withDelay(600, withTiming(1, { duration: 1000 }));
  }, []);

  const animatedBackground = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const animatedLogo = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: logoScale.value }],
  }));

  const animatedContent = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: contentSlide.value }],
  }));

  const animatedForm = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
  }));

  const animatedGlow = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    try {
      console.log("🔄 Starting registration with:", formData);

      // ACTUALLY CALL THE REGISTER FUNCTION
      await register(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phone
      );

      console.log("✅ Registration successful!");
      Alert.alert("Success", "Account created successfully!");

      // Navigate to home or login
      router.replace("/home");
    } catch (error) {
      console.error("❌ Registration failed:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection.";
      }

      Alert.alert("Registration Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Animated.View style={[StyleSheet.absoluteFill, animatedBackground]}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
          }}
          style={styles.backgroundImage}
        >
          <View style={styles.overlay} />
          <Animated.View style={[styles.glowEffect, animatedGlow]} />
        </ImageBackground>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <Animated.View style={[styles.headerContainer, animatedContent]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Icon name="arrow-back" size={24} color="white" />
              <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>

            <Animated.View style={[styles.logoContainer, animatedLogo]}>
              <View style={styles.logoCircle}>
                <Icon name="security" size={40} color="#FFFFFF" />
              </View>
              <Animated.View style={[styles.logoGlow, animatedGlow]} />
            </Animated.View>

            <View style={styles.textContainer}>
              <Text style={styles.appName}>ROADGUARD</Text>
              <View style={styles.titleUnderline} />
              <Text style={styles.subtitle}>Join Our Premium Service</Text>
            </View>
          </Animated.View>

          {/* Registration Form */}
          <Animated.View style={[styles.formContainer, animatedForm]}>
            <View style={styles.formCard}>
              <Text style={styles.welcomeText}>Create Account</Text>
              <Text style={styles.registerPrompt}>
                Start your secure journey with us
              </Text>

              <View style={styles.inputsContainer}>
                <Input
                  label="FULL NAME"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChangeText={(value) => handleInputChange("fullName", value)}
                  icon={<Icon name="person" size={20} color="#4CAF50" />}
                  containerStyle={styles.input}
                  labelStyle={styles.inputLabel}
                />

                <Input
                  label="EMAIL"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={<Icon name="email" size={20} color="#4CAF50" />}
                  containerStyle={styles.input}
                  labelStyle={styles.inputLabel}
                />

                <Input
                  label="PHONE NUMBER"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange("phone", value)}
                  keyboardType="phone-pad"
                  icon={<Icon name="phone" size={20} color="#4CAF50" />}
                  containerStyle={styles.input}
                  labelStyle={styles.inputLabel}
                />

                <Input
                  label="PASSWORD"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  secureTextEntry
                  icon={<Icon name="lock" size={20} color="#4CAF50" />}
                  containerStyle={styles.input}
                  labelStyle={styles.inputLabel}
                />

                <Input
                  label="CONFIRM PASSWORD"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  secureTextEntry
                  icon={<Icon name="lock-outline" size={20} color="#4CAF50" />}
                  containerStyle={styles.input}
                  labelStyle={styles.inputLabel}
                />
              </View>

              <Button
                title={isLoading ? "Creating Account..." : "Register"}
                onPress={handleRegister}
                loading={isLoading}
                disabled={isLoading}
                style={styles.registerButton}
                textStyle={styles.registerButtonText}
                icon={
                  <Icon
                    name="security"
                    size={20}
                    color="#FFFFFF"
                    style={styles.buttonIcon}
                  />
                }
              />

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Secure Registration</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Registration */}
              <View style={styles.socialContainer}>
                <Text style={styles.socialTitle}>Quick Registration</Text>
                <View style={styles.socialButtons}>
                  <Button
                    title=""
                    variant="outline"
                    onPress={() => {}}
                    style={styles.socialIconButton}
                    icon={
                      <FontAwesome name="google" size={20} color="#DB4437" />
                    }
                  />
                  <Button
                    title=""
                    variant="outline"
                    onPress={() => {}}
                    style={styles.socialIconButton}
                    icon={
                      <FontAwesome name="apple" size={20} color="#000000" />
                    }
                  />
                  <Button
                    title=""
                    variant="outline"
                    onPress={() => {}}
                    style={styles.socialIconButton}
                    icon={
                      <FontAwesome name="facebook" size={20} color="#4267B2" />
                    }
                  />
                </View>
              </View>

              {/* Login Redirect */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginPrompt}>
                  Already have an account?{" "}
                </Text>
                <Button
                  title="LOGIN HERE"
                  variant="outline"
                  onPress={() => router.back()}
                  style={styles.loginButton}
                  textStyle={styles.loginText}
                />
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

// Add TouchableOpacity import or use Pressable
import { TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a237e",
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26, 35, 126, 0.9)",
  },
  glowEffect: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 30,
    padding: 8,
  },
  backButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  logoGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    top: -10,
    left: -10,
    zIndex: -1,
  },
  textContainer: {
    alignItems: "center",
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 3,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
    marginBottom: 8,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: "#4CAF50",
    borderRadius: 2,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
    letterSpacing: 1,
  },
  formContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a237e",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  registerPrompt: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    fontWeight: "400",
  },
  inputsContainer: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 20,
  },
  inputLabel: {
    fontWeight: "600",
    letterSpacing: 1,
    color: "#1a237e",
    marginBottom: 8,
  },
  registerButton: {
    backgroundColor: "#1a237e",
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: "#1a237e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  dividerText: {
    color: "#666",
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },
  socialContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  socialTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 16,
    letterSpacing: 1,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialIconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "rgba(0, 0, 0, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginPrompt: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 36,
    borderColor: "#1a237e",
  },
  loginText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a237e",
  },
});

export default RegisterScreen;
