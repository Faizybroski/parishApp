import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import { XCircle, ShieldOff } from "lucide-react-native"; // RN version of icons

const RejectedRegistration = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Floating shield-off */}
      <Animatable.View
        animation="bounce"
        iterationCount="infinite"
        duration={2000}
        style={[styles.iconWrapper, { top: 40, left: 40 }]}
      >
        <ShieldOff size={50} color="rgba(248,113,113,0.4)" />
      </Animatable.View>

      {/* Floating X-circle */}
      <Animatable.View
        animation="rotate"
        iterationCount="infinite"
        duration={4000}
        easing="linear"
        style={[styles.iconWrapper, { bottom: 40, right: 40 }]}
      >
        <XCircle size={60} color="rgba(239,68,68,0.3)" />
      </Animatable.View>

      {/* Main Content */}
      <Animatable.View animation="fadeInUp" style={styles.textContainer}>
        <Animatable.Text
          animation="pulse"
          iterationCount="infinite"
          style={styles.title}
        >
          Profile Rejected
        </Animatable.Text>
        <Animatable.Text animation="fadeIn" style={styles.subtitle}>
          We’re sorry, but your account could not be approved.
        </Animatable.Text>
      </Animatable.View>

      {/* Decorative dots */}
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        duration={2500}
        style={[styles.dot, { top: "25%", left: "33%", backgroundColor: "#ef4444" }]}
      />
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        duration={3000}
        style={[styles.dot, { top: "33%", right: "25%", backgroundColor: "#9DC0B3", width: 12, height: 12 }]}
      />
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        duration={3500}
        style={[styles.dot, { bottom: "25%", left: "25%", backgroundColor: "#FEFEFE", width: 6, height: 6 }]}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#ef4444",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 16,
    color: "#fefefe",
    textAlign: "center",
  },
  iconWrapper: {
    position: "absolute",
  },
  dot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 9999,
  },
});

export default RejectedRegistration;
