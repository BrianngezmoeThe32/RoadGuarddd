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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();

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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      await login(email, password);
      router.replace("/home");
    } catch (error: any) {
      let errorMessage = "Login failed. Please try again.";

      if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else {
        errorMessage = error.message || "Login failed. Please try again.";
      }

      Alert.alert("Error", errorMessage);
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
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.loginPrompt}>Sign in to your account</Text>

              <View style={styles.inputsContainer}>
                <Input
                  label="EMAIL"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={<Icon name="email" size={20} color="#1a237e" />}
                />

                <Input
                  label="PASSWORD"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  icon={<Icon name="lock" size={20} color="#1a237e" />}
                />
              </View>

              <Button
                title="SIGN IN"
                onPress={handleLogin}
                loading={isLoading}
                style={styles.loginButton}
                textStyle={styles.loginButtonText}
                icon={
                  <Icon
                    name="arrow-forward"
                    size={20}
                    color="#FFFFFF"
                    style={styles.buttonIcon}
                  />
                }
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
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

              <View style={styles.signupContainer}>
                <Text style={styles.signupPrompt}>Don't have an account? </Text>
                <Button
                  title="SIGN UP"
                  variant="outline"
                  onPress={() => router.push("/register")}
                  style={styles.signupButton}
                  textStyle={styles.signupText}
                />
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

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
  loginPrompt: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "400",
  },
  inputsContainer: {
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#1a237e",
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: "#1a237e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
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
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupPrompt: {
    color: "#666",
    fontSize: 14,
    fontWeight: "400",
  },
  signupButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 36,
    borderColor: "#1a237e",
  },
  signupText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a237e",
  },
});
