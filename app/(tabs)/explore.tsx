import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";

const { width } = Dimensions.get("window");

// Sample stories data
const stories = [
  {
    id: 1,
    title: "El León y el Ratón",
    image:
      "https://placehold.co/600x360/98FB98/FFFFFF?text=Tortuga+y+Liebre&font=montserrat&no_svg=1",
    duration: "3 min",
    category: "Fábulas",
  },
  {
    id: 2,
    title: "La Tortuga y la Liebre",
    image:
      "https://placehold.co/600x360/98FB98/FFFFFF?text=Tortuga+y+Liebre&font=montserrat",
    duration: "3 min",
    category: "Fábulas",
  },
  {
    id: 3,
    title: "Los Tres Cerditos",
    image:
      "https://placehold.co/600x360/FFE4B5/FFFFFF?text=Tres+Cerditos&font=montserrat",
    duration: "3 min",
    category: "Cuentos",
  },
  {
    id: 4,
    title: "Caperucita Roja",
    image:
      "https://placehold.co/600x360/FFA07A/FFFFFF?text=Caperucita+Roja&font=montserrat",
    duration: "3 min",
    category: "Cuentos",
  },
];

export default function Explore() {
  const renderStoryCard = ({ item }: { item: (typeof stories)[0] }) => (
    <TouchableOpacity style={styles.storyCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.storyImage}
          contentFit="cover"
          transition={200}
        />
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
        <TouchableOpacity style={styles.playButton}>
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

        <FlatList
          data={stories}
          renderItem={renderStoryCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
    backgroundColor: "#F0F0F0", // Color de fondo mientras carga
    overflow: "hidden", // Asegura que la imagen no sobresalga
  },
  storyImage: {
    width: "100%",
    height: "100%",
  },
  storyInfo: {
    padding: 20,
  },
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
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: "#666",
  },
  playButton: {
    backgroundColor: "#FF6B6B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 15,
    gap: 8,
  },
  playButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
