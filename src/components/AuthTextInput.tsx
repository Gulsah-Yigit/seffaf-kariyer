import React from "react";
import { TextInput, View, Text } from "react-native";
import { colors } from "../theme";

export default function AuthTextInput({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 6, color: colors.text, fontWeight: "700" }}>
        {label}
      </Text>
      <TextInput
        placeholderTextColor={colors.placeholder}
        style={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          color: colors.text,
        }}
        {...props}
      />
    </View>
  );
}
