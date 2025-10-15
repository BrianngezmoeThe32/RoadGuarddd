import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
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

  const fadeAnim = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const contentSlide = useSharedValue(30);
  const formOpacity = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    contentSlide.value = withDelay(200, withSpring(0, { damping: 15 }));
    formOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
  }, []);

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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      await register(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phone
      );

      Alert.alert("Success", "Account created successfully!");
      router.replace("/home");
    } catch (error) {
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
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.headerContainer, animatedContent]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Icon name="arrow-back" size={24} color="#1a237e" />
              <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>

            <Animated.View style={[styles.logoContainer, animatedLogo]}>
              <View style={styles.logoCircle}>
                <Icon name="security" size={40} color="#1a237e" />
              </View>
            </Animated.View>

            <View style={styles.textContainer}>
              <Text style={styles.appName}>ROADGUARD</Text>
              <View style={styles.titleUnderline} />
              <Text style={styles.subtitle}>Premium Roadside Assistance</Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.formContainer, animatedForm]}>
            <View style={styles.formCard}>
              <Text style={styles.welcomeText}>Create Account</Text>
              <Text style={styles.registerPrompt}>
                Join our premium service
              </Text>

              <View style={styles.inputsContainer}>
                <Input
                  label="FULL NAME"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChangeText={(value) => handleInputChange("fullName", value)}
                  icon={<Icon name="person" size={20} color="#1a237e" />}
                />

                <Input
                  label="EMAIL"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={<Icon name="email" size={20} color="#1a237e" />}
                />

                <Input
                  label="PHONE NUMBER"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange("phone", value)}
                  keyboardType="phone-pad"
                  icon={<Icon name="phone" size={20} color="#1a237e" />}
                />

                <Input
                  label="PASSWORD"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  secureTextEntry
                  icon={<Icon name="lock" size={20} color="#1a237e" />}
                />

                <Input
                  label="CONFIRM PASSWORD"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  secureTextEntry
                  icon={<Icon name="lock-outline" size={20} color="#1a237e" />}
                />
              </View>

              <Button
                title={isLoading ? "Creating Account..." : "SIGN UP"}
                onPress={handleRegister}
                loading={isLoading}
                disabled={isLoading}
                style={styles.registerButton}
                textStyle={styles.registerButtonText}
                icon={
                  <Icon
                    name="person-add"
                    size={20}
                    color="#FFFFFF"
                    style={styles.buttonIcon}
                  />
                }
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or sign up with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialContainer}>
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

              <View style={styles.loginContainer}>
                <Text style={styles.loginPrompt}>
                  Already have an account?{" "}
                </Text>
                <Button
                  title="SIGN IN"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  headerContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 20,
    padding: 8,
  },
  backButtonText: {
    color: "#1a237e",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1a237e",
    shadowColor: "#1a237e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  textContainer: {
    alignItems: "center",
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1a237e",
    letterSpacing: 2,
    marginBottom: 8,
  },
  titleUnderline: {
    width: 50,
    height: 3,
    backgroundColor: "#1a237e",
    borderRadius: 2,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    letterSpacing: 0.5,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  formCard: {
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
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a237e",
    textAlign: "center",
    marginBottom: 8,
  },
  registerPrompt: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "400",
  },
  inputsContainer: {
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: "#1a237e",
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: "#1a237e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  dividerText: {
    color: "#999",
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: "500",
  },
  socialContainer: {
    alignItems: "center",
    marginBottom: 20,
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
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginPrompt: {
    color: "#666",
    fontSize: 14,
    fontWeight: "400",
  },
  loginButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 36,
    borderColor: "#1a237e",
  },
  loginText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a237e",
  },
});

export default RegisterScreen;
