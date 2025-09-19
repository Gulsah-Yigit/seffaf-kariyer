import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { CompanyStats, WAIT_LABELS, WaitBucket } from "../models";

const ORDER: WaitBucket[] = ["lt1w", "1-2w", "2-4w", "1-2m", "gt2m"];

export default function CompanyCard({
  data,
  onPress,
}: {
  data: CompanyStats;
  onPress: () => void;
}) {
  const ratePct = Math.round((data.replyRate || 0) * 100);

  const detailLines: string[] = [];
  // Önce yanıt alamayanlar
  ORDER.forEach((b) => {
    const c = data.noReplyDist?.[b] ?? 0;
    if (c > 0)
      detailLines.push(`${WAIT_LABELS[b]} bekleyip yanıt alamayan: ${c}`);
  });
  // Sonra yanıt alanlar
  ORDER.forEach((b) => {
    const c = data.responseDist?.[b] ?? 0;
    if (c > 0) detailLines.push(`${WAIT_LABELS[b]} içinde yanıt alan: ${c}`);
  });

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>{data.company}</Text>
        <Text
          style={[
            styles.badge,
            ratePct >= 30
              ? styles.good
              : ratePct >= 10
              ? styles.mid
              : styles.bad,
          ]}
        >
          {ratePct}%
        </Text>
      </View>

      <Text style={styles.meta}>
        Toplam: {data.total} • Yanıt: {data.replied} • Görüşme:{" "}
        {data.interviewed} • Teklif: {data.offer}
      </Text>

      {detailLines.map((t, i) => (
        <Text key={i} style={[styles.meta, { marginTop: 4 }]}>
          {t}
        </Text>
      ))}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 16, fontWeight: "600" },
  meta: { marginTop: 6, color: "#555" },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    color: "#fff",
    overflow: "hidden",
  },
  good: { backgroundColor: "#16a34a" },
  mid: { backgroundColor: "#f59e0b" },
  bad: { backgroundColor: "#dc2626" },
});
