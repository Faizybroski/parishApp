import React from "react";
import { ScrollView, Image, Text, StyleSheet, ViewStyle, ImageStyle, TextStyle } from "react-native";

type AvatarProps = {
  children?: React.ReactNode;
  className?: string; // if using tailwind-rn
  style?: ViewStyle;
};

type AvatarImageProps = {
  src?: string;
  style?: ImageStyle;
};

type AvatarFallbackProps = {
  children?: React.ReactNode;
  style?: ViewStyle | TextStyle;
};

export const Avatar: React.FC<AvatarProps> = ({ children, style }) => {
  return (
    <ScrollView style={[styles.avatar, style]}>
      {children}
    </ScrollView>
  );
};

export const AvatarImage: React.FC<AvatarImageProps> = ({ src, style }) => {
  if (!src) return null;
  return (
    <Image
      source={{ uri: src }}
      style={[styles.avatarImage, style]}
    />
  );
};

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children, style }) => {
  return (
    <ScrollView style={[styles.avatarFallback, style]}>
      {typeof children === "string" ? (
        <Text style={styles.fallbackText}>{children}</Text>
      ) : (
        children
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 9999,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  avatarFallback: {
    flex: 1,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e5e5e5", // muted fallback bg
  },
  fallbackText: {
    fontSize: 16,
    color: "#333",
  },
});
