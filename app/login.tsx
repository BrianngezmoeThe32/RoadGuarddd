import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/MaterialIcons";

import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { COLORS } from "../constants/colors";
import { useAuth } from "../hooks/useAuth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();

  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  const logoScale = useSharedValue(0.8);

  useEffect(() => {
    // Start animations
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 15 });
    logoScale.value = withSpring(1, { damping: 10 });
  }, []);

  const animatedLogo = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: logoScale.value }],
  }));

  const animatedContent = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
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
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      }}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.loginContainer}>
            <Animated.View style={[styles.logoContainer, animatedLogo]}>
              <Icon name="directions-car" size={80} color={COLORS.white} />
              <Text style={styles.logoText}>RoadGuard</Text>
            </Animated.View>

            <Animated.View style={animatedContent}>
              <Text style={styles.subtitle}>24/7 Roadside Assistance</Text>
            </Animated.View>

            <Animated.View style={[styles.form, animatedContent]}>
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                icon={<Icon name="email" size={20} color={COLORS.primary} />}
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon={<Icon name="lock" size={20} color={COLORS.primary} />}
              />

              <Button
                title="Login"
                onPress={handleLogin}
                loading={isLoading}
                icon={
                  <Icon
                    name="arrow-forward"
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                  />
                }
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                <Button
                  title="Google"
                  variant="outline"
                  onPress={() => {}}
                  icon={
                    <FontAwesome
                      name="google"
                      size={20}
                      color="#DB4437"
                      style={styles.buttonIcon}
                    />
                  }
                  style={styles.socialButton}
                />
                <Button
                  title="Facebook"
                  variant="outline"
                  onPress={() => {}}
                  icon={
                    <FontAwesome
                      name="facebook"
                      size={20}
                      color="#4267B2"
                      style={styles.buttonIcon}
                    />
                  }
                  style={styles.socialButton}
                />
              </View>

              <View style={styles.signupContainer}>
                <Text style={styles.signupPrompt}>Don't have an account? </Text>
                <Button
                  title="Sign Up"
                  variant="outline"
                  onPress={() => router.push("/register")}
                  style={styles.signupButton}
                  textStyle={styles.signupText}
                />
              </View>
            </Animated.View>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 40,
    opacity: 0.9,
  },
  form: {
    width: "100%",
    maxWidth: 400,
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
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dividerText: {
    color: "rgba(255, 255, 255, 0.8)",
    marginHorizontal: 12,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupPrompt: {
    color: COLORS.white,
    fontSize: 16,
  },
  signupButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 40,
  },
  signupText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
