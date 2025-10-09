// app/login.tsx
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

import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useAuth } from "../hooks/useAuth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();

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

  const handleLogin = async () => {
    if (!email || !password) {
      // Handle validation error
      return;
    }

    try {
      await login(email, password);
      router.replace("/home");
    } catch (error) {
      // Handle login error
      console.error("Login error:", error);
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
          {/* Header Section - Continuation from Splash */}
          <Animated.View style={[styles.headerContainer, animatedContent]}>
            <Animated.View style={[styles.logoContainer, animatedLogo]}>
              <View style={styles.logoCircle}>
                <Icon name="security" size={40} color="#FFFFFF" />
              </View>
              <Animated.View style={[styles.logoGlow, animatedGlow]} />
            </Animated.View>

            <View style={styles.textContainer}>
              <Text style={styles.appName}>ROADGUARD</Text>
              <View style={styles.titleUnderline} />
              <Text style={styles.subtitle}>Premium Roadside Assistance</Text>
            </View>
          </Animated.View>

          {/* Login Form */}
          <Animated.View style={[styles.formContainer, animatedForm]}>
            <View style={styles.formCard}>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.loginPrompt}>
                Sign in to continue your journey
              </Text>

              <View style={styles.inputsContainer}>
                <Input
                  label="EMAIL"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={<Icon name="email" size={20} color="#4CAF50" />}
                  containerStyle={styles.input}
                  labelStyle={styles.inputLabel}
                />

                <Input
                  label="PASSWORD"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  icon={<Icon name="lock" size={20} color="#4CAF50" />}
                  containerStyle={styles.input}
                  labelStyle={styles.inputLabel}
                />
              </View>

              <Button
                title="Login"
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

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Secure Access</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login */}
              <View style={styles.socialContainer}>
                <Text style={styles.socialTitle}>Quick Access</Text>
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

              {/* Sign Up */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupPrompt}>New to RoadGuard? </Text>
                <Button
                  title="CREATE ACCOUNT"
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
  loginPrompt: {
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
  loginButton: {
    backgroundColor: "#1a237e",
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: "#1a237e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
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
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupPrompt: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  signupButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 36,
    borderColor: "#1a237e",
  },
  signupText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a237e",
  },
});
 