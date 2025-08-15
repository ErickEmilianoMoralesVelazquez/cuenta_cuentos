import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { useStories, type UnifiedStory } from "@/hooks/useStories";

const { width } = Dimensions.get("window");

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

const pickColor = (key: string) => {
  const sum = [...(key || "x")].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return palette[Math.abs(sum) % palette.length];
};

export default function Explore() {
  const { stories, loading, error, retryFetch } = useStories();

  const goPlay = (storyId: number) => {
    router.push({ pathname: "/story/player", params: { storyId: storyId.toString() } });
  };

  const renderStoryCard = ({ item }: { item: UnifiedStory }) => (
  <TouchableOpacity
    style={styles.storyCard}
    onPress={() => goPlay(item.id)}
  >
    <View
      style={[
        styles.imageContainer,
        !item.image && { backgroundColor: pickColor(item.title) }
      ]}
    >
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.storyImage}
          contentFit="cover"
          transition={200}
        />
      ) : null}
    </View>

    <View style={styles.storyInfo}>
      <ThemedText style={styles.storyTitle}>{item.title}</ThemedText>
      <View style={styles.storyMeta}>
        <View style={styles.metaItem}>
          <IconSymbol name="clock" size={16} color="#666" />
          <Text style={styles.metaText}>{item.duration}</Text>
        </View>
        <View style={styles.metaItem}>
          <IconSymbol name="bookmark" size={16} color="#666" />
          <Text style={styles.metaText}>{item.category}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.playButton}
        onPress={() =>
          router.push({
            pathname: "/story/player",
            params: {
              storyId: item.id.toString(),
              title: item.title,
              image: item.image,
            },
          })
        }
      >
        <IconSymbol name="play.fill" size={20} color="#FFFFFF" />
        <Text style={styles.playButtonText}>Iniciar</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Explora Historias</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Descubre nuevas aventuras
          </ThemedText>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4ECDC4" />
            <Text style={styles.loadingText}>Cargando historias...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <IconSymbol name="exclamationmark.triangle" size={48} color="#FF6B6B" />
            <Text style={styles.errorText}>Error al cargar historias</Text>
            <Text style={styles.errorSubtext}>Mostrando contenido local</Text>
            <TouchableOpacity style={styles.retryButton} onPress={retryFetch}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={stories}
            renderItem={renderStoryCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={retryFetch}
                colors={["#4ECDC4"]}
                tintColor="#4ECDC4"
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#4ECDC4" },
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    padding: 20,
    backgroundColor: "#4ECDC4",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: { fontSize: 16, color: "#FFFFFF", opacity: 0.9 },
  listContainer: { padding: 20, paddingBottom: 100 },
  storyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#F0F0F0",
    overflow: "hidden",
  },
  storyImage: { width: "100%", height: "100%" },
  storyInfo: { padding: 20 },
  storyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  storyMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 14, color: "#666" },
  playButton: {
    backgroundColor: "#FF6B6B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 15,
    gap: 8,
  },
  playButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
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
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    marginTop: 15,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
