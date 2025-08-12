// app/(tabs)/myStories.tsx
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useFocusEffect } from "@react-navigation/native";
import {
  getPlayedStories,
  PlayedStory,
  removePlayedStory,
  clearPlayedStories,
} from "@/lib/playedStories";
import { router } from "expo-router";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
dayjs.extend(relativeTime);
dayjs.locale("es");

const palette = [
  "#FEE2E2",
  "#DBEAFE",
  "#DCFCE7",
  "#FEF9C3",
  "#E9D5FF",
  "#FFD6E7",
  "#D1FAE5",
  "#FDE68A",
];
const pickColor = (item: PlayedStory) => {
  const key = item.storyKey || item.title || "x";
  const sum = [...key].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return palette[Math.abs(sum) % palette.length];
};

export default function MyStories() {
  const [played, setPlayed] = useState<PlayedStory[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getPlayedStories();
    setPlayed(data);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const openSummary = (item: PlayedStory) => {
    router.push({ pathname: "/story/summary", params: { id: item.id } });
  };

  // borrar una sola
  const confirmDelete = (item: PlayedStory) => {
    Alert.alert(
      "Eliminar historia",
      `¿Quieres eliminar “${item.title}”? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const updated = await removePlayedStory(item.id);
            setPlayed(updated); // optimista
          },
        },
      ]
    );
  };

  // borrar todas
  const confirmClearAll = () => {
    if (!played.length) return;
    Alert.alert(
      "Borrar todas las historias",
      "Se eliminarán todas tus historias guardadas. ¿Continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar todo",
          style: "destructive",
          onPress: async () => {
            await clearPlayedStories();
            setPlayed([]);
          },
        },
      ]
    );
  };

  const renderStoryItem = ({ item }: { item: PlayedStory }) => (
    <TouchableOpacity
      style={styles.storyItem}
      onPress={() => openSummary(item)}
    >
      <View style={[styles.cover, { backgroundColor: pickColor(item) }]} />

      <View style={styles.storyDetails}>
        <Text style={styles.storyTitle}>{item.title}</Text>
        <Text style={styles.lastPlayed}>
          Última vez: {dayjs(item.finishedAtISO).fromNow()}
        </Text>

        {!!item.decisions.length && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Tus decisiones</Text>
            <Text style={styles.summaryText}>
              {item.decisions.map((d, i) => `${i + 1}. ${d}`).join("  •  ")}
            </Text>
          </View>
        )}

        <Text numberOfLines={2} style={styles.endingText}>
          Final: {item.endingText}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${item.progress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{item.progress}%</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {/* borrar individual */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => confirmDelete(item)}
        >
          <IconSymbol name="trash" size={20} color="#FF6B6B" />
        </TouchableOpacity>

        {/* ver resumen */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => openSummary(item)}
        >
          <IconSymbol name="play.fill" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mis Historias</Text>
          <Text style={styles.headerSubtitle}>Tus aventuras guardadas</Text>
          <TouchableOpacity
            style={[styles.clearAllBtn, { opacity: played.length ? 1 : 0.5 }]}
            disabled={!played.length || loading}
            onPress={confirmClearAll}
          >
            <IconSymbol name="trash" size={16} color="#fff" />
            <Text style={styles.clearAllText}>Borrar todo</Text>
          </TouchableOpacity>
        </View>

        {played.length > 0 ? (
          <FlatList
            data={played}
            renderItem={renderStoryItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={load}
          />
        ) : (
          <View style={styles.emptyState}>
            <IconSymbol name="book" size={80} color="#CCC" />
            <Text style={styles.emptyTitle}>No hay historias aún</Text>
            <Text style={styles.emptySubtitle}>
              Explora y escucha historias para verlas aquí
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#4ECDC4" },
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "#4ECDC4",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center", // centra todo horizontalmente
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 12, // espacio antes del botón
  },
  clearAllBtn: {
    backgroundColor: "rgba(255, 107, 107, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  clearAllText: { color: "#fff", fontWeight: "700" },

  listContainer: { padding: 20, paddingBottom: 100 },

  storyItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cover: {
    width: 72,
    borderRadius: 10,
    marginRight: 15,
    alignSelf: "stretch",
  },

  storyDetails: { flex: 1, justifyContent: "center" },
  storyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  lastPlayed: { fontSize: 12, color: "#666", marginBottom: 8 },

  summaryBox: {
    backgroundColor: "#F1FFF9",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 6,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 2,
  },
  summaryText: { fontSize: 12, color: "#2E7D32" },
  endingText: { fontSize: 12, color: "#555", marginBottom: 8 },

  progressContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
  },
  progressFill: { height: "100%", backgroundColor: "#4ECDC4", borderRadius: 2 },
  progressText: { fontSize: 12, color: "#666", minWidth: 35 },

  actions: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFECEC",
  },
  playButton: {
    backgroundColor: "#FF6B6B",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
});
