// app/story/player.tsx
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";

import StoryPlayer from "@/components/story/StoryPlayer";
import { storyRegistry } from "@/constants/";
import { ThemedText } from "@/components/ThemedText";

export default function PlayerScreen() {
  const params = useLocalSearchParams<{ story?: string; title?: string; image?: string }>();

  // Clave del grafo de historia (default a "forest" si no viene)
  const storyKey = (typeof params.story === "string" && params.story) || "forest";
  const story = storyRegistry[storyKey];

  if (!story) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ThemedText>No pudimos cargar la historia.</ThemedText>
        <ThemedText
          style={{ marginTop: 12, color: "#007AFF" }}
          onPress={() => router.back()}
        >
          Volver
        </ThemedText>
      </SafeAreaView>
    );
  }

  const meta = {
    storyKey,
    title: (typeof params.title === "string" && params.title) || "Historia",
    image: typeof params.image === "string" ? params.image : undefined,
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StoryPlayer
        story={story}
        startId="start"
        meta={meta} // ✅ se pasa título/imagen/clave para guardado
        onExit={() => router.replace("/(tabs)/myStories")}
        onFinish={(history) => {
          // opcional: logging o analytics
          console.log("Historia terminada:", history);
        }}
      />
    </SafeAreaView>
  );
}
