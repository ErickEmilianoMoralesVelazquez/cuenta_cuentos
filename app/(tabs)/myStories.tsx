// app/(tabs)/myStories.tsx
import { IconSymbol } from "@/components/ui/IconSymbol";
import { apiService, type UserSessionsResponse } from "@/lib/apiService";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';

import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.locale("es");

type UserSession = UserSessionsResponse['sessions'][0];

const { height } = Dimensions.get('window');

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

const gradientPalette = [
  ["#FF6B6B", "#FF8E53"],
  ["#4ECDC4", "#44A08D"],
  ["#45B7D1", "#96C93D"],
  ["#F093FB", "#F5576C"],
  ["#4FACFE", "#00F2FE"],
  ["#43E97B", "#38F9D7"],
  ["#FA709A", "#FEE140"],
  ["#A8EDEA", "#FED6E3"],
];

const pickColor = (item: UserSession) => {
  const key = item.story.title || "x";
  const sum = [...key].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return palette[Math.abs(sum) % palette.length];
};

const pickGradient = (item: UserSession) => {
  const key = item.story.title || "x";
  const sum = [...key].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return gradientPalette[Math.abs(sum) % gradientPalette.length];
};

export default function MyStories() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Obteniendo historial de sesiones...');
      const response = await apiService.getUserSessions();
      console.log('✅ Sesiones obtenidas:', response.sessions.length);
      setSessions(response.sessions);
    } catch (err: any) {
      console.error('❌ Error obteniendo sesiones:', err);
      if (err.message?.includes('no implementado')) {
        setError('El historial de sesiones no está disponible en el backend');
      } else if (err.message?.includes('No estás autenticado')) {
        setError('Necesitas iniciar sesión para ver tu historial');
      } else {
        setError('Error al cargar el historial. Verifica que las rutas del backend estén ordenadas correctamente.');
      }
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const slideAnim = useState(new Animated.Value(height))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  const showSessionDetails = (item: UserSession) => {
    setSelectedSession(item);
    setShowDetails(true);
    
    // Animación de entrada espectacular
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideSessionDetails = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: height,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowDetails(false);
      setSelectedSession(null);
    });
  };

  const continueStory = (session: UserSession) => {
    hideSessionDetails();
    setTimeout(() => {
      // Navegar al player con información de sesión para continuar
      router.push({ 
        pathname: "/story/player", 
        params: { 
          storyId: session.story.id.toString(),
          title: session.story.title,
          image: session.story.image,
          sessionId: session.id.toString(), // Agregar sessionId para continuar
          continueSession: 'true'
        } 
      });
    }, 300);
  };

  const playStoryAgain = (session: UserSession) => {
    hideSessionDetails();
    setTimeout(() => {
      // Navegar al player para empezar una nueva sesión
      router.push({ 
        pathname: "/story/player", 
        params: { 
          storyId: session.story.id.toString(),
          title: session.story.title,
          image: session.story.image
        } 
      });
    }, 300);
  };


  const renderStoryItem = ({ item }: { item: UserSession }) => (
    <TouchableOpacity
      style={styles.storyItem}
      onPress={() => showSessionDetails(item)}
    >
      <View style={[styles.cover, { backgroundColor: pickColor(item) }]} />

      <View style={styles.storyDetails}>
        <Text style={styles.storyTitle}>{item.story.title}</Text>
        <Text style={styles.lastPlayed}>
          Última vez: {dayjs(item.createdAt).fromNow()}
        </Text>

        <Text style={styles.statusText}>
          Estado: {item.status === 'finished' ? 'Completada' : 'En progreso'}
        </Text>

        {!!item.choices.length && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Decisiones tomadas: {item.choices.length}</Text>
            <Text style={styles.summaryText}>
              {item.choices.slice(0, 2).map((choice, i) => `${i + 1}. ${choice.choice_text}`).join("  •  ")}
              {item.choices.length > 2 && `... (+${item.choices.length - 2} más)`}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {/* ver detalles */}
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => showSessionDetails(item)}
        >
          <IconSymbol name="info.circle" size={20} color="#4ECDC4" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Historial</Text>
          <Text style={styles.headerSubtitle}>Tus sesiones de historias</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4ECDC4" />
            <Text style={styles.loadingText}>Cargando historial...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <IconSymbol name="exclamationmark.triangle" size={48} color="#FF6B6B" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={load}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : sessions.length > 0 ? (
          <FlatList
            data={sessions}
            renderItem={renderStoryItem}
            keyExtractor={(item) => item.id.toString()}
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
              Comienza a jugar historias para ver tu historial aquí
            </Text>
          </View>
        )}

        {/* Modal espectacular de detalles de sesión */}
        {showDetails && selectedSession && (
          <Animated.View 
            style={[
              styles.modalOverlay,
              {
                opacity: fadeAnim,
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.modalBackdrop} 
              onPress={hideSessionDetails}
              activeOpacity={1}
            />
            
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              <LinearGradient
                colors={pickGradient(selectedSession)}
                style={styles.modalHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.modalHeaderContent}>
                  <Text style={styles.modalTitle}>{selectedSession.story.title}</Text>
                  <TouchableOpacity onPress={hideSessionDetails} style={styles.closeButton}>
                    <IconSymbol name="xmark" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.statusContainer}>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: selectedSession.status === 'finished' ? '#4ECDC4' : '#FF8E53' }
                  ]}>
                    <Text style={styles.modalStatusText}>
                      {selectedSession.status === 'finished' ? '✅ Completada' : '⏳ En progreso'}
                    </Text>
                  </View>
                  <Text style={styles.dateText}>
                    {dayjs(selectedSession.createdAt).format('DD/MM/YYYY HH:mm')}
                  </Text>
                </View>
              </LinearGradient>

              <ScrollView 
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollContent}
              >
                <Text style={styles.sectionTitle}>🎯 Tu Aventura</Text>
                <Text style={styles.choicesCount}>
                  Tomaste {selectedSession.choices.length} decisiones en esta historia
                </Text>

                {selectedSession.choices.length > 0 && (
                  <View style={styles.choicesContainer}>
                    <Text style={styles.sectionTitle}>📝 Decisiones Tomadas</Text>
                    {selectedSession.choices.map((choice, index) => (
                      <View key={index} style={styles.choiceItem}>
                        <View style={styles.choiceNumber}>
                          <Text style={styles.choiceNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.choiceText}>&ldquo;{choice.choice_text}&rdquo;</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.actionButtons}>
                  {selectedSession.status === 'in_progress' ? (
                    // Botón para continuar historia en progreso
                    <TouchableOpacity
                      style={styles.continueButton}
                      onPress={() => continueStory(selectedSession)}
                    >
                      <LinearGradient
                        colors={['#4ECDC4', '#44A08D']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <IconSymbol name="play.fill" size={24} color="#FFFFFF" />
                        <Text style={styles.buttonText}>Continuar Historia</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : (
                    // Botón para jugar de nuevo historia completada
                    <TouchableOpacity
                      style={styles.playAgainButton}
                      onPress={() => playStoryAgain(selectedSession)}
                    >
                      <LinearGradient
                        colors={pickGradient(selectedSession)}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <IconSymbol name="arrow.clockwise" size={24} color="#FFFFFF" />
                        <Text style={styles.buttonText}>Jugar de Nuevo</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            </Animated.View>
          </Animated.View>
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
  lastPlayed: { fontSize: 12, color: "#666", marginBottom: 4 },
  statusText: { fontSize: 12, color: "#4ECDC4", marginBottom: 8, fontWeight: "600" },
  modalStatusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

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

  actions: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
  },
  detailsButton: {
    backgroundColor: "#F0F9FF",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#4ECDC4",
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
    fontWeight: "600",
    marginTop: 10,
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

  // Estilos del modal espectacular
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: height * 0.85,
    minHeight: height * 0.6,
    overflow: 'hidden',
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  dateText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  modalBody: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  choicesCount: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  choicesContainer: {
    marginBottom: 20,
  },
  choiceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  choiceNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 2,
  },
  choiceNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  choiceText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  moreChoices: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },

  // Estilos para los botones de acción
  actionButtons: {
    marginTop: 30,
  },
  continueButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  playAgainButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    gap: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
