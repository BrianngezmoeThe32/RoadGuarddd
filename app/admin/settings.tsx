import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colors';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
    autoApproveProviders: false,
    maintenanceMode: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from admin panel?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => router.replace('/admin') },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => Alert.alert('Success', 'Cache cleared successfully') },
      ]
    );
  };

  const settingItems = [
    {
      title: 'Push Notifications',
      subtitle: 'Receive push notifications for important events',
      icon: 'notifications',
      key: 'notifications' as keyof typeof settings,
    },
    {
      title: 'Email Alerts',
      subtitle: 'Get email alerts for system events',
      icon: 'email',
      key: 'emailAlerts' as keyof typeof settings,
    },
    {
      title: 'SMS Alerts',
      subtitle: 'Receive SMS alerts for critical issues',
      icon: 'sms',
      key: 'smsAlerts' as keyof typeof settings,
    },
    {
      title: 'Auto-approve Providers',
      subtitle: 'Automatically approve new service providers',
      icon: 'how-to-reg',
      key: 'autoApproveProviders' as keyof typeof settings,
    },
    {
      title: 'Maintenance Mode',
      subtitle: 'Put the system in maintenance mode',
      icon: 'engineering',
      key: 'maintenanceMode' as keyof typeof settings,
    },
  ];

  const actionItems = [
    {
      title: 'Clear Cache',
      subtitle: 'Clear all cached data',
      icon: 'cached',
      color: COLORS.warning,
      onPress: handleClearCache,
    },
    {
      title: 'Export Data',
      subtitle: 'Export system data as CSV',
      icon: 'file-download',
      color: COLORS.info,
      onPress: () => Alert.alert('Export', 'Data export started'),
    },
    {
      title: 'System Logs',
      subtitle: 'View system logs and errors',
      icon: 'list-alt',
      color: COLORS.gray,
      onPress: () => Alert.alert('Logs', 'Opening system logs'),
    },
    {
      title: 'About',
      subtitle: 'App version and information',
      icon: 'info',
      color: COLORS.primary,
      onPress: () => Alert.alert('About', 'RoadGuard Admin v1.0.0'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Admin Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Icon name="admin-panel-settings" size={40} color={COLORS.white} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.adminName}>Administrator</Text>
            <Text style={styles.adminEmail}>admin@roadguard.com</Text>
            <Text style={styles.adminRole}>Super Admin</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          <View style={styles.settingsList}>
            {settingItems.map((item, index) => (
              <View key={index} style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <View style={[styles.settingIcon, { backgroundColor: `${COLORS.primary}20` }]}>
                    <Icon name={item.icon as any} size={20} color={COLORS.primary} />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Switch
                  value={settings[item.key]}
                  onValueChange={() => toggleSetting(item.key)}
                  trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Actions</Text>
          <View style={styles.actionsList}>
            {actionItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionItem}
                onPress={item.onPress}
              >
                <View style={styles.actionInfo}>
                  <View style={[styles.actionIcon, { backgroundColor: `${item.color}20` }]}>
                    <Icon name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <View style={styles.actionText}>
                    <Text style={styles.actionTitle}>{item.title}</Text>
                    <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={20} color={COLORS.gray} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.dangerZone}>
            <TouchableOpacity style={styles.dangerButton} onPress={handleLogout}>
              <Icon name="logout" size={20} color={COLORS.danger} />
              <Text style={styles.dangerButtonText}>Logout from Admin</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a365d',
    elevation: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  adminName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  adminEmail: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 2,
  },
  adminRole: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  settingsList: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
  },
  actionsList: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
  },
  dangerZone: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.danger,
  },
});