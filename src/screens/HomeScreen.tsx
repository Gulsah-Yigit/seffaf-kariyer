import React from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  Pressable,
  RefreshControl,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { getExperiences, groupByCompany } from "../store/storage";
import CompanyCard from "../components/CompanyCard";
import { CompanyStats } from "../models";
import { useAuth } from "../auth/AuthContext";
import { colors } from "../theme";

export default function HomeScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [stats, setStats] = React.useState<CompanyStats[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Search
  const [q, setQ] = React.useState("");
  const filtered = React.useMemo(
    () =>
      stats.filter((s) =>
        s.company.toLowerCase().includes(q.trim().toLowerCase())
      ),
    [stats, q]
  );

  async function load() {
    setRefreshing(true);
    const exps = await getExperiences();
    const s = await groupByCompany(exps);
    setStats(s);
    setRefreshing(false);
  }

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [])
  );

  return (
    <LinearGradient colors={colors.bgGradient} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top Bar */}
        <View style={styles.topbar}>
          <Text style={styles.brand}>Şeffaf Kariyer</Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Pressable
              onPress={() => nav.navigate("Add")}
              style={styles.pillPrimary}
            >
              <Text style={styles.pillText}>+ Ekle</Text>
            </Pressable>

            {/* Avatar + menu */}
            <Pressable onPress={() => setMenuOpen(true)} style={styles.avatar}>
              <Text style={{ color: "#fff", fontWeight: "800" }}>
                {user?.username?.[0]?.toUpperCase() ?? "A"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* “amaç” şeridi */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>
              Firmaların geri dönüş oranlarını gör, sen de deneyimini paylaş.
            </Text>
            <Text style={styles.heroSub}>
              İşe alım süreçlerini şeffaflaştır.
            </Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Şirket ara..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
          />
          {q.length > 0 && (
            <Pressable onPress={() => setQ("")} style={styles.clearBtn}>
              <Text style={{ fontSize: 18, color: "#64748b" }}>×</Text>
            </Pressable>
          )}
        </View>

        {/* Content card */}
        <View style={styles.contentCard}>
          {stats.length === 0 ? (
            <View style={{ padding: 16 }}>
              <Text style={{ color: "#334155" }}>
                Henüz veri yok. İlk deneyimini eklemek için sağ üstteki{" "}
                <Text style={{ fontWeight: "800" }}>+ Ekle</Text> butonuna
                dokun.
              </Text>
            </View>
          ) : filtered.length === 0 ? (
            <View style={{ padding: 16 }}>
              <Text style={{ color: "#334155" }}>
                “{q}” için sonuç bulunamadı.
              </Text>
            </View>
          ) : (
            <FlatList
              contentContainerStyle={{ padding: 16 }}
              data={filtered}
              keyExtractor={(i) => i.company}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={load} />
              }
              renderItem={({ item }) => (
                <CompanyCard
                  data={item}
                  onPress={() =>
                    nav.navigate("Company", { company: item.company })
                  }
                />
              )}
            />
          )}
        </View>

        {/* Profile menu modal */}
        <Modal
          transparent
          visible={menuOpen}
          animationType="fade"
          onRequestClose={() => setMenuOpen(false)}
        >
          {/* Dışarı tıklayınca kapansın */}
          <Pressable
            style={styles.menuBackdrop}
            onPress={() => setMenuOpen(false)}
          />

          {/* Menü kartı */}
          <View style={styles.menuCard}>
            <Text style={styles.menuUser}>
              {user?.username ?? "Anonim"} {"\n"}
              <Text
                style={{ color: "#64748b", fontWeight: "400", fontSize: 12 }}
              >
                {user?.email}
              </Text>
            </Text>
            <Pressable
              onPress={signOut}
              style={[
                styles.menuItem,
                { borderTopWidth: 1, borderColor: "#e5e7eb" },
              ]}
            >
              <Text style={{ color: "#dc2626", fontWeight: "700" }}>
                Çıkış Yap
              </Text>
            </Pressable>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  topbar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { fontSize: 22, fontWeight: "900", color: "#fff" },
  pillPrimary: {
    backgroundColor: "#111827",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  pillText: { color: "#fff", fontWeight: "700" },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0ea5e9",
    alignItems: "center",
    justifyContent: "center",
  },

  heroWrap: { paddingHorizontal: 16 },
  heroCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  heroTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
  heroSub: { marginTop: 6, color: "#334155" },

  searchWrap: { position: "relative", marginTop: 12, marginHorizontal: 16 },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 38,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  clearBtn: {
    position: "absolute",
    right: 26,
    top: 10,
    padding: 6,
    borderRadius: 999,
  },

  contentCard: {
    flex: 1,
    marginTop: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  // Modal
  menuBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.15)",
    zIndex: 5,
  },
  menuCard: {
    position: "absolute",
    right: 16,
    top: 70,
    width: 220,
    backgroundColor: "#fff",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    zIndex: 10,
  },
  menuUser: { padding: 14, fontWeight: "800", color: "#0f172a" },
  menuItem: { padding: 14 },
});
