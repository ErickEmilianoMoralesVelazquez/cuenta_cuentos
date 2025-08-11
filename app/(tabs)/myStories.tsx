import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from "@/components/ui/IconSymbol"

// Sample played stories data
const playedStories = [
  {
    id: 1,
    title: "El León y el Ratón",
    image: "https://via.placeholder.com/80x80/FFB6C1/FFFFFF?text=León",
    lastPlayed: "Ayer",
    progress: 100,
    isFavorite: true,
  },
  {
    id: 2,
    title: "Los Tres Cerditos",
    image: "https://via.placeholder.com/80x80/FFE4B5/FFFFFF?text=Cerditos",
    lastPlayed: "Hace 2 días",
    progress: 75,
    isFavorite: false,
  },
  {
    id: 3,
    title: "La Tortuga y la Liebre",
    image: "https://via.placeholder.com/80x80/98FB98/FFFFFF?text=Tortuga",
    lastPlayed: "Hace 1 semana",
    progress: 50,
    isFavorite: true,
  },
]

export default function MyStories() {
  const renderStoryItem = ({ item }: { item: (typeof playedStories)[0] }) => (
    <TouchableOpacity style={styles.storyItem}>
      <Image source={{ uri: item.image }} style={styles.storyImage} />

      <View style={styles.storyDetails}>
        <Text style={styles.storyTitle}>{item.title}</Text>
        <Text style={styles.lastPlayed}>Última vez: {item.lastPlayed}</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{item.progress}%</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.favoriteButton}>
          <IconSymbol
            name={item.isFavorite ? "heart.fill" : "heart"}
            size={24}
            color={item.isFavorite ? "#FF6B6B" : "#999"}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.playButton}>
          <IconSymbol name="play.fill" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mis Historias</Text>
          <Text style={styles.headerSubtitle}>Tus aventuras guardadas</Text>
        </View>

        {playedStories.length > 0 ? (
          <FlatList
            data={playedStories}
            renderItem={renderStoryItem}
            keyExtractor={(item) => item.id.toString()}
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
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4ECDC4", // Mismo color del header para continuidad
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 20,
    backgroundColor: "#4ECDC4",
    alignItems: "center",
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
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100, // Espacio extra para evitar que el último elemento se corte con la tab bar
  },
  storyItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  storyDetails: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  lastPlayed: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4ECDC4",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    minWidth: 35,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  favoriteButton: {
    padding: 8,
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
})