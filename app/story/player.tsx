import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import StoryPlayer from "@/components/story/StoryPlayer";
import { useLocalSearchParams, router } from "expo-router";
import { storyRegistry } from "@/constants/";

export default function PlayerScreen() {
  const params = useLocalSearchParams<{ story?: string }>();
  const key = params.story ?? "forest";
  const story = storyRegistry[key];

  if (!story) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }} />
    );
  }

  return (
    // Ojo: StoryPlayer ya pinta su propio fondo con gradiente
    <SafeAreaView style={{ flex: 1 }}>
      <StoryPlayer
        story={story}
        startId="start"
        onFinish={(history) => {
            console.log("Historia terminada:", history);
        }}
        onExit={() => router.replace("/(tabs)/explore")} // 👈 aquí el “Volver”
      />
    </SafeAreaView>
  );
}
