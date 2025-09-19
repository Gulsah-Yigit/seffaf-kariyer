import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getExperiences } from "../store/storage";
import type { Experience } from "../models";
import { WAIT_LABELS, WaitBucket } from "../models";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ORDER: WaitBucket[] = ["lt1w", "1-2w", "2-4w", "1-2m", "gt2m"];

export default function CompanyScreen() {
  const route = useRoute<any>();
  const nav = useNavigation<Nav>();
  const company = route.params.company as string;

  const [items, setItems] = React.useState<Experience[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const list = await getExperiences();
      setItems(list.filter((x) => (x.company || "").trim() === company.trim()));
      setLoading(false);
    })();
  }, [company]);

  // ---- Aggregate ----
  const total = items.length;
  const replied = items.filter((x) => x.status === "Replied").length;
  const interviewed = items.filter((x) => x.status === "Interview").length;
  const offer = items.filter((x) => x.status === "Offer").length;
  const responseCount = replied + interviewed + offer;
  const replyRate = total > 0 ? Math.round((responseCount / total) * 100) : 0;

  // dağılımlar
  const noReplyDist: Record<WaitBucket, number> = {
    lt1w: 0,
    "1-2w": 0,
    "2-4w": 0,
    "1-2m": 0,
    gt2m: 0,
  };
  const responseDist: Record<WaitBucket, number> = {
    lt1w: 0,
    "1-2w": 0,
    "2-4w": 0,
    "1-2m": 0,
    gt2m: 0,
  };
  for (const e of items) {
    if (e.status === "NoReply" && e.noReplyWait)
      noReplyDist[e.noReplyWait] += 1;
    if (e.status !== "NoReply" && e.responseDelay)
      responseDist[e.responseDelay] += 1;
  }

  // pozisyona göre gruplama (ilan başlığı gibi davranır)
  const byRole = React.useMemo(() => {
    const m = new Map<string, Experience[]>();
    for (const e of items) {
      const key = e.role?.trim() || "Diğer";
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(e);
    }
    return Array.from(m.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [items]);

  // yorumlar (son 5)
  const comments = items
    .filter((e) => !!e.comment)
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    .slice(0, 5);

  return (
    <ScrollView
      style={{ backgroundColor: "#f6f6f6" }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Özet Kart */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.company}>{company}</Text>
          <Text
            style={[
              styles.badge,
              replyRate >= 30
                ? styles.good
                : replyRate >= 10
                ? styles.mid
                : styles.bad,
            ]}
          >
            {replyRate}%
          </Text>
        </View>

        <Text style={styles.meta}>
          Toplam değerlendirme: {total} • Yanıt: {replied} • Görüşme:{" "}
          {interviewed} • Teklif: {offer}
        </Text>

        {/* Dağılım satırları */}
        <View style={{ marginTop: 10 }}>
          {ORDER.map((k) => {
            const c = noReplyDist[k];
            return c > 0 ? (
              <Text key={"nr-" + k} style={styles.meta}>
                {WAIT_LABELS[k]} bekleyip{" "}
                <Text style={{ fontWeight: "700" }}>yanıt alamayan</Text>: {c}
              </Text>
            ) : null;
          })}
          {ORDER.map((k) => {
            const c = responseDist[k];
            return c > 0 ? (
              <Text key={"rs-" + k} style={styles.meta}>
                {WAIT_LABELS[k]} içinde{" "}
                <Text style={{ fontWeight: "700" }}>yanıt alan</Text>: {c}
              </Text>
            ) : null;
          })}
        </View>

        <Pressable
          onPress={() => nav.navigate("Add", { preset: { company } })}
          style={styles.primaryBtn}
        >
          <Text style={styles.primaryBtnText}>Bu firmaya deneyim ekle</Text>
        </Pressable>
      </View>

      {/* Pozisyona göre kartlar */}
      {byRole.map(([role, arr]) => {
        const rTotal = arr.length;
        const rResp = arr.filter((x) => x.status !== "NoReply").length;
        const rate = rTotal ? Math.round((rResp / rTotal) * 100) : 0;

        return (
          <View key={role} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.role}>{role}</Text>
              <Text style={[styles.roleBadge]}>{rTotal} kayıt</Text>
            </View>

            <Text style={styles.meta}>
              Yanıt veren: {rResp} / {rTotal} • Oran: {rate}%
            </Text>

            {/* Bu ilanın yorumlarından kısa örnekler */}
            {arr
              .filter((x) => !!x.comment)
              .slice(0, 2)
              .map((e, i) => (
                <Text
                  key={i}
                  style={[styles.meta, { marginTop: 6 }]}
                  numberOfLines={2}
                >
                  • {e.comment}
                </Text>
              ))}

            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
              <Pressable
                onPress={() =>
                  nav.navigate("Add", { preset: { company, role } })
                }
                style={[styles.smallBtn, { backgroundColor: "#111827" }]}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  Bu ilana deneyim ekle
                </Text>
              </Pressable>
              <Pressable
                onPress={() => nav.navigate("Add", { preset: { company } })}
                style={[styles.smallBtn, { backgroundColor: "#6b7280" }]}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  Başka ilan için ekle
                </Text>
              </Pressable>
            </View>
          </View>
        );
      })}

      {/* Son yorumlar */}
      {comments.length > 0 && (
        <View style={styles.card}>
          <Text style={[styles.role, { marginBottom: 8 }]}>Son yorumlar</Text>
          {comments.map((e, idx) => (
            <View key={idx} style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "700" }}>{e.role || "Pozisyon"}</Text>
              <Text style={styles.meta}>Kaynak: {e.source || "-"}</Text>
              <Text style={[styles.meta, { marginTop: 4 }]}>{e.comment}</Text>
              <Text style={[styles.meta, { marginTop: 4, color: "#6b7280" }]}>
                {new Date(e.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      {!loading && items.length === 0 && (
        <View style={styles.card}>
          <Text style={styles.meta}>
            Bu firmaya dair kayıt yok. İlk katkıyı sen yap!
          </Text>
          <Pressable
            onPress={() => nav.navigate("Add", { preset: { company } })}
            style={[styles.primaryBtn, { marginTop: 12 }]}
          >
            <Text style={styles.primaryBtnText}>Deneyim ekle</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderColor: "#eee",
    borderWidth: 1,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  company: { fontSize: 20, fontWeight: "900", color: "#111" },
  role: { fontSize: 16, fontWeight: "800", color: "#111" },
  meta: { color: "#555" },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    color: "#fff",
  },
  good: { backgroundColor: "#16a34a" },
  mid: { backgroundColor: "#f59e0b" },
  bad: { backgroundColor: "#dc2626" },

  roleBadge: {
    backgroundColor: "#eef2ff",
    color: "#3730a3",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
  },

  primaryBtn: {
    marginTop: 12,
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "800" },

  smallBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
});
