import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { COLORS } from "../constants/colors";
import { useAuth } from "../hooks/useAuth";
import {
  validateEmail,
  validateName,
  validatePhone,
} from "../utilis/validators";

export default function ProfileScreen() {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const menuItems = [
    {
      id: 1,
      title: "Payment Methods",
      icon: "payment",
      color: "#4CAF50",
      onPress: () => {},
    },
    {
      id: 2,
      title: "Vehicles",
      icon: "directions-car",
      color: "#2196F3",
      onPress: () => {},
    },
    {
      id: 3,
      title: "Notifications",
      icon: "notifications",
      color: "#FF9800",
      onPress: () => {},
    },
    {
      id: 4,
      title: "Settings",
      icon: "settings",
      color: "#9E9E9E",
      onPress: () => {},
    },
    {
      id: 5,
      title: "Help & Support",
      icon: "help",
      color: "#607D8B",
      onPress: () => router.push("/contact"),
    },
    {
      id: 6,
      title: "About RoadGuard",
      icon: "info",
      color: "#795548",
      onPress: () => {},
    },
  ];

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSave = () => {
    if (!validateForm()) return;

    updateProfile(formData);
    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully");
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setErrors({ name: "", email: "", phone: "" });
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="person" size={28} color={COLORS.white} />
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <Button
          title="Home"
          onPress={() => router.back()}
          variant="outline"
          style={styles.backButton}
          textStyle={styles.backButtonText}
          icon={<Icon name="home" size={16} color={COLORS.primaryLight} />}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
              }}
              style={styles.avatar}
            />
            <Button
              title=""
              onPress={() => {}}
              variant="outline"
              style={styles.editAvatarButton}
              icon={<Icon name="edit" size={16} color={COLORS.white} />}
            />
          </View>
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            {!isEditing ? (
              <Button
                title="Edit"
                onPress={() => setIsEditing(true)}
                variant="outline"
                style={styles.editButton}
                textStyle={styles.editButtonText}
                icon={<Icon name="edit" size={16} color={COLORS.primary} />}
              />
            ) : (
              <View style={styles.editActions}>
                <Button
                  title="Cancel"
                  onPress={handleCancel}
                  variant="outline"
                  style={styles.cancelButton}
                  textStyle={styles.cancelButtonText}
                />
                <Button
                  title="Save"
                  onPress={handleSave}
                  style={styles.saveButton}
                />
              </View>
            )}
          </View>

          <View style={styles.infoCard}>
            <Input
              label="Full Name"
              value={formData.name}
              onChangeText={(value: string) => updateFormData("name", value)}
              error={errors.name}
              editable={isEditing}
              icon={<Icon name="person" size={20} color={COLORS.primary} />}
            />

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(value: string) => updateFormData("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              editable={isEditing}
              icon={<Icon name="email" size={20} color={COLORS.primary} />}
            />

            <Input
              label="Phone Number"
              value={formData.phone}
              onChangeText={(value: string) => updateFormData("phone", value)}
              keyboardType="phone-pad"
              error={errors.phone}
              editable={isEditing}
              icon={<Icon name="phone" size={20} color={COLORS.primary} />}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuList}>
            {menuItems.map((item) => (
              <Button
                key={item.id}
                title={item.title}
                onPress={item.onPress}
                variant="outline"
                style={styles.menuItem}
                textStyle={styles.menuItemText}
                icon={
                  <View
                    style={[styles.menuIcon, { backgroundColor: item.color }]}
                  >
                    <Icon
                      name={item.icon as any}
                      size={20}
                      color={COLORS.white}
                    />
                  </View>
                }
              />
            ))}
          </View>
        </View>

        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
          textStyle={styles.logoutButtonText}
          icon={<Icon name="logout" size={20} color={COLORS.danger} />}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.primary,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  backButtonText: {
    fontSize: 14,
    color: COLORS.primaryLight,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
    padding: 24,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
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
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    padding: 0,
    backgroundColor: COLORS.primary,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: COLORS.gray,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 36,
  },
  editButtonText: {
    fontSize: 14,
  },
  editActions: {
    flexDirection: "row",
    gap: 8,
  },
  cancelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 36,
  },
  cancelButtonText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  saveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 36,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  menuList: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
    overflow: "hidden",
  },
  menuItem: {
    justifyContent: "flex-start",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    textAlign: "left",
    flex: 1,
  },
  logoutButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    marginBottom: 24,
    elevation: 2,
  },
  logoutButtonText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: "600",
  },
});
