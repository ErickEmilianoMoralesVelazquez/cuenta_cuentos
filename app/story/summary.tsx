import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { getPlayedStoryById, PlayedStory } from "@/lib/playedStories";
dayjs.locale("es");

export default function StorySummaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<PlayedStory | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = id ? await getPlayedStoryById(id) : null;
      if (mounted) setItem(res ?? null);
    })();
    return () => { mounted = false; };
  }, [id]);

  if (!item) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ fontSize: 16 }}>No se encontró el resumen.</Text>
        <Text style={styles.link} onPress={() => router.back()}>Volver</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.link} onPress={() => router.back()}>Volver</Text>
        <View style={styles.headerCard}>
          <Image
            source={ item.image ? { uri: item.image } : require("../../assets/images/libro-abierto.png")}
            style={styles.cover}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subTitle}>Jugado: {dayjs(item.finishedAtISO).format("D MMM YYYY, HH:mm")}</Text>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Tus decisiones</Text>
          {item.decisions.length ? (
            item.decisions.map((d, i) => (
              <Text key={i} style={styles.decisionLine}>{i + 1}. {d}</Text>
            ))
          ) : (
            <Text style={styles.muted}>No se registraron decisiones.</Text>
          )}
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Final</Text>
          <Text style={styles.ending}>{item.endingText}</Text>
        </View>

        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  link: { marginTop: 16, color: "#007AFF", fontWeight: "600" },
  content: { padding: 20, gap: 16 },
  headerCard: {
    flexDirection: "row", backgroundColor: "#fff", padding: 14, borderRadius: 16, gap: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
  },
  cover: { width: 64, height: 64, borderRadius: 12 },
  title: { fontSize: 20, fontWeight: "800", color: "#222" },
  subTitle: { color: "#666", marginTop: 4 },
  block: { backgroundColor: "#fff", padding: 16, borderRadius: 16 },
  blockTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8, color: "#2E7D32" },
  decisionLine: { fontSize: 14, color: "#2E7D32", marginBottom: 4 },
  muted: { color: "#999" },
  ending: { fontSize: 16, color: "#333", lineHeight: 22 },
});
