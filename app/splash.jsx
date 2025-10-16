// app/splash.tsx
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
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
import Icon from "react-native-vector-icons/MaterialIcons";

export default function SplashScreen() {
  // Animation values
  const fadeAnim = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const contentSlide = useSharedValue(30);
  const formOpacity = useSharedValue(0);

  useEffect(() => {
    // Staggered animation sequence - matching login screen timing
    fadeAnim.value = withTiming(1, { duration: 800 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    contentSlide.value = withDelay(200, withSpring(0, { damping: 15 }));
    formOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));

    // Navigate to login after delay
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 3500);

    return () => clearTimeout(timer);
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

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent
      />

      <View style={styles.content}>
        {/* Logo Section - Matching login screen */}
        <Animated.View style={[styles.headerContainer, animatedContent]}>
          <Animated.View style={[styles.logoContainer, animatedLogo]}>
            <View style={styles.logoCircle}>
              <Icon name="directions-car" size={50} color="#1a237e" />
            </View>
          </Animated.View>

          <View style={styles.textContainer}>
            <Text style={styles.appName}>ROADGUARD</Text>
            <View style={styles.titleUnderline} />
            <Text style={styles.subtitle}>Premium Roadside Assistance</Text>
          </View>
        </Animated.View>

        {/* Loading Section */}
        <Animated.View style={[styles.loadingContainer, animatedForm]}>
          <View style={styles.loadingDots}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotMiddle]} />
            <View style={styles.dot} />
          </View>
          <Text style={styles.loadingText}>Starting your engine</Text>
        </Animated.View>

        {/* Services Preview - Subtle icons at bottom */}
        <Animated.View style={[styles.servicesPreview, animatedForm]}>
          <View style={styles.serviceIcons}>
            <View style={styles.serviceIcon}>
              <Icon name="build" size={24} color="#1a237e" />
            </View>
            <View style={styles.serviceIcon}>
              <Icon name="local-shipping" size={24} color="#1a237e" />
            </View>
            <View style={styles.serviceIcon}>
              <Icon name="local-gas-station" size={24} color="#1a237e" />
            </View>
            <View style={styles.serviceIcon}>
              <Icon name="battery-charging-full" size={24} color="#1a237e" />
            </View>
          </View>
          <Text style={styles.servicesText}>Towing • Repairs • Fuel • 24/7</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
    fontSize: 36,
    fontWeight: "800",
    color: "#1a237e",
    letterSpacing: 2,
    marginBottom: 8,
  },
  titleUnderline: {
    width: 60,
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
  loadingContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  loadingDots: {
    flexDirection: "row",
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1a237e",
    marginHorizontal: 4,
  },
  dotMiddle: {
    transform: [{ scale: 1.2 }],
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    letterSpacing: 0.5,
  },
  servicesPreview: {
    alignItems: "center",
  },
  serviceIcons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 12,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  servicesText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
    letterSpacing: 0.5,
  },
});