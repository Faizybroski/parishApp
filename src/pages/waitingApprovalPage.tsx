import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PendingApproval = () => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="shield-check-outline"
        size={50}
        color="#9DC0B3"
        style={{ position: "absolute", top: 40, left: 20, opacity: 0.4 }}
      />
      <MaterialCommunityIcons
        name="clock-outline"
        size={60}
        color="#F7C992"
        style={{ position: "absolute", bottom: 40, right: 20, opacity: 0.3 }}
      />

      <Text style={styles.heading}>Approval Pending</Text>
      <Text style={styles.subheading}>Thanks for signing up!</Text>
      <Text style={styles.body}>
        Our team is reviewing your account details. You’ll get an email once
        you’ve been approved.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", alignItems: "center", justifyContent: "center" },
  heading: { fontSize: 36, fontWeight: "800", color: "#F7C992", marginBottom: 8 },
  subheading: { fontSize: 20, fontWeight: "600", color: "#FEFEFE", marginBottom: 6 },
  body: { fontSize: 16, textAlign: "center", color: "#9DC0B3" },
});

export default PendingApproval;
