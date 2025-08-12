// app/(tabs)/myStories.tsx
import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useFocusEffect } from "@react-navigation/native"; // ✅ import correcto
import { getPlayedStories, PlayedStory } from "@/lib/playedStories";
import { router } from "expo-router";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
dayjs.extend(relativeTime);
dayjs.locale("es");

export default function MyStories() {
  const [played, setPlayed] = useState<PlayedStory[]>([]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        const data = await getPlayedStories();
        if (mounted) setPlayed(data);
      })();
      return () => { mounted = false; };
    }, [])
  );

  const openStory = (item: PlayedStory) => {
    router.push({
      pathname: "/story/player",
      params: { story: item.storyKey, title: item.title, image: item.image },
    });
  };

  const renderStoryItem = ({ item }: { item: PlayedStory }) => (
    <TouchableOpacity style={styles.storyItem} onPress={() => openStory(item)}>
      <Image source={{ uri: item.image || "https://placehold.co/80x80" }} style={styles.storyImage} />
      <View style={styles.storyDetails}>
        <Text style={styles.storyTitle}>{item.title}</Text>
        <Text style={styles.lastPlayed}>Última vez: {dayjs(item.finishedAtISO).fromNow()}</Text>

        {item.decisions.length ? (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Tus decisiones</Text>
            <Text style={styles.summaryText}>
              {item.decisions.map((d, i) => `${i + 1}. ${d}`).join("  •  ")}
            </Text>
          </View>
        ) : null}

        <Text numberOfLines={2} style={styles.endingText}>
          Final: {item.endingText}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{item.progress}%</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.favoriteButton}>
          <IconSymbol name="heart" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton} onPress={() => openStory(item)}>
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
        </View>

        {played.length > 0 ? (
          <FlatList
            data={played}
            renderItem={renderStoryItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <IconSymbol name="book" size={80} color="#CCC" />
            <Text style={styles.emptyTitle}>No hay historias aún</Text>
            <Text style={styles.emptySubtitle}>Explora y escucha historias para verlas aquí</Text>
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
    padding: 20, backgroundColor: "#4ECDC4", alignItems: "center",
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF", marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: "#FFFFFF", opacity: 0.9 },
  listContainer: { padding: 20, paddingBottom: 100 },

  storyItem: {
    backgroundColor: "#FFFFFF", borderRadius: 15, padding: 15, marginBottom: 15,
    flexDirection: "row", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  storyImage: { width: 60, height: 60, borderRadius: 10, marginRight: 15 },
  storyDetails: { flex: 1 },
  storyTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 4 },
  lastPlayed: { fontSize: 12, color: "#666", marginBottom: 8 },

  summaryBox: {
    backgroundColor: "#F1FFF9",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 6,
  },
  summaryTitle: { fontSize: 12, fontWeight: "700", color: "#2E7D32", marginBottom: 2 },
  summaryText: { fontSize: 12, color: "#2E7D32" },
  endingText: { fontSize: 12, color: "#555", marginBottom: 8 },

  progressContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  progressBar: { flex: 1, height: 4, backgroundColor: "#E0E0E0", borderRadius: 2 },
  progressFill: { height: "100%", backgroundColor: "#4ECDC4", borderRadius: 2 },
  progressText: { fontSize: 12, color: "#666", minWidth: 35 },

  actions: { flexDirection: "row", alignItems: "center", gap: 10 },
  favoriteButton: { padding: 8 },
  playButton: {
    backgroundColor: "#FF6B6B", width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
  },

  // ✅ estilos faltantes
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
