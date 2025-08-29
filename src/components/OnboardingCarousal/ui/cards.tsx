import React from "react";
import { ScrollView, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

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
  return <ScrollView style={[styles.card, style]}>{children}</ScrollView>;
};

// Card Header
export const CardHeader: React.FC<CardProps> = ({ style, children }) => {
  return <ScrollView style={[styles.header, style]}>{children}</ScrollView>;
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
  return <ScrollView style={[styles.content, style]}>{children}</ScrollView>;
};

// Card Footer
export const CardFooter: React.FC<CardProps> = ({ style, children }) => {
  return <ScrollView style={[styles.footer, style]}>{children}</ScrollView>;
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
