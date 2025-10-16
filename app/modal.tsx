import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { COLORS } from "../constants/colors";
import { useServices } from "../hooks/useServices";
import { Service } from "../types";

export default function ModalScreen() {
  const params = useLocalSearchParams();
  const { requestService, isLoading } = useServices();
  const [service, setService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    vehicle: "",
    notes: "",
    location: "",
  });

  useEffect(() => {
    if (params.service) {
      try {
        const serviceData = JSON.parse(params.service as string);
        setService(serviceData);
      } catch (error) {
        console.error("Error parsing service data:", error);
        router.back();
      }
    }
  }, [params.service]);

  const handleRequestService = async () => {
    if (!service) return;

    if (!formData.vehicle.trim()) {
      Alert.alert("Error", "Please enter your vehicle details");
      return;
    }

    try {
      await requestService(service, formData);
      Alert.alert(
        "Service Requested",
        `Help is on the way for ${service.name}! Our assistance team will contact you shortly.`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to request service. Please try again.");
    }
  };

  if (!service) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Request Service</Text>
        <Button
          title=""
          onPress={() => router.back()}
          variant="outline"
          style={styles.closeButton}
          icon={<Icon name="close" size={24} color={COLORS.gray} />}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.serviceHeader}>
          <View
            style={[
              styles.serviceIcon,
              { backgroundColor: `${service.color}20` },
            ]}
          >
            <Icon
              name={service.iconName as any}
              size={40}
              color={service.color}
            />
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
          </View>
        </View>

        <View style={styles.form}>
          <Input 
            label="Vehicle Details"
            style={{ color: "#1a237e"}}
            placeholder="Make, model, color, license plate"
            placeholderTextColor="#1a237e"
            value={formData.vehicle}
            onChangeText={(value: string) =>
              setFormData((prev) => ({ ...prev, vehicle: value }))
            }
            icon={
              <Icon name="directions-car" size={20} color={"#1a237e"} />
            }
          />

          <Input
            label="Current Location"
            style={{ color: "#1a237e"}}
            placeholder="Where are you located?"
            placeholderTextColor="#1a237e"
            value={formData.location}
            onChangeText={(value: string) =>
              setFormData((prev) => ({ ...prev, location: value }))
            }
            icon={<Icon name="location-on" size={20} color={"#1a237e"} />}
          />

          <Input
            label="Additional Notes (Optional)"
            placeholder="Any additional information that might help"
            placeholderTextColor="#1a237e"
            value={formData.notes}
            onChangeText={(value: string) =>
              setFormData((prev) => ({ ...prev, notes: value }))
            }
            multiline
            numberOfLines={4}
            style={styles.notesInput}
            icon={<Icon name="notes" size={20} color={"#1a237e"} />}
          />

          <View style={styles.emergencyNotice}>
            <Icon name="warning" size={20} color={COLORS.warning} />
            <Text style={styles.emergencyText}>
              For emergency situations, please call our hotline immediately:
              1-800-ROAD-HELP
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="outline"
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
            />
            <Button
              title="Request Help"
              onPress={handleRequestService}
              loading={isLoading}
              style={styles.confirmButton}
              icon={
                <Icon
                  name="check"
                  size={20}
                  color={COLORS.white}
                  style={styles.buttonIcon}
                />
              }
            />
          </View>
        </View>

        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>What to Expect</Text>
          <View style={styles.expectationList}>
            <View style={styles.expectationItem}>
              <Icon name="schedule" size={20} color={"#1a237e"} />
              <Text style={styles.expectationText}>
                <Text style={styles.expectationBold}>
                  30-minute response time
                </Text>{" "}
                on average
              </Text>
            </View>
            <View style={styles.expectationItem}>
              <Icon name="phone" size={20} color={"#1a237e"} />
              <Text style={styles.expectationText}>
                <Text style={styles.expectationBold}>
                  Service confirmation call
                </Text>{" "}
                within 10 minutes
              </Text>
            </View>
            <View style={styles.expectationItem}>
              <Icon name="payment" size={20} color={"#1a237e"} />
              <Text style={styles.expectationText}>
                <Text style={styles.expectationBold}>Transparent pricing</Text>{" "}
                before service begins
              </Text>
            </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a237e",
  },
  closeButton: {
    width: 40,
    height: 40,
    padding: 0,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  form: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  inputLabel: {
    color: "#1a237e",
    fontWeight: "600",
    marginBottom: 6,
    fontSize: 14,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: "top",
    color: "#1a237e",
  },
  emergencyNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF3CD",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  emergencyText: {
    flex: 1,
    fontSize: 14,
    color: "#1a237e",
    marginLeft: 8,
    lineHeight: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: "#333",
  },
  confirmButton: {
    flex: 2,
    backgroundColor: "#1a237e",
  },
  buttonIcon: {
    marginRight: 8,
  },
  helpSection: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 16,
  },
  expectationList: {
    gap: 12,
  },
  expectationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  expectationText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    marginLeft: 12,
    lineHeight: 20,
  },
  expectationBold: {
    fontWeight: "bold",
    color: "#1a237e",
  },
});
