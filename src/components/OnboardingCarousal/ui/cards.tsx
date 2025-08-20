import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface CardProps {
  style?: ViewStyle;
  children: React.ReactNode;
}

interface CardTextProps {
  style?: TextStyle;
  children: React.ReactNode;
}

// Main Card container
export const Card: React.FC<CardProps> = ({ style, children }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

// Card Header
export const CardHeader: React.FC<CardProps> = ({ style, children }) => {
  return <View style={[styles.header, style]}>{children}</View>;
};

// Card Title
export const CardTitle: React.FC<CardTextProps> = ({ style, children }) => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

// Card Description
export const CardDescription: React.FC<CardTextProps> = ({ style, children }) => {
  return <Text style={[styles.description, style]}>{children}</Text>;
};

// Card Content
export const CardContent: React.FC<CardProps> = ({ style, children }) => {
  return <View style={[styles.content, style]}>{children}</View>;
};

// Card Footer
export const CardFooter: React.FC<CardProps> = ({ style, children }) => {
  return <View style={[styles.footer, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb", // light border
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2, // for Android shadow
  },
  header: {
    flexDirection: "column",
    padding: 16,
    paddingBottom: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 24,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#6b7280", // muted color
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 0,
  },
});
