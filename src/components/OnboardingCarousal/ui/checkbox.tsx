import React from "react";
import { TouchableOpacity, View, StyleSheet, GestureResponderEvent } from "react-native";
// import { Check } from "lucide-react-native"; // make sure to install lucide-react-native
import { Feather } from '@expo/vector-icons';

interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: number;
  style?: object;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  disabled = false,
  size = 20,
  style,
}) => {
  const handlePress = (event: GestureResponderEvent) => {
    if (disabled) return;
    onChange && onChange(!checked);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
      style={[styles.container, style]}
    >
      <View
        style={[
          styles.box,
          { width: size, height: size },
          checked && styles.checked,
          disabled && styles.disabled,
        ]}
      >
        {checked && <Feather name="check" size={16} color="#ffffff" />
        // <Check width={size * 0.8} height={size * 0.8} color="#ffffff" />
      }
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    borderWidth: 1.5,
    borderColor: "#3b82f6", // primary color
    borderRadius: 4,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: "#3b82f6",
  },
  disabled: {
    opacity: 0.5,
  },
});
