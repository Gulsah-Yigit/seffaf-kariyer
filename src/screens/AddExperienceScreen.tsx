import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { addExperience } from "../store/storage";
import { Experience, WaitBucket } from "../models";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function AddExperienceScreen() {
  const nav = useNavigation();
  const route = useRoute<any>();
  const preset = (route.params?.preset ?? {}) as {
    company?: string;
    role?: string;
  };

  const [company, setCompany] = React.useState(preset.company ?? "");
  const [role, setRole] = React.useState(preset.role ?? "");
  const [source, setSource] = React.useState("LinkedIn");
  const [postUrl, setPostUrl] = React.useState("");
  const [status, setStatus] = React.useState<
    "NoReply" | "Replied" | "Interview" | "Offer"
  >("NoReply");
  const [comment, setComment] = React.useState("");

  // Yeni: süre seçimleri (opsiyonel)
  const [wait, setWait] = React.useState<WaitBucket | undefined>(undefined);
  const [respDelay, setRespDelay] = React.useState<WaitBucket | undefined>(
    undefined
  );
  // Yanıt Geldi/Görüşme/Teklif için

  async function onSave() {
    if (!company.trim()) {
      Alert.alert("Hata", "Şirket adı gerekli");
      return;
    }

    const e: Experience = {
      id: String(Date.now()),
      company: company.trim(),
      role: role.trim() || undefined,
      source,
      postUrl: postUrl || undefined,
      comment: comment || undefined,
      status,
      // seçilmişse kaydederiz:
      noReplyWait: status === "NoReply" ? wait : undefined,
      responseDelay: status !== "NoReply" ? respDelay : undefined,
      createdAt: new Date().toISOString(),
    };

    await addExperience(e);
    // @ts-ignore
    nav.goBack();
  }

  const buckets: { key: WaitBucket; label: string }[] = [
    { key: "lt1w", label: "< 1 hafta" },
    { key: "1-2w", label: "1–2 hafta" },
    { key: "2-4w", label: "2–4 hafta" },
    { key: "1-2m", label: "1–2 ay" },
    { key: "gt2m", label: "2+ ay" },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Input
        label="Şirket"
        value={company}
        onChangeText={setCompany}
        placeholder="Örn: ABC Teknoloji"
      />
      <Input
        label="Pozisyon"
        value={role}
        onChangeText={setRole}
        placeholder="Örn: Junior Frontend"
      />
      <Input
        label="Kaynak"
        value={source}
        onChangeText={setSource}
        placeholder="LinkedIn / Kariyer / Company"
      />
      <Input
        label="İlan Linki"
        value={postUrl}
        onChangeText={setPostUrl}
        placeholder="https://..."
      />

      <View style={{ marginBottom: 12 }}>
        <Text style={styles.label}>Durum</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {(["NoReply", "Replied", "Interview", "Offer"] as const).map(
            (opt) => (
              <Pressable
                key={opt}
                onPress={() => {
                  setStatus(opt);
                  setWait(undefined);
                  setRespDelay(undefined);
                }}
                style={[styles.chip, status === opt && styles.chipActive]}
              >
                <Text
                  style={[styles.chipText, status === opt && { color: "#fff" }]}
                >
                  {opt === "NoReply"
                    ? "Yanıt Yok"
                    : opt === "Replied"
                    ? "Yanıt Geldi"
                    : opt === "Interview"
                    ? "Görüşme"
                    : "Teklif"}
                </Text>
              </Pressable>
            )
          )}
        </View>
      </View>

      {/* Sadece ilgili alanı göster (opsiyonel) */}
      {status === "NoReply" ? (
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.label}>Bekleme Süresi (opsiyonal)</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {buckets.map((b) => (
              <Pressable
                key={b.key}
                onPress={() => setWait(b.key)}
                style={[styles.chip, wait === b.key && styles.chipActive]}
              >
                <Text
                  style={[styles.chipText, wait === b.key && { color: "#fff" }]}
                >
                  {b.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.label}>Yanıt Süresi (opsiyonal)</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {buckets.map((b) => (
              <Pressable
                key={b.key}
                onPress={() => setRespDelay(b.key)}
                style={[styles.chip, respDelay === b.key && styles.chipActive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    respDelay === b.key && { color: "#fff" },
                  ]}
                >
                  {b.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <Input
        label="Not"
        value={comment}
        onChangeText={setComment}
        placeholder="Kısa yorum (opsiyonel)"
        multiline
      />
      <Pressable onPress={onSave} style={styles.saveBtn}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>Kaydet</Text>
      </Pressable>
    </ScrollView>
  );
}

function Input({ label, multiline = false, ...props }: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && { height: 100, textAlignVertical: "top" },
        ]}
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 6, fontWeight: "600", color: "#111" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  chip: {
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipActive: { backgroundColor: "#111827", borderColor: "#111827" },
  chipText: { color: "#111827", fontWeight: "600" },
  saveBtn: {
    backgroundColor: "#16a34a",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
  },
});
