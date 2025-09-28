import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../constants/colors";

interface Method {
  id: number;
  title: string;
  value: string;
  icon?: string;
  color?: string;
  onPress?: () => void;
}

export default function ContactMethod({
  method,
  onPress,
}: {
  method: Method;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: method.color ?? COLORS.lightGray },
        ]}
      >
        {method.icon ? (
          <Icon name={method.icon} size={20} color={COLORS.white} />
        ) : null}
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{method.title}</Text>
        <Text style={styles.value}>{method.value}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 1,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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
  value: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
});
