import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Switch,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { useLocation } from "../../context/LocationContext";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { currentLocation, refreshLocation } = useLocation();
  
  const [notifications, setNotifications] = React.useState(true);
  const [locationTracking, setLocationTracking] = React.useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = React.useState(true);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            // Implement account deletion
            Alert.alert("Account Deletion", "Account deletion feature to be implemented");
          }
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, rightComponent }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Icon name={icon} size={24} color="#1a237e" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <Button
          title="BACK"
          onPress={() => router.back()}
          variant="outline"
          style={styles.backButton}
          textStyle={styles.backButtonText}
          icon={<Icon name="arrow-back" size={20} color="#1a237e" />}
        />
        <Text style={styles.headerTitle}>SETTINGS</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROFILE</Text>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.displayName?.[0]?.toUpperCase() || "U"}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.displayName || "User"}
              </Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <View style={styles.settingsCard}>
            <SettingItem
              icon="notifications"
              title="Push Notifications"
              subtitle="Receive service updates and alerts"
              rightComponent={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: "#f0f0f0", true: "#1a237e" }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            
            <View style={styles.divider} />
            
            <SettingItem
              icon="location-on"
              title="Location Tracking"
              subtitle="Allow Roadguard to access your location"
              rightComponent={
                <Switch
                  value={locationTracking}
                  onValueChange={setLocationTracking}
                  trackColor={{ false: "#f0f0f0", true: "#1a237e" }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            
            <View style={styles.divider} />
            
            <SettingItem
              icon="warning"
              title="Emergency Alerts"
              subtitle="Critical safety notifications"
              rightComponent={
                <Switch
                  value={emergencyAlerts}
                  onValueChange={setEmergencyAlerts}
                  trackColor={{ false: "#f0f0f0", true: "#1a237e" }}
                  thumbColor="#FFFFFF"
                />
              }
            />
          </View>
        </View>

        {/* Location Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LOCATION INFORMATION</Text>
          <View style={styles.infoCard}>
            <SettingItem
              icon="my-location"
              title="Current Location"
              subtitle={
                currentLocation 
                  ? `Lat: ${currentLocation.latitude.toFixed(4)}, Lng: ${currentLocation.longitude.toFixed(4)}`
                  : "Location not available"
              }
              rightComponent={
                <Button
                  title="UPDATE"
                  onPress={refreshLocation}
                  variant="outline"
                  style={styles.smallButton}
                  textStyle={styles.smallButtonText}
                />
              }
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <View style={styles.settingsCard}>
            <SettingItem
              icon="help"
              title="Help & Support"
              subtitle="Get help with the app"
              rightComponent={
                <Icon name="chevron-right" size={24} color="#666" />
              }
            />
            
            <View style={styles.divider} />
            
            <SettingItem
              icon="description"
              title="Terms of Service"
              subtitle="Legal terms and conditions"
              rightComponent={
                <Icon name="chevron-right" size={24} color="#666" />
              }
            />
            
            <View style={styles.divider} />
            
            <SettingItem
              icon="privacy-tip"
              title="Privacy Policy"
              subtitle="How we handle your data"
              rightComponent={
                <Icon name="chevron-right" size={24} color="#666" />
              }
            />
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.actionsCard}>
            <Button
              title="Delete Account"
              onPress={handleDeleteAccount}
              variant="outline"
              style={styles.dangerButton}
              textStyle={styles.dangerButtonText}
              icon={<Icon name="delete" size={20} color="#d32f2f" />}
            />
            
            <Button
              title="Logout"
              onPress={handleLogout}
              variant="outline"
              style={styles.logoutButton}
              textStyle={styles.logoutButtonText}
              icon={<Icon name="logout" size={20} color="#1a237e" />}
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Roadguard v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 Roadguard. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderColor: "#1a237e",
    minHeight: 40,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a237e",
    letterSpacing: 1,
    marginLeft: 4,
  },
  headerTitle: {
    color: "#1a237e",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 2,
  },
  headerSpacer: {
    width: 80,
  },
  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1a237e",
    letterSpacing: 2,
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1a237e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a237e",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 20,
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 32,
  },
  smallButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  actionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  dangerButton: {
    paddingVertical: 12,
    borderColor: "#d32f2f",
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#d32f2f",
    letterSpacing: 0.5,
  },
  logoutButton: {
    paddingVertical: 12,
    borderColor: "#1a237e",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a237e",
    letterSpacing: 0.5,
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: 20,
  },
  appVersion: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: "#999",
  },
});