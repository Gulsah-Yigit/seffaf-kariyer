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

type Props = NativeStackScreenProps<RootStackParamList, "Signup">;

export default function SignupScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSignup() {
    if (!email.includes("@")) {
      Alert.alert("Hata", "Geçerli bir e-posta gir.");
      return;
    }
    setBusy(true);
    const err = await signUp(username.trim(), email.trim(), password);
    setBusy(false);
    if (err) Alert.alert("Kayıt olmadı", err);
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
              Hesap Oluştur
            </Text>
            <Text style={{ color: "#475569", marginBottom: 14 }}>
              E-posta, kullanıcı adı ve şifre ile hızlı kayıt.
            </Text>

            <AuthTextInput
              label="Kullanıcı adı"
              value={username}
              onChangeText={setUsername}
              placeholder="gulsah"
              autoCapitalize="none"
            />
            <AuthTextInput
              label="E-posta"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="ornek@mail.com"
            />
            <AuthTextInput
              label="Şifre (min 6)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
            />

            <GradientButton
              title={busy ? "Kayıt olunuyor..." : "Kayıt Ol"}
              onPress={onSignup}
              disabled={busy}
            />

            <Pressable
              onPress={() => navigation.replace("Login")}
              style={{ alignSelf: "center", marginTop: 14 }}
            >
              <Text style={{ color: colors.primary, fontWeight: "700" }}>
                Zaten hesabın var mı? Giriş yap
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
