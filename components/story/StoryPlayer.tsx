import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { addPlayedStory } from "@/lib/playedStories"; // ✅ guardar resumen
import { IconSymbol } from "../ui/IconSymbol.ios";
import { SafeAreaView } from "react-native-safe-area-context";


export type Choice = { text: string; nextId: string };
export type StoryNode = {
  id: string;
  content: string;
  choices?: [Choice, Choice];
};
export type StoryGraph = Record<string, StoryNode>;

type Meta = { storyKey: string; title: string; image?: string };

type Props = {
  story: StoryGraph;
  startId: string;
  typingSpeedMs?: number;
  onFinish?: (history: { nodeId: string; choiceIndex?: 0 | 1 }[]) => void;
  onExit?: () => void;
  meta?: Meta; // ✅ info para guardar en el resumen
};

export default function StoryPlayer({
  story,
  startId,
  typingSpeedMs = 18,
  onFinish,
  onExit,
  meta,
}: Props) {
  const [currentId, setCurrentId] = useState(startId);
  const [typed, setTyped] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [finished, setFinished] = useState(false);

  // ✅ guardamos también el texto de la elección
  const [history, setHistory] = useState<
    { nodeId: string; choiceIndex?: 0 | 1; choiceText?: string }[]
  >([]);

  const node = story[currentId];
  const scrollRef = useRef<ScrollView>(null);

  // tipeo robusto con slice (evita "undefined")
  useEffect(() => {
    let cancelled = false;
    setTyped("");
    setIsTyping(true);
    setFinished(false);

    const text = String(node.content ?? "");
    let i = 0;

    const tick = () => {
      if (cancelled) return;
      if (i < text.length) {
        setTyped(text.slice(0, i + 1));
        i++;
        setTimeout(tick, typingSpeedMs);
      } else {
        setTyped(text);
        setIsTyping(false);
      }
    };

    setTimeout(tick, typingSpeedMs);
    return () => {
      cancelled = true;
    };
  }, [currentId, node.content, typingSpeedMs]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [typed, isTyping]);

  const hasChoices = useMemo(() => !!node.choices, [node]);

  const handleSkip = () => {
    const text = String(node.content ?? "");
    setTyped(text);
    setIsTyping(false);
  };

  // ✅ registra la elección con su texto
  const pick = (idx: 0 | 1) => {
    if (!node.choices) return;
    const c = node.choices[idx];
    setHistory((h) => [
      ...h,
      { nodeId: currentId, choiceIndex: idx, choiceText: c.text },
    ]);
    setCurrentId(c.nextId);
  };

  // ✅ al terminar, guarda resumen y llama onFinish una sola vez
  useEffect(() => {
    if (!node.choices && !isTyping && !finished) {
      setFinished(true);

      const decisions = history
        .filter((h) => typeof h.choiceIndex !== "undefined")
        .map((h) => h.choiceText || "");

      const payload = {
        id: String(Date.now()),
        storyKey: meta?.storyKey ?? "unknown",
        title: meta?.title ?? "Historia",
        image: meta?.image,
        finishedAtISO: new Date().toISOString(),
        progress: 100,
        decisions,
        endingId: currentId,
        endingText: String(node.content ?? ""),
      };

      addPlayedStory(payload).catch(() => {
        /* noop */
      });

      onFinish?.([...history, { nodeId: currentId }]);
    }
  }, [node.choices, isTyping, finished, history, currentId, onFinish, meta]);

  return (
    <ExpoLinearGradient
      colors={["#f3f3f3", "#f3f3f3"]}
      style={styles.background}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: 16,
          }}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <IconSymbol name="chevron.left" size={18} color="#007AFF" />
          <Text style={styles.link}>Volver</Text>
        </TouchableOpacity>

        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.paragraph}>{typed}</Text>
        </ScrollView>

        {isTyping ? (
          <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
            <Text style={styles.skipText}>Saltar ➡️</Text>
          </TouchableOpacity>
        ) : hasChoices ? (
          <View style={styles.choicesRow}>
            <TouchableOpacity
              style={[styles.choiceBtn, { backgroundColor: "#ff6f61" }]}
              onPress={() => pick(0)}
            >
              <Text style={styles.choiceText}>{node.choices![0].text}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.choiceBtn, { backgroundColor: "#E8D45A", alignItems: 'center', justifyContent: 'center' }]}
              onPress={() => pick(1)}
            >
              <Text style={styles.choiceText}>{node.choices![1].text}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.endNote}>
            <Text style={styles.endText}>🎉 Fin del cuento ✨</Text>
            <TouchableOpacity
              style={styles.exitBtn}
              onPress={() => (onExit ? onExit() : router.back())}
            >
              <Text style={styles.exitText}>Volver</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ExpoLinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  paragraph: {
    fontSize: 40,
    lineHeight: 50,
    color: "#333",
    fontWeight: "500",
    backgroundColor: "rgba(255, 255, 255, 0)",
    borderRadius: 16,
    padding: 16,
  },
  skipBtn: {
    alignSelf: "center",
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: "#ffcc00",
    elevation: 3,
  },
  skipText: { fontWeight: "bold", fontSize: 16, color: "#333" },
  choicesRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginTop: 16,
  },
  choiceBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    elevation: 4,
  },
  choiceText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
  endNote: { alignItems: "center", marginTop: 12, gap: 12 },
  endText: { fontSize: 18, fontWeight: "bold", color: "#444" },
  exitBtn: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  exitText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  link: { color: "#007AFF", fontWeight: "600" },
});
