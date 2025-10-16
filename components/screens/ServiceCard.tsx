import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../constants/colors";

export default function ServiceCard({
  service,
  onPress,
}: {
  service: any;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconWrapper}>
        {service?.icon ? (
          <Icon name={service.icon} size={24} color={COLORS.white} />
        ) : null}
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{service?.name ?? "Service"}</Text>
        <Text style={styles.subtitle}>{service?.description ?? ""}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a237e", 
    marginRight: 12,
    shadowColor: "#1a237e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a237e", 
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontWeight: "400",
  },
});
