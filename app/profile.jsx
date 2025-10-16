import { router } from "expo-router";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.displayName?.[0]?.toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.profileName}>{user?.displayName || "User"}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.actionsCard}>
            <Button
              title="Edit Profile"
              onPress={() => router.push("/settings")}
              variant="outline"
              style={styles.actionButton}
              textStyle={styles.actionButtonText}
              icon={<Icon name="edit" size={20} color="#1a237e" />}
            />

            <Button
              title="Service History"
              onPress={() => router.push("/history")}
              variant="outline"
              style={styles.actionButton}
              textStyle={styles.actionButtonText}
              icon={<Icon name="history" size={20} color="#1a237e" />}
            />

            <Button
              title="Contact Support"
              onPress={() => router.push("/contact")}
              variant="outline"
              style={styles.actionButton}
              textStyle={styles.actionButtonText}
              icon={<Icon name="support" size={20} color="#1a237e" />}
            />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
            icon={<Icon name="logout" size={20} color="#d32f2f" />}
          />
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
  content: {
    flex: 1,
    padding: 24,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 40,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1a237e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "700",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a237e",
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
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
  actionButton: {
    paddingVertical: 12,
    borderColor: "#E5E5E5",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a237e",
    letterSpacing: 0.5,
  },
  logoutButton: {
    paddingVertical: 12,
    borderColor: "#d32f2f",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#d32f2f",
    letterSpacing: 0.5,
  },
});
