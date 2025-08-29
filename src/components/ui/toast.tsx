import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";

// Toast variants
type ToastVariant = "default" | "destructive";

interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  onPress?: () => void;
}

interface ToastInternal extends ToastProps {
  id: string;
  open: boolean;
}

const TOAST_LIMIT = 3;
const TOAST_DEFAULT_DURATION = 5000;

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Toast state management
let memoryState: ToastInternal[] = [];
const listeners: Array<(toasts: ToastInternal[]) => void> = [];

function dispatch(toasts: ToastInternal[]) {
  memoryState = toasts;
  listeners.forEach((listener) => listener(memoryState));
}

// Toast API
export function toast({
  title,
  description,
  variant = "default",
  duration = TOAST_DEFAULT_DURATION,
  onPress,
}: ToastProps) {
  const id = genId();
  const newToast: ToastInternal = { id, title, description, variant, open: true };

  const updatedToasts = [newToast, ...memoryState].slice(0, TOAST_LIMIT);
  dispatch(updatedToasts);

  setTimeout(() => {
    dismiss(id);
  }, duration);

  function dismiss(toastId = id) {
    dispatch(memoryState.filter((t) => t.id !== toastId));
  }

  return { id, dismiss };
}

// Hook to use toast state
export function useToast() {
  const [toasts, setToasts] = useState(memoryState);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      const idx = listeners.indexOf(setToasts);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return {
    toasts,
    toast,
    dismiss: (id?: string) => dispatch(memoryState.filter((t) => t.id !== id)),
  };
}

// Toast container
export const ToastContainer = () => {
  const { toasts, dismiss } = useToast();

  return (
    <ScrollView pointerEvents="box-none" style={styles.container}>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </ScrollView>
  );
};

// Individual Toast
const ToastItem = ({
  toast,
  onDismiss,
}: {
  toast: ToastInternal;
  onDismiss: () => void;
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, []);

  const backgroundColor =
    toast.variant === "destructive" ? "#F87171" : "#333"; // red or dark

  return (
    <Animated.ScrollView style={[styles.toast, { opacity, backgroundColor }]}>
      <ScrollView style={{ flex: 1 }}>
        {toast.title && <Text style={styles.title}>{toast.title}</Text>}
        {toast.description && (
          <Text style={styles.description}>{toast.description}</Text>
        )}
      </ScrollView>
      <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>X</Text>
      </TouchableOpacity>
    </Animated.ScrollView>
  );
};

// Styles
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    width: width,
    alignItems: "center",
    zIndex: 999,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: "80%",
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  description: {
    color: "#fff",
    fontSize: 14,
    marginTop: 2,
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
});
