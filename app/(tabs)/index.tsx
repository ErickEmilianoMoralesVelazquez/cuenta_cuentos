import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const featuredStory = {
    id: 1,
    title: "El León y el Ratón",
    image: "https://i.imgur.com/umenVQ5.png",
    description: "Una historia sobre la amistad y la ayuda mutua",
    storyKey: "leon_raton",
  };

  const goPlay = (storyKey: string) => {
    router.push({ pathname: "/story/player", params: { story: storyKey } });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      
        <View style={styles.header}>
          <Text style={styles.greeting}>¡Hola pequeño explorador! 👋</Text>
          <Text style={styles.subtitle}>¿Listo para una nueva aventura?</Text>
        </View>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.featuredCard}>
          <Text style={styles.featuredTitle}>Historia Destacada</Text>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: featuredStory.image }}
              style={styles.featuredImage}
              contentFit="cover"
              transition={200}
              placeholder="Cargando..."
            />
          </View>
          <Text style={styles.storyTitle}>{featuredStory.title}</Text>
          <Text style={styles.storyDescription}>
            {featuredStory.description}
          </Text>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() =>
              router.push({
                pathname: "/story/player",
                params: {
                  story: featuredStory.storyKey,
                  title: featuredStory.title,
                  image: featuredStory.image,
                },
              })
            }
          >
            <IconSymbol name="play.circle.fill" size={24} color="#FFFFFF" />
            <Text style={styles.startButtonText}>¡Comenzar!</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickActions}>
          <Link href="/(tabs)/explore" asChild>
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol name="safari" size={32} color="#4ECDC4" />
              <Text style={styles.actionText}>Explorar</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/(tabs)/myStories" asChild>
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol name="book" size={32} color="#FF6B6B" />
              <Text style={styles.actionText}>Mis Historias</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4ECDC4",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#4ECDC4",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    opacity: 0.9,
  },
  featuredCard: {
    margin: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  imageContainer: {
    width: width - 80,
    height: (width - 80) * 0.6, // Proporción 5:3 para una mejor vista
    borderRadius: 15,
    marginBottom: 15,
    backgroundColor: "#F0F0F0", // Color de fondo mientras carga
    overflow: "hidden", // Asegura que la imagen no sobresalga del contenedor
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  storyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  storyDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: "#FF6B6B",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    gap: 8,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    width: (width - 60) / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
  },
});
