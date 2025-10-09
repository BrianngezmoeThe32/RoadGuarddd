// app/splash.tsx
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function SplashScreen() {
  // Animation values
  const fadeAnim = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const logoRotate = useSharedValue(0);
  const textSlide = useSharedValue(50);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // Animation sequence
    fadeAnim.value = withTiming(1, { duration: 800 });
    logoScale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });
    logoRotate.value = withSequence(
      withTiming(-10, { duration: 300 }),
      withSpring(0, { damping: 8 })
    );
    textSlide.value = withDelay(400, withSpring(0, { damping: 15 }));
    glowOpacity.value = withDelay(600, withTiming(1, { duration: 1000 }));

    // Navigate to login after delay
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const animatedBackground = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const animatedLogo = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const animatedText = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: textSlide.value }],
  }));

  const animatedGlow = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

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

          {/* Animated glow effect */}
          <Animated.View style={[styles.glowEffect, animatedGlow]} />
        </ImageBackground>
      </Animated.View>

      <View style={styles.content}>
        {/* Main Logo */}
        <Animated.View style={[styles.logoContainer, animatedLogo]}>
          <View style={styles.logoCircle}>
            <Icon name="security" size={50} color="#FFFFFF" />
          </View>
          <Animated.View style={[styles.logoGlow, animatedGlow]} />
        </Animated.View>

        {/* App Name */}
        <Animated.View style={[styles.textContainer, animatedText]}>
          <Text style={styles.appName}>ROADGUARD</Text>
          <View style={styles.titleUnderline} />
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={[styles.taglineContainer, animatedText]}>
          <Text style={styles.tagline}>Premium Roadside Assistance</Text>
          <Text style={styles.subTagline}>24/7 Protection • Elite Service</Text>
        </Animated.View>

        {/* Loading Indicator */}
        <Animated.View style={[styles.loadingContainer, animatedText]}>
          <View style={styles.loadingDots}>
            <Animated.View style={[styles.dot, animatedGlow]} />
            <Animated.View
              style={[styles.dot, animatedGlow, styles.dotMiddle]}
            />
            <Animated.View style={[styles.dot, animatedGlow]} />
          </View>
          <Text style={styles.loadingText}>Initializing Security</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26, 35, 126, 0.85)", // Deep blue overlay
  },
  glowEffect: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(76, 175, 80, 0.1)", // Subtle green glow
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    top: -10,
    left: -10,
    zIndex: -1,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  appName: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 4,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    marginBottom: 8,
  },
  titleUnderline: {
    width: 80,
    height: 3,
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  taglineContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  tagline: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    letterSpacing: 1,
    marginBottom: 4,
  },
  subTagline: {
    fontSize: 14,
    fontWeight: "300",
    color: "rgba(255, 255, 255, 0.7)",
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: "center",
  },
  loadingDots: {
    flexDirection: "row",
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginHorizontal: 4,
  },
  dotMiddle: {
    transform: [{ scale: 1.2 }],
  },
  loadingText: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.6)",
    letterSpacing: 1,
  },
});
