import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";

interface ServiceShape {
  id: number;
  name?: string;
}

interface Request {
  id: number | string;
  service: any;
  date: string;
  status: string;
  details?: any;
}

export default function HistoryItem({
  request,
  statusColor,
}: {
  request: Request;
  statusColor?: string;
}) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: statusColor ?? COLORS.gray },
        ]}
      />
      <View style={styles.content}>
        <Text style={styles.serviceName}>
          {request.service?.name ?? request.service}
        </Text>
        <Text style={styles.date}>{request.date}</Text>
        <Text style={styles.status}>{request.status}</Text>
      </View>
    </View>
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
  statusBadge: {
    width: 10,
    height: 48,
    borderRadius: 6,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  date: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  status: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 6,
  },
});
