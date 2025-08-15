// app/story/player.tsx
import React, { useState, useEffect, useCallback } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";

import StoryPlayer from "@/components/story/StoryPlayer";
import { ThemedText } from "@/components/ThemedText";
import { useStories } from "@/hooks/useStories";
import type { StoryGraph, Choice } from "@/components/story/StoryPlayer";
import type { BackendStoryDetail } from "@/lib/apiService";

export default function PlayerScreen() {
  const params = useLocalSearchParams<{ storyId?: string; title?: string; image?: string }>();
  const { getStoryDetail } = useStories();
  
  const [storyDetail, setStoryDetail] = useState<BackendStoryDetail | null>(null);
  const [story, setStory] = useState<StoryGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ID de la historia del backend
  const storyId = params.storyId ? parseInt(params.storyId) : null;

  const loadStory = useCallback(async () => {
    try {
      if (!storyId) {
        setError("ID de historia no válido");
        return;
      }

      setLoading(true);
      setError(null);

      // Obtener detalles completos de la historia desde el backend
      const detail = await getStoryDetail(storyId);
      setStoryDetail(detail);

      // Validar que detail.graph existe
      if (!detail || !detail.graph || typeof detail.graph !== 'object') {
        throw new Error(`La respuesta del API no tiene el formato esperado`);
      }

      // Convertir el grafo del backend a formato StoryGraph
      const graph: StoryGraph = {};
      Object.values(detail.graph).forEach(node => {
        graph[node.id] = {
          id: node.id,
          content: node.content,
          choices: !node.choices || node.choices.length === 0 ? undefined : [
            { text: node.choices[0]?.text || "", nextId: node.choices[0]?.nextId || "" },
            { text: node.choices[1]?.text || "", nextId: node.choices[1]?.nextId || "" }
          ] as [Choice, Choice]
        };
      });

      setStory(graph);
    } catch (err) {
      console.error("Error loading story:", err);
      setError("No pudimos cargar la historia");
    } finally {
      setLoading(false);
    }
  }, [storyId]); // Removido getStoryDetail para evitar loops

  useEffect(() => {
    if (storyId) {
      loadStory();
    }
  }, [storyId, loadStory]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <ThemedText style={styles.loadingText}>Cargando historia...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !story) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error || "No pudimos cargar la historia."}</ThemedText>
          <ThemedText
            style={styles.backButton}
            onPress={() => router.back()}
          >
            Volver
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const meta = {
    storyId: storyId!,
    title: storyDetail?.title || (typeof params.title === "string" && params.title) || "Historia",
    image: storyDetail?.image || (typeof params.image === "string" ? params.image : undefined),
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StoryPlayer
        story={story}
        startId={storyDetail?.startNodeId || "start"}
        meta={meta}
        storyId={storyId!}
        onExit={() => router.replace("/(tabs)/myStories")}
        onFinish={(history) => {
          console.log("Historia terminada:", history);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: "#FF6B6B",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});
