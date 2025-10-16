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
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
});
