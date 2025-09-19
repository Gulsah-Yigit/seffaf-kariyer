import React from "react";
import { Pressable, Text, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme";

export default function GradientButton({
  title,
  onPress,
  style,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        { borderRadius: 12, overflow: "hidden", opacity: disabled ? 0.6 : 1 },
        style,
      ]}
    >
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingVertical: 14, alignItems: "center" }}
      >
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}
