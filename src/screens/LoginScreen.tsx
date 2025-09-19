import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme";
import AuthTextInput from "../components/AuthTextInput";
import GradientButton from "../components/GradientButton";
import { useAuth } from "../auth/AuthContext";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onLogin() {
    setBusy(true);
    const err = await signIn(email.trim(), password);
    setBusy(false);
    if (err) Alert.alert("Giriş başarısız", err);
  }

  return (
    <LinearGradient colors={colors.bgGradient} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: 420,
              backgroundColor: colors.cardBg,
              borderRadius: 20,
              padding: 20,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "900",
                color: colors.text,
                marginBottom: 6,
              }}
            >
              Şeffaf Kariyer
            </Text>
            <Text style={{ color: "#475569", marginBottom: 14 }}>
              Şirketlerin geri dönüş istatistiklerini gör, toplulukla birlikte
              süreci daha şeffaf yaşa.
            </Text>

            <AuthTextInput
              label="E-posta"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="ornek@mail.com"
            />
            <AuthTextInput
              label="Şifre"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
            />

            <GradientButton
              title={busy ? "Giriş yapılıyor..." : "Giriş Yap"}
              onPress={onLogin}
              disabled={busy}
            />

            <Pressable
              onPress={() => navigation.replace("Signup")}
              style={{ alignSelf: "center", marginTop: 14 }}
            >
              <Text style={{ color: colors.primary, fontWeight: "700" }}>
                Hesabın yok mu? Kayıt ol
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
