import React, { useState, useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, TouchableOpacity } from "react-native";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 5000; // 5 seconds

type ToastProps = {
  title?: string;
  description?: string;
  duration?: number;
  onPress?: () => void;
};

type ToasterToast = ToastProps & {
  id: string;
  open: boolean;
};

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const listeners: Array<(state: ToasterToast[]) => void> = [];
let memoryState: ToasterToast[] = [];

function dispatch(toasts: ToasterToast[]) {
  memoryState = toasts;
  listeners.forEach((listener) => listener(memoryState));
}

export function toast({ title, description, duration = TOAST_REMOVE_DELAY, onPress }: ToastProps) {
  const id = genId();
  const newToast: ToasterToast = { id, title, description, open: true };

  const updatedToasts = [newToast, ...memoryState].slice(0, TOAST_LIMIT);
  dispatch(updatedToasts);

  // Auto dismiss
  setTimeout(() => {
    dismiss(id);
  }, duration);

  function dismiss(toastId = id) {
    dispatch(memoryState.filter((t) => t.id !== toastId));
  }

  return { id, dismiss };
}

export function useToast() {
  const [toasts, setToasts] = useState(memoryState);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      const index = listeners.indexOf(setToasts);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return { toasts, toast, dismiss: (id?: string) => dispatch(memoryState.filter(t => t.id !== id)) };
}

// Toast Container Component
export const ToastContainer = () => {
  const { toasts, dismiss } = useToast();

  return (
    <View style={container} pointerEvents="box-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </View>
  );
};

const ToastItem = ({ toast, onDismiss }: { toast: ToasterToast; onDismiss: () => void }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.toast, { opacity }]}>
      <TouchableOpacity onPress={onDismiss}>
        {toast.title && <Text style={styles.title}>{toast.title}</Text>}
        {toast.description && <Text style={styles.description}>{toast.description}</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    width: "100%",
    alignItems: "center",
    zIndex: 999,
  },
  toast: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 8,
    marginVertical: 4,
    minWidth: "80%",
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
    marginTop: 4,
    fontSize: 14,
  },
});
