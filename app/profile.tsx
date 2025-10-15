import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../constants/colors";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

export default function ProfileScreen() {
  const { userData, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  // Initialize form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.profile?.firstName || "",
        lastName: userData.profile?.lastName || "",
        phone: userData.phone || "",
        email: userData.email || "",
      });
    }
  }, [userData]);

  const handleSave = async () => {
    try {
      await updateUserProfile({
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        phone: formData.phone,
      });
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: userData?.profile?.firstName || "",
      lastName: userData?.profile?.lastName || "",
      phone: userData?.phone || "",
      email: userData?.email || "",
    });
    setIsEditing(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: userData?.profile?.photoURL || "https://via.placeholder.com/100",
            }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarButton}>
            <Text style={styles.editAvatarText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>
          {userData?.profile?.firstName} {userData?.profile?.lastName}
        </Text>
        <Text style={styles.userEmail}>{userData?.email}</Text>
      </View>

      {/* Profile Form */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {!isEditing ? (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <Input
          label="First Name"
          value={formData.firstName}
          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          editable={isEditing}
          placeholder="Enter your first name"
        />

        <Input
          label="Last Name"
          value={formData.lastName}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          editable={isEditing}
          placeholder="Enter your last name"
        />

        <Input
          label="Email"
          value={formData.email}
          editable={false}
          placeholder="Your email address"
        />

        <Input
          label="Phone"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          editable={isEditing}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />

        {isEditing && (
          <View style={styles.editActions}>
            <Button
              title="Save Changes"
              onPress={handleSave}
              style={styles.saveButton}
            />
            <Button
              title="Cancel"
              variant="outline"
              onPress={handleCancel}
              style={styles.cancelButton}
            />
          </View>
        )}
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Privacy Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Notification Preferences</Text>
        </TouchableOpacity>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Contact Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Terms of Service</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    padding: 6,
    borderRadius: 12,
  },
  editAvatarText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.gray,
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: 16,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
  },
  editButton: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  editActions: {
    marginTop: 16,
    gap: 12,
  },
  saveButton: {
    marginBottom: 0,
  },
  cancelButton: {
    marginBottom: 0,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray + "40",
  },
  menuText: {
    fontSize: 16,
    color: COLORS.black,
  },
});