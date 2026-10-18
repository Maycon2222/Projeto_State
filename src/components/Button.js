import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors as c } from "../theme";
export default function Button({
  children,
  onPress,
  disabled = false,
  secondary = false,
  accessibilityLabel = undefined,
  style = undefined,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        pressed && { opacity: 0.82 },
        disabled && { opacity: 0.4 },
        style,
      ]}
    >
      <Text style={[s.text, secondary && { color: c.red }]}>{children}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  button: {
    backgroundColor: c.red,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
  },
  secondary: {
    backgroundColor: "#FCF0EC",
    borderWidth: 1,
    borderColor: "#EFD8D0",
  },
  text: { color: c.white, fontSize: 14, fontWeight: "700" },
});
